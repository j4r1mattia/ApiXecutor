import path from 'path';
import fs from 'fs';
import { isValidCollection } from './validator.js';

export async function getCollections(dir) {
  if (!fs.existsSync(dir)) {
    throw new Error(`Invalid collection path: ${dir}`);
  }
  return checkPathTypeAsync(dir)
    .then((pathType) => {
      if (pathType === 'directory') {
        return getAllFiles(dir);
      } else if (pathType === 'file') {
        return [dir];
      } else throw new Error(`error with provided path: ${pathType}`);
    })
    .then((files) =>
      files.filter(
        (filePath) =>
          path.extname(filePath) === '.json' && isValidCollection(filePath)
      )
    );
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

const getAllFiles = async function (dirPath, arrayOfFiles = []) {
  for await (const filePath of walkDir(dirPath)) {
    arrayOfFiles.push(filePath);
  }

  return arrayOfFiles;
};

async function checkPathTypeAsync(path) {
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
