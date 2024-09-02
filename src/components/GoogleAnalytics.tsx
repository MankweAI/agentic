"use client"
import React, { useEffect } from "react";

const GoogleAnalytics: React.FC = () => {
  useEffect(() => {
    // Load the Google Analytics script
    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-QVDL7L6CR7";
    document.head.appendChild(script1);

    // Initialize the gtag function
    const script2 = document.createElement("script");
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-QVDL7L6CR7');
    `;
    document.head.appendChild(script2);

    return () => {
      // Clean up by removing the scripts when the component is unmounted
      document.head.removeChild(script1);
      document.head.removeChild(script2);
    };
  }, []);

  return null;
};

export default GoogleAnalytics;
