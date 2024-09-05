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
const { fetchLocales } = require('@andre1502/react-utilities/cli');
// OR
const { fetchLocales } = require('@andre1502/react-utilities/config-cli');

https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
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
const { fetchConfig } = require('@andre1502/react-utilities/cli');
// OR
const { fetchConfig } = require('@andre1502/react-utilities/config-cli');

https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
const optionConfig = {
  spreadsheetId: '', // Google Sheet Id
  spreadsheetTab: '', // Google Sheet Tab for config;
  formatAs: 'config',
  output: {
    folder: '.', // config folder location
    filename: 'versionConfig.js', // config filename
    isFilenameLowercase: false, // set if filename need to be lowercase
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

### Fetch All

To fetch both locales and config.

```js
const { fetchAll } = require('@andre1502/react-utilities/cli');
// OR
const { fetchAll } = require('@andre1502/react-utilities/config-cli');

https://docs.google.com/spreadsheets/d/<google-sheet-id>/edit
const spreadsheetId = ''; // Google Sheet Id
const spreadsheetLocalesTab = ''; // Google Sheet Tab for locales
const spreadsheetConfigTab = '' // Google Sheet Tab for config;

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
    filename: 'versionConfig.js', // config filename
    isFilenameLowercase: false, // set if filename need to be lowercase
  },
};

fetchAll([optionLocales, optionConfig]);
```

### Transform Config

```js
const { transformConfig } = require('@andre1502/react-utilities/cli');
// OR
const { transformConfig } = require('@andre1502/react-utilities/config-cli');
const version = '<app-brand>';
const env = '<env-value>'; // support 'dev' | 'stag' | 'prod'

let { params } = require('./versionConfig');
const currentConfig = { ...params?.default, ...params[version] };

transformConfig(currentConfig, env, 'REACT_APP_', {
  folder: '.', // transformed config folder location
  filename: '.env', // transformed config filename
  isFilenameLowercase: false, // set if filename need to be lowercase
  exportAs: 'env', // export transformed config as 'ts' | 'js' | 'env'
});
```

### Transform Sitemap

```js
const { transformSitemap } = require('@andre1502/react-utilities/cli');
// OR
const { transformSitemap } = require('@andre1502/react-utilities/config-cli');
const version = '<app-brand>';
const env = '<env-value>'; // support 'dev' | 'stag' | 'prod'

let { params } = require('./versionConfig');
const currentConfig = { ...params?.default, ...params[version] };
const hostname = currentConfig['MAIN_URL'][env];
const urls = currentConfig['SITEMAP'];

transformSitemap(hostname, urls, true, {
  folder: './public', // transformed sitemap folder location
  filename: 'sitemap.xml', // transformed sitemap filename
  isFilenameLowercase: false, // set if filename need to be lowercase
});
```

## Sentry CLI

### Release Sentry Source Map

Add `.sentryclirc` file in root project with these value

```
[defaults]
url=https://<sentry_host_url>/
org=<organization>
project=<sentry_project_name>
```

Update system environment variables with

```sh
export SENTRY_AUTH_TOKEN=<sentry_auth_token>
```

Add sentry file in root project with this code

```js
const { releaseSentrySourceMap } = require('@andre1502/react-utilities/cli');
// OR
const {
  releaseSentrySourceMap,
} = require('@andre1502/react-utilities/sentry-cli');

releaseSentrySourceMap({
  env: '',
  release: '',
  includeFolder: [''],
  urlPrefix: '~',
  requiredEnvForSourceMap: [''],
});
```

## Sentry

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
import { initSentry } from '@andre1502/react-utilities';

initSentry({
  env: '',
  dsn: '',
  debug: false,
  requiredEnvForSendToSentry: ['production'],
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
import { formatAccountNumber } from '@andre1502/react-utilities/fmt';
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
import { formatNumber } from '@andre1502/react-utilities/fmt';
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
import { getCurrencySymbol } from '@andre1502/react-utilities/fmt';
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
import { parseFormatNumber } from '@andre1502/react-utilities/fmt';
// OR
import { parseFormatNumber } from '@andre1502/react-utilities/format';

const lang = 'zh-TW';
const value = '1,000';
const result = parseFormatNumber(lang, value);

console.log(`result: ${result}`);
// output: 1000
```
