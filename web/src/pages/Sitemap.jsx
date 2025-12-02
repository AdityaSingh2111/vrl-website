import PageBanner from '../components/PageBanner';
import { Link } from 'react-router-dom';
import { FaHome, FaInfoCircle, FaTruck, FaImages, FaPhone, FaMapMarkerAlt, FaBriefcase, FaFileContract, FaShieldAlt } from 'react-icons/fa';

export default function Sitemap() {
  const sitemapData = [
    {
      category: "Main Navigation",
      icon: FaHome,
      links: [
        { name: "Home", path: "/" },
        { name: "About Us", path: "/about" },
        { name: "Services", path: "/services" },
        { name: "Track Shipment", path: "/track" },
        { name: "Gallery", path: "/gallery" },
        { name: "Contact Us", path: "/contact" },
      ]
    },
    {
      category: "Services",
      icon: FaTruck,
      links: [
        { name: "Car Transportation", path: "/services/car-transportation" },
        { name: "Bike Transportation", path: "/services/bike-transportation" },
        { name: "Household Shifting", path: "/services/household-shifting" },
        { name: "Office Shifting", path: "/services/office-shifting" },
        { name: "Commercial Shifting", path: "/services/commercial-shifting" },
        { name: "Pet Relocation", path: "/services/pet-relocation" },
        { name: "Warehouse & Storage", path: "/services/warehouse-storage" },
        { name: "Loading & Unloading", path: "/services/loading-unloading" },
      ]
    },
    {
      category: "About Company",
      icon: FaInfoCircle,
      links: [
        { name: "Company Profile", path: "/about" },
        { name: "History", path: "/about/history" },
        { name: "Mission & Vision", path: "/about/mission" },
        { name: "Our Branches", path: "/branches" },
        { name: "Careers", path: "/careers" },
      ]
    },
    {
      category: "Support & Legal",
      icon: FaFileContract,
      links: [
        { name: "Privacy Policy", path: "/privacy-policy" },
        { name: "Terms & Conditions", path: "/terms-conditions" },
        { name: "Pay Online", path: "/payment" },
        { name: "Admin Login", path: "/login" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Sitemap" breadcrumb="Sitemap" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {sitemapData.map((section, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-200">
                <div className="bg-white p-2 rounded-full text-primary shadow-sm">
                  <section.icon />
                </div>
                <h3 className="font-bold text-lg text-gray-800">{section.category}</h3>
              </div>
              <ul className="space-y-2">
                {section.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link 
                      to={link.path} 
                      className="text-gray-600 hover:text-primary hover:underline text-sm flex items-center gap-2 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full"></span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}