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
    width: 450px; /* default width */
    height: 640px; /* default height */
  }
`);

    iframe.src = "https://www.agentic.co.za/chatbot";
    iframe.classList.add("chat-frame");
    document.body.appendChild(iframe);

    iframe.onload = () => {
      const handleMessage = (e: any) => {
        if (e.origin !== "https://www.agentic.co.za") return;

        let dimensions;
        if (typeof e.data === "string") {
          try {
            dimensions = JSON.parse(e.data);
          } catch (error) {
            console.error("Failed to parse message data as JSON:", e.data);
            return;
          }
        } else if (typeof e.data === "object") {
          dimensions = e.data;
        } else {
          console.error("Unexpected data type:", typeof e.data);
          return;
        }

        iframe.width = dimensions.width;
        iframe.height = dimensions.height;

        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            "666d5958-3680-443f-98d0-4a2fc13933d8",
            "https://www.agentic.co.za/"
          );
        }
      };

      window.addEventListener("message", handleMessage);

      // Clean up the event listener when the component is unmounted
      return () => {
        window.removeEventListener("message", handleMessage);
      };
    };

    // Clean up the iframe when the component is unmounted
    return () => {
      document.body.removeChild(iframe);
    };
  }, []);

  return null; // This component doesn't render anything directly
};

export default ChatbotFrame;
