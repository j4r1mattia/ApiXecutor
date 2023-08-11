import logger from '../logger';

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

export function getOptions(options) {
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
