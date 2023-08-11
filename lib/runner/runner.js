import newman from 'newman';
import { getOptions } from './options';
import logger from '../logger';

const parallelLimit = process.env.PARALLEL_LIMIT || 3; // Default to 3 if not set

export async function run(options, parallel) {
  const opts = getOptions(options);

  if (!Array.isArray(opts)) {
    return executeInstance(opts);
  }

  if (parallel) {
    logger.info('Starting collections execution in parallel');
    return runInParallel(opts);
  } else {
    logger.info('Starting collections execution in sequence');
    return runInSequence(opts);
  }
}

async function runInParallel(optionsList) {
  const collectionPools = [];
  const promises = [];

  for (let i = 0; i < optionsList.length; i += parallelLimit) {
    const collectionPool = optionsList.slice(i, i + parallelLimit);
    collectionPools.push(collectionPool);
  }

  for (const collectionPool of collectionPools) {
    const poolPromises = collectionPool.map((collectionOptions) =>
      executeInstance(collectionOptions).catch((error) => {
        logger.error(`Error in parallel execution: ${error.message}`);
        return null; // Continue execution despite error
      })
    );

    promises.push(Promise.all(poolPromises));
  }

  const results = await Promise.all(promises);
  return results.flat().filter((result) => result !== null);
}

async function runInSequence(optionList) {
  const results = [];

  for (const options of optionList) {
    const summary = await executeInstance(options);
    results.push(summary);
  }

  return results;
}

async function executeInstance(options) {
  logger.info(`Executing ${options.collection}`);
  return new Promise((resolve, reject) => {
    newman.run(options, (error, summary) => {
      if (error) {
        reject(error);
      } else {
        resolve(summary);
      }
    });
  });
}
