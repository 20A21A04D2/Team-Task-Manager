const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

console.log('Database environment diagnostic:');
console.log('Available DB Keys:', Object.keys(process.env).filter(k => k.startsWith('MYSQL') || k.startsWith('DB_') || k.includes('URL')));


if (process.env.DB_DIALECT === 'sqlite') {
  console.log('Connecting via SQLite...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'database.sqlite'),
    logging: false
  });
} else if (process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL) {
  const url = process.env.MYSQL_URL || process.env.MYSQL_PUBLIC_URL || process.env.DATABASE_URL;
  try {
    const parsedUrl = new URL(url);
    console.log(`Connecting via URI: ${parsedUrl.protocol}//${parsedUrl.username}:[HIDDEN]@${parsedUrl.host}${parsedUrl.pathname}`);
  } catch (e) {
    console.log('Connecting via URI (unable to parse URL structure safely)');
  }
  sequelize = new Sequelize(url, {
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
  const port = process.env.DB_PORT || process.env.MYSQLPORT || 3306;
  const db = process.env.DB_NAME || process.env.MYSQLDATABASE || 'team_task_manager';
  const user = process.env.DB_USER || process.env.MYSQLUSER || 'root';
  console.log(`Connecting via config: host=${host}, port=${port}, database=${db}, user=${user}`);
  sequelize = new Sequelize(
    db,
    user,
    process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    {
      host: host,
      port: port,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
}

module.exports = sequelize;
