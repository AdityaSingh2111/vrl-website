import { useState, useEffect } from 'react';
import { FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CautionModal() {
  const [isOpen, setIsOpen] = useState(false);
  // Timer set to 8 seconds as requested
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    setIsOpen(true);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white w-full max-w-lg rounded-lg shadow-2xl relative border-[10px] border-secondary overflow-hidden"
        >
          {/* Close Button */}
          <button 
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
          >
            <FaTimes size={24} />
          </button>

          <div className="p-6 pt-8 text-center">
            
            {/* Skewed CAUTION Label */}
            <div className="relative inline-block mb-6">
              <div className="bg-[#1a1a1a] text-primary font-black text-3xl px-10 py-2 transform -skew-x-12 tracking-wider uppercase shadow-lg">
                Caution
              </div>
            </div>

            <p className="text-gray-800 font-medium mb-4 text-sm sm:text-base leading-relaxed">
              It has come to our notice that few shady logistics companies are operating with names similar to <span className="font-bold">VRL Logistics Packers and Movers</span>.
            </p>

            {/* Example Box */}
            <div className="bg-gray-100 border border-gray-200 rounded p-3 mb-5 text-gray-500 italic text-sm">
              Example: "VRL Packers and Movers", "VRL Shipping", "VRL Logistics Movers and Packers" etc.
            </div>

            <p className="text-gray-800 text-sm mb-6">
              Please note that <span className="font-bold">VRL Logistics Packers and Movers</span> is <span className="font-bold text-red-600 underline">NOT connected</span> to these entities.
            </p>

            {/* Dashed Separator */}
            <div className="border-t-2 border-dashed border-gray-300 w-full mb-6"></div>

            {/* Advance Payment Alert */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
                <FaExclamationTriangle />
                <span>Advance Payment Alert!</span>
              </div>
              <p className="text-gray-600 text-sm">
                Our authorized executives will <span className="font-bold text-black">NEVER</span> request advance payments via personal/saving accounts.
              </p>
            </div>
          </div>

          {/* Yellow Footer Bar */}
          <div className="bg-secondary py-3 text-center">
            <p className="text-red-700 font-bold text-sm animate-pulse">
              This message will disappear shortly... ({timeLeft}s)
            </p>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}