import PageBanner from '../components/PageBanner';
import { FaGavel, FaExclamationCircle, FaHandshake, FaMoneyBillWave } from 'react-icons/fa';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Terms & Conditions" breadcrumb="Terms" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            Welcome to VRL Logistics Packers and Movers. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions of use. Please read them carefully.
          </p>

          <div className="space-y-12">
            
            {/* Section 1 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-4">
                <FaGavel className="text-primary" /> 1. General Terms
              </h3>
              <p className="mb-4">
                The content of the pages of this website is for your general information and use only. It is subject to change without notice. Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness, or suitability of the information and materials found or offered on this website.
              </p>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-4">
                <FaHandshake className="text-secondary" /> 2. Service Agreement
              </h3>
              <p className="mb-4">
                When you book a service with us, you enter into a contract based on the quotation provided. Any additional services requested on-site that were not part of the initial survey or quote will be charged extra.
              </p>
              <ul className="list-disc pl-6 space-y-2 bg-gray-50 p-6 rounded-xl border border-gray-100">
                <li>Ideally, booking should be made 2-5 days in advance.</li>
                <li>The customer must declare the value of goods for insurance purposes accurately.</li>
                <li>We are not liable for any damage caused by natural calamities or unforeseen accidents unless covered by transit insurance.</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-4">
                <FaMoneyBillWave className="text-green-600" /> 3. Payment Terms
              </h3>
              <p className="mb-4">
                Payments must be made as per the agreed schedule. 
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Advance Payment:</strong> A token advance is required to confirm the booking slot.</li>
                <li><strong>Balance Payment:</strong> The remaining balance must be cleared before the unloading of goods at the destination.</li>
                <li>We accept payments via Cash, Bank Transfer, UPI, and Major Credit/Debit Cards.</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-800 mb-4">
                <FaExclamationCircle className="text-red-500" /> 4. Cancellation & Refund
              </h3>
              <p className="mb-4">
                Cancellations made 48 hours prior to the scheduled move date are eligible for a refund of the booking amount, subject to a small processing fee. Cancellations made within 24 hours may attract a cancellation charge.
              </p>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">5. Prohibited Items</h3>
              <p className="mb-4">
                We strictly do not transport the following items:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm font-bold text-gray-500">
                <div className="bg-gray-100 p-3 rounded text-center">Explosives</div>
                <div className="bg-gray-100 p-3 rounded text-center">Firearms</div>
                <div className="bg-gray-100 p-3 rounded text-center">Drugs/Narcotics</div>
                <div className="bg-gray-100 p-3 rounded text-center">Perishables</div>
                <div className="bg-gray-100 p-3 rounded text-center">Gas Cylinders</div>
                <div className="bg-gray-100 p-3 rounded text-center">Cash/Jewelry</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}