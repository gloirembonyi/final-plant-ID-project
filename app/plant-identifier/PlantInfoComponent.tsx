import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Leaf, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlantInfoComponentProps {
  showIdentificationResults: boolean;
  translatedResult: {
    plantInfo: string;
    healthAssessment: string;
  } | null;
}

const PlantInfoComponent: React.FC<PlantInfoComponentProps> = ({ showIdentificationResults, translatedResult }) => {
  const [activeSection, setActiveSection] = useState<'plantInfo' | 'healthAssessment'>('plantInfo');
  const [isHovered, setIsHovered] = useState(false);

  const toggleSection = () => {
    setActiveSection(activeSection === 'plantInfo' ? 'healthAssessment' : 'plantInfo');
  };

  if (!showIdentificationResults || !translatedResult) return null;

  const renderPlantInfo = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0a0520] to-[#1a0f2e] p-6 rounded-2xl shadow-xl backdrop-blur-lg transform transition-all duration-300 overflow-hidden hover:shadow-[#52B788]/30 hover:scale-102"
    >
      <h3 className="text-3xl font-bold text-[#52B788] mb-6 border-b border-[#52B788] pb-3 flex items-center">
        <Leaf className="mr-2" size={28} />
        Plant Information
      </h3>
      <div className="text-white space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {translatedResult.plantInfo.split('\n').map((line, index) => {
          if (line.includes(':')) {
            const [label, ...content] = line.split(':');
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start hover:bg-[#2a1f3e] p-3 rounded-lg transition-colors duration-300"
              >
                <p className="font-semibold text-[#52B788] min-w-[140px] flex-shrink-0">{label.trim()}:</p>
                <p className="ml-3 flex-grow">{content.join(':').trim()}</p>
              </motion.div>
            );
          }
          return <p key={index} className="text-[#dad7cd] italic">{line.trim()}</p>;
        })}
      </div>
    </motion.div>
  );

  const renderHealthAssessment = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-[#0a0520] to-[#1a0f2e] p-6 rounded-2xl shadow-xl backdrop-blur-lg transform transition-all duration-300 overflow-hidden hover:shadow-[#52B788]/30 hover:scale-102"
    >
      <h3 className="text-3xl font-bold text-[#52B788] mb-6 border-b border-[#52B788] pb-3 flex items-center">
        <Activity className="mr-2" size={28} />
        Health Assessment
      </h3>
      <div className="space-y-4 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {translatedResult.healthAssessment.split('\n').map((line: string, index: number) => {
          if (line.includes(':')) {
            const [label, ...content] = line.split(':');
            const isStatus = label.toLowerCase().includes('status') || 
                            label.toLowerCase().includes('statut') || 
                            label.toLowerCase().includes('imiterere');
            const isDiseases = label.toLowerCase().includes('diseases') || 
                            label.toLowerCase().includes('issues');
            const isPotentialCauses = label.toLowerCase().includes('potential causes');
            
            if (isStatus) {
              const status = content.join(':').trim().toLowerCase();
              const isGood = status.includes('good') || 
                            status.includes('bon') || 
                            status.includes('byiza') ||
                            status.includes('meza') ||
                            !status.includes('bad') &&
                            !status.includes('mauvais') &&
                            !status.includes('nibibi');
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center p-4 rounded-lg mb-4 ${
                    isGood ? 'bg-green-500/20' : isGood === false ? 'bg-red-500/20' : 'bg-yellow-500/20'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full mr-3 ${isGood ? 'bg-green-500' : isGood === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                  <p className="font-semibold text-lg text-white">{label.trim()}:</p>
                  <p className="ml-2 text-lg text-white">{content.join(':').trim()}</p>
                </motion.div>
              );
            } else if (isDiseases || isPotentialCauses) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="mb-4"
                >
                  <p className="font-semibold text-[#52B788] text-lg mb-2">{label.trim()}:</p>
                  <ul className="list-none ml-4 text-white space-y-2">
                    {content.join(':').split('-').filter(item => item.trim()).map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start"
                      >
                        <span className="text-[#52B788] mr-2">•</span>
                        <span>{item.trim()}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start hover:bg-[#2a1f3e] p-3 rounded-lg transition-colors duration-300"
              >
                <p className="font-semibold text-[#52B788] min-w-[140px] flex-shrink-0">{label.trim()}:</p>
                <p className="text-white ml-2 flex-grow">{content.join(':').trim()}</p>
              </motion.div>
            );
          } else if (line.trim()) {
            return <p key={index} className="text-[#dad7cd] italic">{line.trim()}</p>;
          }
          return null;
        })}
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
        className={`absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#52b78816] text-white p-3 rounded-full shadow-lg hover:bg-[#3a9d6f2f] transition-colors duration-300 ${
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
    </div>
  );
};

export default PlantInfoComponent;