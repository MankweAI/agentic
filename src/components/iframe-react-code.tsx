"use client";

import { useEffect } from "react";

const ChatbotFrame = () => {
  useEffect(() => {
    const iframe = document.createElement("iframe");

    const iframeStyles = (styleString: any) => {
      const style = document.createElement("style");
      style.textContent = styleString;
      document.head.append(style);
    };

    iframeStyles(`
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
    `);

    iframe.src = "http://localhost:3000/chatbot";
    iframe.classList.add("chat-frame");
    document.body.appendChild(iframe);

    window.addEventListener("message", (e) => {
      if (e.origin !== "http://localhost:3000") return null;
      let dimensions = JSON.parse(e.data);
      iframe.width = dimensions.width;
      iframe.height = dimensions.height;
      iframe.contentWindow?.postMessage(
        "dca5da04-3c5b-4b37-a531-aed53430da2a",
        "http://localhost:3000/"
      );
    });

    // Clean up on unmount
    return () => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    };
  }, []);

  return null;
};

export default ChatbotFrame;
