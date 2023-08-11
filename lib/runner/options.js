import logger from '../logger';

export function getOptions(options) {
  if (Array.isArray(options)) {
    if (!options.length) {
      const errorMsg = 'provided an empty option list';
      logger.error(errorMsg);
      throw new Error(errorMsg);
    }

    return options.map((opt) => validateOptions(opt));
  } else {
    return validateOptions(options);
  }
}

function isValidOptions(options) {
  if (options.collection && options.environment) {
    return true;
  } else {
    return false;
  }
}

function validateOptions(options) {
  if (!isValidOptions(options)) {
    const errorMsg = `provided invalid options : ${options}`;
    logger.error(errorMsg);
    throw new Error(errorMsg);
  }
  return options;
}
