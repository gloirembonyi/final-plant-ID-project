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



// import React, { useState } from 'react';
// import Image from 'next/image';
// import { motion, AnimatePresence } from 'framer-motion';
// import { ZoomIn, ZoomOut, X } from 'lucide-react';

// interface ImageType {
//   url: string;
//   name: string;
// }

// interface CoolImageDisplayProps {
//   images: ImageType[];
// }

// const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => {
//   const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
//   const [isZoomed, setIsZoomed] = useState(false);

//   const handleImageClick = (img: ImageType) => {
//     setSelectedImage(img);
//     setIsZoomed(false);
//   };

//   const handleZoom = () => {
//     setIsZoomed(!isZoomed);
//   };

//   const handleClose = () => {
//     setSelectedImage(null);
//     setIsZoomed(false);
//   };

//   return (
//     <div className="w-full bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-xl shadow-2xl">
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
//         {images.slice(0, 4).map((img: ImageType, index: number) => (
//           <motion.div
//             key={index}
//             className="relative aspect-square rounded-xl overflow-hidden shadow-lg cursor-pointer group"
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={() => handleImageClick(img)}
//           >
//             <Image
//               src={img.url}
//               alt={img.name}
//               layout="fill"
//               objectFit="cover"
//               className="transition-all duration-300 group-hover:brightness-110"
//             />
//             <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-end justify-center">
//               <p className="text-white font-semibold px-4 py-2 bg-black bg-opacity-50 rounded-t-lg transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
//                 {img.name}
//               </p>
//             </div>
//           </motion.div>
//         ))}
//       </div>
//       <AnimatePresence>
//         {selectedImage && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
//             onClick={handleClose}
//           >
//             <motion.div
//               className="relative max-w-5xl max-h-[90vh] bg-gradient-to-br from-indigo-800 to-purple-800 p-6 rounded-xl shadow-2xl"
//               onClick={(e) => e.stopPropagation()}
//               initial={{ scale: 0.9, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.9, opacity: 0 }}
//               transition={{ type: 'spring', stiffness: 300, damping: 30 }}
//             >
//               <div className={`relative ${isZoomed ? 'w-[150vw] h-[150vh]' : 'w-full h-full'} overflow-auto`}>
//                 <Image
//                   src={selectedImage.url}
//                   alt={selectedImage.name}
//                   layout="responsive"
//                   width={1200}
//                   height={800}
//                   objectFit="contain"
//                   className="transition-all duration-300"
//                 />
//               </div>
//               <motion.button
//                 className="absolute top-4 right-4 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors duration-300"
//                 onClick={handleZoom}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 {isZoomed ? <ZoomOut size={24} /> : <ZoomIn size={24} />}
//               </motion.button>
//               <motion.button
//                 className="absolute top-4 left-4 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-red-700 transition-colors duration-300"
//                 onClick={handleClose}
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 <X size={24} />
//               </motion.button>
//               <motion.h3
//                 className="text-white text-2xl font-bold mt-6 text-center"
//                 initial={{ y: 20, opacity: 0 }}
//                 animate={{ y: 0, opacity: 1 }}
//                 transition={{ delay: 0.2 }}
//               >
//                 {selectedImage.name}
//               </motion.h3>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default CoolImageDisplay;