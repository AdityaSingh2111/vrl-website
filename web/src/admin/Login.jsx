import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { FaTruckMoving, FaLock, FaEnvelope } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Immediate redirection upon success
      navigate('/admin/dashboard'); 
    } catch (err) {
      console.error(err);
      setError("Invalid Email or Password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary transform -skew-y-6 origin-top-left translate-y-[-20%] z-0"></div>
      
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaTruckMoving className="text-4xl text-primary" />
          </div>
          <h2 className="text-3xl font-black text-gray-800">Admin Login</h2>
          <p className="text-gray-500 text-sm mt-1">Secure access to VRL Logistics Console</p>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded mb-6 text-sm font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-600 uppercase ml-1">Email Address</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-4 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="admin@vrllogistics.com"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="block text-xs font-bold text-gray-600 uppercase ml-1">Password</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-4 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-gray-50 focus:bg-white"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-xs text-gray-400 font-medium">
          Protected by Firebase Auth
        </div>
      </div>
    </div>
  );
}