import { useState, useEffect, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface ChatSystemProps {
  image: string;
  result?: { plantInfo: string };
}

const ChatSystem: React.FC<ChatSystemProps> = ({ image, result }) => {
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [isAnalysisHidden, setIsAnalysisHidden] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [diseasesIssues, setDiseasesIssues] = useState<any[]>([]);
  

  const processAIResponse = useCallback(async (
    input: string,
    imageData: string,
    plantInfo: string,
    conversationHistory: string
  ): Promise<string> => {
    const genAI = new GoogleGenerativeAI(
      "AIzaSyDgtX4r0SbnGD1bluGrkDBN45OKG8UFSW4"
    );
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Based on the image I've uploaded and the following plant information: ${plantInfo}, please answer this question: ${input}
              Consider this conversation history for context: ${conversationHistory}
              Feel free to use emojis and a friendly tone in your response! 😊`,
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
  }, []);

  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim() || !image) return;
    
    const userMessage = { sender: "user", text: chatInput };
      const newLocal_1 = (prev: any) => [...prev, userMessage];
    setChatMessages(newLocal_1);
    setChatInput("");
    setLoading(true);

    try {
      const conversationHistory = chatMessages
        .map((msg) => `${msg.sender}: ${msg.text}`)
        .join('\n');

      const aiResponse = await processAIResponse(
        chatInput,
        image,
        result?.plantInfo || "",
        conversationHistory
      );
      const processedResponse = aiResponse.replace(/(\*\*|\#\#)/g, "");
      const aiMessage = { sender: "ai", text: processedResponse };
        const newLocal = (prev: any) => [...prev, aiMessage];
      setChatMessages(newLocal);
    } catch (error) {
      console.error("Error processing AI response:", error);
      const errorMessage = {
        sender: "ai",
        text: "Oops! 😅 I encountered an error. Let's try that again, shall we?",
      };
        const newLocal = (prev: any) => [...prev, errorMessage];
      setChatMessages(newLocal);
    } finally {
      setLoading(false);
    }
  };

  const toggleChatExpansion = () => {
    setIsChatExpanded(!isChatExpanded);
    setIsAnalysisHidden(!isAnalysisHidden);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("identificationHistory", JSON.stringify(history));
    }
  }, [history]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHistory = localStorage.getItem("identificationHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    }
  }, []);

  useEffect(() => {
    const savedDiseasesIssues = localStorage.getItem("diseasesIssues");
    if (savedDiseasesIssues) {
      setDiseasesIssues(JSON.parse(savedDiseasesIssues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diseasesIssues", JSON.stringify(diseasesIssues));
  }, [diseasesIssues]);

  return (
    <div>
      {/* Chat UI components */}
      <form onSubmit={handleChatSubmit}>
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Ask a question..."
        />
        <button type="submit" disabled={loading}>
          Send
        </button>
      </form>
      <div>
        {chatMessages.map((message, index) => (
          <div key={index} className={message.sender}>
            {message.text}
          </div>
        ))}
      </div>
      <button onClick={toggleChatExpansion}>
        {isChatExpanded ? "Collapse Chat" : "Expand Chat"}
      </button>
    </div>
  );
};

export default ChatSystem;