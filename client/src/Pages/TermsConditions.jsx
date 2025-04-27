import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function TermsConditions() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <button
        onClick={() => navigate(-1)}
        className="fixed top-20 left-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
      >
        <ArrowLeft size={24} />
      </button>
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-gray-100">Last updated: March 2025</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using TicketArc, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Booking and Payment</h2>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>All bookings are final and non-transferable</li>
              <li>Payment must be made at the time of booking</li>
              <li>Refunds are subject to our cancellation policy</li>
              <li>Prices are subject to change without notice</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Cancellation Policy</h2>
            <p className="text-gray-600 mb-4">
              Cancellations can be made:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Up to 24 hours before showtime for a full refund</li>
              <li>Up to 12 hours before showtime for a 50% refund</li>
              <li>No refunds for cancellations less than 12 hours before showtime</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. User Conduct</h2>
            <p className="text-gray-600 mb-4">
              Users agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Use the service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access</li>
              <li>Interfere with the proper working of the service</li>
              <li>Make unauthorized copies of content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Liability</h2>
            <p className="text-gray-600">
              TicketArc is not liable for:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2">
              <li>Technical issues beyond our control</li>
              <li>Changes to movie schedules by theaters</li>
              <li>Personal items left at theaters</li>
              <li>Third-party services or content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Contact Information</h2>
            <p className="text-gray-600">
              For questions about these terms, please contact us at:
            </p>
            <div className="mt-4">
              <p className="text-gray-600">Email: ticketarc@gmail.com</p>
              <p className="text-gray-600">Phone: +91 123456789</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TermsConditions;