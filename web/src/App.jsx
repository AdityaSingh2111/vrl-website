import { useEffect } from 'react';
import { Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';

// --- PUBLIC IMPORTS ---
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import PublicTracking from './pages/Tracking'; 
import Login from './admin/Login'; 
import Payment from './pages/Payment';

// Content Pages
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail'; 
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Branches from './pages/Branches';
import Careers from './pages/Careers';
import About from './pages/about/About';
import History from './pages/about/History';
import Mission from './pages/about/Mission';
import Webmail from './pages/Webmail'; // Added Webmail

// Legal & Utility Pages
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Sitemap from './pages/Sitemap';

// --- ADMIN IMPORTS ---
import AdminLayout from './admin/Layout';
import ProtectedRoute from './admin/ProtectedRoute';
import AdminDashboard from './admin/Dashboard';
import AdminLeads from './admin/Leads';
import AdminTracking from './admin/Tracking'; 

// --- CUSTOMER IMPORTS ---
import CustomerLogin from './pages/CustomerLogin';
import CustomerLayout from './customer/Layout';
import CustomerDashboard from './customer/Dashboard';

// --- UTILITY COMPONENTS ---
const UnderConstruction = ({ title }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center">
    <div className="text-6xl mb-4">🚧</div>
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <p className="text-gray-500">This module is currently under development.</p>
  </div>
);

// Layout for Public Pages
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
  const { pathname } = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="font-sans text-dark">
      <Routes>
        
        {/* 1. ADMIN ROUTES */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="tracking" element={<AdminTracking />} />
          <Route path="*" element={<UnderConstruction title="Module Coming Soon" />} />
        </Route>

        {/* 2. LOGIN ROUTE */}
        <Route path="/login" element={<Login />} />

        {/* 3. PUBLIC ROUTES */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/track" element={<PublicTracking />} />
          <Route path="/payment" element={<Payment />} />

        {/* 4. CUSTOMER ROUTES */}
        <Route path="/customer-login" element={<CustomerLogin />} />
        
        <Route path="/customer" element={<CustomerLayout />}>
           <Route index element={<Navigate to="dashboard" replace />} />
           <Route path="dashboard" element={<CustomerDashboard />} />
           {/* Placeholders for other customer pages */}
           <Route path="*" element={<UnderConstruction title="Customer Module" />} />
        </Route>  
          
          {/* Main Content Routes */}
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetail />} /> 
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/webmail" element={<Webmail />} />

          {/* About Sub-Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/about/history" element={<History />} />
          <Route path="/about/mission" element={<Mission />} />

          {/* Legal & Utility Routes */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-conditions" element={<TermsConditions />} />
          <Route path="/sitemap" element={<Sitemap />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>

      </Routes>
    </div>
  );
}

export default App;