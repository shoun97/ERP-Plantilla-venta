export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredServices: string[];
  notes: string;
  createdAt: string;
  lastVisit: string | null;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  serviceIds: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  totalAmount: number;
  notes: string;
}

export interface Employee {
  id: string;
  name: string;
  position: string;
  appointmentIds: string[];
}

export interface Transaction {
  id: string;
  appointmentId: string;
  date: string;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'paid' | 'pending' | 'refunded';
}

export interface DashboardStats {
  totalClients: number;
  appointmentsToday: number;
  revenueToday: number;
  appointmentsThisWeek: number;
  revenueThisWeek: number;
  appointmentsThisMonth: number;
  revenueThisMonth: number;
}