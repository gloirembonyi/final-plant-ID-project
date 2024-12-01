import { useState, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Image from 'next/image';

const PlantIdentifier = () => {
  const [responseMessage, setResponseMessage] = useState<string>('');
  const [result, setResult] = useState<{ plantInfo: string; healthAssessment: string }>({ plantInfo: '', healthAssessment: '' });
  const [translatedResult, setTranslatedResult] = useState<{ plantInfo: string; healthAssessment: string }>({ plantInfo: '', healthAssessment: '' });
  const [similarImages, setSimilarImages] = useState<string[]>([]);
  const [showIdentificationResults, setShowIdentificationResults] = useState<boolean>(false);
  const [animate, setAnimate] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const identifyPlant = async () => {
    if (!selectedImage) {
      setResponseMessage('Please upload an image first');
      return;
    }

    setLoading(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const base64Data = base64Image.split(',')[1]; // Remove the data URL prefix

        const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [
                { text: `Identify this plant and provide a comprehensive analysis.` },
                { inlineData: { mimeType: selectedImage.type, data: base64Data } },
              ],
            },
          ],
        });

        const processedText = result.response.text().replace(/(\*\*|\#\#)/g, "");
        const [plantInfo, healthAssessment] = processedText.split("Health Assessment:");

        setResult({
          plantInfo: plantInfo.trim(),
          healthAssessment: "Health Assessment:\n" + healthAssessment.trim(),
        });
        setTranslatedResult({
          plantInfo: plantInfo.trim(),
          healthAssessment: "Health Assessment:\n" + healthAssessment.trim(),
        });

        await processPlantData(plantInfo, healthAssessment);
        setLoading(false);
      };
    } catch (error) {
      console.error('Error in identifyPlant:', error);
      const errorMessage = `Error identifying plant: ${error instanceof Error ? error.message : String(error)}`;
      setResult({ plantInfo: errorMessage, healthAssessment: "" });
      setTranslatedResult({ plantInfo: errorMessage, healthAssessment: "" });
      setResponseMessage(errorMessage);
      setLoading(false);
    }
  };

  const processPlantData = async (plantInfo: string, healthAssessment: string) => {
    try {
      // Extract plant information
      const commonNameMatch = plantInfo.match(/Common Name\(s\): (.+?)\n/);
      const scientificNameMatch = plantInfo.match(/Scientific Name: (.+?)\n/);
      const descriptionMatch = plantInfo.match(/Description:[\s\S]*?(\n\d\.|\n$)/);

      const commonNames = commonNameMatch
        ? commonNameMatch[1].split(",").map((name) => name.trim())
        : [];
      const scientificName = scientificNameMatch ? scientificNameMatch[1].trim() : "";
      const description = descriptionMatch
        ? descriptionMatch[0].replace("Description:", "").trim()
        : "";

      // Add plant to database
      const plantId = await addPlant(commonNames[0], scientificName, commonNames, description);

      // Process health assessment
      const healthStatus = healthAssessment.includes("Health is Bad:")
        ? "bad"
        : healthAssessment.includes("Health is Good:")
        ? "good"
        : "ambiguous";

      if (healthStatus === "bad") {
        await processDiseases(healthAssessment, plantId);
      }

      // Fetch similar images
      await fetchAndSetSimilarImages(commonNames[0] || scientificName);

      setShowIdentificationResults(true);
      setAnimate(true);
    } catch (error) {
      console.error('Error in processPlantData:', error);
      setResponseMessage(`Error processing plant data: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const addPlant = async (name: string, scientificName: string, commonNames: string[], description: string): Promise<number> => {
    try {
      console.log('Sending request to add plant:', { name, scientificName, commonNames, description });
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'addPlant', 
          name, 
          scientificName, 
          commonNames, 
          description 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      
      const data = await response.json();
      console.log('Plant added successfully:', data);
      setResponseMessage(data.message);
      return data.plantId;
    } catch (error) {
      console.error('Error adding plant:', error);
      setResponseMessage(`Error adding plant: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  };

  const addDisease = async (name: string): Promise<number> => {
    try {
      console.log('Sending request to add disease:', { name });
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'addDisease', name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const data = await response.json();
      console.log('Disease added successfully:', data);
      setResponseMessage(data.message);
      return data.diseaseId;
    } catch (error) {
      console.error('Error adding disease:', error);
      setResponseMessage(`Error adding disease: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  };

  const associateDiseaseWithPlant = async (plantId: number, diseaseId: number) => {
    try {
      console.log('Sending request to associate disease with plant:', { plantId, diseaseId });
      const response = await fetch('/api/plants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'associateDiseaseWithPlant', 
          plantId, 
          diseaseId 
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server responded with error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message}`);
      }
      const data = await response.json();
      console.log('Disease associated with plant successfully:', data);
      setResponseMessage(data.message);
    } catch (error) {
      console.error('Error associating disease with plant:', error);
      setResponseMessage(`Error associating disease with plant: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  };

  const processDiseases = async (healthAssessment: string, plantId: number) => {
    const diseasesIssuesSection = healthAssessment.split("Diseases/Issues:")[1]?.split("Symptoms:")[0];
    if (diseasesIssuesSection) {
      const issues = diseasesIssuesSection
        .split(/[-\d.]/)
        .map((issue) => issue.split(":")[0].trim())
        .filter((issue) => issue && !issue.match(/^\d+$/));

      for (const issue of issues) {
        try {
          const diseaseId = await addDisease(issue);
          await associateDiseaseWithPlant(plantId, diseaseId);
        } catch (error) {
          console.error(`Error processing disease "${issue}":`, error);
          // Continue with the next disease even if one fails
        }
      }
    }
  };

  const fetchAndSetSimilarImages = async (plantName: string) => {
    try {
      const similarImagesResponse = await fetchSimilarImages(plantName);
      setSimilarImages(similarImagesResponse.slice(0, 4));
    } catch (error) {
      console.error('Error fetching similar images:', error);
      setResponseMessage(`Error fetching similar images: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  // ... (rest of your component code)
   // Function to fetch similar images
   const fetchSimilarImages = async (plantName: string | number | boolean) => {
    const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const CX = process.env.NEXT_PUBLIC_CX;

    try {
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
          plantName
        )}&cx=${CX}&searchType=image&key=${API_KEY}&num=5`
      );
      const data = await response.json();

      // Map the response to match the structure expected by your app
      const similarImages = data.items.map((item: any) => ({
        url: item.link,
        name: plantName, // Or use item.title if available
      }));

      return similarImages;
    } catch (error) {
      console.error("Error fetching similar images:", error);
      return [];
    }
  };


 
};

export default PlantIdentifier;