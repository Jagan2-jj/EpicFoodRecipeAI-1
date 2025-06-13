#!/usr/bin/env node

/**
 * Deployment script for Epic Food Assistant
 * This script replaces the API key placeholder with the actual key during deployment
 * 
 * Usage:
 * node deploy.js --api-key YOUR_API_KEY
 * 
 * Or set environment variable:
 * GEMINI_API_KEY=your_key node deploy.js
 */

const fs = require('fs');
const path = require('path');

// Get API key from command line or environment
const args = process.argv.slice(2);
let apiKey = process.env.GEMINI_API_KEY;

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--api-key' && args[i + 1]) {
    apiKey = args[i + 1];
    break;
  }
}

if (!apiKey) {
  console.error('❌ Error: No API key provided!');
  console.log('\n📋 Usage options:');
  console.log('1. Set environment variable: GEMINI_API_KEY=your_key node deploy.js');
  console.log('2. Use command line: node deploy.js --api-key YOUR_API_KEY');
  console.log('\n🔑 Get your API key from: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

// Validate API key format
if (!apiKey.startsWith('AIzaSy') || apiKey.length < 35) {
  console.error('❌ Error: Invalid API key format!');
  console.log('✅ Valid Gemini API keys start with "AIzaSy" and are at least 35 characters long');
  process.exit(1);
}

try {
  // Read the HTML file
  const htmlPath = path.join(__dirname, 'simple-app.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  // Replace the placeholder with the actual API key
  const updatedContent = htmlContent.replace(
    'GEMINI_API_KEY_PLACEHOLDER',
    apiKey
  );
  
  // Create deployment version
  const deployPath = path.join(__dirname, 'simple-app-deployed.html');
  fs.writeFileSync(deployPath, updatedContent);
  
  console.log('✅ Deployment file created successfully!');
  console.log(`📁 File: ${deployPath}`);
  console.log('\n🚀 Next steps:');
  console.log('1. Upload simple-app-deployed.html to your hosting platform');
  console.log('2. Rename it to index.html (if needed)');
  console.log('3. Your app is ready to use!');
  console.log('\n⚠️  Security reminder:');
  console.log('- Keep your API key secure');
  console.log('- Monitor your API usage');
  console.log('- Never commit the deployed file to version control');
  
} catch (error) {
  console.error('❌ Error during deployment:', error.message);
  process.exit(1);
}