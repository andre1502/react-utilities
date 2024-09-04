import * as lodash from 'lodash';
import { OutputMap } from '../interfaces/Config/OutputMap';
import { OutputOptions } from '../interfaces/Config/OutputOptions';
import { outputToFile } from './Output';

/**
 * Process config data
 *
 * @param {any[][]} rows
 * @return {OutputMap}
 */
const processConfig = (rows: any[][]): OutputMap => {
  let versionConfig: OutputMap = {};

  let params = rows[0].map((key) => {
    return key;
  });

  rows.forEach((row: string[], index: number) => {
    if (index === 0) {
      return;
    }

    versionConfig = processRow(row, params, versionConfig);
  });

  return versionConfig;
};

/**
 * Process config item
 *
 * @param {string[]} data
 * @param {string[]} params
 * @param {OutputMap} versionConfig
 * @return {OutputMap}
 */
const processRow = (
  data: string[],
  params: string[],
  versionConfig: OutputMap,
): OutputMap => {
  const versionName = data[0];
  versionConfig[versionName] = {};

  params.forEach((paramsName, index) => {
    if (index === 0 || data[index] === undefined || data[index] === '') {
      return;
    }

    versionConfig[versionName][paramsName] = paramsTypeHandler(data[index]);
  });

  return versionConfig;
};

/**
 * Check is JSON value
 *
 * @param {string} str
 * @return {boolean}
 */
const isJsonString = (str: string): boolean => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }

  return true;
};

/**
 * Handling config value type
 *
 * @param {string} params
 * @return {any}
 */
const paramsTypeHandler = (params: string): any => {
  const booleanText = ['TRUE', 'FALSE'];

  if (booleanText.includes(params.toUpperCase())) {
    return params === 'TRUE';
  }

  if (isJsonString(params)) {
    return JSON.parse(params);
  }

  return params;
};

/**
 * Export config data into js file
 *
 * @param {OutputMap} data
 * @param {OutputOptions} options
 * @return {void}
 */
const exportConfig = (data: OutputMap, options: OutputOptions): void => {
  const config = {
    params: data,
  };

  const content = `module.exports = ${JSON.stringify(config, null, 2)}`;

  outputToFile(content, options);
};

/**
 * Handling env map value
 *
 * @param {string} env
 * @return {string}
 */
const envMap = (env: string): string => {
  let result;

  switch (env) {
    case 'dev':
    case 'develop':
    case 'development':
      result = 'dev';
      break;
    case 'stg':
    case 'stag':
    case 'staging':
      result = 'staging';
      break;
    case 'prd':
    case 'prod':
    case 'production':
      result = 'production';
      break;
    default:
      throw new Error(`env ${env} not supported.`);
  }

  return result;
};

/**
 * Mapping content to exportAs value
 *
 * @param {string} key
 * @param {any} value
 * @param {string} exportAs
 * @return {string}
 */
const contentMap = (key: string, value: any, exportAs: string): string => {
  let content = '';

  switch (exportAs) {
    case 'ts':
      if (lodash.isNull(value)) {
        content += `export const ${key}: string | null = ${value};\n`;
      } else if (typeof value === 'boolean') {
        content += `export const ${key}: boolean = ${value};\n`;
      } else {
        content += `export const ${key} = '${value}';\n`;
      }
      break;
    case 'js':
      content += `export const ${key} = "${value}";\n`;
      break;
    case 'env':
      content += `${key} = "${value}"\n`;
      break;
    default:
      throw new Error(`exportAs ${exportAs} not supported.`);
  }

  return content;
};

/**
 * Transform config
 *
 * @param {OutputMap} data
 * @param {string} env
 * @param {string} configKeyPrefix
 * @param {OutputOptions} options
 * @return {void}
 */
const transformConfig = (
  data: OutputMap,
  env: string,
  configKeyPrefix: string,
  options: OutputOptions,
): void => {
  const envKey = configKeyPrefix ? `${configKeyPrefix}ENV` : 'ENV';

  let content = contentMap(envKey, envMap(env), options.exportAs!);

  Object.keys(data).forEach((key) => {
    const newConfigKey = configKeyPrefix ? `${configKeyPrefix}${key}` : key;

    if (key === 'BASE_PROJECT') {
      const extensionFile = [
        `.${data[key]}.js`,
        `.${data[key]}.jsx`,
        `.${data[key]}.ts`,
        `.${data[key]}.tsx`,
        `.${data[key]}.css`,
        `.${data[key]}.json`,
        `.${data[key]}.scss`,
      ];

      content += contentMap(
        newConfigKey,
        extensionFile.join(','),
        options.exportAs!,
      );

      return;
    }

    if (key === 'SITEMAP') {
      content += contentMap(
        newConfigKey,
        JSON.stringify(data[key]),
        options.exportAs!,
      );

      return;
    }

    if (Array.isArray(data[key])) {
      content += contentMap(
        newConfigKey,
        data[key].join(','),
        options.exportAs!,
      );

      return;
    }

    if (typeof data[key] === 'object') {
      if (data[key].hasOwnProperty(env)) {
        content += contentMap(newConfigKey, data[key][env], options.exportAs!);
      } else {
        content += contentMap(
          newConfigKey,
          JSON.stringify(data[key]),
          options.exportAs!,
        );
      }

      return;
    }

    content += contentMap(newConfigKey, data[key], options.exportAs!);
  });

  outputToFile(content, options);
};

export { exportConfig, processConfig, transformConfig };
