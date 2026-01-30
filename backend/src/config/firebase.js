const admin = require('firebase-admin');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

let serviceAccount;

try {
  // Try to load from root or src/config
  // You can place serviceAccountKey.json in the project root
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(process.cwd(), 'serviceAccountKey.json');
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.warn('⚠️ Service account key not found. Make sure credentials are set or GOOGLE_APPLICATION_CREDENTIALS is valid.');
  // Fallback for when deployed if env vars are used directly (not file)
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error('Failed to initialize Firebase: No credentials provided.');
    process.exit(1);
  }
}

if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
} else {
    admin.initializeApp(); // Try default google cloud init
}

const db = admin.firestore();

// Use server timestamps setting if needed, but modern SDKs handle this well.
// db.settings({ ignoreUndefinedProperties: true });

console.log('🔥 Firebase Connected');

module.exports = { admin, db };
