import { Link } from 'react-router-dom';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaChevronRight } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: "Car Transportation", path: "/services/car-transportation" },
    { name: "Bike Transportation", path: "/services/bike-transportation" },
    { name: "Household Shifting", path: "/services/household-shifting" },
    { name: "Office Relocation", path: "/services/office-shifting" },
    { name: "Warehouse & Storage", path: "/services/warehouse-storage" },
    { name: "Commercial Shifting", path: "/services/commercial-shifting" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Track Shipment", path: "/track" },
    { name: "Gallery", path: "/gallery" },
    { name: "Contact Us", path: "/contact" },
    { name: "Branch List", path: "/branches" },
    { name: "Careers", path: "/careers" }
  ];

  return (
    <footer className="bg-[#0B0F19] text-white pt-20 pb-10 border-t-4 border-primary relative overflow-hidden">
      
      {/* Background Texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* --- TOP GRID SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Company Info */}
          <div className="space-y-6">
            <Link to="/" className="inline-block" aria-label="VRL Logistics Home">
              <img 
                src="/LOGO Test-1.png" 
                alt="VRL Logistics Packers & Movers" 
                className="h-21 w-auto object-contain brightness-0 invert opacity-90 hover:opacity-100 transition-opacity"
                width="200" 
                height="64"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              India's most trusted logistics partner with over 45 years of experience. We ensure safe, secure, and timely delivery of your valuables across the nation.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all duration-300 border border-white/10 hover:border-primary hover:-translate-y-1">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* 2. Our Services */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Our Services
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {services.map((service, i) => (
                <li key={i}>
                  <Link to={service.path} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors group">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full group-hover:scale-150 transition-transform"></span>
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 3. Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link to={link.path} className="text-gray-400 hover:text-white text-sm flex items-center gap-2 transition-colors group">
                    <FaChevronRight className="text-[10px] text-primary group-hover:translate-x-1 transition-transform" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6 relative inline-block">
              Get In Touch
              <span className="absolute bottom-0 left-0 w-1/2 h-0.5 bg-primary rounded-full"></span>
            </h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Head Office</span>
                  <p className="text-sm text-gray-300 leading-snug">
                    Giriraj Annexe, Circuit House Road,<br/>Hubballi, Karnataka 580029
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FaPhoneAlt />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Call Us 24/7</span>
                  <a href="tel:+917338795585" className="text-white font-bold hover:text-primary transition-colors block">
                    +91 73387 95585
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                  <FaEnvelope />
                </div>
                <div>
                  <span className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Support</span>
                  <a href="mailto:info@vrllogistics.co.in" className="text-sm text-gray-300 hover:text-white transition-colors">
                    info@vrllogistics.co.in
                  </a>
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* --- DIVIDER --- */}
        <div className="border-t border-gray-800 my-10"></div>

        {/* --- BOTTOM BAR --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-500">
          <p>
            &copy; {currentYear} <span className="text-white font-bold">VRL Logistics Packers & Movers</span>. All Rights Reserved.
          </p>
          
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link>
            <Link to="/sitemap" className="hover:text-primary transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}