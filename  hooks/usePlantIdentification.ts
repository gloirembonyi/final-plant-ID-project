import { useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'

export default function usePlantIdentification() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const identifyPlant = async (image: string | null) => {
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
    } catch (error) {
      const errorMessage = `Error identifying plant: ${error instanceof Error ? error.message : String(error)}`
      setResult(errorMessage)
    }
    setLoading(false)
  }

  return { result, loading, identifyPlant }
}