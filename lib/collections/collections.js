import fs from 'fs';
import path from 'path';
import sdk from 'postman-collection';
import logger from '../logger';

const { Collection } = sdk;

export const ERROR_MESSAGES = {
  invalidPath: 'Invalid collection path',
  invalidFileType: 'File is not a JSON file',
  invalidCollection: 'File is not a valid collection',
  errorReadingFile: 'Error while reading file'
};

/**
 * Retrieves all valid collections from a directory or file.
 * @param {string} dir - The directory or file path.
 * @returns {Promise<Array>} An array of valid collection paths.
 * @throws Error if an error occurs while getting collections.
 */
export async function getCollections(dir) {
  if (!fs.existsSync(dir)) {
    const errorMsg = `${ERROR_MESSAGES.invalidPath}: ${dir}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  try {
    const pathType = await checkPathType(dir);

    if (pathType === 'directory') {
      return getValidCollections(dir);
    } else if (pathType === 'file' && isValidCollection(dir)) {
      return [dir];
    } else {
      const errorMsg =
        pathType === 'file'
          ? `${ERROR_MESSAGES.invalidCollection}: ${dir}`
          : `Error with provided path (${dir}): ${pathType}`;
      throw new Error(errorMsg);
    }
  } catch (error) {
    const errorMsg = `Error while getting collections: ${error.message}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
}

async function* walkDir(dir) {
  const files = await fs.promises.readdir(dir, {
    withFileTypes: true,
    encoding: 'utf8'
  });
  for await (const file of files) {
    if (file.isDirectory()) {
      yield* walkDir(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

async function getValidCollections(dirPath, arrayOfFiles = []) {
  for await (const filePath of walkDir(dirPath)) {
    if (isValidCollection(filePath)) {
      arrayOfFiles.push(filePath);
    }
  }
  return arrayOfFiles;
}

async function checkPathType(path) {
  try {
    const stats = await fs.promises.stat(path);

    if (stats.isFile()) {
      return 'file';
    } else if (stats.isDirectory()) {
      return 'directory';
    } else {
      return 'unknown';
    }
  } catch (error) {
    if (error.code === 'ENOENT') {
      return 'not found';
    }
    throw error;
  }
}

/**
 * Checks if a file is a valid Postman JSON collection.
 * @param {string} filePath - The path of the file to check.
 * @returns {boolean} True if the file is a valid collection, otherwise false.
 */
function isValidCollection(filePath) {
  if (path.extname(filePath) !== '.json') {
    logger.debug(`${ERROR_MESSAGES.invalidFileType}: ${filePath}`);
    return false;
  }

  try {
    const collectionJSON = fs.readFileSync(filePath, 'utf8');
    const parsedJSON = JSON.parse(collectionJSON);
    if (parsedJSON.info && parsedJSON.item) {
      return !!new Collection(collectionJSON);
    } else {
      logger.debug(`${ERROR_MESSAGES.invalidCollection}: ${filePath}`);
      return false;
    }
  } catch (err) {
    logger.debug(`${ERROR_MESSAGES.errorReadingFile}: ${filePath}`);
    return false;
  }
}
