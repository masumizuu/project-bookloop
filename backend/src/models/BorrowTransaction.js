module.exports = (sequelize, DataTypes) => {
    const BorrowTransaction = sequelize.define('BorrowTransaction', {
        transaction_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: DataTypes.INTEGER, allowNull: false },
        book_id: { type: DataTypes.INTEGER, allowNull: false },
        status: { type: DataTypes.ENUM('Requested', 'Approved', 'Denied'), defaultValue: 'Requested' }, // Added status field
        borrow_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        return_date: { type: DataTypes.DATE, allowNull: false }
    }, { tableName: 'borrow_transactions', timestamps: false });

    return BorrowTransaction;
};