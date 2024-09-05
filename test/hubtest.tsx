'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { FaArrowRight, FaCamera, FaUpload } from 'react-icons/fa'

const PlantIdentifierStyles = () => (
  <style jsx global>{`
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes slideInRight {
      from {
        transform: translateX(-100%);
      }
      to {
        transform: translateX(0);
      }
    }

    .animate-fadeInUp {
      animation: fadeInUp 0.5s ease-out forwards;
    }

    .animate-slideInRight {
      animation: slideInRight 0.5s ease-out forwards;
    }
  `}</style>
)

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [translatedResult, setTranslatedResult] = useState<string | null>(null)
  const [showTranslateOptions, setShowTranslateOptions] = useState(false)
  const [showAllTopIssues, setShowAllTopIssues] = useState(false)
  const [showAllDetectedIssues, setShowAllDetectedIssues] = useState(false)
  const translateMenuRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [diseasesIssues, setDiseasesIssues] = useState<{ [key: string]: { count: number, lastUpdated: number } }>({})
  const [showIdentificationResults, setShowIdentificationResults] = useState(false);
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const savedDiseasesIssues = localStorage.getItem('diseasesIssues')
    if (savedDiseasesIssues) {
      setDiseasesIssues(JSON.parse(savedDiseasesIssues))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('diseasesIssues', JSON.stringify(diseasesIssues))
  }, [diseasesIssues])

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
    if (!image) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI('AIzaSyCr9LRa1zi5rwwTlibFmRu2r0rbug8S-Ow')
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
              'Diseases/Issues: -[Please list any visible diseases or issues, ensuring that their names are clearly identified.]\n' +
              'Mitigation/Strategy: -[Provide clearly 3-4 strategies to address the identified issues]\n' +
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
  
      const processedText = result.response.text().replace(/\*\*/g, '');
      setResult(processedText);
      setTranslatedResult(processedText);

      // Extract and count diseases/issues
      const diseasesIssuesSection = processedText.split('Diseases/Issues:')[1]?.split('Mitigation/Strategy:')[0]
      if (diseasesIssuesSection) {
        const issues = diseasesIssuesSection.split('-').slice(1).map(issue => {
          const [name] = issue.split(':')
          return name.trim()
        }).filter(Boolean)
        
        const currentTime = Date.now()
        setDiseasesIssues(prevIssues => {
          const newIssues = { ...prevIssues }
          issues.forEach(issue => {
            if (issue in newIssues) {
              newIssues[issue] = { count: newIssues[issue].count + 1, lastUpdated: currentTime }
            } else {
              newIssues[issue] = { count: 1, lastUpdated: currentTime }
            }
          })
          return newIssues
        })
      }
