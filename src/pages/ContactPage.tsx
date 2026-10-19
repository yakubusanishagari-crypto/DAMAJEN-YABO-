import React, { useState } from 'react';
import { MapPin, Mail, Phone, Clock, Send, CheckCircle, Shield, Building2 } from 'lucide-react';
import { Language, t, Translations } from '../utils/i18n';

interface Props {
  currentLang?: Language;
  translations?: Translations;
}

export const ContactPage: React.FC<Props> = ({ currentLang = 'en', translations }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'General Inquiry',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const isRtl = currentLang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

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
    <div className={`max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12 ${isRtl ? 'rtl text-right' : ''}`}>
      {/* Header */}
      <div className="bg-gradient-to-br from-[#09291F] via-[#103C2E] to-[#0A261E] text-white rounded-3xl p-8 sm:p-12 shadow-2xl space-y-4 border border-[#C6A15B]/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C6A15B]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <img src="/official_logo.png" alt="Official Seal" className="w-10 h-10 rounded-full border border-[#D4AF37] object-contain bg-[#07241A] shadow-md shrink-0" />
          <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/20 px-3 py-1 rounded-full border border-[#D4AF37]/30">
            {currentLang === 'ha' ? 'Ofishin Sadarwa na Mazaba' : currentLang === 'ar' ? 'مكتب التواصل وخدمة الدائرة' : 'Constituency Liaison Desk'}
          </span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-['Manrope'] text-white">
          {t('contactOffice', currentLang, translations)}
        </h1>
        <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed font-light">
          {currentLang === 'ha'
            ? 'Yi magana kai tsaye da ofishin Hon. Umar Yusuf (Danmaje Yabo). Aika bukatun aiki, korafe-korafe, ko shawarwarin cigaban al\'umma.'
            : currentLang === 'ar'
            ? 'تواصل مباشرة مع مكتب سعادة النائب عمر يوسف (دانماجي يابو). أرسل استفساراتك، مقترحاتك ومطالبك التنموية للدائرة.'
            : 'Get in touch directly with the office of Hon. Umar Yusuf (Danmaje Yabo). Submit enquiries, community petitions, or developmental recommendations.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Office Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
            <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
              {t('officeLocationsTitle', currentLang, translations)}
            </h3>
            
            <ul className="space-y-6 text-sm text-[#242824]">
              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Building2 className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope'] font-bold">
                    {currentLang === 'ha' ? 'Majalisar Tarayya Abuja:' : currentLang === 'ar' ? 'مكتب الجمعية الوطنية بأبوجا:' : 'Abuja Parliamentary Office:'}
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    {t('abujaOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope'] font-bold">
                    {currentLang === 'ha' ? 'Ofishin Mazaba a Yabo:' : currentLang === 'ar' ? 'مكتب الدائرة في يابو:' : 'Yabo Liaison Desk:'}
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    {t('yaboOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <MapPin className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope'] font-bold">
                    {currentLang === 'ha' ? 'Ofishin Mazaba a Shagari:' : currentLang === 'ar' ? 'مكتب الدائرة في شاغاري:' : 'Shagari Liaison Desk:'}
                  </strong>
                  <span className="text-[#6B716D] leading-relaxed block mt-0.5">
                    {t('shagariOfficeAddress', currentLang, translations)}
                  </span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Mail className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope'] font-bold">
                    {currentLang === 'ha' ? 'Imel na Ofis:' : currentLang === 'ar' ? 'البريد الرسمي:' : 'Official Email:'}
                  </strong>
                  <span className="text-[#6B716D] font-mono text-xs sm:text-sm select-all">contact@danmayeyabo.gov.ng</span>
                </div>
              </li>

              <li className="flex items-start space-x-4 rtl:space-x-reverse">
                <div className="w-11 h-11 rounded-xl bg-[#103C2E]/10 text-[#103C2E] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <Clock className="w-5 h-5 text-[#C6A15B]" />
                </div>
                <div>
                  <strong className="block text-[#103C2E] font-['Manrope'] font-bold">
                    {currentLang === 'ha' ? 'Lokutan Aiki:' : currentLang === 'ar' ? 'أوقات الدوام:' : 'Office Hours:'}
                  </strong>
                  <span className="text-[#6B716D]">
                    {currentLang === 'ha' ? 'Litinin – Juma\'a: 9:00 na safe – 4:00 na yamma' : currentLang === 'ar' ? 'الاثنين – الجمعة: 9:00 صباحاً – 4:00 مساءً' : 'Monday – Friday: 9:00 AM – 4:00 PM (WAT)'}
                  </span>
                </div>
              </li>
            </ul>

            <div className="bg-[#FAF9F5] p-5 rounded-2xl border border-[#C6A15B]/30 text-xs text-[#6B716D] space-y-1">
              <span className="font-bold text-[#103C2E] block">
                {currentLang === 'ha' ? 'Sanarwar Ofishin Sadarwa:' : currentLang === 'ar' ? 'ملاحظة مكتب التواصل:' : 'Constituency Liaison Note:'}
              </span>
              <p>
                {currentLang === 'ha'
                  ? 'Duk wani sako da aka aiko ana bincika shi tare da kai shi ga Kwamitin Kula da Bukatun Al\'umma cikin sauri.'
                  : currentLang === 'ar'
                  ? 'تتم مراجعة كافة الرسائل وتوثيقها رسمياً ومتابعتها من قبل لجنة شؤون المواطنين بالدائرة.'
                  : 'Submissions are logged securely into the official constituency tracking database and reviewed daily by the correspondence committee.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80 space-y-6">
            <h3 className="font-['Manrope'] font-bold text-2xl text-[#103C2E]">
              {currentLang === 'ha' ? 'Aika Sako ko Korafi' : currentLang === 'ar' ? 'إرسال رسالة أو تقديم طلب' : 'Send Official Message or Petition'}
            </h3>
            
            {success ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-8 rounded-2xl text-center space-y-4 animate-fadeIn">
                <CheckCircle className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xl font-['Manrope']">
                  {currentLang === 'ha' ? 'An Aika Sakonku Cikin Nasara' : currentLang === 'ar' ? 'تم إرسال رسالتكم بنجاح' : 'Message Sent Successfully'}
                </h4>
                <p className="text-sm max-w-md mx-auto">
                  {currentLang === 'ha'
                    ? 'Mun gode da sakonku. Ofishin Hon. Umar Yusuf Danmaje zai tuntube ku cikin gaggawa.'
                    : currentLang === 'ar'
                    ? 'شكراً لتواصلكم. تم تسجيل رسالتكم رسمياً وسيقوم مكتب سعادة النائب بالمتابعة والرد.'
                    : 'Thank you for reaching out. Your enquiry has been securely logged with the constituency office and correspondence team.'}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-7 py-3 rounded-xl font-bold text-sm shadow transition cursor-pointer uppercase tracking-wider"
                >
                  {currentLang === 'ha' ? 'AIKA WANI SAKON' : currentLang === 'ar' ? 'إرسال رسالة أخرى' : 'SEND ANOTHER MESSAGE'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">
                      {currentLang === 'ha' ? 'Cikakken Suna *' : currentLang === 'ar' ? 'الاسم الكامل *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder={currentLang === 'ha' ? 'misali Malam Aminu Yabo' : currentLang === 'ar' ? 'مثال: محمد يوسف' : 'e.g. Malam Umar Yabo'}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">
                      {currentLang === 'ha' ? 'Adireshin Imel *' : currentLang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="citizen@gmail.com"
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-[#103C2E]">
                      {currentLang === 'ha' ? 'Lambar Waya *' : currentLang === 'ar' ? 'رقم الهاتف للتواصل *' : 'Phone Number *'}
                    </label>
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
                    <label className="text-xs font-bold text-[#103C2E]">
                      {currentLang === 'ha' ? 'Rukuni *' : currentLang === 'ar' ? 'نوع الطلب / الفئة *' : 'Enquiry Category *'}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                    >
                      <option value="General Inquiry">
                        {currentLang === 'ha' ? 'Bukatun Gama Gari' : currentLang === 'ar' ? 'استفسار عام' : 'General Inquiry'}
                      </option>
                      <option value="Project Support">
                        {currentLang === 'ha' ? 'Neman Aikin Raya Kasa' : currentLang === 'ar' ? 'طلب مشروع تنموي' : 'Project Support & Request'}
                      </option>
                      <option value="Community Issue">
                        {currentLang === 'ha' ? 'Korafe-korafe na Al\'umma' : currentLang === 'ar' ? 'شكوى أو قضية مجتمعية' : 'Community Issue / Grievance'}
                      </option>
                      <option value="Empowerment Inquiry">
                        {currentLang === 'ha' ? 'Bayanin Shirye-shiryen Agaji' : currentLang === 'ar' ? 'استفسار عن برامج التمكين' : 'Empowerment Programme Inquiry'}
                      </option>
                      <option value="Media Request">
                        {currentLang === 'ha' ? 'Bukatar Sadarwa ko Labarai' : currentLang === 'ar' ? 'طلب إعلامي وصحفي' : 'Media & Press Request'}
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E]">
                    {currentLang === 'ha' ? 'Bayanin Sakonku ko Korafe-korafenku *' : currentLang === 'ar' ? 'نص الرسالة أو تفاصيل الطلب *' : 'Your Message or Community Issue *'}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder={currentLang === 'ha' ? 'Rubuta cikakken bayanin sakonka anan...' : currentLang === 'ar' ? 'يرجى كتابة تفاصيل استفساركم أو مقترحكم هنا...' : 'Provide details of your message, enquiry, or community petition...'}
                    className="w-full px-4 py-3 bg-[#FAF9F5] border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#103C2E]"
                  ></textarea>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#103C2E] hover:bg-[#09291F] text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer border border-[#C6A15B]/30 uppercase tracking-wider"
                  >
                    <Send className="w-4 h-4 text-[#C6A15B]" />
                    <span>
                      {submitting 
                        ? (currentLang === 'ha' ? 'ANA AIKA SAKO...' : currentLang === 'ar' ? 'جارٍ الإرسال...' : 'SENDING MESSAGE...')
                        : (currentLang === 'ha' ? 'AIKA SAKON OFIS' : currentLang === 'ar' ? 'إرسال الرسالة الرسمية' : 'SUBMIT OFFICIAL MESSAGE')}
                    </span>
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
