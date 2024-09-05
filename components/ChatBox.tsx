// import React, { useState } from 'react';
// import { FaComments, FaPaperPlane, FaCopy, FaExpand, FaCompress } from 'react-icons/fa';

// interface ChatMessage {
//   sender: string;
//   text: string;
// }

// interface ChatBoxProps {
//   chatMessages: ChatMessage[];
//   onSendMessage: (message: string) => void;
//   isChatExpanded: boolean;
//   onToggleChat: () => void;
// }

// const ChatBox: React.FC<ChatBoxProps> = ({ chatMessages, onSendMessage, isChatExpanded, onToggleChat }) => {
//   const [chatInput, setChatInput] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (chatInput.trim()) {
//       onSendMessage(chatInput);
//       setChatInput('');
//     }
//   };

//   return (
//     <div className={`bg-gradient-to-br from-[#101329] to-[#222c3c] rounded-lg shadow-lg p-6 backdrop-blur-sm mb-8 border border-[#3F51B5] hover:shadow-xl transition-all duration-300 ${isChatExpanded ? 'w-full' : ''}`}>
//       <div className="flex justify-between items-center mb-6">
//         <h3 className="text-3xl font-semibold text-[#64B5F6] flex items-center">
//           <FaComments className="mr-3 text-[#2196F3]" /> AI Chat
//         </h3>
//         <button
//           onClick={onToggleChat}
//           className="bg-[#2196F3] text-white px-4 py-2 rounded-full hover:bg-[#1E88E5] transition font-medium text-sm flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
//         >
//           {isChatExpanded ? <><FaCompress className="mr-2" /> Minimize</> : <><FaExpand className="mr-2" /> Expand</>}
//         </button>
//       </div>

//       <div className="h-80 overflow-y-auto mb-6 bg-[#0a1625] rounded-lg p-4 scrollbar-thin scrollbar-thumb-[#2196F3] scrollbar-track-[#1A237E] custom-scrollbar">
//         {chatMessages.map((msg, index) => (
//           <div
//             key={index}
//             className={`mb-4 ${
//               msg.sender === 'user' ? 'text-right' : 'text-left'
//             }`}
//           >
//             <span
//               className={`inline-block p-3 rounded-lg ${
//                 msg.sender === 'user'
//                   ? 'bg-[#2196F3] text-white'
//                   : 'bg-[#64B5F6] text-[#0A1929]'
//               } shadow-md animate-fadeInUp relative group max-w-[80%]`}
//             >
//               {msg.text}
//               {msg.sender === 'ai' && (
//                 <button
//                   onClick={() => navigator.clipboard.writeText(msg.text)}
//                   className="absolute top-0 right-0 mt-1 mr-1 bg-[#1A237E] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3F51B5]"
//                   title="Copy to clipboard"
//                 >
//                   <FaCopy size={14} />
//                 </button>
//               )}
//             </span>
//           </div>
//         ))}
//       </div>

//       <form onSubmit={handleSubmit} className="flex">
//         <input
//           type="text"
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           placeholder="Ask about the plant..."
//           className="flex-grow bg-[#0A1929] text-white rounded-l-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#2196F3] placeholder-[#4FC3F7]"
//         />
//         <button
//           type="submit"
//           className="bg-[#2196F3] text-white px-6 py-3 rounded-r-full hover:bg-[#1E88E5] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
//         >
//           <FaPaperPlane className="text-lg" />
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ChatBox;