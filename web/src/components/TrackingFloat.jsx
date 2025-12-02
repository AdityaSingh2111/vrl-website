import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaTimes, FaArrowRight, FaBoxOpen, FaWhatsapp, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackingFloat() {
  // Tracking Widget State
  const [isOpen, setIsOpen] = useState(false);
  const [trackId, setTrackId] = useState('');
  
  // WhatsApp/Contact Widget State
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      setIsOpen(false);
      navigate('/track', { state: { id: trackId.trim() } });
      setTrackId('');
    }
  };

  const contactOptions = [
    { 
      label: "Chat", 
      icon: FaWhatsapp, 
      action: "https://wa.me/917338795585", 
      color: "bg-green-500",
      target: "_blank"
    },
    { 
      label: "Mail Us", 
      icon: FaEnvelope, 
      action: "mailto:admin@vrllogistic.com", 
      color: "bg-red-500",
      target: "_self"
    },
    { 
      label: "Call Now", 
      icon: FaPhoneAlt, 
      action: "tel:+917338795585", 
      color: "bg-blue-500",
      target: "_self"
    }
  ];

  return (
    <>
      {/* --- RIGHT: TRACKING WIDGET --- */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80 origin-bottom-right"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-black text-gray-800 text-lg flex items-center gap-2">
                  <FaBoxOpen className="text-primary" /> Track Order
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <FaTimes />
                </button>
              </div>
              
              <p className="text-xs text-gray-500 mb-3">Enter your consignment number to see live status.</p>

              <form onSubmit={handleTrack} className="relative">
                <input
                  type="text"
                  placeholder="e.g. VRL-1001"
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all uppercase placeholder-gray-400"
                  value={trackId}
                  onChange={(e) => setTrackId(e.target.value)}
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-red-700 text-white w-8 rounded-lg flex items-center justify-center transition-colors"
                >
                  <FaArrowRight size={12} />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all duration-300 ${
            isOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-primary text-white hover:bg-red-700'
          }`}
          aria-label="Track Shipment"
        >
          {isOpen ? <FaTimes /> : <FaMapMarkerAlt />}
        </motion.button>

        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="absolute right-20 top-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
          >
            Track Shipment
            <div className="absolute top-1/2 -right-1 w-2 h-2 bg-red-600 transform -translate-y-1/2 rotate-45"></div>
          </motion.div>
        )}

      </div>

      {/* --- LEFT: CONTACT/WHATSAPP WIDGET --- */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start">
        
        <AnimatePresence>
          {isContactOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 flex flex-col gap-3"
            >
              {contactOptions.map((option, idx) => (
                <motion.a
                  key={idx}
                  href={option.action}
                  target={option.target}
                  rel="noreferrer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setIsContactOpen(false)}
                  className="flex items-center gap-3 bg-white p-2 pr-5 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group text-decoration-none cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${option.color}`}>
                    <option.icon />
                  </div>
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">
                    {option.label}
                  </span>
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsContactOpen(!isContactOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-16 h-16 rounded-full shadow-xl flex items-center justify-center text-3xl transition-all duration-300 ${
            isContactOpen ? 'bg-gray-800 text-white rotate-90' : 'bg-[#25D366] text-white hover:bg-[#20b85c]'
          }`}
          aria-label="Contact Support"
        >
          {isContactOpen ? <FaTimes /> : <FaWhatsapp />}
        </motion.button>

        {!isContactOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            //className="absolute left-20 top-4 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
          >
            
            {/* <div className="absolute top-1/2 -left-1 w-2 h-2 bg-gray-900 transform -translate-y-1/2 rotate-45"></div> */}
          </motion.div>
        )}

      </div>
    </>
  );
}