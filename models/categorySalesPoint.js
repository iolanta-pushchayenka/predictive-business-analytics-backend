
import { DataTypes } from "sequelize";

export default (sequelize) => {
    const CategorySalesPoint = sequelize.define("CategorySalesPoint", {
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

        category_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                notOnlyWhitespace(value) {
                    if (value.trim().length === 0) {
                        throw new Error("Category name cannot be empty");
                    }
                }
            }
        },

        total_revenue: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: "category_sales_points",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["analysis_id", "category_name"]
            }
        ]
    });

    CategorySalesPoint.associate = (models) => {
        CategorySalesPoint.belongsTo(models.Analysis, {
            foreignKey: "analysis_id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    };

    return CategorySalesPoint;
};
