// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPtlCDzh_JMEWBUImMUIm81B2U2c7QYQ4",
  authDomain: "agentic-2024.firebaseapp.com",
  databaseURL: "https://agentic-2024-default-rtdb.firebaseio.com",
  projectId: "agentic-2024",
  storageBucket: "agentic-2024.appspot.com",
  messagingSenderId: "339570659511",
  appId: "1:339570659511:web:1bb67592bab170f97f7d32",
  measurementId: "G-3F9FP12HT4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const database = getDatabase(app);

export { app, database };
