export interface IPlan {
  product_id: string;
  name: string;
  description?: string;
  billing_cycles: BillingCycles[];
  status: PlanStatus;
  payment_preferences: PaymentPreferences;
}

type PlanStatus = 'CREATED' | 'ACTIVE' | 'INACTIVE';

export interface BillingCycles {
  frequency: Frequency;
  tenure_type: Tenure;
  sequence: number;
  total_cycles: number; // 0
  pricing_scheme: any;
}

type Tenure = 'REGULAR' | 'TRIAL';

export enum IntervalUnit {
  DAY = 1,
  WEEK = 7,
  MONTH = 30,
}

export enum IntervalCount {
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

interface Frequency {
  interval_unit: IntervalCount;
  interval_count: IntervalUnit;
}

interface PaymentPreferences {
  auto_bill_outstanding: true;
  setup_fee_failure_action: FeeFailureAction;
  payment_failure_threshold: number;
}

type FeeFailureAction = 'CONTINUE' | 'CANCEL';
