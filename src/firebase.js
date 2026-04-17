import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: "yard-walk.firebaseapp.com", // Replace with your actual Auth Domain
  projectId: "yard-walk", // Replace with your actual Project ID
  storageBucket: "yard-walk.firebasestorage.app", // Replace with your actual Storage Bucket
  messagingSenderId: "633967680523", // Replace with your actual Messaging Sender ID
  appId: "1:633967680523:web:47f7148b4966a6642e7b0e", // Replace with your actual App ID
  measurementId: "G-53CN6Q20PF", // Replace with your actual Measurement ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const initAuth = async () => {
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Auth failed", error);
  }
};
