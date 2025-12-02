import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
// FIXED: Added missing Link import
import { Link } from 'react-router-dom';
import { 
  FaShieldAlt, FaClock, FaMapMarkedAlt, FaCheckCircle, FaTruckMoving, 
  FaBoxOpen, FaUserTie, FaHeadset, FaChevronDown, FaChevronUp, FaCar, 
  FaUsers, FaBuilding, FaArrowRight, FaMotorcycle, FaHome, FaCity, FaClipboardCheck,
  FaTrophy, FaMedal
} from 'react-icons/fa';
import QuoteForm from '../components/QuoteForm';
import TrackingWidget from '../components/TrackingWidget';
import CautionModal from '../components/CautionModal';
import TiltCard from '../components/TiltCard';
import { motion, AnimatePresence } from 'framer-motion';

// --- DATA CONSTANTS ---

const HOME_SERVICES = [
  { 
    id: "car-transportation", 
    title: "Car Transportation", 
    desc: "Enclosed carriers for scratch-free movement.", 
    icon: FaCar, 
    color: "text-blue-600", 
    bg: "bg-blue-50" 
  },
  { 
    id: "bike-transportation", 
    title: "Bike Transportation", 
    desc: "Specialized stands and foam packaging.", 
    icon: FaMotorcycle, 
    color: "text-orange-600", 
    bg: "bg-orange-50" 
  },
  { 
    id: "household-shifting", 
    title: "Household Shifting", 
    desc: "3-layer packing for complete safety.", 
    icon: FaHome, 
    color: "text-green-600", 
    bg: "bg-green-50" 
  },
  { 
    id: "office-shifting", 
    title: "Office Relocation", 
    desc: "Zero downtime corporate moving solutions.", 
    icon: FaCity, 
    color: "text-purple-600", 
    bg: "bg-purple-50" 
  }
];

const GALLERY_PREVIEW = [
  "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80"
];

const REVIEWS = [
  { id: 2, name: "Anita Desai", route: "Mumbai to Pune", text: "My car was delivered in 24 hours without a single scratch. The enclosed carrier was very clean. Highly recommended.", type: "Car" },
  { id: 1, name: "Suresh Raina", route: "Bangalore to Delhi", text: "Exceptional service. The 3-layer packing for my LED TV and Glassware was impressive.", type: "Home" },
  { id: 3, name: "Tech Solutions Ltd", route: "Office Relocation", text: "Moved 50 workstations over the weekend. Zero downtime for our business.", type: "Office" },
];

const FAQS = [
  { question: "Do you provide car carrier services?", answer: "Absolutely. We use specialized enclosed car carriers (containers) to transport your vehicle safely without any wear, tear, or dust." },
  { question: "How early should I book my move?", answer: "We recommend booking at least 3-5 days in advance for local moves and 7-10 days for domestic moves to ensure slot availability." },
  { question: "Is my luggage insured?", answer: "Yes, we offer comprehensive transit insurance. If any damage occurs during transit, you can claim it as per the policy terms." },
  { question: "What are the hidden charges?", answer: "There are ZERO hidden charges. The quote provided after the survey is final, inclusive of labor, packing, and toll taxes." },
];

// --- ANIMATIONS ---
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const smoothUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.25, 0.1, 0.25, 1.0] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
};

const floatAnim = {
  animate: { y: [0, -20, 0], transition: { duration: 6, repeat: Infinity, ease: "easeInOut" } }
};

