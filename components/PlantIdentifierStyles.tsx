import React from 'react';

const PlantIdentifierStyles: React.FC = () => (
  <style jsx global>{`
    /* Fonts */
    @import url("https://fonts.googleapis.com/css?family=Anonymous+Pro");

    /* Animations */
    @keyframes neonPulse {
      0%,
      100% {
        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff;
      }
      50% {
        text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pulse {
      0% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
      }
      70% {
        transform: scale(1);
        box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
      }
      100% {
        transform: scale(0.95);
        box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
      }
    }

    /* Neon text and buttons */
    .neon-text {
      animation: neonPulse 2s infinite;
    }

    .neon-button {
      box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
      transition: all 0.3s ease;
    }

    .neon-button:hover {
      box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    }

    /* Parallax effect */
    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    /* Scrollbar styles */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(82, 183, 136, 0.5) rgba(255, 255, 255, 0.1);
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(82, 183, 136, 0.5);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(82, 183, 136, 0.7);
    }

    /* Chat styles */
    .chat-container {
      position: relative;
      height: 80vh;
      overflow-y: auto;
      scroll-behavior: smooth;
    }

    .message-container {
      padding-bottom: 60px;
    }

    .message {
      max-width: 80%;
      margin-bottom: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      position: relative;
      transition: all 0.3s ease;
    }

    .message:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .user-message {
      background-color: rgba(33, 150, 243, 0.1);
      color: #e3f2fd;
      margin-left: auto;
      border-bottom-right-radius: 0;
    }

    .ai-message {
      background-color: #0a3033;
      color: #e8f5e9;
      margin-right: auto;
      border-bottom-left-radius: 0;
    }

    /* Typing indicator */
    .typing-indicator::after {
      content: "▋";
      animation: blink 1s infinite;
    }

    /* Voice recording indicator */
    .voice-recording-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px;
      background-color: rgba(255, 0, 0, 0.1);
      border-radius: 20px;
      margin-bottom: 10px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 50%;
      color: white;
      background-color: #4caf50;
      border: none;
    }

    .pulse {
      width: 10px;
      height: 10px;
      background-color: red;
      border-radius: 50%;
      margin-right: 10px;
      animation: pulse 1s infinite;
    }

    /* Input container */
    .input-container {
      position: sticky;
      bottom: 0;
      background-color: #0a1929;
      padding: 10px;
      border-top: 1px solid #1fbac0;
    }
  `}</style>
);

export default PlantIdentifierStyles;
