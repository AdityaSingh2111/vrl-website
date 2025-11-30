import { useState, useEffect, useRef } from 'react';
import { db, functions } from '../lib/firebase'; 
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { FaPaperPlane, FaArrowRight, FaArrowLeft, FaCheckCircle, FaUser, FaMapMarkerAlt, FaTruckLoading, FaChevronDown, FaCar, FaMotorcycle, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteForm({ theme = 'light' }) {
  // --- STATE ---
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errors, setErrors] = useState({});

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    isWhatsappSame: 'yes',
    whatsappNumber: '',
    from: '',
    to: '',
    service: '', 
    carModel: '',
    numCars: '',
    bikeModel: '',
    notes: ''
  });

  // Google Places Refs
  const fromRef = useRef(null);
  const toRef = useRef(null);

  // --- STYLES ---
  const isDark = theme === 'dark';
  
  const inputClass = `peer w-full p-4 border rounded-xl outline-none transition-all duration-300 placeholder-transparent
    ${isDark 
      ? 'bg-black/30 border-white/10 text-white focus:bg-black/50 focus:border-secondary focus:ring-1 focus:ring-secondary/50 shadow-inner' 
      : 'bg-white/70 border-gray-200 text-gray-800 focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/30 shadow-sm'
    }`;

  const labelClass = `absolute left-4 top-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 transform -translate-y-7 scale-90 origin-[0] pointer-events-none
    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-4 peer-focus:-translate-y-7 peer-focus:scale-90
    ${isDark ? 'text-gray-400 peer-focus:text-secondary' : 'text-gray-500 peer-focus:text-primary'}`;

  // --- LOGIC: PROGRESS CALCULATION (0% Start) ---
  useEffect(() => {
    let filledCount = 0;
    // Base required fields: Name, Phone, From, To, Service
    let totalRequired = 5; 

    if (formData.name.trim()) filledCount++;
    if (formData.phone.trim()) filledCount++;
    if (formData.from.trim()) filledCount++;
    if (formData.to.trim()) filledCount++;
    if (formData.service) filledCount++;

    // Conditional: WhatsApp
    if (formData.isWhatsappSame === 'no') {
      totalRequired++;
      if (formData.whatsappNumber.trim()) filledCount++;
    }

    // Conditional: Car/Bike
    if (formData.service === 'Car Transportation') {
      totalRequired += 2;
      if (formData.carModel.trim()) filledCount++;
      if (formData.numCars.trim()) filledCount++;
    } else if (formData.service === 'Bike Transportation') {
      totalRequired += 1;
      if (formData.bikeModel.trim()) filledCount++;
    }

    const newProgress = Math.round((filledCount / totalRequired) * 100);
    setProgress(isNaN(newProgress) ? 0 : newProgress);
  }, [formData]);

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleServiceChange = (e) => {
    const service = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      service,
      carModel: '',
      numCars: '',
      bikeModel: '' 
    }));
  };

  // Google Places Logic
  useEffect(() => {
    if (step !== 2) return;
    const initAutocomplete = () => {
       if (!window.google || !window.google.maps || !window.google.maps.places || !fromRef.current || !toRef.current) return false;
       
       const options = { types: ["(cities)"], componentRestrictions: { country: "in" } };
       
       const fromAC = new window.google.maps.places.Autocomplete(fromRef.current, options);
       fromAC.addListener("place_changed", () => setFormData(p => ({...p, from: fromAC.getPlace().formatted_address || fromAC.getPlace().name})));

       const toAC = new window.google.maps.places.Autocomplete(toRef.current, options);
       toAC.addListener("place_changed", () => setFormData(p => ({...p, to: toAC.getPlace().formatted_address || toAC.getPlace().name})));
       
       return true;
    };
    const interval = setInterval(() => { if(initAutocomplete()) clearInterval(interval); }, 500);
    return () => clearInterval(interval);
  }, [step]);

  // --- VALIDATION & SUBMIT ---
  const validateStep = (currentStep) => {
    let newErrors = {};
    
    if (currentStep === 1) {
      if (!formData.name.trim()) newErrors.name = "Full Name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (formData.isWhatsappSame === 'no' && !formData.whatsappNumber.trim()) newErrors.whatsappNumber = "WhatsApp number is required";
    }

    if (currentStep === 2) {
      if (!formData.from.trim()) newErrors.from = "Pickup city is required";
      if (!formData.to.trim()) newErrors.to = "Destination city is required";
    }

    if (currentStep === 3) {
      if (!formData.service) newErrors.service = "Please select a service";
      if (formData.service === 'Car Transportation') {
        if (!formData.carModel.trim()) newErrors.carModel = "Car Model is required";
        if (!formData.numCars.trim()) newErrors.numCars = "Number of cars required";
      }
      if (formData.service === 'Bike Transportation') {
        if (!formData.bikeModel.trim()) newErrors.bikeModel = "Bike Model is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => { if (validateStep(step)) setStep(p => p + 1); };
  const prevStep = () => setStep(p => p - 1);

  // --- DISTANCE CALCULATION HELPER ---
  const calculateDistance = async (origin, destination) => {
    if (!window.google || !window.google.maps) return null;
    
    const service = new window.google.maps.DistanceMatrixService();
    try {
      const response = await new Promise((resolve, reject) => {
        service.getDistanceMatrix(
          {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: window.google.maps.UnitSystem.METRIC,
          },
          (response, status) => {
            if (status === 'OK') resolve(response);
            else reject(status);
          }
        );
      });

      if (response.rows[0].elements[0].status === 'OK') {
        // Returns string like "1,234 km"
        return response.rows[0].elements[0].distance.text; 
      }
      return null;
    } catch (error) {
      console.error("Distance Matrix Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;
    setLoading(true);

    try {
      // 1. Calculate Distance
      let distanceValue = null;
      if (formData.from && formData.to) {
        distanceValue = await calculateDistance(formData.from, formData.to);
      }

      // 2. Prepare Data Packet
      const finalData = {
        ...formData,
        whatsappNumber: formData.isWhatsappSame === 'yes' ? formData.phone : formData.whatsappNumber,
        distance: distanceValue, // Store calculated distance
        createdAt: serverTimestamp(),
        source: 'hero_quote_form',
        status: 'new'
      };

      // 3. Save to Firestore
      const docRef = await addDoc(collection(db, "quotes"), finalData);
      console.log("Quote submitted successfully with ID:", docRef.id);

      // 4. Trigger Cloud Function (Email + Msg91)
      const sendNotifications = httpsCallable(functions, 'sendQuoteNotifications');
      sendNotifications(finalData).catch(err => console.error("Notification Error:", err));

      setSuccess(true);
      setLoading(false);
    } catch (error) {
      console.error("Submission Error", error);
      alert("Something went wrong. Please check your connection.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`h-full flex flex-col items-center justify-center text-center p-8 space-y-6 ${isDark ? 'text-white' : 'text-gray-800'}`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-6xl text-green-500">
          <FaCheckCircle />
        </motion.div>
        <h3 className="text-2xl font-bold">Request Received!</h3>
        <p className="opacity-80 text-sm">Our executive will review your details and contact you shortly with the best quote.</p>
        <button onClick={() => window.location.reload()} className="text-sm font-bold text-secondary underline">Get Another Quote</button>
      </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col justify-between">
      {/* Progress */}
      <div>
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200/20 rounded-t-xl overflow-hidden">
          <motion.div className="h-full bg-secondary" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between items-center px-1 pt-6 pb-2">
          <span className={`text-xs font-bold uppercase ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Step {step} of 3</span>
          <span className={`text-xs font-bold ${isDark ? 'text-secondary' : 'text-primary'}`}>{progress}% Completed</span>
        </div>
      </div>

      <form className="flex-grow flex flex-col justify-center space-y-5 py-2">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FaUser className="text-secondary" /> Personal Details
              </h3>
              
              <div className="relative group">
                <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder=" " />
                <label className={labelClass}>Full Name</label>
                {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name}</span>}
              </div>

              <div className="relative group">
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder=" " />
                <label className={labelClass}>Mobile Number</label>
                {errors.phone && <span className="text-red-500 text-xs ml-1">{errors.phone}</span>}
              </div>

              {/* WhatsApp Toggle */}
              <div className={`p-3 rounded-xl border ${isDark ? 'border-white/10 bg-black/20' : 'border-gray-200 bg-white/50'}`}>
                <p className={`text-xs font-bold mb-2 flex items-center gap-1 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <FaWhatsapp className="text-green-500"/> Is WhatsApp number same as Mobile?
                </p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isWhatsappSame" value="yes" checked={formData.isWhatsappSame === 'yes'} onChange={handleChange} className="accent-secondary h-4 w-4" />
                    <span className={isDark ? 'text-white text-sm' : 'text-gray-800 text-sm'}>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="isWhatsappSame" value="no" checked={formData.isWhatsappSame === 'no'} onChange={handleChange} className="accent-secondary h-4 w-4" />
                    <span className={isDark ? 'text-white text-sm' : 'text-gray-800 text-sm'}>No</span>
                  </label>
                </div>
              </div>

              {formData.isWhatsappSame === 'no' && (
                <div className="relative group animate-fade-in-up">
                  <input type="tel" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleChange} className={inputClass} placeholder=" " />
                  <label className={labelClass}>WhatsApp Number</label>
                  {errors.whatsappNumber && <span className="text-red-500 text-xs ml-1">{errors.whatsappNumber}</span>}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: LOCATIONS */}
          {step === 2 && (
            <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-5">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FaMapMarkerAlt className="text-secondary" /> Moving Route
              </h3>
              <div className="relative group">
                <input ref={fromRef} type="text" name="from" value={formData.from} onChange={handleChange} className={inputClass} placeholder=" " />
                <label className={labelClass}>Pickup City</label>
                {errors.from && <span className="text-red-500 text-xs ml-1">{errors.from}</span>}
              </div>
              <div className="relative group">
                <input ref={toRef} type="text" name="to" value={formData.to} onChange={handleChange} className={inputClass} placeholder=" " />
                <label className={labelClass}>Drop City</label>
                {errors.to && <span className="text-red-500 text-xs ml-1">{errors.to}</span>}
              </div>
            </motion.div>
          )}

          {/* STEP 3: SERVICES */}
          {step === 3 && (
            <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <FaTruckLoading className="text-secondary" /> Service Details
              </h3>

              <div className="relative group">
                <select name="service" value={formData.service} onChange={handleServiceChange} className={`${inputClass} appearance-none cursor-pointer pr-10`}>
                  <option value="" disabled className="bg-white text-gray-500">Select Service Type...</option>
                  <option className="bg-white text-black" value="Car Transportation">Car Transportation</option>
                  <option className="bg-white text-black" value="Bike Transportation">Bike Transportation</option>
                  <option className="bg-white text-black" value="Household Shifting">Household Shifting</option>
                  <option className="bg-white text-black" value="Packers and Movers">Packers and Movers</option>
                  <option className="bg-white text-black" value="Office Shifting">Office Shifting</option>
                </select>
                <label className={`${labelClass} ${formData.service ? '-translate-y-7 scale-90' : ''}`}>Service Type</label>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                  <FaChevronDown />
                </div>
                {errors.service && <span className="text-red-500 text-xs ml-1">{errors.service}</span>}
              </div>

              {/* Conditional Inputs */}
              {formData.service === 'Car Transportation' && (
                <div className="grid grid-cols-2 gap-3 animate-fade-in-up">
                  <div className="col-span-2 text-xs font-bold text-secondary flex items-center gap-1"><FaCar/> Car Details</div>
                  <div className="relative group">
                    <input type="text" name="carModel" value={formData.carModel} onChange={handleChange} className={inputClass} placeholder=" " />
                    <label className={labelClass}>Car Model</label>
                    {errors.carModel && <span className="text-red-500 text-xs ml-1">{errors.carModel}</span>}
                  </div>
                  <div className="relative group">
                    <input type="number" name="numCars" value={formData.numCars} onChange={handleChange} className={inputClass} placeholder=" " />
                    <label className={labelClass}>Qty</label>
                    {errors.numCars && <span className="text-red-500 text-xs ml-1">{errors.numCars}</span>}
                  </div>
                </div>
              )}

              {formData.service === 'Bike Transportation' && (
                <div className="animate-fade-in-up">
                  <div className="text-xs font-bold text-secondary flex items-center gap-1 mb-1"><FaMotorcycle/> Bike Details</div>
                  <div className="relative group">
                    <input type="text" name="bikeModel" value={formData.bikeModel} onChange={handleChange} className={inputClass} placeholder=" " />
                    <label className={labelClass}>Bike Model</label>
                    {errors.bikeModel && <span className="text-red-500 text-xs ml-1">{errors.bikeModel}</span>}
                  </div>
                </div>
              )}

              <div className="relative group">
                <textarea name="notes" rows="1" value={formData.notes} onChange={handleChange} className={inputClass} placeholder=" " />
                <label className={labelClass}>Notes (Optional)</label>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </form>

      {/* Nav Buttons */}
      <div className="flex gap-3 pt-2">
        {step > 1 ? (
          <button type="button" onClick={prevStep} className={`flex-1 py-3.5 rounded-xl font-bold border ${isDark ? 'border-white/20 text-white' : 'border-gray-300 text-gray-600'}`}>
            <FaArrowLeft className="inline mr-2" /> Back
          </button>
        ) : <div className="flex-1"></div>}
        
        {step < 3 ? (
          <button type="button" onClick={nextStep} className="flex-[2] bg-secondary hover:bg-yellow-500 text-black font-extrabold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2">
            Next <FaArrowRight />
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={loading} className="flex-[2] bg-primary hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 disabled:opacity-70">
            {loading ? <div className="animate-spin w-5 h-5 border-2 border-white rounded-full border-t-transparent" /> : <>Get Quote <FaPaperPlane /></>}
          </button>
        )}
      </div>
    </div>
  );
}