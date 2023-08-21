import path from 'node:path';
import { describe, before, afterEach, it } from 'node:test';
import assert from 'node:assert/strict';
import mock from 'mock-fs';
import { getCollections } from '../collections.js';

describe('collections module', () => {
  describe('getCollections', () => {
    const collectionsRoot = 'collections';

    before(() => {
      mock({
        [collectionsRoot]: {
          'valid_collection.json': '{ "info": {}, "item": {} }',
          'invalid_collection.json': '{ "invalid": "data" }',
          'empty_collection.json': '',
          'other_file.txt': '',
          symbolic_link: mock.symlink({
            path: 'valid_collection.json'
          })
        }
      });
    });

    afterEach(() => mock.restore());

    it('should resolve with an array of valid collection paths', async () => {
      const validCollectionPath = path.join(
        collectionsRoot,
        'valid_collection.json'
      );

      const result = await getCollections(collectionsRoot);
      assert.deepEqual(result, [validCollectionPath]);
    });

    it('should reject with a specific error message due to nonexistent path', async () => {
      const nonexistentDir = 'inexistent_dir';
      const expectedErrorMessage = `Invalid collection path: ${nonexistentDir}`;

      assert.rejects(getCollections(nonexistentDir), {
        name: 'Error',
        message: expectedErrorMessage
      });
    });

    it('should reject with a specific error message due to invalid file type', async () => {
      const otherFilePath = path.join(collectionsRoot, 'other_file.txt');
      const expectedErrorMessage =
        'Invalid collection path: collections/other_file.txt';

      await assert.rejects(getCollections(otherFilePath), {
        name: 'Error',
        message: expectedErrorMessage
      });
    });

    it('should reject with an error when invalid collections are encountered', async () => {
      const invalidCollectionPath = path.join(
        collectionsRoot,
        'invalid_collection.json'
      );
      const expectedErrorMessage = `Invalid collection path: ${invalidCollectionPath}`;

      await assert.rejects(getCollections(invalidCollectionPath), {
        name: 'Error',
        message: expectedErrorMessage
      });
    });
  });
});
