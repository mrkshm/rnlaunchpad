import { describe, expect, it, jest } from "@jest/globals";

import { SupportedLanguage } from "~/lib/constants";
import * as catalogs from "~/lib/language-catalogs";
import { loadCatalog } from "~/hooks/use-activate-locale";

jest.mock("~/lib/env", () => ({
  safeEnvs: {
    userBucket: "testBucket",
  },
}));

jest.mock("~/lib/supabase-client", () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        remove: jest.fn(),
      })),
    },
  },
}));

describe("loadCatalog", () => {
  it("should return the catalog for a supported language", () => {
    const language: SupportedLanguage = "en";
    const catalog = loadCatalog(language);
    expect(catalog).toEqual(catalogs[language]);
  });

  it("should throw an error for an unsupported language", () => {
    // @ts-expect-error
    const language: SupportedLanguage = "dk";
    expect(() => loadCatalog(language)).toThrow(
      `Unsupported language: ${language}`
    );
  });

  it("should throw an error if the language has no dictionary", () => {
    // @ts-expect-error
    const language: SupportedLanguage = "noDictionary";
    expect(() => loadCatalog(language)).toThrow(
      `Unsupported language: ${language}`
    );
  });
});
