import PageBanner from '../../components/PageBanner';
import { FaTruck, FaWarehouse, FaUsers } from 'react-icons/fa';

export default function About() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="About VRL Logistics" breadcrumb="About Us" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-gray-600 leading-relaxed text-justify">
            <p className="text-lg font-medium text-gray-800">
              VRL Logistics is a name synonymous with reliability and trust in the Indian logistics sector.
            </p>
            <p>
              With over 45 years of experience, we have mastered the art of moving. Whether it's shifting a household, relocating an office, or transporting a vehicle, our process is designed to be seamless and stress-free.
            </p>
            <p>
              Our massive fleet of 5000+ vehicles ensures that we are never short of capacity. We operate on a hub-and-spoke model that guarantees timely delivery across 23 states and 4 union territories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-primary text-white p-6 rounded-xl shadow-lg transform md:translate-x-4">
              <FaTruck className="text-3xl mb-2 opacity-80" />
              <h4 className="font-bold text-xl">Nationwide Network</h4>
              <p className="text-sm opacity-90">Connecting 1000+ cities across India.</p>
            </div>
            <div className="bg-secondary text-dark p-6 rounded-xl shadow-lg transform md:-translate-x-4">
              <FaWarehouse className="text-3xl mb-2 opacity-80" />
              <h4 className="font-bold text-xl">Warehousing</h4>
              <p className="text-sm opacity-90">Safe storage solutions for long & short term.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}