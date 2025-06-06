import { isRecordStringUnknown } from "./index";

describe("Type guards", () => {
  it("should return true for plain objects", () => {
    expect(isRecordStringUnknown({ a: "b" })).toBe(true);
  });

  it("should return false for a non-objects", () => {
    expect(isRecordStringUnknown(["a", "b"])).toBe(false);
    expect(isRecordStringUnknown("a")).toBe(false);
    expect(isRecordStringUnknown(1)).toBe(false);
  })
})