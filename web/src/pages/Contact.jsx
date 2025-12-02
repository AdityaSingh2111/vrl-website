import PageBanner from '../components/PageBanner';
import QuoteForm from '../components/QuoteForm';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Banner Section */}
      <PageBanner title="Get In Touch" breadcrumb="Contact" />

      {/* Content Section */}
      {/* Reduced negative margin (-mt-4) to center the banner text better visually */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl shrink-0">
                <FaPhoneAlt />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Phone Support</h3>
                <p className="text-gray-600 text-sm font-medium">+91 73387 95585</p>
                <p className="text-gray-400 text-xs mt-1">24/7 Available</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-xl shrink-0">
                <FaEnvelope />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Email Us</h3>
                <p className="text-gray-600 text-sm break-all">info@vrllogistics.co.in</p>
                <p className="text-gray-600 text-sm break-all">support@vrllogistics.co.in</p>
                <p className="text-gray-400 text-xs mt-1">Response within 2 hours</p>
              </div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-2xl shrink-0">
                <FaWhatsapp />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">WhatsApp Chat</h3>
                <p className="text-gray-600 text-sm mb-2">Chat with our expert</p>
                <a 
                  href="https://wa.me/917338795585" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="inline-block text-xs bg-green-600 text-white px-4 py-1.5 rounded-full font-bold hover:bg-green-700 transition-colors"
                >
                  Start Chat
                </a>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-start gap-4 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xl shrink-0">
                <FaMapMarkerAlt />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Head Office</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  VRL Logistics Ltd.<br/>
                  Giriraj Annexe, Circuit House Road,<br/>
                  Hubballi, Karnataka 580029
                </p>
              </div>
            </div>

          </div>

          {/* Right: Send Message Form */}
          <div className="lg:col-span-2">
            {/* Removed h-full to allow auto-expansion, preventing button overlap with footer */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10 border border-gray-100">
              <div className="mb-8 border-b border-gray-100 pb-6">
                <span className="text-primary font-bold uppercase text-xs tracking-wider">Contact Form</span>
                <h2 className="text-3xl font-black text-gray-900 mt-2">Send us a Message</h2>
                <p className="text-gray-500 mt-2">Fill the form below to get a callback or quote instantly.</p>
              </div>
              
              <QuoteForm theme="light" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}