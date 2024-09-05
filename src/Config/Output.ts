import { existsSync, mkdirSync, writeFile } from 'fs';
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

  if (!existsSync(options.folder)) {
    mkdirSync(options.folder, { recursive: true });
  }

  writeFile(
    filePath,
    content,
    { encoding: 'utf-8', flag: 'w' },
    function (err) {
      if (err) {
        throw err;
      }

      console.log(filePath, content);
    },
  );
};

export { outputToFile };
