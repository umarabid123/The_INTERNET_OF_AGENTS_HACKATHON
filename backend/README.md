# AI Travel Agent Backend

A comprehensive backend system for AI-powered travel booking with crypto payments, voice interaction, and real-time booking capabilities. Built using Coral Protocol to orchestrate multiple specialized agents.

## 🚀 Features

### Core Capabilities
- **AI-Powered Search**: Natural language processing for intelligent travel recommendations
- **Crypto Payments**: Support for BTC, ETH, USDC, USDT via Crossmint integration
- **Instant Booking**: Real-time availability and instant confirmation system
- **Voice Integration**: ElevenLabs TTS and speech recognition capabilities
- **Coral Protocol**: Agent orchestration for seamless multi-service coordination

### Agent Architecture
- **Voice Agent**: Speech processing and natural language understanding
- **Booking Agent**: Flight/hotel search and instant booking management
- **Payment Agent**: Crypto and traditional payment processing
- **AI Search Agent**: Intelligent recommendations and itinerary planning

## 🏗️ Architecture

```
backend/
├── server.js                 # Main Express server with Socket.IO
├── models/                   # MongoDB schemas
│   ├── User.js              # User authentication and profiles
│   ├── Booking.js           # Booking management
│   └── Payment.js           # Payment tracking
├── routes/                   # API endpoints
│   ├── auth.js              # Authentication routes
│   ├── booking.js           # Booking management
│   ├── payment.js           # Payment processing
│   ├── search.js            # AI-powered search
│   ├── voice.js             # Voice interaction
│   └── coral.js             # Protocol orchestration
├── services/                 # Business logic
│   ├── aiSearchService.js   # OpenAI integration
│   ├── cryptoPaymentService.js # Crossmint integration
│   └── instantBookingService.js # Booking logic
├── middleware/               # Express middleware
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Request validation
│   └── errorHandler.js      # Error handling
└── package.json             # Dependencies
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- MongoDB (local or cloud)
- API Keys for:
  - OpenAI (GPT-4)
  - Crossmint (Crypto payments)
  - Amadeus (Flights) - Optional
  - Booking.com (Hotels) - Optional

**Voice Agent**: ✅ Pre-configured to use Hugging Face Spaces Voice Agent - No setup required!

### Installation

1. **Clone and Navigate**
   ```bash
   cd backend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

3. **Configure Environment Variables**
   Edit `.env` with your API keys:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/ai-travel-agent
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRE=7d
   
   # OpenAI Configuration
   OPENAI_API_KEY=sk-your-openai-api-key
   OPENAI_MODEL=gpt-4
   
   # Voice Agent API (Hugging Face Spaces) - Pre-configured!
   VOICE_AGENT_BASE_URL=https://jarvisxironman-voice-agent.hf.space
   
   # Crossmint Configuration
   CROSSMINT_API_KEY=your-crossmint-api-key
   CROSSMINT_CLIENT_SECRET=your-crossmint-secret
   
   # Optional External APIs
   AMADEUS_API_KEY=your-amadeus-key
   AMADEUS_API_SECRET=your-amadeus-secret
   BOOKING_API_KEY=your-booking-com-key
   ```

4. **Quick Setup (Recommended)**
   ```bash
   npm run setup  # Run setup script for guided configuration
   npm install    # Install dependencies
   npm run dev    # Start development server
   ```

   Server will start on `http://localhost:5000`

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### AI-Powered Search
- `POST /api/search/natural-language` - Natural language search
- `POST /api/search/flights` - Smart flight search
- `POST /api/search/hotels` - Hotel recommendations
- `POST /api/search/chat` - AI travel assistant

### Instant Booking
- `POST /api/booking/create` - Create new booking
- `GET /api/booking/user/:userId` - Get user bookings
- `PUT /api/booking/:id/cancel` - Cancel booking
- `GET /api/booking/:id/status` - Check booking status

### Crypto Payments
- `POST /api/payment/create` - Create crypto payment
- `GET /api/payment/:id/status` - Check payment status
- `POST /api/payment/webhook` - Payment webhooks
- `GET /api/payment/rates` - Get crypto exchange rates

### Voice Integration
- `POST /api/voice/text-to-speech` - Convert text to speech
- `POST /api/voice/speech-to-text` - Convert speech to text
- `POST /api/voice/voice-command` - Process voice commands
- `GET /api/voice/voices` - Get available voices

### Coral Protocol Orchestration
- `POST /api/coral/orchestrate` - Orchestrate multi-agent tasks
- `GET /api/coral/session/:id` - Get orchestration session
- `POST /api/coral/voice-to-booking` - Complete voice-to-booking workflow
- `GET /api/coral/agents/status` - Check agent health

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Protected Routes
Most routes require authentication. Use the `/api/auth/login` endpoint to obtain a token.

