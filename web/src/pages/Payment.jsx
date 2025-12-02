import { useState, useRef, useEffect, useMemo } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { 
  FaLock, FaCreditCard, FaRupeeSign, FaCheckCircle, FaUser, 
  FaPhoneAlt, FaEnvelope, FaArrowRight, FaFileInvoiceDollar, 
  FaDownload, FaHome, FaSearch, FaChevronDown 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- COUNTRY DATA (Mini List for Demo - Expand as needed) ---
const COUNTRIES = [
  { name: "India", code: "IN", dial: "+91", length: 10, regex: /^[6-9]\d{9}$/ },
  { name: "United States", code: "US", dial: "+1", length: 10, regex: /^\d{10}$/ },
  { name: "United Kingdom", code: "GB", dial: "+44", length: 10, regex: /^\d{10}$/ },
  { name: "Canada", code: "CA", dial: "+1", length: 10, regex: /^\d{10}$/ },
  { name: "Australia", code: "AU", dial: "+61", length: 9, regex: /^\d{9}$/ },
  { name: "United Arab Emirates", code: "AE", dial: "+971", length: 9, regex: /^\d{9}$/ },
];

export default function Payment() {
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [invoiceLoading, setInvoiceLoading] = useState(false);
  
  // Country & Search State
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const receiptRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    amount: '',
    purpose: 'Slot Booking payment'
  });

  const [errors, setErrors] = useState({});

  // --- FILTERED COUNTRIES ---
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.dial.includes(searchQuery)
    );
  }, [searchQuery]);

  // --- VALIDATION ---
  const validatePhone = (phone, country) => {
    if (!phone) return "Phone number is required";
    if (country.regex && !country.regex.test(phone)) {
      return `Invalid ${country.name} number (expecting ${country.length} digits)`;
    }
    return "";
  };

  // --- 1. RAZORPAY LOADER ---
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.querySelector(`script[src="https://checkout.razorpay.com/v1/checkout.js"]`)) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // --- 2. INVOICE GENERATOR ---
  const downloadInvoice = async () => {
    if (!receiptRef.current) return;
    setInvoiceLoading(true);
    try {
      // Temporarily reveal the invoice container for capture if hidden
      receiptRef.current.style.display = 'block'; 
      
      const canvas = await html2canvas(receiptRef.current, { 
        scale: 3, // High resolution
        useCORS: true,
        logging: false
      });
      
      // Hide it again if needed (or keep it visible based on your UI flow)
      // receiptRef.current.style.display = 'none'; // Optional: keep visible if it's part of UI

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`VRL_Invoice_${successData.paymentId}.pdf`);
    } catch (err) {
      console.error("Invoice Error:", err);
      alert("Could not generate invoice. Please try again.");
    } finally {
      setInvoiceLoading(false);
    }
  };

  // --- 3. PAYMENT HANDLER ---
  const handlePayment = async (e) => {
    e.preventDefault();
    
    // Validate Phone
    const phoneError = validatePhone(formData.phone, selectedCountry);
    if (phoneError) {
      setErrors({ ...errors, phone: phoneError });
      return;
    }
    setErrors({ ...errors, phone: '' });

    const payAmount = parseFloat(formData.amount);
    if (!payAmount || payAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    setLoading(true);

    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) throw new Error("SDK failed to load");

      // Create Order
      const createOrderFn = httpsCallable(functions, 'createRazorpayOrder');
      const response = await createOrderFn({ amount: Number(payAmount) });
      const { id: order_id, currency, amount, key_id } = response.data;

      const options = {
        key: key_id,
        amount: amount,
        currency: currency,
        name: "VRL Logistics",
        description: formData.purpose,
        order_id: order_id,
        handler: async function (response) {
          try {
            // Set Success Data immediately for UI feedback
             setSuccessData({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: payAmount,
              date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              fullPhone: `${selectedCountry.dial} ${formData.phone}`,
              ...formData
            });
            setLoading(false);
            
            // Optional: Verify on backend if needed
            // const verifyFn = httpsCallable(functions, 'verifyRazorpayPayment');
            // await verifyFn({ ... });

          } catch (err) {
            console.error(err);
            alert("Payment verified but system update failed. Keep your Message/Email as proof.");
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: "#E31E24" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => {
        alert("Payment Failed: " + resp.error.description);
        setLoading(false);
      });
      rzp.open();

    } catch (error) {
      console.error(error);
      alert("Payment Error: " + (error.message || "Unknown"));
      setLoading(false);
    }
  };

  // --- 4. SUCCESS UI & INVOICE TEMPLATE ---
  if (successData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-gray-100"
        >
          {/* Success Banner - Matches lppo.png style */}
          <div className="bg-cyan-50/50 pt-12 pb-8 px-6 text-center relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="w-16 h-16 bg-[#008a7c] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-teal-100 ring-4 ring-white"
            >
              <FaCheckCircle className="text-3xl text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Payment Successful!</h2>
            <p className="text-xs text-gray-500 font-mono">Transaction ID - {successData.paymentId}</p>
            <p className="text-xs text-gray-400 mt-1">{successData.date}, {successData.time}</p>
            
            {/* Bank Branding Strip */}
            <div className="mt-6 flex justify-center items-center gap-4 opacity-60 grayscale">
               {/* Placeholder for bank logos if you have them, or text */}
               <span className="text-[10px] font-bold tracking-widest text-gray-400">SECURED BY RAZORPAY</span>
            </div>
          </div>

          {/* Receipt Details Card */}
          <div className="px-6 pb-8 space-y-6 bg-white">
            
            {/* Sent To Block */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                VM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">SENT TO</p>
                <h3 className="font-bold text-gray-800 text-sm truncate">Vrl Logistics Packers And Movers</h3>
                <p className="text-xs text-gray-500 truncate">vrl-merchant@upi</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">AMOUNT</p>
                 <p className="text-xl font-black text-gray-900">₹{successData.amount}.00</p>
              </div>
            </div>

            {/* Detailed Grid */}
            <div className="space-y-3 text-sm">
               <div className="flex justify-between py-2 border-b border-gray-50">
                 <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Mode</span>
                 <span className="font-medium text-gray-900">Online / UPI</span>
               </div>
               <div className="flex justify-between py-2 border-b border-gray-50">
                 <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Sent From</span>
                 <span className="font-medium text-gray-900">{successData.name}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-gray-50">
                 <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Mobile</span>
                 <span className="font-medium text-gray-900">{successData.fullPhone}</span>
               </div>
               <div className="flex justify-between py-2">
                 <span className="text-gray-500 uppercase text-[10px] font-bold tracking-wider">Remark</span>
                 <span className="font-medium text-gray-900">{successData.purpose}</span>
               </div>
            </div>

            {/* Timeline Steps */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
               <div className="flex justify-between items-center mb-1">
                 <span className="font-bold text-gray-800 text-sm">View more details</span>
               </div>
               
               <div className="relative pl-2 pt-4 space-y-6 before:absolute before:left-[11px] before:top-5 before:bottom-2 before:w-0.5 before:bg-gray-200">
                  {[
                    { title: "Payment Initiated", desc: "Request sent securely" },
                    { title: "Money debited from bank", desc: "Authorized by gateway" },
                    { title: "Money sent to merchant", desc: "VRL Logistics Account" },
                    { title: "Payment Complete", desc: "Receipt Generated" }
                  ].map((step, i) => (
                    <div key={i} className="relative flex items-start gap-4 z-10">
                      <div className="w-6 h-6 rounded-full bg-[#22c55e] flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                        <FaCheckCircle className="text-white text-[10px]" />
                      </div>
                      <div className="flex-1 flex justify-between items-start -mt-1">
                        <div>
                          <p className="text-xs font-bold text-gray-800">{step.title}</p>
                          {/* <p className="text-[10px] text-gray-400">{step.desc}</p> */}
                        </div>
                        <span className="text-[9px] font-bold text-white bg-[#22c55e] px-1.5 py-0.5 rounded">SUCCESS</span>
                      </div>
                    </div>
                  ))}
               </div>
               
               <div className="mt-6 bg-[#ecfdf5] border border-[#d1fae5] p-3 rounded-lg flex gap-3 items-start">
                  <FaCheckCircle className="text-[#059669] text-lg mt-0.5 shrink-0" />
                  <p className="text-xs text-[#065f46] font-medium leading-relaxed">
                    Payment status is success. In case of any issue, you may contact your bank or our support team at <span className="font-bold underline">admin@vrllogistic.com</span>.
                  </p>
               </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={downloadInvoice} 
                disabled={invoiceLoading}
                className="flex-1 bg-black text-white py-3.5 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-900 transition-all active:scale-95 text-sm"
              >
                {invoiceLoading ? <div className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"/> : <FaDownload />}
                Download Receipt
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95 flex items-center justify-center gap-2 text-sm"
              >
                <FaHome /> Home
              </button>
            </div>

          </div>
        </motion.div>

        {/* --- HIDDEN INVOICE TEMPLATE (Matches lppo.png Layout for PDF) --- */}
        <div className="absolute left-[-9999px]">
          <div ref={receiptRef} className="w-[500px] bg-white p-8 font-sans border text-gray-800">
             
             {/* Header */}
             <div className="text-center mb-8">
                <div className="w-16 h-16 bg-[#008a7c] rounded-full flex items-center justify-center mx-auto mb-4 text-white text-3xl">
                   ✓
                </div>
                <h1 className="text-2xl font-bold mb-1">Payment Successful!</h1>
                <p className="text-sm text-gray-500">Transaction ID - {successData.paymentId}</p>
                <p className="text-sm text-gray-500">{successData.date}, {successData.time}</p>
             </div>

             {/* Sent To Box */}
             <div className="border rounded-xl p-4 mb-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">VM</div>
                <div className="flex-1">
                   <p className="text-xs text-gray-400 uppercase font-bold">Sent To</p>
                   <p className="font-bold">Vrl Logistics Packers And Movers</p>
                   <p className="text-sm text-gray-500">vrl-merchant@upi</p>
                </div>
                <div className="text-right">
                   <p className="text-xs text-gray-400 uppercase font-bold">Amount</p>
                   <p className="text-xl font-bold">₹{successData.amount}.00</p>
                </div>
             </div>

             {/* Details Table */}
             <div className="space-y-3 text-sm mb-8">
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Mode</span>
                    <span className="font-bold">Online / UPI</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Sent From</span>
                    <span className="font-bold">{successData.name}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Mobile</span>
                    <span className="font-bold">{successData.fullPhone}</span>
                 </div>
                 <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-500">Remark</span>
                    <span className="font-bold">{successData.purpose}</span>
                 </div>
             </div>

             {/* Steps Visual */}
             <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                 {['Payment Initiated', 'Money debited from bank', 'Money sent to recipient\'s bank', 'Payment Complete'].map((step, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
                          <span className="text-sm font-medium">{step}</span>
                       </div>
                       <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded">SUCCESS</span>
                    </div>
                 ))}
             </div>

             <div className="mt-6 text-center text-xs text-gray-400">
                Generated by VRL Logistics Secure Payment Gateway
             </div>
          </div>
        </div>
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
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Phone <span className="text-red-500">*</span></label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="relative col-span-1">
                       <button
                         type="button"
                         onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                         className="w-full h-full flex items-center justify-between px-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-primary outline-none text-sm"
                       >
                         <span className="font-bold text-gray-700">{selectedCountry.dial}</span>
                         <FaChevronDown className="text-[10px] text-gray-400" />
                       </button>
                       {/* Dropdown logic kept concise for display */}
                       <AnimatePresence>
                          {isCountryDropdownOpen && (
                            <motion.div 
                              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-xl border border-gray-100 z-50 mt-2 p-2 max-h-60 overflow-hidden flex flex-col"
                            >
                              <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white">
                                <FaSearch className="text-gray-400 text-xs" />
                                <input autoFocus placeholder="Search..." className="w-full outline-none text-xs font-medium" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                              </div>
                              <div className="overflow-y-auto flex-1">
                                {filteredCountries.map(c => (
                                  <div key={c.code} onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); setSearchQuery(""); }} className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-between text-xs">
                                    <span className="font-medium text-gray-700">{c.name}</span>
                                    <span className="text-gray-400 font-mono">{c.dial}</span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                       </AnimatePresence>
                    </div>
                    <div className="col-span-2 relative">
                       <input 
                         type="tel" 
                         required 
                         className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all font-medium text-dark placeholder-gray-400 ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary'}`}
                         placeholder="Mobile Number"
                         value={formData.phone}
                         onChange={e => {
                           setFormData({...formData, phone: e.target.value});
                           if(errors.phone) setErrors({...errors, phone: ''});
                         }}
                       />
                    </div>
                  </div>
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone}</p>}
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