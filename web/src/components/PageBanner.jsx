import { Link } from "react-router-dom";

export default function PageBanner({ title, subtitle, breadcrumb }) {
  return (
    <div className="relative w-full">
      {/* Banner Image Section */}
      <div className="relative h-[40vh] md:h-[50vh] w-full bg-gray-900 overflow-hidden">
        {/* Background Image - Reduced opacity for dimmer effect */}
        <img
          src="../fleet.png"
          alt="VRL Logistics Fleet"
          className="w-full h-full object-cover opacity-40"
        />

        {/* Dark Gradient Overlay for extra text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          <h1 className="text-3xl md:text-5xl font-black text-white drop-shadow-2xl uppercase tracking-wide mb-4 leading-tight">
            Currently Among the Largest Fleet Owner of India
          </h1>
          <div className="inline-block bg-secondary/95 backdrop-blur-md px-6 py-2 rounded-lg text-dark font-extrabold text-sm md:text-lg tracking-wider uppercase shadow-lg border border-yellow-500/50">
            [ 3450+ Owned Goods Transport Vehicles ]
          </div>
        </div>
      </div>

      {/* Breadcrumb Strip */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <p className="text-xs text-gray-500 font-medium flex items-center gap-2 uppercase tracking-wide">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold">{breadcrumb}</span>
          </p>
        </div>
      </div>

      {/* Page Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 relative inline-block">
          {title}
          <span className="block w-16 h-1.5 bg-primary mx-auto mt-4 rounded-full"></span>
        </h2>
        {subtitle && (
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
