import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { FaUsers, FaClipboardList, FaTruck, FaClock, FaArrowRight, FaChartLine } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, today: 0, pending: 0, shipments: 0 });
  const [recentLeads, setRecentLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listener for LEADS (Quotes)
    const qQuotes = query(collection(db, 'quotes'));
    const unsubQuotes = onSnapshot(qQuotes, (snapshot) => {
      const allDocs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);

      setStats(prev => ({
        ...prev,
        total: allDocs.length,
        today: allDocs.filter(d => d.createdAt?.toDate() >= todayStart).length,
        pending: allDocs.filter(d => d.status === 'new').length,
      }));
      
      // Sort for "Mini Activity List" - Newest 5
      const sorted = [...allDocs].sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setRecentLeads(sorted.slice(0, 5));
    });

    // 2. Listener for SHIPMENTS (Consignments)
    const qConsignments = query(collection(db, 'consignments'));
    const unsubConsignments = onSnapshot(qConsignments, (snapshot) => {
      setStats(prev => ({
        ...prev,
        shipments: snapshot.size
      }));
      setLoading(false);
    });

    return () => {
      unsubQuotes();
      unsubConsignments();
    };
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const StatCard = ({ title, count, icon: Icon, gradient, subtext }) => (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group"
    >
      {/* Decorative Background Blob */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-125 duration-500`} />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-gray-800">{count}</h3>
          {subtext && <p className="text-xs text-gray-400 mt-2 font-medium flex items-center gap-1">
             <FaChartLine /> {subtext}
          </p>}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
          <Icon className="text-xl" />
        </div>
      </div>
      
      {/* Bottom Progress Bar Decoration */}
      <div className="mt-4 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${gradient} opacity-50`} 
        />
      </div>
    </motion.div>
  );

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-sm text-gray-500">Welcome back, Admin</p>
        </div>
        <span className="text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 flex items-center gap-2 animate-pulse">
           <span className="w-2 h-2 rounded-full bg-green-500"></span> Live Updates
        </span>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="New (Today)" 
          count={stats.today} 
          icon={FaClock} 
          gradient="from-emerald-400 to-teal-500"
          subtext="Leads received today"
        />
        <StatCard 
          title="Total Leads" 
          count={stats.total} 
          icon={FaUsers} 
          gradient="from-blue-500 to-indigo-600"
          subtext="Lifetime enquiries"
        />
        <StatCard 
          title="Pending Leads" 
          count={stats.pending} 
          icon={FaClipboardList} 
          gradient="from-orange-400 to-red-500"
          subtext="Requires action"
        />
        <StatCard 
          title="Active Shipments" 
          count={stats.shipments} 
          icon={FaTruck} 
          gradient="from-violet-500 to-purple-600"
          subtext="Currently in transit"
        />
      </div>

      {/* Mini Activity List */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-lg">Recent Lead Activity</h3>
          <Link to="/admin/leads" className="text-primary text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
            View All Leads <FaArrowRight />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-50">
          {recentLeads.length === 0 ? (
            <div className="p-8 text-center text-gray-400 flex flex-col items-center">
               <FaClipboardList className="text-4xl mb-2 opacity-20" />
               <p>No activity yet.</p>
            </div>
          ) : (
            recentLeads.map((lead, index) => (
              <motion.div 
                key={lead.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 hover:bg-blue-50/50 transition-colors group cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md
                    ${index % 3 === 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600' : 
                      index % 3 === 1 ? 'bg-gradient-to-br from-purple-400 to-purple-600' : 
                      'bg-gradient-to-br from-pink-400 to-red-500'}`}
                  >
                    {lead.name ? lead.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 group-hover:text-primary transition-colors">
                      {lead.name || 'Unknown User'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-medium">{lead.service}</span>
                      <span>•</span>
                      <span>{lead.from} ➝ {lead.to}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className="block text-xs font-bold text-gray-500">
                    {lead.createdAt?.toDate().toLocaleDateString()}
                  </span>
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                    {lead.createdAt?.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}