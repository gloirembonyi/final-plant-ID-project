// app/plant-identifier/page.tsx

"use client";

//import PlantC from '../../components/PlantC';
import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  FaComments,
  FaPaperPlane,
  FaCopy,
  FaExpand,
  FaCompress,
  FaMicrophone,
  FaStop,
} from "react-icons/fa";
import { FaArrowRight, FaCamera, FaUpload } from "react-icons/fa";
require("dotenv").config();
import PlantInfoComponent from "./PlantInfoComponent";
import CoolImageDisplay from "./CoolImageDisplay";
import { AnimatePresence, motion } from "framer-motion";

const PlantIdentifierStyles = () => (
  <style jsx global>{`
    /* Existing animations */

    @keyframes neonPulse {
      0%,
      100% {
        text-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff, 0 0 15px #ff00ff;
      }
      50% {
        text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
      }
    }

    .neon-text {
      animation: neonPulse 2s infinite;
    }

    .neon-button {
      box-shadow: 0 0 5px #ff00ff, 0 0 10px #ff00ff;
      transition: all 0.3s ease;
    }

    .neon-button:hover {
      box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
    }

    /* Add a subtle parallax effect */
    .parallax {
      background-attachment: fixed;
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;
    }

    /* Custom scrollbar styles for Firefox */
    .custom-scrollbar {
      scrollbar-width: thin;
      scrollbar-color: rgba(82, 183, 136, 0.5) rgba(255, 255, 255, 0.1);
    }

    /* Optional: Styles for other browsers (won't affect Firefox) */
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background-color: rgba(82, 183, 136, 0.5);
      border-radius: 10px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background-color: rgba(82, 183, 136, 0.7);
    }
  `}</style>
);

// Types
type Sender = "user" | "ai";

interface Message {
  sender: Sender;
  text: string;
}

interface ChatContextType {
  plantInfo: string;
  previousMessages: Message[];
}

interface IdentificationResult {
  plantInfo?: string;
}

// Styles
const styles = `
@import url(https://fonts.googleapis.com/css?family=Anonymous+Pro);

.chat-container {
  position: relative;
  height: 80vh;
  overflow-y: auto;
  scroll-behavior: smooth;
}

.message-container {
  padding-bottom: 60px;
}

.typewriter-container {
  position: sticky;
  bottom: 0;
  background-color: rgba(10, 22, 37, 0.8);
  padding: 10px;
  backdrop-filter: blur(5px);
}

.message {
  max-width: 80%;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 1rem;
  position: relative;
  transition: all 0.3s ease;
}

.message:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

.user-message {
    background-color: rgba(33, 150, 243, 0.1);
    color: #E3F2FD;
    margin-left: auto;
    border-bottom-right-radius: 0;
  }

 .ai-message {
    background-color: #0a3033;
    color: #E8F5E9;
    margin-right: auto;
    border-bottom-left-radius: 0;
  }

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #2196F3;
  border-radius: 20px;
  border: 3px solid #1A237E;
}

.input-container {
  position: sticky;
  bottom: 0;
  background-color: #0A1929;
  padding: 10px;
  border-top: 1px solid #1fbac0;
}


.typing-indicator::after {
  content: '▋';
  animation: blink 1s infinite;
}

@keyframes ellipsis {
    0% { content: '.'; }
    33% { content: '..'; }
    66% { content: '...'; }
  }

.voice-recording-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background-color: rgba(255, 0, 0, 0.1);
  border-radius: 20px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  order-radius: 50%;
  color: white;
  background-color: #4CAF50;
  border: none;
}

.pulse {
  width: 10px;
  height: 10px;
  background-color: red;
  border-radius: 50%;
  margin-right: 10px;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0.7);
  }
  
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
  }
  
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
  }
}
`;

// Define props type for TypewriterEffect
interface TypewriterEffectProps {
  text: string;
  onComplete: () => void;
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  text,
  onComplete,
}) => {
  const [displayText, setDisplayText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, Math.random() * 30 + 10);
      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return (
    <span>
      {displayText}
      {currentIndex < text.length && <span className="typing-indicator" />}
    </span>
  );
};

