import { DataTypes } from "sequelize";

export default (sequelize) => {
    const SegmentProfile = sequelize.define("SegmentProfile", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
        },

        segmentation_id: {
            type: DataTypes.UUID,
            allowNull: false
        },

        cluster_label: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        },

        customer_count: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },

        avg_recency: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        },

        avg_frequency: {
            type: DataTypes.DECIMAL(12, 2),
            allowNull: false,
            validate: {
                min: 1
            }
        },

        avg_monetary: {
            type: DataTypes.DECIMAL(18, 2),
            allowNull: false,
            validate: {
                min: 0
            }
        }
    }, {
        tableName: "segment_profiles",
        timestamps: false,
        indexes: [
            {
                unique: true,
                fields: ["segmentation_id", "cluster_label"]
            }
        ]
    });

    SegmentProfile.associate = (models) => {
        SegmentProfile.belongsTo(models.Segmentation, { foreignKey: "segmentation_id", onUpdate: "CASCADE", onDelete: "CASCADE" });
    };

    return SegmentProfile;
};
