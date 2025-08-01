import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA8mMvbR543VDb_XcPb5xGNoPSmNcqYCPs",
  authDomain: "scratch-7508a.firebaseapp.com",
  projectId: "scratch-7508a",
  storageBucket: "scratch-7508a.firebasestorage.app",
  messagingSenderId: "60715943042",
  appId: "1:60715943042:web:fb4fca9a7e5b38fac1e09b",
  measurementId: "G-XQ4BVFEFW8"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);