export default function PlantIdentifier() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<{
    plantInfo: string;
    healthAssessment: string;
  } | null>(null);

  const [translatedResult, setTranslatedResult] = useState<{
    plantInfo: string;
    healthAssessment: string;
  } | null>(null);

  const [showTranslateOptions, setShowTranslateOptions] = useState(false);
  const [showAllTopIssues, setShowAllTopIssues] = useState(false);
  const [showAllDetectedIssues, setShowAllDetectedIssues] = useState(false);
  const [responseMessage, setResponseMessage] = useState<string>("");
  const translateMenuRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [diseasesIssues, setDiseasesIssues] = useState<{
    [key: string]: { count: number; lastUpdated: number };
  }>({});
  const [showIdentificationResults, setShowIdentificationResults] =
    useState(false);
  const [animate, setAnimate] = useState(false);
  const [history, setHistory] = useState<
    Array<{ image: string; result: string; timestamp: number }>
  >([]);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnalysisHidden, setIsAnalysisHidden] = useState(false);
  const [similarImages, setSimilarImages] = useState<
    Array<{ url: string; name: string }>
  >([]);
  const [animatingMessage, setAnimatingMessage] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false); // If it's a boolean value
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Type definitions

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const exponentialBackoff = async (
    input: string,
    imageData: string,
    context: ChatContextType,
    retries: number = 5,
    delayTime: number = 1000
  ): Promise<string> => {
    for (let i = 0; i < retries; i++) {
      try {
        // Attempt the AI call here
        return await processAIResponse(input, imageData, context);
      } catch (error) {
        if (i === retries - 1) throw error; // Final attempt
        await delay(delayTime * Math.pow(2, i)); // Increase the delay exponentially
      }
    }
    throw new Error("Failed after multiple retries"); // Ensure a string is always returned or an error is thrown
  };

  const processAIResponse = async (
    input: string,
    imageData: string,
    context: ChatContextType
  ): Promise<string> => {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_AI_API_KEY || "AIzaSyAfKjAARrlaeGZcQrF-mDi9EenmhGZliUY"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const contextString = JSON.stringify(context);

    try {
      // Adding a delay to throttle the requests and reduce the chances of exceeding the quota
      await delay(1000); // 1-second delay

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Using the image I've uploaded and the context provided: ${contextString}, please focus on giving a clear and accurate answer to this question: ${input}. 
                Consider our previous messages to ensure your response is coherent and fits naturally within the conversation. 
                Keep the tone friendly and engaging—feel free to use emojis, but prioritize delivering the most relevant and helpful answer! 😊`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: imageData.split(",")[1],
                },
              },
            ],
          },
        ],
      });

      return result.response.text();
    } catch (error) {
      console.error("Error generating content:", error);

      // Check if the error is related to exceeding quota and apply exponential backoff retry
      if (
        (error as Error).message.includes("quota exceeded") ||
        (error as Error).message.includes("429")
      ) {
        console.error(
          "Quota exceeded, applying exponential backoff and retry..."
        );
        return await exponentialBackoff(input, imageData, context); // Pass the arguments properly
      }

      throw new Error("AI content generation failed.");
    }
  };

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || !image) return;

    const userMessage: Message = { sender: "user", text: chatInput };
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setLoading(true);

    try {
      const chatContext: ChatContextType = {
        plantInfo: result?.plantInfo || "",
        previousMessages: chatMessages,
      };

      // Call the processAIResponse function to get the AI's response
      const aiResponse = await processAIResponse(chatInput, image, chatContext);
      const newMessage: Message = {
        sender: "ai",
        text: aiResponse,
      };
      setChatMessages((prev) => [...prev, newMessage]);

      const processedResponse = aiResponse.replace(/(\*\*|\#\#)/g, "");
      setAnimatingMessage(processedResponse);
    } catch (error) {
      console.error("Error processing AI response:", error);

      // Error fallback message for the chat
      const errorMessage: Message = {
        sender: "ai",
        text: "Oops! 😅 I encountered an error. Let's try that again, shall we?",
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatExpansion = useCallback(() => {
    setIsChatExpanded((prev) => !prev);
    setIsAnalysisHidden((prev) => !prev);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  }, []);

  const toggleVoiceRecording = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          const audioUrl = URL.createObjectURL(audioBlob);

          // Here you would typically send this audio file to a speech-to-text service
          // For now, we'll just add a placeholder message
          const userMessage: Message = {
            sender: "user",
            text: "🎤 Audio message",
          };
          setChatMessages((prev) => [...prev, userMessage]);

          // Clean up
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("identificationHistory", JSON.stringify(history));
      localStorage.setItem("chatMessages", JSON.stringify(chatMessages));
    }
  }, [history, chatMessages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("identificationHistory");
      const savedChatMessages = localStorage.getItem("chatMessages");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
      if (savedChatMessages) {
        setChatMessages(JSON.parse(savedChatMessages));
      }
    }
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, animatingMessage]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages, animatingMessage]);

  const handleTypewriterComplete = useCallback(() => {
    if (animatingMessage) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: animatingMessage },
      ]);
      setAnimatingMessage(null);
    }
  }, [animatingMessage]);

  useEffect(() => {
    const savedDiseasesIssues = localStorage.getItem("diseasesIssues");
    if (savedDiseasesIssues) {
      setDiseasesIssues(JSON.parse(savedDiseasesIssues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diseasesIssues", JSON.stringify(diseasesIssues));
  }, [diseasesIssues]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target && e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          setImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // For the camera capture function:
  const handleCameraCapture = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then(function (stream) {
          const videoElement = document.createElement("video");
          videoElement.srcObject = stream;
          videoElement.setAttribute("playsinline", "true");
          videoElement.style.position = "fixed";
          videoElement.style.top = "0";
          videoElement.style.left = "0";
          videoElement.style.width = "100%";
          videoElement.style.height = "100%";
          videoElement.style.objectFit = "cover";
          videoElement.style.zIndex = "9999";
          const captureButton = document.createElement("button");
          captureButton.textContent = "Capture";
          captureButton.style.position = "fixed";
          captureButton.style.bottom = "20px";
          captureButton.style.left = "50%";
          captureButton.style.transform = "translateX(-50%)";
          captureButton.style.zIndex = "10000";
          captureButton.style.padding = "10px 20px";
          captureButton.style.backgroundColor = "#52B788";
          captureButton.style.color = "white";
          captureButton.style.border = "none";
          captureButton.style.borderRadius = "5px";
          captureButton.style.cursor = "pointer";

          document.body.appendChild(videoElement);
          document.body.appendChild(captureButton);

          videoElement.play();

          captureButton.onclick = () => {
            const canvas = document.createElement("canvas");
            canvas.width = videoElement.videoWidth;
            canvas.height = videoElement.videoHeight;
            canvas.getContext("2d")?.drawImage(videoElement, 0, 0);
            const imageDataUrl = canvas.toDataURL("image/jpeg");

            // Ensure imageDataUrl is a string
            if (typeof imageDataUrl === "string") {
              setImage(imageDataUrl);
            } else {
              console.error(
                "Failed to capture image: imageDataUrl is not a string"
              );
            }

            // Clean up
            stream.getTracks().forEach((track) => track.stop());
            document.body.removeChild(videoElement);
            document.body.removeChild(captureButton);
          };
        })
        .catch(function (error) {
          console.error("Camera error: ", error);
        });
    } else {
      console.error("getUserMedia is not supported");
    }
  };

  // Function to identify the plant
  const identifyPlant = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyAfKjAARrlaeGZcQrF-mDi9EenmhGZliUY"
      ); // Replace with your actual API key
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `Identify this plant and provide a comprehensive analysis. Pay close attention to the plant's health status and provide an accurate assessment. Format the response as follows:

                          Plant Information:
                          1. Name: 
                              - Common Name(s): [Common name(s)]
                              - Scientific Name: [Scientific name]
                          2. Description:
                              - Physical Characteristics: [Key physical features, such as leaf shape, flower color]
                              - Growth Habit: [Tree/Shrub/Vine/Herb, etc.]
                          3. Distribution:
                              - Native Region: [Geographic regions where the plant is naturally found]
                              - Habitat: [Preferred environment: soil type, moisture, etc.]
                          4. Care Instructions:
                              - Growth Rate: [Slow/Moderate/Fast]
                              - Soil Requirements: [pH range, texture, drainage preferences]
                              - Light Requirements: [Full sun/Partial shade/Full shade]
                              - Water Needs: [Low/Moderate/High]
                              - USDA Hardiness Zones: [If applicable]
                          5. Seasonality:
                              - Blooming Season: [Flowering period]
                              - Fruiting Season: [If applicable]
                          6. Uses:
                              - Ornamental: [Aesthetic uses]
                              - Culinary: [Edible parts and uses]
                              - Medicinal: [Health benefits and traditional uses]
                              - Other: [Any other significant uses]
                          7. Toxicity:
                              - Safety: [Information on toxicity to humans or animals]
                          8. Propagation:
                              - Methods: [Seeds, cuttings, division]
                              - Time to Maturity: [Estimate]
                          9. Ecological Information:
                              - Pollinators: [Insects/animals attracted]
                              - Invasiveness: [If the plant is considered invasive]

                          Health Assessment:
                          Status: [Good/Bad/Ambiguous]

                          If Health is Good:

                          1. Justification: 
                              - [Concise explanation for the good health assessment]
                          2. Positive Indicators:
                              - [List 3-4 key visual indicators of health]
                          3. Maintenance Tips:
                              - [Provide 3-4 specific care instructions for optimal health]

                          If Health is Bad:

                          1. Diseases/Issues:
                              - [List identified problems, clearly naming each]
                          2. Symptoms:
                              - [List 3-4 visible symptoms indicating poor health]
                          3. Potential Causes:
                              - [Suggest 2-3 likely reasons for the observed issues]
                          4. Mitigation Strategies:
                              - [Outline 3-4 clear, actionable steps to address the problems]

                          If Health is Ambiguous:

                          1. Observations:
                              - [List 3-4 notable observations about the plant's appearance]
                          2. Potential Concerns:
                              - [List any potential issues that cannot be conclusively determined]
                          3. Recommended Actions:
                              - [Provide 3-4 steps for further assessment or precautionary care]

                          Please provide a detailed yet concise response, focusing on the most relevant information for each section. Consider the plant's current growth stage and typical characteristics when assessing its health. Be as accurate as possible in determining the health status.`,
              },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: image.split(",")[1],
                },
              },
            ],
          },
        ],
      });

      const processedText = result.response.text().replace(/(\*\*|\#\#)/g, "");
      const [plantInfo, healthAssessment] =
        processedText.split("Health Assessment:");

      setResult({
        plantInfo: plantInfo.trim(),
        healthAssessment: "Health Assessment:\n" + healthAssessment.trim(),
      });
      setTranslatedResult({
        plantInfo: plantInfo.trim(),
        healthAssessment: "Health Assessment:\n" + healthAssessment.trim(),
      });

      // Extract plant information
      const commonNameMatch = plantInfo.match(/Common Name\(s\): (.+?)\n/);
      const scientificNameMatch = plantInfo.match(/Scientific Name: (.+?)\n/);
      const descriptionMatch = plantInfo.match(
        /Description:[\s\S]*?(\n\d\.|\n$)/
      );

      const commonNames = commonNameMatch
        ? commonNameMatch[1].split(",").map((name) => name.trim())
        : [];
      const scientificName = scientificNameMatch
        ? scientificNameMatch[1].trim()
        : "";
      const description = descriptionMatch
        ? descriptionMatch[0].replace("Description:", "").trim()
        : "";

      // Add plant to database
      const plantId = await addPlant(
        commonNames[0],
        scientificName,
        commonNames,
        description
      );

      // Process health assessment
      const healthStatus = healthAssessment.includes("Health is Bad:")
        ? "bad"
        : healthAssessment.includes("Health is Good:")
        ? "good"
        : "ambiguous";

      if (healthStatus === "bad") {
        const diseasesIssuesSection = healthAssessment
          .split("Diseases/Issues:")[1]
          ?.split("Symptoms:")[0];
        if (diseasesIssuesSection) {
          const issues = diseasesIssuesSection
            .split(/[-\d.]/)
            .map((issue) => issue.split(":")[0].trim())
            .filter((issue) => issue && !issue.match(/^\d+$/));

          for (const issue of issues) {
            const diseaseId = await addDisease(issue);
            await associateDiseaseWithPlant(plantId, diseaseId);
          }
        }
      }

      // Fetch similar images
      const similarImagesResponse = await fetchSimilarImages(
        commonNames[0] || scientificName
      );
      setSimilarImages(similarImagesResponse.slice(0, 4));

      setShowIdentificationResults(true);
      setAnimate(true);
    } catch (error) {
      const errorMessage = `Error identifying plant: ${
        error instanceof Error ? error.message : String(error)
      }`;
      setResult({ plantInfo: errorMessage, healthAssessment: "" });
      setTranslatedResult({ plantInfo: errorMessage, healthAssessment: "" });
    }
    setLoading(false);
  };

  const addPlant = async (
    name: string,
    scientificName: string,
    commonNames: string[],
    description: string
  ): Promise<number> => {
    try {
      console.log("Sending request to add plant:", {
        name,
        scientificName,
        commonNames,
        description,
      });
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "addPlant",
          name,
          scientificName,
          commonNames,
          description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }

      const data = await response.json();
      console.log("Plant added successfully:", data);
      setResponseMessage(data.message); // Use the state updater function here
      return data.plantId;
    } catch (error) {
      console.error("Error adding plant:", error);
      setResponseMessage(
        `Error adding plant: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  };

  const addDisease = async (name: string): Promise<number> => {
    try {
      console.log("Sending request to add disease:", { name });
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addDisease", name }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server responded with error:", errorData);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }
      const data = await response.json();
      console.log("Disease added successfully:", data);
      setResponseMessage(data.message);
      return data.diseaseId;
    } catch (error) {
      console.error("Error adding disease:", error);
      setResponseMessage(
        `Error adding disease: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  };

  const associateDiseaseWithPlant = async (
    plantId: number,
    diseaseId: number
  ) => {
    try {
      const response = await fetch("/api/plants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "associateDiseaseWithPlant",
          plantId,
          diseaseId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorData.message}`
        );
      }
      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error associating disease with plant:", error);
      setResponseMessage(
        `Error associating disease with plant: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      throw error;
    }
  };

  const getTopFiveIssues = () => {
    return Object.entries(diseasesIssues)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5)
      .map(([issue, data], index) => ({
        name: issue,
        percentage: (
          (data.count /
            Object.values(diseasesIssues).reduce(
              (sum, issue) => sum + issue.count,
              0
            )) *
          100
        ).toFixed(1),
        rank: index + 1,
      }));
  };

  // Function to fetch similar images
  const fetchSimilarImages = async (plantName: string | number | boolean) => {
    const API_KEY = "AIzaSyDKjUJexCy7hF2JPxwY5KtnhnfB92Su2e4";
    const CX = "822179631a8e44f03";

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

  const closeIdentificationResults = () => {
    setAnimate(false);
    setTimeout(() => {
      setShowIdentificationResults(false);
      setResult(null);
      setTranslatedResult(null);
      setImage(null);
    }, 300);
  };

  // Modify the translateResult function
  const translateResult = async (lang: "en" | "fr" | "rw") => {
    if (!result) return;

    setLoading(true);
    try {
      const translateText = async (text: string) => {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, lang }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Translation failed");
        }

        const data = await response.json();
        return data.translatedText;
      };

      const translatedPlantInfo = await translateText(result.plantInfo);
      const translatedHealthAssessment = await translateText(
        result.healthAssessment
      );

      setTranslatedResult({
        plantInfo: translatedPlantInfo,
        healthAssessment: translatedHealthAssessment,
      });
    } catch (error) {
      console.error("Translation error:", error);
      if (
        error instanceof Error &&
        error.message.includes("Too Many Requests")
      ) {
        setTranslatedResult({
          plantInfo: "Translation limit reached. Please try again later.",
          healthAssessment:
            "Translation limit reached. Please try again later.",
        });
      } else {
        setTranslatedResult({
          plantInfo: `Translation error: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`,
          healthAssessment: `Translation error: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTranslateOptions = () => {
    setShowTranslateOptions(!showTranslateOptions);
  };

  // Add this useEffect to load diseasesIssues from localStorage on component mount
  useEffect(() => {
    const savedDiseasesIssues = localStorage.getItem("diseasesIssues");
    if (savedDiseasesIssues) {
      setDiseasesIssues(JSON.parse(savedDiseasesIssues));
    }
  }, []);

  // Add this useEffect to save diseasesIssues to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("diseasesIssues", JSON.stringify(diseasesIssues));
  }, [diseasesIssues]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        translateMenuRef.current &&
        !translateMenuRef.current.contains(event.target as Node)
      ) {
        setShowTranslateOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col -mt-24 pt-24 bg-gradient-to-br from-[#050414] via-[#1a0f2e] to-[#2a1b3d] text-white font-['Roboto']">
      {/* ... (existing styles and other elements) */}
      <PlantIdentifierStyles />
      <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 flex flex-col lg:flex-row gap-2 animate-fadeIn">
        <div className="flex-grow lg:mr-0 space-y-8">
          <div className="bg-[#130a2a]/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-[#ff00ff]/20">
            {showIdentificationResults && similarImages.length > 0 && (
              <CoolImageDisplay images={similarImages} />
            )}
            <div className="bg-[#130a2a]/80 rounded-2xl shadow-lg p-1 backdrop-blur-sm">
              <style>{styles}</style>
              <AnimatePresence>
                {isChatExpanded && (
                  <motion.div
                    key="chat-box"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="transition-all sticky top-20 z-10 duration-500 ease-in-out mt-8"
                  >
                    <div className="bg-gradient-to-br from-[#101329] to-[#222c3c] rounded-lg top-20 shrink-0 z-10 shadow-lg p-6 backdrop-blur-sm mb-8 border border-[#3F51B5] hover:shadow-xl transform transition-all duration-500">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-light text-[#66b5f6] flex items-center">
                          <FaComments className="mr-2 text-[#66b5f6]" /> AI Chat
                        </h3>
                        <button
                          onClick={toggleChatExpansion}
                          className="bg-gradient-to-br from-[#0a0c1b] to-[#24334c] text-[#66b5f6] px-3 py-1 rounded hover:bg-[#80bdef] transition font-light text-sm flex items-center"
                        >
                          <FaCompress className="mr-1" /> Minimize
                        </button>
                      </div>

                      <div
                        ref={chatContainerRef}
                        className="chat-container custom-scrollbar"
                      >
                        <div className="message-container">
                          <AnimatePresence>
                            {chatMessages.map((msg, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className={`message ${
                                  msg.sender === "user"
                                    ? "user-message"
                                    : "ai-message"
                                }`}
                              >
                                {msg.text}
                                {msg.sender === "ai" && (
                                  <button
                                    onClick={() =>
                                      navigator.clipboard.writeText(msg.text)
                                    }
                                    className="absolute top-0 right-0 mt-1 mr-1 bg-[#1f9ba4] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Copy to clipboard"
                                  >
                                    <FaCopy size={12} />
                                  </button>
                                )}
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {animatingMessage && (
                          <div className="typewriter-container">
                            <TypewriterEffect
                              text={animatingMessage}
                              onComplete={handleTypewriterComplete}
                            />
                          </div>
                        )}

                        {isRecording && (
                          <div className="voice-recording-indicator">
                            <div className="pulse"></div>
                            Recording...
                          </div>
                        )}
                      </div>
                      <div className="input-container">
                        <form
                          onSubmit={handleChatSubmit}
                          className="flex sticky bottom-10 m-2"
                        >
                          <input
                            type="text"
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask about the image..."
                            className="flex-grow bg-gradient-to-br from-[#0a0c1b] to-[#24334c] text-[#c8c8c8] rounded-l-full py-2 px-4 focus:outline-none focus:ring-1 focus:ring-[#1fbac0]"
                          />
                          <button
                            type="button"
                            onClick={toggleVoiceRecording}
                            className={`bg-gradient-to-br from-[#0a0c1b] to-[#24334c] text-white px-4 py-2 ${
                              isRecording ? "bg-red-500" : ""
                            } transition mr-2`}
                          >
                            {isRecording ? <FaStop /> : <FaMicrophone />}
                          </button>
                          <button
                            type="submit"
                            className="bg-gradient-to-br from-[#0a0c1b] text-white px-4 py-2 rounded-r-full hover:bg-[#1b233e] transition"
                          >
                            <FaPaperPlane />
                          </button>
                        </form>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header Section */}
              <div className="flex justify-between items-center mb-8  border-[#52B788] pb-4">
                <style>{styles}</style>
                <h2 className="text-5xl text-[#52B788] font-thin">
                  Plant Identifier
                </h2>
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
                          {["en", "fr", "rw"].map((lang) => (
                            <button
                              key={lang}
                              onClick={() => {
                                translateResult(lang as "en" | "fr" | "rw");
                                setShowTranslateOptions(false);
                              }}
                              className="block w-full text-left px-4 py-2 hover:bg-[#1B4332] transition disabled:opacity-50 disabled:cursor-not-allowed font-thin"
                              disabled={!result || loading}
                            >
                              {lang === "en"
                                ? "English"
                                : lang === "fr"
                                ? "French"
                                : "Kinyarwanda"}
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
                <div className="transition-all duration-300 ease-in-out mb-8">
                  <div className="flex justify-center space-x-4 mb-6">
                    <label className="bg-[#52B788] text-[#0a0908] px-6 py-3 rounded-full cursor-pointer hover:bg-[#3E8E69] transition font-thin flex items-center animate-pulse shadow-lg">
                      <FaUpload className="mr-2" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={handleCameraCapture}
                      className="bg-[#52B788] text-[#0a0908] px-6 py-3 rounded-full hover:bg-[#3E8E69] transition font-thin flex items-center animate-pulse shadow-lg"
                    >
                      <FaCamera className="mr-2" />
                      Take Photo
                    </button>
                  </div>
                  {/* Uploaded Image and Identify Button */}
                  {image && (
                    <div className="flex flex-col items-center mb-6">
                      <Image
                        src={image}
                        alt="Uploaded plant"
                        width={300}
                        height={300}
                        className="rounded-lg shadow-lg mb-4"
                      />
                      {/* // Updated Identify Button with Loading Spinner */}
                      <button
                        onClick={identifyPlant}
                        className={`bg-[#ff00ff] text-white px-8 py-3 rounded-full hover:bg-[#00ffff] transition-all duration-300 font-thin flex items-center justify-center neon-button shadow-lg ${
                          loading ? "cursor-not-allowed opacity-50" : ""
                        }`}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8v8l3.5 3.5A8 8 0 114 12z"
                              ></path>
                            </svg>
                            Identifying...
                          </span>
                        ) : (
                          <>
                            Identify Plant
                            <FaArrowRight className="ml-2" />
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Identification Results */}
              <PlantInfoComponent
                showIdentificationResults={showIdentificationResults}
                translatedResult={translatedResult}
                responseMessage={responseMessage}
              />
            </div>

            <div className="relative h-64 mb-8 rounded-2xl overflow-hidden">
              <Image
                src="/tropical-sunset.jpg"
                fill
                sizes="(max-width: 768px) 100vw, 
                        (max-width: 1200px) 50vw, 
                        33vw"
                alt="Tropical sunset"
                style={{ objectFit: "cover" }}
                className="transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050414] to-transparent"></div>
              <h2 className="absolute bottom-6 left-6 text-4xl text-white font-thin z-10 neon-text">
                Discover Nature&apos;s Secrets
              </h2>
            </div>

            {/* AI Explanation Section */}
            <div className="transition-all duration-300 hover:transform hover:scale-105 mt-8 pt-6 hover:shadow-lg hover:shadow-[#ff00ff]/20">
              <h3 className="text-2xl font-thin text-[#52B788] mb-4">
                How Our AI Works
              </h3>
              <p className="text-white font-thin mb-4">
                Our plant identification AI uses advanced machine learning
                algorithms to analyze images of plants and provide accurate
                information about their species, health, and care requirements.
              </p>
              <ol className="list-decimal list-inside text-[dad7cd] transition font-thin space-y-2">
                <li>Upload or take a photo of a plant</li>
                <li>
                  Our AI analyzes the image, considering factors like leaf
                  shape, color, and texture
                </li>
                <li>
                  The AI compares the image to its vast database of plant
                  species
                </li>
                <li>
                  It provides detailed information about the plant, including
                  its name and care instructions
                </li>
                <li>
                  The AI also assesses the plant&apos;s health and offers suggestions
                  for improvement if needed
                </li>
              </ol>
            </div>
          </div>
        </div>
        <div />
        {/* Right Column - Sidebar */}
        <aside className="lg:w-[calc(2/6*100%)] space-y-8 animate-slideInRight">
          {showIdentificationResults && image && (
            <div className="bg-[#130a2a]/60 rounded-2xl shadow-lg p-6 backdrop-blur-md border border-[#ff00ff]/20">
              <Image
                src={image}
                alt="Identified plant"
                width={200}
                height={200}
                className="rounded-lg shadow-lg mb-4 mx-auto"
              />
              <div className="flex justify-center space-x-2 mb-4">
                <button
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target && target.files && target.files.length > 0) {
                        const file = target.files[0];
                        const reader = new FileReader();
                        reader.onload = (e) => {
                          if (e.target && typeof e.target.result === "string") {
                            setImage(e.target.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }}
                  className="bg-[#52B788] text-[#0a0908] px-3 py-1 rounded hover:bg-[#3E8E69] transition font-thin text-sm flex items-center cursor-pointer"
                >
                  <FaUpload className="mr-1" /> New
                </button>
                <button
                  onClick={handleCameraCapture}
                  className="bg-[#52B788] text-[#0a0908] px-3 py-1 rounded hover:bg-[#3E8E69] transition font-thin text-sm flex items-center cursor-pointer"
                >
                  <FaCamera className="mr-1" /> Photo
                </button>
                {/* // Updated Identify Button with Loading Spinner */}
                <button
                  onClick={identifyPlant}
                  className={`bg-[#ff00ff] text-white px-4 py-1 rounded-full hover:bg-[#00ffff] transition-all duration-300 font-thin flex items-center justify-center neon-button shadow-lg ${
                    loading ? "cursor-not-allowed opacity-50" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8l3.5 3.5A8 8 0 114 12z"
                        ></path>
                      </svg>
                      ID...
                    </span>
                  ) : (
                    <>
                      ID
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* New Chat Box */}
          {!isChatExpanded && (
            <div className="bg-gradient-to-br from-[#101329] to-[#222c3c] rounded-lg top-20 shrink-0 z-10 shadow-lg p-6 backdrop-blur-sm mb-8 border border-[#3F51B5] hover:shadow-xl transition-all duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-light text-[#66b5f6] flex items-center">
                  <FaComments className="mr-3 text-[#66b5f6]" /> AI Chat
                </h3>
                <button
                  onClick={toggleChatExpansion}
                  className="bg-gradient-to-br from-[#0a0c1b] to-[#24334c] text-[#66b5f6] px-3 py-1 rounded hover:bg-[#25e2bf] transition font-light text-sm flex items-center"
                >
                  <FaExpand className="mr-2" />{" "}
                  {isChatExpanded ? "Collapse" : "Expand"}
                </button>
              </div>
              <div
                ref={chatContainerRef}
                className="chat-container custom-scrollbar"
              >
                <div className="message-container">
                  {chatMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${
                        msg.sender === "user" ? "user-message" : "ai-message"
                      }`}
                    >
                      {msg.text}
                      {msg.sender === "ai" && (
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText(msg.text)
                          }
                          className="absolute top-0 z-40 right-0 mt-1 mr-1 bg-[#161e79] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[#020e53]"
                          title="Copy to clipboard"
                        >
                          <FaCopy size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                {animatingMessage && (
                  <div className="typewriter-container">
                    <TypewriterEffect
                      text={animatingMessage}
                      onComplete={handleTypewriterComplete}
                    />
                  </div>
                )}
              </div>
              <div className="input-container">
                <form onSubmit={handleChatSubmit} className="flex">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about the plant..."
                    className="flex-grow bg-[#0A1929] text-white rounded-l-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-[#2196F3] placeholder-[#4FC3F7]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1fbac0] text-white px-6 py-3 rounded-r-full hover:bg-[#29cdd3] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#64B5F6]"
                  >
                    <FaPaperPlane className="text-lg" />
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="bg-[#130a2a]/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-[#ff00ff]/20">
            <h3 className="text-2xl font-thin text-[#52B788] mb-4">
              Top Plant Issues
            </h3>
            <div className="space-y-4">
              {getTopFiveIssues().map((issue, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-white font-thin">
                    {issue.rank}. {issue.name}
                  </span>
                  <div className="w-1/2 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-[#52B788] h-2.5 rounded-full"
                      style={{ width: `${issue.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-white font-thin">
                    {issue.percentage}%
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowAllTopIssues(!showAllTopIssues)}
              className="mt-4 bg-[#52B788] text-white px-4 py-2 rounded hover:bg-[#3E8E69] transition font-thin"
            >
              {showAllTopIssues ? "Show Less" : "Show All"}
            </button>

            {showAllTopIssues && (
              <div className="mt-4 space-y-2">
                {Object.entries(diseasesIssues)
                  .sort((a, b) => b[1].count - a[1].count)
                  .slice(5)
                  .map(([issue, data], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white font-thin">{issue}</span>
                      <span className="text-white font-thin">
                        {data.count} occurrences
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="bg-[#130a2a]/80 rounded-2xl shadow-lg p-6 backdrop-blur-sm border border-[#ff00ff]/20">
            <h3 className="text-2xl font-thin text-[#52B788] mb-4">
              Recently Detected Issues
            </h3>
            <div className="space-y-2">
              {(() => {
                const issueMap = new Map<string, number>();
                return Object.entries(diseasesIssues)
                  .sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated)
                  .reduce(
                    (
                      acc: [string, { count: number; lastUpdated: number }][],
                      [issue, data]
                    ) => {
                      if (issueMap.has(issue)) {
                        const count = issueMap.get(issue)! + 1;
                        issueMap.set(issue, count);
                        acc.push([`${issue} (${count})`, data]);
                      } else {
                        issueMap.set(issue, 1);
                        acc.push([issue, data]);
                      }
                      return acc;
                    },
                    []
                  )
                  .slice(0, showAllDetectedIssues ? undefined : 5)
                  .map(([issue, data], index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <span className="text-white font-thin">{issue}</span>
                      <span className="text-white font-thin">
                        {new Date(data.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                  ));
              })()}
            </div>
            <button
              onClick={() => setShowAllDetectedIssues(!showAllDetectedIssues)}
              className="mt-4 bg-[#52B788] text-white px-4 py-2 rounded hover:bg-[#3E8E69] transition font-thin"
            >
              {showAllDetectedIssues ? "Show Less" : "Show All"}
            </button>
          </div>
        </aside>
      </main>

      {/* Footer */}
      <footer className="bg-[#0a0520]/80 text-[#ff00ff] py-12 backdrop-blur-sm border-t border-[#ff00ff]/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-thin mb-2">About Plant Identifier</h3>
              <p className="font-thin">
                Our AI-powered plant identification tool helps you discover and
                learn about various plant species quickly and accurately.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-thin mb-2">Quick Links</h3>
              <ul className="space-y-2 font-thin">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition-colors duration-300"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-thin mb-2">Contact Us</h3>
              <p className="font-thin">Email: info@plantidentifier.com</p>
              <p className="font-thin">Phone: (123) 456-7890</p>
            </div>
          </div>
          <div className="mt-7 text-center">
            <p className="font-thin">
              &copy; 2024 Plant Identifier. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
