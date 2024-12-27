import i18next, { InitOptions, ThirdPartyModule } from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import HttpBackend from 'i18next-http-backend';
import LocalStorageBackend from 'i18next-localstorage-backend';
import ResourcesToBackend from 'i18next-resources-to-backend';

const getV = (divider: number): number => {
  return Math.floor(Date.now() / divider);
};

export interface InitI18nProps {
  initReactI18next: ThirdPartyModule;
  lang: string;
  fallbackLang: string;
  langCacheExpiredTimeMs: number;
  resources: { [key: string]: any };
  version: string;
  useBackend: boolean;
  withLocalstorageBackend?: boolean;
  cdnUrl?: string;
  debug?: boolean;
}

const initI18n = ({
  initReactI18next,
  lang,
  fallbackLang,
  langCacheExpiredTimeMs,
  resources,
  version,
  useBackend,
  withLocalstorageBackend = false,
  cdnUrl = '',
  debug = false,
}: InitI18nProps) => {
  let backends: Array<any> = [];
  let backendOptions: Array<any> = [];
  const langs = Object.keys(resources);

  // https://www.i18next.com/how-to/backend-fallback
  if (useBackend && withLocalstorageBackend) {
    const versions: { [key: string]: string } = {};

    langs.forEach((value) => Object.assign(versions, { [value]: version }));

    backends.push(LocalStorageBackend);
    backendOptions.push({
      // prefix for stored languages
      prefix: `i18next_res_`,

      // expiration
      expirationTime: langCacheExpiredTimeMs,

      // language versions
      versions: versions,
    });
  }

  if (useBackend && cdnUrl) {
    backends.push(HttpBackend);
    backendOptions.push({
      // load resources from url path
      loadPath: `${cdnUrl}/locales/{{lng}}.json`,
      // adds parameters to resource URL. 'example.com' -> 'example.com?v=1.3.5'
      queryStringParams: {
        v: `${version}.${getV(langCacheExpiredTimeMs)}`,
      },

      reloadInterval: langCacheExpiredTimeMs, // can be used to reload resources in a specific interval (milliseconds) (useful in server environments)
    });
  }

  if (useBackend) {
    backends.push(ResourcesToBackend(resources));
  }

  // https://www.i18next.com/misc/creating-own-plugins#languagedetector
  const languageDetector: any = {
    type: 'languageDetector',
    name: 'customDetector',
    async: false,
    init: () => {
      /* use services and options */
    },
    detect: (callback: any) => {
      return lang;
    },
  };

  let config: InitOptions = {
    debug: debug,
    compatibilityJSON: 'v4',
    ns: ['translation'],
    defaultNS: 'translation',
    lng: lang,
    fallbackLng: fallbackLang,
    load: 'currentOnly',
    keySeparator: false,
    nonExplicitSupportedLngs: true,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  };

  if (useBackend) {
    config = {
      ...config,
      backend: {
        backends: backends,
        backendOptions: backendOptions,
        cacheHitMode: 'refreshAndUpdateStore',
        reloadInterval: langCacheExpiredTimeMs,
        refreshExpirationTime: langCacheExpiredTimeMs, // only after determined time it should trigger a refresh if necessary
      },
      react: {
        bindI18nStore: 'added', // this way, when the HttpBackend delivers new translations (thanks to refreshAndUpdateStore), the UI gets updated
      },
    };
  }

  if (!i18next.isInitialized) {
    i18next
      .use(ChainedBackend)
      .use(languageDetector)
      .use(initReactI18next) // passes i18n down to react-i18next
      .init(config, (ex, t) => {
        if (ex) {
          console.error(`Error when i18n init`, ex);
          return;
        }
      });
  }
};

export { getV, initI18n };
