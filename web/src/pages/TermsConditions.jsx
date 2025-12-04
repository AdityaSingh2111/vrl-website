import { Helmet } from 'react-helmet-async';
import PageBanner from '../components/PageBanner';
import { FaGavel, FaHandshake, FaMoneyBillWave, FaExclamationCircle, FaTruck, FaShieldAlt, FaFileInvoiceDollar, FaBan, FaWarehouse } from 'react-icons/fa';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <Helmet>
        <title>Terms & Conditions | VRL Logistics Packers & Movers</title>
        <meta name="description" content="Read the Terms and Conditions, Cancellation Policy, and Refund Policy for VRL Logistic Packers & Movers services." />
      </Helmet>

      <PageBanner title="Terms & Conditions" breadcrumb="Terms" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="text-lg leading-relaxed mb-10 border-l-4 border-primary pl-6 italic bg-gray-50 py-4 rounded-r-lg">
            By engaging with <strong>VRL Logistics Packers & Movers</strong>, you agree to the following terms. These conditions govern all services provided, including packing, moving, transportation, and storage.
          </p>

          <div className="grid gap-12">
            
            {/* Section 1: General */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaGavel className="text-primary" /> 1. General Service Conditions
              </h3>
              <ul className="space-y-3 list-disc pl-5 marker:text-primary">
                <li>We do not undertake <strong>Electrical, Carpentry, or Plumbing work</strong> unless specified in a special contract.</li>
                <li><strong>GSTIN details</strong> must be submitted in advance. No changes will be accepted after invoice generation.</li>
                <li>The quotation remains valid if approved within <strong>15 days</strong> and services are commenced within <strong>30 days</strong>.</li>
                <li>Written confirmation of quotation is mandatory before scheduling.</li>
                <li>Packing will begin only after payment of <strong>Gross Freight + GST</strong> (if applicable).</li>
                <li>The advance payment must be cleared at the origin point.</li>
                <li>Any additional services or changes requested after job order confirmation may incur extra charges.</li>
                <li>All payments must be made in accordance with the agreed terms to avoid service delays.</li>
                <li>We reserve the right to refuse service if terms are not met or if goods are deemed unsafe for transport.</li>
                <li>All disputes will be subject to the jurisdiction of the courts of the company's location.</li>
                <li>We reserve the right to amend these terms and conditions at any time without prior notice.</li>
              </ul>
            </section>

            {/* Section 2: Packing & Loading */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaHandshake className="text-secondary" /> 2. Packing & Loading
              </h3>
              <ul className="space-y-3 list-disc pl-5 marker:text-secondary">
                <li>Customer-packed goods must be roadworthy and properly valued. We take no liability for self-packed items.</li>
                <li>Additional charges apply for <strong>wooden crating</strong> or special protective packing for fragile items.</li>
                <li>The company is <strong>not responsible</strong> for cash, jewellery, important documents, or valuables left inside goods.</li>
                <li>In case of Household, <strong>100% payment</strong> is mandatory before or immediately after pickup/delivery as per the agreed terms.</li>
              </ul>
            </section>

            {/* Section 3: Volume & Transit */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaTruck className="text-blue-600" /> 3. Transit & Charges
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-blue-50 p-6 rounded-xl">
                  <h4 className="font-bold text-blue-800 mb-2">Volume & Weight</h4>
                  <p className="text-sm">Charges are based on actual volume/weight. Excess volume will be billed proportionately. Vehicle transportation charges fluctuate based on market conditions.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-2">Transit Time</h4>
                  <p className="text-sm">Transit time excludes pickup/delivery days. Delays may arise from traffic, weather, RTO restrictions, strikes, or unforeseen circumstances (Force Majeure).</p>
                </div>
              </div>
            </section>

            {/* Section 4: Risk & Insurance */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaShieldAlt className="text-red-500" /> 4. Risk, Damage, Insurance & Claims
              </h3>
              <ul className="space-y-3 list-disc pl-5 marker:text-red-500">
                <li><strong>Transit Risk Coverage (0.5% – 5%)</strong> is highly recommended.</li>
                <li>If insurance is not opted, goods are transported entirely at <strong>owner’s risk</strong>.</li>
                <li>The company is not liable for accidents, theft, fire, or natural calamities unless insured.</li>
                <li>Only visible external(Bumper to Bumper) damage to Car/Bike is claimable. Mechanical or electrical failures are not covered.</li>
                <li>Claims must be reported <strong>immediately at delivery</strong> with proof (photos/videos) on the POD (Proof of Delivery).</li>
              </ul>
            </section>

            {/* Section 5: Vehicles */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaTruck className="text-purple-600" /> 5. Car & Bike Transportation
              </h3>
              <ul className="space-y-3 list-disc pl-5 marker:text-purple-600">
                <li>Vehicle must be in <strong>running condition</strong> unless pre-informed.</li>
                <li>In case of car, minimum <strong>10 litres of fuel</strong> is required and battery should be fully charged(in case of EV).</li>
                <li>Company is not responsible for engine, battery, or electrical issues during transit.</li>
                <li><strong>Required Docs:</strong> RC Copy, Insurance, and ID Proof (Aadhar/PAN etc.) is mandatory. Failure to provide these may delay/halt movement.</li>
                <li><strong>No Personal Items:</strong> No personal belongings are allowed inside the vehicle. The company is not responsible for missing items kept inside. In case of shifting personal items, please inform in advance and extra charges may apply.</li>
              </ul>
            </section>

            {/* Section 6: Delivery & Storage */}
            <section>
              <h3 className="flex items-center gap-3 text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                <FaWarehouse className="text-indigo-600" /> 6. Delivery & Storage
              </h3>
              <p className="mb-4">Delivery will be made to the address mentioned in the job order. Extra charges apply for:</p>
              <ul className="grid grid-cols-2 gap-4 text-sm font-bold text-gray-500 mb-4">
                 <li className="bg-gray-100 p-2 rounded text-center">Restricted Areas</li>
                 <li className="bg-gray-100 p-2 rounded text-center">Narrow Roads (Shuttle Svc)</li>
                 <li className="bg-gray-100 p-2 rounded text-center">Society Restrictions</li>
                 <li className="bg-gray-100 p-2 rounded text-center">Floors greater than 2 (No Lift)</li>
              </ul>
              <p>Customer or an authorized representative must be present during pickup and delivery.</p>
            </section>

            {/* Section 7: Cancellation Policy */}
            <div className="bg-red-50 p-8 rounded-2xl border border-red-100">
              <h3 className="flex items-center gap-3 text-2xl font-black text-red-800 mb-6">
                <FaBan /> Cancellation & Refund Policy
              </h3>
              
              <div className="space-y-6 text-red-900/80">
                <div>
                   <h4 className="font-bold text-red-900">Cancellation Charges</h4>
                   <ul className="list-disc pl-5 mt-2 space-y-1 text-sm">
                      <li><strong>&gt; 24 Hours Prior:</strong> No Charge.</li>
                      <li><strong>&lt; 24 Hours Prior:</strong> Cancellation charges apply.</li>
                      <li><strong>After Vehicle Arrival:</strong> Visiting and transport charges apply.</li>
                      <li><strong>After Loading:</strong> 50% of bill amount charged.</li>
                      <li><strong>After Dispatch:</strong> No cancellation or refund permitted.</li>
                   </ul>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-red-900">Advance Payment</h4>
                        <p className="text-sm">Non-refundable if customer cancels. Refunds issued only if cancellation is from the company’s side.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-red-900">Rescheduling</h4>
                        <p className="text-sm">Allowed once with <strong>48-hour prior notice</strong> (subject to availability). Late changes attract fees.</p>
                    </div>
                </div>

                <div className="border-t border-red-200 pt-4 mt-2">
                    <h4 className="font-bold text-red-900">Refund Timeline</h4>
                    <p className="text-sm">Approved refunds are processed within <strong>8–14 working days</strong> via the original payment method.</p>
                    <p className="text-xs mt-2 italic">* Cancellation requests are only accepted via Email or WhatsApp. Verbal cancellations are invalid.</p>
                </div>
              </div>
            </div>

            {/* Section 8: Legal */}
            <section className="text-sm text-gray-500 bg-gray-50 p-6 rounded-xl text-center">
              <h3 className="font-bold text-gray-700 mb-2">Final Legal Clause</h3>
              <p>All services are governed by company policy. Disputes fall under the jurisdiction of the company’s office. Making a payment implies acceptance of all these terms and conditions.</p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}