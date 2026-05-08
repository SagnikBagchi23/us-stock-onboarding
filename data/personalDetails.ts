// Option lists for the Personal details select fields.
// Sourced from Figma sheet designs at nodes 2590:180947, 181079, 181915,
// 182044, 181669.

export const EMPLOYMENT_STATUS = [
  'Employed',
  'Unemployed',
  'Student',
  'Retired',
] as const;

export const ANNUAL_INCOME = [
  'Upto 1 Lakh',
  '5-10 Lakhs',
  '10-25 Lakhs',
  '25-50 Lakhs',
  '50 Lakhs - 1 Crore',
  '1-5 Crores',
  'More than 5 Crores',
] as const;

export const TOTAL_NET_WORTH = [
  'Upto 10 Lakhs',
  '10-25 Lakhs',
  '25-50 Lakhs',
  '50 Lakhs - 1 Crore',
  '1-5 Crores',
  'More than 5 Crores',
] as const;

export const LIQUID_NET_WORTH = [
  'Upto 1 Lakh',
  '5-10 Lakhs',
  '10-25 Lakhs',
  '25-50 Lakhs',
  '50 Lakhs - 1 Crore',
  '1-5 Crores',
  'More than 5 Crores',
] as const;

export const SOURCE_OF_FUNDS = [
  'Employment income',
  'Investments',
  'Inheritance',
  'Others',
] as const;

export const PERSONAL_DETAILS_DEFAULTS = {
  employment: 'Employed',
  annualIncome: '50 Lakhs - 1 Crore',
  totalNetWorth: '1-5 Crores',
  liquidNetWorth: '5-10 Lakhs',
  sourceOfFunds: 'Employment income',
} as const;
