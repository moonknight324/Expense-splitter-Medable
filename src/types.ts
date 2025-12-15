export interface Expense {
  id: number;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  splitType: 'equal' | 'custom';
  customAmounts?: { [person: string]: number };
}

export interface Balance {
  [person: string]: number;
}

export interface SimplifiedDebt {
  from: string;
  to: string;
  amount: number;
}

export interface ExchangeRateResponse {
  result: string;
  base_code: string;
  conversion_rates: {
    [currency: string]: number;
  };
}

export type SupportedCurrency = 'USD' | 'INR' | 'AED' | 'EUR';
