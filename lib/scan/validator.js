import { readFileSync } from 'fs';
import pkg from 'postman-collection';
const { Collection } = pkg;

export function isValidCollection(filePath) {
  try {
    const collectionJSON = readFileSync(filePath, 'utf8');
    const parsedJSON = JSON.parse(collectionJSON);
    if (parsedJSON.info && parsedJSON.item) {
      return !!new Collection(collectionJSON);
    } else {
      console.debug(`File ${filePath} is not a valid collection`);
      return false;
    }
  } catch (err) {
    console.debug(`Error while reading ${filePath}`);
    return false;
  }
}
