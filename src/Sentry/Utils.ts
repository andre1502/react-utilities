const sanitizeHeaders = (headers: any) => {
  if (!headers || typeof headers !== 'object') return headers;
  const sensitiveKeys = [
    'authorization',
    'cookie',
    'set-cookie',
    'x-api-key',
    'proxy-authorization',
    'token',
  ];
  const sanitized: Record<string, any> = { ...headers };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      sanitized[key] = '[REDACTED]';
    }
  }
  return sanitized;
};

const sanitizeHttpData = (data: any) => {
  if (!data || typeof data !== 'object') return data;
  const cloned: Record<string, any> = { ...data };
  if (cloned.headers) {
    cloned.headers = sanitizeHeaders(cloned.headers);
  }
  return cloned;
};

const recordSentryHttp = (
  Sentry: any,
  config?: any,
  request?: any,
  response?: any,
) => {
  if (config) {
    Sentry.withScope((scope: any) => {
      scope.setContext('config', sanitizeHttpData(config));
    });
  }

  if (request) {
    Sentry.withScope((scope: any) => {
      scope.setContext('request', sanitizeHttpData(request));
    });
  }

  if (response) {
    Sentry.withScope((scope: any) => {
      scope.setContext('response', sanitizeHttpData(response));
    });
  }
};

export { recordSentryHttp };
