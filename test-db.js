const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('DB Host:', process.env.DB_HOST);
    console.log('DB Port:', process.env.DB_PORT);
    console.log('DB User:', process.env.DB_USER);
    console.log('DB Name:', process.env.DB_NAME);
    
    const pool = mysql.createPool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
    
    // 测试连接
    const connection = await pool.getConnection();
    console.log('Connection successful!');
    
    // 查询数据库版本
    const [rows] = await connection.execute('SELECT version()');
    console.log('MySQL Version:', rows[0]['version()']);
    
    // 查询用户表
    const [users] = await connection.execute('SELECT * FROM users');
    console.log('Users in database:', users);
    
    connection.release();
    pool.end();
    console.log('Test completed successfully!');
  } catch (error) {
    console.error('Error testing database connection:', error);
  }
}

testConnection();