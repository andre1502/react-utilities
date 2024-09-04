const recordSentryHttp = (
  Sentry: any,
  config?: any,
  request?: any,
  response?: any,
) => {
  if (config) {
    Sentry.withScope((scope: any) => {
      scope.setContext('config', config);
    });
  }

  if (request) {
    Sentry.withScope((scope: any) => {
      scope.setContext('request', request);
    });
  }

  if (response) {
    Sentry.withScope((scope: any) => {
      scope.setContext('response', response);
    });
  }
};

export { recordSentryHttp };
