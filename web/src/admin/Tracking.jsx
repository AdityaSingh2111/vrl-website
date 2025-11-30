import { useState, useEffect, useRef } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot, addDoc, doc, updateDoc, arrayUnion, serverTimestamp, orderBy } from 'firebase/firestore';
import { FaPlus, FaMapMarkerAlt, FaCalendarAlt, FaEdit, FaCar, FaMotorcycle, FaSearch, FaFilter, FaListOl, FaSortAmountDown, FaSortAmountUp, FaTruck, FaBoxOpen } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tracking() {
  // --- STATE MANAGEMENT ---
  const [allConsignments, setAllConsignments] = useState([]);
  const [filteredConsignments, setFilteredConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters & Sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' = Newest first

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);

  // Forms
  const [newShipment, setNewShipment] = useState({
    customerName: '',
    trackingId: '',
    from: '',
    to: '',
    service: 'Household Shifting',
    currentLocation: '',
    estimatedDelivery: '',
    currentStatus: 'Booked',
    vehicleModel: '',
    rcNumber: ''
  });

  const [updateStatus, setUpdateStatus] = useState({ 
    status: 'In Transit', 
    location: '',
    estimatedDelivery: ''
  });

  // Google Places Refs
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    // Fetch all to allow client-side sorting/filtering without index issues
    const q = query(collection(db, "consignments"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAllConsignments(data);
      setFilteredConsignments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- FILTERING & SORTING LOGIC ---
  useEffect(() => {
    let result = [...allConsignments];

    // 1. Search
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.trackingId?.toLowerCase().includes(lowerTerm) ||
        item.customerName?.toLowerCase().includes(lowerTerm) ||
        item.from?.toLowerCase().includes(lowerTerm) ||
        item.to?.toLowerCase().includes(lowerTerm)
      );
    }

    // 2. Status Filter
    if (filterStatus !== 'All') {
      result = result.filter(item => item.currentStatus === filterStatus);
    }

    // 3. Sorting (Date)
    result.sort((a, b) => {
      const timeA = a.createdAt?.seconds || 0;
      const timeB = b.createdAt?.seconds || 0;
      return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
    });

    setFilteredConsignments(result);
    setCurrentPage(1); // Reset page on filter change
  }, [searchTerm, filterStatus, sortOrder, allConsignments]);

  // --- PAGINATION LOGIC ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredConsignments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredConsignments.length / itemsPerPage);

  // --- HELPER FUNCTIONS ---
  const getDefaultDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  };

  const generateTrackingId = () => {
    if (allConsignments.length === 0) return 'VRL-1001';
    const maxId = allConsignments.reduce((max, item) => {
      const num = parseInt(item.trackingId?.split('-')[1] || 0);
      return num > max ? num : max;
    }, 1000);
    return `VRL-${maxId + 1}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Transit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Booked': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Out for Delivery': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // --- MODAL HANDLERS ---
  const openCreateModal = () => {
    const nextId = generateTrackingId();
    setNewShipment({
      customerName: '',
      trackingId: nextId,
      from: '',
      to: '',
      service: 'Household Shifting',
      currentLocation: '',
      estimatedDelivery: getDefaultDate(),
      currentStatus: 'Booked',
      vehicleModel: '',
      rcNumber: ''
    });
    setShowCreateModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const startLocation = newShipment.currentLocation || newShipment.from;
      await addDoc(collection(db, "consignments"), {
        ...newShipment,
        currentLocation: startLocation,
        createdAt: serverTimestamp(),
        timeline: [{ status: 'Booked', location: startLocation, timestamp: new Date() }]
      });
      setShowCreateModal(false);
    } catch (error) { alert("Error creating shipment"); }
  };

  const openUpdateModal = (shipment) => {
    setSelectedShipment(shipment);
    setUpdateStatus({
      status: shipment.currentStatus,
      location: shipment.currentLocation || '',
      estimatedDelivery: shipment.estimatedDelivery || ''
    });
    setShowUpdateModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedShipment) return;
    try {
      await updateDoc(doc(db, "consignments", selectedShipment.id), {
        currentStatus: updateStatus.status,
        currentLocation: updateStatus.location,
        estimatedDelivery: updateStatus.estimatedDelivery,
        timeline: arrayUnion({ status: updateStatus.status, location: updateStatus.location, timestamp: new Date() })
      });
      setShowUpdateModal(false);
    } catch (error) { alert("Error updating shipment"); }
  };

  // Google Places Effect
  useEffect(() => {
    if (showCreateModal && window.google) {
      const options = { types: ['(cities)'], componentRestrictions: { country: 'in' } };
      const timer = setTimeout(() => {
        if (fromRef.current) {
          const fromAC = new window.google.maps.places.Autocomplete(fromRef.current, options);
          fromAC.addListener("place_changed", () => setNewShipment(p => ({ ...p, from: fromAC.getPlace().formatted_address || fromAC.getPlace().name })));
        }
        if (toRef.current) {
          const toAC = new window.google.maps.places.Autocomplete(toRef.current, options);
          toAC.addListener("place_changed", () => setNewShipment(p => ({ ...p, to: toAC.getPlace().formatted_address || toAC.getPlace().name })));
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [showCreateModal]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-6 pb-20">
      
      {/* --- HEADER & CONTROLS --- */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Shipments & Tracking</h2>
            <p className="text-sm text-gray-500">Manage all active and past consignments</p>
          </div>
          <button 
            onClick={openCreateModal} 
            className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-red-200 transition-all active:scale-95"
          >
            <FaPlus /> New Shipment
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-3 items-center">
          
          {/* Entries Selector */}
          <div className="flex items-center gap-2 w-full lg:w-auto bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
             <FaListOl className="text-gray-400 shrink-0" />
             <label className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap hidden xl:inline-block">Rows:</label>
             <select
               className="bg-transparent font-bold text-gray-700 outline-none cursor-pointer text-sm w-full"
               value={itemsPerPage}
               onChange={(e) => setItemsPerPage(Number(e.target.value))}
             >
               <option value={10}>10</option>
               <option value={25}>25</option>
               <option value={50}>50</option>
               <option value={100}>100</option>
             </select>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search ID, Name, City..." 
              className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full shadow-sm text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div className="relative w-full lg:w-48">
            <FaFilter className="absolute left-3 top-3 text-gray-400" />
            <select 
              className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none bg-white w-full shadow-sm cursor-pointer text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          {/* Sort Order */}
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 shadow-sm w-full lg:w-auto"
          >
            {sortOrder === 'desc' ? <FaSortAmountDown className="text-primary"/> : <FaSortAmountUp className="text-primary"/>}
            <span className="hidden sm:inline">Date</span>
          </button>
        </div>
      </div>

      {/* --- CARDS GRID --- */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {currentItems.map((s, index) => (
            <motion.div 
              key={s.id} 
              variants={itemVariants}
              layout
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all group flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-mono bg-gray-100 text-gray-500 px-1.5 rounded">
                            #{indexOfFirstItem + index + 1}
                        </span>
                        <h3 className="font-black text-xl text-gray-800">{s.trackingId}</h3>
                    </div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1 truncate max-w-[150px]">{s.service}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(s.currentStatus)}`}>
                    {s.currentStatus}
                  </span>
                </div>
                
                {/* Vehicle Badge */}
                {(s.vehicleModel || s.rcNumber) && (
                  <div className="mb-4 bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center gap-2 text-xs text-gray-600">
                    {s.service.includes('Bike') ? <FaMotorcycle className="text-orange-500 text-lg"/> : <FaCar className="text-purple-500 text-lg"/>}
                    <div>
                        <span className="font-bold block">{s.vehicleModel || 'Unknown Model'}</span>
                        <span className="font-mono text-[10px] text-gray-400">{s.rcNumber || 'No RC'}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">From</span>
                      <span className="font-bold text-gray-700 truncate block">{s.from}</span>
                    </div>
                    <div className="text-gray-300 px-2">➝</div>
                    <div className="flex-1 text-right">
                      <span className="text-[10px] text-gray-400 uppercase font-bold block">To</span>
                      <span className="font-bold text-gray-700 truncate block">{s.to}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-xs text-gray-500 px-1">
                    <FaMapMarkerAlt className="text-red-500 mt-0.5 shrink-0" />
                    <span className="truncate">Current: <span className="font-semibold text-gray-700">{s.currentLocation || 'N/A'}</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 px-1">
                    <FaCalendarAlt className="text-blue-500 shrink-0" />
                    <span>Est: <span className="font-semibold text-gray-700">{s.estimatedDelivery || 'N/A'}</span></span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                <div className="flex items-center gap-2 max-w-[60%]">
                    <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                        {s.customerName?.charAt(0) || 'U'}
                    </div>
                    <p className="text-xs text-gray-500 font-medium truncate">{s.customerName}</p>
                </div>
                <button 
                  onClick={() => openUpdateModal(s)}
                  className="flex items-center gap-1.5 text-xs font-bold text-white bg-dark hover:bg-primary px-3 py-2 rounded-lg transition-colors shadow-sm"
                >
                  <FaEdit /> Update
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- PAGINATION --- */}
      {filteredConsignments.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-xs font-bold text-gray-500 uppercase">
            Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredConsignments.length)} of {filteredConsignments.length}
          </span>
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex-1 sm:flex-none px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-gray-600 disabled:opacity-50 hover:bg-gray-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* --- CREATE MODAL --- */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-8 rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="font-black text-2xl mb-6 text-gray-800">Create New Shipment</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Tracking ID</label>
                  <input className="w-full border border-gray-300 bg-gray-100 p-3 rounded-xl font-mono font-bold text-gray-600 outline-none" value={newShipment.trackingId} readOnly />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Est. Delivery</label>
                  <input type="date" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={newShipment.estimatedDelivery} onChange={e => setNewShipment({...newShipment, estimatedDelivery: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Customer Name</label>
                <input placeholder="Enter full name" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={newShipment.customerName} onChange={e => setNewShipment({...newShipment, customerName: e.target.value})} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">From City</label>
                  <input ref={fromRef} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={newShipment.from} onChange={e => setNewShipment({...newShipment, from: e.target.value})} required />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">To City</label>
                  <input ref={toRef} className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={newShipment.to} onChange={e => setNewShipment({...newShipment, to: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Service Type</label>
                  <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" value={newShipment.service} onChange={e => setNewShipment({...newShipment, service: e.target.value})}>
                    <option>Household Shifting</option>
                    <option>Commercial Shifting</option>
                    <option>Car Transportation</option>
                    <option>Bike Transportation</option>
                    <option>Office Relocation</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Current Location</label>
                  <input className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={newShipment.currentLocation} onChange={e => setNewShipment({...newShipment, currentLocation: e.target.value})} />
                </div>
              </div>

              {(newShipment.service === 'Car Transportation' || newShipment.service === 'Bike Transportation') && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-2 gap-4 animate-fade-in-up">
                  <div className="col-span-2 text-xs font-bold text-primary uppercase flex items-center gap-2">
                    {newShipment.service.includes('Car') ? <FaCar /> : <FaMotorcycle />} Vehicle Details
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">Vehicle Model</label>
                    <input placeholder="e.g. Swift Dzire" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" value={newShipment.vehicleModel} onChange={e => setNewShipment({...newShipment, vehicleModel: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase">RC Number</label>
                    <input placeholder="e.g. KA01AB1234" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white font-mono" value={newShipment.rcNumber} onChange={e => setNewShipment({...newShipment, rcNumber: e.target.value})} />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setShowCreateModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-primary hover:bg-red-700 text-white py-3 rounded-xl font-bold transition-colors shadow-lg">Create Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- UPDATE MODAL --- */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100]">
          <div className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="font-black text-xl mb-2 text-gray-800">Update Status</h3>
            <p className="text-sm text-gray-500 mb-6">Shipment: <span className="font-bold text-dark">{selectedShipment?.trackingId}</span></p>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">New Status</label>
                <select className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white" value={updateStatus.status} onChange={e => setUpdateStatus({...updateStatus, status: e.target.value})}>
                  <option>Booked</option>
                  <option>Packed</option>
                  <option>Loaded</option>
                  <option>In Transit</option>
                  <option>Reached Hub</option>
                  <option>Out for Delivery</option>
                  <option>Delivered</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Current Location</label>
                <input placeholder="e.g. Crossing Toll Plaza" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={updateStatus.location} onChange={e => setUpdateStatus({...updateStatus, location: e.target.value})} required />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Update Est. Delivery</label>
                <input type="date" className="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-primary outline-none" value={updateStatus.estimatedDelivery} onChange={e => setUpdateStatus({...updateStatus, estimatedDelivery: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={()=>setShowUpdateModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-bold transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-secondary hover:bg-yellow-500 text-dark py-3 rounded-xl font-bold transition-colors shadow-lg">Update</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}