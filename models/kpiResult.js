import { DataTypes } from "sequelize";

export default (sequelize) => {
    const KpiResult = sequelize.define("KpiResult", {
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

        total_revenue: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {min: 0}
        },

        total_orders: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {min: 0}
        },

        total_customers: {
            type: DataTypes.INTEGER,
            allowNull: true,
            validate: {min: 0}
        }
    }, {
        tableName: "kpi_results",
        timestamps: false
    });

    KpiResult.associate = (models) => {
        KpiResult.belongsTo(models.Analysis, {foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"
        });
    };

    return KpiResult;
};
