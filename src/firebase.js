import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const apiKey = import.meta.env.VITE_API_KEY;
const authDomain =
  import.meta.env.VITE_AUTH_DOMAIN || "yard-walk.firebaseapp.com";
const projectId = import.meta.env.VITE_PROJECT_ID || "yard-walk";

if (!apiKey) {
  console.log("Vite Environment Check:");
  console.log("- VITE_API_KEY exists:", !!import.meta.env.VITE_API_KEY);
  console.log(
    "- All available VITE keys:",
    Object.keys(import.meta.env).filter((k) => k.startsWith("VITE_")),
  );
  console.error(
    "CRITICAL: Firebase API Key is missing. The app cannot initialize.",
  );
}

let app, auth, db;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket:
    import.meta.env.VITE_STORAGE_BUCKET || "yard-walk.firebasestorage.app",
  messagingSenderId: "633967680523", // Replace with your actual Messaging Sender ID
  appId: "1:633967680523:web:47f7148b4966a6642e7b0e", // Replace with your actual App ID
  measurementId: "G-53CN6Q20PF", // Replace with your actual Measurement ID
};

if (apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { auth, db };

export const initAuth = async () => {
  if (!auth) return;
  try {
    await signInAnonymously(auth);
  } catch (error) {
    console.error("Auth failed", error);
  }
};
