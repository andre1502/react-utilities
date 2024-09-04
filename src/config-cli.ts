import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { exportConfig, processConfig } from './Config/Config';
import { authorizeServiceAccount, fetchGoogleSheet } from './Config/GoogleAuth';
import { exportLocales, processLocales } from './Config/Locales';
import { ConfigOptions } from './interfaces/Config/ConfigOptions';

export { transformConfig } from './Config/Config';
export { transformSitemap } from './Config/Sitemap';
export * from './interfaces/Config/ConfigOptions';
export * from './interfaces/Config/OutputOptions';
export type { ExportAs, FormatAs } from './types/Config/OptionType';

/**
 * Private function to fetch locales
 *
 * @param {GoogleAuth<JSONClient>} auth
 * @param {ConfigOption} options
 * @return {Promise<void>}
 */
const innerFetchLocales = async (
  auth: GoogleAuth<JSONClient>,
  options: ConfigOptions,
): Promise<void> => {
  // console.log('auth', auth);

  const values = await fetchGoogleSheet(
    auth,
    options.spreadsheetId,
    options.spreadsheetTab,
  );

  if (!values || values.length === 0) {
    console.log('No data found.');
    return;
  }

  // console.log('values,', values);

  const data = processLocales(values);

  exportLocales(data, options.output);
};

/**
 * Private function to fetch config
 *
 * @param {GoogleAuth<JSONClient>} auth
 * @param {ConfigOption} options
 * @return {Promise<void>}
 */
const innerFetchConfig = async (
  auth: GoogleAuth<JSONClient>,
  options: ConfigOptions,
): Promise<void> => {
  // console.log('auth', auth);

  const values = await fetchGoogleSheet(
    auth,
    options.spreadsheetId,
    options.spreadsheetTab,
  );

  if (!values || values.length === 0) {
    console.log('No data found.');
    return;
  }

  // console.log('values,', values);

  const data = processConfig(values);

  exportConfig(data, options.output);
};

/**
 * Fetch locales
 *
 * @param {ConfigOptions} options
 * @return {void}
 */
export const fetchLocales = (options: ConfigOptions): void => {
  try {
    const auth = authorizeServiceAccount();

    innerFetchLocales(auth, options);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch config
 *
 * @param {ConfigOptions} options
 * @return {void}
 */
export const fetchConfig = (options: ConfigOptions): void => {
  try {
    const auth = authorizeServiceAccount();

    innerFetchConfig(auth, options);
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch all format from array options
 *
 * @param {ConfigOptions[]} options
 * @return {void}
 */
export const fetchAll = (options: ConfigOptions[]): void => {
  try {
    const auth = authorizeServiceAccount();

    options.forEach((option) => {
      if (option.formatAs === 'locales') {
        innerFetchLocales(auth, option);
      } else if (option.formatAs === 'config') {
        innerFetchConfig(auth, option);
      }
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetch raw value
 *
 * @param {ConfigOptions} options
 * @return {Promise<any[][] | null | undefined>}
 */
export const fetchRawValue = async (
  options: ConfigOptions,
): Promise<any[][] | null | undefined> => {
  try {
    const auth = authorizeServiceAccount();

    return await fetchGoogleSheet(
      auth,
      options.spreadsheetId,
      options.spreadsheetTab,
    );
  } catch (error) {
    console.error(error);
  }

  return null;
};
