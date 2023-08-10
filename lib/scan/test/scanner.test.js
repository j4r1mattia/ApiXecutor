import { getCollections } from '../scanner';
import mock from 'mock-fs';
import path from 'path';
import { isValidCollection } from '../validator';
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
    it('should resolves in an array of valid collection paths', async () => {
      expect.assertions(1);

      await expect(getCollections(collectionsRoot)).resolves.toEqual([
        path.join(collectionsRoot, 'valid_collection.json')
      ]);
    });

    it('should reject in an error with a specific message', async () => {
      expect.assertions(1);

      await expect(getCollections('inexistent_dir')).rejects.toThrow(
        new Error('Invalid collection path: inexistent_dir')
      );
    });
  });

  describe('isValidCollection', () => {
    it('should return true', async () => {
      const isValid = await isValidCollection(
        path.join(collectionsRoot, 'valid_collection.json')
      );
      expect(isValid).toBe(true);
    });
    it('should return false', async () => {
      const isValid = await isValidCollection(
        path.join(collectionsRoot, 'invalid_collection.json')
      );
      expect(isValid).toBe(false);
    });

    it('should return false', async () => {
      const isValid = await isValidCollection(
        path.join(collectionsRoot, 'empty_collection.json')
      );
      expect(isValid).toBe(false);
    });

    it('should return false', async () => {
      const isValid = await isValidCollection(
        path.join('inexistent_dir', 'empty_collection.json')
      );
      expect(isValid).toBe(false);
    });
  });
});
