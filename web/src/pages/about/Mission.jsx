import PageBanner from '../../components/PageBanner';
import { FaBullseye, FaEye, FaHandshake } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Mission() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Mission & Vision" breadcrumb="About Us / Mission" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cards Container */}
        <div className="grid md:grid-cols-2 gap-10 mt-8">
          
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary/10 p-4 rounded-full text-primary text-2xl">
                <FaBullseye />
              </div>
              <h3 className="text-2xl font-black text-gray-800">Our Mission</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              To provide safe, reliable, and time-bound logistics solutions to our customers while maintaining the highest standards of ethics and professional integrity. We strive to constantly innovate and upgrade our technology and infrastructure to stay ahead of the curve.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Customer Satisfaction First</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Zero Damage Delivery</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full"></div> Transparent Pricing</li>
            </ul>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-50 p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-secondary/10 p-4 rounded-full text-secondary text-2xl">
                <FaEye />
              </div>
              <h3 className="text-2xl font-black text-gray-800">Our Vision</h3>
            </div>
            <p className="text-gray-600 leading-relaxed mb-4">
              To be recognized as the most trusted and preferred logistics partner in India, setting benchmarks in quality, safety, and customer service. We aim to connect every corner of the country with our robust network.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Pan-India Expansion</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Sustainable Practices</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-secondary rounded-full"></div> Industry Leadership</li>
            </ul>
          </motion.div>

        </div>

        {/* Core Values */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-8">Core Values</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             {['Integrity', 'Excellence', 'Safety', 'Commitment'].map((val, i) => (
               <div key={i} className="p-4 border border-gray-100 rounded-lg bg-white shadow-sm font-bold text-gray-700">
                 {val}
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}