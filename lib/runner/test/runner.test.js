import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import { run } from '../runner.js';
import options from '../options.js';
import logger from '../../logger/logger.js';
import executor from '../executor.js';

describe('runner module', () => {
  describe('run method in an no errors scenario', () => {
    it('should execute instance when options is not an array', async () => {
      const opts = {
        collection: 'collection.json',
        environment: 'env.json'
      };
      const expectedResult = 'result';

      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(
        executor,
        'executeOne',
        () => expectedResult
      );
      const mockedLogger = mock.method(logger, 'info');

      const result = await run(opts, true);

      assert.equal(result, expectedResult);
      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.equal(mockedLogger.mock.callCount(), 0);
    });

    it('should execute runInParallel when options is an array and parallel is true', async () => {
      const opts = [
        { collection: 'collection1.json', environment: 'env1.json' },
        { collection: 'collection2.json', environment: 'env2.json' }
      ];
      const expectedResult = 'result';

      // Mocking getOptions and runInParallel functions
      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(
        executor,
        'executeInParallel',
        () => expectedResult
      );
      const mockedLogger = mock.method(logger, 'info');

      const result = await run(opts, true);

      assert.equal(result, expectedResult);
      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Starting collections execution in parallel'
      ]);
      assert.equal(mockedLogger.mock.callCount(), 1);
    });

    it('should execute runInSequence when options is an array and parallel is false', async () => {
      const opts = [
        { collection: 'collection1.json', environment: 'env1.json' },
        { collection: 'collection2.json', environment: 'env2.json' }
      ];
      const expectedResult = 'result';

      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(
        executor,
        'executeInSequence',
        () => expectedResult
      );
      const mockedLogger = mock.method(logger, 'info');

      const result = await run(options, false);

      assert.equal(result, expectedResult);
      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Starting collections execution in sequence'
      ]);
      assert.equal(mockedLogger.mock.callCount(), 1);
    });
  });

  describe('run method in an scenario with errors', () => {
    it('should reject due to invalid options', async () => {
      const opts = {};

      mock.method(options, 'get', () => {
        throw new Error();
      });
      await assert.rejects(run(opts), { name: 'Error' });
    });

    it('should reject due to executorOne error', async () => {
      const opts = {
        collection: 'collection.json',
        environment: 'env.json'
      };

      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(executor, 'executeOne', () => {
        throw new Error('Error message');
      });
      const mockedLogger = mock.method(logger, 'info');

      await assert.rejects(run(opts, true), {
        name: 'Error',
        message: 'Error message'
      });
      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.equal(mockedLogger.mock.callCount(), 0);
    });

    it('should reject due to executorInParallel error', async () => {
      const opts = [
        { collection: 'collection1.json', environment: 'env1.json' },
        { collection: 'collection2.json', environment: 'env2.json' }
      ];

      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(executor, 'executeInParallel', () => {
        throw new Error('Error message');
      });
      const mockedLogger = mock.method(logger, 'info');

      await assert.rejects(run(opts, true), {
        name: 'Error',
        message: 'Error message'
      });
      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Starting collections execution in parallel'
      ]);
      assert.equal(mockedLogger.mock.callCount(), 1);
    });

    it('should reject due to executorInSequence error', async () => {
      const opts = [
        { collection: 'collection1.json', environment: 'env1.json' },
        { collection: 'collection2.json', environment: 'env2.json' }
      ];

      mock.method(options, 'get', () => opts);
      const mockedExecutor = mock.method(executor, 'executeInSequence', () => {
        throw new Error('Error message');
      });
      const mockedLogger = mock.method(logger, 'info');

      await assert.rejects(run(opts, false), {
        name: 'Error',
        message: 'Error message'
      });

      assert.deepEqual(mockedExecutor.mock.calls[0].arguments, [opts]);
      assert.equal(mockedExecutor.mock.callCount(), 1);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Starting collections execution in sequence'
      ]);
      assert.equal(mockedLogger.mock.callCount(), 1);
    });
  });
});
