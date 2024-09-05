import { useState, useEffect } from 'react'

export default function useTranslation(initialResult: string | null) {
  const [translatedResult, setTranslatedResult] = useState<string | null>(null)

  useEffect(() => {
    setTranslatedResult(initialResult)
  }, [initialResult])

  const translateResult = async (lang: 'en' | 'fr' | 'rw') => {
    if (!initialResult) return

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: initialResult, lang }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Translation failed')
      }
      
      const data = await response.json()
      setTranslatedResult(data.translatedText)
    } catch (error) {
      console.error('Translation error:', error)
      if (error instanceof Error && error.message.includes('Too Many Requests')) {
        setTranslatedResult("Translation limit reached. Please try again later.")
      } else {
        setTranslatedResult(`Translation error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`)
      }
    }
  }

  return { translatedResult, translateResult }
}