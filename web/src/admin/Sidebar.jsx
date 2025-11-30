import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaClipboardList, FaTruck, FaFileInvoice, FaFileInvoiceDollar, 
  FaFileContract, FaCar, FaMoneyBillWave, FaTimes, FaTruckMoving, FaQuoteRight 
} from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FaTachometerAlt },
    { name: 'Leads', path: '/admin/leads', icon: FaClipboardList },
    { name: 'Shipments (Tracking)', path: '/admin/tracking', icon: FaTruck },
    { name: 'Invoice', path: '/admin/invoice', icon: FaFileInvoice },
    { name: 'GST Invoice', path: '/admin/gst-invoice', icon: FaFileInvoiceDollar },
    { name: 'Quotation', path: '/admin/quotation', icon: FaQuoteRight },
    { name: 'Collection Advice', path: '/admin/collection', icon: FaFileContract },
    { name: 'Special Contract', path: '/admin/contract', icon: FaFileContract },
    { name: 'Car Inventory', path: '/admin/car-inventory', icon: FaCar },
    { name: 'Money Receipt', path: '/admin/money-receipt', icon: FaMoneyBillWave },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-[#111827] text-gray-300 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        flex flex-col border-r border-gray-800
      `}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 bg-[#0B0F19] border-b border-gray-800">
          <div className="flex items-center gap-2 text-white font-bold tracking-wider">
            <FaTruckMoving className="text-primary text-xl" />
            <span>VRL ADMIN</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 hover:text-white">
            <FaTimes />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => window.innerWidth < 768 && onClose()}
                className={`
                  flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary border-r-4 border-primary' 
                    : 'hover:bg-gray-800 hover:text-white border-r-4 border-transparent'}
                `}
              >
                <item.icon className={isActive ? 'text-primary' : 'text-gray-500'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800 text-xs text-gray-600 text-center">
          VRL Logistics v2.0
        </div>
      </aside>
    </>
  );
}