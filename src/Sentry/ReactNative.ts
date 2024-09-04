import {
  captureConsoleIntegration,
  httpClientIntegration,
} from '@sentry/integrations';
import * as Sentry from '@sentry/react-native';
import { InitOptionsRN } from '../interfaces/Sentry/InitOptionsRN';
import { StringRegexArr } from '../types/Sentry/OptionType';
import { recordSentryHttp } from './Utils';

/**
 * Initialize Sentry for React Native.
 *
 * @param {InitOptionsRN} options
 * @return {void}
 */
const initSentry = (options: InitOptionsRN): void => {
  let shouldSendToSentry = options?.requiredEnvForSendToSentry?.includes(
    options.env,
  );

  let ignoreErrors: StringRegexArr = [/StallTracking/];

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
      httpClientIntegration({
        failedRequestStatusCodes:
          options.httpClientIntegrationOptions.failedRequestStatusCodes,
        failedRequestTargets:
          options.httpClientIntegrationOptions.failedRequestTargets,
      }),
    );
  }

  if (options?.captureConsoleIntegrationOptions?.levels) {
    integrations.push(
      captureConsoleIntegration({
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

  let sentryOptions: Sentry.ReactNativeOptions = {
    dsn: options.dsn,
    debug: options.debug,
    environment: options.env,
    ignoreErrors: ignoreErrors,
    sampleRate: 1.0,
    maxBreadcrumbs: 50,
    autoSessionTracking: true,
    attachScreenshot: true,
    enableCaptureFailedRequests: true,
    enableTracing: true,
    tracesSampleRate: 1.0,
    enableNative: true,
    autoInitializeNativeSdk: true,
    enableNativeCrashHandling: true,
    enableNativeNagger: true,
    enableAutoSessionTracking: true,
    enableNdkScopeSync: true,
    attachThreads: true,
    enableAutoPerformanceTracing: true,
    enableWatchdogTerminationTracking: true,
    enableAppHangTracking: true,
    appHangTimeoutInterval: 5,
    sendDefaultPii: true,
    beforeSend: (event) => {
      if (event?.message?.includes('StallTracking') || !shouldSendToSentry) {
        return null;
      }

      return event;
    },
  };

  if (options?.release) {
    sentryOptions.release = options.release;
  }

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
