import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface PlantInfoComponentProps {
  showIdentificationResults: boolean;
  translatedResult: {
    plantInfo: string;
    healthAssessment: string;
  } | null;
}

const PlantInfoComponent: React.FC<PlantInfoComponentProps> = ({ showIdentificationResults, translatedResult }) => {
  const [activeSection, setActiveSection] = useState<'plantInfo' | 'healthAssessment'>('plantInfo');

  const toggleSection = () => {
    setActiveSection(activeSection === 'plantInfo' ? 'healthAssessment' : 'plantInfo');
  };

  if (!showIdentificationResults || !translatedResult) return null;

  const renderPlantInfo = () => (
    <div className="bg-[#0a0520]/80 p-2 rounded-2xl shadow-lg backdrop-blur-sm transform transition-all duration-300 overflow-hidden hover:shadow-[#52B788]/20 hover:scale-105">
      <h3 className="text-3xl font-semibold text-[#52B788] mb-4 border-b border-[#52B788] pb-2">Plant Information</h3>
      <div className="text-white space-y-3 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
        {translatedResult.plantInfo.split('\n').map((line, index) => {
          if (line.includes(':')) {
            const [label, ...content] = line.split(':');
            return (
              <div key={index} className="flex items-start hover:bg-[#1a0f2e] p-2 rounded transition-colors duration-300">
                <p className="font-semibold text-[#52B788] min-w-[140px] flex-shrink-0">{label.trim()}:</p>
                <p className="ml-2 flex-grow">{content.join(':').trim()}</p>
              </div>
            );
          }
          return <p key={index} className="text-[#dad7cd]">{line.trim()}</p>;
        })}
      </div>
    </div>
  );

    const renderHealthAssessment = () => (
        <div className="bg-[#0a0520]/80 p-2 rounded-2xl shadow-lg backdrop-blur-sm transform transition-all duration-300 overflow-hidden hover:shadow-[#52B788]/20 hover:scale-105">
        <h3 className="text-3xl font-semibold text-[#52B788] mb-4 border-b border-[#52B788] pb-2">Health Assessment</h3>
        <div className="space-y-3 overflow-y-auto max-h-[500px] pr-4 custom-scrollbar">
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
                    <div key={index} className="flex items-center bg-opacity-50 p-3 rounded-lg mb-4" style={{backgroundColor: isGood ? 'rgba(34, 197, 94, 0.2)' : isGood === false ? 'rgba(239, 68, 68, 0.2)' : 'rgba(234, 179, 8, 0.2)'}}>
                    <div className={`w-4 h-4 rounded-full mr-3 ${isGood ? 'bg-green-500' : isGood === false ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                    <p className="font-semibold text-lg">{label.trim()}:</p>
                    <p className="ml-2 text-lg">{content.join(':').trim()}</p>
                    </div>
                );
                } else if (isDiseases || isPotentialCauses) {
                return (
                    <div key={index} className="mb-4">
                    <p className="font-semibold text-[#52B788] text-lg mb-2">{label.trim()}:</p>
                    <ul className="list-none ml-4 text-white space-y-2">
                        {content.join(':').split('-').filter(item => item.trim()).map((item, i) => (
                        <li key={i} className="flex items-start">
                            <span className="text-[#52B788] mr-2">•</span>
                            <span>{item.trim()}</span>
                        </li>
                        ))}
                    </ul>
                    </div>
                );
                }

            return (
              <div key={index} className="flex items-start hover:bg-[#1a0f2e] p-2 rounded transition-colors duration-300">
                <p className="font-semibold text-[#52B788] min-w-[140px] flex-shrink-0">{label.trim()}:</p>
                <p className="text-white ml-2 flex-grow">{content.join(':').trim()}</p>
              </div>
            );
          } else if (line.trim()) {
            return <p key={index} className="text-[#dad7cd]">{line.trim()}</p>;
          }
          return null;
        })}
      </div>
    </div>
  );

  return (
    <div className="transition-all hover:shadow-lg hover:shadow-[#ff00ff]/20">
      <div className="relative">
        {activeSection === 'plantInfo' ? renderPlantInfo() : renderHealthAssessment()}
        <button
          onClick={toggleSection}
          className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-[#52b78800] text-white p-2 rounded-full shadow-lg hover:bg-[#3a9d6e] transition-colors duration-300"
        >
          {activeSection === 'plantInfo' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
        </button>
      </div>
    </div>
  );
};

export default PlantInfoComponent;
