import { existsSync } from 'fs';
import { GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';
import { google } from 'googleapis';
import * as path from 'path';
import * as process from 'process';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const GOOGLE_APPLICATION_CREDENTIALS_PATH = path.join(
  process.cwd(),
  '/google_application_credentials.json',
);

/**
 * Authenticate using google console service account.
 * @return {GoogleAuth<JSONClient>}
 */
const authorizeServiceAccount = (): GoogleAuth<JSONClient> => {
  const isExist = existsSync(GOOGLE_APPLICATION_CREDENTIALS_PATH);

  const options: any = {
    scopes: SCOPES,
  };

  if (isExist) {
    options.keyFile = GOOGLE_APPLICATION_CREDENTIALS_PATH;
  }

  return new GoogleAuth(options);
};

/**
 * @param {GoogleAuth<JSONClient>} auth The authenticated Google OAuth client.
 * @param {string} spreadsheetId
 * @param {string} spreadsheetTab
 * @return {Promise<any[][] | null | undefined>}
 */
const fetchGoogleSheet = async (
  auth: GoogleAuth<JSONClient>,
  spreadsheetId: string,
  spreadsheetTab: string,
): Promise<any[][] | null | undefined> => {
  const sheets = google.sheets({ version: 'v4', auth });

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: spreadsheetTab,
    majorDimension: 'COLUMNS',
  });

  return res.data.values;
};

export { authorizeServiceAccount, fetchGoogleSheet };
