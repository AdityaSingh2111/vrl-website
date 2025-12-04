import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import PageBanner from '../components/PageBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { FaImage, FaVideo, FaPlay } from 'react-icons/fa';
// Data for Photos
const PHOTOS = [
  {src: "/gallery/photos/pic (1).jpeg", categories: ["Bike", "Packing"], title: "Logistics Fleet" },
  { src: "/gallery/photos/pic (2).jpeg", categories: ["Car"], title: "Secure Packing" },
  { src: "/gallery/photos/pic (3).jpeg", categories: ["Warehouse", "Packing"], title: "Modern Warehouse" },
  { src: "/gallery/photos/pic (4).jpeg", categories: ["Packing", "Transport"], title: "On the Move" },
  {src: "/gallery/photos/pic (5).jpeg", categories: ["Car"], title: "Delivery Trucks" },
  { src: "/gallery/photos/pic (6).jpeg", categories: ["Packing", "Transport"], title: "Fragile Items" },
  { src: "/gallery/photos/pic (7).jpeg", categories: ["Car"], title: "Storage Solutions" },
  { src: "/gallery/photos/pic (8).jpeg", categories: ["Transport", "Car"], title: "Logistics in Action" },
  { src: "/gallery/photos/pic (9).jpeg", categories: ["Car", "Transport"], title: "Cargo Vans" },
  { src: "/gallery/photos/pic (10).jpeg", categories: ["Car", "Transport"], title: "Efficient Packing" },
  { src: "/gallery/photos/pic (11).jpeg", categories: ["Car", "Transport"], title: "Inventory Management" },
  { src: "/gallery/photos/pic (12).jpeg", categories: ["Car", "Transport"], title: "Long Haul Trucks" },
  { src: "/gallery/photos/pic (13).jpeg", categories: ["Transport"], title: "Logistics Team" },
  { src: "/gallery/photos/pic (14).jpeg", categories: ["Packing"], title: "Professional Packers" },
  { src: "/gallery/photos/pic (15).jpeg", categories: ["Packing"], title: "Loading Dock" },
  { src: "/gallery/photos/pic (16).jpeg", categories: ["Packing"], title: "Freight Transport" },
  { src: "/gallery/photos/pic (17).jpeg", categories: ["Bike"], title: "Logistics Operations" },
  { src: "/gallery/photos/pic (18).jpeg", categories: ["Car"], title: "Packing Materials" },
  { src: "/gallery/photos/pic (19).jpeg", categories: ["Car"], title: "Warehouse Staff" },
  { src: "/gallery/photos/pic (20).jpeg", categories: ["Car"], title: "Efficient Delivery" },
  { src: "/gallery/photos/pic (21).jpeg", categories: ["Bike","Warehouse"], title: "Fleet Maintenance" },
  { src: "/gallery/photos/pic (22).jpeg", categories: ["Bike", "Warehouse"], title: "Careful Handling" },
  { src: "/gallery/photos/pic (23).jpeg", categories: ["Bike", "Warehouse"], title: "Organized Storage" },
  { src: "/gallery/photos/pic (24).jpeg", categories: ["Bike", "Warehouse"], title: "Timely Deliveries" },
  { src: "/gallery/photos/pic (25).jpeg", categories: ["Bike", "Warehouse"], title: "Logistics Network" },
  { src: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80", categories: ["Transport"], title: "Car Carrier" },
  { src: "https://images.unsplash.com/photo-1663625318264-695d2d04f11a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", categories: ["Packing"], title: "Household Goods" },
  { src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80", categories: ["Warehouse"], title: "Logistics Hub" },
  {src: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", categories: ["Warehouse"], title: "Storage facility" },
  
];
// Data for Videos
const VIDEOS = [
  { 
    id: "v1", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (1).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v2", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (2).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v3", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (3).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v4", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (4).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v5", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (5).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v6", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (6).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v7", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (7).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  { 
    id: "v8", 
    title: "VRL Logistics Overview", 
    src: "/gallery/videos/vid (8).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  {
    id: "v9",
    title: "VRL Logistics Overview",
    src: "/gallery/videos/vid (9).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  {
    id: "v10",
    title: "VRL Logistics Overview",
    src: "/gallery/videos/vid (10).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
  {
    id: "v11",
    title: "VRL Logistics Overview",
    src: "/gallery/videos/vid (11).mp4", 
    //thumb: "/gallery/video1-thumb.jpg", // Optional: Thumbnail image
    desc: "A glimpse into our daily operations and fleet management."
  },
];

const CATEGORIES = ["All","Car", "Packing", "Bike", "Transport", "Warehouse"];

// --- VIDEO PLAYER COMPONENT ---
const VideoCard = ({ video }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
      <div className="relative aspect-video bg-black cursor-pointer" onClick={handlePlayToggle}>
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
          src={`${video.src}#t=0.1`} // Start slightly into the video to avoid black frame
          preload="metadata" // Preload metadata for quick loading
          playsInline
          controls={isPlaying} // Only show native controls when playing
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        >
          Your browser does not support the video tag.
        </video>
        
        {/* Custom Play Button Overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors z-10">
            <button 
              className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border-2 border-white group-hover:scale-110 transition-transform shadow-lg"
              aria-label="Play Video"
            >
              <FaPlay className="ml-1 text-2xl" />
            </button>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{video.title}</h3>
        <p className="text-gray-500 text-sm">{video.desc}</p>
      </div>
    </div>
  );
};

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("photos"); // 'photos' or 'videos'
  const [activeCat, setActiveCat] = useState("All");

  const filteredPhotos = activeCat === "All" 
    ? PHOTOS 
    : PHOTOS.filter(img => img.categories.includes(activeCat));

  // JSON-LD Schema for SEO
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "VRL Logistics Project Gallery",
    "description": "Photos and videos of VRL Logistics services, fleet, and warehouses.",
    "image": PHOTOS.map(p => p.src)
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>Gallery - Photos & Videos | VRL Logistic Packers & Movers</title>
        <meta name="description" content="Explore our photo and video gallery showcasing our fleet, packing techniques, warehousing facilities, and successful relocations." />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <PageBanner title="Media Gallery" breadcrumb="Gallery" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Tab Switcher */}
        <div className="flex justify-center mb-12 -mt-8 relative z-20">
          <div className="bg-white p-1.5 rounded-full shadow-xl border border-gray-100 inline-flex">
            <button
              onClick={() => setActiveTab("photos")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "photos" 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaImage /> Photo Gallery
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold transition-all ${
                activeTab === "videos" 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <FaVideo /> Video Gallery
            </button>
          </div>
        </div>

        {/* --- PHOTO GALLERY CONTENT --- */}
        {activeTab === "photos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  className={`px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all border ${
                    activeCat === cat 
                      ? 'bg-dark text-white border-dark shadow-lg' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Photos Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredPhotos.map((img, idx) => (
                  <motion.div
                    layout
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-zoom-in bg-gray-200 shadow-sm hover:shadow-xl transition-all"
                  >
                    <img 
                      src={img.src} 
                      alt={`${img.title} - VRL Logistics`} 
                      loading="lazy"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }} // Fallback
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{img.categories.join(" / ")}</p>
                        <h4 className="text-white text-lg font-bold leading-tight">{img.title}</h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
            
            {filteredPhotos.length === 0 && (
              <div className="text-center py-20 text-gray-400">No photos found in this category.</div>
            )}
          </motion.div>
        )}

        {/* --- VIDEO GALLERY CONTENT --- */}
        {activeTab === "videos" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {VIDEOS.map((video, idx) => (
              <VideoCard key={idx} video={video} />
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}