import path from 'node:path';
import opt from './options.js';
import logger from '../logger/logger.js';
import executor from './executor.js';
import collectionModule from '../collections/index.js';

async function run(collectionsPath, options) {
  const collections = await collectionModule.getCollections(collectionsPath);
  const optionList = collections.map((collection) => {
    const collectionName = path.basename(collection, '.json');
    return {
      collection,
      environment: options.environment,
      reporters: ['cli', 'junit', 'htmlextra'],
      reporter: {
        junit: { export: `./reports/junit/${collectionName}_result.xml` },
        htmlextra: {
          export: `./reports/html/${collectionName}_result.html`
        }
      },
      insecure: true
    };
  });

  const params = opt.get(optionList);

  if (!Array.isArray(params)) {
    return executor.executeOne(params);
  }

  if (options.parallel) {
    logger.info('Starting collections execution in parallel');
    return executor.executeInParallel(params);
  } else {
    logger.info('Starting collections execution in sequence');
    return executor.executeInSequence(params);
  }
}

export { run };
