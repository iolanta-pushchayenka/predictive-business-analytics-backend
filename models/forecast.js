import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Forecast = sequelize.define("Forecast", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
        },

        analysis_id: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },

        train_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2
            }
        },

        test_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },

        model_mae: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false,
            validate: {
                min: 0
            }
        },

        baseline_mae: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: "forecasts",
        timestamps: false
    });

    Forecast.associate = (models) => {
        Forecast.belongsTo(models.Analysis, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
        Forecast.hasMany(models.ForecastPoint, { foreignKey: "forecast_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
    };

    return Forecast;
};
