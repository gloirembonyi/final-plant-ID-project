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