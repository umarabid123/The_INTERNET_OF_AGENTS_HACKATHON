#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 AI Travel Agent Backend Setup');
console.log('================================\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  console.log('📋 Creating .env file from template...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!\n');
  } else {
    console.log('❌ .env.example not found!\n');
  }
}

console.log('🔧 Required Configuration:');
console.log('1. Set your OpenAI API key in .env');
console.log('2. Set your MongoDB URI (or use default local MongoDB)');
console.log('3. Set your Crossmint API key for crypto payments');
console.log('4. Voice Agent is pre-configured to use Hugging Face Spaces\n');

console.log('🎯 Voice Agent Integration:');
console.log('✅ Using Hugging Face Spaces Voice Agent');
console.log('✅ Base URL: https://jarvisxironman-voice-agent.hf.space');
console.log('✅ No additional setup required for voice features\n');

console.log('🚀 Quick Start Commands:');
console.log('npm install     # Install dependencies');
console.log('npm run dev     # Start development server');
console.log('npm test        # Run tests\n');

console.log('📚 API Endpoints Available:');
console.log('GET  /health                          # Health check');
console.log('POST /api/auth/register               # User registration');
console.log('POST /api/auth/login                  # User login');
console.log('POST /api/search/natural-language     # AI-powered search');
console.log('POST /api/booking/create              # Instant booking');
console.log('POST /api/payment/create              # Crypto payments');
console.log('POST /api/voice/text-to-speech        # TTS using HF Voice Agent');
console.log('POST /api/voice/speech-to-text        # STT using HF Voice Agent');
console.log('POST /api/voice/voice-to-booking      # Voice-driven booking');
console.log('POST /api/coral/orchestrate           # Multi-agent coordination\n');

console.log('🧪 Test Voice Agent:');
console.log('curl -X GET http://localhost:5000/api/voice/health');
console.log('curl -X POST http://localhost:5000/api/voice/test-tts -H "Content-Type: application/json" -d \'{"text":"Hello from AI Travel Agent"}\'\n');

console.log('📖 For detailed documentation, see README.md');
console.log('🎉 Setup complete! Ready to start developing.');

process.exit(0);