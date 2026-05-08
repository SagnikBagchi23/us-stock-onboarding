// Option lists for the Personal details select fields.
// Sourced from the Figma mock at node 2590:177227 and conventional ranges
// used in the Groww onboarding flow.

export const EMPLOYMENT_STATUS = [
  'Employed',
  'Self-employed',
  'Business owner',
  'Retired',
  'Student',
  'Homemaker',
  'Unemployed',
] as const;

export const ANNUAL_INCOME = [
  'Less than ₹1 Lakh',
  '₹1 Lakh - ₹5 Lakhs',
  '₹5 Lakhs - ₹10 Lakhs',
  '₹10 Lakhs - ₹25 Lakhs',
  '₹25 Lakhs - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  'Above ₹1 Crore',
] as const;

export const TOTAL_NET_WORTH = [
  'Less than ₹10 Lakhs',
  '₹10 Lakhs - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  '₹1 Crore - ₹5 Crore',
  '₹5 Crore - ₹25 Crore',
  'Above ₹25 Crore',
] as const;

export const LIQUID_NET_WORTH = [
  'Less than ₹5 Lakhs',
  '₹5 Lakhs - ₹10 Lakhs',
  '₹10 Lakhs - ₹25 Lakhs',
  '₹25 Lakhs - ₹50 Lakhs',
  '₹50 Lakhs - ₹1 Crore',
  'Above ₹1 Crore',
] as const;

export const SOURCE_OF_FUNDS = [
  'Employment salary',
  'Business income',
  'Investments',
  'Inheritance',
  'Gift',
  'Loan',
  'Savings',
  'Other',
] as const;

export const PERSONAL_DETAILS_DEFAULTS = {
  employment: 'Employed',
  annualIncome: '₹50 Lakhs - ₹1 Crore',
  totalNetWorth: '₹1 Crore - ₹5 Crore',
  liquidNetWorth: '₹10 Lakhs - ₹25 Lakhs',
  sourceOfFunds: 'Employment salary',
} as const;
