import path from 'path';
import { grab } from './util';
import { getCollections } from './scan';
import { run } from './run';
import { measureAsync } from './benchmark';

const environment = grab('-e');
if (!environment) {
  console.error('Usage: node index.js -e <environment> -p [collectionPath]');
  console.error('Please provide an environment');
  process.exit(1);
}

const folder = grab('-p');
const collectionsRoot = 'collections';

const dir = folder ? `${collectionsRoot}/${folder}` : collectionsRoot;

const collections = await getCollections(dir);
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
  console.log(`no collections to run at path ${dir}`);
  process.exit(0);
}
 */

measureAsync(run, 1, false, options, true);
