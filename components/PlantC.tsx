import React from 'react';

interface PlantCProps {
  translateResult: (lang: 'en' | 'fr' | 'rw') => Promise<void>;
  result: string | null;
  loading: boolean;
  showTranslateOptions: boolean;
  setShowTranslateOptions: (show: boolean) => void;
}

const PlantC: React.FC<PlantCProps> = ({ 
  translateResult, 
  result, 
  loading, 
  showTranslateOptions, 
  setShowTranslateOptions 
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => setShowTranslateOptions(!showTranslateOptions)}
        className="px-4 py-2 bg-[#52B788] text-white rounded-md hover:bg-[#3E8E69] transition font-thin"
      >
        Translate
      </button>
      {showTranslateOptions && (
        <div className="absolute right-0 top-full mt-2 bg-[#081C15] border border-[#52B788] rounded-md shadow-lg z-10">
          {['en', 'fr', 'rw'].map((lang) => (
            <button
              key={lang}
              onClick={() => {
                translateResult(lang as 'en' | 'fr' | 'rw');
                setShowTranslateOptions(false);
              }}
              className="block w-full text-left px-4 py-2 hover:bg-[#1B4332] transition disabled:opacity-50 disabled:cursor-not-allowed font-thin"
              disabled={!result || loading}
            >
              {lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Kinyarwanda'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlantC;