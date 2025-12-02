import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';

export default function TrackingWidget() {
  const [trackId, setTrackId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) {
      // Navigate to the full tracking page with the ID as state
      navigate('/track', { state: { id: trackId.trim() } });
    }
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
          <FaMapMarkerAlt className="text-3xl text-secondary" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Track Your Shipment</h3>
        <p className="text-gray-300 text-sm">Enter your Consignment Number (e.g., VRL-1001) to see Shipment status.</p>
      </div>

      <form onSubmit={handleTrack} className="space-y-4">
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-secondary transition-colors">
            <FaSearch />
          </div>
          <input 
            type="text" 
            placeholder="Enter Tracking ID" 
            className="w-full pl-12 pr-4 py-4 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:bg-black/50 focus:border-secondary focus:ring-1 focus:ring-secondary/50 outline-none transition-all"
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-secondary hover:bg-yellow-500 text-black font-extrabold py-4 rounded-xl shadow-lg shadow-yellow-500/20 transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2"
        >
          TRACK NOW
        </button>
      </form>
    </div>
  );
}