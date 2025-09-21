#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔧 AI Travel Agent - Environment Setup');
console.log('=====================================\n');

const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

// Check if .env exists
if (!fs.existsSync(envPath)) {
  console.log('📋 .env file not found, creating from .env.example...');
  
  if (fs.existsSync(envExamplePath)) {
    try {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('✅ .env file created successfully!');
    } catch (error) {
      console.error('❌ Failed to create .env file:', error.message);
      process.exit(1);
    }
  } else {
    console.error('❌ .env.example file not found!');
    process.exit(1);
  }
} else {
  console.log('✅ .env file already exists');
}

// Check environment variables
console.log('\n🔍 Checking environment configuration...');

// Load environment variables
require('dotenv').config();

const requiredVars = [
  'OPENAI_API_KEY',
  'JWT_SECRET',
  'MONGODB_URI'
];

const optionalVars = [
  'CROSSMINT_API_KEY',
  'AMADEUS_API_KEY'
];

let missingRequired = [];
let missingOptional = [];

requiredVars.forEach(varName => {
  if (!process.env[varName] || process.env[varName].includes('your-') || process.env[varName].includes('change-this')) {
    missingRequired.push(varName);
  } else {
    console.log(`✅ ${varName}: configured`);
  }
});

optionalVars.forEach(varName => {
  if (!process.env[varName] || process.env[varName].includes('your-')) {
    missingOptional.push(varName);
  } else {
    console.log(`✅ ${varName}: configured`);
  }
});

if (missingRequired.length > 0) {
  console.log('\n❌ Missing required environment variables:');
  missingRequired.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Please edit the .env file and add these variables.');
  console.log('💡 Make sure your OpenAI API key starts with "sk-"');
}

if (missingOptional.length > 0) {
  console.log('\n⚠️  Optional environment variables (features will be limited):');
  missingOptional.forEach(varName => {
    console.log(`   - ${varName}`);
  });
}

// Test OpenAI API key format if provided
if (process.env.OPENAI_API_KEY && !process.env.OPENAI_API_KEY.includes('your-')) {
  if (process.env.OPENAI_API_KEY.startsWith('sk-')) {
    console.log('✅ OpenAI API key format looks correct');
  } else {
    console.log('❌ OpenAI API key should start with "sk-"');
  }
}

console.log('\n🚀 Next steps:');
console.log('1. npm install');
console.log('2. npm run dev');
console.log('3. Test OpenAI: GET http://localhost:5000/api/search/test-openai');

if (missingRequired.length === 0) {
  console.log('\n🎉 Configuration looks good! Ready to start the server.');
} else {
  console.log('\n⏳ Please configure the missing required variables first.');
  process.exit(1);
}