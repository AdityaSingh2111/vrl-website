import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaSearch, FaTruck, FaMapMarkerAlt, FaCalendarCheck, FaCar, FaMotorcycle, FaUserCircle, FaIdCard } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function Tracking() {
  const [trackId, setTrackId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapRef = useRef(null);

  // --- GOOGLE MAPS LOGIC ---
  useEffect(() => {
    if (result && result.from && result.to && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        disableDefaultUI: true,
        styles: [ 
          { "featureType": "all", "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
          { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
        ]
      });

      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: false,
        polylineOptions: { strokeColor: "#E31E24", strokeWeight: 5 } // VRL Red Path
      });

      directionsService.route(
        {
          origin: result.from,
          destination: result.to,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === 'OK') {
            directionsRenderer.setDirections(response);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [result]);

  const handleTrack = async (e) => {
    e.preventDefault();
    if(!trackId.trim()) return;
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const q = query(collection(db, "consignments"), where("trackingId", "==", trackId.trim()));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        setResult(querySnapshot.docs[0].data());
      } else {
        setError("Invalid Tracking ID. Please check your receipt.");
      }
    } catch (err) {
      console.error(err);
      setError("System error. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Track Shipment | VRL Logistic</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* --- SEARCH HEADER --- */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-dark mb-4">
            Live <span className="text-primary">Tracking</span>
          </h1>
          <p className="text-gray-500 mb-8">Enter your Consignment No. to see real-time location.</p>

          <form onSubmit={handleTrack} className="relative max-w-lg mx-auto">
            <input 
              type="text" 
              value={trackId}
              onChange={(e) => setTrackId(e.target.value)}
              placeholder="e.g. VRL-1001"
              className="w-full pl-6 pr-16 py-4 rounded-full border-2 border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-lg font-bold transition-all shadow-sm"
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 bg-dark hover:bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              {loading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div> : <FaSearch />}
            </button>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg inline-block font-medium text-sm">
              {error}
            </motion.div>
          )}
        </div>

        {/* --- RESULT SECTION --- */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left: Status & Details Card */}
                <div className="lg:col-span-1 space-y-6">
                  
                  {/* Status Box */}
                  <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
                        <h2 className="text-2xl font-black text-primary">{result.currentStatus}</h2>
                      </div>
                      <FaTruck className="text-4xl text-gray-100" />
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="text-xs font-bold text-blue-400 uppercase mb-1">Current Location</p>
                        <p className="font-bold text-blue-900 flex items-center gap-2">
                          <FaMapMarkerAlt /> {result.currentLocation}
                        </p>
                      </div>
                      
                      <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                        <p className="text-xs font-bold text-green-500 uppercase mb-1">Estimated Delivery</p>
                        <p className="font-bold text-green-900 flex items-center gap-2">
                          <FaCalendarCheck /> {new Date(result.estimatedDelivery).toDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Shipment Details Mini Card */}
                  <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-3 border-b border-gray-100 pb-2">Shipment Details</p>
                    
                    {/* Customer */}
                    <div className="flex justify-between items-center text-sm mb-3">
                      <span className="text-gray-500 flex items-center gap-2"><FaUserCircle className="text-gray-400"/> Client</span>
                      <span className="font-bold text-dark">{result.customerName}</span>
                    </div>

                    {/* Vehicle Info (Conditional) */}
                    {(result.vehicleModel || result.rcNumber) && (
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mb-3">
                        {result.vehicleModel && (
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center gap-1">
                              {result.service?.includes('Bike') ? <FaMotorcycle/> : <FaCar/>} Model
                            </span>
                            <span className="font-bold text-dark">{result.vehicleModel}</span>
                          </div>
                        )}
                        {result.rcNumber && (
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1"><FaIdCard/> RC No.</span>
                            <span className="font-mono font-bold text-dark">{result.rcNumber}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">From</span>
                      <span className="font-bold text-dark">{result.from}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">To</span>
                      <span className="font-bold text-dark">{result.to}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Map & Timeline */}
                <div className="lg:col-span-2 space-y-6">
                  
                  {/* Google Map Container */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 h-64 md:h-80 relative">
                    <div ref={mapRef} className="w-full h-full bg-gray-100" />
                    {/* Fallback overlay if API fails/loads slowly */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-gray-50/50" style={{ display: window.google ? 'none' : 'flex' }}>
                      <p className="text-gray-400 text-sm font-bold">Loading Map Route...</p>
                    </div>
                  </div>

                  {/* Vertical Timeline */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-dark mb-6 text-lg">Shipment History</h3>
                    <div className="relative pl-4 border-l-2 border-gray-100 space-y-8">
                      {result.timeline?.slice().reverse().map((event, index) => (
                        <div key={index} className="relative pl-6">
                          <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 border-white shadow-sm 
                            ${index === 0 ? 'bg-primary ring-4 ring-red-50' : 'bg-gray-300'}`} 
                          />
                          <p className="font-bold text-dark text-sm">{event.status}</p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {event.timestamp?.seconds 
                              ? new Date(event.timestamp.seconds * 1000).toLocaleString() 
                              : new Date(event.timestamp).toLocaleString()
                            }
                          </p>
                          <p className="text-xs font-medium text-gray-600 mt-1 bg-gray-50 inline-block px-2 py-1 rounded">
                            {event.location}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}