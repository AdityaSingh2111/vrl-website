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
            // Verify
            const verifyFn = httpsCallable(functions, 'verifyRazorpayPayment');
            await verifyFn({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              amount: payAmount
            });

            // Set Success Data
            setSuccessData({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: payAmount,
              date: new Date().toLocaleDateString(),
              time: new Date().toLocaleTimeString(),
              fullPhone: `${selectedCountry.dial} ${formData.phone}`,
              ...formData
            });

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
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden mb-8"
        >
          {/* Success Banner */}
          <div className="bg-green-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 blur-3xl scale-150 rounded-full pointer-events-none"></div>
            <FaCheckCircle className="text-6xl mx-auto mb-4 relative z-10 shadow-xl rounded-full bg-white text-green-600" />
            <h2 className="text-3xl font-black relative z-10">Payment Successful!</h2>
            <p className="opacity-90 relative z-10 text-sm mt-1">Transaction ID: {successData.paymentId}</p>
          </div>

          <div className="p-8 space-y-6">
            <p className="text-center text-gray-500">
              Thank you, <span className="font-bold text-gray-800">{successData.name}</span>. 
              Your payment has been received successfully.
            </p>
            
            <div className="flex gap-4">
              <button 
                onClick={downloadInvoice} 
                disabled={invoiceLoading}
                className="flex-1 bg-dark text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition-all active:scale-95"
              >
                {invoiceLoading ? <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"/> : <FaDownload />}
                Download Invoice
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <FaHome /> Home
              </button>
            </div>
          </div>
        </motion.div>

        {/* --- HIDDEN INVOICE TEMPLATE (FOR PDF GENERATION) --- */}
        <div className="absolute left-[-9999px]">
          <div ref={receiptRef} className="w-[794px] min-h-[1123px] bg-white p-12 text-gray-800 font-sans border relative">
            
            {/* Header */}
            <div className="flex justify-between items-start mb-12">
              <div>
                <h1 className="text-4xl font-black text-primary mb-2">VRL LOGISTICS</h1>
                <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Packers & Movers</p>
                <div className="mt-4 text-sm text-gray-600 space-y-1">
                  <p>Regd. Office: 123, Logistics Park</p>
                  <p>Bangalore, Karnataka - 560001</p>
                  <p>Email: admin@vrllogistic.com</p>
                  <p>Phone: +91 73387 95585</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-3xl font-light text-gray-300 uppercase mb-4">Tax Invoice</h2>
                <p className="text-sm font-bold">Invoice #: <span className="text-dark">INV-{successData.paymentId.slice(-6)}</span></p>
                <p className="text-sm text-gray-500">Date: {successData.date}</p>
                <div className="mt-4 p-4 bg-gray-50 rounded-lg text-right w-64 ml-auto">
                  <p className="text-xs text-gray-400 uppercase font-bold">Amount Paid</p>
                  <p className="text-2xl font-black text-green-600">₹{successData.amount}.00</p>
                </div>
              </div>
            </div>

            {/* Bill To */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-400 uppercase border-b pb-2 mb-4">Billed To</h3>
              <p className="font-bold text-xl">{successData.name}</p>
              <p className="text-gray-600">{successData.fullPhone}</p>
              <p className="text-gray-600">{successData.email}</p>
            </div>

            {/* Line Items */}
            <table className="w-full mb-12">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase">Description</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Qty</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Price</th>
                  <th className="py-3 px-4 text-xs font-bold text-gray-500 uppercase text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 font-medium">{successData.purpose}</td>
                  <td className="py-4 px-4 text-right">1</td>
                  <td className="py-4 px-4 text-right">₹{successData.amount}</td>
                  <td className="py-4 px-4 text-right font-bold">₹{successData.amount}</td>
                </tr>
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-16">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">₹{successData.amount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax (0%)</span>
                  <span className="font-medium">₹0.00</span>
                </div>
                <div className="flex justify-between text-lg font-black border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{successData.amount}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
              <p>This is a computer-generated invoice and does not require a physical signature.</p>
              <p className="mt-1">Thank you for choosing VRL Logistics.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- 5. PAYMENT FORM UI ---
  return (
    <div className="min-h-screen bg-gray-50 pt-24 px-4 pb-12 font-sans flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        
        {/* Left: Branding */}
        <div className="hidden lg:block space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }}
            className="bg-dark text-white p-10 rounded-[2.5rem] relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/10">
                <FaRupeeSign className="text-3xl text-primary" />
              </div>
              <h1 className="text-5xl font-black mb-4 leading-tight">
                Quick & <br/><span className="text-primary">Secure</span> Pay.
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Complete your booking payment instantly. 
                <br/>100% Secure & Encrypted.
              </p>
              
              <div className="flex gap-4">
                {['UPI', 'Cards', 'NetBanking'].map((m) => (
                  <span key={m} className="px-4 py-2 rounded-full bg-white/10 border border-white/5 text-sm font-bold text-gray-300">
                    {m}
                  </span>
                ))}
              </div>
            </div>
            {/* Decor */}
            <div className="absolute top-[-20%] right-[-20%] w-80 h-80 bg-primary/30 rounded-full blur-[100px]"></div>
          </motion.div>
        </div>

        {/* Right: Payment Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-100 relative"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Payment Details</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">VRL Official Gateway</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
              <FaLock className="text-primary" />
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6">
            
            {/* Full Name */}
            <div className="relative group">
              <input 
                type="text" 
                required
                className="peer w-full pt-6 pb-2 px-4 border-b-2 border-gray-200 bg-gray-50/50 rounded-t-lg outline-none focus:border-primary transition-all placeholder-transparent text-gray-800 font-bold"
                placeholder="Full Name"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
              <label className="absolute left-4 top-4 text-xs font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:capitalize peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase">
                Full Name
              </label>
              <FaUser className="absolute right-4 top-4 text-gray-300 peer-focus:text-primary transition-colors" />
            </div>

            {/* Country & Phone Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country Selector */}
              <div className="relative col-span-1">
                <button
                  type="button"
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full h-full flex items-center justify-between px-3 bg-gray-50 border-b-2 border-gray-200 rounded-t-lg focus:border-primary outline-none"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-lg">{selectedCountry.code}</span>
                    <span className="font-bold text-gray-700 text-sm">{selectedCountry.dial}</span>
                  </div>
                  <FaChevronDown className="text-xs text-gray-400" />
                </button>

                <AnimatePresence>
                  {isCountryDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-xl border border-gray-100 z-50 mt-2 p-2 max-h-60 overflow-hidden flex flex-col"
                    >
                      <div className="p-2 border-b border-gray-100 flex items-center gap-2 sticky top-0 bg-white">
                        <FaSearch className="text-gray-400" />
                        <input 
                          autoFocus
                          placeholder="Search country..." 
                          className="w-full outline-none text-sm font-medium"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <div className="overflow-y-auto flex-1">
                        {filteredCountries.map(c => (
                          <div 
                            key={c.code}
                            onClick={() => {
                              setSelectedCountry(c);
                              setIsCountryDropdownOpen(false);
                              setSearchQuery("");
                            }}
                            className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer flex items-center justify-between text-sm"
                          >
                            <span className="font-medium text-gray-700">{c.name}</span>
                            <span className="text-gray-400 font-mono text-xs">{c.dial}</span>
                          </div>
                        ))}
                        {filteredCountries.length === 0 && <div className="p-3 text-xs text-gray-400 text-center">No countries found</div>}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Phone Input */}
              <div className="col-span-2 relative group">
                <input 
                  type="tel" 
                  required
                  className={`peer w-full pt-6 pb-2 px-4 border-b-2 bg-gray-50/50 rounded-t-lg outline-none transition-all placeholder-transparent text-gray-800 font-bold ${errors.phone ? 'border-red-500' : 'border-gray-200 focus:border-primary'}`}
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={e => {
                    setFormData({...formData, phone: e.target.value});
                    if(errors.phone) setErrors({...errors, phone: ''});
                  }}
                />
                <label className="absolute left-4 top-4 text-xs font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:capitalize peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase">
                  Mobile No.
                </label>
                <FaPhoneAlt className="absolute right-4 top-4 text-gray-300 peer-focus:text-primary transition-colors" />
                {errors.phone && <p className="absolute -bottom-5 left-0 text-[10px] text-red-500 font-bold">{errors.phone}</p>}
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="relative group">
              <input 
                type="email" 
                className="peer w-full pt-6 pb-2 px-4 border-b-2 border-gray-200 bg-gray-50/50 rounded-t-lg outline-none focus:border-primary transition-all placeholder-transparent text-gray-800 font-bold"
                placeholder="Email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
              <label className="absolute left-4 top-4 text-xs font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:capitalize peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-primary peer-focus:uppercase">
                Email (Opt)
              </label>
              <FaEnvelope className="absolute right-4 top-4 text-gray-300 peer-focus:text-primary transition-colors" />
            </div>

            {/* Purpose Select */}
            <div className="relative">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 ml-1">Payment For</p>
              <div className="grid grid-cols-2 gap-3">
                {['Slot Booking', 'Shipment', 'Invoice', 'Other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, purpose: type})}
                    className={`py-3 px-2 rounded-xl text-sm font-bold border transition-all ${
                      formData.purpose === type 
                      ? 'bg-dark text-white border-dark shadow-md transform scale-105' 
                      : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Input */}
            <div className="bg-gray-900 p-1 rounded-2xl shadow-lg">
              <div className="bg-white rounded-xl p-4 flex items-center gap-4 border-2 border-transparent focus-within:border-primary transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                  <FaRupeeSign className="text-xl text-gray-600" />
                </div>
                <div className="flex-grow">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">Amount to Pay</label>
                  <input 
                    type="number" 
                    required 
                    min="1"
                    className="w-full text-3xl font-black text-gray-800 outline-none placeholder-gray-200"
                    placeholder="0"
                    value={formData.amount}
                    onChange={e => setFormData({...formData, amount: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FaCreditCard /> Pay Securely <FaArrowRight />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 uppercase tracking-widest font-bold opacity-60">
              <FaLock /> 256-bit SSL Encrypted
            </div>

          </form>
        </motion.div>
      </div>
    </div>
  );
}