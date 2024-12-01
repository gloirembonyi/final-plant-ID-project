'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Leaf, Search, Database, Settings2, Loader2, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FeatureCardProps } from '@/types/Plan';


export default function Home() {
  const router = useRouter();
  const { isLoaded, userId, getToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    if (isLoaded && userId) {
      router.push('/plant-identifier');
    }
  }, [isLoaded, userId, router]);

  const handleStartIdentifying = async () => {
    if (!isLoaded) {
      setError('Authentication is still loading. Please wait...');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      if (!userId) {
        router.push('/sign-in');
      } else {
        const token = await getToken();
        if (token) {
          router.push('/plant-identifier');
        } else {
          setError('Session expired. Please sign in again.');
          router.push('/sign-in');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1B4332] to-[#081C15] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/api/placeholder/20/20')] opacity-5" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B4332]/90 to-transparent" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto px-4">
          <motion.nav 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="py-6 flex justify-between items-center"
          >
            <div className="flex items-center space-x-2">
              <Leaf className="text-green-400 h-8 w-8" />
              <span className="text-2xl font-light">PlantEye</span>
            </div>
            <div className="space-x-8">
              <button className="text-gray-300 hover:text-white transition">Features</button>
              <button className="text-gray-300 hover:text-white transition">About</button>
              <button className="text-gray-300 hover:text-white transition">Contact</button>
            </div>
          </motion.nav>

          <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.div
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.8,
                    staggerChildren: 0.2
                  }
                }
              }}
              className="max-w-4xl"
            >
              <motion.div variants={fadeIn} className="mb-6">
                <h1 className="text-7xl font-thin mb-6 leading-tight">
                  Discover the <span className="text-green-400">Natural World</span>
                  <br />Through Your Lens
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Identify any plant instantly using our advanced AI technology.
                  Learn about their characteristics and care requirements.
                </p>
              </motion.div>

              <motion.div variants={fadeIn} className="space-y-6">
                <button
                  onClick={handleStartIdentifying}
                  disabled={isLoading || !isLoaded}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
                >
                  <span className="relative z-10 flex items-center text-lg">
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Search className="mr-2" size={20} />
                    )}
                    {isLoading ? 'Loading...' : 'Start Identifying Plants'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {error && (
                  <Alert variant="destructive" className="mt-4 bg-red-500/10 border-red-500/20">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-8"
            >
              <ChevronDown className="animate-bounce w-6 h-6 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-gradient-to-b from-[#1B4332]/50 to-[#081C15]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <FeatureCard
              icon={<Database className="h-8 w-8 text-green-400" />}
              title="Extensive Database"
              description="Access information about thousands of plant species from around the world"
            />
            <FeatureCard
              icon={<Settings2 className="h-8 w-8 text-green-400" />}
              title="Smart Analysis"
              description="Get instant, accurate plant identification powered by advanced AI"
            />
            <FeatureCard
              icon={<Leaf className="h-8 w-8 text-green-400" />}
              title="Care Guidelines"
              description="Receive detailed care instructions and growing tips for your plants"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
}


const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 rounded-xl bg-gradient-to-br from-[#2D6A4F]/20 to-[#1B4332]/20 border border-green-900/30 backdrop-blur-sm"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-400">{description}</p>
  </motion.div>
);