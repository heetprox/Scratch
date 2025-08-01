import { initializeApp, getApps } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator, initializeFirestore, persistentLocalCache, persistentMultipleTabManager, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";

// Use environment variables for Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA8mMvbR543VDb_XcPb5xGNoPSmNcqYCPs",
  authDomain: "scratch-7508a.firebaseapp.com",
  projectId: "scratch-7508a",
  storageBucket: "scratch-7508a.firebasestorage.app",
  messagingSenderId: "60715943042",
  appId: "1:60715943042:web:fb4fca9a7e5b38fac1e09b",
  measurementId: "G-XQ4BVFEFW8"
};


// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}


const db = getFirestore(app);
  

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