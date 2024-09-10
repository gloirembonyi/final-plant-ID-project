// import { SpeechClient } from '@google-cloud/speech';
// import { Buffer } from 'buffer';

// const convertSpeechToText = async (audioBlob: Blob): Promise<string | null> => {
//   try {
//     // Create a client
//     const client = new SpeechClient();

//     // Convert Blob to Buffer
//     const arrayBuffer = await audioBlob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // The audio file's encoding, sample rate in hertz, and BCP-47 language code
//     const audio = {
//       content: buffer.toString('base64'),
//     };
//     const config = {
//       encoding: 'LINEAR16',
//       sampleRateHertz: 16000,
//       languageCode: 'en-US',
//     };
//     const request = {
//       audio: audio,
//       config: config,
//     };

//     // Detects speech in the audio file
//     const [response] = await client.recognize(request);
//     const transcription = response.results
//       .map((result: { alternatives: { transcript: any; }[]; }) => result.alternatives[0].transcript)
//       .join('\n');

//     return transcription;
//   } catch (error) {
//     console.error('Error converting speech to text:', error);
//     return null;
//   }
// };

// export default convertSpeechToText;