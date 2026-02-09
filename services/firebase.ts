import { initializeApp, getApp, getApps } from "firebase/app";
// @ts-ignore ලකුණ යොදා TypeScript error එක මඟහරින්න පුළුවන්
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyChDj5_NFPgVLZflaQ66AiN2SAxhdza8_4",
  authDomain: "jobportal-9bab0.firebaseapp.com",
  projectId: "jobportal-9bab0",
  storageBucket: "jobportal-9bab0.firebasestorage.app",
  messagingSenderId: "270825751134",
  appId: "1:270825751134:web:e2a80fa6d418364ab9eacf"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Persistence සමඟ Auth setup කිරීම
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);