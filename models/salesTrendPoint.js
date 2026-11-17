import { DataTypes } from "sequelize";

export default (sequelize) => {
    const SalesTrendPoint = sequelize.define("SalesTrendPoint", {
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

        sales_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        total_revenue: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {min: 0}
        }
    }, {
        tableName: "sales_trend_points",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["analysis_id", "sales_date"]
            }
        ]
    });

    SalesTrendPoint.associate = (models) => {
        SalesTrendPoint.belongsTo(models.Analysis, { foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
    };

    return SalesTrendPoint;
};