## 💳 Crypto Payment Flow

1. **Create Payment**
   ```javascript
   POST /api/payment/create
   {
     "amount": 1299.99,
     "currency": "USD",
     "cryptoCurrency": "ETH",
     "bookingId": "booking-id-here"
   }
   ```

2. **Monitor Status**
   - Payment status updates via WebSocket
   - Webhook notifications for payment confirmation
   - Real-time rate updates

3. **Supported Cryptocurrencies**
   - Bitcoin (BTC)
   - Ethereum (ETH)
   - USD Coin (USDC)
   - Tether (USDT)

## 🗣️ Voice Integration with Hugging Face Spaces

### Integrated Voice Agent
The backend now uses a **deployed Voice Agent** on Hugging Face Spaces:
- **Base URL**: `https://jarvisxironman-voice-agent.hf.space`
- **No API keys required** - Ready to use!
- **Capabilities**: Speech-to-Text, Text-to-Speech, Voice Command Processing

### Voice Agent Endpoints
| Endpoint | Description | HF Spaces Endpoint |
|----------|-------------|-------------------|
| Health Check | Check agent status | `GET /health` |
| Text-to-Speech | Convert text to MP3 | `POST /tts` |
| Speech-to-Text | Convert audio to text | `POST /stt` |

### Backend Voice Integration
Our backend automatically integrates with the HF Voice Agent:

**Text-to-Speech**
```javascript
POST /api/voice/text-to-speech
{
  "text": "Your flight to London has been booked successfully!"
}
// Returns: MP3 audio file
```

**Speech-to-Text**
```javascript
POST /api/voice/speech-to-text
// Form-data with 'audio' file
// Returns: {"success": true, "data": {"transcription": "text"}}
```

**Complete Voice Interaction**
```javascript
POST /api/voice/complete-interaction
// Form-data with 'audio' file + optional context
// Returns: Full workflow with STT → AI Processing → TTS
```

**Voice-to-Booking Workflow**
```javascript
POST /api/voice/voice-to-booking
// Form-data with 'audio' file
// Returns: Voice processing + booking search results
```

## 🤖 AI Features

### Natural Language Search
The AI search service understands natural language queries:
- "Find me a cheap flight to Paris next month"
- "I need a hotel in Tokyo with a spa"
- "Plan a 5-day trip to Italy under $2000"

### Personalized Recommendations
- Budget-based filtering
- Preference learning
- Smart itinerary generation
- Real-time price optimization

## 🔄 Real-time Features

### WebSocket Events
- `booking_update` - Booking status changes
- `payment_status` - Payment confirmations
- `availability_change` - Real-time availability updates
- `price_alert` - Price change notifications

### Connection
```javascript
import io from 'socket.io-client';
const socket = io('http://localhost:5000');

socket.on('booking_update', (data) => {
  console.log('Booking updated:', data);
});
```

## 🧪 Testing

### Run Tests
```bash
npm test
```

### API Testing
Use the provided test files or tools like Postman:

```bash
# Example API call
curl -X POST http://localhost:5000/api/search/natural-language \
  -H "Content-Type: application/json" \
  -d '{"query": "Find me flights to Tokyo"}'

# Test Voice Agent
curl -X GET http://localhost:5000/api/voice/health
curl -X POST http://localhost:5000/api/voice/test-tts \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello from AI Travel Agent"}'
```

## 📝 Development

### Code Structure
- **Models**: Mongoose schemas with validation and middleware
- **Routes**: Express route handlers with validation
- **Services**: Business logic and external API integration
- **Middleware**: Authentication, validation, and error handling

### Adding New Features
1. Create service in `/services`
2. Add route in `/routes`
3. Update server.js imports
4. Add validation in `/middleware/validation.js`
5. Test endpoints

## 🚀 Deployment

### Production Environment
1. Set `NODE_ENV=production`
2. Configure production MongoDB
3. Set up SSL certificates
4. Configure reverse proxy (Nginx)
5. Set up monitoring and logging

### Docker Deployment
```bash
# Build image
docker build -t ai-travel-backend .

# Run container
docker run -p 3001:3001 --env-file .env ai-travel-backend
```

## 🔧 Configuration

### Environment Variables Reference
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `VOICE_AGENT_BASE_URL` - Hugging Face Voice Agent URL (pre-configured)
- `CROSSMINT_API_KEY` - Crossmint API key for crypto payments

## 📊 Monitoring

### Health Checks
- `GET /health` - Basic health check
- `GET /api/coral/agents/status` - Agent health status

### Logging
- Request/response logging with Morgan
- Error logging with custom middleware
- API integration monitoring

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Ensure all tests pass
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Review error logs in development mode
3. Test API endpoints with provided examples
4. Check agent health status

---

**Built with Coral Protocol for seamless agent orchestration**