// firebase/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRJqP5xie41K8tFwJ3tUK29_gCgSEPMqg",
  authDomain: "jobportal-9bab0.firebaseapp.com",
  projectId: "jobportal-9bab0",
  storageBucket: "jobportal-9bab0.appspot.com",
  messagingSenderId: "270825751134",
  appId: "1:270825751134:web:797e784ae021ae60b9eacf",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ EXPORT THESE (IMPORTANT)
export const auth = getAuth(app);
export const db = getFirestore(app);
