import { NumberFormat } from '@formatjs/intl-numberformat';

const Formatter =
  typeof Intl !== 'undefined' && Intl.NumberFormat
    ? Intl.NumberFormat
    : NumberFormat;

class NumberParser {
  private _group: RegExp;
  private _decimal: RegExp;
  private _numeral: RegExp;
  private _index: (d: any) => any;

  constructor(locale: string) {
    const parts = new Formatter(locale).formatToParts(12345.6);

    const numerals = [
      ...new Formatter(locale, { useGrouping: false }).format(9876543210),
    ].reverse();

    const index = new Map(numerals.map((d, i) => [d, i]));

    const escapeRegex = (str?: string) =>
      str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : '';

    const groupPart = parts.find((d) => d.type === 'group')?.value;
    const decimalPart = parts.find((d) => d.type === 'decimal')?.value;

    this._group = groupPart ? new RegExp(escapeRegex(groupPart), 'g') : /(?!)/g;
    this._decimal = decimalPart ? new RegExp(escapeRegex(decimalPart)) : /(?!)/;
    this._numeral = new RegExp(
      `[${numerals.map((n) => escapeRegex(n)).join('')}]`,
      'g',
    );
    this._index = (d) => index.get(d);
  }

  parse(value: string) {
    value = value
      ?.trim()
      ?.replace(this._group, '')
      ?.replace(this._decimal, '.')
      ?.replace(this._numeral, this._index);

    return value ? +value : NaN;
  }
}

export { NumberParser };
