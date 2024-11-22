import { CurrencySymbolEnum } from './enums/CurrencySymbolEnum';

import '@formatjs/intl-getcanonicallocales/polyfill';
import '@formatjs/intl-locale/polyfill';

import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/vi';
import '@formatjs/intl-pluralrules/locale-data/zh';
import '@formatjs/intl-pluralrules/polyfill';

import '@formatjs/intl-displaynames/locale-data/en';
import '@formatjs/intl-displaynames/locale-data/vi';
import '@formatjs/intl-displaynames/locale-data/zh';
import '@formatjs/intl-displaynames/polyfill';

import '@formatjs/intl-listformat/locale-data/en';
import '@formatjs/intl-listformat/locale-data/vi';
import '@formatjs/intl-listformat/locale-data/zh';
import '@formatjs/intl-listformat/polyfill';

import '@formatjs/intl-numberformat/locale-data/en';
import '@formatjs/intl-numberformat/locale-data/vi';
import '@formatjs/intl-numberformat/locale-data/zh';
import '@formatjs/intl-numberformat/polyfill';

import '@formatjs/intl-relativetimeformat/locale-data/en';
import '@formatjs/intl-relativetimeformat/locale-data/vi';
import '@formatjs/intl-relativetimeformat/locale-data/zh';
import '@formatjs/intl-relativetimeformat/polyfill';

import '@formatjs/intl-datetimeformat/locale-data/en';
import '@formatjs/intl-datetimeformat/locale-data/vi';
import '@formatjs/intl-datetimeformat/locale-data/zh';
import '@formatjs/intl-datetimeformat/polyfill';

import '@formatjs/intl-datetimeformat/add-golden-tz.js';

export * from './Format/NumberFormat';
export { CurrencySymbolEnum };
