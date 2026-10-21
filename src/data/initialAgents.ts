import { PollingUnitAgentLink } from '../types';

export const INITIAL_AGENTS: PollingUnitAgentLink[] = [
  {
    id: 'ag-1',
    token: 'yabo-central-001',
    uniqueToken: 'yabo-central-001',
    password: 'YABO001',
    agentName: 'Aliyu Dan-Yabo',
    localGovernment: 'Yabo',
    ward: 'Yabo Central Ward',
    wardName: 'Yabo Central Ward',
    pollingUnitName: 'Town Hall Polling Unit 001',
    pollingUnitCode: '01/05/02/001',
    phone: '+234 803 456 7890',
    status: 'SUBMITTED',
    isUsed: true,
    createdAt: '2026-10-18 08:00'
  },
  {
    id: 'ag-2',
    token: 'yabo-central-002',
    uniqueToken: 'yabo-central-002',
    password: 'YABO002',
    agentName: 'Sani Shehu',
    localGovernment: 'Yabo',
    ward: 'Yabo Central Ward',
    wardName: 'Yabo Central Ward',
    pollingUnitName: 'Primary School Gate PU 002',
    pollingUnitCode: '01/05/02/002',
    phone: '+234 802 333 4455',
    status: 'SUBMITTED',
    isUsed: true,
    createdAt: '2026-10-18 08:15'
  },
  {
    id: 'ag-3',
    token: 'kuchi-001',
    uniqueToken: 'kuchi-001',
    password: 'KUCHI001',
    agentName: 'Musa Garba Kuchi',
    localGovernment: 'Yabo',
    ward: 'Kuchi Ward',
    wardName: 'Kuchi Ward',
    pollingUnitName: 'Market Square PU 001',
    pollingUnitCode: '01/05/01/001',
    phone: '+234 805 111 2233',
    status: 'SUBMITTED',
    isUsed: true,
    createdAt: '2026-10-18 08:30'
  },
  {
    id: 'ag-4',
    token: 'kilgori-001',
    uniqueToken: 'kilgori-001',
    password: 'KILGORI001',
    agentName: 'Hassan Kilgori',
    localGovernment: 'Yabo',
    ward: 'Kilgori Ward',
    wardName: 'Kilgori Ward',
    pollingUnitName: 'Dispensary PU 003',
    pollingUnitCode: '01/05/03/003',
    phone: '+234 809 888 7766',
    status: 'PENDING',
    isUsed: false,
    createdAt: '2026-10-18 09:00'
  },
  {
    id: 'ag-5',
    token: 'shagari-south-001',
    uniqueToken: 'shagari-south-001',
    password: 'SHAGARI001',
    agentName: 'Garba Shagari',
    localGovernment: 'Shagari',
    ward: 'Shagari South Ward',
    wardName: 'Shagari South Ward',
    pollingUnitName: 'Magajin Gari Open Space',
    pollingUnitCode: '01/06/01/001',
    phone: '+234 803 999 1122',
    status: 'SUBMITTED',
    isUsed: true,
    createdAt: '2026-10-18 08:45'
  }
];

export const MASTER_CAMPAIGN_KEY = 'DANMAJE2026';
