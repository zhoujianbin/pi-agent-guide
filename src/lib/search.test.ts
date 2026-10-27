import { describe, expect, it } from "vitest";
import { searchDocs } from "./search";

describe("全站搜索", () => {
  it("能检索到国产模型选型指南", () => {
    const results = searchDocs("国产模型 方舟");

    expect(results.some((entry) => entry.to === "/model-guide/")).toBe(true);
  });
});
