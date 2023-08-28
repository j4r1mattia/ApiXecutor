import semver from 'semver';
import pkg from '../../package.json' assert { type: 'json' };
import logger from '../logger/index.js';

/**
 * The required node version from package.json.
 *
 * @type {String}
 * @readOnly
 */
const requiredNodeVersion = pkg && pkg.engines && pkg.engines.node;

/**
 * The current node version as detected from running process.
 *
 * @type {String}
 * @readOnly
 */
const currentNodeVersion = process && process.version;

// if either current or required version is not detected, we bail out
export default function checkNodeVersion() {
  if (!requiredNodeVersion) {
    logger.error(
      'no required node version found. please add engines.node section in the package.json '
    );
    process.exit(1);
  }

  if (!currentNodeVersion) {
    logger.error('no current node version found');
    process.exit(1);
  }

  // we check semver satisfaction and throw error on mismatch
  if (!semver.satisfies(currentNodeVersion, requiredNodeVersion)) {
    logger.error(`required node version: ${requiredNodeVersion}`);
    process.exit(1);
  }
}
