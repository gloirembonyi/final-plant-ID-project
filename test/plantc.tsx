
        <div className="flex justify-end space-x-2 mb-4">
          {['en', 'fr', 'rw'].map((lang) => (
            <button
              key={lang}
              onClick={() => translateResult(lang as 'en' | 'fr' | 'rw')}
              className={`px-3 py-1 rounded bg-gray-300 text-black hover:bg-green-500 transition ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!result || loading}
            >
              {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Kinyarwanda'}
            </button>
          ))}
        </div>

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

'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { GoogleGenerativeAI } from '@google/generative-ai'
import Navigation from './Navigation'
import Footer from './Footer'
import ImageUpload from './ImageUpload'
import ResultDisplay from './ResultDisplay'

// ... rest of your PlantIdentifier component code

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [translatedResult, setTranslatedResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const identifyPlant = async () => {
    if (!image) return
    setLoading(true)
    try {
      const genAI = new GoogleGenerativeAI('YOUR_API_KEY')
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            { text: 'Identify this plant and provide its name, distribution, and other important information. ' +
              'Then, assess the health of the plant (Good or Bad) based on the image. ' +
              'Format the response as follows:\n' +
              'Plant Information:\n' +
              '[Provide plant name, distribution, and other details here]\n\n' +
              'Health Assessment:\n' +
              'Status: [Good/Bad]\n' +
              'If Status is Good:\n' +
              'Appearance: -[Describe how the plant looks when healthy]\n' +
              'Maintenance Tips: -[Provide 3-4 tips for maintaining good health]\n' +
              'If Status is Bad:\n' +
              'Diseases/Issues: -[List any visible diseases or issues]\n' +
              'Mitigation: -[Provide 3-4 strategies to address the identified issues]\n' +
              '\nPlease ensure the response is detailed but concise, focusing on the most relevant information for each section.'
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image.split(',')[1]
              }
            }
          ]
        }]
      })
  
      const processedText = result.response.text().replace(/\*\*/g, '')
      setResult(processedText)
      setTranslatedResult(processedText)
    } catch (error) {
      const errorMessage = `Error identifying plant: ${error instanceof Error ? error.message : String(error)}`
      setResult(errorMessage)
      setTranslatedResult(errorMessage)
    }
    setLoading(false)
  }

  const translateResult = async (lang: 'en' | 'fr' | 'rw') => {
    if (!result) return;
  
    setLoading(true);
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: result, lang }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }
      
      const data = await response.json();
      setTranslatedResult(data.translatedText);
    } catch (error) {
      console.error('Translation error:', error);
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        setTranslatedResult("Translation limit reached. Please try again later.");
      } else {
        setTranslatedResult(`Translation error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-[#1B4332] text-[#52B788]'}`}>
      <Navigation darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-[#081C15]'} rounded-lg border-2 border-[#52B788] shadow-lg p-6 mb-8`}>
          <h2 className="text-4xl text-[#52B788] font-bold text-center mb-6">Plant Identifier</h2>
          <ImageUpload
            handleImageUpload={handleImageUpload}
            handleCameraCapture={handleCameraCapture}
            fileInputRef={fileInputRef}
            image={image}
            identifyPlant={identifyPlant}
            loading={loading}
          />
          <ResultDisplay
            translatedResult={translatedResult}
            translateResult={translateResult}
            result={result}
            loading={loading}
            darkMode={darkMode}
          />
        </div>
      </main>
      <Footer darkMode={darkMode} />
    </div>
  )
}