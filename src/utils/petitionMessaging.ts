import { ProgramApplication, PetitionerDecisionMessage } from '../types';

export function generatePetitionerDecisionMessage(
  petition: Partial<ProgramApplication>,
  decision: 'APPROVED' | 'REJECTED' | 'INITIAL REVIEW' | 'SUBMITTED',
  customReason?: string,
  customAction?: string
): PetitionerDecisionMessage {
  const applicantName = petition.applicantName || 'Distinguished Constituent';
  const petitionTitle = petition.programTitle || 'Constituency Community Petition';
  const refCode = petition.referenceNumber || `DAN-PET-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const ward = petition.wardOrTown || 'Yabo/Shagari Federal Constituency';
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  if (decision === 'APPROVED') {
    const actionPlan = customAction || petition.awardGrantPackage || 'Direct executive constituency infrastructure intervention and resource mobilization';
    const reasonText = customReason || 'Following thorough committee deliberation, technical assessment, and field verification in your ward, your community petition has been found highly meritorious, feasible, and directly aligned with our grassroots priority agenda.';

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      petitionId: petition.id || `pet-${Date.now()}`,
      referenceNumber: refCode,
      recipientName: applicantName,
      recipientPhone: petition.phone || '',
      recipientEmail: petition.email,
      wardOrTown: ward,
      category: petition.programCategory || 'Constituency Petition',
      petitionTitle,
      decision: 'APPROVED',
      decisionTitle: 'OFFICIAL RESOLUTION: PETITION UPHELD & APPROVED FOR EXECUTIVE INTERVENTION',
      salutation: `Dear ${applicantName},`,
      executiveSummary: `We are pleased to inform you that your petition regarding "${petitionTitle}" has been formally UPHELD and APPROVED for direct constituency intervention by the Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo).`,
      detailedReason: reasonText,
      committedAction: actionPlan,
      civicEncouragement: `We warmly commend your proactive leadership, civic consciousness, and dedication to grassroots community development. Sustainable progress in Yabo & Shagari Constituency relies on vigilant, caring citizens who bring critical community needs to the legislative desk. We strongly encourage you to continue your constructive participation by liaising with your Ward Development Committee, tracking this project's implementation milestones, and offering ideas in upcoming constituency town halls. Your civic voice has made a tangible difference for our people.`,
      sentAt: `${dateFormatted} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      senderTitle: 'Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo), Member, House of Representatives, Federal Republic of Nigeria',
      channels: {
        smsDelivered: Boolean(petition.phone),
        portalNotified: true,
        emailQueued: Boolean(petition.email)
      },
      smsExcerpt: `HON. UMAR YUSUF (DANMAJE YABO): Dear ${applicantName}, your petition [${refCode}] for "${petitionTitle}" is APPROVED for relief action. Track official letter & milestones on portal. Thank you for your active role in community development!`
    };
  }

  if (decision === 'REJECTED') {
    const reasonText = customReason || 'Following comprehensive review by the Constituency Petitions & Welfare Committee and consultation with ward liaison officers, we regret that this specific petition could not be approved for direct legislative funding or intervention in the current fiscal allocation cycle. This determination is primarily due to budgetary statutory caps and jurisdictional demarcation under local government council oversight.';

    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      petitionId: petition.id || `pet-${Date.now()}`,
      referenceNumber: refCode,
      recipientName: applicantName,
      recipientPhone: petition.phone || '',
      recipientEmail: petition.email,
      wardOrTown: ward,
      category: petition.programCategory || 'Constituency Petition',
      petitionTitle,
      decision: 'REJECTED',
      decisionTitle: 'OFFICIAL RESOLUTION: COMMITTEE REVIEW CONCLUDED & RESPECTFUL CIVIC ADVISORY',
      salutation: `Dear ${applicantName},`,
      executiveSummary: `We extend our sincere appreciation for your community petition regarding "${petitionTitle}". Following rigorous review and technical consultation, this petition review has concluded with an advisory determination and cannot be approved for direct executive intervention at this time.`,
      detailedReason: reasonText,
      committedAction: 'Recorded in National Assembly constituency archive for legislative oversight and future budgetary prioritization.',
      civicEncouragement: `Please accept our deepest respect and gratitude for your civic initiative and public spirit. While this specific request could not be approved under current parameters, your active concern for your neighborhood reflects the highest standard of community responsibility. A decision not to proceed directly does not diminish the merit of your engagement. We strongly encourage your continued, constructive participation in community development: we invite you to participate in our quarterly Yabo/Shagari Town Hall assemblies, join your ward consultative forums, collaborate with neighboring civic leaders, and continue bringing forward positive development proposals. Grassroots democracy is strengthened whenever citizens speak up.`,
      sentAt: `${dateFormatted} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      senderTitle: 'Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo), Member, House of Representatives, Federal Republic of Nigeria',
      channels: {
        smsDelivered: Boolean(petition.phone),
        portalNotified: true,
        emailQueued: Boolean(petition.email)
      },
      smsExcerpt: `HON. UMAR YUSUF (DANMAJE YABO): Dear ${applicantName}, review of petition [${refCode}] for "${petitionTitle}" has concluded with respectful advisory. We deeply value your civic initiative for community development. Track feedback & details on portal.`
    };
  }

  if (decision === 'INITIAL REVIEW') {
    return {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      petitionId: petition.id || `pet-${Date.now()}`,
      referenceNumber: refCode,
      recipientName: applicantName,
      recipientPhone: petition.phone || '',
      recipientEmail: petition.email,
      wardOrTown: ward,
      category: petition.programCategory || 'Constituency Petition',
      petitionTitle,
      decision: 'INITIAL REVIEW',
      decisionTitle: 'OFFICIAL NOTICE: PETITION ASSIGNED FOR CONSTITUENCY INVESTIGATION & FIELD VERIFICATION',
      salutation: `Dear ${applicantName},`,
      executiveSummary: `Thank you for your active civic participation. Your community petition regarding "${petitionTitle}" has advanced to active preliminary investigation.`,
      detailedReason: customReason || 'The Constituency Works & Liaison Committee has assigned your petition to field fact-finding officers to inspect the site and consult local community elders.',
      committedAction: 'Constituency Field Fact-Finding Team Assigned',
      civicEncouragement: `Thank you for your dedication to community development. Your active engagement helps ensure that constituency representation is responsive, accountable, and grounded in real grassroots needs.`,
      sentAt: `${dateFormatted} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      senderTitle: 'Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo), Member, House of Representatives',
      channels: {
        smsDelivered: Boolean(petition.phone),
        portalNotified: true,
        emailQueued: Boolean(petition.email)
      },
      smsExcerpt: `HON. UMAR YUSUF (DANMAJE YABO): Dear ${applicantName}, petition [${refCode}] has been assigned for field investigation. Track real-time progress on the constituency portal.`
    };
  }

  // Default: SUBMITTED
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    petitionId: petition.id || `pet-${Date.now()}`,
    referenceNumber: refCode,
    recipientName: applicantName,
    recipientPhone: petition.phone || '',
    recipientEmail: petition.email,
    wardOrTown: ward,
    category: petition.programCategory || 'Constituency Petition',
    petitionTitle,
    decision: 'SUBMITTED',
    decisionTitle: 'OFFICIAL ACKNOWLEDGMENT: PETITION RECEIVED & DOCKETED',
    salutation: `Dear ${applicantName},`,
    executiveSummary: `Your community petition regarding "${petitionTitle}" has been formally authenticated and registered under docket reference ${refCode}.`,
    detailedReason: 'The submission has been logged into the National Assembly Constituency tracking queue and scheduled for preliminary committee screening.',
    committedAction: 'Awaiting Preliminary Committee Docket Review',
    civicEncouragement: `We applaud your civic responsibility in advocating for community improvements. Constructive community participation is the cornerstone of democratic governance and grassroots empowerment.`,
    sentAt: `${dateFormatted} at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    senderTitle: 'Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo), Member, House of Representatives',
    channels: {
      smsDelivered: Boolean(petition.phone),
      portalNotified: true,
      emailQueued: Boolean(petition.email)
    },
    smsExcerpt: `HON. UMAR YUSUF (DANMAJE YABO): Dear ${applicantName}, your petition [${refCode}] is officially logged. Track live committee updates on the portal.`
  };
}

export function formatFullLetterText(msg: PetitionerDecisionMessage): string {
  return `FEDERAL REPUBLIC OF NIGERIA
NATIONAL ASSEMBLY - HOUSE OF REPRESENTATIVES
Three Arms Zone, P.M.B. 141, Garki, Abuja, FCT
Office of Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)
Member Representing Yabo/Shagari Federal Constituency

Date: ${msg.sentAt}
Reference: ${msg.referenceNumber}
Recipient: ${msg.recipientName} (${msg.wardOrTown})

${msg.decisionTitle}
Regarding: "${msg.petitionTitle}"

${msg.salutation}

${msg.executiveSummary}

COMMITTEE DETERMINATION & REASONING:
${msg.detailedReason}

${msg.committedAction ? `ACTION DIRECTIVE / RELIEF COMMITMENT:\n${msg.committedAction}\n` : ''}
COMMENDATION & CONSTRUCTIVE CIVIC PARTICIPATION:
${msg.civicEncouragement}

Yours in Parliamentary Service and Community Advancement,

Hon. (Dr.) Umar Yusuf Yabo (Dan Majen Yabo)
Member, House of Representatives
National Assembly of the Federal Republic of Nigeria
Chairman & Committee on Constituency Petitions & Grassroots Development`;
}
