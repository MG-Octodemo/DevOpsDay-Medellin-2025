const { Sequelize } = require('sequelize');

// Initialize Sequelize with PostgreSQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'devopsdays',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'postgres',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Import models
const Talk = require('./talk.model')(sequelize);
const User = require('./user.model')(sequelize);
const Registration = require('./registration.model')(sequelize);

// Define relationships
Talk.hasMany(Registration, { foreignKey: 'talkId' });
Registration.belongsTo(Talk, { foreignKey: 'talkId' });

User.hasMany(Registration, { foreignKey: 'userId' });
Registration.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  Talk,
  User,
  Registration
};