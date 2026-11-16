import { DataTypes } from "sequelize";

export default (sequelize) => {
    const EdaDistributionBin = sequelize.define("EdaDistributionBin", {
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

        metric_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notOnlyWhitespace(value) {
                    if (value.trim().length === 0) {
                        throw new Error("Metric name cannot be empty");
                    }
                }
            }
        },

        bin_index: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },

        bin_start: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        bin_end: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        frequency: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: "eda_distribution_bins",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["analysis_id", "metric_name", "bin_index"]
            }
        ]
    });

    EdaDistributionBin.associate = (models) => {
        EdaDistributionBin.belongsTo(models.Analysis, {foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
    };

    return EdaDistributionBin;
};
