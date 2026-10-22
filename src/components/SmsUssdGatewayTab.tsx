import React, { useState, useEffect } from 'react';
import { 
  Radio, Send, PhoneCall, CheckCircle2, MessageSquare, AlertCircle, 
  Users, RefreshCw, Smartphone, Hash, Clock, ShieldCheck, 
  ChevronRight, Copy, Check, Download, Zap, Database
} from 'lucide-react';
import { SmsBroadcastRecord, UssdSessionRecord, ProgramApplication } from '../types';

interface Props {
  applications?: ProgramApplication[];
}

export const SmsUssdGatewayTab: React.FC<Props> = ({ applications = [] }) => {
  // Tab within Gateway: 'sms' | 'ussd' | 'logs'
  const [activeSubTab, setActiveSubTab] = useState<'sms' | 'ussd' | 'logs'>('sms');

  // SMS Broadcast State
  const [senderId, setSenderId] = useState('DANMAJE-FED');
  const [targetGroup, setTargetGroup] = useState('ALL_CONSTITUENTS');
  const [customWard, setCustomWard] = useState('Yabo Central');
  const [smsMessage, setSmsMessage] = useState(
    'Hon. Umar Yusuf (Danmaje Yabo) informs indigenes of Yabo & Shagari that registration for the 2026 Solar Irrigation & Fertilizer Grant is now open. Dial *384*77# to verify your status.'
  );
  const [isSending, setIsSending] = useState(false);
  const [sendSuccessMsg, setSendSuccessMsg] = useState('');

  // Stored SMS Broadcasts
  const [broadcastHistory, setBroadcastHistory] = useState<SmsBroadcastRecord[]>(() => {
    const saved = localStorage.getItem('danmaje_sms_broadcasts');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      {
        id: 'sms-001',
        senderId: 'DANMAJE-FED',
        targetGroup: 'Empowerment Applicants (3,240 Indigenes)',
        recipientsCount: 3240,
        message: 'Important Notice: Physical accreditation for Hon. Umar Yusuf Youth Development Scheme commences Monday at Yabo LG Secretariat. Bring original NIN.',
        timestamp: '2026-10-21 14:30',
        status: 'DELIVERED',
        deliveryRate: '99.2%'
      },
      {
        id: 'sms-002',
        senderId: 'YABO-SHAGARI',
        targetGroup: 'Farmers & Irrigation Groups (8,500 Farmers)',
        recipientsCount: 8500,
        message: 'Dry season water pump distribution starts tomorrow across Shagari riverine wards. Dial *384*77# option 4 for your collection center.',
        timestamp: '2026-10-19 09:15',
        status: 'DELIVERED',
        deliveryRate: '98.6%'
      },
      {
        id: 'sms-003',
        senderId: 'REP-UMAR',
        targetGroup: 'Accredited Election Agents (280 Agents)',
        recipientsCount: 280,
        message: 'Official reminder: Election collation desk is active. Access your assigned link to transmit polling unit Form EC8A results immediately.',
        timestamp: '2026-10-18 16:45',
        status: 'DELIVERED',
        deliveryRate: '100%'
      }
    ];
  });

  // Stored USSD Sessions
  const [ussdSessions, setUssdSessions] = useState<UssdSessionRecord[]>(() => {
    const saved = localStorage.getItem('danmaje_ussd_sessions');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [
      { id: 'ussd-1', phoneNumber: '+234 803 219 4481', serviceCode: '*384*77#', sessionDuration: '48s', menuAccessed: 'Check Status > Ref #DAN-EMP-1001', networkCarrier: 'MTN', timestamp: '3 mins ago', status: 'COMPLETED' },
      { id: 'ussd-2', phoneNumber: '+234 812 770 1932', serviceCode: '*384*77#', sessionDuration: '32s', menuAccessed: 'Track Petition > Ref #DAN-PET-2026-4412', networkCarrier: 'AIRTEL', timestamp: '12 mins ago', status: 'COMPLETED' },
      { id: 'ussd-3', phoneNumber: '+234 705 412 8899', serviceCode: '*384*77#', sessionDuration: '65s', menuAccessed: 'Report Emergency > Borehole Breakdown', networkCarrier: 'GLO', timestamp: '24 mins ago', status: 'COMPLETED' },
      { id: 'ussd-4', phoneNumber: '+234 809 332 1105', serviceCode: '*384*77#', serviceCodeShort: '*384*77#', sessionDuration: '21s', menuAccessed: 'Fertilizer Centers > Shagari Town', networkCarrier: '9MOBILE', timestamp: '45 mins ago', status: 'COMPLETED' }
    ] as any;
  });

  // Target audience counts mapping
  const targetCounts: Record<string, number> = {
    ALL_CONSTITUENTS: 45820,
    EMPOWERMENT_APPLICANTS: 3240,
    ELECTION_AGENTS: 280,
    FARMERS_SUBSIDY: 8500,
    YOUTH_SCHOLARSHIP: 4100,
    WARD_FILTER: 2450
  };

  const currentRecipients = targetCounts[targetGroup] || 45820;
  const smsChars = smsMessage.length;
  const smsPages = Math.ceil(smsChars / 160) || 1;
  const estimatedCost = currentRecipients * smsPages * 4.0; // ₦4.00 per SMS unit

  // Interactive USSD Handset Simulation State
  const [ussdInput, setUssdInput] = useState('*384*77#');
  const [ussdActive, setUssdActive] = useState(false);
  const [ussdStep, setUssdStep] = useState<'IDLE' | 'MAIN' | 'CHECK_EMP' | 'CHECK_EMP_RESULT' | 'CHECK_PET' | 'CHECK_PET_RESULT' | 'REPORT_EMERGENCY' | 'REPORT_CONFIRM' | 'FERTILIZER_CENTRES' | 'OFFICE_CONTACTS' | 'HAUSA_MAIN'>('IDLE');
  const [ussdUserInput, setUssdUserInput] = useState('');
  const [ussdResultData, setUssdResultData] = useState<any>(null);
  const [selectedCarrier, setSelectedCarrier] = useState<'MTN' | 'AIRTEL' | 'GLO' | '9MOBILE'>('MTN');

  const templates = [
    {
      title: 'Empowerment Grant Alert',
      body: 'Office of Hon. Umar Yusuf (Danmaje Yabo): Your constituency empowerment application is being processed. Dial *384*77# on any mobile phone to verify approval.'
    },
    {
      title: 'Free Fertilizer Subsidy',
      body: 'Dry-Season Farming Alert: Hon. Umar Yusuf announces free certified fertilizer & solar water pumps distribution across Yabo & Shagari wards. Check *384*77# for centers.'
    },
    {
      title: 'Town Hall Meeting',
      body: 'Public Accountability Assembly: Hon. Umar Yusuf invites all community leaders, farmers, and youths to the 2026 Constituency Town Hall this Saturday at Yabo Hall.'
    },
    {
      title: 'Election Agent PU Alert',
      body: 'Accredited Polling Unit Agent Reminder: Ensure your phone is fully charged. Transmit Form EC8A results immediately after ballots are counted.'
    },
    {
      title: 'Citizen Grievance Resolution',
      body: 'Community Update: Hon. Umar Yusuf has ordered immediate contractor deployment for the borehole rehabilitation requested by constituents. Progress is underway.'
    }
  ];

  const handleApplyTemplate = (tplBody: string) => {
    setSmsMessage(tplBody);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!smsMessage.trim()) return;

    setIsSending(true);
    setSendSuccessMsg('');

    setTimeout(() => {
      const newRecord: SmsBroadcastRecord = {
        id: `sms-${Date.now()}`,
        senderId,
        targetGroup: `${targetGroup.replace(/_/g, ' ')} (${currentRecipients.toLocaleString()} Recipients)`,
        recipientsCount: currentRecipients,
        message: smsMessage.trim(),
        timestamp: new Date().toLocaleString(),
        status: 'DELIVERED',
        deliveryRate: '99.4%'
      };

      const updated = [newRecord, ...broadcastHistory];
      setBroadcastHistory(updated);
      try {
        localStorage.setItem('danmaje_sms_broadcasts', JSON.stringify(updated));
      } catch {}

      setIsSending(false);
      setSendSuccessMsg(`Successfully dispatched broadcast to ${currentRecipients.toLocaleString()} constituents across Yabo and Shagari via NCC telecommunications gateway.`);
      setTimeout(() => setSendSuccessMsg(''), 6000);
    }, 1200);
  };

  // USSD Interactive Navigation Engine
  const handleDialUSSD = () => {
    if (ussdInput.trim() === '*384*77#' || ussdInput.trim() === '*384*YABO#' || ussdInput.trim().startsWith('*384')) {
      setUssdActive(true);
      setUssdStep('MAIN');
      setUssdUserInput('');
      setUssdResultData(null);

      // Log session
      logUssdSession('Dialed *384*77# Main Menu');
    } else {
      alert('Invalid service code. Dial *384*77# for Hon. Umar Yusuf Constituency Gateway.');
    }
  };

  const logUssdSession = (menu: string) => {
    const newSession: UssdSessionRecord = {
      id: `ussd-${Date.now()}`,
      phoneNumber: '+234 803 ' + Math.floor(100 + Math.random() * 900) + ' ' + Math.floor(1000 + Math.random() * 9000),
      serviceCode: '*384*77#',
      sessionDuration: `${Math.floor(15 + Math.random() * 45)}s`,
      menuAccessed: menu,
      networkCarrier: selectedCarrier,
      timestamp: 'Just now',
      status: 'COMPLETED'
    };
    const updated = [newSession, ...ussdSessions.slice(0, 19)];
    setUssdSessions(updated);
    try {
      localStorage.setItem('danmaje_ussd_sessions', JSON.stringify(updated));
    } catch {}
  };

  const handleUSSDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = ussdUserInput.trim();

    if (ussdStep === 'MAIN') {
      if (input === '1') {
        setUssdStep('CHECK_EMP');
        setUssdUserInput('');
        logUssdSession('Selected 1. Check Empowerment Status');
      } else if (input === '2') {
        setUssdStep('CHECK_PET');
        setUssdUserInput('');
        logUssdSession('Selected 2. Track Petition / Grievance');
      } else if (input === '3') {
        setUssdStep('REPORT_EMERGENCY');
        setUssdUserInput('');
        logUssdSession('Selected 3. Report Emergency');
      } else if (input === '4') {
        setUssdStep('FERTILIZER_CENTRES');
        setUssdUserInput('');
        logUssdSession('Selected 4. View Fertilizer Centers');
      } else if (input === '5') {
        setUssdStep('OFFICE_CONTACTS');
        setUssdUserInput('');
        logUssdSession('Selected 5. Constituency Office Contacts');
      } else if (input === '6') {
        setUssdStep('HAUSA_MAIN');
        setUssdUserInput('');
        logUssdSession('Selected 6. Hausa Language Gateway');
      } else {
        alert('Invalid selection. Enter 1-6.');
      }
    } else if (ussdStep === 'CHECK_EMP') {
      // Look up application in localStorage or mock
      let foundApp: any = null;
      try {
        const savedApps: ProgramApplication[] = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
        foundApp = savedApps.find(a => 
          a.referenceNumber.toLowerCase().includes(input.toLowerCase()) || 
          (a.phone && a.phone.includes(input)) ||
          (a.nin && a.nin.includes(input))
        );
      } catch {}

      if (!foundApp) {
        foundApp = {
          referenceNumber: input.toUpperCase() || 'DAN-EMP-1001',
          applicantName: 'Malam Aliyu Dan-Yabo',
          programTitle: 'Youth Irrigation & Agricultural Support Scheme',
          status: 'APPROVED',
          awardGrantPackage: '1x Solar Pumping Kit + ₦150,000 Direct Seed Capital',
          lga: 'Yabo LGA'
        };
      }
      setUssdResultData(foundApp);
      setUssdStep('CHECK_EMP_RESULT');
      setUssdUserInput('');
      logUssdSession(`Lookup App: ${input} (Status: ${foundApp.status})`);
    } else if (ussdStep === 'CHECK_PET') {
      let foundTicket: any = null;
      try {
        const savedApps: ProgramApplication[] = JSON.parse(localStorage.getItem('danmaje_applications') || '[]');
        foundTicket = savedApps.find(a => 
          a.referenceNumber.toLowerCase().includes(input.toLowerCase()) ||
          a.programTitle.toLowerCase().includes('petition')
        );
      } catch {}

      if (!foundTicket) {
        foundTicket = {
          referenceNumber: input.toUpperCase() || 'DAN-PET-2026-4412',
          programTitle: 'Borehole Breakdown & Clean Water Petition',
          status: 'UNDER_REVIEW',
          notes: 'Engineering inspection team dispatched to Yabo Central Ward.'
        };
      }
      setUssdResultData(foundTicket);
      setUssdStep('CHECK_PET_RESULT');
      setUssdUserInput('');
      logUssdSession(`Lookup Petition: ${input}`);
    } else if (ussdStep === 'REPORT_EMERGENCY') {
      // Save emergency report
      const emergencyType = input === '1' ? 'Water Supply / Borehole Failure' : input === '2' ? 'Road / Culvert Washout' : 'Healthcare Clinic Emergency';
      setUssdResultData({ type: emergencyType, ref: `EMG-${Math.floor(1000 + Math.random() * 9000)}` });
      setUssdStep('REPORT_CONFIRM');
      setUssdUserInput('');
      logUssdSession(`Logged Emergency: ${emergencyType}`);
    } else if (ussdStep === 'CHECK_EMP_RESULT' || ussdStep === 'CHECK_PET_RESULT' || ussdStep === 'FERTILIZER_CENTRES' || ussdStep === 'OFFICE_CONTACTS' || ussdStep === 'REPORT_CONFIRM' || ussdStep === 'HAUSA_MAIN') {
      if (input === '0' || input === '9') {
        setUssdStep('MAIN');
        setUssdUserInput('');
      } else {
        setUssdActive(false);
        setUssdStep('IDLE');
      }
    }
  };

  const handleResetUSSD = () => {
    setUssdActive(false);
    setUssdStep('IDLE');
    setUssdInput('*384*77#');
    setUssdUserInput('');
    setUssdResultData(null);
  };

  const handleKeypadPress = (char: string) => {
    if (!ussdActive) {
      setUssdInput(prev => prev + char);
    } else {
      setUssdUserInput(prev => prev + char);
    }
  };

  const handleKeypadDelete = () => {
    if (!ussdActive) {
      setUssdInput(prev => prev.slice(0, -1));
    } else {
      setUssdUserInput(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="w-full min-w-0 space-y-6 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Manrope'] font-black text-2xl text-[#103C2E] uppercase">
              13. AUTOMATED SMS & USSD CONSTITUENCY GATEWAY
            </h3>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border border-amber-300">
              OFFLINE / RURAL INCLUSION
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Empower rural farmers, artisans, and youths across Yabo & Shagari who lack internet access to receive SMS alerts and check schemes via offline USSD code <strong className="text-[#103C2E] font-mono">*384*77#</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-stone-200/70 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveSubTab('sms')}
              className={`px-3 py-1.5 rounded-lg transition uppercase flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'sms' ? 'bg-[#103C2E] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Send className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>SMS Dispatcher</span>
            </button>
            <button
              onClick={() => setActiveSubTab('ussd')}
              className={`px-3 py-1.5 rounded-lg transition uppercase flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'ussd' ? 'bg-[#103C2E] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>USSD Simulator (*384*77#)</span>
            </button>
            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-3 py-1.5 rounded-lg transition uppercase flex items-center gap-1.5 cursor-pointer ${
                activeSubTab === 'logs' ? 'bg-[#103C2E] text-white shadow-xs' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-[#C6A15B]" />
              <span>Gateway Logs</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase">Registered GSM Numbers</span>
          <strong className="text-2xl font-black text-[#103C2E] block">45,820</strong>
          <span className="text-[10px] text-emerald-600 font-bold">Yabo & Shagari Constituency</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase">USSD Service Code</span>
          <strong className="text-2xl font-black text-[#C6A15B] font-mono block">*384*77#</strong>
          <span className="text-[10px] text-stone-500 font-medium">Toll-Free • Zero Data Required</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase">Avg SMS Delivery Rate</span>
          <strong className="text-2xl font-black text-emerald-700 block">99.3%</strong>
          <span className="text-[10px] text-emerald-700 font-bold">MTN, Airtel, Glo, 9mobile</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase">Active USSD Sessions (24h)</span>
          <strong className="text-2xl font-black text-[#103C2E] block">1,842</strong>
          <span className="text-[10px] text-stone-500 font-medium">Status & Emergency Checks</span>
        </div>
      </div>

      {/* SUB-TAB 1: SMS BROADCAST DISPATCHER */}
      {activeSubTab === 'sms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Form: Broadcast Configuration */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h4 className="font-bold text-[#103C2E] text-base uppercase flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#C6A15B]" />
                <span>Mass Constituency SMS Broadcast Dispatcher</span>
              </h4>
              <span className="text-[10px] font-mono bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200 font-bold">
                TELCO GATEWAY ONLINE
              </span>
            </div>

            {sendSuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-2xl text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">Broadcast Dispatch Confirmed</strong>
                  <span>{sendSuccessMsg}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E] uppercase">Sender ID (Alpha-Numeric)</label>
                  <select
                    value={senderId}
                    onChange={(e) => setSenderId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-[#103C2E] focus:outline-none"
                  >
                    <option value="DANMAJE-FED">DANMAJE-FED (Official National Assembly)</option>
                    <option value="YABO-SHAGARI">YABO-SHAGARI (Constituency Office)</option>
                    <option value="REP-UMAR">REP-UMAR (Direct Parliamentary Office)</option>
                    <option value="ELECTION-DESK">ELECTION-DESK (Situation Room)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#103C2E] uppercase">Target Audience Group</label>
                  <select
                    value={targetGroup}
                    onChange={(e) => setTargetGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-[#103C2E] focus:outline-none"
                  >
                    <option value="ALL_CONSTITUENTS">All Constituents in Yabo & Shagari (45,820)</option>
                    <option value="EMPOWERMENT_APPLICANTS">Empowerment Scheme Applicants (3,240)</option>
                    <option value="ELECTION_AGENTS">Accredited Polling Unit Agents (280)</option>
                    <option value="FARMERS_SUBSIDY">Registered Irrigation Farmers (8,500)</option>
                    <option value="YOUTH_SCHOLARSHIP">Youths & Scholarship Candidates (4,100)</option>
                    <option value="WARD_FILTER">Filter by Specific Ward (approx. 2,450)</option>
                  </select>
                </div>
              </div>

              {targetGroup === 'WARD_FILTER' && (
                <div className="space-y-1 bg-stone-50 p-3 rounded-xl border border-stone-200">
                  <label className="text-xs font-bold text-[#103C2E] uppercase">Select Specific Ward for SMS</label>
                  <select
                    value={customWard}
                    onChange={(e) => setCustomWard(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-lg text-xs"
                  >
                    <option value="Yabo Central">Yabo Central Ward</option>
                    <option value="Bakale">Bakale Ward</option>
                    <option value="Torankawa">Torankawa Ward</option>
                    <option value="Sanyinna">Sanyinna Ward</option>
                    <option value="Shagari Town">Shagari Town Ward</option>
                    <option value="Dandin Mahe">Dandin Mahe Ward</option>
                    <option value="Kambama">Kambama Ward</option>
                  </select>
                </div>
              )}

              {/* Quick Template Buttons */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-600 uppercase flex items-center justify-between">
                  <span>Quick Message Templates (Click to Load):</span>
                  <span className="text-[10px] text-stone-400">Pre-approved by Parliamentary Media</span>
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {templates.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleApplyTemplate(tpl.body)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-stone-200 transition cursor-pointer"
                    >
                      {tpl.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* SMS Textarea & Live Counters */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-[#103C2E] uppercase">Broadcast Message Body *</label>
                  <span className="text-[11px] font-mono text-stone-500">
                    {smsChars} chars | <strong className="text-[#103C2E]">{smsPages} SMS Page(s)</strong>
                  </span>
                </div>
                <textarea
                  rows={4}
                  required
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type broadcast text message here..."
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#103C2E] resize-none leading-relaxed font-sans"
                ></textarea>
              </div>

              {/* Cost & Dispatch Estimation Card */}
              <div className="bg-[#FAF9F5] p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Estimated Cost (₦4.00/SMS)</span>
                  <strong className="text-lg font-black text-[#103C2E]">
                    ₦{estimatedCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Total Recipients</span>
                  <strong className="text-lg font-black text-emerald-800">
                    {currentRecipients.toLocaleString()} Citizens
                  </strong>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Telco Delivery Speed</span>
                  <strong className="text-sm font-bold text-stone-700">~15,000 SMS / min</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full bg-[#103C2E] hover:bg-[#09291F] disabled:opacity-60 text-white py-4 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C6A15B]" />
                    <span>DISPATCHING BROADCAST TO CELLULAR TOWERS...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-[#C6A15B]" />
                    <span>DISPATCH MASS SMS TO {currentRecipients.toLocaleString()} CITIZENS</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: GSM Feature Phone Preview */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-[#103C2E]" />
              <span>Realistic Constituent Handset Preview</span>
            </span>

            {/* Retro Feature Phone Frame */}
            <div className="w-72 bg-stone-900 p-5 rounded-[40px] shadow-2xl border-4 border-stone-800 text-stone-800 space-y-4">
              
              {/* Speaker Ear Slot */}
              <div className="w-16 h-1.5 bg-stone-700 rounded-full mx-auto"></div>

              {/* LCD Screen Frame */}
              <div className="bg-[#9EA786] p-4 rounded-2xl border-2 border-stone-950 font-mono text-[11px] space-y-2 text-[#102410] shadow-inner min-h-[220px] flex flex-col justify-between">
                {/* Status Bar */}
                <div className="flex justify-between items-center text-[9px] border-b border-[#7A8366] pb-1 font-bold">
                  <span>MTN-NG 📶</span>
                  <span>14:30 🔋</span>
                </div>

                {/* SMS Message Display */}
                <div className="space-y-1 my-auto">
                  <div className="text-[10px] font-bold text-stone-900 border-b border-stone-700/30 pb-0.5">
                    From: {senderId}
                  </div>
                  <p className="text-[11px] leading-tight break-words font-medium">
                    {smsMessage || 'Waiting for message input...'}
                  </p>
                </div>

                {/* LCD Footer */}
                <div className="flex justify-between text-[9px] pt-1 border-t border-[#7A8366] font-bold">
                  <span>Options</span>
                  <span>Reply</span>
                </div>
              </div>

              {/* Keypad Buttons */}
              <div className="grid grid-cols-3 gap-2 px-2 pt-2 text-stone-300 font-mono text-center text-xs">
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">1</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">2</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">3</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">4</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">5</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">6</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">7</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">8</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">9</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-[#D4AF37] border border-stone-700 shadow-xs">*</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs">0</div>
                <div className="bg-stone-800 py-2 rounded-lg font-bold text-[#D4AF37] border border-stone-700 shadow-xs">#</div>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 text-center max-w-xs">
              Preview shows how text appears on standard 2G feature phones (Nokia/Tecno) commonly used by rural constituents in Yabo and Shagari.
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: USSD SIMULATOR (*384*77#) */}
      {activeSubTab === 'ussd' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive USSD Phone Console */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            
            <div className="w-full flex items-center justify-between border-b border-stone-100 pb-3">
              <span className="text-xs font-bold text-[#103C2E] uppercase flex items-center gap-2">
                <Hash className="w-4 h-4 text-[#C6A15B]" />
                <span>Interactive USSD Handset Simulator</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-stone-400 font-bold">Telco:</span>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value as any)}
                  className="bg-stone-100 border border-stone-300 text-[10px] font-bold rounded-lg px-2 py-1 text-[#103C2E]"
                >
                  <option value="MTN">MTN NG</option>
                  <option value="AIRTEL">AIRTEL</option>
                  <option value="GLO">GLO</option>
                  <option value="9MOBILE">9MOBILE</option>
                </select>
              </div>
            </div>

            {/* Handset Frame */}
            <div className="w-80 bg-stone-900 p-6 rounded-[44px] shadow-2xl border-4 border-stone-800 text-stone-200 space-y-4">
              
              {/* Speaker Slot */}
              <div className="w-16 h-1.5 bg-stone-700 rounded-full mx-auto"></div>

              {/* LCD Display */}
              <div className="bg-[#122A1E] text-emerald-300 p-4 rounded-2xl border-2 border-stone-950 font-mono text-xs shadow-inner min-h-[260px] flex flex-col justify-between">
                
                {/* Carrier & Time */}
                <div className="flex justify-between items-center text-[9px] text-emerald-400/80 border-b border-emerald-900/60 pb-1">
                  <span>{selectedCarrier} 4G</span>
                  <span>USSD ACTIVE</span>
                </div>

                {/* USSD Prompt Content */}
                <div className="my-auto py-2 space-y-2">
                  {!ussdActive ? (
                    <div className="text-center space-y-3 py-6">
                      <p className="text-emerald-400 text-xs font-bold">Ready to Dial</p>
                      <p className="text-[11px] text-emerald-200/80">
                        Dial <strong className="text-white bg-emerald-900/80 px-2 py-0.5 rounded">*384*77#</strong> to enter the Constituency Citizen Gateway.
                      </p>
                    </div>
                  ) : ussdStep === 'MAIN' ? (
                    <div className="space-y-1.5 text-[11px] leading-tight text-white">
                      <p className="font-bold text-[#D4AF37] border-b border-emerald-800 pb-1">
                        HON. UMAR YUSUF GATEWAY:
                      </p>
                      <p>1. Check Empowerment Status</p>
                      <p>2. Track Petition / Grievance</p>
                      <p>3. Report Emergency (Water/Road)</p>
                      <p>4. Fertilizer & Pump Centers</p>
                      <p>5. Constituency Contacts</p>
                      <p>6. Canza zuwa Hausa</p>
                    </div>
                  ) : ussdStep === 'CHECK_EMP' ? (
                    <div className="space-y-1.5 text-[11px] text-white">
                      <p className="font-bold text-[#D4AF37]">ENTER APPLICATION CODE:</p>
                      <p className="text-[10px] text-emerald-200">Enter Ref (e.g. DAN-EMP-1001) or phone number:</p>
                    </div>
                  ) : ussdStep === 'CHECK_EMP_RESULT' ? (
                    <div className="space-y-1.5 text-[11px] text-white">
                      <p className="font-bold text-[#D4AF37]">APPLICATION FOUND:</p>
                      <p className="text-emerald-300 font-bold">{ussdResultData?.applicantName || 'Citizen'}</p>
                      <p className="text-[10px]">Ref: {ussdResultData?.referenceNumber}</p>
                      <p className="text-[10px] text-amber-300 font-bold">Status: {ussdResultData?.status}</p>
                      <p className="text-[9px] text-stone-200">{ussdResultData?.awardGrantPackage || 'Verified Applicant'}</p>
                      <p className="text-[10px] pt-1 text-emerald-400">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : ussdStep === 'CHECK_PET' ? (
                    <div className="space-y-1.5 text-[11px] text-white">
                      <p className="font-bold text-[#D4AF37]">TRACK PETITION TICKET:</p>
                      <p className="text-[10px] text-emerald-200">Enter Petition Ref (e.g. DAN-PET-2026-4412):</p>
                    </div>
                  ) : ussdStep === 'CHECK_PET_RESULT' ? (
                    <div className="space-y-1.5 text-[11px] text-white">
                      <p className="font-bold text-[#D4AF37]">PETITION STATUS:</p>
                      <p className="text-[10px]">{ussdResultData?.referenceNumber}</p>
                      <p className="text-[10px] font-bold text-amber-300">Status: {ussdResultData?.status}</p>
                      <p className="text-[9px] text-stone-200">{ussdResultData?.notes || 'In review by legislative committee'}</p>
                      <p className="text-[10px] pt-1 text-emerald-400">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : ussdStep === 'REPORT_EMERGENCY' ? (
                    <div className="space-y-1 text-[11px] text-white">
                      <p className="font-bold text-[#D4AF37]">REPORT COMMUNITY ISSUE:</p>
                      <p>1. Borehole / Clean Water Failure</p>
                      <p>2. Road / Bridge Washout</p>
                      <p>3. Rural Health Clinic Alert</p>
                    </div>
                  ) : ussdStep === 'REPORT_CONFIRM' ? (
                    <div className="space-y-1.5 text-[11px] text-white">
                      <p className="font-bold text-emerald-400">REPORT LOGGED ✓</p>
                      <p className="text-[10px]">Tracking Code: {ussdResultData?.ref}</p>
                      <p className="text-[9px] text-stone-200">Dispatched to Constituency Engineers.</p>
                      <p className="text-[10px] pt-1 text-emerald-400">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : ussdStep === 'FERTILIZER_CENTRES' ? (
                    <div className="space-y-1 text-[10px] text-white leading-tight">
                      <p className="font-bold text-[#D4AF37]">DISTRIBUTION CENTERS:</p>
                      <p>• Yabo LG Agric Dept (Main Depot)</p>
                      <p>• Shagari River Basin Facility</p>
                      <p>• Sanyinna Primary Co-op</p>
                      <p className="text-emerald-400 pt-1">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : ussdStep === 'OFFICE_CONTACTS' ? (
                    <div className="space-y-1 text-[10px] text-white">
                      <p className="font-bold text-[#D4AF37]">CONSTITUENCY DESK:</p>
                      <p>Phone: 0803 123 4567</p>
                      <p>Yabo Office: Danmaje House</p>
                      <p>Abuja: National Assembly Complex</p>
                      <p className="text-emerald-400 pt-1">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : ussdStep === 'HAUSA_MAIN' ? (
                    <div className="space-y-1 text-[10px] text-white leading-tight">
                      <p className="font-bold text-[#D4AF37]">BABBAR MAFITA (HAUSA):</p>
                      <p>1. Duba Tallafi (Empowerment)</p>
                      <p>2. Shigar da Korafe-Korafe</p>
                      <p>3. Cibiyoyin Taki & Injin Noma</p>
                      <p className="text-emerald-400 pt-1">0. Main Menu | 9. Exit</p>
                    </div>
                  ) : null}
                </div>

                {/* Input or Dial bar inside LCD */}
                <div className="pt-2 border-t border-emerald-900/60">
                  {!ussdActive ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={ussdInput}
                        onChange={(e) => setUssdInput(e.target.value)}
                        className="w-full px-2 py-1 bg-black/40 border border-emerald-800 text-emerald-300 font-mono text-xs rounded text-center"
                      />
                      <button
                        onClick={handleDialUSSD}
                        className="bg-emerald-600 hover:bg-emerald-500 text-black px-3 py-1 rounded text-xs font-bold uppercase cursor-pointer"
                      >
                        Dial
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleUSSDSubmit} className="flex gap-1.5">
                      <input
                        type="text"
                        autoFocus
                        placeholder="Reply..."
                        value={ussdUserInput}
                        onChange={(e) => setUssdUserInput(e.target.value)}
                        className="w-full px-2 py-1 bg-black/40 border border-emerald-800 text-emerald-300 font-mono text-xs rounded text-center focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-[#D4AF37] hover:bg-amber-400 text-black px-2.5 py-1 rounded text-xs font-bold uppercase cursor-pointer"
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Interactive Keypad Buttons */}
              <div className="grid grid-cols-3 gap-1.5 px-2 text-stone-300 font-mono text-center text-xs">
                {['1','2','3','4','5','6','7','8','9','*','0','#'].map((char) => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => handleKeypadPress(char)}
                    className="bg-stone-800 hover:bg-stone-700 active:bg-stone-600 py-1.5 rounded-lg font-bold text-stone-200 border border-stone-700 shadow-xs cursor-pointer transition"
                  >
                    {char}
                  </button>
                ))}
              </div>

              {/* Handset Controls */}
              <div className="flex justify-between items-center px-4 pt-1">
                <button
                  type="button"
                  onClick={handleKeypadDelete}
                  className="text-[11px] font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
                >
                  Clear / ⌫
                </button>
                <button
                  type="button"
                  onClick={handleResetUSSD}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 cursor-pointer"
                >
                  End (Red)
                </button>
                <button
                  type="button"
                  onClick={handleDialUSSD}
                  className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer"
                >
                  Dial (Green)
                </button>
              </div>

              {/* Quick Testing Shortcuts */}
              <div className="pt-2 border-t border-stone-800 flex flex-wrap items-center justify-center gap-1.5">
                <button
                  type="button"
                  onClick={() => { setUssdInput('*384*77#'); handleDialUSSD(); }}
                  className="bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-lg border border-emerald-700/50 cursor-pointer"
                >
                  Dial *384*77#
                </button>
                <button
                  type="button"
                  onClick={() => { if (ussdActive) { setUssdUserInput('1'); } else { setUssdInput('*384*77#'); handleDialUSSD(); setTimeout(() => setUssdUserInput('1'), 100); }}}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-700 cursor-pointer"
                >
                  Opt 1: Status
                </button>
                <button
                  type="button"
                  onClick={() => { if (ussdActive) { setUssdUserInput('2'); } else { setUssdInput('*384*77#'); handleDialUSSD(); setTimeout(() => setUssdUserInput('2'), 100); }}}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-700 cursor-pointer"
                >
                  Opt 2: Petition
                </button>
                <button
                  type="button"
                  onClick={() => { if (ussdActive) { setUssdUserInput('3'); } else { setUssdInput('*384*77#'); handleDialUSSD(); setTimeout(() => setUssdUserInput('3'), 100); }}}
                  className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-stone-700 cursor-pointer"
                >
                  Opt 3: Emergency
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Explainer and Real Use-Cases */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-6">
            <h4 className="font-bold text-[#103C2E] text-base uppercase flex items-center gap-2 border-b border-stone-100 pb-3">
              <Zap className="w-5 h-5 text-[#C6A15B]" />
              <span>Why USSD is Vital for Yabo & Shagari Constituency</span>
            </h4>

            <div className="space-y-4 text-xs text-stone-600 leading-relaxed">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1">
                <strong className="text-[#103C2E] font-bold text-sm block">1. Universal Rural Smartphone Penetration</strong>
                <p>
                  Over 65% of farmers and elder citizens in rural wards like Torankawa, Bakale, and Kambama utilize basic GSM feature phones without data subscriptions. USSD functions on 2G GSM cellular networks without data, airtime, or Wi-Fi.
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <strong className="text-stone-800 font-bold text-sm block">2. Real-Time Empowerment Status Lookup</strong>
                <p>
                  When indigenes apply for Hon. Umar Yusuf schemes (Scholarships, Irrigation kits, Grants), they receive a code. Instead of traveling 40km to the LG Secretariat, they dial <strong>*384*77#</strong> to immediately see if their package is ready for pickup.
                </p>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <strong className="text-amber-900 font-bold text-sm block">3. Offline Grievance & Community Fault Reporting</strong>
                <p>
                  Constituents can log water borehole faults or feeder road damages straight into the National Assembly situation room ledger without internet access.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="bg-[#103C2E] text-white p-4 rounded-2xl text-xs space-y-2">
                <span className="text-[#D4AF37] font-bold uppercase block text-[10px]">
                  TELECOMMUNICATIONS CARRIER ROUTING:
                </span>
                <p className="text-stone-200">
                  Shortcode <strong>*384*77#</strong> is interconnected with Nigerian Communications Commission (NCC) VAS aggregators. Sessions terminate on the Danmaje Constituency database in milliseconds.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: LOGS & HISTORY */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          
          {/* SMS History Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden space-y-3 p-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h4 className="font-bold text-[#103C2E] text-base uppercase">Mass SMS Broadcast Dispatch Ledger</h4>
              <span className="text-xs text-stone-500 font-mono">{broadcastHistory.length} Total Campaigns</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Sender ID</th>
                    <th className="p-3">Target Audience</th>
                    <th className="p-3 text-center">Recipients</th>
                    <th className="p-3">Message Snippet</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-center">Delivery Rate</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {broadcastHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-[#103C2E]">{rec.senderId}</td>
                      <td className="p-3 font-semibold text-stone-800">{rec.targetGroup}</td>
                      <td className="p-3 text-center font-bold text-stone-700">{rec.recipientsCount.toLocaleString()}</td>
                      <td className="p-3 text-stone-600 max-w-xs truncate" title={rec.message}>{rec.message}</td>
                      <td className="p-3 font-mono text-[11px] text-stone-500">{rec.timestamp}</td>
                      <td className="p-3 text-center font-bold text-emerald-700">{rec.deliveryRate}</td>
                      <td className="p-3 text-right">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800">
                          {rec.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* USSD Sessions Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden space-y-3 p-6">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h4 className="font-bold text-[#103C2E] text-base uppercase">Real-Time USSD (*384*77#) Session Ledger</h4>
              <span className="text-xs text-stone-500 font-mono">Live Telco Logs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase font-bold border-b border-stone-200">
                  <tr>
                    <th className="p-3">Session ID</th>
                    <th className="p-3">Constituent Phone</th>
                    <th className="p-3">Carrier</th>
                    <th className="p-3">Service Code</th>
                    <th className="p-3">Menu Path Accessed</th>
                    <th className="p-3 text-center">Duration</th>
                    <th className="p-3">Timestamp</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {ussdSessions.map((sess) => (
                    <tr key={sess.id} className="hover:bg-stone-50">
                      <td className="p-3 font-mono font-bold text-stone-500">{sess.id}</td>
                      <td className="p-3 font-mono font-bold text-[#103C2E]">{sess.phoneNumber}</td>
                      <td className="p-3">
                        <span className="font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-800 text-[10px]">
                          {sess.networkCarrier}
                        </span>
                      </td>
                      <td className="p-3 font-mono font-bold text-[#C6A15B]">{sess.serviceCode}</td>
                      <td className="p-3 text-stone-700 font-medium">{sess.menuAccessed}</td>
                      <td className="p-3 text-center font-mono text-stone-600">{sess.sessionDuration}</td>
                      <td className="p-3 font-mono text-[11px] text-stone-500">{sess.timestamp}</td>
                      <td className="p-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {sess.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
