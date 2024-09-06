import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ImageType {
  url: string;
  name: string;
}

interface CoolImageDisplayProps {
  images: ImageType[];
}

const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const handleImageClick = (img: ImageType) => {
    setSelectedImage(img);
    setIsZoomed(false);
  };

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="w-fullbg-gradient-to-br from-[#0a0520] to-[#1a0f2e] p-4 rounded-lg shadow-lg">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {images.slice(0, 4).map((img: ImageType, index: number) => (
          <motion.div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden shadow-md cursor-pointer"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)' }}
            onClick={() => handleImageClick(img)}
          >
            <Image
              src={img.url}
              alt={img.name}
              layout="fill"
              objectFit="cover"
              className="transition-all duration-300 hover:brightness-110"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-4xl max-h-[90vh] bg-[#1a0f2e] p-4 rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className={`relative ${isZoomed ? 'w-[120vw] h-[120vh]' : 'w-full h-full'} overflow-auto`}>
                <Image
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  layout="responsive"
                  width={1200}
                  height={800}
                  objectFit="contain"
                  className="transition-all duration-300"
                />
              </div>
              <motion.button
                className="absolute top-2 right-2 bg-[#52B788] text-white p-2 rounded-full shadow-lg hover:bg-[#3a9d6e] transition-colors duration-300"
                onClick={handleZoom}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
              </motion.button>
              <motion.h3
                className="text-white text-xl font-semibold mt-4 text-center"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {selectedImage.name}
              </motion.h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoolImageDisplay;