
        // <div className="flex justify-end space-x-2 mb-4">
        //   {['en', 'fr', 'rw'].map((lang) => (
        //     <button
        //       key={lang}
        //       onClick={() => translateResult(lang as 'en' | 'fr' | 'rw')}
        //       className={`px-3 py-1 rounded bg-gray-300 text-black hover:bg-green-500 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        //       disabled={!result || loading}
        //     >
        //       {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Kinyarwanda'}
        //     </button>
        //   ))}
        // </div>

// 'use client'

// import { useState, useRef } from 'react'
// import Image from 'next/image'
// import { GoogleGenerativeAI } from '@google/generative-ai'

// // Move this initialization to the component to avoid issues with server-side rendering
// // const genAI = new GoogleGenerativeAI("AIzaSyCr9LRa1zi5rwwTlibFmRu2r0rbug8S-Ow")

// export default function PlantIdentifier() {
//   const [image, setImage] = useState<string | null>(null)
//   const [result, setResult] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => setImage(e.target?.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleCameraCapture = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   const identifyPlant = async () => {
//     if (!image) return;
//     setLoading(true);
//     try {
//       console.log("Starting plant identification...");
//       const genAI = new GoogleGenerativeAI('AIzaSyCr9LRa1zi5rwwTlibFmRu2r0rbug8S-Ow');
//       console.log("GenAI initialized");
//       const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//       console.log("Model obtained");
//       const result = await model.generateContent([
//         'Identify this plant and provide its name, distribution, and other important information. ' +
//         'Then, assess the health of the plant (Good or Bad) based on the image. ' +
//         'If the health appears Bad, identify any visible diseases or issues. ' +
//         'Format the response as follows:\n' +
//         'Plant Information:\n' +
//         '[Provide plant name, distribution, and other details here]\n\n' +
//         'Health Assessment:\n' +
//         'Status: [Good/Bad]\n' +
//         'Diseases/Issues: [List if any, or "None identified" if health is Good]',
//         { inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' } },
//       ]);
//       console.log("Content generated:", result);

//       const processedText = result.response.text().replace(/\*\*/g, '');
//       setResult(processedText);
//     } catch (error) {
//       console.error('Detailed error in identifying plant:', error);
//       setResult(`Error identifying plant: ${error instanceof Error ? error.message : String(error)}`);
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#1B4332] text-[#52B788]">
//       {/* Navigation Bar */}
//       <nav className="bg-[#081C15] border-b-2 border-[#52B788] p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <h1 className="text-2xl font-bold">PlantID</h1>
//           <ul className="flex space-x-4">
//             <li><a href="#" className="hover:text-green-300">Home</a></li>
//             <li><a href="#" className="hover:text-green-300">About</a></li>
//             <li><a href="#" className="hover:text-green-300">Contact</a></li>
//             <li><a href="#" className="hover:text-green-300">Help</a></li>
//           </ul>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="container mx-auto p-4">
//         <div className="bg-[#081C15] rounded-lg border-2 border-[#52B788] shadow-lg p-6 mb-8">
//           <h2 className="text-4xl text-[#52B788] font-bold text-center mb-6">Plant Identifier</h2>
//           <div className="flex justify-center space-x-4 mb-6">
//             <label className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-600 transition">
//               Upload Image
//               <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//             </label>
//             <button
//               onClick={handleCameraCapture}
//               className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
//             >
//               Take Photo
//             </button>
//             <input
//               type="file"
//               accept="image/*"
//               capture="environment"
//               onChange={handleImageUpload}
//               ref={fileInputRef}
//               className="hidden"
//             />
//           </div>
//           {image && (
//             <div className="flex flex-col items-center mb-6">
//               <Image src={image} alt="Uploaded plant" width={300} height={300} className="border-2 border-[#52B788] shadow-lg rounded-lg mb-4" />
//               <button
//                 onClick={identifyPlant}
//                 className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
//                 disabled={loading}
//               >
//                 {loading ? 'Identifying...' : 'Identify Plant'}
//               </button>
//             </div>
//           )}

