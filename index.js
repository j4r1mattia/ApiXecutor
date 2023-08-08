import * as newman from 'newman';
import * as fs from 'fs';
import * as path from 'path';

const environment = grab('-e');
const folder = grab('-f');
const collectionsRoot = 'collections';

const dir = folder ? `${collectionsRoot}/${folder}` : collectionsRoot;
console.log(dir);

function* walkSync(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      yield* walkSync(path.join(dir, file.name));
    } else {
      yield path.join(dir, file.name);
    }
  }
}

const getAllFiles = function (dirPath, arrayOfFiles = []) {
  for (const filePath of walkSync(dirPath)) {
    arrayOfFiles.push(filePath);
  }

  return arrayOfFiles;
};

console.time('loop fs');
const collections = getAllFiles(dir).filter(
  (file) => path.extname(file) === '.json'
);
console.timeEnd('loop fs');

console.log(collections);

/* newman
  .run({
    collection: `${flow}/${scenario}/IntermediariesQuotationFlowAS-IS.json`,

    environment: `environments/${environment}.json`,
    reporters: ['cli', 'junit', 'htmlextra'],
    reporter: {
      junit: { export: './reports/junit/result.xml' },
      htmlextra: { export: './reports/html/result.html' }
    },
    insecure: true
  })
  .on('done', () => console.log('All test suites completed!'))
  .on('error', (error) => {
    console.error(error);
  });
 */

function grab(flag) {
  const indexAfterFlag = process.argv.indexOf(flag) + 1;
  if (indexAfterFlag === 0) {
    return;
  }
  return process.argv[indexAfterFlag];
}
