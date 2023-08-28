import _ from 'lodash';

/**
 * Extract selected options in the provided command.
 * Omits commander private variables and other objects.
 *
 * @param {Object} command - Commander.Command Instance
 * @returns {Object} - Extracted options from command
 */
export default {
  commanderToObject: (command) => {
    return _.reduce(
      command,
      (result, value, key) => {
        // Exclude command's private `_` variables and other objects
        const validProp =
          !_.startsWith(key, '_') &&
          !_.includes(['commands', 'options', 'parent'], key);

        validProp && (result[key] = value);

        return result;
      },
      {}
    );
  }
};
