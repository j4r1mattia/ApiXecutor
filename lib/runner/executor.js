import newman from 'newman';
import logger from '../logger/logger.js';

async function executeInParallel(optionsList) {
  const parallelLimit = process.env.PARALLEL_LIMIT || 3; // Default to 3 if not set

  const collectionPools = [];
  const promises = [];

  for (let i = 0; i < optionsList.length; i += parallelLimit) {
    const collectionPool = optionsList.slice(i, i + parallelLimit);
    collectionPools.push(collectionPool);
  }

  for (const collectionPool of collectionPools) {
    const poolPromises = collectionPool.map((collectionOptions) =>
      executeOne(collectionOptions).catch((error) => {
        logger.error(`Error in parallel execution: ${error.message}`);
        return null; // Continue execution despite error
      })
    );

    promises.push(Promise.all(poolPromises));
  }
  // execute one pool at a time, each pool has parallelLimit number of collections running in parallel
  const results = [];
  for (const poolPromises of promises) {
    results.push(await poolPromises);
  }

  return results.flat().filter((result) => result !== null);
}

async function executeInSequence(optionList) {
  const results = [];

  for (const options of optionList) {
    const summary = await executeOne(options).catch((error) => {
      logger.error(`Error in sequentially execution: ${error.message}`);
      return null; // Continue execution despite error
    });
    // Only add to results if there is a summary
    if (summary) results.push(summary);
  }

  return results;
}

async function executeOne(options) {
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

export default {
  executeOne,
  executeInSequence,
  executeInParallel
};
