export enum TransactionStatus {
  SUCCESS = 'success',
  PENDING = 'pending',
  FAILED = 'failed',
  VOID = 'void',
}

export enum PaymentProvider {
  TELEBIRR = 'Telebirr',
  MPESA = 'M-Pesa',
  CBE = 'CBE Birr',
  CHAPA = 'Chapa Link',
  CASH = 'Cash',
}

export enum EmployeeRole {
  CASHIER = 'Cashier',
  SUPERVISOR = 'Supervisor',
  MANAGER = 'Manager',
}

export interface Employee {
  id: string;
  name: string;
  phone: string;
  role: EmployeeRole;
  status: 'active' | 'inactive';
  last_active: string;
}

export interface Transaction {
  id: string;
  tx_ref: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  provider: PaymentProvider;
  created_at: string; // ISO string
  till_name: string;
  customer_phone?: string;
}

export interface Till {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
  daily_total: number;
  employee_name: string;
}

export interface SalesMetric {
  name: string;
  value: number;
}