//
      setShowIdentificationResults(true);
      setAnimate(true);
    } catch (error) {
      const errorMessage = `Error identifying plant: ${error instanceof Error ? error.message : String(error)}`
      setResult(errorMessage)
      setTranslatedResult(errorMessage)
    }
    setLoading(false)
  }

  const closeIdentificationResults = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowIdentificationResults(false);
      setResult(null);
      setTranslatedResult(null);
      setImage(null);
    }, 300);
  };

  const getTopFiveIssues = () => {
    return Object.entries(diseasesIssues)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([issue, data], index) => ({
        name: issue,
        percentage: (data.count / Object.values(diseasesIssues).reduce((a, b) => a + b.count, 0) * 100).toFixed(0),
        rank: index + 1
      }))
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
  }

  const toggleTranslateOptions = () => {
    setShowTranslateOptions(!showTranslateOptions)
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (translateMenuRef.current && !translateMenuRef.current.contains(event.target as Node)) {
        setShowTranslateOptions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white font-['Roboto']">
      <PlantIdentifierStyles />
      {/* Navigation */}
      <nav className="bg-[#081C15]/80 backdrop-blur-sm p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-thin text-[#52B788]">PlantID</h1>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-[#52B788] transition font-thin">Home</a></li>
            <li><a href="#" className="hover:text-[#52B788] transition font-thin">About</a></li>
            <li><a href="#" className="hover:text-[#52B788] transition font-thin">Contact</a></li>
            <li><a href="#" className="hover:text-[#52B788] transition font-thin">Help</a></li>
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-4 flex flex-col lg:flex-row gap-4">
        {/* Center Column - Main Content */}
        <div className="flex-grow lg:mr-0">
          <div className="bg-[#081C15]/80 rounded-lg shadow-lg p-6 mb-8 backdrop-blur-sm">
            <div className={`flex ${showIdentificationResults ? 'justify-between' : 'justify-center'} items-center mb-6`}>
              <h2 className={`text-4xl text-[#52B788] font-thin ${showIdentificationResults ? '' : 'text-center'}`}>Plant Identifier</h2>
              {showIdentificationResults && (
                <div className="flex space-x-4">
                  <div className="relative" ref={translateMenuRef}>
                    <button
                      onClick={toggleTranslateOptions}
                      className="px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#3E8E69] transition font-thin"
                    >
                      Translate
                    </button>
                    {showTranslateOptions && (
                      <div className="absolute right-0 top-full mt-2 bg-[#081C15] border border-[#52B788] rounded-md shadow-lg z-10">
                        {['en', 'fr', 'rw'].map((lang) => (
                          <button
                            key={lang}
                            onClick={() => {
                              translateResult(lang as 'en' | 'fr' | 'rw')
                              setShowTranslateOptions(false)
                            }}
                            className="block w-full text-left px-4 py-2 hover:bg-[#1B4332] transition disabled:opacity-50 disabled:cursor-not-allowed font-thin"
                            disabled={!result || loading}
                          >
                            {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Kinyarwanda'}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={closeIdentificationResults}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition font-thin"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
            {/* Image Upload and Capture */}
            {!showIdentificationResults && (
              <div className="transition-all duration-300 ease-in-out">
                <div className="flex justify-center space-x-4 mb-6">
                  <label className="bg-[#52B788] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#3E8E69] transition font-thin flex items-center">
                    <FaUpload className="mr-2" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <button
                    onClick={handleCameraCapture}
                    className="bg-[#52B788] text-white px-4 py-2 rounded hover:bg-[#3E8E69] transition font-thin flex items-center"
                  >
                    <FaCamera className="mr-2" />
                    Take Photo
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
                
                {/* Uploaded Image and Identify Button */}
                {image && (
                  <div className="flex flex-col items-center mb-6">
                    <Image src={image} alt="Uploaded plant" width={300} height={300} className="rounded-lg shadow-lg mb-4" />
                    <button
                      onClick={identifyPlant}
                      className="bg-[#52B788] text-white px-6 py-2 rounded hover:bg-[#3E8E69] transition font-thin flex items-center"
                      disabled={loading}
                    >
                      {loading ? 'Identifying...' : 'Identify Plant'}
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Identification Results */}
            {showIdentificationResults && translatedResult && (
              <div className={`transition-all duration-300 ease-in-out ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                  {/* Plant Information */}
                  <div className="bg-[#081C15]/60 p-6 rounded-lg shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-2xl font-thin text-[#52B788] mb-4">Plant Information</h3>
                    <div className="text-white font-thin">
                      {translatedResult.split('\n\n')[0].split('\n').map((line, index) => {
                        if (line.includes(':')) {
                          const [label, ...content] = line.split(':');
                          return (
                            <div key={index} className="mt-2">
                              <p className="font-semibold text-[#52B788]">{label.trim()}:</p>
                              <p>{content.join(':').trim()}</p>
                            </div>
                          );
                        }
                        return <p key={index}>{line.trim()}</p>;
                      })}
                    </div>
                  </div>
                  {/* Health Assessment */}
                  <div className="bg-[#081C15]/60 p-6 rounded-lg shadow-lg backdrop-blur-sm transform transition-all duration-300 hover:scale-105">
                    <h3 className="text-2xl font-thin text-[#52B788] mb-4">Health Assessment</h3>
                    <div className="font-thin">
                      {translatedResult.split('\n\n').slice(1).join('\n\n').split('\n').map((line, index) => {
                        if (line.includes(':')) {
                          const [label, ...content] = line.split(':');
                          const isStatus = label.toLowerCase().includes('status') || 
                                          label.toLowerCase().includes('statut') || 
                                          label.toLowerCase().includes('uko bimeze');
                          const status = isStatus ? content.join(':').trim().toLowerCase() : '';
                          
                          if (isStatus) {
                            const isGood = status.includes('good') || 
                                          status.includes('bon') || 
                                          status.includes('byiza') ||
                                          status.includes('meza') ||
                                          !status.includes('bad') &&
                                          !status.includes('mauvais') &&
                                          !status.includes('bibi');
                            return (
                              <div key={index} className="mt-2">
                                <p className={`font-semibold ${isGood ? 'text-green-500' : 'text-red-500'}`}>
                                  {label.trim()}: {content.join(':').trim()}
                                </p>
                              </div>
                            );
                          }
                          
                          return (
                            <div key={index} className="mt-2">
                              <p className="font-semibold text-[#52B788]">{label.trim()}:</p>
                              <p className="text-white">{content.join(':').trim()}</p>
                            </div>
                          );
                        } else if (line.trim()) {
                          return <p key={index} className="text-white mt-2">{line.trim()}</p>;
                        }
                        return null;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Explanation Section */}
            <div className="bg-[#081C15]/80 rounded-lg shadow-lg p-6 mt-8 backdrop-blur-sm">
              <h3 className="text-2xl font-thin text-[#52B788] mb-4">How Our AI Works</h3>
              <p className="text-white font-thin mb-4">
                Our plant identification AI uses advanced machine learning algorithms to analyze images of plants and provide accurate information about their species, health, and care requirements.
              </p>
              <ol className="list-decimal list-inside text-white font-thin space-y-2">
                <li>Upload or take a photo of a plant</li>
                <li>Our AI analyzes the image, considering factors like leaf shape, color, and texture</li>
                <li>The AI compares the image to its vast database of plant species</li>
                <li>It provides detailed information about the plant, including its name and care instructions</li>
                <li>The AI also assesses the plant's health and offers suggestions for improvement if needed</li>
              </ol>
            </div>

            {/* Top Issues Section */}
            <div className="bg-[#081C15]/80 rounded-lg shadow-lg p-6 mt-8 backdrop-blur-sm">
              <h3 className="text-2xl font-thin text-[#52B788] mb-4">Top Plant Issues</h3>
              <div className="space-y-4">

                {getTopFiveIssues().map((issue, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white font-thin">{issue.rank}. {issue.name}</span>
                    <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div className="bg-[#52B788] h-2.5 rounded-full" style={{width: `${issue.percentage}%`}}></div>
                    </div>
                    <span className="text-white font-thin">{issue.percentage}%</span>
                  </div>
                ))}

              </div>

              <button
                onClick={() => setShowAllTopIssues(!showAllTopIssues)}
                className="mt-4 bg-[#52B788] text-white px-4 py-2 rounded hover:bg-[#3E8E69] transition font-thin"
              >
                {showAllTopIssues ? 'Show Less' : 'Show All'}
              </button>

              {showAllTopIssues && (
                <div className="mt-4 space-y-2">
                  {Object.entries(diseasesIssues)
                    .sort((a, b) => b[1].count - a[1].count)
                    .slice(5)
                    .map(([issue, data], index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-white font-thin">{issue}</span>
                        <span className="text-white font-thin">{data.count} occurrences</span>
                      </div>
                    ))}
                </div>
              )}
              
            </div>

            {/* Recently Detected Issues Section */}
            <div className="bg-[#081C15]/80 rounded-lg shadow-lg p-6 mt-8 backdrop-blur-sm">
              <h3 className="text-2xl font-thin text-[#52B788] mb-4">Recently Detected Issues</h3>
              <div className="space-y-2">
                {Object.entries(diseasesIssues)
                  .sort((a, b) => b[1].lastUpdated - a[1].lastUpdated)
                  .slice(0, showAllDetectedIssues ? undefined : 5)
                  .map(([issue, data], index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-white font-thin">{issue}</span>
                      <span className="text-white font-thin">
                        {new Date(data.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
              </div>
              <button
                onClick={() => setShowAllDetectedIssues(!showAllDetectedIssues)}
                className="mt-4 bg-[#52B788] text-white px-4 py-2 rounded hover:bg-[#3E8E69] transition font-thin"
              >
                {showAllDetectedIssues ? 'Show Less' : 'Show All'}
              </button>
            </div>

        </div>
      </div>
    </main>

    {/* Footer */}
    <footer className="bg-[#081C15]/80 text-white p-4 mt-8">
      <div className="max-w-7xl mx-auto text-center">
        <p className="font-thin">&copy; 2024 PlantID. All rights reserved.</p>
      </div>
    </footer>
  </div>
)
}





// // Fetch similar images using the extracted plant name
// const similarImagesResponse = await fetchSimilarImages(plantName);
// setSimilarImages(similarImagesResponse.slice(0, 4)); // Limit to 4 images