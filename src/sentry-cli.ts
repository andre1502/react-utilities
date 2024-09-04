import { releaseSourceMap } from './Sentry/Build';
import { SourceMapOptions } from './interfaces/Sentry/SourceMapOptions';

export * from './interfaces/Sentry/SourceMapOptions';

/**
 * Create and upload sentry release source map.
 *
 * @param {SourceMapOption} options
 * @return {Promise<void>}
 */
export const releaseSentrySourceMap = async (
  options: SourceMapOptions,
): Promise<void> => {
  await releaseSourceMap(options);
};
