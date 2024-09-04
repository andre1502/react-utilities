import { NumberFormat } from '@formatjs/intl-numberformat';
import { CurrencySymbolEnum } from '../enums/CurrencySymbolEnum';
import { FormatOptions } from '../interfaces/Format/FormatOptions';
import { NumberParser } from './NumberParser';

const formatAccountNumber = (
  accountNumber: string,
  separator: string = ' ',
) => {
  return accountNumber
    ?.replace(/\s?/g, '')
    .replace(/(\d{4})/g, `$1${separator}`)
    .trim();
};

const getCurrencySymbol = (currency: string, showCurrency: boolean = true) => {
  let symbol;

  switch (currency) {
    case 'TWD':
      symbol = CurrencySymbolEnum.TWD;
      break;
    case 'USD':
      symbol = CurrencySymbolEnum.USD;
      break;
    case 'VND':
      symbol = CurrencySymbolEnum.VND;
      break;
    default:
      symbol = '';
  }

  if (!showCurrency) {
    symbol = '';
  }

  return symbol;
};

const formatNumber = (options: FormatOptions) => {
  options.value = options.value ?? 0;
  options.styleCurrency = options.styleCurrency ?? 'currency';
  options.currencyDisplay = options.currencyDisplay ?? 'code';
  options.showValue = options.showValue ?? true;
  options.showCurrency = options.showCurrency ?? true;
  options.minimumFractionDigits = options.minimumFractionDigits ?? 0;
  options.maximumFractionDigits = options.maximumFractionDigits ?? 0;
  options.trailingZeroDisplay = options.trailingZeroDisplay ?? 'stripIfInteger';

  // console.log(`options: ${JSON.stringify(options)}.`);

  let formatOptions = {
    style: options.styleCurrency,
    currency: options.currency,
    currencyDisplay: options.currencyDisplay,
    minimumFractionDigits: options.minimumFractionDigits,
    maximumFractionDigits: options.maximumFractionDigits,
    trailingZeroDisplay: options.trailingZeroDisplay,
  };

  if (options.options) {
    formatOptions = {
      ...formatOptions,
      ...options.options,
    };
  }

  let localizedNumber = NumberFormat(options.lang, formatOptions)
    .format(options.value)
    .replace(/^([\d,.]+)(\s*)([A-Z]{3})$/, '$3$2$1')
    .replace(/([\d,.]+)$/, options.showValue ? ' $1' : ' ********')
    .replace(
      options.currency,
      getCurrencySymbol(options.currency, options.showCurrency),
    )
    .trim();

  // console.log(`localizedNumber: ${localizedNumber}.`);

  return localizedNumber;
};

const parseFormatNumber = (lang: string, value: string) => {
  if (!value) {
    return null;
  }

  return new NumberParser(lang).parse(value);
};

export {
  formatAccountNumber,
  formatNumber,
  getCurrencySymbol,
  parseFormatNumber,
};
