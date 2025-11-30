import { useState } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { FaLock, FaCreditCard, FaRupeeSign, FaCheckCircle, FaUser, FaPhoneAlt, FaEnvelope, FaArrowRight, FaFileInvoiceDollar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    purpose: 'Slot Booking payment'
  });

  // Load Razorpay Script Dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Load Script
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) {
      alert("Failed to load payment gateway. Please check internet connection.");
      setLoading(false);
      return;
    }

    try {
      // 2. Create Order on Backend
      const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
      const response = await createOrderFn({ amount: formData.amount });
      const { id: order_id, currency, amount } = response.data;

      // 3. Open Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Frontend Public Key
        amount: amount,
        currency: currency,
        name: "VRL Logistic Packers & Movers",
        description: formData.purpose,
        order_id: order_id,
        handler: function (response) {
          // Success Callback
          console.log("Payment ID: ", response.razorpay_payment_id);
          setSuccess(true);
          setLoading(false);
          // Optional: You can save this transaction to Firestore here
        },
        prefill: {
          name: formData.name,
          email: formData.email, // Optional, can be empty
          contact: formData.phone,
        },
        theme: {
          color: "#E31E24", // VRL Red
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
      // Handle payment window close without payment
      paymentObject.on('payment.failed', function (response){
        alert("Payment Failed: " + response.error.description);
        setLoading(false);
      });

    } catch (error) {
      console.error(error);
      alert("Payment initiation failed. Try again.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-20">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border-t-8 border-green-500"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-6xl text-green-500" />
          </div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-500 mb-6">Thank you for your payment. A confirmation has been sent to your contact details.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-dark text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-dark mb-3">
            Secure <span className="text-primary">Payment</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">Complete your booking with our trusted payment gateway.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Left: Info Section (Mobile Order 1, Desktop Left) */}
          <div className="bg-[#111827] text-white p-8 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-white/10 p-3 rounded-xl">
                  <FaFileInvoiceDollar className="text-2xl text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold leading-tight">Payment Details</h3>
                  <p className="text-xs text-gray-400">VRL Logistic Official</p>
                </div>
              </div>
              
              <div className="h-px bg-white/10 mb-6"></div>

              <ul className="space-y-5 text-sm text-gray-300">
                <li className="flex items-start gap-3">
                  <FaLock className="text-primary mt-1 shrink-0" />
                  <span>256-bit SSL Encrypted Payment</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCheckCircle className="text-primary mt-1 shrink-0" />
                  <span>Instant Receipt Generation</span>
                </li>
                <li className="flex items-start gap-3">
                  <FaCreditCard className="text-primary mt-1 shrink-0" />
                  <span>Cards, UPI, NetBanking & Wallets</span>
                </li>
              </ul>
            </div>
            
            {/* Decor Circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>
          </div>

          {/* Right: Payment Form */}
          <div className="p-6 md:p-10 md:w-3/5 bg-white">
            <form onSubmit={handlePayment} className="space-y-5">
              
              {/* Name & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Full Name <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="text" 
                      required 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-dark placeholder-gray-400"
                      placeholder="Enter Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone <span className="text-red-500">*</span></label>
                  <div className="relative group">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input 
                      type="tel" 
                      required 
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-dark placeholder-gray-400"
                      placeholder="Mobile No."
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Email (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address <span className="text-gray-300 font-normal lowercase">(optional)</span></label>
                <div className="relative group">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-dark placeholder-gray-400"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              {/* Payment Purpose */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Payment Type <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none font-medium text-dark cursor-pointer"
                    value={formData.purpose}
                    onChange={e => setFormData({...formData, purpose: e.target.value})}
                  >
                    <option>Slot Booking payment</option>
                    <option>Advance shipment payment</option>
                    <option>Payment against invoice bill</option>
                    <option>Others</option>
                  </select>
                  {/* Custom Arrow */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Amount Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Amount <span className="text-red-500">*</span></label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-800 text-lg pointer-events-none">
                    <FaRupeeSign />
                  </div>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    className="w-full pl-10 pr-4 py-4 border-2 border-primary/20 bg-white rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-2xl font-black text-dark placeholder-gray-300 transition-all shadow-sm"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg mt-4"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Pay Now <FaArrowRight /></>
                )}
              </button>

              <div className="text-center pt-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
                  <FaLock size={10} /> Secured by Razorpay
                </p>
              </div>

            </form>
          </div>
        </div>
        
        {/* Trust Badges - Placeholder for visual trust */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
           {/* You can add actual <img> tags here for Visa/Mastercard if you have assets */}
           <div className="h-6 w-12 bg-gray-300 rounded"></div>
           <div className="h-6 w-12 bg-gray-300 rounded"></div>
           <div className="h-6 w-12 bg-gray-300 rounded"></div>
           <div className="h-6 w-12 bg-gray-300 rounded"></div>
        </div>

      </div>
    </div>
  );
}