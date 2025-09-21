const express = require('express');
const router = express.Router();
const aiSearchService = require('../services/aiSearchService');
const instantBookingService = require('../services/instantBookingService');

/**
 * @route   GET /api/search/test-openai
 * @desc    Test OpenAI connection
 * @access  Public
 */
router.get('/test-openai', async (req, res) => {
  try {
    const testResult = await aiSearchService.testOpenAIConnection();
    
    res.json({
      success: testResult.success,
      data: testResult
    });

  } catch (error) {
    console.error('OpenAI test error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to test OpenAI connection',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/search/natural-language
 * @desc    AI-powered natural language search
 * @access  Public
 */
router.post('/natural-language', async (req, res) => {
  try {
    const { query, preferences = {} } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    console.log('🔍 Processing natural language query:', query);

    // Parse natural language query
    console.log('📝 Parsing query with OpenAI...');
    const searchParams = await aiSearchService.parseNaturalLanguageQuery(query);
    console.log('✅ Query parsed:', searchParams);
    
    // Get AI recommendations
    console.log('🤖 Getting AI recommendations...');
    const recommendations = await aiSearchService.getIntelligentRecommendations({
      ...searchParams,
      ...preferences
    });
    console.log('✅ Recommendations generated');

    res.json({
      success: true,
      data: {
        originalQuery: query,
        parsedParams: searchParams,
        recommendations: recommendations
      }
    });

  } catch (error) {
    console.error('❌ Natural language search error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      type: error.type,
      stack: error.stack
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to process search query',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        code: error.code,
        type: error.type
      } : undefined
    });
  }
});

/**
 * @route   POST /api/search/flights
 * @desc    AI-powered flight search with ranking
 * @access  Public
 */
router.post('/flights', async (req, res) => {
  try {
    const searchParams = req.body;

    // Validate required fields
    const requiredFields = ['origin', 'destination', 'departureDate'];
    for (const field of requiredFields) {
      if (!searchParams[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Search flights with AI ranking
    const flights = await aiSearchService.smartFlightSearch(searchParams);

    // Also get real-time availability
    const realTimeFlights = await instantBookingService.searchFlights(searchParams);

    res.json({
      success: true,
      data: {
        aiRanked: flights,
        realTime: realTimeFlights,
        searchParams: searchParams,
        totalResults: flights.length
      }
    });

  } catch (error) {
    console.error('Flight search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search flights',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/search/hotels
 * @desc    AI-powered hotel search with ranking
 * @access  Public
 */
router.post('/hotels', async (req, res) => {
  try {
    const searchParams = req.body;

    // Validate required fields
    const requiredFields = ['location', 'checkIn', 'checkOut'];
    for (const field of requiredFields) {
      if (!searchParams[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    // Search hotels with AI ranking
    const hotels = await aiSearchService.smartHotelSearch(searchParams);

    // Also get real-time availability
    const realTimeHotels = await instantBookingService.searchHotels(searchParams);

    res.json({
      success: true,
      data: {
        aiRanked: hotels,
        realTime: realTimeHotels,
        searchParams: searchParams,
        totalResults: hotels.length
      }
    });

  } catch (error) {
    console.error('Hotel search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search hotels',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/search/comprehensive
 * @desc    Comprehensive travel search (flights + hotels + recommendations)
 * @access  Public
 */
router.post('/comprehensive', async (req, res) => {
  try {
    const { query, searchParams, preferences = {} } = req.body;

    let parsedParams = searchParams;

    // If natural language query provided, parse it first
    if (query) {
      parsedParams = await aiSearchService.parseNaturalLanguageQuery(query);
    }

    // Search flights and hotels in parallel
    const [flights, hotels, recommendations, itinerary] = await Promise.all([
      // Flight search
      parsedParams.origin && parsedParams.destination 
        ? aiSearchService.smartFlightSearch(parsedParams)
        : Promise.resolve([]),
      
      // Hotel search
      parsedParams.destination && parsedParams.departureDate
        ? aiSearchService.smartHotelSearch({
            location: parsedParams.destination,
            checkIn: parsedParams.departureDate,
            checkOut: parsedParams.returnDate || parsedParams.departureDate,
            guests: parsedParams.passengers || 1
          })
        : Promise.resolve([]),
      
      // AI recommendations
      aiSearchService.getIntelligentRecommendations({
        ...parsedParams,
        ...preferences
      }),
      
      // Generate itinerary if duration is specified
      parsedParams.duration 
        ? aiSearchService.generatePersonalizedItinerary({
            destination: parsedParams.destination,
            duration: parsedParams.duration,
            interests: preferences.interests || [],
            budget: parsedParams.budget
          })
        : Promise.resolve(null)
    ]);

    res.json({
      success: true,
      data: {
        originalQuery: query,
        searchParams: parsedParams,
        results: {
          flights: flights.slice(0, 10), // Top 10 flights
          hotels: hotels.slice(0, 10),   // Top 10 hotels
          recommendations: recommendations,
          itinerary: itinerary
        },
        summary: {
          totalFlights: flights.length,
          totalHotels: hotels.length,
          searchTime: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error('Comprehensive search error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform comprehensive search',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/search/chat
 * @desc    AI travel assistant chat
 * @access  Public
 */
router.post('/chat', async (req, res) => {
  try {
    const { message, context = {} } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }

    const response = await aiSearchService.chatAssistant(message, context);

    res.json({
      success: true,
      data: response
    });

  } catch (error) {
    console.error('Chat assistant error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process chat message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/search/availability/:offerId
 * @desc    Check real-time availability for specific offer
 * @access  Public
 */
router.get('/availability/:offerId', async (req, res) => {
  try {
    const { offerId } = req.params;
    const { type } = req.query; // 'flight' or 'hotel'

    if (!type || !['flight', 'hotel'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Valid type (flight or hotel) is required'
      });
    }

    const availability = await instantBookingService.checkAvailability(offerId, type);

    res.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/search/suggestions
 * @desc    Get search suggestions and popular destinations
 * @access  Public
 */
router.get('/suggestions', async (req, res) => {
  try {
    const { query, type = 'destinations' } = req.query;

    // Mock suggestions - in production, this would be from a database or cache
    const suggestions = {
      destinations: [
        { code: 'NYC', name: 'New York City', country: 'USA', type: 'city' },
        { code: 'LON', name: 'London', country: 'UK', type: 'city' },
        { code: 'PAR', name: 'Paris', country: 'France', type: 'city' },
        { code: 'TOK', name: 'Tokyo', country: 'Japan', type: 'city' },
        { code: 'DXB', name: 'Dubai', country: 'UAE', type: 'city' }
      ],
      airports: [
        { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
        { code: 'LHR', name: 'London Heathrow Airport', city: 'London' },
        { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris' },
        { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo' },
        { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai' }
      ],
      queries: [
        'Cheap flights to Europe',
        'Best hotels in Paris',
        'Weekend getaway ideas',
        'Business class flights to Asia',
        'Family vacation packages'
      ]
    };

    let filteredSuggestions = suggestions[type] || [];

    // Filter by query if provided
    if (query) {
      const lowerQuery = query.toLowerCase();
      filteredSuggestions = filteredSuggestions.filter(item => 
        item.name?.toLowerCase().includes(lowerQuery) ||
        item.code?.toLowerCase().includes(lowerQuery) ||
        item.city?.toLowerCase().includes(lowerQuery)
      );
    }

    res.json({
      success: true,
      data: {
        suggestions: filteredSuggestions.slice(0, 10),
        type: type,
        query: query
      }
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get suggestions',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;