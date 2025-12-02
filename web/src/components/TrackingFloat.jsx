import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaTimes, FaArrowRight, FaBoxOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function TrackingFloat() {
  const [isOpen, setIsOpen] = useState(false);
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      setIsOpen(false);
      navigate('/track', { state: { id: trackId.trim() } });
      setTrackId('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Tracking Popover */}
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

      {/* Floating Action Button (FAB) */}
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

      {/* Label Tooltip (Only when closed) */}
      {!isOpen && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-20 top-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
        >
          Track Shipment
          {/* Little arrow pointing right */}
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-red-600 transform -translate-y-1/2 rotate-45"></div>
        </motion.div>
      )}

    </div>
  );
}