import path from 'node:path';
import { grab } from './util.js';
import { getCollections } from './collections.js';
import runner from './runner';
import { measureAsync } from './benchmark.js';
import logger from './logger.js';

const environment = grab('-e');
if (!environment) {
  logger.error('Usage: node index.js -e <environment> -p <collectionPath>');
  logger.error('Please provide an environment');
  process.exit(1);
}

const collectionPath = grab('-p');
if (!collectionPath) {
  logger.error('Usage: node index.js -e <environment> -p <collectionPath>');
  logger.error('Please provide a collectionPath');
  process.exit(1);
}

const collections = await getCollections(collectionPath);

const options = collections.map((collection) => {
  const collectionName = path.basename(collection, '.json');
  return {
    collection,
    environment: `environments/${environment}.json`,
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

/* if (collections.length > 1) {
  runInParallel(options);
} else if (collections.length === 1) {
  run(options[0]);
} else {
  logger.log(`no collections to run at path ${dir}`);
  process.exit(0);
}
 */

measureAsync(runner.run, 1, false, options, true);
