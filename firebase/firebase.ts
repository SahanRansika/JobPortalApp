// firebase.ts
import { initializeApp } from "firebase/app";
//@ts-ignore
import{initializeAuth, getReactNativePersistence} from "firebase/auth";
import{getFirestore} from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

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

// ✅ FIX: React Native Auth with persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore stays same
export const db = getFirestore(app);
