import { getCollections, ERROR_MESSAGES } from '../collections';
import mock from 'mock-fs';
import path from 'path';

describe('finder module', () => {
  const collectionsRoot = 'collections';
  beforeAll(() => {
    mock({
      [collectionsRoot]: {
        'valid_collection.json': '{ "info": {}, "item": {} }',
        'invalid_collection.json': '{ "invalid": "data" }',
        'empty_collection.json': '',
        'other_file.txt': ''
      }
    });
  });

  afterAll(() => mock.restore());

  describe('getCollections', () => {
    it('should resolve with an array of valid collection paths', async () => {
      const validCollectionPath = path.join(
        collectionsRoot,
        'valid_collection.json'
      );

      expect.assertions(1);

      await expect(getCollections(collectionsRoot)).resolves.toEqual([
        validCollectionPath
      ]);
    });

    it('should reject with a specific error message', async () => {
      const nonexistentDir = 'inexistent_dir';
      const expectedErrorMessage = `Invalid collection path: ${nonexistentDir}`;

      expect.assertions(1);

      await expect(getCollections(nonexistentDir)).rejects.toThrow(
        new Error(expectedErrorMessage)
      );
    });

    it('should reject with an error when invalid collections are encountered', async () => {
      const invalidCollectionPath = path.join(
        collectionsRoot,
        'invalid_collection.json'
      );
      const expectedErrorMessage = `Error while getting collections: ${ERROR_MESSAGES.invalidCollection}: ${invalidCollectionPath}`;

      expect.assertions(1);

      await expect(getCollections(invalidCollectionPath)).rejects.toThrow(
        new Error(expectedErrorMessage)
      );
    });
  });
});
