import newman from 'newman';
import { getOptions } from './options';

export async function run(options, parallel) {
  const opts = getOptions(options);
  let runner;

  if (Array.isArray(opts)) {
    if (parallel) {
      runner = runInParallel(opts);
    } else {
      runner = runInSequence(opts);
    }
  } else {
    runner = runInstance(opts);
  }

  return runner;
}

async function runInParallel(optionsList) {
  const parallelLimit = 3;
  const collectionPools = [];
  const promises = [];

  for (let i = 0; i < optionsList.length; i += parallelLimit) {
    const collectionPool = optionsList.slice(i, i + parallelLimit);
    collectionPools.push(collectionPool);
  }

  for (const collectionPool of collectionPools) {
    const poolPromises = collectionPool.map((collectionOptions) =>
      runInstance(collectionOptions)
    );

    promises.push(Promise.all(poolPromises));
  }

  const results = await Promise.all(promises);
  return results.flat();
}

async function runInSequence(optionList) {
  const results = [];

  for (const options of optionList) {
    const summary = await runInstance(options);
    results.push(summary);
  }

  return results;
}

function runInstance(options) {
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
