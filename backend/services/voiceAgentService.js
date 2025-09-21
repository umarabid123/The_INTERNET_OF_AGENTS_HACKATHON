const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

/**
 * Voice Agent Service using Hugging Face Spaces API
 * Base URL: https://jarvisxironman-voice-agent.hf.space
 */
class VoiceAgentService {
  constructor() {
    this.baseURL = process.env.VOICE_AGENT_BASE_URL || 'https://jarvisxironman-voice-agent.hf.space';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000, // 30 seconds timeout for voice processing
    });
  }

  /**
   * Check if the voice agent is healthy and ready
   */
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return {
        success: true,
        data: response.data,
        status: 'healthy'
      };
    } catch (error) {
      console.error('Voice Agent health check failed:', error);
      return {
        success: false,
        error: error.message,
        status: 'unhealthy'
      };
    }
  }

  /**
   * Convert text to speech using the Voice Agent TTS
   * @param {string} text - Text to convert to speech
   * @param {Object} options - Additional options
   * @returns {Promise<Buffer>} - Audio file buffer
   */
  async textToSpeech(text, options = {}) {
    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text is required for text-to-speech conversion');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('text', text.trim());

      // Make request to TTS endpoint
      const response = await this.client.post('/tts', formData, {
        headers: {
          ...formData.getHeaders(),
        },
        responseType: 'arraybuffer', // Important: Get binary data
      });

      return {
        success: true,
        audioBuffer: Buffer.from(response.data),
        contentType: 'audio/mpeg',
        format: 'mp3'
      };

    } catch (error) {
      console.error('Text-to-speech conversion failed:', error);
      throw new Error(`TTS failed: ${error.message}`);
    }
  }

  /**
   * Convert speech to text using the Voice Agent STT
   * @param {Buffer|string} audioFile - Audio file buffer or file path
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Transcription result
   */
  async speechToText(audioFile, options = {}) {
    try {
      if (!audioFile) {
        throw new Error('Audio file is required for speech-to-text conversion');
      }

      const formData = new FormData();

      // Handle different input types
      if (Buffer.isBuffer(audioFile)) {
        // If it's a buffer, append it directly
        formData.append('file', audioFile, {
          filename: 'audio.wav',
          contentType: 'audio/wav'
        });
      } else if (typeof audioFile === 'string') {
        // If it's a file path, read the file
        if (!fs.existsSync(audioFile)) {
          throw new Error('Audio file not found');
        }
        formData.append('file', fs.createReadStream(audioFile));
      } else {
        throw new Error('Invalid audio file format');
      }

      // Make request to STT endpoint
      const response = await this.client.post('/stt', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return {
        success: true,
        transcription: response.data.text || response.data,
        confidence: response.data.confidence || null,
        language: response.data.language || 'en'
      };

    } catch (error) {
      console.error('Speech-to-text conversion failed:', error);
      throw new Error(`STT failed: ${error.message}`);
    }
  }

  /**
   * Process voice command with AI understanding
   * @param {string} audioCommand - Transcribed voice command
   * @param {Object} context - Context for understanding the command
   * @returns {Promise<Object>} - Processed command with intent and entities
   */
  async processVoiceCommand(audioCommand, context = {}) {
    try {
      // Use OpenAI to understand the voice command intent
      const openai = require('./aiSearchService').getOpenAIClient();
      
      const systemPrompt = `You are a travel booking voice assistant. Analyze the user's voice command and extract:
1. Intent (book_flight, book_hotel, search_flights, search_hotels, get_info, cancel_booking, etc.)
2. Entities (dates, locations, preferences, etc.)
3. Confidence level
4. Required actions

Return a structured JSON response.`;

      const userPrompt = `Voice command: "${audioCommand}"
Context: ${JSON.stringify(context)}

Extract the intent and entities from this travel-related voice command.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      });

      const analysis = JSON.parse(completion.choices[0].message.content);

      return {
        success: true,
        originalCommand: audioCommand,
        intent: analysis.intent,
        entities: analysis.entities || {},
        confidence: analysis.confidence || 0.8,
        actions: analysis.actions || [],
        context: context
      };

    } catch (error) {
      console.error('Voice command processing failed:', error);
      throw new Error(`Voice command processing failed: ${error.message}`);
    }
  }

  /**
   * Complete voice interaction workflow
   * @param {Buffer} audioBuffer - Audio input from user
   * @param {Object} context - Conversation context
   * @returns {Promise<Object>} - Complete interaction result with audio response
   */
  async completeVoiceInteraction(audioBuffer, context = {}) {
    try {
      // Step 1: Convert speech to text
      const sttResult = await this.speechToText(audioBuffer);
      
      if (!sttResult.success) {
        throw new Error('Failed to transcribe audio');
      }

      // Step 2: Process the voice command
      const commandResult = await this.processVoiceCommand(sttResult.transcription, context);

      // Step 3: Generate appropriate response text
      const responseText = await this.generateResponseText(commandResult);

      // Step 4: Convert response to speech
      const ttsResult = await this.textToSpeech(responseText);

      return {
        success: true,
        interaction: {
          userSpeech: sttResult.transcription,
          intent: commandResult.intent,
          entities: commandResult.entities,
          responseText: responseText,
          responseAudio: ttsResult.audioBuffer
        },
        actions: commandResult.actions
      };

    } catch (error) {
      console.error('Complete voice interaction failed:', error);
      throw new Error(`Voice interaction failed: ${error.message}`);
    }
  }

  /**
   * Generate appropriate response text based on command analysis
   * @param {Object} commandResult - Processed command result
   * @returns {Promise<string>} - Response text
   */
  async generateResponseText(commandResult) {
    const { intent, entities } = commandResult;

    try {
      const openai = require('./aiSearchService').getOpenAIClient();

      const systemPrompt = `You are a helpful travel booking assistant. Generate a natural, conversational response based on the user's intent and extracted entities. Keep responses concise but informative.`;

      const userPrompt = `User intent: ${intent}
Entities: ${JSON.stringify(entities)}

Generate an appropriate response for this travel booking interaction.`;

      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 150
      });

      return completion.choices[0].message.content.trim();

    } catch (error) {
      console.error('Response generation failed:', error);
      
      // Fallback responses based on intent
      const fallbackResponses = {
        book_flight: 'I can help you book a flight. Let me search for available options.',
        book_hotel: 'I\'ll help you find and book a hotel. Searching for accommodations now.',
        search_flights: 'Searching for flights based on your preferences.',
        search_hotels: 'Looking for hotels that match your criteria.',
        get_info: 'Let me get that information for you.',
        cancel_booking: 'I can help you cancel your booking. Let me process that request.',
        default: 'I understand you need help with travel booking. How can I assist you?'
      };

      return fallbackResponses[intent] || fallbackResponses.default;
    }
  }

  /**
   * Save audio buffer to file
   * @param {Buffer} audioBuffer - Audio data
   * @param {string} filename - Output filename
   * @returns {Promise<string>} - File path
   */
  async saveAudioFile(audioBuffer, filename) {
    try {
      const filePath = `./uploads/${filename}`;
      
      // Ensure uploads directory exists
      const uploadsDir = './uploads';
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      fs.writeFileSync(filePath, audioBuffer);
      return filePath;

    } catch (error) {
      console.error('Failed to save audio file:', error);
      throw new Error(`Failed to save audio file: ${error.message}`);
    }
  }

  /**
   * Get voice agent status and capabilities
   * @returns {Promise<Object>} - Agent status
   */
  async getAgentStatus() {
    try {
      const healthResult = await this.healthCheck();
      
      return {
        status: healthResult.success ? 'online' : 'offline',
        capabilities: [
          'text_to_speech',
          'speech_to_text',
          'voice_command_processing',
          'natural_language_understanding'
        ],
        health: healthResult,
        baseURL: this.baseURL,
        lastCheck: new Date().toISOString()
      };

    } catch (error) {
      return {
        status: 'offline',
        error: error.message,
        lastCheck: new Date().toISOString()
      };
    }
  }
}

module.exports = new VoiceAgentService();