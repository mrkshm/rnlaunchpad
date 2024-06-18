import { describe, expect, it, jest } from "@jest/globals";
import { generateFilename } from "~/lib/supabase-file-helpers";

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

describe("generateFilename", () => {
  it("should generate a filename with the correct format", () => {
    const filename = generateFilename("test.jpg");
    const filenameParts = filename.split("-");
    // Check if the original name is included in the new filename
    expect(filenameParts[0]).toBe("test");
    // Check if a random string is included in the new filename
    const randomString = filenameParts[1];
    expect(randomString).toHaveLength(5);
    // Check if a timestamp is included in the new filename
    const timestamp = filenameParts[2].split(".")[0];
    expect(Number(timestamp)).toBeGreaterThan(0);
    // Check if the extension is included in the new filename
    const extension = filenameParts[2].split(".")[1];
    expect(extension).toBe("jpg");
  });
  it("should correctly handle filenames with multiple periods", () => {
    const filename = generateFilename("test.part1.part2.jpg");
    const filenameParts = filename.split("-");
    // Check if the original name is included in the new filename
    expect(filenameParts[0]).toBe("test.part1.part2");
    // Check if the extension is included in the new filename
    const extension = filenameParts[2].split(".")[1];
    expect(extension).toBe("jpg");
  });
  it("should correctly handle very long filenames", () => {
    const longName = "a".repeat(100);
    const filename = generateFilename(`${longName}.jpg`);
    const filenameParts = filename.split("-");
    // Check if the original name is included in the new filename
    // and it's truncated to 16 characters
    expect(filenameParts[0]).toBe(longName.substring(0, 16));
    // Check if the extension is included in the new filename
    const extension = filenameParts[2].split(".")[1];
    expect(extension).toBe("jpg");
  });
});
