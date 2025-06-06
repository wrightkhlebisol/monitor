const { isRecordStringUnknown, fetchStatus } = require("../build/index.js");

describe("#typeGuards", () => {
  it("should return true for plain objects", () => {
    expect(isRecordStringUnknown({ a: "b" })).toBe(true);
  });

  it("should return false for a non-objects", () => {
    expect(isRecordStringUnknown(["a", "b"])).toBe(false);
    expect(isRecordStringUnknown("a")).toBe(false);
    expect(isRecordStringUnknown(1)).toBe(false);
  })
})

describe('#fetchStatus', () => {
  it("returns ok status for valid response", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ foo: bar })
    });

    const result = await fetchStatus("http://test");
    expect(result.status).toBe("ok");
    expect(result.data).toEqual({ foo: "bar" });
  });

  it("returns error status for HTTP error", async () => {
    global.fetch.mockResolvedValue({ ok: false, status: 500 });

    const result = await fetchStatus("http://test");
    expect(result.status).toBe("error");
    expect(result.error).toMatch(/HTTP 500/);

  })
})