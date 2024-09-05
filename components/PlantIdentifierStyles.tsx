import React from 'react';

const PlantIdentifierStyles: React.FC = () => (
  <style jsx global>{`
    @keyframes neonPulse {
      0%, 100% { text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff; }
      50% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
    }

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

    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

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
  `}</style>
);

export default PlantIdentifierStyles;