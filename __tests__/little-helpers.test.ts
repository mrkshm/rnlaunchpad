import { expect, describe, it } from "@jest/globals";

import {
  removeNullishValues,
  filterUnchangedValues,
  getRedirectUrlAndVerificationType,
} from "~/lib/little-helpers";
import { ActivationSource } from "~/lib/schemas-and-types";

describe("little-helpers", () => {
  // Test for removeNullishValues
  it("removes nullish values from an object", () => {
    const input = { name: "John", age: null, city: undefined, country: "USA" };
    const expected = { name: "John", country: "USA" };
    expect(removeNullishValues(input)).toEqual(expected);
  });

  // Test for filterUnchangedValues
  it("filters unchanged values from a new object", () => {
    const oldObj = { name: "John", age: 30, city: "New York" };
    const newObj = { name: "John", age: 31, city: "New York" };
    const expected = { age: 31 };
    expect(filterUnchangedValues(newObj, oldObj)).toEqual(expected);
  });

  it("removes nullish values from an object with different types of values", () => {
    const input = { name: "John", age: 0, city: false, country: "" };
    const expected = { name: "John", age: 0, city: false, country: "" };
    expect(removeNullishValues(input)).toEqual(expected);
  });

  it("filters unchanged values from a new object with different types of values", () => {
    const oldObj = { name: "John", age: 0, city: false, country: "" };
    const newObj = { name: "John", age: 1, city: true, country: "USA" };
    const expected = { age: 1, city: true, country: "USA" };
    expect(filterUnchangedValues(newObj, oldObj)).toEqual(expected);
  });

  it("filters unchanged values when new object has extra keys", () => {
    const oldObj = { name: "John", age: 30 };
    const newObj = { name: "John", age: 30, city: "New York" };
    const expected = { city: "New York" };
    expect(filterUnchangedValues(newObj, oldObj)).toEqual(expected);
  });

  it("filters unchanged values when old object has extra keys", () => {
    const oldObj = { name: "John", age: 30, city: "New York" };
    const newObj = { name: "John", age: 30 };
    const expected = {};
    expect(filterUnchangedValues(newObj, oldObj)).toEqual(expected);
  });

  // Test for getRedirectUrlAndVerificationType
  it("should return correct values for PasswordChange", () => {
    const result = getRedirectUrlAndVerificationType(
      ActivationSource.PasswordChange
    );
    expect(result).toEqual(["/(protected)/change-password", "email"]);
  });

  it("should return correct values for EmailChange", () => {
    const result = getRedirectUrlAndVerificationType(
      ActivationSource.EmailChange
    );
    expect(result).toEqual(["/(protected)/home", "email_change"]);
  });

  it("should return default values for AccountActivation", () => {
    const result = getRedirectUrlAndVerificationType(
      ActivationSource.AccountActivation
    );
    expect(result).toEqual(["/(protected)/home", "email"]);
  });

  it("should return default values for undefined", () => {
    const result = getRedirectUrlAndVerificationType(undefined);
    expect(result).toEqual(["/(protected)/home", "email"]);
  });

  it("should return correct values for array input", () => {
    const result = getRedirectUrlAndVerificationType([
      ActivationSource.PasswordChange,
      ActivationSource.EmailChange,
    ]);
    expect(result).toEqual(["/(protected)/change-password", "email"]);
  });

  it("should return default values for empty array input", () => {
    const result = getRedirectUrlAndVerificationType([]);
    expect(result).toEqual(["/(protected)/home", "email"]);
  });

  it("should return default values for non-matching string", () => {
    const result = getRedirectUrlAndVerificationType("non_matching_string");
    expect(result).toEqual(["/(protected)/home", "email"]);
  });
});
