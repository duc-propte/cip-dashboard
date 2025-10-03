import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from backend directory
const result = dotenv.config({ path: join(__dirname, '.env') });

console.log('\n🔍 Testing Backend Configuration\n');
console.log('━'.repeat(60));

if (result.error) {
  console.log('❌ ERROR: Could not load .env file');
  console.log('   Path:', join(__dirname, '.env'));
  console.log('   Error:', result.error.message);
  console.log('\n💡 Solution: Create a .env file in the backend directory');
  process.exit(1);
} else {
  console.log('✅ .env file loaded successfully');
}

console.log('\n📋 Environment Variables:\n');

const requiredVars = [
  'SALESFORCE_CLIENT_ID',
  'SALESFORCE_CLIENT_SECRET',
  'SALESFORCE_REDIRECT_URI',
  'SALESFORCE_LOGIN_URL',
  'PORT',
  'FRONTEND_URL'
];

let allGood = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}`);
    console.log(`   Value: ${varName.includes('SECRET') ? '***hidden***' : value}`);
  } else {
    console.log(`❌ ${varName} - MISSING!`);
    allGood = false;
  }
  console.log('');
});

console.log('━'.repeat(60));

if (allGood) {
  console.log('\n✨ All configuration values are set!');
  
  // Validate redirect URI format
  const redirectUri = process.env.SALESFORCE_REDIRECT_URI;
  if (redirectUri && !redirectUri.startsWith('http')) {
    console.log('\n⚠️  WARNING: SALESFORCE_REDIRECT_URI should start with http:// or https://');
  }
  
  if (redirectUri && !redirectUri.includes('/auth/callback')) {
    console.log('\n⚠️  WARNING: SALESFORCE_REDIRECT_URI should end with /auth/callback');
  }
  
  console.log('\n🚀 You can now start the backend server with: npm run dev');
} else {
  console.log('\n❌ Some configuration values are missing!');
  console.log('\n💡 Please check your .env file in the backend directory');
  console.log('   See backend/env.example for the template');
}

console.log('\n');

