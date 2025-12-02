import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageBanner from '../components/PageBanner';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaImage, FaVideo } from 'react-icons/fa';

// Mock Data for Photos
const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80", category: "Fleet", title: "Heavy Duty Trucks" },
  { src: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80", category: "Packing", title: "Secure Box Packing" },
  { src: "https://images.unsplash.com/photo-1534670007418-fbb7f6cf32c3?auto=format&fit=crop&q=80", category: "Warehouse", title: "Storage Facility" },
  { src: "https://images.unsplash.com/photo-1616432043562-3671ea2e5242?auto=format&fit=crop&q=80", category: "Transport", title: "Car Carrier" },
  { src: "https://images.unsplash.com/photo-1565514020176-db7233e90216?auto=format&fit=crop&q=80", category: "Packing", title: "Furniture Wrapping" },
  { src: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80", category: "Warehouse", title: "Logistics Hub" },
];

// Mock Data for Videos (Using YouTube Thumbnails/IDs)
const VIDEOS = [
  { id: "dQw4w9WgXcQ", title: "VRL Corporate Video", thumb: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg" },
  { id: "engt853tqew", title: "How We Pack Your Goods", thumb: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&q=80" }, // Placeholder thumb
  { id: "3tmd-ClpJxA", title: "Customer Testimonials", thumb: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" },
];

const CATEGORIES = ["All", "Fleet", "Packing", "Warehouse", "Transport"];

export default function Gallery() {
  const [activeTab, setActiveTab] = useState("photos"); // 'photos' or 'videos'
  const [activeCat, setActiveCat] = useState("All");

  const filteredPhotos = activeCat === "All" 
    ? PHOTOS 
    : PHOTOS.filter(img => img.category === activeCat);

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
                {filteredPhotos.map((img) => (
                  <motion.div
                    layout
                    key={img.src}
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
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <div>
                        <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1">{img.category}</p>
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
              <div key={idx} className="group bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="relative aspect-video bg-black">
                  <img 
                    src={video.thumb} 
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white border-2 border-white group-hover:scale-110 transition-transform">
                      <FaPlay className="ml-1 text-xl" />
                    </button>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">
                    Watch Video
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-1">{video.title}</h3>
                  <p className="text-gray-500 text-sm">Watch how VRL Logistics ensures safe delivery standards.</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}