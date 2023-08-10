export function getOptions(options) {
  if (Array.isArray(options)) {
    if (!options.length) {
      throw new Error('No options found');
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
  if (!isValidOptions(options)) throw new Error(`Invalid options ${options}`);
  return options;
}
