import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTruckMoving, FaBars, FaTimes, FaPhoneAlt, FaUserCircle, FaCaretDown, FaChevronDown, FaChevronUp, FaCreditCard, FaUser, FaUserShield, FaEnvelopeOpenText } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setMobileServicesOpen(false);
    setMobileContactOpen(false);
    setMobileAboutOpen(false);
  };

  const services = [
    { name: "Car Transportation",   path: "/services/car-transportation"   },
    { name: "Bike Transportation",  path: "/services/bike-transportation"  },
    { name: "Household Shifting",   path: "/services/household-shifting"   },
    { name: "Office Shifting",      path: "/services/office-shifting"      },
    { name: "Commercial Shifting",  path: "/services/commercial-shifting"  },
    { name: "Pet Relocation",       path: "/services/pet-relocation"       },
    { name: "Warehouse & Storage",  path: "/services/warehouse-storage"    },
    { name: "Loading & Unloading",  path: "/services/loading-unloading"    }
  ];

  const contactOptions = [
    { name: "Contact Us",  path: "/contact"  },
    { name: "Branch List", path: "/branches" },
    { name: "Careers",     path: "/careers"  }
  ];

  // Desktop-specific contact options with Tracking at position 2
  const desktopContactOptions = [
    contactOptions[0], // Contact Us
    { name: "Track Shipment", path: "/track" }, // Added Tracking
    ...contactOptions.slice(1) // Branch List, Careers
  ];

  const aboutOptions = [
    { name: "About Us",         path: "/about"         },
    { name: "History",          path: "/about/history" },
    { name: "Mission & Vision", path: "/about/mission" }
  ];

  // Helper for Desktop Links
  const NavLink = ({ to, children }) => (
    <Link 
      to={to} 
      className={`relative font-bold text-sm uppercase transition-colors duration-300 py-2 group ${
        location.pathname === to ? 'text-primary' : 'text-gray-700 hover:text-primary'
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ease-out ${location.pathname === to ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
  );

  return (
    <nav className={`fixed w-full z-[100] transition-all duration-300 border-b border-gray-100 ${scrolled ? 'bg-white shadow-lg py-0' : 'bg-white/95 backdrop-blur-md py-2'}`}>
      
      {/* --- TOP STRIP (CONTACT INFO) --- */}
      <div className={`hidden lg:flex justify-end px-8 bg-gray-50 border-b border-gray-100 transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-8 opacity-100'}`}>
        <div className="flex items-center space-x-6 text-xs font-bold text-gray-500 h-full">
          <span className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
            <FaPhoneAlt className="text-secondary" /> +91 73387 95585
          </span>
          <span className="w-px h-3 bg-gray-300"></span>
          <span className="hover:text-primary transition-colors cursor-pointer">admin@vrllogistic.com</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex justify-between items-center gap-12">
        
        {/* --- LOGO --- */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3 group shrink-0 mr-auto" aria-label="VRL Logistics Packers & Movers Home">
          <div className="bg-primary p-2.5 rounded-xl text-white shadow-md group-hover:bg-secondary group-hover:scale-105 transition-all duration-300 flex-shrink-0">
            <FaTruckMoving size={24} />
          </div>
          <div className="flex flex-col justify-center h-full">
            <h1 className="flex flex-col items-start leading-none">
              <span className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight group-hover:text-primary transition-colors">
                VRL <span className="text-primary group-hover:text-dark">LOGISTICS</span>
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 tracking-[0.36em] uppercase mt-0.5 ml-0.5 group-hover:text-gray-700 transition-colors">
                PACKERS & MOVERS
              </span>
            </h1>
          </div>
        </Link>

        {/* --- DESKTOP MENU WRAPPER (Aligned Right) --- */}
        <div className="hidden lg:flex items-center gap-8 ml-auto">
          
          {/* Navigation Links */}
          <div className="flex items-center gap-6 xl:gap-8">
            <NavLink to="/">Home</NavLink>
            
            {/* About Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 font-bold text-sm uppercase text-gray-700 hover:text-primary transition-colors py-6 cursor-pointer">
                About <FaCaretDown className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-48">
                <div className="bg-white shadow-xl rounded-xl border-t-4 border-primary overflow-hidden ring-1 ring-black/5">
                  {aboutOptions.map((opt, i) => (
                    <Link 
                      key={i} 
                      to={opt.path} 
                      className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary hover:pl-8 transition-all duration-200 border-b border-gray-100 last:border-0"
                    >
                      {opt.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Services Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 font-bold text-sm uppercase text-gray-700 hover:text-primary transition-colors py-6 cursor-pointer">
                Services <FaCaretDown className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Dropdown Panel */}
              <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-64">
                <div className="bg-white shadow-xl rounded-xl border-t-4 border-primary overflow-hidden ring-1 ring-black/5">
                  {services.map((s, i) => (
                    <Link 
                      key={i} 
                      to={s.path} 
                      className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary hover:pl-8 transition-all duration-200 border-b border-gray-100 last:border-0"
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Removed Tracking Link from Desktop Nav */}
            <NavLink to="/gallery">Gallery</NavLink>

            {/* Contact Dropdown (Includes Tracking now for PC) */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-1 font-bold text-sm uppercase text-gray-700 hover:text-primary transition-colors py-6 cursor-pointer">
                Contact <FaCaretDown className="text-gray-400 group-hover:text-primary group-hover:rotate-180 transition-transform duration-300" />
              </button>
              <div className="absolute top-[80%] right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-48">
                <div className="bg-white shadow-xl rounded-xl border-t-4 border-primary overflow-hidden ring-1 ring-black/5">
                  {desktopContactOptions.map((opt, i) => (
                    <Link 
                      key={i} 
                      to={opt.path} 
                      className="block px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-primary hover:pl-8 transition-all duration-200 border-b border-gray-100 last:border-0"
                    >
                      {opt.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200"></div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link 
              to="/payment" 
              className="flex items-center gap-2 font-bold text-xs uppercase text-white bg-green-600 hover:bg-green-700 transition-all px-4 py-2 rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
            >
              <FaCreditCard className="text-sm" /> Pay Online
            </Link>

            {/* Login Dropdown */}
            <div className="relative group h-full flex items-center">
              <button className="flex items-center gap-2 font-bold text-sm uppercase text-gray-500 hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                <FaUserCircle size={22} /> Login <FaCaretDown className="text-xs transition-transform duration-300 group-hover:rotate-180" />
              </button>
              
              {/* Login Options Dropdown */}
              <div className="absolute top-[80%] right-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-60">
                <div className="bg-white shadow-xl rounded-xl border-t-4 border-primary overflow-hidden ring-1 ring-black/5 p-1">
                  
                  {/* Admin */}
                  <Link 
                    to="/login" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-primary rounded-lg transition-all"
                  >
                    <div className="bg-red-100 text-red-600 p-2 rounded-full">
                      <FaUserShield size={14} />
                    </div>
                    Admin Login
                  </Link>

                  {/* Webmail */}
                  <a 
                    href="/webmail" // Placeholder link
                    //target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg transition-all"
                  >
                    <div className="bg-yellow-100 text-yellow-600 p-2 rounded-full">
                      <FaEnvelopeOpenText size={14} />
                    </div>
                    Webmail Login
                  </a>

                  {/* Customer */}
                  <Link 
                    to="/customer-login" 
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-primary rounded-lg transition-all"
                  >
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                      <FaUser size={14} />
                    </div>
                    Customer Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MOBILE MENU BUTTON --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="lg:hidden p-2 text-gray-600 hover:text-primary transition-colors rounded-lg focus:outline-none active:bg-gray-100 ml-auto"
          aria-label="Toggle Menu"
        >
          {isOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
        </button>
      </div>

      {/* --- MOBILE MENU OVERLAY (Fixed Drawer) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden fixed top-16 left-0 w-full h-[calc(100vh-4rem)] bg-white z-50 overflow-y-auto border-t border-gray-100 shadow-xl"
          >
            <div className="flex flex-col p-6 space-y-3 pb-24">
              <Link to="/" onClick={closeMenu} className="flex items-center justify-between p-3.5 font-bold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors text-sm">
                Home
              </Link>

              {/* Mobile About Accordion */}
              <div className="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-100">
                <button 
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)} 
                  className="w-full flex justify-between items-center p-3.5 font-bold text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  About {mobileAboutOpen ? <FaChevronUp className="text-xs text-primary" /> : <FaChevronDown className="text-xs text-gray-400" />}
                </button>
                <AnimatePresence>
                  {mobileAboutOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="border-t border-gray-100 bg-white"
                    >
                      {aboutOptions.map((opt, i) => (
                        <Link 
                          key={i} 
                          to={opt.path} 
                          onClick={closeMenu} 
                          className="block py-2.5 px-6 text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          {opt.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Mobile Services Accordion */}
              <div className="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-100">
                <button 
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)} 
                  className="w-full flex justify-between items-center p-3.5 font-bold text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  Services {mobileServicesOpen ? <FaChevronUp className="text-xs text-primary" /> : <FaChevronDown className="text-xs text-gray-400" />}
                </button>
                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="border-t border-gray-100 bg-white"
                    >
                      {services.map((s, i) => (
                        <Link 
                          key={i} 
                          to={s.path} 
                          onClick={closeMenu} 
                          className="block py-2.5 px-6 text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link to="/track" onClick={closeMenu} className="p-3.5 font-bold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors text-sm">Tracking</Link>
              <Link to="/gallery" onClick={closeMenu} className="p-3.5 font-bold text-gray-700 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors text-sm">Gallery</Link>

              {/* Mobile Contact Accordion - Keeps Original Order */}
              <div className="rounded-xl overflow-hidden bg-gray-50/50 border border-gray-100">
                <button 
                  onClick={() => setMobileContactOpen(!mobileContactOpen)} 
                  className="w-full flex justify-between items-center p-3.5 font-bold text-gray-700 hover:text-primary transition-colors text-sm"
                >
                  Contact {mobileContactOpen ? <FaChevronUp className="text-xs text-primary" /> : <FaChevronDown className="text-xs text-gray-400" />}
                </button>
                <AnimatePresence>
                  {mobileContactOpen && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="border-t border-gray-100 bg-white"
                    >
                      {contactOptions.map((opt, i) => (
                        <Link 
                          key={i} 
                          to={opt.path} 
                          onClick={closeMenu} 
                          className="block py-2.5 px-6 text-sm font-medium text-gray-500 hover:text-primary hover:bg-gray-50 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          {opt.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="h-px bg-gray-100 my-2"></div>
              
              <Link to="/payment" onClick={closeMenu} className="p-3.5 font-bold text-white bg-green-600 hover:bg-green-700 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-colors text-sm">
                <FaCreditCard/> Pay Online
              </Link>
              
              {/* Mobile Admin Login */}
              <Link to="/login" onClick={closeMenu} className="flex items-center justify-center gap-2 p-3.5 font-bold text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors text-xs uppercase tracking-widest border border-gray-100">
                <FaUserShield className="text-lg" /> Admin Login
              </Link>

              {/* Mobile Webmail Login */}
              <a 
                href="/webmail" // Placeholder link
                //target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 p-3.5 font-bold text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-xl transition-colors text-xs uppercase tracking-widest border border-gray-100"
              >
                <FaEnvelopeOpenText className="text-lg" /> Webmail Login
              </a>

              {/* Mobile Customer Login */}
              <Link to="/customer-login" onClick={closeMenu} className="flex items-center justify-center gap-2 p-3.5 font-bold text-gray-500 hover:text-primary hover:bg-gray-50 rounded-xl transition-colors text-xs uppercase tracking-widest border border-gray-100">
                <FaUser className="text-lg" /> Customer Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}