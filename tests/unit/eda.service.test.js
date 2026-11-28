import { describe, expect, it } from "vitest";
import { DATE_FORMATS, AMOUNT_FORMATS } from "analytics-core";
import { runEda } from "../../src/services/eda.service.js";

const validBody = {
  rows: [
    { Date: "2026-01-01", Sales: "100" },
    { Date: "2026-01-02", Sales: "200" },
    { Date: "2026-02-01", Sales: "300" },
  ],
  columns: ["Date", "Sales"],
  mapping: {
    date: "Date",
    amount: "Sales",
    customerId: "",
    orderId: "",
    category: "",
  },
  formats: {
    date: DATE_FORMATS.YMD_DASH,
    amount: AMOUNT_FORMATS.DOT,
    twoDigitYearCentury: 2000,
  },
};

describe("runEda", () => {
  // Calculate real EDA results using analytics-core.
  it("calculates EDA for a valid dataset", () => {
    const response = runEda(validBody);

    expect(response.eda).toBeDefined();
    expect(response.eda).toHaveProperty("totalRevenue");
    expect(response.eda).toHaveProperty("monthlySales");
    expect(response.eda).toHaveProperty("salesDistribution");
    expect(response.eda).toHaveProperty("correlationAnalysis");

    expect(response.eda.monthlySales).toEqual(expect.any(Array));
    expect(response.eda.monthlySales.length).toBeGreaterThan(0);
  });

  // Return the original data quality diagnostics.
  it("returns data quality information", () => {
    const response = runEda(validBody);

    expect(response.dataQuality.report.totalRows).toBe(3);
    expect(response.dataQuality.report.validSalesRows).toBe(3);
    expect(response.dataQuality).toHaveProperty("issues");
    expect(response.dataQuality).toHaveProperty("integrity");
    expect(response.dataQuality).toHaveProperty("analysisEligibility");
  });

  // Measure preparation and EDA computation time.
  it("returns valid computation metrics", () => {
    const response = runEda(validBody);

    for (const metric of ["preparationMs", "edaMs", "totalMs"]) {
      expect(Number.isFinite(response.metrics[metric])).toBe(true);
      expect(response.metrics[metric]).toBeGreaterThanOrEqual(0);
    }

    expect(response.metrics.totalMs).toBeGreaterThanOrEqual(
      response.metrics.edaMs,
    );
  });

  // Reject invalid mapping through the shared preparation logic.
  it("rejects an invalid column mapping", () => {
    expect(() =>
      runEda({
        ...validBody,
        mapping: {
          ...validBody.mapping,
          amount: "Unknown",
        },
      }),
    ).toThrow("CSV column not found: Unknown");
  });

  // Preserve the data quality report when a CSV row is invalid.
  it("handles invalid dates without crashing", () => {
    const response = runEda({
      ...validBody,
      rows: [
        { Date: "invalid-date", Sales: "100" },
        { Date: "2026-01-02", Sales: "200" },
      ],
    });

    expect(response.dataQuality.report.invalidDates).toBe(1);
    expect(response.dataQuality.report.validSalesRows).toBe(1);
  });

  // Verify exact revenue and monthly aggregation results.
  it("calculates correct revenue and monthly sales", () => {
    const response = runEda(validBody);

    expect(response.eda.totalRevenue).toBe("600");

    expect(response.eda.monthlySales).toEqual([
      { month: "2026-01", revenue: 300 },
      { month: "2026-02", revenue: 300 },
    ]);
  });

  // Include negative amounts in net revenue.
  it("calculates net revenue with negative amounts", () => {
    const response = runEda({
      ...validBody,
      rows: [
        { Date: "2026-01-01", Sales: "100.50" },
        { Date: "2026-01-02", Sales: "-20.25" },
      ],
    });

    expect(response.eda.totalRevenue).toBe("80.25");

    expect(response.eda.monthlySales).toEqual([
      { month: "2026-01", revenue: 80.25 },
    ]);
  });

  // Preserve decimal precision when calculating total revenue.
  it("calculates fractional revenue without floating-point errors", () => {
    const response = runEda({
      ...validBody,
      rows: [
        { Date: "2026-01-01", Sales: "0.10" },
        { Date: "2026-01-02", Sales: "0.20" },
      ],
    });

    expect(response.eda.totalRevenue).toBe("0.3");
  });
});