export default function Home() {
  const [filter, setFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('quote');
  const [openFaq, setOpenFaq] = useState(null);
  
  const filteredReviews = filter === 'All' ? REVIEWS : REVIEWS.filter(r => r.type === filter);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // JSON-LD Structured Data for Local Business
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": "VRL Logistic Packers & Movers",
    "image": "https://images.unsplash.com/photo-1586155638764-bf045442f6f3",
    "telephone": "+917338795585",
    "email": "info@vrllogistics.co.in",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "35, 2nd cross, Hsr Layout, 8th sector, Bommanahalli",
      "addressLocality": "Bengaluru",
      "addressRegion": "Karnataka",
      "postalCode": "560068",
      "addressCountry": "IN"
    },
    "priceRange": "₹₹",
    "url": "https://vrllogistic.com",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <>
      <Helmet>
        <title>VRL Logistic Packers & Movers | India's #1 Relocation Service</title>
        <meta name="description" content="Professional packers and movers for home shifting, office relocation, and vehicle transport. Get a free quote today." />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <CautionModal />

      {/* --- HERO SECTION --- */}
      <div className="relative min-h-[95vh] flex items-center bg-[#0B0F19] overflow-hidden">
        {/* Modern Mesh Gradients */}
        <motion.div variants={floatAnim} animate="animate" className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2 pointer-events-none opacity-60" />
        <motion.div variants={floatAnim} animate="animate" transition={{ delay: 3 }} className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none opacity-50" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid lg:grid-cols-2 gap-16 items-center py-24">
          
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full shadow-2xl shadow-primary/10"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-gray-300 font-medium tracking-wide text-sm">
                <span className="text-white font-bold">Welcome to</span> VRL Logistics Packers & Movers
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, x: -50 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3, duration: 0.8 }} 
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[1.05] tracking-tight"
            >
              Move With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-red-400">Confidence.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 0.5, duration: 0.8 }} 
              className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed border-l-4 border-primary pl-6 mx-auto lg:mx-0"
            >
              India's most trusted logistics partner. Specialized in <span className="text-white font-bold">Car & Bike Transportation</span> with zero damage guarantee.
            </motion.p>

            <motion.div 
              initial="hidden" 
              animate="visible" 
              variants={staggerContainer} 
              className="flex flex-wrap justify-center lg:justify-start gap-6 text-white font-medium pt-4"
            >
              {[ "ISO 9001:2015", "IBA Approved", "24/7 Support" ].map((item, i) => (
                <motion.div key={i} variants={fadeInUp} className="flex items-center gap-2.5 bg-white/5 px-4 py-2 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                  <FaCheckCircle className="text-primary" /> {item}
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Widget (Glassmorphism) */}
          <div className="relative group perspective-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <motion.div 
              layout 
              transition={{ duration: 0.3, ease: "easeInOut" }} 
              className="relative bg-[#1a1a1a]/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="flex border-b border-white/10">
                <button 
                  onClick={() => setActiveTab('quote')} 
                  className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${activeTab === 'quote' ? 'bg-primary text-white' : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  <FaTruckMoving className="text-xl" /> Get Quote
                </button>
                <button 
                  onClick={() => setActiveTab('track')} 
                  className={`flex-1 py-5 text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${activeTab === 'track' ? 'bg-secondary text-black' : 'bg-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}
                >
                  <FaMapMarkedAlt className="text-xl" /> Track Shipment
                </button>
              </div>
              <div className="p-8 md:p-10">
                <AnimatePresence mode="wait">
                  {activeTab === 'quote' ? (
                    <motion.div key="quote" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                      <div className="mb-6">
                        <h3 className="text-2xl font-bold text-white mb-1">Get Free Estimate</h3>
                        <p className="text-gray-400 text-sm">Fill details to get instant pricing within 5 mins.</p>
                      </div>
                      <QuoteForm theme="dark" />
                    </motion.div>
                  ) : (
                    <motion.div key="track" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }} className="py-12">
                      <TrackingWidget />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* --- STATS STRIP --- */}
      <motion.div 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.5 }} 
        variants={staggerContainer} 
        className="bg-white py-16 border-b border-gray-100 shadow-sm relative z-20"
      >
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-12 text-center">
          {[
            { icon: FaUsers, label: "Happy Customers", count: "56,200+" },
            { icon: FaBuilding, label: "Branches in India", count: "45+" },
            { icon: FaCar, label: "Vehicles Moved", count: "12k+" },
            { icon: FaMapMarkedAlt, label: "Cities Covered", count: "120+" },
            { icon: FaShieldAlt, label: "Insurance Claims", count: "0%" },
            { icon: FaClock, label: "On-Time Delivery", count: "98%" },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={smoothUp} className="group">
              <div className="mb-4 inline-flex p-4 rounded-2xl bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors duration-300 shadow-sm">
                <stat.icon className="text-3xl" />
              </div>
              <h4 className="text-3xl font-black text-gray-900 mb-1">{stat.count}</h4>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* --- SERVICES PREVIEW --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
            <span className="text-primary font-bold uppercase tracking-wider text-xs bg-primary/10 px-3 py-1 rounded-full">What We Do</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mt-4">Premium Relocation Services</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg">We offer a comprehensive range of logistics solutions tailored to your specific needs.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOME_SERVICES.map((service, idx) => (
              <motion.div 
                key={service.id} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1 }} 
                whileHover={{ y: -12 }} 
                className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className={`w-16 h-16 ${service.bg} rounded-2xl flex items-center justify-center text-3xl ${service.color} mb-8 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                  <service.icon />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-2">{service.desc}</p>
                <Link to={`/services/${service.id}`} className="text-sm font-bold text-dark flex items-center gap-2 group-hover:text-primary transition-colors">
                  Read More <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-16">
            <Link to="/services" className="inline-flex items-center gap-3 bg-dark text-white px-10 py-4 rounded-full font-bold hover:bg-primary transition-all shadow-lg hover:shadow-primary/30 uppercase tracking-wider text-sm">
              View All Services <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* --- HOW WE WORK (Redesigned) --- */}
      <section className="py-32 bg-[#0a0a0a] text-white relative overflow-hidden">
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-primary/5 to-black/0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <span className="text-secondary font-bold uppercase tracking-wider text-xs bg-secondary/10 px-3 py-1 rounded-full">Our Process</span>
            <h2 className="text-4xl md:text-6xl font-black mt-4">How We Work</h2>
            <p className="text-gray-400 mt-4 text-lg">Seamless relocation in 4 simple steps.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-12 relative">
            {/* Animated Connection Beam */}
            <div className="hidden md:block absolute top-16 left-0 w-full h-0.5 bg-gray-800 -z-10">
               <motion.div 
                 initial={{ scaleX: 0, originX: 0 }}
                 whileInView={{ scaleX: 1 }}
                 viewport={{ once: true }}
                 transition={{ duration: 1.5, ease: "easeInOut" }}
                 className="h-full w-full bg-gradient-to-r from-primary via-secondary to-primary"
               />
            </div>

            {[
              { step: "01", title: "Book", desc: "Request a quote online or call us directly.", icon: FaClipboardCheck },
              { step: "02", title: "Pack", desc: "Our team packs everything securely with premium materials.", icon: FaBoxOpen },
              { step: "03", title: "Move", desc: "Safe transportation via our fleet of enclosed carriers.", icon: FaTruckMoving },
              { step: "04", title: "Deliver", desc: "Unpacking and setting up at your new destination.", icon: FaHome },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="text-center group relative"
              >
                <div className="relative inline-block mb-8">
                   <div className="w-32 h-32 bg-[#151515] rounded-full flex items-center justify-center border-4 border-[#222] shadow-2xl group-hover:border-primary/50 transition-colors duration-500 relative z-10">
                     <item.icon className="text-4xl text-gray-500 group-hover:text-white transition-colors duration-300" />
                     <div className="absolute -right-2 -top-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center font-black text-sm shadow-lg border-4 border-[#0a0a0a]">
                       {item.step}
                     </div>
                   </div>
                   {/* Glow Effect */}
                   <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-200 group-hover:text-white transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed px-4">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- AWARDS & ACHIEVEMENTS (NEW) --- */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative group"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/fleet.png"
                  alt="VRL Fleet - Limca Book of Records"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <p className="text-white font-bold text-lg flex items-center gap-2">
                    <FaTrophy className="text-yellow-400" /> Largest Fleet Owner
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 border border-yellow-100 rounded-full text-yellow-700 font-bold text-xs uppercase tracking-wider">
                <FaMedal /> Hall of Fame
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
                Awards & <span className="text-primary">Achievements</span>
              </h2>
              <h3 className="text-2xl font-bold text-gray-800">
                Limca Book of Records Holder
              </h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                VRL Logistics Ltd holds a distinct place in the <span className="font-bold text-dark">Limca Book of Records</span> for being the largest fleet owner of commercial vehicles in India in the proprietorship sector.
              </p>
              
              <div className="bg-gray-50 border-l-4 border-primary p-6 rounded-r-xl">
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Current Fleet Strength</p>
                <p className="text-4xl font-black text-gray-900">3,450+ <span className="text-lg font-medium text-gray-500">Vehicles</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Why VRL Logistic?</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
          </motion.div>

          <motion.div 
            variants={staggerContainer} 
            initial="hidden" 
            whileInView="visible" 
            viewport={{ once: true }} 
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { icon: FaCar, title: "Enclosed Car Carriers", desc: "Your vehicle is transported in sealed, weather-proof carriers ensuring 100% safety from scratches and dust." },
              { icon: FaBoxOpen, title: "Premium Packing", desc: "We use 3-layer packaging including bubble wrap, foam, and corrugated sheets for household goods." },
              { icon: FaHeadset, title: "24/7 Live Tracking", desc: "Get round-the-clock GPS updates via WhatsApp, Email, or Phone regarding your vehicle and shipment." },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                variants={fadeInUp} 
                whileHover={{ y: -10 }} 
                className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all text-center group cursor-default"
              >
                <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm group-hover:bg-primary transition-colors duration-300">
                  <item.icon className="text-4xl text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- RECENT MOVEMENTS --- */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Recent Movements</h2>
            <p className="text-gray-500 mt-3">Stories from our happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {filteredReviews.map((review) => (
              <div key={review.id} className="h-full"><TiltCard review={review} /></div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FAQ --- */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 10 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ delay: idx * 0.1 }} 
                className="border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-colors bg-white"
              >
                <button 
                  onClick={() => toggleFaq(idx)} 
                  className="w-full flex justify-between items-center p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="font-bold text-gray-800 text-lg">{faq.question}</span>
                  {openFaq === idx ? <FaChevronUp className="text-primary" /> : <FaChevronDown className="text-gray-400" />}
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0 }} 
                      animate={{ height: "auto" }} 
                      exit={{ height: 0 }} 
                      className="bg-gray-50/50 px-6 pb-6 pt-2"
                    >
                      <p className="text-gray-600 text-base leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FINAL CTA --- */}
      <section className="py-24 bg-gradient-to-br from-primary to-red-800 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">Ready to Start Your Journey?</h2>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">Get a free quote instantly or call our experts to plan your move. We ensure a seamless relocation experience.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-primary px-10 py-4 rounded-full font-bold shadow-2xl hover:bg-gray-100 transition-all transform hover:-translate-y-1">
              Get Free Quote
            </Link>
            <a href="tel:+917338795585" className="bg-black/20 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold hover:bg-black/40 transition-all flex items-center justify-center gap-3">
              <FaHeadset /> Call Expert
            </a>
          </div>
        </div>
      </section>
    </>
  );
}