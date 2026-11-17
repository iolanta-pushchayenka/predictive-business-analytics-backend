import { sequelize } from "../src/db/sequelize.js";
import defineUser from "./users.js";
import defineAnalysis from "./analysis.js";
import defineDatasetProfile from "./datasetProfile.js";
import defineKpiResult from "./kpiResult.js";
import defineCategorySalesPoint from "./categorySalesPoint.js";
import defineSalesTrendPoint from "./salesTrendPoint.js";
import defineEdaSummaryStat from "./edaSummaryStat.js";
import defineEdaCorrelation from "./edaCorrelation.js";
import defineEdaDistributionBin from "./edaDistributionBin.js";
import defineForecast from "./forecast.js";
import defineForecastPoint from "./forecastPoint.js";
import defineSegmentation from "./segmentation.js";
import defineSegmentProfile from "./segmentProfile.js";

const User = defineUser(sequelize);
const Analysis = defineAnalysis(sequelize);
const DatasetProfile = defineDatasetProfile(sequelize);
const KpiResult = defineKpiResult(sequelize);
const SalesTrendPoint = defineSalesTrendPoint(sequelize);
const CategorySalesPoint = defineCategorySalesPoint(sequelize);
const EdaSummaryStat = defineEdaSummaryStat(sequelize);
const EdaCorrelation = defineEdaCorrelation(sequelize);
const EdaDistributionBin = defineEdaDistributionBin(sequelize);
const Forecast = defineForecast(sequelize);
const ForecastPoint = defineForecastPoint(sequelize);
const Segmentation = defineSegmentation(sequelize);
const SegmentProfile = defineSegmentProfile(sequelize);

const models = {
  User,
  Analysis,
  DatasetProfile,
  KpiResult,
  SalesTrendPoint,
  CategorySalesPoint,
  EdaSummaryStat,
  EdaCorrelation,
  EdaDistributionBin,
  Forecast,
  ForecastPoint,
  Segmentation,
  SegmentProfile,
};

for (const model of Object.values(models)) {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
}

export {
  sequelize,
  User,
  Analysis,
  DatasetProfile,
  KpiResult,
  SalesTrendPoint,
  CategorySalesPoint,
  EdaSummaryStat,
  EdaCorrelation,
  EdaDistributionBin,
  Forecast,
  ForecastPoint,
  Segmentation,
  SegmentProfile,
};
export default models;
