import { lstatSync, readdir, unlinkSync } from 'fs';
import * as path from 'path';

/**
 * @param {string} path - The path.
 * @returns {boolean} Whether path is a directory, otherwise always false.
 */
const isDir = (path: string): boolean => {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (error) {
    // lstatSync throws an error if path doesn't exist
    return false;
  }
};

/**
 * @param {string} dirPath - Directory path.
 * @param {string[]} exts - List of Extension file need to be removed.
 * @returns {void}
 */
const deleteFile = (dirPath: string, exts: string[]): void => {
  readdir(dirPath, (err, files) => {
    if (err) {
      console.error(err);
    }

    files.forEach((file) => {
      const fileDir = path.join(`${dirPath}/${file}`);
      // Get the extension name of the file, lowercase it, then see if it is in the array of extensions
      // defined above. If so, remove it.

      if (isDir(fileDir)) {
        deleteFile(fileDir, exts);
        return;
      }

      if (
        file.toLowerCase() === '.ds_store' ||
        exts.includes(path.extname(file).toLowerCase())
      ) {
        unlinkSync(fileDir);

        console.log(`File: ${fileDir} deleted successfully.`);
      }
    });
  });
};

export { deleteFile };
