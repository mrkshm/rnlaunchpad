import { describe, it, expect } from "@jest/globals";

import { toCamelCase, toSnakeCase } from "~/lib/name-converters";

describe("name-converters", () => {
  it("converts object keys to camelCase", () => {
    const input = { first_name: "John", last_name: "Doe" };
    const expected = { firstName: "John", lastName: "Doe" };
    expect(toCamelCase(input)).toEqual(expected);
  });

  it("converts object keys with multiple underscores to camelCase", () => {
    const input = { first__name: "John", last___name: "Doe" };
    const expected = { firstName: "John", lastName: "Doe" };
    expect(toCamelCase(input)).toEqual(expected);
  });

  it("converts object keys to snake_case", () => {
    const input = { firstName: "John", lastName: "Doe" };
    const expected = { first_name: "John", last_name: "Doe" };
    expect(toSnakeCase(input)).toEqual(expected);
  });
});

it("converts object keys with multiple capital letters to snake_case", () => {
  const input = { FirstNName: "John", LastNName: "Doe" };
  const expected = { first_n_name: "John", last_n_name: "Doe" };
  expect(toSnakeCase(input)).toEqual(expected);
});
