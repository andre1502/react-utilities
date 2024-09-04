import { writeFile } from 'fs';
import { OutputOptions } from '../interfaces/Config/OutputOptions';

/**
 * Write content into target file
 *
 * @param {string} content
 * @param {OutputOptions} options
 * @return {void}
 */
const outputToFile = (content: string, options: OutputOptions): void => {
  let filename = options.filename;

  if (options.isFilenameLowercase) {
    filename = filename.toLowerCase();
  }

  const filePath = `${options.folder}/${filename}`;

  writeFile(filePath, content, 'utf8', function (err) {
    if (err) {
      throw err;
    }

    console.log(filePath, content);
  });
};

export { outputToFile };
