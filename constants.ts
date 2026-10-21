import { Transaction, TransactionStatus, PaymentProvider, Till, SalesMetric, Employee, EmployeeRole } from './types';

export const MOCK_TILLS: Till[] = [
  {
    id: 'TILL-001',
    name: 'Main Counter (ዋና)',
    location: 'Bole Branch',
    status: 'active',
    daily_total: 12500,
    employee_name: 'Abebe Bikila',
  },
  {
    id: 'TILL-002',
    name: 'Cafe Window (መስኮት)',
    location: 'Bole Branch',
    status: 'active',
    daily_total: 8450,
    employee_name: 'Derartu Tulu',
  },
  {
    id: 'TILL-003',
    name: 'Retail Section',
    location: 'Piassa Branch',
    status: 'inactive',
    daily_total: 0,
    employee_name: 'Haile G.',
  },
];

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: 'EMP-001',
    name: 'Abebe Bikila',
    phone: '0911234567',
    role: EmployeeRole.CASHIER,
    status: 'active',
    last_active: '2 mins ago',
  },
  {
    id: 'EMP-002',
    name: 'Derartu Tulu',
    phone: '0922334455',
    role: EmployeeRole.CASHIER,
    status: 'active',
    last_active: '15 mins ago',
  },
  {
    id: 'EMP-003',
    name: 'Haile Gebrselassie',
    phone: '0933445566',
    role: EmployeeRole.MANAGER,
    status: 'active',
    last_active: '1 hour ago',
  },
  {
    id: 'EMP-004',
    name: 'Tirunesh Dibaba',
    phone: '0944556677',
    role: EmployeeRole.SUPERVISOR,
    status: 'inactive',
    last_active: '2 days ago',
  },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    tx_ref: 'REF-998811',
    amount: 500.00,
    currency: 'ETB',
    status: TransactionStatus.SUCCESS,
    provider: PaymentProvider.TELEBIRR,
    created_at: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // 2 mins ago
    till_name: 'Main Counter (ዋና)',
    customer_phone: '0911***45',
  },
  {
    id: 'tx_2',
    tx_ref: 'REF-998812',
    amount: 120.00,
    currency: 'ETB',
    status: TransactionStatus.SUCCESS,
    provider: PaymentProvider.MPESA,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    till_name: 'Cafe Window (መስኮት)',
    customer_phone: '0711***22',
  },
  {
    id: 'tx_3',
    tx_ref: 'REF-998813',
    amount: 1500.00,
    currency: 'ETB',
    status: TransactionStatus.PENDING,
    provider: PaymentProvider.CBE,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    till_name: 'Main Counter (ዋና)',
  },
  {
    id: 'tx_4',
    tx_ref: 'REF-998814',
    amount: 55.00,
    currency: 'ETB',
    status: TransactionStatus.SUCCESS,
    provider: PaymentProvider.TELEBIRR,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    till_name: 'Cafe Window (መስኮት)',
  },
  {
    id: 'tx_5',
    tx_ref: 'REF-998815',
    amount: 340.00,
    currency: 'ETB',
    status: TransactionStatus.FAILED,
    provider: PaymentProvider.CHAPA,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    till_name: 'Main Counter (ዋና)',
  },
];

export const MOCK_CHART_DATA: SalesMetric[] = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 5000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 8890 },
  { name: 'Sat', value: 12390 },
  { name: 'Sun', value: 10490 },
];