module.exports = (sequelize, DataTypes) => {
    const Shelf = sequelize.define('Shelf', {
        shelf_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false }
    }, { tableName: 'shelves', timestamps: false });

    return Shelf;
};