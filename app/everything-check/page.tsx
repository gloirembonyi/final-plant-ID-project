'use client'

import { SetStateAction} from 'react';
import { useCallback } from 'react'
import { FaSpinner } from 'react-icons/fa'
import Image from 'next/image'
import { FaArrowRight, FaCamera, FaUpload, FaHistory, FaSearch, FaInfoCircle } from 'react-icons/fa'
import { FaFacebookSquare, FaTwitterSquare, FaInstagramSquare, FaLinkedin } from 'react-icons/fa'
import { useState, useRef, useEffect, FormEvent } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FaComments, FaPaperPlane, FaCopy, FaExpand, FaCompress } from 'react-icons/fa';
import { FaObjectGroup, FaEye, FaMapMarkedAlt, FaCogs, FaLandmark, FaBalanceScale, FaLightbulb } from 'react-icons/fa';


const UniversalIdentifierStyles = () => (
  <style jsx global>{`
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideInRight {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }

    @keyframes glowPulse {
      0% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
      50% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.8); }
      100% { box-shadow: 0 0 5px rgba(0, 255, 255, 0.5); }
    }

    .animate-fadeInUp { animation: fadeInUp 0.5s ease-out forwards; }
    .animate-slideInRight { animation: slideInRight 0.5s ease-out forwards; }
    .glow { animation: glowPulse 2s infinite; }

    /* Custom scrollbar */
    .overflow-y-auto {
      scrollbar-width: thin;
      scrollbar-color: #00FFFF #0A2C3E;
    }
    .overflow-y-auto::-webkit-scrollbar {
      width: 8px;
    }
    .overflow-y-auto::-webkit-scrollbar-track {
      background: #0A2C3E;
    }
    .overflow-y-auto::-webkit-scrollbar-thumb {
      background-color: #00FFFF;
      border-radius: 20px;
      border: 3px solid #0A2C3E;
    }
  `}</style>
)

