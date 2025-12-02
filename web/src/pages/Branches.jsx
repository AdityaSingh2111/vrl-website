import { useState } from 'react';
import PageBanner from '../components/PageBanner';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const BRANCHES = [
  { city: "Bangalore", address: "No. 123, 4th Cross, Lalbagh Road, Bangalore - 560027", phone: "+91 98765 43210" },
  { city: "Mumbai", address: "Shop No 5, Vashi Plaza, Sector 17, Vashi, Mumbai - 400703", phone: "+91 98765 43211" },
  { city: "Delhi", address: "Plot No 14, Transport Nagar, Samalkha, New Delhi - 110037", phone: "+91 98765 43212" },
  { city: "Chennai", address: "15, Poonamallee High Rd, Maduravoyal, Chennai - 600095", phone: "+91 98765 43213" },
  { city: "Hyderabad", address: "Plot 45, Auto Nagar, Vanasthalipuram, Hyderabad - 500070", phone: "+91 98765 43214" },
  { city: "Pune", address: "Office 21, Transport Nagar, Nigdi, Pune - 411044", phone: "+91 98765 43215" },
  { city: "Kolkata", address: "Dankuni Toll Plaza, NH-2, Kolkata - 712311", phone: "+91 98765 43216" },
  { city: "Ahmedabad", address: "C-12, Transport Nagar, Narol, Ahmedabad - 382405", phone: "+91 98765 43217" },
];

export default function Branches() {
  const [search, setSearch] = useState('');

  const filtered = BRANCHES.filter(b => 
    b.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <PageBanner title="Our Branch Network" breadcrumb="Branches" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12 relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search your city..." 
            className="w-full pl-12 pr-4 py-3.5 rounded-full border border-gray-200 shadow-sm focus:ring-2 focus:ring-primary outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((branch, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-primary">
              <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-primary" /> {branch.city}
              </h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{branch.address}</p>
              <p className="text-sm font-bold text-gray-800 bg-gray-100 inline-block px-3 py-1 rounded">
                Tel: {branch.phone}
              </p>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">No branches found. Try a major city name.</div>
        )}
      </div>
    </div>
  );
}