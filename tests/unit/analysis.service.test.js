import { describe, expect, it } from "vitest";
import { prepareDataset } from "../../src/services/analysis.service.js";
import { DATE_FORMATS, AMOUNT_FORMATS } from "analytics-core";

const columns = ["Date", "Sales", "Customer"];

const mapping = {
  date: "Date",
  amount: "Sales",
  customerId: "Customer",
  orderId: "",
  category: "",
};

const formats = {
  date: DATE_FORMATS.YMD_DASH,
  amount: AMOUNT_FORMATS.DOT,
  twoDigitYearCentury: 2000,
};

const validRows = [
  { Date: "2026-01-01", Sales: "100", Customer: "C001" },
  { Date: "2026-01-02", Sales: "200", Customer: "C002" },
];

// Verify real dataset preparation and its response structure.
describe("prepareDataset", () => {
  it("prepares a valid dataset using analytics-core", () => {
    const response = prepareDataset({
      rows: validRows,
      columns,
      mapping,
      formats,
    });

    expect(response.result.preparedRows).toHaveLength(2);
    expect(response.result.report.totalRows).toBe(2);
    expect(response.result.report.validSalesRows).toBe(2);

    expect(response.result.preparedRows[0]).toMatchObject({
      recordNumber: 1,
      dateStatus: "valid",
      amountStatus: "valid",
      validForSales: true,
      customerId: "C001",
    });

    expect(response.result).toHaveProperty("issues");
    expect(response.result).toHaveProperty("outlierAnalysis");
    expect(response.result).toHaveProperty("analysisEligibility");
    expect(response.result).toHaveProperty("integrity");
  });

  // Verify that computation time is returned.
  it("measures computation time", () => {
    const response = prepareDataset({
      rows: validRows,
      columns,
      mapping,
      formats,
    });

    expect(response.metrics.computationMs).toEqual(expect.any(Number));
    expect(Number.isFinite(response.metrics.computationMs)).toBe(true);
    expect(response.metrics.computationMs).toBeGreaterThanOrEqual(0);
  });

  // Reject a mapping that references a missing CSV column.
  it("rejects an invalid column mapping", () => {
    expect(() =>
      prepareDataset({
        rows: validRows,
        columns,
        mapping: { ...mapping, amount: "Unknown" },
        formats,
      }),
    ).toThrow("CSV column not found: Unknown");
  });

  // Reject an empty dataset.
  it("rejects a dataset without rows", () => {
    expect(() =>
      prepareDataset({
        rows: [],
        columns,
        mapping,
        formats,
      }),
    ).toThrow("CSV contains no data rows");
  });

  // Reject missing format settings.
  it("rejects missing format settings", () => {
    expect(() =>
      prepareDataset({
        rows: validRows,
        columns,
        mapping,
        formats: {},
      }),
    ).toThrow("Date and amount formats are required");
  });

  // Preserve data quality issues in the preparation report.
  it("reports invalid dates without crashing", () => {
    const response = prepareDataset({
      rows: [
        { Date: "invalid-date", Sales: "100", Customer: "C001" },
        { Date: "2026-01-02", Sales: "200", Customer: "C002" },
      ],
      columns,
      mapping,
      formats,
    });

    expect(response.result.report.totalRows).toBe(2);
    expect(response.result.report.invalidDates).toBe(1);
    expect(response.result.report.validSalesRows).toBe(1);
    expect(response.result.preparedRows[0].validForSales).toBe(false);
    expect(response.result.preparedRows[1].validForSales).toBe(true);
  });
});