//           {result && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-1.6 mt-8">
//               <div className="bg-[#081C15] p-6 rounded-lg border-2 border-[#52B788] shadow-lg">
//                 <div className="flex items-center mb-4">
//                   <svg className="w-6 h-6 mr-2 text-[#52B788]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
//                   </svg>
//                   <h2 className="text-2xl font-semibold text-[#52B788]">Plant Information</h2>
//                 </div>
//                 <p className="text-white whitespace-pre-wrap">
//                   {result.split('Health Assessment:')[0].replace('Plant Information:', '').trim()}
//                 </p>
//               </div>
//               <div className="bg-[#081C15] p-6 rounded-lg border-2 border-[#52B788] shadow-lg">
//                 <div className="flex items-center mb-4">
//                   <svg className="w-6 h-6 mr-2 text-[#52B788]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h2 className="text-2xl font-semibold text-[#52B788]">Health Assessment</h2>
//                 </div>
//                 {result.split('Health Assessment:')[1].split('\n').map((line, index) => {
//                   if (line.startsWith('Status:')) {
//                     const status = line.split(':')[1].trim();
//                     return (
//                       <p key={index} className={`font-bold text-xl ${status === 'Good' ? 'text-green-500' : 'text-red-500'}`}>
//                         {status}
//                       </p>
//                     );
//                   } else if (line.startsWith('Diseases/Issues:')) {
//                     return (
//                       <div key={index} className="mt-2">
//                         <p className="font-semibold text-[#52B788]">Diseases/Issues:</p>
//                         <p className="text-white">{line.split(':')[1].trim()}</p>
//                       </div>
//                     );
//                   }
//                   return null;
//                 })}
//               </div>
//             </div>
//           )}
//         </div>

      
//         <div className="bg-[#081C15] border-l-4 border-yellow-500 text-yellow-700 p-4">
//           <h3 className="font-bold">How to use:</h3>
//           <ol className="list-decimal list-inside">
//             <li>Upload or take a photo of a plant</li>
//             <li>Click "Identify Plant"</li>
//             <li>Get information on the plant's name, distribution, and health</li>
//           </ol>
//         </div>
//       </main>

//       {/* Footer */}
//       <footer className="bg-[#081C15] border-t-2 border-[#52B788] text-[#52B788] py-8">
//         <div className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div>
//               <h3 className="text-xl font-bold mb-2">About Plant Identifier</h3>
//               <p>Our AI-powered plant identification tool helps you discover and learn about various plant species quickly and accurately.</p>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2">Quick Links</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="hover:text-green-300">Privacy Policy</a></li>
//                 <li><a href="#" className="hover:text-green-300">Terms of Service</a></li>
//                 <li><a href="#" className="hover:text-green-300">FAQ</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-xl font-bold mb-2">Contact Us</h3>
//               <p>Email: info@plantidentifier.com</p>
//               <p>Phone: (123) 456-7890</p>
//             </div>
//           </div>
//           <div className="mt-7 text-center">
//             <p>&copy; 2024 Plant Identifier. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   )
// }



// components/PlantIdentifier.tsx

// components/PlantIdentifier.tsx

// 'use client'

// import { useState, useRef } from 'react'
// import Image from 'next/image'
// import { GoogleGenerativeAI } from '@google/generative-ai'
// import Navigation from './Navigation'
// import Footer from './Footer'
// import ImageUpload from './ImageUpload'
// import ResultDisplay from './ResultDisplay'

// // ... rest of your PlantIdentifier component code

// export default function PlantIdentifier() {
//   const [image, setImage] = useState<string | null>(null)
//   const [result, setResult] = useState<string | null>(null)
//   const [translatedResult, setTranslatedResult] = useState<string | null>(null)
//   const [loading, setLoading] = useState(false)
//   const [darkMode, setDarkMode] = useState(false)
//   const fileInputRef = useRef<HTMLInputElement>(null)

//   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => setImage(e.target?.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleCameraCapture = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click()
//     }
//   }

