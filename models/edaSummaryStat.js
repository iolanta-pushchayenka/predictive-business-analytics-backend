import { DataTypes } from "sequelize";

export default (sequelize) => {
    const EdaSummaryStat = sequelize.define("EdaSummaryStat", {
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

        valid_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        },

        missing_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0 }
        },

        min_value: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        max_value: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        mean_value: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        median_value: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false
        },

        std_dev: {
            type: DataTypes.DECIMAL(20, 6),
            allowNull: false,
            validate: { min: 0 }
        }
    }, {
        tableName: "eda_summary_stats",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["analysis_id", "metric_name"]
            }
        ]
    });

    EdaSummaryStat.associate = (models) => {
        EdaSummaryStat.belongsTo(models.Analysis, {
            foreignKey: "analysis_id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    };

    return EdaSummaryStat;
};
