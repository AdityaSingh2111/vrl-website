import { useState } from 'react';
import { FaEnvelopeOpenText, FaExternalLinkAlt, FaLock, FaPhoneAlt, FaExclamationCircle, FaServer, FaQuestionCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function Webmail() {
  // REPLACE THIS WITH YOUR ACTUAL EMAIL SERVER URL
  const WEBMAIL_URL = "https://vrllogistics.co.in/webmail"; 

  const handleRedirect = () => {
    window.open(WEBMAIL_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Helmet>
        <title>Staff Webmail Portal | VRL Logistics</title>
      </Helmet>
      
      <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans">
        
        {/* Breadcrumb / Header */}
        <div className="max-w-5xl mx-auto mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Home / Webmail</p>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800">Staff Webmail Portal</h1>
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row"
          >
            
            {/* Left: Login Action (White Side) */}
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center bg-white relative">
               {/* Background Decor */}
               <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-50 rounded-br-full -z-0 opacity-50"></div>

              <div className="relative z-10">
                  <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 text-3xl mb-6 shadow-sm">
                    <FaEnvelopeOpenText />
                  </div>
                  
                  <h2 className="text-3xl font-black text-gray-900 mb-3">VRL Mail</h2>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    Access your secure employee inbox. You will be redirected to the dedicated secure mail server to complete your login.
                  </p>

                  <div className="space-y-6">
                    <button 
                      onClick={handleRedirect}
                      className="w-full flex items-center justify-center gap-3 bg-black text-white font-bold py-4 rounded-xl hover:bg-primary hover:shadow-lg hover:shadow-primary/20 transition-all group"
                    >
                      <FaLock className="text-sm" /> Proceed to Secure Login <FaExternalLinkAlt className="text-xs group-hover:translate-x-1 transition-transform" />
                    </button>
                    
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-400 font-medium bg-gray-50 py-2 rounded-lg">
                      <FaLock size={10} /> 256-bit SSL Encrypted Connection
                    </div>
                  </div>
              </div>
            </div>

            {/* Right: Support Info (Dark Side) */}
            <div className="bg-[#0f172a] p-8 md:p-12 flex-1 text-white flex flex-col justify-center relative overflow-hidden">
              {/* Mesh Gradient Background */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-16 -mt-16 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[60px] -ml-10 -mb-10 pointer-events-none"></div>

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <FaExclamationCircle className="text-primary" /> IT Support & Helpdesk
                </h3>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="mt-1"><FaQuestionCircle className="text-gray-500" /></div>
                     <div>
                        <p className="font-bold text-white text-sm mb-1">Forgot Password?</p>
                        <p className="text-xs text-gray-400 leading-relaxed">Contact the IT administration desk to reset your corporate credentials. Do not share password via email.</p>
                     </div>
                  </div>
                  
                  <div className="flex gap-4">
                     <div className="mt-1"><FaServer className="text-gray-500" /></div>
                     <div>
                        <p className="font-bold text-white text-sm mb-1">Server Configuration</p>
                        <ul className="text-xs text-gray-400 space-y-1 font-mono">
                          <li>Incoming: imap.vrllogistic.com (993)</li>
                          <li>Outgoing: smtp.vrllogistic.com (465)</li>
                        </ul>
                     </div>
                  </div>

                  <div className="pt-6 border-t border-gray-800">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Technical Assistance</p>
                    <a href="tel:+917338795585" className="flex items-center gap-3 text-lg font-bold text-white hover:text-primary transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs"><FaPhoneAlt /></div>
                      +91 73387 95585
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </motion.div>
        </div>

        <div className="text-center mt-12">
            <p className="text-sm text-gray-400">Authorized personnel only. Unauthorized access is prohibited.</p>
            <p className="text-xs text-gray-300 mt-1">&copy; {new Date().getFullYear()} VRL Logistics Ltd. IT Department.</p>
        </div>
      </div>
    </>
  );
}