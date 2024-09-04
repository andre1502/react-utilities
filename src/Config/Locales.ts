import { OutputMap } from '../interfaces/Config/OutputMap';
import { OutputOptions } from '../interfaces/Config/OutputOptions';
import { StringMap } from '../interfaces/Config/StringMap';
import { outputToFile } from './Output';

/**
 * Process locales data
 *
 * @param {any[][]} rows
 * @return {OutputMap}
 */
const processLocales = (rows: any[][]): OutputMap => {
  let keys = rows[0].map((key) => {
    return key;
  });

  let data: OutputMap = {};

  rows.forEach((lang: string[], index: number) => {
    if (index === 0) {
      return;
    }

    let langData: StringMap = {};

    lang.forEach((data: string, dIndex: number) => {
      if (dIndex === 0) {
        return;
      }

      langData[keys[dIndex]] = data;
    });

    data[lang[0]] = langData;
  });

  return data;
};

/**
 * Export locales data to file
 *
 * @param {OutputMap} data
 * @param {OutputOptions} options
 * @return {void}
 */
const exportLocales = (data: OutputMap, options: OutputOptions): void => {
  Object.keys(data).forEach((key) => {
    options.filename = `${key}.${options.exportAs!.toLowerCase()}`;

    let content = '';

    switch (options.exportAs) {
      case 'ts':
        content = 'export default ' + JSON.stringify(data[key], null, 2);
        break;
      case 'json':
        content = JSON.stringify(data[key], null, 2);
        break;
      default:
        throw new Error(`exportAs ${options.exportAs} not supported.`);
    }

    if (!content) {
      throw new Error(`empty content, please check remote value.`);
    }

    outputToFile(content, options);
  });
};

export { exportLocales, processLocales };
