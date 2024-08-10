const Sequelize = require('sequelize');

const sequelize = new Sequelize('node_course', 'root', 'password', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;