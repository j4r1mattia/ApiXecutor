import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';
import executor from '../executor.js';
import logger from '../../logger/logger.js';
import newman from 'newman';

describe('executor module', () => {
  describe('executeInParallel method', () => {
    it('should resolve successfully 2 execution', async () => {
      const expected = ['summary1', 'summary2'];
      const opt = [
        { collection: 'collection1.json' },
        { collection: 'collection2.json' }
      ];

      // mock executor  method  to return summary1 and summary2 respectively  for collection1.json and collection2.json
      const mockNewman = mock.method(newman, 'run');
      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[0]),
        0
      );

      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[1]),
        1
      );

      const mockedLogger = mock.method(logger, 'info');

      const actual = await executor.executeInParallel(opt);
      assert.deepEqual(actual, expected);
      assert.equal(mockNewman.mock.callCount(), 2);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Executing collection1.json'
      ]);
      assert.deepEqual(mockedLogger.mock.calls[1].arguments, [
        'Executing collection2.json'
      ]);
    });

    it('should resolve successfully 1 execution and 1 error', async () => {
      const expected = ['summary1'];
      const opt = [
        { collection: 'collection1.json' },
        { collection: 'collection2.json' }
      ];

      // mock executor  method  to return summary1 and summary2 respectively  for collection1.json and collection2.json
      const mockNewman = mock.method(newman, 'run');
      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[0]),
        0
      );

      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(new Error('error')),
        1
      );

      const mockedLoggerError = mock.method(logger, 'error');
      const mockedLoggerInfo = mock.method(logger, 'info');

      const actual = await executor.executeInParallel(opt);
      assert.deepEqual(actual, expected);
      assert.equal(mockNewman.mock.callCount(), 2);
      assert.deepEqual(mockedLoggerInfo.mock.calls[0].arguments, [
        'Executing collection1.json'
      ]);
      assert.deepEqual(mockedLoggerInfo.mock.calls[1].arguments, [
        'Executing collection2.json'
      ]);
      assert.deepEqual(mockedLoggerError.mock.calls[0].arguments, [
        'Error in parallel execution: error'
      ]);
    });
  });
  describe('executeInSequence method', () => {
    it('should resolve successfully 2 execution', async () => {
      const expected = ['summary1', 'summary2'];
      const opt = [
        { collection: 'collection1.json' },
        { collection: 'collection2.json' }
      ];

      // mock executor  method  to return summary1 and summary2 respectively  for collection1.json and collection2.json
      const mockNewman = mock.method(newman, 'run');
      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[0]),
        0
      );

      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[1]),
        1
      );

      const mockedLogger = mock.method(logger, 'info');

      const actual = await executor.executeInSequence(opt);
      assert.deepEqual(actual, expected);
      assert.equal(mockNewman.mock.callCount(), 2);
      assert.deepEqual(mockedLogger.mock.calls[0].arguments, [
        'Executing collection1.json'
      ]);
      assert.deepEqual(mockedLogger.mock.calls[1].arguments, [
        'Executing collection2.json'
      ]);
    });
    it('should resolve successfully 1 execution and 1 error', async () => {
      const expected = ['summary1'];
      const opt = [
        { collection: 'collection1.json' },
        { collection: 'collection2.json' }
      ];

      // mock executor  method  to return summary1 and summary2 respectively  for collection1.json and collection2.json
      const mockNewman = mock.method(newman, 'run');
      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(null, expected[0]),
        0
      );

      mockNewman.mock.mockImplementationOnce(
        async (opts, callback) => callback(new Error('error')),
        1
      );

      const mockedLoggerError = mock.method(logger, 'error');
      const mockedLoggerInfo = mock.method(logger, 'info');

      const actual = await executor.executeInSequence(opt);
      assert.deepEqual(actual, expected);
      assert.equal(mockNewman.mock.callCount(), 2);
      assert.deepEqual(mockedLoggerInfo.mock.calls[0].arguments, [
        'Executing collection1.json'
      ]);
      assert.deepEqual(mockedLoggerInfo.mock.calls[1].arguments, [
        'Executing collection2.json'
      ]);
      assert.deepEqual(mockedLoggerError.mock.calls[0].arguments, [
        'Error in sequentially execution: error'
      ]);
    });
  });
});
