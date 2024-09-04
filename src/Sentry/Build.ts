// sentry-cli sourcemaps inject --org <org> --project <project> ./build/static/js && sentry-cli sourcemaps upload --org <org> --project <project> ./build/static/js

import SentryCli from '@sentry/cli';
import { SourceMapOptions } from '../interfaces/Sentry/SourceMapOptions';
import { deleteFile } from '../Utils/Files';

/**
 * Create Sentry release and upload to Sentry host.
 *
 * @param {SourceMapOptions} options
 * @return {Promise<void>}
 */
const releaseSourceMap = async (options: SourceMapOptions): Promise<void> => {
  if (
    !options.requiredEnvForSourceMap ||
    options.requiredEnvForSourceMap.length <= 0
  ) {
    options.requiredEnvForSourceMap = ['production'];
  }

  if (!options.urlPrefix) {
    options.urlPrefix = '';
  }

  if (!options.includeFolder || options.includeFolder.length <= 0) {
    console.error('includeFolder value is empty.');
    return;
  }

  if (!options.requiredEnvForSourceMap.includes(options.env)) {
    console.log(
      'No need to upload sentry source map, required env:',
      options.requiredEnvForSourceMap,
    );

    options.includeFolder.forEach((folder) => deleteFile(folder, ['.map']));

    return;
  }

  try {
    const cli = new SentryCli();

    console.log('Now creating sentry release ' + options.release);

    await cli.releases.new(options.release);

    console.log('Now uploading source maps');
    await cli.releases.uploadSourceMaps(options.release, {
      urlPrefix: options.urlPrefix,
      include: options.includeFolder,
      rewrite: true,
      validate: true,
      useArtifactBundle: true,
    });

    console.log('Releasing release');

    await cli.releases.finalize(options.release);

    options.includeFolder.forEach((folder) => deleteFile(folder, ['.map']));
  } catch (ex) {
    console.error('Source maps uploading failed:', ex);
  }
};

export { releaseSourceMap };
