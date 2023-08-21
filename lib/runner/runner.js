import opt from './options.js';
import logger from '../logger/logger.js';
import executor from './executor.js';

async function run(options, parallel) {
  const opts = opt.get(options);

  if (!Array.isArray(opts)) {
    return executor.executeOne(opts);
  }

  if (parallel) {
    logger.info('Starting collections execution in parallel');
    return executor.executeInParallel(opts);
  } else {
    logger.info('Starting collections execution in sequence');
    return executor.executeInSequence(opts);
  }
}

export { run };
