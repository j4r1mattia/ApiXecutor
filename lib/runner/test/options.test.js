import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import options from '../options.js';
import logger from '../../logger/logger.js';

describe('options module', () => {
  it('should get an array of opts and length 1', () => {
    const opts = {
      collection: 'collection.json',
      environment: 'env.json'
    };

    const mockedLogger = mock.method(logger, 'error');

    const result = options.get(opts);
    assert.deepEqual(result, [opts]);
    assert.equal(mockedLogger.mock.callCount(), 0);
  });

  it('should get an array of opts and length 2', () => {
    const opts = [
      {
        collection: 'collection.json',
        environment: 'env.json'
      },
      {
        collection: 'collection1.json',
        environment: 'env1.json'
      }
    ];

    const mockedLogger = mock.method(logger, 'error');

    const result = options.get(opts);
    assert.deepEqual(result, opts);
    assert.equal(mockedLogger.mock.callCount(), 0);
  });

  it('should throw an Error due to an invalid option', () => {
    const opts = {
      invalid: 'collection.json',
      environment: 'env.json'
    };
    const mockedLogger = mock.method(logger, 'error');
    const errorMsg = `Provided invalid options: ${JSON.stringify(opts)}`;

    assert.throws(() => options.get(opts), {
      name: 'Error',
      message: errorMsg
    });
    assert.equal(mockedLogger.mock.callCount(), 1);
    assert.deepEqual(mockedLogger.mock.calls[0].arguments, [errorMsg]);
  });

  it('should throw an Error due to one invalid option of two', () => {
    const opts = [
      {
        invalid: 'collection.json',
        environment: 'env.json'
      },
      {
        collection: 'collection1.json',
        environment: 'env1.json'
      }
    ];
    const mockedLogger = mock.method(logger, 'error');
    const errorMsg = `Provided invalid options: ${JSON.stringify(opts[0])}`;

    assert.throws(() => options.get(opts), {
      name: 'Error',
      message: errorMsg
    });
    assert.equal(mockedLogger.mock.callCount(), 1);
    assert.deepEqual(mockedLogger.mock.calls[0].arguments, [errorMsg]);
  });

  it('should throw an Error due to an empty provided option list', () => {
    const opts = [];
    const mockedLogger = mock.method(logger, 'error');
    const errorMsg = 'Provided an empty option list';

    assert.throws(() => options.get(opts), {
      name: 'Error',
      message: errorMsg
    });
    assert.equal(mockedLogger.mock.callCount(), 1);
    assert.deepEqual(mockedLogger.mock.calls[0].arguments, [errorMsg]);
  });
});
