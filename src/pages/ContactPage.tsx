import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, Shield } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');

    const newContactItem = {
      id: `con-${Date.now()}`,
      ...formData,
      date: new Date().toISOString().split('T')[0],
      status: 'Unread'
    };

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
    } catch {
      // Local fallback
    }

    try {
      const savedContacts = JSON.parse(localStorage.getItem('danmaje_contacts') || '[]');
      savedContacts.unshift(newContactItem);
      localStorage.setItem('danmaje_contacts', JSON.stringify(savedContacts));
    } catch {
      // Storage fallback
    }

    setSuccess(true);
    setFormData({ name: '', email: '', phone: '', category: 'General Inquiry', message: '' });
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="bg-[#103C2E] text-white rounded-3xl p-8 sm:p-12 shadow-xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#C6A15B] bg-[#C6A15B]/20 px-3 py-1 rounded-full border border-[#C6A15B]/30">
          Constituency Desk
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope']">
          Contact Constituency Office
        </h1>
        <p className="text-white/90 text-sm sm:text-base max-w-2xl leading-relaxed">
          Get in touch with the office of Hon. Umar Yusuf (Danmaje Yabo). Submit enquiries, community feedback, or project support requests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Office Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 space-y-6">
            <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Official Contact Details</h3>
            
            <ul className="space-y-6 text-sm text-[#242824]">
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope']">Abuja Office:</strong>
                  <span className="text-[#6B716D]">National Assembly Complex, Three Arms Zone, PMB 141, Abuja, FCT, Nigeria.</span>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope']">Official Email:</strong>
                  <span className="text-[#6B716D]">contact@danmayeyabo.gov.ng</span>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5">
                  <Phone className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope']">Telephone Line:</strong>
                  <span className="text-[#6B716D]">+234 (0) 9 810 0000 / +234 803 000 0000</span>
                </div>
              </li>

              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope']">Office Hours:</strong>
                  <span className="text-[#6B716D]">Monday – Friday: 9:00 AM – 4:00 PM (WAT)</span>
                </div>
              </li>
            </ul>

            <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-[#C6A15B]/30 text-xs text-[#6B716D] space-y-1">
              <span className="font-bold text-[#103C2E] block">Constituency Liaison Note:</span>
              <p>Submissions are logged securely and reviewed daily by the constituency correspondence committee.</p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-lg border border-gray-200 space-y-6">
            <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">Send a Message or Report an Issue</h3>
            
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xl font-['Manrope']">Message Sent Successfully</h4>
                <p className="text-sm">Thank you for reaching out. Your enquiry has been securely logged with the constituency office.</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#103C2E] text-white px-6 py-2.5 rounded-xl font-bold text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Malam Umar Yabo"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="umar@gmail.com"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+234 803 000 0000"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">Enquiry Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Project Support">Project Support & Request</option>
                      <option value="Community Issue">Community Issue / Grievance</option>
                      <option value="Empowerment Inquiry">Empowerment Programme Inquiry</option>
                      <option value="Media Request">Media & Press Request</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">Your Message or Community Issue</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Provide details of your message, enquiry, or community issue..."
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4 text-[#C6A15B]" /> {submitting ? 'Sending Message...' : 'Submit Official Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
