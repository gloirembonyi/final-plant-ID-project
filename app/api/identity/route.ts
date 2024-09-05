import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { image } = await request.json();

  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const result = await model.generateContent([
      'Identify this plant and provide its name, distribution, and other important information.',
      { inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' } },
    ]);
    return NextResponse.json({ result: result.response.text() });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json({ error: `Error identifying plant: ${error}` }, { status: 500 });
  }
}