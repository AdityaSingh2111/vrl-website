import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaTruckMoving, FaHome, FaBoxOpen, FaFileInvoice, FaHeadset, FaSignOutAlt } from 'react-icons/fa';

export default function CustomerLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('customerAuth');
    navigate('/customer-login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: FaHome },
    { name: 'My Bookings', path: '/customer/bookings', icon: FaTruckMoving },
    { name: 'Tracking', path: '/customer/tracking', icon: FaMapMarkerAlt }, // Assuming map icon import
    { name: 'Documents', path: '/customer/documents', icon: FaFileInvoice },
    { name: 'Support', path: '/customer/support', icon: FaHeadset },
  ];
  
  // Correcting missing import for FaMapMarkerAlt for the array above
  // Re-declaring imports to be safe inside the file context if you copy-paste
  const { FaMapMarkerAlt } = require('react-icons/fa');

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#1e293b] text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 border-r border-gray-700
      `}>
        <div className="h-20 flex items-center px-6 border-b border-gray-700">
          <div className="flex items-center gap-3 font-bold tracking-wider text-lg">
             <div className="bg-blue-600 p-1.5 rounded-lg"><FaTruckMoving /></div>
             <span>MY VRL</span>
          </div>
          <button onClick={() => setIsOpen(false)} className="md:hidden ml-auto text-gray-400"><FaTimes/></button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
             const isActive = location.pathname === item.path;
             return (
               <Link 
                 key={item.name} 
                 to={item.path}
                 onClick={() => setIsOpen(false)}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                   isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                 }`}
               >
                 <item.icon /> {item.name}
               </Link>
             )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-700">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-xl w-full transition-colors"
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-6 sticky top-0 z-30">
           <button onClick={() => setIsOpen(true)} className="md:hidden text-gray-600"><FaBars size={24} /></button>
           <div className="ml-auto flex items-center gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-gray-800">Welcome, Customer</p>
                 <p className="text-[10px] text-green-600 font-bold uppercase">Verified Account</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                <FaUser className="text-gray-500" />
              </div>
           </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}