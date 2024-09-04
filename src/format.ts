import { CurrencySymbolEnum } from './enums/CurrencySymbolEnum';

require('@formatjs/intl-getcanonicallocales/polyfill');
require('@formatjs/intl-locale/polyfill');

require('@formatjs/intl-pluralrules/polyfill');
require('@formatjs/intl-pluralrules/locale-data/en');
require('@formatjs/intl-pluralrules/locale-data/vi');
require('@formatjs/intl-pluralrules/locale-data/zh');

require('@formatjs/intl-displaynames/polyfill');
require('@formatjs/intl-displaynames/locale-data/en');
require('@formatjs/intl-displaynames/locale-data/vi');
require('@formatjs/intl-displaynames/locale-data/zh');

require('@formatjs/intl-listformat/polyfill');
require('@formatjs/intl-listformat/locale-data/en');
require('@formatjs/intl-listformat/locale-data/vi');
require('@formatjs/intl-listformat/locale-data/zh');

require('@formatjs/intl-numberformat/polyfill');
require('@formatjs/intl-numberformat/locale-data/en');
require('@formatjs/intl-numberformat/locale-data/vi');
require('@formatjs/intl-numberformat/locale-data/zh');

require('@formatjs/intl-relativetimeformat/polyfill');
require('@formatjs/intl-relativetimeformat/locale-data/en');
require('@formatjs/intl-relativetimeformat/locale-data/vi');
require('@formatjs/intl-relativetimeformat/locale-data/zh');

require('@formatjs/intl-datetimeformat/polyfill');
require('@formatjs/intl-datetimeformat/locale-data/en');
require('@formatjs/intl-datetimeformat/locale-data/vi');
require('@formatjs/intl-datetimeformat/locale-data/zh');

require('@formatjs/intl-datetimeformat/add-golden-tz.js');

export * from './Format/NumberFormat';
export { CurrencySymbolEnum };
