export const CurrencySymbolEnum = {
  TWD: 'NT$', // Taiwan
  USD: 'US$', // USA
  VND: '₫', // Vietnam
} as const;

export type CurrencySymbolEnum =
  (typeof CurrencySymbolEnum)[keyof typeof CurrencySymbolEnum];
