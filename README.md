# react-utilities

[![npm version](https://badge.fury.io/js/@andre1502%2Freact-utilities.svg)](https://badge.fury.io/js/@andre1502%2Freact-utilities)

Library to combine common functions

## Installation

```sh
yarn add @andre1502/react-utilities
```

OR

```sh
npm install @andre1502/react-utilities
```

## Usage

## Config & Locales CLI

1. Get Google service account credentials from https://console.cloud.google.com/apis/credentials.
2. Add `GOOGLE_APPLICATION_CREDENTIALS` as system environment variable with value of Google service account file credentials location.

### Fetch Locales

Filename will be auto defined by locales key (e.g. zh-TW, filename will be zh-tw.json).

```js
import { fetchLocales } from '@andre1502/react-utilities/cli';
// OR
import { fetchLocales } from '@andre1502/react-utilities/config-cli';

// https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
const optionLocales = {
  spreadsheetId: '', // Google Sheet Id
  spreadsheetTab: '', // Google Sheet Tab for locales
  formatAs: 'locales',
  output: {
    folder: './src/locales', // locales folder location
    isFilenameLowercase: true, // set if filename need to be lowercase
    exportAs: 'ts', // export locales as 'ts' | 'json'
  },
};

fetchLocales(optionLocales);
```

### Fetch Config

Config file only support export as js file, since you need to combine it with transform function.

```js
import { fetchConfig } from '@andre1502/react-utilities/cli';
// OR
import { fetchConfig } from '@andre1502/react-utilities/config-cli';

// https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
const optionConfig = {
  spreadsheetId: '', // Google Sheet Id
  spreadsheetTab: '', // Google Sheet Tab for config;
  formatAs: 'config',
  output: {
    folder: '.', // config folder location
    filename: 'versionConfig', // config filename
    isFilenameLowercase: false, // set if filename need to be lowercase
    exportAs: 'json', // export config as 'ts' | 'json' | 'js'
  },
};

fetchConfig(optionConfig);
```

Config output example

```js
module.exports = {
  params: {
    '<app-brand>': {
      API_MAIN_URL: {
        dev: '<api-dev>',
        stag: '<api-staging>',
        prod: '<api-production>',
      },
    },
  },
};
```

```json
{
  "params": {
    "<app-brand>": {
      "API_MAIN_URL": {
        "dev": "<api-dev>",
        "stag": "<api-staging>",
        "prod": "<api-production>"
      }
    }
  }
}
```

### Fetch All

To fetch both locales and config.

```js
import { fetchAll } from '@andre1502/react-utilities/cli';
// OR
import { fetchAll } from '@andre1502/react-utilities/config-cli';

// https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
const spreadsheetId = ''; // Google Sheet Id
const spreadsheetLocalesTab = ''; // Google Sheet Tab for locales
const spreadsheetConfigTab = ''; // Google Sheet Tab for config;

const optionLocales = {
  spreadsheetId: spreadsheetId,
  spreadsheetTab: spreadsheetLocalesTab,
  formatAs: 'locales',
  output: {
    folder: './src/locales', // locales folder location
    isFilenameLowercase: true, // set if filename need to be lowercase
    exportAs: 'ts', // export locales as 'ts' | 'json'
  },
};

const optionConfig = {
  spreadsheetId: spreadsheetId,
  spreadsheetTab: spreadsheetConfigTab,
  formatAs: 'config',
  output: {
    folder: '.', // config folder location
    filename: 'versionConfig', // config filename
    isFilenameLowercase: false, // set if filename need to be lowercase
    exportAs: 'json', // export locales as 'ts' | 'json' | 'js'
  },
};

fetchAll([optionLocales, optionConfig]);
```

### Transform Config

```js
import { transformConfig } from '@andre1502/react-utilities/cli';
// OR
import { transformConfig } from '@andre1502/react-utilities/config-cli';
const version = '<app-brand>';
const env = '<env-value>'; // support 'dev' | 'stag' | 'prod'

import versionConfig from './versionConfig.json' with { type: 'json' };
const currentConfig = {
  ...versionConfig.params.default,
  ...versionConfig.params[version],
};

transformConfig(currentConfig, env, 'REACT_APP_', {
  folder: '.', // transformed config folder location
  filename: '.env', // transformed config filename
  isFilenameLowercase: false, // set if filename need to be lowercase
  exportAs: 'env', // export transformed config as 'ts' | 'js' | 'env'
});
```

### Transform Sitemap

```js
import { transformSitemap } from '@andre1502/react-utilities/cli';
// OR
import { transformSitemap } from '@andre1502/react-utilities/config-cli';
const version = '<app-brand>';
const env = '<env-value>'; // support 'dev' | 'stag' | 'prod'

import versionConfig from './versionConfig.json' with { type: 'json' };
const currentConfig = {
  ...versionConfig.params.default,
  ...versionConfig.params[version],
};
const hostname = currentConfig['MAIN_URL'][env];
const urls = currentConfig['SITEMAP'];

transformSitemap(hostname, urls, true, {
  folder: './public', // transformed sitemap folder location
  filename: 'sitemap.xml', // transformed sitemap filename
  isFilenameLowercase: false, // set if filename need to be lowercase
});
```

## Sentry

### Peer Dependencies
To use Sentry utilities, ensure you have the appropriate Sentry SDK installed in your project:
* **Web (React):** `npm install @sentry/react` or `yarn add @sentry/react`
* **Mobile (React Native):** `npm install @sentry/react-native` or `yarn add @sentry/react-native`

### Init Sentry for React

```js
import { initSentry } from '@andre1502/react-utilities';
// OR
import { initSentry } from '@andre1502/react-utilities/sentry';

initSentry({
  env: '',
  dsn: '',
  debug: false,
  release: '',
  requiredEnvForSendToSentry: ['production'],
  sendDefaultPii: false, // Optional: defaults to false for privacy/GDPR compliance
  httpClientIntegrationOptions: {
    failedRequestStatusCodes: [[400], [402, 499], [500, 599]],
    failedRequestTargets: ['http://localhost'],
  },
  captureConsoleIntegrationOptions: {
    levels: ['error'],
  },
  options: {
    // other sentry options
    // ...
    integrations: [
      // other sentry integrations
      // ...
    ],
  },
});
```

### Init Sentry for React Native

```js
import { initSentry } from '@andre1502/react-utilities/react-native';
// OR
import { initSentry } from '@andre1502/react-utilities/sentry-rn';

initSentry({
  env: '',
  dsn: '',
  debug: false,
  requiredEnvForSendToSentry: ['production'],
  sendDefaultPii: false, // Optional: defaults to false for privacy
  attachScreenshot: false, // Optional: defaults to false for privacy
  httpClientIntegrationOptions: {
    failedRequestStatusCodes: [[400], [402, 499], [500, 599]],
    failedRequestTargets: ['http://localhost'],
  },
  captureConsoleIntegrationOptions: {
    levels: ['error'],
  },
  options: {
    // other sentry options
    // ...
    integrations: [
      // other sentry integrations
      // ...
    ],
  },
});
```

## Format Number

### formatAccountNumber

```js
import { formatAccountNumber } from '@andre1502/react-utilities';
// OR
import { formatAccountNumber } from '@andre1502/react-utilities/format';

const accountNumber = '1234567890123456';
const separator = ' ';
const result = formatAccountNumber(data, separator);

console.log(`result: ${result}`);
// output: 1234 5678 9012 3456
```

### formatNumber

```js
import { formatNumber } from '@andre1502/react-utilities';
// OR
import { formatNumber } from '@andre1502/react-utilities/format';

const result = formatNumber({
  lang: 'zh-TW',
  currency: 'TWD',
  value: 1000,
  showValue: true,
  showCurrency: true,
});

console.log(`result: ${result}`);
// output showValue(true) showCurrency(true): 'NT$ 1,000'
// output showValue(true) showCurrency(false): '1,000'
// output showValue(false) showCurrency(true): 'NT$ ********'
// output showValue(false) showCurrency(false): '********'
```

### getCurrencySymbol

```js
import { getCurrencySymbol } from '@andre1502/react-utilities';
// OR
import { getCurrencySymbol } from '@andre1502/react-utilities/format';

const currency = 'TWD';
const showCurrency = true;
const result = getCurrencySymbol(currency, showCurrency);

console.log(`result: ${result}`);
// output showCurrency(true): 'NT$'
// output showCurrency(false): ''
```

### parseFormatNumber

```js
import { parseFormatNumber } from '@andre1502/react-utilities';
// OR
import { parseFormatNumber } from '@andre1502/react-utilities/format';

const lang = 'zh-TW';
const value = '1,000';
const result = parseFormatNumber(lang, value);

console.log(`result: ${result}`);
// output: 1000
```

## I18n

```js
import { initReactI18next } from 'react-i18next';
import { version } from './package.json';
import enUS from './en-US.json';
// ---
import { EnvironmentEnum, initI18n } from '@andre1502/react-utilities';
// OR
import { EnvironmentEnum, initI18n } from '@andre1502/react-utilities/i18n';

const localLang = 'en-US';
const fallbackLang = 'en-US';
const langCacheExpiredTimeMs = 24 * 60 * 60 * 1000;

// translation language from json file.
const resources = {
  'en-US': { translation: enUS },
};

// determine whether need to use backend support to load resources.
const useBackend = false;

// optional, if false or undefined will use resources value
const withLocalstorageBackend = false;

// change this to real CDN url or cloud storage with direct access like AWS S3 or GCP cloud storage.
// optional, if empty, false or undefined will use resources value
const cdnUrl = 'http://cdnurl.com';

// optional, if false or undefined disable debug mode
const debug = false;

initI18n({
  initReactI18next: initReactI18next,
  lang: localLang,
  fallbackLang: fallbackLang,
  langCacheExpiredTimeMs: langCacheExpiredTimeMs,
  resources: resources,
  version: version,
  useBackend: useBackend,
  withLocalstorageBackend: withLocalstorageBackend,
  cdnUrl: cdnUrl,
  debug: debug,
});
```

## Utils

### parseQueryString

Parses a full URL or query string into a structured object with `originValue`, safely sanitized against prototype pollution (`__proto__`, `constructor`, `prototype`).

```js
import { parseQueryString } from '@andre1502/react-utilities';
// OR
import { parseQueryString } from '@andre1502/react-utilities/utils';

const parsed = parseQueryString('https://example.com/api?user=john&token=abc=123');
console.log(parsed.originValue); // 'https://example.com/api'
console.log(parsed.user);        // 'john'
console.log(parsed.token);       // 'abc=123'
```

### getUniquePermutations

Calculates all unique permutations of a specified length. Includes an optional `maxLength` parameter to guard against algorithmic DoS / factorial memory spikes.

```js
import { getUniquePermutations } from '@andre1502/react-utilities';
// OR
import { getUniquePermutations } from '@andre1502/react-utilities/utils';

// Standard permutations
const perms = getUniquePermutations(['A', 'B', 'C'], 2);
// Output: [['A', 'B'], ['A', 'C'], ['B', 'A'], ['B', 'C'], ['C', 'A'], ['C', 'B']]

// With optional maxLength safeguard (throws Error if input length > maxLength)
const safePerms = getUniquePermutations(['A', 'B', 'C'], 2, 5);
```

### Pagination Helpers

```js
import { getItemRow, getNextPage, getTotalPages } from '@andre1502/react-utilities/utils';

// Calculate 1-based table row index: index 0 on page 2 with pageSize 10 -> row 11
const row = getItemRow(0, 2, 10);

// Calculate total pages: 25 records with pageSize 10 -> 3 pages
const totalPages = getTotalPages(10, 25);

// Calculate next page: on page 1 of 3 -> 2 (returns undefined if on last page)
const nextPage = getNextPage(1, 10, 25);
```

## Testing

This repository includes a two-layer test suite for both fast development and real-world consumer verification:

```sh
# Run all tests (unit tests + standalone consumer pack-and-test)
yarn test

# Run fast in-source unit tests with Vitest
yarn test:unit

# Run automated standalone pack-and-test integration runner
yarn test:standalone
```

* **Unit Tests (`yarn test:unit`)**: In-source unit testing with Vitest covering `Format`, `Utils`, `Pagination`, `I18n`, and `Sentry`.
* **Standalone Pack-and-Test (`yarn test:standalone`)**: Offline verification that builds `dist/`, creates a local tarball via `npm pack`, installs it in an isolated temporary consumer project, verifies consumer TypeScript typings (`tsc --noEmit`), and executes runtime assertions without publishing to npm or pushing to git.

## Local Testing

If you want to test this library in another local project, here are the most effective ways to do it.

### Method 1: The Quickest Way (`yarn add`)

Best for a 10-second check.

1. In your other project: `yarn add ../react-utilities` (use the relative path).
2. **Warning**: This uses symlinks. If you get a "Duplicate React" or "Invalid Hook Call" error, use Method 2.

### Method 2: The Recommended Way (`yalc`)

Best for active development. It avoids all symlink/React issues by copying files instead of linking them.

**In this library:**

1. Install yalc globally: `npm i -g yalc`
2. Build and publish locally: `yarn build && yalc publish`
3. (Optional) For auto-syncing: `yarn build:watch` and in another terminal `yalc publish --push`

**In your other project:**

1. Add the local package: `yalc add @andre1502/react-utilities`
2. Install dependencies: `yarn install` (or npm/pnpm)

### Method 3: The "Clean" Way (`npm pack`)

Best for final verification before publishing.

**In this library:**

1. `yarn build`
2. `npm pack` (this creates a `.tgz` file like `andre1502-react-utilities-1.0.9.tgz`)

**In your other project:**

1. `yarn add ./path/to/andre1502-react-utilities-1.0.9.tgz`

## 💖 Support the Project

If this project saved you time or helped you build something cool, consider a one-time donation!

[![Liberapay One-Time](https://img.shields.io/badge/Liberapay-Donate%20Once-blue?style=for-the-badge&logo=liberapay)](https://liberapay.com/andre1502/donate)

| Amount | Goal |
| :-- | :-- |
| **[$5 USD](https://liberapay.com/andre1502/donate?amount=5.00&currency=USD)** | ☕ Buy me a coffee |
| **[$15 USD](https://liberapay.com/andre1502/donate?amount=15.00&currency=USD)** | 🍕 Buy me a pizza |
| **[$50 USD](https://liberapay.com/andre1502/donate?amount=50.00&currency=USD)** | 🛠️ Support a new feature |
| **Custom** | 🚀 Every bit helps! |

> **Note:** 100% of your donation goes to development (excluding PayPal's standard transaction fee).
