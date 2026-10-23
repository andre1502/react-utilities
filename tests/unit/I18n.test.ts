import i18next from 'i18next';
import { describe, expect, it } from 'vitest';
import { initI18n } from '../../src/I18n/I18n';

describe('I18n Module', () => {
  it('initializes i18next with static resources and resolves translations', async () => {
    const dummyReactI18nextPlugin: any = {
      type: '3rdParty',
      init: () => {},
    };

    initI18n({
      initReactI18next: dummyReactI18nextPlugin,
      lang: 'en-US',
      fallbackLang: 'en-US',
      langCacheExpiredTimeMs: 3600000,
      version: '1.0.0',
      useBackend: false,
      resources: {
        'en-US': {
          translation: {
            greeting: 'Hello World',
          },
        },
      },
    });

    expect(i18next.isInitialized).toBe(true);
    expect(i18next.language).toBe('en-US');
    expect(i18next.t('greeting')).toBe('Hello World');
  });
});
