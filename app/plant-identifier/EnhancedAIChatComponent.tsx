// import React, { useState, useRef, useEffect } from 'react';
// import { FaComments, FaCompress, FaCopy, FaPaperPlane, FaMicrophone, FaStop } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// const styles = `
//   @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap');

//   .chat-container {
//     font-family: 'Roboto', sans-serif;
//     height: 60vh;
//     overflow-y: auto;
//     padding: 1rem;
//     scroll-behavior: smooth;
//   }

//   .message {
//     max-width: 80%;
//     margin-bottom: 1rem;
//     padding: 0.75rem 1rem;
//     border-radius: 1rem;
//     position: relative;
//     transition: all 0.3s ease;
//   }

//   .message:hover {
//     transform: translateY(-2px);
//     box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   }

//   .user-message {
//     background-color: rgba(33, 150, 243, 0.1);
//     color: #E3F2FD;
//     margin-left: auto;
//     border-bottom-right-radius: 0;
//   }

//   .ai-message {
//     background-color: rgba(76, 175, 80, 0.1);
//     color: #E8F5E9;
//     margin-right: auto;
//     border-bottom-left-radius: 0;
//   }

//   .custom-scrollbar::-webkit-scrollbar {
//     width: 6px;
//   }

//   .custom-scrollbar::-webkit-scrollbar-track {
//     background: rgba(255, 255, 255, 0.1);
//   }

//   .custom-scrollbar::-webkit-scrollbar-thumb {
//     background-color: rgba(255, 255, 255, 0.3);
//     border-radius: 3px;
//   }

//   .typing-indicator::after {
//     content: '...';
//     animation: ellipsis 1.5s infinite;
//   }

//   @keyframes ellipsis {
//     0% { content: '.'; }
//     33% { content: '..'; }
//     66% { content: '...'; }
//   }

//   .input-container {
//     background-color: rgba(255, 255, 255, 0.05);
//     border-top: 1px solid rgba(255, 255, 255, 0.1);
//     padding: 1rem;
//   }

//   .voice-button {
//     background-color: #4CAF50;
//     color: white;
//     border: none;
//     border-radius: 50%;
//     width: 40px;
//     height: 40px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     cursor: pointer;
//     transition: all 0.3s ease;
//   }

//   .voice-button:hover {
//     background-color: #45a049;
//     transform: scale(1.05);
//   }

//   .voice-button.recording {
//     animation: pulse 1.5s infinite;
//   }

//   @keyframes pulse {
//     0% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
//     70% { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
//     100% { box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
//   }
// `;

