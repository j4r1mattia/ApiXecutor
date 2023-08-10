export function grab(flag) {
  const indexAfterFlag = process.argv.indexOf(flag) + 1;
  if (indexAfterFlag === 0) {
    return;
  }
  return process.argv[indexAfterFlag];
}
