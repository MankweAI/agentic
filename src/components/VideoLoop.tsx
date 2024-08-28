import React from "react";

import { getStorage, ref, getDownloadURL } from "firebase/storage";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAPtlCDzh_JMEWBUImMUIm81B2U2c7QYQ4",
  authDomain: "agentic-2024.firebaseapp.com",
  databaseURL: "https://agentic-2024-default-rtdb.firebaseio.com",
  projectId: "agentic-2024",
  storageBucket: "agentic-2024.appspot.com",
  messagingSenderId: "339570659511",
  appId: "1:339570659511:web:1bb67592bab170f97f7d32",
  measurementId: "G-3F9FP12HT4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage();

// Create a reference from a Google Cloud Storage URI
const storageRef = ref(storage, "gs://agentic-2024.appspot.com/hero-video.mp4");



const VideoLoop = () => {

    getDownloadURL(storageRef)
      .then((url) => {
        // The `url` is the publicly accessible URL
        // console.log("Public URL: ", url);
      })
      .catch((error) => {
        // Handle any errors
        console.error("Error getting download URL:", error);
      });

  return (
    <div>
      <video loop autoPlay muted>
        <source
          src="https://firebasestorage.googleapis.com/v0/b/agentic-2024.appspot.com/o/hero-video.mp4?alt=media&token=c52ce72d-79b6-4eff-bcd5-b454d463201c"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoLoop;
