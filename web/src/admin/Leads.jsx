import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { FaSearch, FaFilter, FaWhatsapp, FaPhoneAlt, FaCar, FaMotorcycle, FaStickyNote, FaArrowRight, FaCalendarAlt, FaListOl, FaSort, FaSortUp, FaSortDown, FaMapMarkedAlt, FaRoute, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Leads() {
  const [allLeads, setAllLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('All');
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Mobile UI States
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Pagination & Sorting State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });

  useEffect(() => {
    const q = query(collection(db, "quotes")); 
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllLeads(data);
      setFilteredLeads(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = allLeads;

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(l => 
        l.name?.toLowerCase().includes(lowerTerm) || 
        l.phone?.includes(lowerTerm) ||
        l.trackingId?.toLowerCase().includes(lowerTerm)
      );
    }

    if (filterService !== 'All') {
      result = result.filter(l => l.service === filterService);
    }

    if (selectedDate) {
      result = result.filter(l => {
        if (!l.createdAt) return false;
        const date = l.createdAt.toDate();
        const leadDateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        return leadDateStr === selectedDate;
      });
    }

    setFilteredLeads(result);
    setCurrentPage(1); 
  }, [searchTerm, filterService, selectedDate, allLeads]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedLeads = [...filteredLeads].sort((a, b) => {
    if (sortConfig.key === 'createdAt' || sortConfig.key === 's_no') {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return sortConfig.direction === 'asc' ? timeA - timeB : timeB - timeA;
    }
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedLeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedLeads.length / itemsPerPage);

  const getServiceColor = (service) => {
    switch (service) {
      case 'Car Transportation': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Bike Transportation': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Household Shifting': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Office Shifting': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey && !(columnKey === 's_no' && sortConfig.key === 'createdAt')) {
      return <FaSort className="inline ml-1 text-blue-200 opacity-50" />;
    }
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="inline ml-1 text-white" /> 
      : <FaSortDown className="inline ml-1 text-white" />;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 relative min-h-screen md:min-h-0">
      
      {/* --- DESKTOP HEADER --- */}
      <div className="hidden md:flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leads Management</h2>
          <p className="text-sm text-gray-500">View and manage all customer enquiries</p>
        </div>
        
        {/* Controls Grid */}
        <div className="flex gap-3 items-center">
          {/* Entries Per Page */}
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
             <FaListOl className="text-gray-400 shrink-0" />
             <label htmlFor="entries" className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Rows:</label>
             <select
               id="entries"
               className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer text-sm"
               value={itemsPerPage}
               onChange={(e) => setItemsPerPage(Number(e.target.value))}
             >
               <option value={10}>10</option>
               <option value={25}>25</option>
               <option value={50}>50</option>
               <option value={100}>100</option>
             </select>
          </div>

          <div className="relative w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative w-48">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select 
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white w-full shadow-sm cursor-pointer text-sm truncate"
              value={filterService}
              onChange={(e) => setFilterService(e.target.value)}
            >
              <option value="All">All Services</option>
              <option value="Car Transportation">Car Transport</option>
              <option value="Bike Transportation">Bike Transport</option>
              <option value="Household Shifting">Household</option>
              <option value="Office Shifting">Office</option>
              <option value="Packers and Movers">Packers & Movers</option>
            </select>
          </div>
        </div>
      </div>

      {/* --- MOBILE HEADER (STICKY) --- */}
      <div className="md:hidden sticky top-0 z-20 -mx-6 px-6 pt-4 pb-2 bg-gray-50 border-b border-gray-200/50 backdrop-blur-xl bg-opacity-90 transition-all">
        <div className="flex gap-2 mb-2">
          <div className="relative flex-grow">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full shadow-sm text-sm bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className={`p-3 rounded-xl border transition-colors ${showMobileFilters ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            <FaFilter />
          </button>
        </div>

        {/* Collapsible Mobile Filters */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 pb-2">
                <div className="bg-white border border-gray-200 rounded-lg px-2 py-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Service</label>
                  <select 
                    className="w-full text-xs font-semibold bg-transparent outline-none py-1"
                    value={filterService}
                    onChange={(e) => setFilterService(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="Car Transportation">Car</option>
                    <option value="Bike Transportation">Bike</option>
                    <option value="Household Shifting">House</option>
                    <option value="Packers and Movers">Packers</option>
                  </select>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg px-2 py-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase">Date</label>
                  <input 
                    type="date" 
                    className="w-full text-xs font-semibold bg-transparent outline-none py-1"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* --- TABLE CONTENT --- */}
      <div className="bg-transparent md:bg-white rounded-none md:rounded-2xl shadow-none md:shadow-sm md:border border-gray-200 overflow-hidden">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-blue-600 text-white uppercase font-bold border-b border-blue-700">
              <tr>
                <th className="p-5 w-24 cursor-pointer hover:bg-blue-700 transition-colors select-none align-middle" onClick={() => handleSort('createdAt')}>
                  S.No <SortIcon columnKey="createdAt" />
                </th>
                <th className="p-5 align-middle min-w-[180px]">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-white cursor-default text-xs opacity-90">Date Received</span>
                    <input type="date" className="w-full text-xs text-gray-700 px-2 py-1.5 rounded border-none outline-none focus:ring-2 focus:ring-blue-300 shadow-inner" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                  </div>
                </th>
                <th className="p-5 align-middle">Customer Info</th>
                <th className="p-5 text-center align-middle">Route Details</th>
                <th className="p-5 align-middle">Service Requirements</th>
                <th className="p-5 align-middle">Quick Actions</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible" className="divide-y divide-gray-50">
              {currentItems.map((lead, index) => (
                <motion.tr key={lead.id} variants={itemVariants} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="p-5 font-medium text-gray-500">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td className="p-5">
                    <div className="flex items-center gap-2 text-gray-600 font-medium">
                      <FaCalendarAlt className="text-gray-400" />
                      <div>
                        <span className="block text-gray-900 font-bold">{lead.createdAt?.toDate().toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{lead.createdAt?.toDate().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="font-bold text-gray-800 text-base">{lead.name}</div>
                    <div className="flex flex-col gap-1 mt-1">
                      <a href={`tel:${lead.phone}`} className="text-xs text-gray-500 flex items-center gap-1 hover:text-primary transition-colors"><FaPhoneAlt size={10} /> {lead.phone}</a>
                      {lead.whatsappNumber && lead.whatsappNumber !== lead.phone && (
                        <span className="text-xs text-green-600 flex items-center gap-1 font-medium"><FaWhatsapp size={10} /> {lead.whatsappNumber}</span>
                      )}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col items-center justify-center min-w-[200px] space-y-2">
                      <div className="flex items-center gap-3 text-gray-700 font-medium justify-center w-full">
                        <div className="text-right w-1/2 overflow-hidden relative">
                          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">From</span>
                          <div className="relative overflow-hidden w-full whitespace-nowrap"><span className="inline-block animate-marquee hover:animate-none">{lead.from}</span></div>
                        </div>
                        <div className="text-blue-300 animate-pulse text-xl">➝</div>
                        <div className="text-left w-1/2 overflow-hidden relative">
                          <span className="block text-xs text-gray-400 uppercase tracking-wider mb-1">To</span>
                          <div className="relative overflow-hidden w-full whitespace-nowrap"><span className="inline-block animate-marquee hover:animate-none">{lead.to}</span></div>
                        </div>
                      </div>
                      <a href={`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(lead.from)}&destination=${encodeURIComponent(lead.to)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-600 hover:text-blue-600 text-xs font-bold rounded-full border border-gray-200 hover:border-blue-200 transition-colors">
                        <FaRoute className="text-blue-500" />
                        {lead.distance ? `${lead.distance} km` : 'Map'}
                      </a>
                    </div>
                  </td>
                  <td className="p-5">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border ${getServiceColor(lead.service)}`}>{lead.service}</span>
                    <div className="mt-2 space-y-1">
                      {lead.carModel && <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit"><FaCar className="text-purple-500" /> {lead.carModel} <span className="text-gray-400">|</span> Qty: {lead.numCars || 1}</div>}
                      {lead.bikeModel && <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded w-fit"><FaMotorcycle className="text-orange-500" /> {lead.bikeModel}</div>}
                      {lead.notes && <div className="flex items-start gap-1.5 text-xs text-gray-500 italic mt-1 max-w-[200px]"><FaStickyNote className="text-yellow-400 mt-0.5 shrink-0" /> "{lead.notes}"</div>}
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                      <a href={`tel:${lead.phone}`} className="p-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm" title="Call"><FaPhoneAlt /></a>
                      <a href={`https://wa.me/91${lead.whatsappNumber || lead.phone}?text=Hi ${lead.name}...`} target="_blank" rel="noreferrer" className="p-2.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-100" title="WhatsApp"><FaWhatsapp size={18} /></a>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>

        {/* Mobile Card View (Optimized) */}
        <div className="md:hidden space-y-3 pb-24">
          <AnimatePresence>
            {currentItems.map((lead, index) => (
              <motion.div key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                {/* ID Badge */}
                <div className="absolute top-0 right-0 bg-gray-100 text-gray-500 text-[10px] px-2 py-1 rounded-bl-lg font-mono">
                  #{(currentPage - 1) * itemsPerPage + index + 1}
                </div>

                {/* Header: Date & Name */}
                <div className="mb-3 pr-8">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <FaCalendarAlt size={10} /> {formatDate(lead.createdAt)}
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{lead.name}</h3>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ${getServiceColor(lead.service)}`}>
                    {lead.service?.split(' ')[0]}
                  </span>
                </div>

                {/* Route Strip */}
                <div className="flex flex-col gap-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-[9px] text-gray-400 uppercase font-bold">From</p>
                      <p className="text-xs font-bold text-gray-700 whitespace-normal break-words">{lead.from}</p>
                    </div>
                    <div className="flex flex-col items-center px-1">
                      <FaArrowRight className="text-gray-300 text-[10px]" />
                      {lead.distance && <span className="text-[9px] text-blue-500 font-bold whitespace-nowrap">{lead.distance} km</span>}
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-[9px] text-gray-400 uppercase font-bold">To</p>
                      <p className="text-xs font-bold text-gray-700 whitespace-normal break-words">{lead.to}</p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                {(lead.carModel || lead.bikeModel || lead.notes) && (
                  <div className="flex flex-col gap-2 mb-3">
                    {lead.carModel && (
                      <div className="bg-purple-50 p-2 rounded-lg border border-purple-100">
                        <span className="text-[10px] text-purple-400 uppercase font-bold block mb-0.5"><FaCar className="inline mr-1"/>Car</span>
                        <span className="text-xs font-bold text-purple-900 block whitespace-normal break-words">{lead.carModel}</span>
                      </div>
                    )}
                    {lead.bikeModel && (
                      <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
                        <span className="text-[10px] text-orange-400 uppercase font-bold block mb-0.5"><FaMotorcycle className="inline mr-1"/>Bike</span>
                        <span className="text-xs font-bold text-orange-900 block whitespace-normal break-words">{lead.bikeModel}</span>
                      </div>
                    )}
                    {lead.notes && (
                      <div className="bg-yellow-50 p-2 rounded-lg border border-yellow-100">
                        <span className="text-[10px] text-yellow-500 uppercase font-bold block mb-0.5"><FaStickyNote className="inline mr-1"/>Note</span>
                        <span className="text-xs font-medium text-yellow-800 block whitespace-normal break-words">{lead.notes}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <a href={`tel:${lead.phone}`} className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 active:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-lg text-sm transition-colors">
                    <FaPhoneAlt size={14} /> Call
                  </a>
                  <a 
                    href={`https://wa.me/91${lead.whatsappNumber || lead.phone}?text=Hi ${lead.name}...`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 active:bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    <FaWhatsapp size={16} /> WhatsApp
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {currentItems.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-400">
              <p>No leads found.</p>
            </div>
          )}
        </div>

        {/* --- MOBILE PAGINATION (FIXED BOTTOM) --- */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 z-30 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-50"
          >
            <FaChevronLeft /> Prev
          </button>
          
          <span className="text-xs font-bold text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-4 py-2 bg-gray-50 active:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 disabled:opacity-50"
          >
            Next <FaChevronRight />
          </button>
        </div>

        {/* Desktop Pagination */}
        <div className="hidden md:flex p-4 border-t border-gray-100 justify-between items-center bg-gray-50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-bold text-gray-600 transition-colors shadow-sm">Previous</button>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 text-sm font-bold text-gray-600 transition-colors shadow-sm">Next</button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { display: inline-block; white-space: nowrap; animation: marquee 10s linear infinite; }
      `}</style>
    </div>
  );
}