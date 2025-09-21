const { OpenAI } = require('openai');
const axios = require('axios');

class AISearchService {
  constructor() {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found in environment variables');
      throw new Error('OpenAI API key is required');
    }

    // Validate API key format
    if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
      console.error('❌ Invalid OpenAI API key format');
      throw new Error('Invalid OpenAI API key format');
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    this.model = process.env.OPENAI_MODEL || 'gpt-4';
    
    console.log('✅ AI Search Service initialized with model:', this.model);
    console.log('✅ OpenAI API Key loaded:', process.env.OPENAI_API_KEY.substring(0, 7) + '...');
  }

  /**
   * Parse natural language search query into structured search parameters
   * @param {string} query - Natural language search query
   * @returns {Object} Structured search parameters
   */
  async parseNaturalLanguageQuery(query) {
    try {
      const prompt = `
        Parse this travel search query into structured parameters. Return JSON only.
        
        Query: "${query}"
        
        Extract these fields if mentioned:
        - origin: departure city/airport
        - destination: arrival city/airport  
        - departureDate: date in YYYY-MM-DD format
        - returnDate: return date in YYYY-MM-DD format (if round trip)
        - passengers: number of passengers
        - tripType: "one-way", "round-trip", or "multi-city"
        - class: "economy", "premium-economy", "business", or "first"
        - budget: approximate budget if mentioned
        - interests: array of interests/activities mentioned
        - accommodation: preferred hotel type
        - duration: trip duration in days
        
        Example response:
        {
          "origin": "New York",
          "destination": "Paris", 
          "departureDate": "2024-12-15",
          "returnDate": "2024-12-22",
          "passengers": 2,
          "tripType": "round-trip",
          "class": "economy",
          "budget": 2000,
          "interests": ["museums", "dining"],
          "accommodation": "mid-range",
          "duration": 7
        }
      `;

      console.log('🔮 Sending query to OpenAI:', this.model);
      
      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        max_tokens: 500
      });

      console.log('✅ OpenAI response received');
      const content = response.choices[0].message.content;
      console.log('📄 Raw response:', content);

      try {
        const parsed = JSON.parse(content);
        console.log('✅ JSON parsed successfully:', parsed);
        return parsed;
      } catch (jsonError) {
        console.error('❌ Failed to parse JSON response:', jsonError);
        console.error('Raw content:', content);
        
        // Fallback parsing
        return {
          query: query,
          error: 'Failed to parse AI response',
          rawResponse: content
        };
      }
    } catch (error) {
      console.error('❌ Error parsing natural language query:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        type: error.type,
        status: error.status
      });
      
      // Return a fallback structure instead of throwing
      return {
        query: query,
        error: error.message,
        fallback: true,
        origin: null,
        destination: null,
        departureDate: null,
        passengers: 1,
        tripType: "one-way"
      };
    }
  }

  /**
   * Get intelligent travel recommendations based on preferences
   * @param {Object} searchParams - Parsed search parameters
   * @returns {Object} AI-generated recommendations
   */
  async getIntelligentRecommendations(searchParams) {
    try {
      const prompt = `
        Based on these travel preferences, provide intelligent recommendations:
        
        ${JSON.stringify(searchParams, null, 2)}
        
        Provide recommendations for:
        1. Best flight options and timing
        2. Hotel recommendations
        3. Activities and attractions
        4. Local tips and insights
        5. Budget optimization suggestions
        6. Weather considerations
        7. Cultural insights
        
        Return a comprehensive JSON response with detailed recommendations.
      `;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1500
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate recommendations');
    }
  }

  /**
   * Smart flight search with AI-powered filtering and ranking
   * @param {Object} searchParams - Flight search parameters
   * @returns {Array} Ranked flight options
   */
  async smartFlightSearch(searchParams) {
    try {
      // Simulate flight search results (replace with real API calls)
      const mockFlights = [
        {
          id: 'FL001',
          airline: 'Air France',
          price: 850,
          duration: '8h 30m',
          stops: 0,
          departure: '14:30',
          arrival: '07:00+1',
          aircraft: 'Boeing 777',
          amenities: ['wifi', 'entertainment', 'meals'],
          carbonFootprint: 1.2,
          reliability: 0.95
        },
        {
          id: 'FL002', 
          airline: 'Delta',
          price: 920,
          duration: '9h 15m',
          stops: 1,
          departure: '10:15',
          arrival: '15:30',
          aircraft: 'Airbus A330',
          amenities: ['wifi', 'entertainment'],
          carbonFootprint: 1.4,
          reliability: 0.92
        },
        {
          id: 'FL003',
          airline: 'Lufthansa',
          price: 780,
          duration: '8h 45m', 
          stops: 0,
          departure: '22:10',
          arrival: '13:55+1',
          aircraft: 'Airbus A350',
          amenities: ['wifi', 'entertainment', 'meals', 'lounge'],
          carbonFootprint: 1.1,
          reliability: 0.97
        }
      ];

      // AI-powered ranking based on user preferences
      const rankedFlights = await this.rankFlightOptions(mockFlights, searchParams);
      
      return rankedFlights;
    } catch (error) {
      console.error('Error in smart flight search:', error);
      throw new Error('Failed to search flights');
    }
  }

  /**
   * Rank flight options using AI based on user preferences
   * @param {Array} flights - Available flights
   * @param {Object} preferences - User preferences
   * @returns {Array} Ranked flights with AI scores
   */
  async rankFlightOptions(flights, preferences) {
    try {
      const prompt = `
        Rank these flight options based on user preferences. Consider price, duration, convenience, and preferences.
        
        User Preferences: ${JSON.stringify(preferences, null, 2)}
        
        Flight Options: ${JSON.stringify(flights, null, 2)}
        
        For each flight, provide:
        1. Overall score (0-100)
        2. Reasoning for the score
        3. Pros and cons
        4. Recommendation level (high/medium/low)
        
        Return JSON array with flights ranked by score (highest first).
      `;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error ranking flights:', error);
      return flights.map(flight => ({ ...flight, aiScore: 50, reasoning: 'Default ranking' }));
    }
  }

  /**
   * Smart hotel search with AI recommendations
   * @param {Object} searchParams - Hotel search parameters
   * @returns {Array} Ranked hotel options
   */
  async smartHotelSearch(searchParams) {
    try {
      // Mock hotel data (replace with real API)
      const mockHotels = [
        {
          id: 'HT001',
          name: 'Le Grand Hotel Paris',
          price: 320,
          rating: 4.8,
          location: 'City Center',
          amenities: ['spa', 'restaurant', 'gym', 'wifi', 'concierge'],
          distance: '0.5km from Louvre',
          sustainability: 4.2,
          reviews: 1250
        },
        {
          id: 'HT002',
          name: 'Hotel Moderne',
          price: 180,
          rating: 4.3,
          location: 'Marais District',
          amenities: ['restaurant', 'wifi', 'breakfast'],
          distance: '1.2km from Notre Dame',
          sustainability: 3.8,
          reviews: 890
        },
        {
          id: 'HT003',
          name: 'Boutique Champs',
          price: 250,
          rating: 4.6,
          location: 'Champs-Élysées',
          amenities: ['spa', 'restaurant', 'wifi', 'bar'],
          distance: '0.3km from Arc de Triomphe',
          sustainability: 4.0,
          reviews: 650
        }
      ];

      const rankedHotels = await this.rankHotelOptions(mockHotels, searchParams);
      return rankedHotels;
    } catch (error) {
      console.error('Error in smart hotel search:', error);
      throw new Error('Failed to search hotels');
    }
  }

  /**
   * Rank hotel options using AI
   * @param {Array} hotels - Available hotels
   * @param {Object} preferences - User preferences
   * @returns {Array} Ranked hotels with AI scores
   */
  async rankHotelOptions(hotels, preferences) {
    try {
      const prompt = `
        Rank these hotel options based on user preferences and travel context.
        
        User Preferences: ${JSON.stringify(preferences, null, 2)}
        
        Hotel Options: ${JSON.stringify(hotels, null, 2)}
        
        Consider: budget, location convenience, amenities match, ratings, and value for money.
        
        For each hotel, provide:
        1. Overall score (0-100)
        2. Value rating
        3. Location score
        4. Amenity match score
        5. Brief recommendation
        
        Return JSON array ranked by overall score.
      `;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
        max_tokens: 1000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error ranking hotels:', error);
      return hotels.map(hotel => ({ ...hotel, aiScore: 50, recommendation: 'Standard option' }));
    }
  }

  /**
   * Generate personalized itinerary using AI
   * @param {Object} travelParams - Travel parameters and preferences
   * @returns {Object} AI-generated itinerary
   */
  async generatePersonalizedItinerary(travelParams) {
    try {
      const prompt = `
        Create a personalized ${travelParams.duration}-day itinerary for ${travelParams.destination}.
        
        Travel Details: ${JSON.stringify(travelParams, null, 2)}
        
        Include:
        1. Day-by-day schedule
        2. Activity recommendations with timing
        3. Restaurant suggestions
        4. Transportation tips
        5. Budget breakdown
        6. Local insights and tips
        7. Weather-appropriate suggestions
        8. Cultural etiquette notes
        
        Make it practical, exciting, and tailored to their interests.
        Return detailed JSON structure.
      `;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.4,
        max_tokens: 2000
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw new Error('Failed to generate itinerary');
    }
  }

  /**
   * Real-time travel assistant chat
   * @param {string} message - User message
   * @param {Object} context - Current booking/travel context
   * @returns {Object} AI assistant response
   */
  async chatAssistant(message, context = {}) {
    try {
      const systemPrompt = `
        You are an expert travel assistant. Help users with travel planning, bookings, and questions.
        
        Current Context: ${JSON.stringify(context, null, 2)}
        
        Provide helpful, accurate, and friendly responses. If you need more information, ask clarifying questions.
        Focus on practical advice and actionable recommendations.
      `;

      const response = await this.openai.chat.completions.create({
        model: this.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return {
        message: response.choices[0].message.content,
        suggestions: await this.generateSuggestions(message, context),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in chat assistant:', error);
      throw new Error('Failed to process chat message');
    }
  }

  /**
   * Generate contextual suggestions
   * @param {string} message - User message
   * @param {Object} context - Current context
   * @returns {Array} Suggestion options
   */
  async generateSuggestions(message, context) {
    // Simple suggestion generation based on keywords
    const suggestions = [];
    
    if (message.toLowerCase().includes('flight')) {
      suggestions.push('Search for flights', 'Compare airlines', 'Check flight status');
    }
    if (message.toLowerCase().includes('hotel')) {
      suggestions.push('Find hotels', 'Check availability', 'Read reviews');
    }
    if (message.toLowerCase().includes('weather')) {
      suggestions.push('Check forecast', 'Packing tips', 'Seasonal activities');
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  /**
   * Get OpenAI client instance (for use by other services)
   * @returns {OpenAI} OpenAI client instance
   */
  getOpenAIClient() {
    return this.openai;
  }

  /**
   * Test OpenAI connection and API key
   * @returns {Object} Test result
   */
  async testOpenAIConnection() {
    try {
      console.log('🧪 Testing OpenAI connection...');
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo', // Use cheaper model for testing
        messages: [{ role: 'user', content: 'Say "Hello, AI Travel Agent!" if you can read this.' }],
        max_tokens: 20,
        temperature: 0
      });

      console.log('✅ OpenAI connection successful');
      return {
        success: true,
        model: response.model,
        response: response.choices[0].message.content,
        usage: response.usage
      };
    } catch (error) {
      console.error('❌ OpenAI connection failed:', error.message);
      return {
        success: false,
        error: error.message,
        code: error.code || 'unknown',
        type: error.type || 'unknown'
      };
    }
  }
}

module.exports = new AISearchService();