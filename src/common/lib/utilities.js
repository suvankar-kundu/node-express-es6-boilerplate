export function getValueByPath (obj, path) {
  return path.split('.')
    .reduce((previousValue, currentValue) => {
      return previousValue ? previousValue[currentValue] : undefined;
    }, obj);
}