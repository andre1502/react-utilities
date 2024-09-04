import * as Sentry from '@sentry/react';
import { InitOptions } from '../interfaces/Sentry/InitOptions';
import { StringRegexArr } from '../types/Sentry/OptionType';
import { recordSentryHttp } from './Utils';

/**
 * Initialize Sentry for React.
 *
 * @param {InitOptions} options
 * @return {void}
 */
const initSentry = (options: InitOptions): void => {
  let shouldSendToSentry = options?.requiredEnvForSendToSentry?.includes(
    options.env,
  );

  let ignoreErrors: StringRegexArr = [
    /antd:/,
    /is deprecated in StrictMode/,
    /React Intl/,
  ];

  if (options?.ignoreErrorsOptions) {
    ignoreErrors = ignoreErrors.concat(options.ignoreErrorsOptions);
  }

  if (options?.options?.ignoreErrors) {
    ignoreErrors = ignoreErrors.concat(options.options.ignoreErrors);
    delete options.options.ignoreErrors;
  }

  let integrations: any[] = [];

  if (
    options?.httpClientIntegrationOptions?.failedRequestStatusCodes &&
    options?.httpClientIntegrationOptions?.failedRequestTargets
  ) {
    integrations.push(
      Sentry.httpClientIntegration({
        failedRequestStatusCodes:
          options.httpClientIntegrationOptions.failedRequestStatusCodes,
        failedRequestTargets:
          options.httpClientIntegrationOptions.failedRequestTargets,
      }),
    );
  }

  if (options?.captureConsoleIntegrationOptions?.levels) {
    integrations.push(
      Sentry.captureConsoleIntegration({
        levels: options.captureConsoleIntegrationOptions.levels,
      }),
    );
  }

  if (options?.options?.hasOwnProperty('integrations')) {
    options.options.integrations = [
      ...options.options.integrations,
      ...integrations,
    ];
  } else {
    options.options = options.options || {};
    options.options.integrations = integrations;
  }

  let sentryOptions: Sentry.BrowserOptions = {
    dsn: options.dsn,
    debug: options.debug,
    release: options.release,
    environment: options.env,
    ignoreErrors: ignoreErrors,
    sampleRate: 1.0,
    maxBreadcrumbs: 50,
    attachStacktrace: true,
    autoSessionTracking: true,
    sendClientReports: true,
    enableTracing: true,
    // Performance Monitoring
    tracesSampleRate: 1.0, //  Capture 100% of the transactions
    // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
    tracePropagationTargets: ['localhost'],
    sendDefaultPii: true,
    beforeSend: (event) => {
      if (
        event?.message?.includes('antd:') ||
        event?.message?.includes('is deprecated in StrictMode') ||
        event?.message?.includes('React Intl') ||
        !shouldSendToSentry
      ) {
        return null;
      }

      return event;
    },
  };

  if (options?.beforeSend) {
    sentryOptions.beforeSend = options.beforeSend;
  }

  if (options?.options) {
    sentryOptions = {
      ...sentryOptions,
      ...options.options,
    };
  }

  Sentry.init(sentryOptions);
};

/**
 * Record additional http data for Sentry.
 *
 * @param {any | null} config
 * @param {any | null} request
 * @param {any | null} response
 * @return {void}
 */
const recordAdditionalSentryHttp = (
  config?: any,
  request?: any,
  response?: any,
) => {
  recordSentryHttp(Sentry, config, request, response);
};

export { initSentry, recordAdditionalSentryHttp };
