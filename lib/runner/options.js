import logger from '../logger/logger.js';

function isValidOptions(options) {
  return options.collection && options.environment;
}

function validateOptions(options) {
  if (!isValidOptions(options)) {
    const errorMsg = `Provided invalid options: ${JSON.stringify(options)}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  return options;
}

function processOptions(options) {
  if (!Array.isArray(options)) {
    return [validateOptions(options)];
  }

  if (options.length === 0) {
    const errorMsg = 'Provided an empty option list';
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }

  return options.map(validateOptions);
}

export default { get: processOptions };