// const TypewriterEffect = ({ text, onComplete }) => {
//   const [displayText, setDisplayText] = useState("");
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (currentIndex < text.length) {
//       const timeout = setTimeout(() => {
//         setDisplayText((prev) => prev + text[currentIndex]);
//         setCurrentIndex((prev) => prev + 1);
//       }, Math.random() * 30 + 10);
//       return () => clearTimeout(timeout);
//     } else {
//       onComplete();
//     }
//   }, [currentIndex, text, onComplete]);

//   return (
//     <span>
//       {displayText}
//       {currentIndex < text.length && <span className="typing-indicator" />}
//     </span>
//   );
// };

// const EnhancedAIChatComponent = () => {
//   const [isChatExpanded, setIsChatExpanded] = useState(true);
//   const [animate, setAnimate] = useState(true);
//   const [chatMessages, setChatMessages] = useState([]);
//   const [chatInput, setChatInput] = useState("");
//   const [animatingMessage, setAnimatingMessage] = useState("");
//   const [isRecording, setIsRecording] = useState(false);
//   const chatContainerRef = useRef(null);

//   const toggleChatExpansion = () => {
//     setAnimate(false);
//     setTimeout(() => {
//       setIsChatExpanded(!isChatExpanded);
//       setAnimate(true);
//     }, 300);
//   };

//   const handleChatSubmit = (e) => {
//     e.preventDefault();
//     if (chatInput.trim() === "") return;

//     const newUserMessage = { sender: "user", text: chatInput };
//     setChatMessages((prev) => [...prev, newUserMessage]);
//     setChatInput("");

//     // Simulate AI response
//     setTimeout(() => {
//       const aiResponse = { sender: "ai", text: "This is a sample AI response." };
//       setAnimatingMessage(aiResponse.text);
//     }, 1000);
//   };

//   const handleTypewriterComplete = () => {
//     setChatMessages((prev) => [
//       ...prev,
//       { sender: "ai", text: animatingMessage },
//     ]);
//     setAnimatingMessage("");
//   };

//   const toggleVoiceRecording = () => {
//     setIsRecording(!isRecording);
//     // Implement actual voice recording logic here
//   };

//   useEffect(() => {
//     chatContainerRef.current?.scrollTo(0, chatContainerRef.current.scrollHeight);
//   }, [chatMessages, animatingMessage]);

//   return (
//     <>
//       <style>{styles}</style>
//       <AnimatePresence>
//         {isChatExpanded && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             exit={{ opacity: 0, scale: 0.95 }}
//             transition={{ duration: 0.3 }}
//             className="sticky top-20 z-10 mt-8"
//           >
//             <div className="bg-gradient-to-br from-[#191e41] to-[#222c3c] rounded-lg shadow-lg p-6 backdrop-blur-sm mb-8 border border-[#3F51B5] hover:shadow-xl transition-all duration-300">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-2xl font-light text-[#66b5f6] flex items-center">
//                   <FaComments className="mr-2" /> AI Chat
//                 </h3>
//                 <button
//                   onClick={toggleChatExpansion}
//                   className="bg-gradient-to-br from-[#0a0c1b] to-[#24334c] text-[#66b5f6] px-3 py-1 rounded hover:bg-[#25e2bf] transition font-light text-sm flex items-center"
//                 >
//                   <FaCompress className="mr-1" /> Minimize
//                 </button>
//               </div>
//               <div
//                 ref={chatContainerRef}
//                 className="chat-container custom-scrollbar"
//               >
//                 <AnimatePresence>
//                   {chatMessages.map((msg, index) => (
//                     <motion.div
//                       key={index}
//                       initial={{ opacity: 0, y: 20 }}
//                       animate={{ opacity: 1, y: 0 }}
//                       exit={{ opacity: 0, y: -20 }}
//                       transition={{ duration: 0.3 }}
//                       className={`message group ${
//                         msg.sender === "user" ? "user-message" : "ai-message"
//                       }`}
//                     >
//                       {msg.text}
//                       {msg.sender === "ai" && (
//                         <button
//                           onClick={() => navigator.clipboard.writeText(msg.text)}
//                           className="absolute top-0 right-0 mt-1 mr-1 bg-[#0e4145] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
//                           title="Copy to clipboard"
//                         >
//                           <FaCopy className="text-[#191e49]" size={12} />
//                         </button>
//                       )}
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//                 {animatingMessage && (
//                   <div className="message ai-message">
//                     <TypewriterEffect
//                       text={animatingMessage}
//                       onComplete={handleTypewriterComplete}
//                     />
//                   </div>
//                 )}
//               </div>
//               <div className="input-container">
//                 <form onSubmit={handleChatSubmit} className="flex mt-4">
//                   <input
//                     type="text"
//                     value={chatInput}
//                     onChange={(e) => setChatInput(e.target.value)}
//                     placeholder="Ask about the image..."
//                     className="flex-grow bg-[#0A1929] text-white rounded-l-full py-3 px-6 focus:outline-none focus:ring-1 focus:ring-[#2196F3] placeholder-[#4FC3F7]"
//                   />
//                   <button
//                     type="submit"
//                     className="bg-[#2196F3] text-white px-6 py-3 rounded-r-full hover:bg-[#29cdd3] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
//                   >
//                     <FaPaperPlane />
//                   </button>
//                   <button
//                     type="button"
//                     onClick={toggleVoiceRecording}
//                     className={`voice-button ml-2 ${isRecording ? 'recording' : ''}`}
//                   >
//                     {isRecording ? <FaStop /> : <FaMicrophone />}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// };

// export default EnhancedAIChatComponent;