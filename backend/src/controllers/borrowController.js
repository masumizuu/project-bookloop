const initModels = require('../models');
const {getSequelizeInstance} = require("../config/db");

exports.borrowBook = async (req, res) => {
    try {
        const sequelize = getSequelizeInstance();
        const models = await initModels(sequelize);
        const { BorrowTransaction, Book } = models;

        const book = await Book.findByPk(req.body.book_id);
        if (!book || book.status !== 'Available') {
            return res.status(400).json({ error: 'Book is not available for borrowing' });
        }

        const borrowTransaction = await BorrowTransaction.create({
            user_id: req.body.user_id,
            book_id: req.body.book_id,
            status: 'Requested', // Borrow request initially marked as "Requested"
            return_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 3 months from now
        });

        await book.update({ status: 'Requested' });

        res.status(201).json({ message: 'Book request sent', borrowTransaction });
    } catch (error) {
        res.status(500).json({ error: 'Failed to borrow book' });
    }
};
