import PageBanner from '../../components/PageBanner';
import { motion } from 'framer-motion';

export default function History() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Our History" breadcrumb="About Us / History" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="prose prose-lg mx-auto text-gray-600 leading-relaxed text-justify"
        >
          <p className="mb-6 first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-3 first-letter:float-left">
            VRL was founded in 1976 by DR. Vijay Sankeshwar in Gadag, a small town in North Karnataka with a single truck and a vision that was way ahead of its time. VRL gradually expanded its services to Bangalore, Hubli and Belgaum. From this humble beginning VRL has today grown into a nationally renowned logistics and transport company which is also currently the largest fleet owner of commercial vehicles in India with a fleet of 5,777 vehicles (Including 389 Passenger Transport Vehicles & 5,388 Goods Transport Vehicles).
          </p>
          
          <p className="mb-6">
            VRL has been a pioneer in the Indian commercial vehicle industry and has set several benchmarks for the industry to follow. We have a record of introducing many firsts in the Indian Road Transport Industry.
          </p>

          <div className="my-10 grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-primary">
                <h4 className="font-bold text-dark text-xl mb-2">1976</h4>
                <p className="text-sm">Founded with a single truck in Gadag, Karnataka.</p>
             </div>
             <div className="bg-gray-50 p-6 rounded-xl border-l-4 border-secondary">
                <h4 className="font-bold text-dark text-xl mb-2">Today</h4>
                <p className="text-sm">Largest fleet owner in India with 6000+ vehicles.</p>
             </div>
          </div>

          <p>
            Over the years, VRL has grown into a massive conglomerate with diversified interests in printing & publishing, wind power, air chartering and logistics.
          </p>
        </motion.div>
      </div>
    </div>
  );
}