import { FaBoxOpen, FaTruck, FaFileInvoice, FaClock } from 'react-icons/fa';

export default function CustomerDashboard() {
  return (
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-black mb-2">Hello, Valued Customer!</h1>
          <p className="text-blue-100 max-w-xl">Track your active shipments, download invoices, and manage your profile from here.</p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 text-9xl transform translate-x-10 translate-y-10 rotate-[-20deg]">
          <FaTruck />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Loads", val: "1", icon: FaTruck, color: "bg-blue-100 text-blue-600" },
          { label: "Delivered", val: "4", icon: FaBoxOpen, color: "bg-green-100 text-green-600" },
          { label: "Invoices", val: "5", icon: FaFileInvoice, color: "bg-purple-100 text-purple-600" },
          { label: "Pending", val: "0", icon: FaClock, color: "bg-orange-100 text-orange-600" }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-all">
             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-3 ${stat.color}`}>
               <stat.icon />
             </div>
             <h4 className="text-2xl font-black text-gray-800">{stat.val}</h4>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Active Shipment Card */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Current Shipment</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center">
           <div className="flex-1 w-full">
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">Tracking ID: VRL-1024</span>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">IN TRANSIT</span>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Bangalore</span>
                <span>-------- 🚚 --------</span>
                <span>Mumbai</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">Last update: Arrived at Hub, Pune (2 hrs ago)</p>
           </div>
           <button className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors w-full md:w-auto">
             View Details
           </button>
        </div>
      </div>
      
    </div>
  );
}