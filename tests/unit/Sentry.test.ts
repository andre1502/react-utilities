import { describe, expect, it, vi } from 'vitest';
import { recordSentryHttp } from '../../src/Sentry/Utils';

describe('Sentry Utils', () => {
  it('redacts sensitive headers when recording http context to Sentry', () => {
    let capturedContext: any = null;
    const mockScope = {
      setContext: vi.fn((key: string, data: any) => {
        capturedContext = data;
      }),
    };
    const mockSentry = {
      withScope: vi.fn((cb: any) => cb(mockScope)),
    };

    const request = {
      url: 'https://api.example.com/user',
      headers: {
        Authorization: 'Bearer secret-jwt-token-12345',
        Cookie: 'session=abcde',
        'X-Api-Key': 'key-98765',
        'Content-Type': 'application/json',
      },
    };

    recordSentryHttp(mockSentry, undefined, request, undefined);

    expect(mockSentry.withScope).toHaveBeenCalled();
    expect(mockScope.setContext).toHaveBeenCalledWith('request', expect.any(Object));
    expect(capturedContext.headers['Authorization']).toBe('[REDACTED]');
    expect(capturedContext.headers['Cookie']).toBe('[REDACTED]');
    expect(capturedContext.headers['X-Api-Key']).toBe('[REDACTED]');
    expect(capturedContext.headers['Content-Type']).toBe('application/json');
  });

  it('handles null/undefined gracefully', () => {
    const mockSentry = {
      withScope: vi.fn(),
    };
    recordSentryHttp(mockSentry);
    expect(mockSentry.withScope).not.toHaveBeenCalled();
  });
});
