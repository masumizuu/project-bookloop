module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, unique: true },
        password: { type: DataTypes.STRING },
        user_type: { type: DataTypes.ENUM('USER', 'ADMIN'), allowNull: false },
        profile_picture: { type: DataTypes.STRING },
        date_registered: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
    }, { tableName: 'users', timestamps: false });

    return User;
};