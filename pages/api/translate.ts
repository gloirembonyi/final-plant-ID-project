import type { NextApiRequest, NextApiResponse } from 'next'
import { translate } from '@vitalets/google-translate-api'
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

const cache: Record<string, { text: string; timestamp: number }> = {}
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await new Promise((resolve) => limiter(req, res, resolve))
  
  if (req.method === 'POST') {
    const { text, lang } = req.body
    const cacheKey = `${text}-${lang}`

    // Check cache
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
      return res.status(200).json({ translatedText: cache[cacheKey].text })
    }

    let retries = 0
    const maxRetries = 3

    while (retries < maxRetries) {
      try {
        const result = await translate(text, { to: lang })
        
        // Update cache
        cache[cacheKey] = { text: result.text, timestamp: Date.now() }
        
        return res.status(200).json({ translatedText: result.text })
      } catch (error: unknown) {
        if (error instanceof Error && error.message.includes('Too Many Requests')) {
          retries++
          if (retries < maxRetries) {
            await wait(Math.pow(2, retries) * 1000) // Exponential backoff
          } else {
            return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
          }
        } else {
          console.error('Translation error:', error)
          return res.status(500).json({ error: 'Translation failed', details: error instanceof Error ? error.message : 'Unknown error' })
        }
      }
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}











// // pages/api/translate.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import { translate } from '@vitalets/google-translate-api'
// import rateLimit from 'express-rate-limit'

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// })

// // Simple in-memory cache
// const cache: Record<string, { text: string; timestamp: number }> = {};
// const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   await new Promise((resolve) => limiter(req, res, resolve))
  
//   if (req.method === 'POST') {
//     try {
//       const { text, lang } = req.body
//       const cacheKey = `${text}-${lang}`;
      
//       // Check cache
//       if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
//         return res.status(200).json({ translatedText: cache[cacheKey].text });
//       }
      
//       console.log(`Translating to ${lang}: ${text.substring(0, 50)}...`);
      
//       const result = await translate(text, { to: lang })
      
//       // Update cache
//       cache[cacheKey] = { text: result.text, timestamp: Date.now() };
      
//       console.log(`Translation successful: ${result.text.substring(0, 50)}...`);
//       res.status(200).json({ translatedText: result.text })
//     } catch (error: unknown) {
//       console.error('Translation error:', error);
//       if (error instanceof Error) {
//         res.status(429).json({ error: 'Translation failed', details: error.message })
//       } else {
//         res.status(500).json({ error: 'Translation failed', details: 'An unknown error occurred' })
//       }
//     }
//   } else {
//     res.setHeader('Allow', ['POST'])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }

// import type { NextApiRequest, NextApiResponse } from 'next'
// import { translate } from '@vitalets/google-translate-api'

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === 'POST') {
//     try {
//       const { text, lang } = req.body
//       const result = await translate(text, { to: lang })
//       res.status(200).json({ translatedText: result.text })
//     } catch (error) {
//       res.status(500).json({ error: 'Translation failed' })
//     }
//   } else {
//     res.setHeader('Allow', ['POST'])
//     res.status(405).end(`Method ${req.method} Not Allowed`)
//   }
// }