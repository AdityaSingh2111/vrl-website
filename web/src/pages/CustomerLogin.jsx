import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTruckMoving, FaLock, FaPhoneAlt, FaArrowLeft, FaUser } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CustomerLogin() {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- SIMULATED LOGIN LOGIC ---
    // In a real app, you would verify this against Firestore 'users' collection
    setTimeout(() => {
      if (mobile.length === 10 && password === 'vrl@123') { 
        // SUCCESS
        setShowSuccess(true);
        localStorage.setItem('customerAuth', JSON.stringify({ mobile, role: 'customer' }));
        setTimeout(() => {
          navigate('/customer/dashboard');
        }, 1500);
      } else {
        // FAILURE
        setError("Invalid Mobile Number or Password");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden font-sans">
      
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-2/5 bg-[#1e293b] transform -skew-y-3 origin-top-left z-0"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] z-0"></div>

      {/* Back Button */}
      <button 
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-20 flex items-center gap-2 text-white/80 hover:text-white font-bold transition-all text-sm"
      >
        <FaArrowLeft /> Back to Home
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-gray-100"
      >
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
            <FaUser className="text-4xl text-blue-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Customer Portal</h2>
          <p className="text-gray-500 text-sm">Login to track shipments & view documents</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-red-50 border-l-4 border-red-500 text-red-600 p-3 rounded mb-6 text-sm font-bold flex items-center gap-2"
          >
            <FaLock /> {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Registered Mobile No.</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaPhoneAlt />
              </div>
              <input 
                type="tel" 
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g,''))}
                maxLength="10"
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-gray-800 placeholder-gray-400"
                placeholder="9876543210"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors">
                <FaLock />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-gray-800 placeholder-gray-400"
                placeholder="••••••••"
                required 
              />
            </div>
            <p className="text-[10px] text-right text-gray-400 pt-1 cursor-pointer hover:text-blue-600">Forgot Password?</p>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#1e293b] hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Verifying...' : 'Secure Login'}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
           <p className="text-xs text-gray-400">
             New User? <span className="text-blue-600 font-bold cursor-pointer hover:underline">Track without login</span>
           </p>
        </div>
      </motion.div>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-xl"
            >
              <FaTruckMoving className="text-4xl text-white" />
            </motion.div>
            <h3 className="text-2xl font-black text-gray-900">Welcome Back!</h3>
            <p className="text-gray-500 mt-2">Redirecting to your dashboard...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}