//   const identifyPlant = async () => {
//     if (!image) return
//     setLoading(true)
//     try {
//       const genAI = new GoogleGenerativeAI('YOUR_API_KEY')
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
//       const result = await model.generateContent({
//         contents: [{
//           role: "user",
//           parts: [
//             { text: 'Identify this plant and provide its name, distribution, and other important information. ' +
//               'Then, assess the health of the plant (Good or Bad) based on the image. ' +
//               'Format the response as follows:\n' +
//               'Plant Information:\n' +
//               '[Provide plant name, distribution, and other details here]\n\n' +
//               'Health Assessment:\n' +
//               'Status: [Good/Bad]\n' +
//               'If Status is Good:\n' +
//               'Appearance: -[Describe how the plant looks when healthy]\n' +
//               'Maintenance Tips: -[Provide 3-4 tips for maintaining good health]\n' +
//               'If Status is Bad:\n' +
//               'Diseases/Issues: -[List any visible diseases or issues]\n' +
//               'Mitigation: -[Provide 3-4 strategies to address the identified issues]\n' +
//               '\nPlease ensure the response is detailed but concise, focusing on the most relevant information for each section.'
//             },
//             {
//               inlineData: {
//                 mimeType: "image/jpeg",
//                 data: image.split(',')[1]
//               }
//             }
//           ]
//         }]
//       })
  
//       const processedText = result.response.text().replace(/\*\*/g, '')
//       setResult(processedText)
//       setTranslatedResult(processedText)
//     } catch (error) {
//       const errorMessage = `Error identifying plant: ${error instanceof Error ? error.message : String(error)}`
//       setResult(errorMessage)
//       setTranslatedResult(errorMessage)
//     }
//     setLoading(false)
//   }

//   const translateResult = async (lang: 'en' | 'fr' | 'rw') => {
//     if (!result) return;
  
//     setLoading(true);
//     try {
//       const response = await fetch('/api/translate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ text: result, lang }),
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Translation failed');
//       }
      
//       const data = await response.json();
//       setTranslatedResult(data.translatedText);
//     } catch (error) {
//       console.error('Translation error:', error);
//       if (error instanceof Error && error.message.includes('Too Many Requests')) {
//         setTranslatedResult("Translation limit reached. Please try again later.");
//       } else {
//         setTranslatedResult(`Translation error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//   }

//   return (
//     <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#1B4332] text-[#52B788]'}`}>
//       <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
//       <main className="container mx-auto p-4">
//         <div className={`${darkMode ? 'bg-gray-800' : 'bg-[#081C15]'} rounded-lg border-2 border-[#52B788] shadow-lg p-6 mb-8`}>
//           <h2 className="text-4xl text-[#52B788] font-bold text-center mb-6">Plant Identifier</h2>
//           <ImageUpload
//             handleImageUpload={handleImageUpload}
//             handleCameraCapture={handleCameraCapture}
//             fileInputRef={fileInputRef}
//             image={image}
//             identifyPlant={identifyPlant}
//             loading={loading}
//           />
//           <ResultDisplay
//             translatedResult={translatedResult}
//             translateResult={translateResult}
//             result={result}
//             loading={loading}
//             darkMode={darkMode}
//           />
//         </div>
//       </main>
//       <Footer darkMode={darkMode} />
//     </div>
//   )
// }








// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

// interface ImageType {
//   url: string;
//   name: string;
// }

// interface CoolImageDisplayProps {
//   images: ImageType[];
// }

// const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => {
//   const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && selectedImage) {
//         setSelectedImage(null);
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedImage]);

//   useEffect(() => {
//     const scrollInterval = setInterval(() => {
//       if (scrollRef.current) {
//         const scrollWidth = scrollRef.current.scrollWidth;
//         const clientWidth = scrollRef.current.clientWidth;
//         const maxScroll = scrollWidth - clientWidth;
        
//         if (scrollRef.current.scrollLeft >= maxScroll) {
//           scrollRef.current.scrollLeft = 0;
//         } else {
//           scrollRef.current.scrollLeft += 1;
//         }
//       }
//     }, 50);

