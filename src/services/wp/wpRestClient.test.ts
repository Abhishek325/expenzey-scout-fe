import { describe, expect, it } from "vitest";
import { buildWpRestUrl } from "@/services/wp/wpRestClient";

describe("buildWpRestUrl", () => {
  it("appends route and query params for plain permalinks (rest_route)", () => {
    const url = buildWpRestUrl(
      "http://localhost:8080/index.php?rest_route=/expenzey/v1/",
      "/dashboard/metrics?start=2024-05-18T00:00:00.000Z&end=2024-05-25T00:00:00.000Z"
    );

    expect(url).toBe(
      "http://localhost:8080/index.php?rest_route=%2Fexpenzey%2Fv1%2Fdashboard%2Fmetrics&start=2024-05-18T00%3A00%3A00.000Z&end=2024-05-25T00%3A00%3A00.000Z"
    );
  });

  it("appends route for pretty permalinks (/wp-json/…)", () => {
    const url = buildWpRestUrl(
      "http://localhost:8080/wp-json/expenzey/v1/",
      "/dashboard/snapshot"
    );

    expect(url).toBe("http://localhost:8080/wp-json/expenzey/v1/dashboard/snapshot");
  });

  it("preserves extra query params on pretty permalinks", () => {
    const url = buildWpRestUrl(
      "http://localhost:8080/wp-json/expenzey/v1/",
      "/dashboard/revenue?start=2024-01-01T00:00:00.000Z&end=2024-01-07T00:00:00.000Z&granularity=daily"
    );

    expect(url).toContain("/wp-json/expenzey/v1/dashboard/revenue?");
    expect(url).toContain("start=2024-01-01");
    expect(url).toContain("granularity=daily");
  });
});
