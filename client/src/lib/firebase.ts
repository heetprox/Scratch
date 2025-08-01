import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator, initializeFirestore, persistentLocalCache, CACHE_SIZE_UNLIMITED, Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDuXYGeAvoG2uaOxU1D4-NkjcMAR8ksJfc",
  authDomain: "scratch-3bb15.firebaseapp.com",
  projectId: "scratch-3bb15",
  storageBucket: "scratch-3bb15.firebasestorage.app",
  messagingSenderId: "176934363728",
  appId: "1:176934363728:web:4798c90d001c35b4bd2755",
  measurementId: "G-NC1QMH9KF7"
};


// Log config for debugging
console.log("Firebase Config:", JSON.stringify(firebaseConfig, null, 2));


// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


// Initialize Firestore with persistence settings
let db: Firestore;
try {
  // Use initializeFirestore with explicit database ID and persistence settings
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      cacheSizeBytes: CACHE_SIZE_UNLIMITED
    }),
    experimentalForceLongPolling: true // Force long polling to avoid WebSocket issues
  });
  console.log("Firestore initialized with persistence settings");
} catch (error) {
  console.error("Error initializing Firestore with persistence:", error);
  // Fallback to standard initialization
  db = getFirestore(app);
  console.log("Firestore initialized with standard settings");
}
  

const auth = getAuth(app);
const storage = getStorage(app);

// Use Firebase emulators in development environment
if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === 'true') {
  if (typeof window !== 'undefined') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Using Firebase emulators');
    } catch (error) {
      console.error('Error connecting to Firebase emulators:', error);
    }
  }
}

export { db, auth, storage };