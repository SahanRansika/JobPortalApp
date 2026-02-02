import { initializeApp, getApp, getApps } from "firebase/app";
// @ts-ignore ලකුණ යොදා TypeScript error එක මඟහරින්න පුළුවන්
// @ts-ignore
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCRJqP5xie41K8tFwJ3tUK29_gCgSEPMqg",
  authDomain: "jobportal-9bab0.firebaseapp.com",
  projectId: "jobportal-9bab0",
  storageBucket: "jobportal-9bab0.appspot.com",
  messagingSenderId: "270825751134",
  appId: "1:270825751134:web:797e784ae021ae60b9eacf",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Persistence සමඟ Auth setup කිරීම
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);