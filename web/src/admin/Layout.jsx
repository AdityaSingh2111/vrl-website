import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, FaSignOutAlt, FaUserCircle, FaBell, FaSearch } from 'react-icons/fa';
import { auth, db } from '../lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [newLeadsCount, setNewLeadsCount] = useState(0);
  const navigate = useNavigate();

  // Listen for new leads count
  useEffect(() => {
    const q = query(collection(db, "quotes"), where("status", "==", "new"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNewLeadsCount(snapshot.size);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex font-sans overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64 h-full transition-all duration-300 relative z-0">
        
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 shrink-0 z-30 relative">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-gray-600 hover:text-primary p-2 transition-colors"
            >
              <FaBars size={24} />
            </button>
            
            <div className="hidden sm:flex flex-col">
              <h1 className="text-xl font-black text-gray-800 tracking-tight">
                ADMIN <span className="text-primary">CONSOLE</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">VRL Logistics Control Center</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-primary/30 focus-within:bg-white transition-all w-64">
               <FaSearch className="text-gray-400 mr-2" />
               <input placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400" />
            </div>

            {/* Notification Bell with Badge */}
            <button className="relative text-gray-400 hover:text-primary transition-colors">
              <FaBell size={20} />
              {newLeadsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse">
                  {newLeadsCount > 99 ? '99+' : newLeadsCount}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-gray-200 mx-2"></div>

            {/* Profile & Logout */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-gray-50 hover:bg-white border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-full transition-all cursor-pointer shadow-sm group">
                <div className="bg-primary/10 text-primary p-1.5 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                   <FaUserCircle className="text-xl" />
                </div>
                <div className="flex flex-col text-right hidden sm:flex">
                   <span className="text-xs font-bold text-gray-700 group-hover:text-gray-900">Administrator</span>
                   <span className="text-[10px] text-green-500 font-bold uppercase tracking-wide">Online</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 p-3 rounded-full transition-all shadow-sm group relative"
                title="Logout"
              >
                <FaSignOutAlt className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border-t-8 border-primary"
            >
              <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaSignOutAlt className="text-4xl text-primary ml-1" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 mb-2">Sign Out?</h2>
              <p className="text-gray-500 mb-8">Are you sure you want to end your current session?</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-3 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    handleLogout();
                    setShowLogoutConfirm(false);
                  }}
                  className="flex-1 py-3 px-6 bg-primary hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-colors"
                >
                  Logout
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}