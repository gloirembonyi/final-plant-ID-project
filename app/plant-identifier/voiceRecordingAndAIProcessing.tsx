// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// // ... (other imports)

// const Dashboard: React.FC = () => {
//   // ... (existing state variables)
//   const [isRecording, setIsRecording] = useState(false);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const audioChunksRef = useRef<Blob[]>([]);
//   const [animatingMessage, setAnimatingMessage] = useState<string | null>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);


//   const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>, inputText?: string) => {
//     e.preventDefault();
//     const chatInput = inputText || (e.target as HTMLFormElement).elements.namedItem('chatInput') as HTMLInputElement;
//     if ((!chatInput.value.trim() && !inputText) || !image) return;

//     const userMessage: Message = { sender: "user", text: inputText || chatInput.value };
//     setChatMessages((prev) => [...prev, userMessage]);
//     setChatInput("");
//     setLoading(true);

//     try {
//       const chatContext: ChatContextType = {
//         plantInfo: result?.plantInfo || "",
//         previousMessages: chatMessages,
//       };

//       const aiResponse = await processAIResponse(inputText || chatInput.value, image, chatContext);
//       const processedResponse = aiResponse.replace(/(\*\*|\#\#)/g, "");
//       setAnimatingMessage(processedResponse);
//     } catch (error) {
//       console.error("Error processing AI response:", error);
//       const errorMessage: Message = {
//         sender: "ai",
//         text: "Oops! 😅 I encountered an error. Let's try that again, shall we?",
//       };
//       setChatMessages((prev) => [...prev, errorMessage]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const processAIResponse = async (
//     input: string,
//     imageData: string,
//     context: ChatContextType
//   ): Promise<string> => {
//     const genAI = new GoogleGenerativeAI(
//       process.env.GOOGLE_AI_API_KEY || "AIzaSyDgtX4r0SbnGD1bluGrkDBN45OKG8UFSW4"
//     );
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
//     const contextString = JSON.stringify(context);

//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `Using the image I've uploaded and the context provided: ${contextString}, please focus on giving a clear and accurate answer to this question: ${input}. 
//               Consider our previous messages to ensure your response is coherent and fits naturally within the conversation. 
//               Keep the tone friendly and engaging—feel free to use emojis, but prioritize delivering the most relevant and helpful answer! 😊`,
//             },
//             {
//               inlineData: {
//                 mimeType: "image/jpeg",
//                 data: imageData.split(",")[1],
//               },
//             },
//           ],
//         },
//       ],
//     });

//     return result.response.text();
//   };

//   const toggleVoiceRecording = useCallback(async () => {
//     if (!isRecording) {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//         mediaRecorderRef.current = new MediaRecorder(stream);
//         audioChunksRef.current = [];

//         mediaRecorderRef.current.ondataavailable = (event) => {
//           audioChunksRef.current.push(event.data);
//         };

//         mediaRecorderRef.current.onstop = async () => {
//           const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//           const audioText = await convertSpeechToText(audioBlob);
          
//           if (audioText) {
//             handleChatSubmit(new Event('submit') as React.FormEvent<HTMLFormElement>, audioText);
//           } else {
//             const errorMessage: Message = { sender: "ai", text: "Sorry, I couldn't understand the audio. Could you please try again?" };
//             setChatMessages((prev) => [...prev, errorMessage]);
//           }
          
//           // Clean up
//           stream.getTracks().forEach(track => track.stop());
//         };

//         mediaRecorderRef.current.start();
//         setIsRecording(true);
//       } catch (err) {
//         console.error("Error accessing microphone:", err);
//       }
//     } else {
//       mediaRecorderRef.current?.stop();
//       setIsRecording(false);
//     }
//   }, [isRecording]);

//   const convertSpeechToText = async (audioBlob: Blob): Promise<string | null> => {
//     // This is a placeholder function. You need to implement actual speech-to-text conversion here.
//     // You can use services like Google Cloud Speech-to-Text API or other similar services.
//     // For now, we'll return a dummy text to simulate the conversion.
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve("This is a simulated transcription of the voice message.");
//       }, 1000);
//     });
//   };

//   // ... (rest of the component code)

//   return (
//     <div>
//       {/* ... (existing JSX) */}
//       <form onSubmit={handleChatSubmit}>
//         <input
//           type="text"
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           placeholder="Ask a question..."
//         />
//         <button type="submit">Send</button>
//         <button type="button" onClick={toggleVoiceRecording}>
//           {isRecording ? "Stop Recording" : "Start Recording"}
//         </button>
//       </form>
//       {/* ... (rest of the JSX) */}
//     </div>
//   );
// };

// export default Dashboard;