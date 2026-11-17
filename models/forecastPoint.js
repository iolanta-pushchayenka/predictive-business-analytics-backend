import { DataTypes } from "sequelize";

export default (sequelize) => {
    const ForecastPoint = sequelize.define("ForecastPoint", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
        },

        forecast_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        forecast_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        predicted_revenue: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: "forecast_points",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["forecast_id", "forecast_date"]
            }
        ]
    });

    ForecastPoint.associate = (models) => {
        ForecastPoint.belongsTo(models.Forecast, { foreignKey: "forecast_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
    };

    return ForecastPoint;
};
