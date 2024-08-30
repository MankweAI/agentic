"use client";

import { useEffect } from "react";

const ChatbotFrame = () => {
  useEffect(() => {
    const initializeIframe = () => {
      try {
        // Create the iframe element
        const iframe = document.createElement("iframe");
        iframe.src = `https://www.agentic.co.za/chatbot?cacheBuster=${Date.now()}`;
        iframe.classList.add("chat-frame");
        document.body.appendChild(iframe);

        // Inject iframe styles
        const style = document.createElement("style");
        style.textContent = `
          .chat-frame {
            position: fixed;
            bottom: 10px;
            right: 10px;
            border: none;
            z-index: 9999;
            width: 96%; /* Mobile first: full width */
            height: 600px; /* Mobile first: default height */

            /* Tailwind breakpoints */
            @media (min-width: 640px) { /* sm: >= 640px */
              width: 420px; /* Width for small screens */
              height: 700px; /* Height for small screens */
            }
            @media (min-width: 768px) { /* md: >= 768px */
              width: 500px; /* Width for medium screens */
              height: 800px; /* Height for medium screens */
            }
            @media (min-width: 812px) and (max-width: 1023px) { /* custom breakpoint */
              width: 600px; /* Custom width for screens between 812px and 1023px */
              height: 1200px; /* Custom height for screens between 812px and 1023px */
            }
            @media (min-width: 1024px) { /* lg: >= 1024px */
              width: 500px; /* Width for large screens */
              height: 1000px; /* Height for large screens */
            }
            @media (min-width: 1280px) { /* xl: >= 1280px */
              width: 400px; /* Width for extra large screens */
              height: 100%; /* Height for extra large screens */
            }
          }
        `;
        document.head.appendChild(style);

        // Define the iframe onload handler
        iframe.onload = () => {
          const handleMessage = (e: MessageEvent) => {
            // Ensure the message is from the expected origin
            if (e.origin !== "https://www.agentic.co.za") return;

            let dimensions;
            try {
              // Parse message data
              dimensions =
                typeof e.data === "string" ? JSON.parse(e.data) : e.data;
            } catch (error) {
              console.error("Failed to parse message data:", e.data);
              return;
            }

            // Adjust iframe dimensions based on received data
            iframe.width = dimensions.width;
            iframe.height = dimensions.height;

            // Send a confirmation message back to the iframe
            iframe.contentWindow?.postMessage(
              "dca5da04-3c5b-4b37-a531-aed53430da2a",
              "https://www.agentic.co.za/chatbot/"
            );
          };

          // Add the message event listener
          window.addEventListener("message", handleMessage);

          // Clean up the event listener when the component is unmounted
          return () => {
            window.removeEventListener("message", handleMessage);
          };
        };

        // Clean up the iframe when the component is unmounted
        return () => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
          if (document.head.contains(style)) {
            document.head.removeChild(style);
          }
        };
      } catch (error) {
        console.error("Error initializing the iframe:", error);
      }
    };

    //www.agentic.co.za

    // Initialize the iframe immediately
    https: initializeIframe();

    return () => {
      // Clean up if necessary
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default ChatbotFrame;
