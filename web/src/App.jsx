import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// --- PUBLIC IMPORTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import PublicTracking from './pages/Tracking'; 
import Login from './admin/Login'; // Corrected import path
import Payment from './pages/Payment';

// --- ADMIN IMPORTS ---
import AdminLayout from './admin/Layout';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminDashboard from './admin/Dashboard';
import AdminLeads from './admin/Leads';
import AdminTracking from './admin/Tracking'; 

// --- UTILITY COMPONENTS ---

const UnderConstruction = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500">This module is currently under development.</p>
  </div>
);

// Layout for Public Pages (Adds Navbar & Footer)
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Navbar />
    <main className="flex-grow pt-16">
      <Outlet />
    </main>
    <Chatbot />
    <Footer />
  </div>
);

function App() {
  return (
    <div className="font-sans text-dark">
      <Routes>
        
        {/* 1. ADMIN ROUTES (Protected, No Website Navbar) */}
        <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="tracking" element={<AdminTracking />} />
          
          {/* Placeholders for future modules */}
          <Route path="invoice" element={<UnderConstruction title="Invoice Manager" />} />
          <Route path="gst-invoice" element={<UnderConstruction title="GST Invoice" />} />
          <Route path="quotation" element={<UnderConstruction title="Quotation Builder" />} />
          <Route path="collection" element={<UnderConstruction title="Collection Advice" />} />
          <Route path="contract" element={<UnderConstruction title="Special Contract" />} />
          <Route path="car-inventory" element={<UnderConstruction title="Car Inventory" />} />
          <Route path="money-receipt" element={<UnderConstruction title="Money Receipt" />} />
        </Route>

        {/* 2. LOGIN ROUTE (Standalone, No Website Navbar) */}
        <Route path="/login" element={<Login />} />

        {/* 3. PUBLIC ROUTES (Wrapped in PublicLayout) */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<PublicTracking />} />
          <Route path="/payment" element={<Payment />} />
          {/* Fallback for unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;