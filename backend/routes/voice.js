const express = require('express');
const router = express.Router();
const multer = require('multer');
const voiceAgentService = require('../services/voiceAgentService');
const aiSearchService = require('../services/aiSearchService');
const { validateTextToSpeech, validateVoiceCommand } = require('../middleware/validation');

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept audio files
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

/**
 * @route   GET /api/voice/health
 * @desc    Check voice agent health
 * @access  Public
 */
router.get('/health', async (req, res) => {
  try {
    const healthResult = await voiceAgentService.healthCheck();
    
    res.json({
      success: true,
      data: healthResult
    });

  } catch (error) {
    console.error('Voice health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check voice agent health',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/chat
 * @desc    Generate AI response using OpenAI with markdown formatting
 * @access  Public
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Initialize AI service
    const aiService = new aiSearchService();
    const openai = aiService.getOpenAIClient();

    // Build conversation context
    const messages = [
      {
        role: 'system',
        content: `You are an expert AI Travel Assistant for a travel booking platform. Your responses should be:

**Response Format:**
- Use markdown formatting for better readability
- Include relevant emojis for visual appeal
- Structure information with headers, lists, and emphasis
- Be helpful, friendly, and professional

**Core Services:**
- ✈️ Flight booking and search
- 🏨 Hotel reservations and recommendations  
- 🎯 Travel planning and itinerary assistance
- 💰 Best deals and price comparisons
- 🛡️ Travel insurance options
- 📞 24/7 customer support

**Guidelines:**
- Provide actionable travel advice
- Include specific steps when helping with bookings
- Suggest relevant features of the platform
- Ask clarifying questions when needed
- Format responses with markdown for clarity
- Always be encouraging and helpful

Format your responses with proper markdown including:
- **Bold** for emphasis
- *Italics* for highlights
- • Bullet points for lists
- ## Headers for sections
- \`code\` for specific terms
- > Blockquotes for important tips`
      },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      {
        role: 'user',
        content: message.trim()
      }
    ];

    // Generate AI response
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4',
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
      presence_penalty: 0.2,
      frequency_penalty: 0.1
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response generated from OpenAI');
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        model: completion.model,
        usage: completion.usage
      }
    });

  } catch (error) {
    console.error('OpenAI chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/text-to-speech
 * @desc    Convert text to speech using Hugging Face Voice Agent
 * @access  Public
 */
router.post('/text-to-speech', validateTextToSpeech, async (req, res) => {
  try {
    const { text } = req.body;

    const result = await voiceAgentService.textToSpeech(text);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Text-to-speech conversion failed'
      });
    }

    // Set appropriate headers for audio response
    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.audioBuffer.length,
      'Content-Disposition': 'attachment; filename="speech.mp3"'
    });

    res.send(result.audioBuffer);

  } catch (error) {
    console.error('Text-to-speech error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert text to speech',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/speech-to-text
 * @desc    Convert speech to text using Hugging Face Voice Agent
 * @access  Public
 */
router.post('/speech-to-text', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    const result = await voiceAgentService.speechToText(req.file.buffer);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Speech-to-text error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to convert speech to text',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/voice/voices
 * @desc    Get available voices from ElevenLabs
 * @access  Public
 */
router.get('/voices', async (req, res) => {
  try {
    if (!elevenLabsApiKey) {
      return res.status(500).json({
        success: false,
        message: 'ElevenLabs API key not configured'
      });
    }

    const response = await fetch(`${elevenLabsApiUrl}/voices`, {
      headers: {
        'xi-api-key': elevenLabsApiKey
      }
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const voicesData = await response.json();

    res.json({
      success: true,
      data: voicesData
    });

  } catch (error) {
    console.error('Get voices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voices',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/voice-command
 * @desc    Process voice command for travel booking
 * @access  Public
 */
router.post('/voice-command', async (req, res) => {
  try {
    const { command, context = {} } = req.body;

    if (!command) {
      return res.status(400).json({
        success: false,
        message: 'Voice command is required'
      });
    }

    // Process natural language command
    const processedCommand = await processVoiceCommand(command, context);

    res.json({
      success: true,
      data: processedCommand
    });

  } catch (error) {
    console.error('Voice command error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/conversation
 * @desc    Handle conversational voice interaction
 * @access  Public
 */
router.post('/conversation', async (req, res) => {
  try {
    const { message, sessionId, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    // Process conversation
    const response = await handleVoiceConversation(message, sessionId, context);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Voice conversation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process conversation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to process voice commands
async function processVoiceCommand(command, context) {
  // Intent classification
  const intent = classifyIntent(command);
  
  // Extract entities
  const entities = extractEntities(command);

  // Generate response based on intent
  let response = {
    intent: intent,
    entities: entities,
    action: null,
    reply: null
  };

  switch (intent) {
    case 'book_flight':
      response.action = 'search_flights';
      response.reply = `I'll help you book a flight. I found that you want to travel from ${entities.origin || 'your location'} to ${entities.destination || 'your destination'}.`;
      break;
    
    case 'book_hotel':
      response.action = 'search_hotels';
      response.reply = `I'll help you find a hotel in ${entities.location || 'your destination'}.`;
      break;
    
    case 'get_weather':
      response.action = 'get_weather';
      response.reply = `Let me check the weather for ${entities.location || 'your location'}.`;
      break;
    
    case 'cancel_booking':
      response.action = 'cancel_booking';
      response.reply = `I'll help you cancel your booking.`;
      break;
    
    default:
      response.action = 'clarify';
      response.reply = `I'm not sure what you want to do. Could you please clarify?`;
  }

  return response;
}

// Helper function to classify intent
function classifyIntent(command) {
  const lowerCommand = command.toLowerCase();
  
  if (lowerCommand.includes('book') && (lowerCommand.includes('flight') || lowerCommand.includes('plane'))) {
    return 'book_flight';
  }
  
  if (lowerCommand.includes('book') && lowerCommand.includes('hotel')) {
    return 'book_hotel';
  }
  
  if (lowerCommand.includes('weather')) {
    return 'get_weather';
  }
  
  if (lowerCommand.includes('cancel')) {
    return 'cancel_booking';
  }
  
  return 'unknown';
}

// Helper function to extract entities
function extractEntities(command) {
  const entities = {};
  
  // Simple regex patterns for entity extraction
  const cityPattern = /(?:from|to|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/gi;
  const datePattern = /(?:on|for|next)\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|week|month|\d{1,2}\/\d{1,2}\/?\d{0,4})/gi;
  
  const cityMatches = [...command.matchAll(cityPattern)];
  const dateMatches = [...command.matchAll(datePattern)];
  
  if (cityMatches.length > 0) {
    entities.origin = cityMatches[0] ? cityMatches[0][1] : null;
    entities.destination = cityMatches[1] ? cityMatches[1][1] : null;
    entities.location = cityMatches[0][1];
  }
  
  if (dateMatches.length > 0) {
    entities.date = dateMatches[0][1];
  }
  
  return entities;
}

// Helper function to handle conversation
async function handleVoiceConversation(message, sessionId, context) {
  // In production, this would integrate with conversational AI
  // For now, return a structured response
  
  return {
    reply: "I understand you want to make a travel booking. How can I help you today?",
    suggestions: [
      "Book a flight",
      "Find hotels",
      "Check weather",
      "View my bookings"
    ],
    sessionId: sessionId || generateSessionId(),
    context: {
      ...context,
      lastMessage: message,
      timestamp: new Date().toISOString()
    }
  };
}

/**
 * @route   POST /api/voice/voice-command
 * @desc    Process voice command with AI understanding
 * @access  Public
 */
router.post('/voice-command', validateVoiceCommand, async (req, res) => {
  try {
    const { command, context = {} } = req.body;

    const result = await voiceAgentService.processVoiceCommand(command, context);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Voice command processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice command',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/complete-interaction
 * @desc    Complete voice interaction workflow (STT + Processing + TTS)
 * @access  Public
 */
router.post('/complete-interaction', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    const context = req.body.context ? JSON.parse(req.body.context) : {};
    
    const result = await voiceAgentService.completeVoiceInteraction(req.file.buffer, context);

    // Return JSON response with base64 encoded audio
    res.json({
      success: true,
      data: {
        ...result.interaction,
        responseAudio: result.interaction.responseAudio.toString('base64'),
        actions: result.actions
      }
    });

  } catch (error) {
    console.error('Complete voice interaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete voice interaction',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/voice-to-booking
 * @desc    Voice-driven booking workflow
 * @access  Public
 */
router.post('/voice-to-booking', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Audio file is required'
      });
    }

    const context = req.body.context ? JSON.parse(req.body.context) : {};
    
    // Step 1: Process voice input
    const voiceResult = await voiceAgentService.completeVoiceInteraction(req.file.buffer, context);
    
    // Step 2: Check if it's a booking intent
    const intent = voiceResult.interaction.intent;
    
    if (!intent || !intent.includes('book')) {
      return res.json({
        success: true,
        data: {
          ...voiceResult.interaction,
          responseAudio: voiceResult.interaction.responseAudio.toString('base64'),
          needsBookingConfirmation: false,
          suggestedActions: ['clarify_intent', 'provide_more_details']
        }
      });
    }

    // Step 3: Extract booking details and proceed with search
    const bookingEntities = voiceResult.interaction.entities;
    
    // Import booking service
    const instantBookingService = require('../services/instantBookingService');
    
    let searchResults = null;
    if (intent.includes('flight')) {
      searchResults = await instantBookingService.searchFlights({
        origin: bookingEntities.origin,
        destination: bookingEntities.destination,
        departureDate: bookingEntities.departureDate,
        passengers: bookingEntities.passengers || 1
      });
    } else if (intent.includes('hotel')) {
      searchResults = await instantBookingService.searchHotels({
        location: bookingEntities.location,
        checkIn: bookingEntities.checkIn,
        checkOut: bookingEntities.checkOut,
        guests: bookingEntities.guests || 1
      });
    }

    res.json({
      success: true,
      data: {
        ...voiceResult.interaction,
        responseAudio: voiceResult.interaction.responseAudio.toString('base64'),
        bookingIntent: intent,
        extractedDetails: bookingEntities,
        searchResults: searchResults,
        needsBookingConfirmation: true,
        actions: voiceResult.actions
      }
    });

  } catch (error) {
    console.error('Voice-to-booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice booking request',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/voice/status
 * @desc    Get voice agent status and capabilities
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = await voiceAgentService.getAgentStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Voice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get voice agent status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/voice/test-tts
 * @desc    Test TTS with sample text
 * @access  Public
 */
router.post('/test-tts', async (req, res) => {
  try {
    const testText = req.body.text || 'Hello! This is a test of the voice agent text-to-speech functionality.';
    
    const result = await voiceAgentService.textToSpeech(testText);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'TTS test failed'
      });
    }

    res.set({
      'Content-Type': result.contentType,
      'Content-Length': result.audioBuffer.length,
      'Content-Disposition': 'attachment; filename="test-speech.mp3"'
    });

    res.send(result.audioBuffer);

  } catch (error) {
    console.error('TTS test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test TTS',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to generate session ID
function generateSessionId() {
  return 'voice_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

module.exports = router;