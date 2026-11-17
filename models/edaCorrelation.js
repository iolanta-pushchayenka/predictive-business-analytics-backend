import { DataTypes } from "sequelize";

export default (sequelize) => {
    const EdaCorrelation = sequelize.define("EdaCorrelation", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
        },

        analysis_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        metric_x: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notOnlyWhitespace(value) {
                    if (value.trim().length === 0) {
                        throw new Error("Metric X cannot be empty");
                    }
                }
            }
        },

        metric_y: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notOnlyWhitespace(value) {
                    if (value.trim().length === 0) {
                        throw new Error("Metric Y cannot be empty");
                    }
                }
            }
        },

        correlation_value: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            validate: {
                min: -1,
                max: 1
            }
        },

        pair_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2
            }
        }
    }, {
        tableName: "eda_correlations",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["analysis_id", "metric_x", "metric_y"]
            }
        ]
    });

    EdaCorrelation.associate = (models) => {
        EdaCorrelation.belongsTo(models.Analysis, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
    };

    return EdaCorrelation;
};
