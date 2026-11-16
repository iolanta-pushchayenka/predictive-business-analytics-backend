import { DataTypes } from "sequelize";

export default (sequelize) => {
    const DatasetProfile = sequelize.define("DatasetProfile", {
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
        filename: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        total_rows: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 0 }
        },
        total_columns: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: { min: 1 }
        },
        min_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },
        max_date: {
            type: DataTypes.DATEONLY,
            allowNull: true
        }
    }, {
        tableName: "dataset_profiles",
        timestamps: false
    });

    DatasetProfile.associate = (models) => {
        DatasetProfile.belongsTo(models.Analysis, {
            foreignKey: "analysis_id",
            onUpdate: "CASCADE",
            onDelete: "CASCADE"
        });
    };

    return DatasetProfile;
};
