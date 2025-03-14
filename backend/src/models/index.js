const {Sequelize} = require("sequelize");

async function initModels(sequelize) {
    const models = {
        User: require('./User')(sequelize, Sequelize),
        Book: require('./Book')(sequelize, Sequelize),
        Shelf: require('./Shelf')(sequelize, Sequelize),
        BorrowTransaction: require('./BorrowTransaction')(sequelize, Sequelize),
    };

    // Associations
    models.User.hasMany(models.Book, { foreignKey: 'owner_id', onDelete: 'CASCADE' });
    models.Book.belongsTo(models.User, { foreignKey: 'owner_id' });

    models.User.hasOne(models.Shelf, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    models.Shelf.belongsTo(models.User, { foreignKey: 'user_id' });

    models.Shelf.belongsToMany(models.Book, { through: 'ShelfBooks', foreignKey: 'shelf_id' });
    models.Book.belongsToMany(models.Shelf, { through: 'ShelfBooks', foreignKey: 'book_id' });

    models.User.hasMany(models.BorrowTransaction, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    models.BorrowTransaction.belongsTo(models.User, { foreignKey: 'user_id' });

    models.Book.hasMany(models.BorrowTransaction, { foreignKey: 'book_id', onDelete: 'CASCADE' });
    models.BorrowTransaction.belongsTo(models.Book, { foreignKey: 'book_id' });

    return { sequelize, ...models };
}

module.exports = initModels;