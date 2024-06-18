import { camelCase, snakeCase, mapKeys } from "lodash";

export function toCamelCase(obj: Record<string, any>) {
  return mapKeys(obj, (value, key) => camelCase(key));
}

export function toSnakeCase(obj: Record<string, any>) {
  return mapKeys(obj, (value, key) => snakeCase(key));
}