//     return () => clearInterval(scrollInterval);
//   }, []);

//   const handleImageClick = (img: ImageType) => {
//     setSelectedImage(img);
//     setIsZoomed(false);
//   };

//   const handleZoom = () => {
//     setIsZoomed(!isZoomed);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
//   };

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
//   };

//   return (
//     <div className="mb-8 overflow-hidden bg-purple-900 rounded-lg p-6">
//       <h2 className="text-3xl font-bold text-white mb-4">Plant Gallery</h2>
//       <div className="relative">
//         <div
//           ref={scrollRef}
//           className="flex space-x-4 py-4 overflow-x-hidden"
//         >
//           {images.concat(images).map((img: ImageType, index: number) => (
//             <motion.div
//               key={index}
//               className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer"
//               whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)' }}
//               onClick={() => handleImageClick(img)}
//             >
//               <Image
//                 src={img.url}
//                 alt={img.name}
//                 layout="fill"
//                 objectFit="cover"
//                 className="transition-all duration-500 hover:saturate-150"
//               />
//             </motion.div>
//           ))}
//         </div>
//         <button
//           className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-purple-700 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-300"
//           onClick={handlePrev}
//         >
//           <ChevronLeft size={24} />
//         </button>
//         <button
//           className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-purple-700 text-white p-2 rounded-full shadow-lg hover:bg-purple-600 transition-colors duration-300"
//           onClick={handleNext}
//         >
//           <ChevronRight size={24} />
//         </button>
//       </div>

//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
//             onClick={() => setSelectedImage(null)}
//           >
//             <motion.div
//               className="relative max-w-4xl max-h-[90vh] bg-[#1a0f2e] p-4 rounded-lg shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             >
//               <div className={`relative ${isZoomed ? 'w-[120vw] h-[120vh]' : 'w-full h-full'} overflow-auto`}>
//                 <Image
//                   src={selectedImage.url}
//                   alt={selectedImage.name}
//                   layout="responsive"
//                   width={1200}
//                   height={800}
//                   objectFit="contain"
//                   className="transition-all duration-300"
//                 />
//               </div>
//               <motion.button
//                 className="absolute top-2 right-2 bg-[#52B788] text-white p-2 rounded-full shadow-lg hover:bg-[#3a9d6e] transition-colors duration-300"
//                 onClick={handleZoom}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
//               </motion.button>
//               <motion.h3
//                 className="text-white text-xl font-semibold mt-4 text-center"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 {selectedImage.name}
//               </motion.h3>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CoolImageDisplay;




// import React, { useState, useEffect } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ZoomIn, ZoomOut } from 'lucide-react';

// interface ImageType {
//   url: string;
//   name: string;
// }

// interface CoolImageDisplayProps {
//   images: ImageType[];
// }

// const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => {
//   const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
//   const [isZoomed, setIsZoomed] = useState(false);

//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === 'Escape' && selectedImage) {
//         setSelectedImage(null);
//       }
//     };
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedImage]);

//   const handleImageClick = (img: ImageType) => {
//     setSelectedImage(img);
//     setIsZoomed(false);
//   };

//   const handleZoom = () => {
//     setIsZoomed(!isZoomed);
//   };

//   return (
//     <div className="relative mb-8 overflow-hidden">
//       <motion.div 
//         className="flex space-x-4 py-4"
//         animate={{ x: [0, -1000, 0] }}
//         transition={{ 
//           x: {
//             repeat: Infinity,
//             repeatType: "loop",
//             duration: 20,
//             ease: "linear",
//           },
//         }}
//       >
//         {images.concat(images).map((img: ImageType, index: number) => (
//           <motion.div
//             key={index}
//             className="relative w-64 h-64 flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer"
//             whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)' }}
//             onClick={() => handleImageClick(img)}
//           >
//             <Image
//               src={img.url}
//               alt={img.name}
//               layout="fill"
//               objectFit="cover"
//               className="transition-all duration-500 hover:saturate-150"
//             />
//             <motion.div 
//               className="absolute inset-0 bg-gradient-to-t from-[#130a2a] via-transparent to-transparent"
//               initial={{ opacity: 0 }}
//               whileHover={{ opacity: 1 }}
//               transition={{ duration: 0.3 }}
//             >
//               <p className="absolute bottom-2 left-2 text-white text-sm font-light">
//                 {img.name}
//               </p>
//             </motion.div>
//           </motion.div>
//         ))}
//       </motion.div>

