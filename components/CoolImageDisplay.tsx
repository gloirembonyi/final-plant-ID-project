import React from 'react';
import Image from 'next/image';

interface ImageType {
  url: string;
  name: string;
}

interface CoolImageDisplayProps {
  images: ImageType[];
}

const CoolImageDisplay: React.FC<CoolImageDisplayProps> = ({ images }) => (
  <div className="mb-8 overflow-hidden">
    <div className="flex space-x-4 animate-float">
      {images.map((img: ImageType, index: number) => (
        <div key={index} className="relative w-1/4 aspect-square rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[#ff00ff]/50">
          <Image
            src={img.url}
            alt={img.name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-500 hover:saturate-150"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#130a2a] via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="absolute bottom-2 left-2 text-white text-sm font-light">{img.name}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default CoolImageDisplay;