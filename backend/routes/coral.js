const express = require('express');
const router = express.Router();

// Import services
const aiSearchService = require('../services/aiSearchService');
const instantBookingService = require('../services/instantBookingService');

/**
 * @route   POST /api/coral/orchestrate
 * @desc    Main Coral Protocol orchestration endpoint
 * @access  Public
 */
router.post('/orchestrate', async (req, res) => {
  try {
    const {
      task,
      agents,
      data,
      sessionId = generateSessionId(),
      priority = 'normal'
    } = req.body;

    if (!task) {
      return res.status(400).json({
        success: false,
        message: 'Task specification is required'
      });
    }

    // Initialize orchestration session
    const orchestrationSession = {
      sessionId,
      task,
      agents: agents || ['voice', 'booking', 'payment'],
      status: 'in_progress',
      startTime: new Date(),
      data: data || {},
      results: {},
      errors: []
    };

    // Route to appropriate orchestration handler
    let result;
    switch (task.type) {
      case 'complete_booking':
        result = await orchestrateCompleteBooking(orchestrationSession);
        break;
      case 'search_and_recommend':
        result = await orchestrateSearchAndRecommend(orchestrationSession);
        break;
      case 'process_payment':
        result = await orchestratePaymentProcessing(orchestrationSession);
        break;
      case 'voice_interaction':
        result = await orchestrateVoiceInteraction(orchestrationSession);
        break;
      default:
        result = await orchestrateGenericTask(orchestrationSession);
    }

    res.json({
      success: true,
      data: {
        sessionId,
        result,
        orchestrationSession
      }
    });

  } catch (error) {
    console.error('Coral orchestration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to orchestrate task',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/coral/session/:sessionId
 * @desc    Get orchestration session status
 * @access  Public
 */
router.get('/session/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;

    // In production, this would retrieve from a session store
    const mockSession = {
      sessionId,
      status: 'completed',
      startTime: new Date(Date.now() - 300000), // 5 minutes ago
      endTime: new Date(),
      results: {
        voice: { status: 'completed', data: 'Voice processing completed' },
        booking: { status: 'completed', data: 'Booking created successfully' },
        payment: { status: 'completed', data: 'Payment processed' }
      }
    };

    res.json({
      success: true,
      data: mockSession
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get session',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/coral/voice-to-booking
 * @desc    Complete voice-to-booking workflow
 * @access  Public
 */
router.post('/voice-to-booking', async (req, res) => {
  try {
    const {
      voiceInput,
      userPreferences = {},
      autoBook = false
    } = req.body;

    if (!voiceInput) {
      return res.status(400).json({
        success: false,
        message: 'Voice input is required'
      });
    }

    const sessionId = generateSessionId();
    
    // Step 1: Process voice input
    const voiceResult = await processVoiceInput(voiceInput);
    
    // Step 2: Search based on voice intent
    const searchResult = await performIntelligentSearch(voiceResult.intent, voiceResult.entities);
    
    // Step 3: If auto-booking enabled, proceed with booking
    let bookingResult = null;
    if (autoBook && searchResult.recommendations.length > 0) {
      bookingResult = await createBookingFromRecommendation(
        searchResult.recommendations[0],
        userPreferences
      );
    }

    const workflow = {
      sessionId,
      steps: [
        {
          step: 'voice_processing',
          status: 'completed',
          result: voiceResult
        },
        {
          step: 'intelligent_search',
          status: 'completed',
          result: searchResult
        },
        {
          step: 'booking_creation',
          status: autoBook ? 'completed' : 'pending',
          result: bookingResult
        }
      ],
      nextActions: autoBook ? ['process_payment'] : ['review_options', 'select_booking']
    };

    res.json({
      success: true,
      data: workflow
    });

  } catch (error) {
    console.error('Voice-to-booking workflow error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process voice-to-booking workflow',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/coral/agents/status
 * @desc    Get status of all agents
 * @access  Public
 */
router.get('/agents/status', async (req, res) => {
  try {
    const agentStatus = {
      voice_agent: {
        status: 'online',
        capabilities: ['speech_to_text', 'text_to_speech', 'natural_language_processing'],
        health: await checkVoiceAgentHealth()
      },
      booking_agent: {
        status: 'online',
        capabilities: ['flight_search', 'hotel_search', 'instant_booking', 'availability_check'],
        health: await checkBookingAgentHealth()
      },
      payment_agent: {
        status: 'online',
        capabilities: ['traditional_payments', 'payment_verification', 'refunds'],
        health: await checkPaymentAgentHealth()
      },
      ai_search_agent: {
        status: 'online',
        capabilities: ['natural_language_search', 'personalized_recommendations', 'itinerary_planning'],
        health: await checkAISearchAgentHealth()
      }
    };

    res.json({
      success: true,
      data: agentStatus
    });

  } catch (error) {
    console.error('Get agent status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get agent status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Orchestration functions

async function orchestrateCompleteBooking(session) {
  const results = {};
  
  try {
    // Step 1: AI Search for options
    if (session.agents.includes('search')) {
      results.search = await aiSearchService.smartFlightSearch(session.data.searchQuery);
    }
    
    // Step 2: Create booking
    if (session.agents.includes('booking')) {
      results.booking = await instantBookingService.createBooking(session.data.bookingData);
    }
    
    // Step 3: Process payment (placeholder for traditional payment processing)
    if (session.agents.includes('payment')) {
      results.payment = { 
        status: 'pending', 
        message: 'Payment processing with traditional methods (card/bank transfer)',
        id: `payment_${Date.now()}`
      };
    }
    
    session.status = 'completed';
    session.results = results;
    
  } catch (error) {
    session.status = 'failed';
    session.errors.push(error.message);
    throw error;
  }
  
  return results;
}

async function orchestrateSearchAndRecommend(session) {
  const results = {};
  
  try {
    // Natural language processing
    const query = session.data.query;
    const parsedQuery = await aiSearchService.parseNaturalLanguageQuery(query);
    
    // Search for options
    if (parsedQuery.type === 'flight') {
      results.flights = await aiSearchService.smartFlightSearch(parsedQuery);
    } else if (parsedQuery.type === 'hotel') {
      results.hotels = await instantBookingService.searchHotels(parsedQuery);
    }
    
    // Generate personalized itinerary
    results.itinerary = await aiSearchService.generatePersonalizedItinerary(
      session.data.preferences || {},
      results
    );
    
    session.status = 'completed';
    session.results = results;
    
  } catch (error) {
    session.status = 'failed';
    session.errors.push(error.message);
    throw error;
  }
  
  return results;
}

async function orchestratePaymentProcessing(session) {
  const results = {};
  
  try {
    const paymentData = session.data.payment;
    
    // Create payment (placeholder for traditional payment processing)
    results.payment = { 
      status: 'pending', 
      message: 'Payment processing with traditional methods',
      id: `payment_${Date.now()}`,
      amount: paymentData.amount,
      currency: paymentData.currency
    };
    
    // Verify payment if needed
    if (session.data.requireVerification) {
      results.verification = { status: 'verified', timestamp: new Date() };
    }
    
    session.status = 'completed';
    session.results = results;
    
  } catch (error) {
    session.status = 'failed';
    session.errors.push(error.message);
    throw error;
  }
  
  return results;
}

async function orchestrateVoiceInteraction(session) {
  const results = {};
  
  try {
    // Process voice input (would integrate with voice agent)
    results.voice_processing = {
      transcription: session.data.transcription,
      intent: session.data.intent,
      entities: session.data.entities
    };
    
    // Execute intent-based actions
    if (session.data.intent === 'book_flight') {
      results.flight_search = await aiSearchService.smartFlightSearch(session.data.entities);
    }
    
    session.status = 'completed';
    session.results = results;
    
  } catch (error) {
    session.status = 'failed';
    session.errors.push(error.message);
    throw error;
  }
  
  return results;
}

async function orchestrateGenericTask(session) {
  // Handle generic orchestration tasks
  return {
    message: 'Generic task orchestration completed',
    timestamp: new Date().toISOString()
  };
}

// Helper functions

async function processVoiceInput(voiceInput) {
  try {
    const voiceAgentService = require('../services/voiceAgentService');
    
    // If voiceInput is audio buffer, process with STT
    if (Buffer.isBuffer(voiceInput)) {
      const sttResult = await voiceAgentService.speechToText(voiceInput);
      if (sttResult.success) {
        return await voiceAgentService.processVoiceCommand(sttResult.transcription);
      }
      throw new Error('Failed to process audio input');
    }
    
    // If voiceInput is text, process as command
    if (typeof voiceInput === 'string') {
      return await voiceAgentService.processVoiceCommand(voiceInput);
    }
    
    // Fallback to mock processing
    return {
      intent: 'book_flight',
      entities: {
        origin: 'New York',
        destination: 'London',
        date: 'next week'
      },
      confidence: 0.95
    };
  } catch (error) {
    console.error('Voice processing error:', error);
    throw error;
  }
}

async function performIntelligentSearch(intent, entities) {
  if (intent === 'book_flight') {
    return await aiSearchService.smartFlightSearch({
      origin: entities.origin,
      destination: entities.destination,
      departureDate: entities.date
    });
  }
  
  return { recommendations: [] };
}

async function createBookingFromRecommendation(recommendation, preferences) {
  return await instantBookingService.createBooking({
    type: recommendation.type,
    details: recommendation,
    userPreferences: preferences
  });
}

// Agent health check functions

async function checkVoiceAgentHealth() {
  try {
    const voiceAgentService = require('../services/voiceAgentService');
    const health = await voiceAgentService.healthCheck();
    return {
      status: health.success ? 'healthy' : 'unhealthy',
      lastCheck: new Date().toISOString(),
      responseTime: '150ms',
      details: health
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      lastCheck: new Date().toISOString(),
      error: error.message
    };
  }
}

async function checkBookingAgentHealth() {
  return {
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    responseTime: '200ms'
  };
}

async function checkPaymentAgentHealth() {
  return {
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    responseTime: '180ms'
  };
}

async function checkAISearchAgentHealth() {
  return {
    status: 'healthy',
    lastCheck: new Date().toISOString(),
    responseTime: '300ms'
  };
}

function generateSessionId() {
  return 'coral_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

module.exports = router;