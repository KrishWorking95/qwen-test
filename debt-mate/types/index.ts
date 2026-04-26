export interface Contact {
  id: string;
  name: string;
  phone?: string;
  createdAt: string;
}

export interface Record {
  id: string;
  contactId: string;
  contactName: string;
  amount: number;
  paidBack: number;
  reason: string;
  notes?: string;
  lentAt: string;
  paidAt?: string;
  status: 'pending' | 'paid';
}

export interface Payment {
  id: string;
  recordId: string;
  amount: number;
  paidAt: string;
  notes?: string;
}

export type ThemeMode = 'light' | 'dark';

export type TabScreen = 'overview' | 'records' | 'contacts' | 'settings';
