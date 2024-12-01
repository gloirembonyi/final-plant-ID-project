import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Leaf, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlantInfoComponentProps {
  showIdentificationResults: boolean;
  translatedResult: {
    plantInfo: string;
    healthAssessment: string;
  } | null;
  responseMessage: string;
}

const PlantInfoComponent: React.FC<PlantInfoComponentProps> = ({
  showIdentificationResults,
  translatedResult,
  responseMessage
}) => {
  const [activeSection, setActiveSection] = useState<'plantInfo' | 'healthAssessment'>('plantInfo');
  const [isHovered, setIsHovered] = useState(false);

  const toggleSection = () => {
    setActiveSection(prev => prev === 'plantInfo' ? 'healthAssessment' : 'plantInfo');
  };

  useEffect(() => {
    if (responseMessage) {
      console.log('Response message:', responseMessage);
    }
  }, [responseMessage]);

  if (!showIdentificationResults || !translatedResult) return null;

  const renderContentItem = (line: string, index: number, isHealthAssessment: boolean) => {
    if (line.includes(':')) {
      const [label, ...content] = line.split(':');
      const isNumberedSubtitle = /^\d+\./.test(label.trim());

      if (isHealthAssessment && label.toLowerCase().includes('status')) {
        const status = content.join(':').trim().toLowerCase();
        const isGood = status.includes('good') || status.includes('bon') || status.includes('byiza') || status.includes('meza') || (!status.includes('bad') && !status.includes('mauvais') && !status.includes('nibibi'));
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center p-4 rounded-lg mb-4 ${isGood ? 'bg-green-500/20' : 'bg-red-500/20'}`}
          >
            <div className={`w-4 h-4 rounded-full mr-3 ${isGood ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <p className="font-semibold text-lg text-white">{label.trim()}:</p>
            <p className="ml-2 text-lg text-white">{content.join(':').trim()}</p>
          </motion.div>
        );
      }

      return (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`flex items-start p-2 rounded-lg transition-colors duration-300 ${isNumberedSubtitle ? 'mt-2' : 'hover:bg-[#2a1f3e]'}`}
        >
          <p className={`font-semibold ${isNumberedSubtitle ? 'text-[#52B788] text-2xl mb-2' : 'text-[#52B788] ml-8 min-w-[140px] flex-shrink-0'}`}>
            {label.trim()}:
          </p>
          {!isNumberedSubtitle && <p className="ml-3 flex-grow text-white">{content.join(':').trim()}</p>}
        </motion.div>
      );
    } else if (line.trim()) {
      return (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="text-[#dad7cd] italic ml-6"
        >
          {line.trim()}
        </motion.p>
      );
    }
    return null;
  };

  const renderPlantInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0a0520] to-[#1a0f2e] p-6 rounded-2xl shadow-xl backdrop-blur-lg transform transition-all duration-300 hover:shadow-[#52B788]/30 hover:scale-102"
    >
      <h3 className="text-3xl font-bold text-[#52B788] mb-6 border-b border-[#52B788] pb-3 flex items-center">
        <Leaf className="mr-2" size={28} />
        Plant Information
      </h3>
      <div className="text-white space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {translatedResult.plantInfo.split('\n').map((line, index) => renderContentItem(line, index, false))}
      </div>
    </motion.div>
  );

  const renderHealthAssessment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0a0520] to-[#1a0f2e] p-6 rounded-2xl shadow-xl backdrop-blur-lg transform transition-all duration-300 hover:shadow-[#52B788]/30 hover:scale-102"
    >
      <h3 className="text-3xl font-bold text-[#52B788] mb-6 border-b border-[#52B788] pb-3 flex items-center">
        <Activity className="mr-2" size={28} />
        Health Assessment
      </h3>
      <div className="space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {translatedResult.healthAssessment.split('\n').map((line, index) => renderContentItem(line, index, true))}
      </div>
    </motion.div>
  );

  return (
    <div
      className="relative transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatePresence mode="wait">
        {activeSection === 'plantInfo' ? renderPlantInfo() : renderHealthAssessment()}
      </AnimatePresence>
      <motion.button
        onClick={toggleSection}
        className={`absolute top-1/2 ${activeSection === 'plantInfo' ? '-right-4' : '-left-4'} transform -translate-y-1/2 bg-[#52b78816] text-white p-3 rounded-full shadow-lg hover:bg-[#3a9d6f2f] transition-colors duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        {activeSection === 'plantInfo' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
      </motion.button>
      {responseMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mt-4 p-3 bg-blue-500/20 text-white rounded-lg"
        >
          {responseMessage}
        </motion.div>
      )}
    </div>
  );
};

export default PlantInfoComponent;