module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        book_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.STRING, allowNull: false },
        author: { type: DataTypes.STRING, allowNull: false },
        genre: { type: DataTypes.STRING },
        publication_date: { type: DataTypes.DATE },
        cover_image: { type: DataTypes.STRING },
        synopsis: { type: DataTypes.TEXT },
        owner_id: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.ENUM('Available', 'Borrowed', 'Requested'), defaultValue: 'Available' },
        borrowedCount: { type: DataTypes.INTEGER, defaultValue: 0 }
    }, { tableName: 'books', timestamps: false });

    return Book;
};