export default function UniversalIdentifier() {
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [animate, setAnimate] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [history, setHistory] = useState<Array<{image: string, result: string, timestamp: number}>>([])
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnalysisHidden, setIsAnalysisHidden] = useState(false);


  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || !image) return;
  
    const processAIResponse = async (input: string, imageData: string): Promise<string> => {
      const genAI = new GoogleGenerativeAI('AIzaSyCr9LRa1zi5rwwTlibFmRu2r0rbug8S-Ow');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            {
              text: `Based on the image I've uploaded, please answer this question: ${input} 
              Feel free to use emojis and a friendly tone in your response! 😊`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: imageData.split(',')[1]
              }
            }
          ]
        }]
      });
    
      return result.response.text();
    };
    
    // Add user message to chat
    const userMessage = { sender: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
  
    // Process AI response
    setLoading(true);
    try {
      const aiResponse = await processAIResponse(chatInput, image);
      const processedResponse = aiResponse.replace(/(\*\*|\#\#)/g, '');
      const aiMessage = { sender: 'ai', text: processedResponse };
      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error processing AI response:', error);
      const errorMessage = { sender: 'ai', text: 'Oops! 😅 I encountered an error. Let\'s try that again, shall we?' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
    setIsAnalysisHidden(!isAnalysisHidden);
  };


  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('identificationHistory', JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('identificationHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  // Update the handleImageUpload function
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please choose an image under 5MB.')
        return
      }
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        if (event.target && typeof event.target.result === 'string') {
          setImage(event.target.result)
        }
      }
      reader.onerror = () => {
        alert('Error reading file. Please try again.')
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(function(stream) {
          const videoElement = document.createElement('video');
          videoElement.srcObject = stream;
          videoElement.setAttribute('playsinline', 'true');
          videoElement.style.position = 'fixed';
          videoElement.style.top = '0';
          videoElement.style.left = '0';
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          videoElement.style.zIndex = '9999';
          const captureButton = document.createElement('button');
          captureButton.textContent = 'Capture';
          captureButton.style.position = 'fixed';
          captureButton.style.bottom = '20px';
          captureButton.style.left = '50%';
          captureButton.style.transform = 'translateX(-50%)';
          captureButton.style.zIndex = '10000';
          captureButton.style.padding = '10px 20px';
          captureButton.style.backgroundColor = '#52B788';
          captureButton.style.color = 'white';
          captureButton.style.border = 'none';
          captureButton.style.borderRadius = '5px';
          captureButton.style.cursor = 'pointer';
  
          document.body.appendChild(videoElement);
          document.body.appendChild(captureButton);
  
          videoElement.play();
  
          captureButton.onclick = () => {
            const canvas = document.createElement('canvas');
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext('2d')?.drawImage(videoElement, 0, 0);
            const imageDataUrl = canvas.toDataURL('image/jpeg');
          
            // Ensure imageDataUrl is a string
            if (typeof imageDataUrl === 'string') {
              setImage(imageDataUrl);
            } else {
              console.error('Failed to capture image: imageDataUrl is not a string');
            }
          
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(videoElement);
            document.body.removeChild(captureButton);
          };
        })
        .catch(function(error) {
          console.error("Camera error: ", error);
        });
    } else {
      console.error("getUserMedia is not supported");
    }
  };

  const identifyObject = useCallback(async () => {
    if (!image) {
      console.error('No image selected');
      return;
    }
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyCr9LRa1zi5rwwTlibFmRu2r0rbug8S-Ow');
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const result = await model.generateContent({
        contents: [{
          role: "user",
          parts: [
            {
              text: `Identify and analyze the object or scene in this image. Provide a comprehensive analysis including:

              1. Object/Scene Identification:
                 - Main subject(s)
                 - Category or type
                 - Estimated age or era (if applicable)

              2. Visual Description:
                 - Colors, textures, patterns
                 - Size and scale (estimate if possible)
                 - Distinctive features or characteristics

              3. Context and Background:
                 - Setting or environment
                 - Related objects or elements in the scene
                 - Potential purpose or use

              4. Technical Analysis (if relevant):
                 - Materials or components
                 - Manufacturing or creation process
                 - Technological features or advancements

              5. Cultural or Historical Significance:
                 - Origin or cultural context
                 - Historical importance or evolution
                 - Symbolic meaning or representation

              6. Comparative Analysis:
                 - Similar objects or concepts
                 - Unique aspects or differentiating factors

              8. Additional Insights:
                 - Interesting facts or trivia
                 - Common misconceptions
                 - Current trends or future developments

              Please provide a detailed yet concise response, focusing on the most relevant and interesting aspects of the image. Be as accurate and informative as possible in your analysis.`
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: image.split(',')[1]
              }
            }
          ]
        }]
      });

      const processedText = result.response.text().replace(/(\*\*|\#\#|--)/g, '');
      setResult(processedText);
      setHistory(prevHistory => [{image: image, result: processedText, timestamp: Date.now()}, ...prevHistory.slice(0, 9)]);
      setShowResults(true);
      setAnimate(true);
      } catch (error) {
        console.error('Error identifying object:', error);
        setResult(`Error identifying object: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setLoading(false);
      }
    }, [image, setResult, setHistory, setShowResults, setAnimate, setLoading]);

  const closeResults = () => {
    setAnimate(false)
    setTimeout(() => {
      setShowResults(false)
      setResult(null)
      setImage(null)
    }, 300)
  }

  const getIconForSection = (title: string) => {
    switch (title) {
      case 'Object/Scene Identification:':
        return <FaObjectGroup className="text-[#FF00FF]" />;
      case 'Visual Description:':
        return <FaEye className="text-[#FF00FF]" />;
      case 'Context and Background:':
        return <FaMapMarkedAlt className="text-[#FF00FF]" />;
      case 'Technical Analysis (if relevant):':
        return <FaCogs className="text-[#FF00FF]" />;
      case 'Cultural or Historical Significance:':
        return <FaLandmark className="text-[#FF00FF]" />;
      case 'Comparative Analysis:':
        return <FaBalanceScale className="text-[#FF00FF]" />;
      case 'Additional Insights:':
        return <FaLightbulb className="text-[#FF00FF]" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-8 flex flex-col bg-gradient-to-br from-[#1A237E] to-[#000051] text-white font-['Roboto']">

      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-4 flex flex-col lg:flex-row gap-4">
        <div className="flex-grow lg:mr-0">
          <div className="bg-[#0D47A1]/80 rounded-lg shadow-lg p-6 mb-8 backdrop-blur-sm">
            <div className={`flex ${showResults ? 'justify-between' : 'justify-center'} items-center mb-6`}>
              <h2 className={`text-4xl text-[#2196F3] font-light ${showResults ? '' : 'text-center'}`}>Universal Identifier</h2>
              {showResults && (
                <button
                  onClick={closeResults}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-light"
                >
                  Close
                </button>
              )}
            </div>

            {!showResults && (
              <div className="transition-all duration-300 ease-in-out">
                <div className="flex justify-center space-x-4 mb-6">
                  <label className="bg-[#2196F3] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#1E88E5] transition font-light flex items-center">
                    <FaUpload className="mr-2" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <button
                    onClick={handleCameraCapture}
                    className="bg-[#2196F3] text-white px-4 py-2 rounded hover:bg-[#1E88E5] transition font-light flex items-center"
                  >
                    <FaCamera className="mr-2" />
                    Take Photo
                  </button>
                </div>
                {image && (
                  <div className="flex flex-col items-center mb-6">
                    <Image src={image} alt="Uploaded image" width={300} height={300} className="rounded-lg shadow-lg mb-4" />
                    <button
                      onClick={identifyObject}
                      className="bg-[#2196F3] text-white px-6 py-2 rounded hover:bg-[#1E88E5] transition font-light flex items-center"
                      disabled={loading}
                      aria-label="Identify Object"
                    >
                      {loading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <FaSpinner className="animate-spin text-white text-4xl" />
                        </div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}

            {showResults && result && !isAnalysisHidden && (
              <div className={`transition-all duration-300 ease-in-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="bg-gradient-to-br from-[#0A2C3E] to-[#1A4A2E] p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-md transform transition-all duration-300 overflow-y-auto max-h-[600px] border border-[#00FFFF] glow">
                  <h3 className="text-4xl font-bold text-[#00FFFF] mb-8 text-center tracking-wide">Analysis Results</h3>
                  <div className="space-y-8">
                    {result.split('\n\n').map((section, index) => {
                      const [title, ...content] = section.split('\n').map(item => item.replace(/(\*\*|##|--)/g, '').trim())
                      return (
                        <div key={index} className="mb-8 bg-[#0D47A1]/30 p-6 rounded-lg hover:bg-[#0D47A1]/50 transition-all duration-300 transform hover:scale-105 border-l-4 border-[#7CFFCB]">
                          <h4 className="text-3xl font-bold text-[#7CFFCB] mb-4 flex items-center">
                            <span className="mr-3 text-4xl">{getIconForSection(title)}</span>
                            <span className="border-b-2 border-[#7CFFCB] pb-1">{title}</span>
                          </h4>
                          <ul className="list-none space-y-4">
                            {content.map((item, i) => {
                              const [subtitle, ...details] = item.split(':')
                              return (
                                <li key={i} className="text-[#E0FFFF] font-light">
                                  <div className="flex items-start">
                                    <span className="text-[#00FFFF] text-3xl mr-2">•</span>
                                    <div>
                                      <span className="text-[#00FFFF] font-semibold text-lg">{subtitle}:</span>
                                      <span className="ml-2 text-lg leading-relaxed">{details.join(':').trim()}</span>
                                    </div>
                                  </div>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
            {isChatExpanded && (
              <div className={`transition-all duration-500 ease-in-out ${animate ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <div className="bg-[#0D47A1] p-6 rounded-lg shadow-lg backdrop-blur-sm transform transition-all duration-500">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-light text-[#2196F3] flex items-center">
                      <FaComments className="mr-2" /> AI Chat
                    </h3>
                    <button
                      onClick={toggleChatExpansion}
                      className="bg-[#2196F3] text-white px-3 py-1 rounded hover:bg-[#1E88E5] transition font-light text-sm flex items-center"
                    >
                      <FaCompress className="mr-1" /> Minimize
                    </button>
                  </div>
                  <div className="h-[calc(100vh-300px)] overflow-y-auto mb-4 bg-[#1A237E]/50 rounded-lg p-4">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <span
                          className={`inline-block p-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-[#2196F3] text-white'
                              : 'bg-[#64B5F6] text-[#0D47A1]'
                          } animate-fadeInUp relative group`}
                        >
                          {msg.text}
                          {msg.sender === 'ai' && (
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              className="absolute top-0 right-0 mt-1 mr-1 bg-[#1A237E] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Copy to clipboard"
                            >
                              <FaCopy size={12} />
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleChatSubmit} className="flex">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about the image..."
                      className="flex-grow bg-[#1A237E] text-white rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                    />
                    <button
                      type="submit"
                      className="bg-[#2196F3] text-white px-4 py-2 rounded-r-full hover:bg-[#1E88E5] transition"
                    >
                      <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#0D47A1]/80 rounded-lg shadow-lg p-6 mt-0 backdrop-blur-sm">
            <h3 className="text-2xl font-light text-[#2196F3] mb-4">How Our AI Works</h3>
            <p className="text-white font-light mb-4">
              Our universal identification AI uses state-of-the-art machine learning algorithms to analyze images and provide comprehensive information about objects, scenes, and concepts.
            </p>
            <ol className="list-decimal list-inside text-[#BBDEFB] font-light space-y-2">
              <li>Upload or capture an image of anything you want to identify</li>
              <li>Our AI processes the image, analyzing visual features, context, and patterns</li>
              <li>The AI compares the image to its vast knowledge base spanning various domains</li>
              <li>It generates a detailed report covering multiple aspects of the identified subject</li>
              <li>The AI provides additional insights, comparisons, and relevant information</li>
            </ol>
          </div>
        </div>

        <aside className="lg:w-[calc(2/6*100%)]">
          {showResults && image && (
            <div className="bg-[#0D47A1]/80 rounded-lg shadow-lg p-4 backdrop-blur-sm mb-8 animate-slideInRight">
              <Image src={image} alt="Identified object" width={200} height={200} className="rounded-lg shadow-lg mb-4 mx-auto" />
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#2196F3] text-white px-3 py-1 rounded hover:bg-[#1E88E5] transition font-light text-sm flex items-center cursor-pointer"
                >
                  <FaUpload className="mr-1" /> New
                </button>
                <button 
                  onClick={handleCameraCapture}
                  className="bg-[#2196F3] text-white px-3 py-1 rounded hover:bg-[#1E88E5] transition font-light text-sm flex items-center cursor-pointer"
                >
                  <FaCamera className="mr-1" /> Photo
                </button>
                <button 
                  onClick={identifyObject} 
                  className="bg-[#2196F3] text-white px-3 py-1 rounded hover:bg-[#1E88E5] transition font-light text-sm flex items-center"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Analyze'}
                  <FaArrowRight className="ml-1" />
                </button>
              </div>
            </div>
          )}
            {/* New Chat Box */}
            {!isChatExpanded && (
              <div className="bg-gradient-to-br from-[#1A237E] to-[#0D47A1] rounded-lg shadow-lg p-6 backdrop-blur-sm mb-8 border border-[#3F51B5]">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-semibold text-[#64B5F6] flex items-center">
                    <FaComments className="mr-3 text-[#2196F3]" /> AI Chat
                  </h3>
                  <button
                    onClick={toggleChatExpansion}
                    className="bg-[#2196F3] text-white px-4 py-2 rounded-full hover:bg-[#1E88E5] transition font-medium text-sm flex items-center shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    <FaExpand className="mr-2" /> Expand Chat
                  </button>
                </div>
                
                {chatMessages.length > 0 ? (
                  <div className="h-80 overflow-y-auto mb-6 bg-[#0A1929] rounded-lg p-4 scrollbar-thin scrollbar-thumb-[#2196F3] scrollbar-track-[#1A237E]">
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`mb-4 ${
                          msg.sender === 'user' ? 'text-right' : 'text-left'
                        }`}
                      >
                        <span
                          className={`inline-block p-3 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-[#2196F3] text-white'
                              : 'bg-[#64B5F6] text-[#0A1929]'
                          } shadow-md animate-fadeInUp relative group max-w-[80%]`}
                        >
                          {msg.text}
                          {msg.sender === 'ai' && (
                            <button
                              onClick={() => navigator.clipboard.writeText(msg.text)}
                              className="absolute top-0 right-0 mt-1 mr-1 bg-[#1A237E] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#3F51B5]"
                              title="Copy to clipboard"
                            >
                              <FaCopy size={14} />
                            </button>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center text-[#64B5F6] bg-[#0A1929] rounded-lg mb-6">
                    <span className="text-lg font-light flex items-center">
                      <FaInfoCircle className="mr-2" /> No messages yet. Start a conversation!
                    </span>
                  </div>
                )}
                
                <form onSubmit={handleChatSubmit} className="flex">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about the image..."
                    className="flex-grow bg-[#0A1929] text-white rounded-l-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#2196F3] placeholder-[#4FC3F7]"
                  />
                  <button
                    type="submit"
                    className="bg-[#2196F3] text-white px-6 py-3 rounded-r-full hover:bg-[#1E88E5] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
                  >
                    <FaPaperPlane className="text-lg" />
                  </button>
                </form>
              </div>
            )}

              {/* Recent Identifications   */}
            <div className="bg-[#0D47A1]/80 rounded-lg shadow-lg p-4 backdrop-blur-sm mb-8">
              <h3 className="text-2xl font-light text-[#2196F3] mb-4 flex items-center">
                <FaHistory className="mr-2" /> Recent Identifications
              </h3>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search history..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#1A237E] text-white rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-[#2196F3]"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#64B5F6]" />
                </div>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {history
                  .filter(item => item.result.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, showHistory ? undefined : 5)
                  .map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-2 hover:bg-[#1A237E] rounded transition cursor-pointer">
                      <Image src={item.image} alt="History item" width={50} height={50} className="rounded" />
                      <div>
                        <p className="text-white font-light truncate">{item.result.split('\n')[0]}</p>
                        <p className="text-[#64B5F6] text-sm">{new Date(item.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
              </div>
              {history.length > 5 && (
                <button
                  onClick={() => setShowHistory(!showHistory)}
                  className="mt-4 bg-[#2196F3] text-white px-4 py-2 rounded hover:bg-[#1E88E5] transition font-light w-full"
                >
                  {showHistory ? 'Show Less' : 'Show All'}
                </button>
              )}
            </div>

            <div className="bg-[#0D47A1]/80 rounded-lg shadow-lg p-4 backdrop-blur-sm">
              <h3 className="text-2xl font-light text-[#2196F3] mb-4 flex items-center">
                <FaInfoCircle className="mr-2" /> Quick Tips
              </h3>
              <ul className="space-y-2 text-white font-light">
                <li>• Ensure good lighting for better results</li>
                <li>• Try different angles for complex objects</li>
                <li>• Include context in your images when possible</li>
                <li>• Use high-resolution images for more details</li>
                <li>• Experiment with close-ups and wide shots</li>
              </ul>
            </div>
         </aside>
      </main>

      <footer className="bg-[#000051]/80 text-[#2196F3] py-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 className="text-xl font-light mb-2">About Universal Identifier</h3>
                <p className="font-light">Our AI-powered universal identification tool helps you discover and learn about any object, scene, or concept quickly and accurately.</p>
            </div>
            <div>
                <h3 className="text-xl font-light mb-2">Quick Links</h3>
                <ul className="space-y-2 font-light">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-xl font-light mb-2">Connect With Us</h3>
                <div className="flex space-x-4 mb-4">
                <a href="#" className="text-2xl hover:text-white transition"><FaFacebookSquare /></a>
                <a href="#" className="text-2xl hover:text-white transition"><FaTwitterSquare /></a>
                <a href="#" className="text-2xl hover:text-white transition"><FaInstagramSquare /></a>
                <a href="#" className="text-2xl hover:text-white transition"><FaLinkedin /></a>
                </div>
                <p className="font-light">Email: info@universalidentifier.com</p>
                <p className="font-light">Phone: (123) 456-7890</p>
            </div>
            </div>
            <div className="mt-8 pt-8 border-t border-[#1A237E] text-center">
            <p className="font-light">&copy; {new Date().getFullYear()} Universal Identifier. All rights reserved.</p>
            </div>
        </div>
      </footer>
    </div>
  );
}      