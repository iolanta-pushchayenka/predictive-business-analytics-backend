import { DataTypes } from "sequelize";

export default (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: sequelize.literal("gen_random_uuid()")
    },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },

        password_hash: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },{
        tableName: "users",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    });


    User.associate = (models) => {
        User.hasMany(models.Analysis, { foreignKey: "user_id", onDelete: "CASCADE" });
    };

    return User;
};