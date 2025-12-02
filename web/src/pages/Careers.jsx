import PageBanner from '../components/PageBanner';
import { FaBriefcase, FaArrowRight } from 'react-icons/fa';

export default function Careers() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Join Our Team" breadcrumb="Careers" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-800">Current Openings</h3>
          <p className="text-gray-500">Be part of India's largest logistics network.</p>
        </div>

        <div className="space-y-6">
          {[
            { role: "Logistics Coordinator", loc: "Bangalore", type: "Full Time" },
            { role: "Heavy Vehicle Driver", loc: "Pan India", type: "Contract" },
            { role: "Branch Manager", loc: "Pune", type: "Full Time" },
            { role: "Customer Support Executive", loc: "Hubli", type: "Full Time" }
          ].map((job, idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-4 hover:bg-white hover:shadow-lg transition-all border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-white p-3 rounded-full shadow-sm text-secondary">
                  <FaBriefcase />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">{job.role}</h4>
                  <p className="text-sm text-gray-500">{job.loc} • {job.type}</p>
                </div>
              </div>
              <button className="bg-dark text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-primary transition-colors flex items-center gap-2">
                Apply Now <FaArrowRight />
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 p-8 rounded-2xl text-center">
          <h3 className="font-bold text-xl mb-2">Don't see a fit?</h3>
          <p className="text-gray-600 mb-4">Send your resume to us directly.</p>
          <a href="mailto:careers@vrllogistic.com" className="text-primary font-bold underline">
            careers@vrllogistic.com
          </a>
        </div>

      </div>
    </div>
  );
}