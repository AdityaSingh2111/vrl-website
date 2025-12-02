import PageBanner from '../components/PageBanner';
import { FaLock, FaUserSecret, FaCookieBite, FaServer } from 'react-icons/fa';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white pb-20">
      <PageBanner title="Privacy Policy" breadcrumb="Privacy Policy" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg text-gray-600 max-w-none">
          <p className="text-lg leading-relaxed mb-8">
            At VRL Logistics Packers and Movers, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, disclose, and safeguard your data when you visit our website or use our services.
          </p>

          <div className="grid md:grid-cols-2 gap-8 my-12 not-prose">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <FaUserSecret className="text-3xl text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Collection</h3>
              <p className="text-sm text-gray-600">We collect personal details such as name, phone number, email, and address solely for providing our relocation services.</p>
            </div>
            <div className="bg-green-50 p-6 rounded-xl border border-green-100">
              <FaLock className="text-3xl text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Security</h3>
              <p className="text-sm text-gray-600">We implement robust security measures to protect your personal information from unauthorized access or disclosure.</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
              <FaCookieBite className="text-3xl text-yellow-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cookies</h3>
              <p className="text-sm text-gray-600">Our website uses cookies to enhance your browsing experience and analyze site traffic patterns.</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
              <FaServer className="text-3xl text-purple-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Third-Party Disclosure</h3>
              <p className="text-sm text-gray-600">We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties.</p>
            </div>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Information We Collect</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Personal identification information (Name, email address, phone number, etc.)</li>
            <li>Relocation details (Moving from, moving to, list of items, etc.)</li>
            <li>Payment information (Processed securely through our payment gateway partners)</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">How We Use Your Information</h3>
          <p>
            We use the information we collect in the following ways:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>To provide and operate our relocation services</li>
            <li>To improve our website and customer service</li>
            <li>To process your transactions securely</li>
            <li>To send periodic emails or SMS regarding your order or other products and services</li>
          </ul>

          <h3 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Contact Us</h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:admin@vrllogistic.com" className="text-primary hover:underline">admin@vrllogistic.com</a>.
          </p>
        </div>
      </div>
    </div>
  );
}