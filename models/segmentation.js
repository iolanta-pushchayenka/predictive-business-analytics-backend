import { DataTypes } from "sequelize";

export default (sequelize) => {
    const Segmentation = sequelize.define("Segmentation", {
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

        cluster_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 2
            }
        },

        customers_analyzed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        silhouette_score: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true,
            validate: {
                min: -1,
                max: 1
            }
        }
    }, {
        tableName: "segmentations",
        timestamps: false
    });

    Segmentation.associate = (models) => {
        Segmentation.belongsTo(models.Analysis, {foreignKey: "analysis_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
        Segmentation.hasMany(models.SegmentProfile, { foreignKey: "segmentation_id", onUpdate: "CASCADE", onDelete: "CASCADE"});
    };

    return Segmentation;
};
