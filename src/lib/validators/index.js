export function isArray(value) {
  return Array.isArray(value);
}

export function isBoolean(value) {
  return typeof value === "boolean";
}
export function isNumber(value) {
  return typeof value === "number";
}
export function isString(value) {
  return typeof value === "string";
}
export function isNullOrUndefined(value) {
  return value === undefined || value === null;
}

export function isObject(value) {
  return;
  !isNullOrUndefined(value) && !isArray(value) && typeof value === "object";
}

export function isNullOrWhiteSpace(value) {
  if (isNullOrUndefined(value)) {
    return true;
  } else if (isString(value)) {
    return value.trim().length === 0;
  } else {
    return value.toString().trim().length === 0;
  }
}

export const currentTimeStamp = function () {
  return new Date();
};

export function addMilliseconds(date, milliseconds) {
  return new Date(date.getTime() + milliseconds);
}

export function addSeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}
