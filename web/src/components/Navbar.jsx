import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTruckMoving, FaBars, FaTimes, FaPhoneAlt, FaUserCircle, FaCaretDown, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Mobile Menu State
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false); // Mobile Services Accordion State
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Helper to close menu on click
  const closeMenu = () => {
    setIsOpen(false);
    setMobileServicesOpen(false); // Also close services dropdown
  };

  const services = [
    "Car Transportation",
    "Bike Transportation",
    "Household Shifting",
    "Office Shifting",
    "Warehouse & Storage",
    "Loading & Unloading"
  ];

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white shadow-lg py-2' : 'bg-white/95 backdrop-blur-md py-3 border-b border-gray-100'}`}>
      
      {/* Top Contact Strip (Desktop Only) */}
      <div className={`hidden lg:flex justify-end px-8 mb-1 text-xs font-bold text-gray-500 transition-all duration-300 ${scrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-auto opacity-100'}`}>
        <div className="flex items-center space-x-6">
          <span className="flex items-center gap-2"><FaPhoneAlt className="text-secondary" /> 24/7 Support: +91 73387 95585</span>
          <span>admin@vrllogistic.com</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        
        {/* LOGO */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded text-white group-hover:bg-secondary transition-colors duration-300">
            <FaTruckMoving size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-black text-dark leading-none tracking-tighter">
              VRL <span className="text-primary">LOGISTIC</span>
            </span>
            <span className="text-[9px] md:text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase">Packers & Movers</span>
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/" className="font-bold text-sm uppercase text-dark hover:text-primary transition-colors">Home</Link>
          
          {/* Desktop Services Dropdown */}
          <div className="relative group h-full flex items-center">
            <button className="flex items-center gap-1 font-bold text-sm uppercase text-dark hover:text-primary transition-colors py-4">
              Services <FaCaretDown />
            </button>
            {/* Dropdown Menu */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-white shadow-xl rounded-b-lg border-t-4 border-primary opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
              {services.map((s, i) => (
                <Link 
                  key={i} 
                  to="/services" 
                  className="block px-6 py-3 text-sm text-gray-600 hover:bg-red-50 hover:text-primary border-b border-gray-100 last:border-0 font-medium"
                >
                  {s}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/track" className="font-bold text-sm uppercase text-dark hover:text-primary transition-colors">Tracking</Link>
          <Link to="/gallery" className="font-bold text-sm uppercase text-dark hover:text-primary transition-colors">Gallery</Link>
          <Link to="/contact" className="font-bold text-sm uppercase text-dark hover:text-primary transition-colors">Contact</Link>
          
          {/* Desktop Buttons */}
          <Link to="/login" className="flex items-center gap-2 font-bold text-sm uppercase text-gray-500 hover:text-primary transition-colors">
            <FaUserCircle size={18} /> Login
          </Link>
          <Link to="/contact" className="bg-primary hover:bg-red-700 text-white px-5 py-2.5 rounded shadow-lg transition-transform transform hover:-translate-y-0.5 font-bold text-xs uppercase tracking-wider">
            Get Quote
          </Link>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden text-dark p-2 focus:outline-none"
        >
          {isOpen ? <FaTimes size={26} className="text-primary" /> : <FaBars size={26} />}
        </button>
      </div>

      {/* MOBILE MENU (Responsive) */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-1 max-h-[80vh] overflow-y-auto">
              
              <Link to="/" onClick={closeMenu} className="p-3 font-bold text-dark hover:text-primary hover:bg-gray-50 rounded-lg">
                Home
              </Link>

              {/* Mobile Services Accordion */}
              <div className="rounded-lg overflow-hidden">
                <button 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  className="w-full flex justify-between items-center p-3 font-bold text-dark hover:text-primary hover:bg-gray-50 rounded-lg"
                >
                  Services
                  {mobileServicesOpen ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                </button>
                
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-gray-50 pl-4 border-l-2 border-primary ml-3"
                    >
                      {services.map((s, i) => (
                        <Link 
                          key={i} 
                          to="/services" 
                          onClick={closeMenu}
                          className="block py-3 text-sm font-medium text-gray-600 hover:text-primary border-b border-gray-200 last:border-0"
                        >
                          {s}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/track" onClick={closeMenu} className="p-3 font-bold text-dark hover:text-primary hover:bg-gray-50 rounded-lg">
                Tracking
              </Link>

              <Link to="/gallery" onClick={closeMenu} className="p-3 font-bold text-dark hover:text-primary hover:bg-gray-50 rounded-lg">
                Gallery
              </Link>
              
              <Link to="/contact" onClick={closeMenu} className="p-3 font-bold text-dark hover:text-primary hover:bg-gray-50 rounded-lg">
                Contact Us
              </Link>

              {/* Divider */}
              <div className="h-px bg-gray-100 my-2"></div>

              {/* Mobile Admin Login */}
              <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 p-3 font-bold text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg">
                <FaUserCircle className="text-xl" /> Admin / Employee Login
              </Link>

              <Link to="/contact" onClick={closeMenu} className="mt-4 bg-primary text-white text-center py-3.5 rounded-lg font-bold shadow-md uppercase tracking-wide text-sm">
                Get Free Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}