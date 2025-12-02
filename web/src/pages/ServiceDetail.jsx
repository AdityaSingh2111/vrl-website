import { useParams, Navigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { servicesData } from '../data/servicesData';
import PageBanner from '../components/PageBanner';
import QuoteForm from '../components/QuoteForm';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ServiceDetail() {
  const { id } = useParams();
  const service = servicesData[id];

  // Handle invalid service URLs
  if (!service) {
    return <Navigate to="/services" replace />;
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>{service.title} | VRL Logistic Packers & Movers</title>
        <meta name="description" content={service.subtitle} />
      </Helmet>

      <PageBanner title={service.title} subtitle={service.subtitle} breadcrumb={`Services / ${service.title}`} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <img src={service.image} alt={service.title} className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-700" />
            </motion.div>

            <div className="prose prose-lg text-gray-600 leading-relaxed text-justify">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Overview</h3>
              <p>{service.description}</p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Key Features</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <FaCheckCircle className="text-primary mt-1 shrink-0" />
                    <span className="text-gray-700 font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Services Links */}
            <div className="pt-8 border-t border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Explore Other Services</h4>
              <div className="flex flex-wrap gap-3">
                {Object.entries(servicesData).map(([key, s]) => (
                  key !== id && (
                    <Link 
                      key={key} 
                      to={`/services/${key}`}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-600 hover:border-primary hover:text-primary transition-all"
                    >
                      {s.title}
                    </Link>
                  )
                ))}
              </div>
            </div>
          </div>

          {/* Right: Quote Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 sticky top-24">
              <div className="mb-6">
                <h3 className="text-2xl font-black text-gray-800">Get A Quote</h3>
                <p className="text-gray-500 text-sm">Instant pricing for {service.title}</p>
              </div>
              <QuoteForm />
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl flex gap-3 items-start">
                <div className="bg-white p-2 rounded-full text-blue-600 shadow-sm">
                  <service.icon />
                </div>
                <div>
                  <p className="text-sm font-bold text-blue-900">Need Help?</p>
                  <p className="text-xs text-blue-700">Call our expert for {service.title} queries.</p>
                  <a href="tel:+917338795585" className="text-sm font-black text-blue-800 block mt-1">+91 73387 95585</a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}