//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
//             onClick={() => setSelectedImage(null)}
//           >
//             <motion.div
//               className="relative max-w-4xl max-h-[90vh] bg-[#1a0f2e] p-4 rounded-lg shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             >
//               <div className={`relative ${isZoomed ? 'w-[120vw] h-[120vh]' : 'w-full h-full'} overflow-auto`}>
//                 <Image
//                   src={selectedImage.url}
//                   alt={selectedImage.name}
//                   layout="responsive"
//                   width={1200}
//                   height={800}
//                   objectFit="contain"
//                   className="transition-all duration-300"
//                 />
//               </div>
//               <motion.button
//                 className="absolute top-2 right-2 bg-[#52B788] text-white p-2 rounded-full shadow-lg hover:bg-[#3a9d6e] transition-colors duration-300"
//                 onClick={handleZoom}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
//               </motion.button>
//               <motion.h3
//                 className="text-white text-xl font-semibold mt-4 text-center"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 {selectedImage.name}
//               </motion.h3>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CoolImageDisplay;





import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageType {
  url: string;
  name: string;
}

interface CoolImageDisplayProps {
  images: ImageType[];
}

const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedImage) {
        setSelectedImage(null);
      } else if (e.key === 'ArrowLeft') {
        navigateImages(-1);
      } else if (e.key === 'ArrowRight') {
        navigateImages(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex]);

  const handleImageClick = (img: ImageType, index: number) => {
    setSelectedImage(img);
    setCurrentIndex(index);
    setIsZoomed(false);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const navigateImages = (direction: number) => {
    const newIndex = (currentIndex + direction + images.length) % images.length;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const scrollCarousel = (direction: number) => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: direction * 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-8 overflow-hidden bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold text-white mb-6 text-center">Plant Gallery</h2>
      <div className="relative">
        <motion.div 
          ref={carouselRef}
          className="flex space-x-4 py-4 overflow-x-auto hide-scrollbar"
          whileTap={{ cursor: "grabbing" }}
        >
          {images.map((img: ImageType, index: number) => (
            <motion.div
              key={index}
              className="relative w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden shadow-lg cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => handleImageClick(img, index)}
            >
              <Image
                src={img.url}
                alt={img.name}
                layout="fill"
                objectFit="cover"
                className="transition-all duration-500 hover:saturate-150"
              />
            </motion.div>
          ))}
        </motion.div>
        <button
          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
          onClick={() => scrollCarousel(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
          onClick={() => scrollCarousel(1)}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-gradient-to-r from-purple-900 to-indigo-900 p-6 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={`relative ${isZoomed ? 'w-[120vw] h-[120vh]' : 'w-full h-full'} overflow-auto`}>
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  layout="responsive"
                  width={1200}
                  height={800}
                  objectFit="contain"
                  className="transition-all duration-300"
                />
              </div>
              <motion.button
                className="absolute top-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
                onClick={handleZoom}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
              </motion.button>
              <motion.button
                className="absolute top-2 left-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
                onClick={() => setSelectedImage(null)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={24} />
              </motion.button>
              <motion.h3
                className="text-white text-2xl font-semibold mt-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {selectedImage.name}
              </motion.h3>
              <div className="absolute left-4 right-4 top-1/2 transform -translate-y-1/2 flex justify-between">
                <motion.button
                  className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
                  onClick={() => navigateImages(-1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronLeft size={24} />
                </motion.button>
                <motion.button
                  className="bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300"
                  onClick={() => navigateImages(1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronRight size={24} />
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoolImageDisplay;