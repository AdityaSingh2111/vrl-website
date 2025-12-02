import PageBanner from '../components/PageBanner';
import { FaCar, FaMotorcycle, FaHome, FaBuilding, FaIndustry, FaPaw, FaWarehouse, FaBoxOpen, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SERVICES = [
  {
    title: "Car Transportation",
    icon: FaCar,
    desc: "Safe and secure car carriers ensuring scratch-free delivery of your vehicle to any part of India.",
    color: "text-blue-600",
    bg: "bg-blue-50"
  },
  {
    title: "Bike Transportation",
    icon: FaMotorcycle,
    desc: "Specialized two-wheeler carriers with protective packaging to prevent damage during transit.",
    color: "text-orange-600",
    bg: "bg-orange-50"
  },
  {
    title: "Household Shifting",
    icon: FaHome,
    desc: "Complete home relocation services including packing, loading, moving, and rearranging.",
    color: "text-green-600",
    bg: "bg-green-50"
  },
  {
    title: "Office Shifting",
    icon: FaBuilding,
    desc: "Seamless office relocation with minimal downtime. We handle IT equipment and furniture with care.",
    color: "text-purple-600",
    bg: "bg-purple-50"
  },
  {
    title: "Commercial Shifting",
    icon: FaIndustry,
    desc: "Heavy machinery and industrial equipment shifting using cranes and specialized trailers.",
    color: "text-red-600",
    bg: "bg-red-50"
  },
  {
    title: "Pet Relocation",
    icon: FaPaw,
    desc: "Stress-free movement for your furry friends with climate-controlled vehicles and expert handlers.",
    color: "text-yellow-600",
    bg: "bg-yellow-50"
  },
  {
    title: "Warehouse & Storage",
    icon: FaWarehouse,
    desc: "Secure, pest-free, and CCTV-monitored warehousing facilities for short and long-term storage.",
    color: "text-indigo-600",
    bg: "bg-indigo-50"
  },
  {
    title: "Loading & Unloading",
    icon: FaBoxOpen,
    desc: "Expert manpower for safe loading and unloading of goods to prevent breakage or injury.",
    color: "text-teal-600",
    bg: "bg-teal-50"
  }
];

export default function Services() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Our Premium Services" breadcrumb="Services" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className={`p-8 ${service.bg}`}>
                <div className={`w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl ${service.color} shadow-sm mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-6">{service.desc}</p>
                
                <Link to="/contact" className="inline-flex items-center gap-2 font-bold text-sm uppercase tracking-wider text-gray-800 group-hover:text-primary transition-colors">
                  Get Quote <FaArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}