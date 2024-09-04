import {
  CurrencyDisplay,
  StyleCurrency,
  TrailingZeroDisplay,
} from '../../types/Format/OptionType';

export interface FormatOptions {
  lang: string;
  currency: string;
  value: number;
  styleCurrency?: StyleCurrency;
  currencyDisplay?: CurrencyDisplay;
  showValue?: boolean;
  showCurrency?: boolean;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  trailingZeroDisplay?: TrailingZeroDisplay;
  options?: any;
}
