import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { FaShieldAlt, FaClock, FaMapMarkedAlt, FaCheckCircle, FaTruckMoving } from 'react-icons/fa';
import QuoteForm from '../components/QuoteForm';
import CautionModal from '../components/CautionModal';
import TiltCard from '../components/TiltCard';

// Sample Data for Reviews
const REVIEWS = [
  { id: 1, name: "Suresh Raina", route: "Bangalore to Delhi", text: "Exceptional service. The 3-layer packing for my LED TV and Glassware was impressive.", type: "Home" },
  { id: 2, name: "Anita Desai", route: "Mumbai to Pune", text: "My car was delivered in 24 hours without a single scratch. Highly recommended.", type: "Car" },
  { id: 3, name: "Tech Solutions Ltd", route: "Office Relocation", text: "Moved 50 workstations over the weekend. Zero downtime for our business.", type: "Office" },
];

export default function Home() {
  const [filter, setFilter] = useState('All');
  
  const filteredReviews = filter === 'All' 
    ? REVIEWS 
    : REVIEWS.filter(r => r.type === filter);

  return (
    <>
      <Helmet>
        <title>VRL Logistic Packers & Movers | Premium Relocation Services</title>
      </Helmet>

      <CautionModal />

      {/* --- HERO SECTION (Dark Mode + Glassmorphism) --- */}
      <div className="relative min-h-[90vh] flex items-center bg-dark overflow-hidden">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-20">
          
          {/* Left: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-secondary font-bold tracking-wider text-xs uppercase animate-fade-in-up">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              India's Most Trusted Logistics Partner
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
              Move With <br />
              <span className="text-primary">Confidence.</span>
            </h1>
            
            <p className="text-gray-400 text-lg max-w-lg leading-relaxed border-l-4 border-secondary pl-6">
              Zero damage guarantee, real-time GPS tracking, and dedicated move managers for a stress-free relocation experience.
            </p>

            <div className="flex flex-wrap gap-4 text-white font-medium">
              <div className="flex items-center gap-2"><FaCheckCircle className="text-secondary" /> ISO 9001:2015</div>
              <div className="flex items-center gap-2"><FaCheckCircle className="text-secondary" /> IBA Approved</div>
              <div className="flex items-center gap-2"><FaCheckCircle className="text-secondary" /> 24/7 Support</div>
            </div>
          </div>

          {/* Right: Glassmorphism Quote Form */}
          {/* Right: Glassmorphism Quote Form */}
<div className="relative group perspective-1000">

  {/* Subtle glow on hover (white only) */}
  <div className="
    absolute inset-0 
    rounded-2xl 
    transition-all duration-500 
    opacity-0 
    group-hover:opacity-100 
    blur-xl 
    bg-white/10
  " />

  <div className="
    relative 
    bg-black/30 
    backdrop-blur-xl 
    border border-white/10 
    p-8 
    rounded-2xl 
    shadow-2xl
    transition-all 
    duration-300 
    group-hover:shadow-white/20
  ">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-white">Get Free Estimate</h3>
      <p className="text-gray-400 text-sm">
        Fill details to get instant pricing within 5 mins.
      </p>
    </div>

    {/* Dark theme */}
    <QuoteForm theme="dark" />
  </div>
</div>


        </div>
      </div>

      {/* --- RECENT SUCCESSFUL MOVEMENTS (Interactive 3D Section) --- */}
      <div className="py-24 bg-light relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black text-dark mb-2">Recent Movements</h2>
              <div className="h-1.5 w-24 bg-primary rounded-full"></div>
              <p className="mt-4 text-gray-500 max-w-md">See what our customers are saying about their recent relocation experiences.</p>
            </div>
            
            {/* Filter Buttons */}
            <div className="flex gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
              {['All', 'Home', 'Car', 'Office'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${
                    filter === type 
                    ? 'bg-dark text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* 3D Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8 perspective-1000">
            {filteredReviews.map((review) => (
              <div key={review.id} className="h-full">
                <TiltCard review={review} />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* --- SERVICES STRIP --- */}
      <div className="bg-dark py-16 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: FaTruckMoving, label: "Residential Moving", count: "15k+" },
              { icon: FaMapMarkedAlt, label: "Cities Covered", count: "120+" },
              { icon: FaShieldAlt, label: "Insurance Claims", count: "0%" },
              { icon: FaClock, label: "On-Time Delivery", count: "98%" },
            ].map((stat, idx) => (
              <div key={idx} className="group p-4">
                <stat.icon className="text-secondary text-4xl mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="text-3xl font-black text-white mb-1">{stat.count}</h4>
                <p className="text-gray-400 text-sm uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}