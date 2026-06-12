import { parseWpBoolean } from "@/services/wp/wpConfigUtils";

describe("parseWpBoolean", () => {
  it.each([
    [true, true],
    [false, false],
    [1, true],
    [0, false],
    ["1", true],
    ["true", true],
    ["", false],
    ["false", false],
    [null, false],
    [undefined, false],
  ] as const)("parses %p as %p", (input, expected) => {
    expect(parseWpBoolean(input)).toBe(expected);
  });
});
