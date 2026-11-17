import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Analysis = sequelize.define("Analysis", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
    },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(255),
            allowNull: false
        }
    },{
        tableName: "analyses",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });


    Analysis.associate = (models) => {
        Analysis.belongsTo(models.User, { foreignKey: "user_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
        Analysis.hasOne(models.DatasetProfile, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Analysis.hasOne(models.KpiResult, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Analysis.hasMany(models.SalesTrendPoint, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Analysis.hasMany(models.CategorySalesPoint, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Analysis.hasMany(models.EdaSummaryStat, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Analysis.hasMany(models.EdaCorrelation, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
        Analysis.hasMany(models.EdaDistributionBin, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
        Analysis.hasOne(models.Forecast, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
        Analysis.hasOne(models.Segmentation, {foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
    };

    return Analysis;
};
