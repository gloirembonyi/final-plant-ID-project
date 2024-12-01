export interface Plan {
  id: string;
  name: string;
  price: number;
  interval?: 'month' | 'year';
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonLink: string;
}


export interface FeatureCardProps {
  icon: React.ReactNode; 
  title: string;
  description: string;
}