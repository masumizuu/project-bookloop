const initModels = require('../models');
const jwt = require('jsonwebtoken');  // Make sure you imported this
const { getSequelizeInstance } = require('../config/db');

exports.authenticateUser = async (req, res, next) => {

    console.log("==== Incoming Headers ====");
    console.log("Authorization header is:", req.headers.authorization);
    console.log("=========================");

    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

        const sequelize = getSequelizeInstance(); //Bryan's comment: get sequelize instance
        const models = await initModels(sequelize);// You forgot to pass sequelize to initModels xD
        const { User } = models;

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.user_id);

        if (!user) return res.status(401).json({ error: 'Invalid token' });

        // Fix: Use plain object (no Sequelize instance methods)
        req.user = user.toJSON();  // ✅ This is key

        console.log('Authenticated User:', req.user);  // Debug log

        next();
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};

exports.requireAdmin = async (req, res, next) => {
    console.log('User received in requireAdmin:', req.user);

    if (req.user.user_type !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. Admins only.' });
    }
    next();
};

