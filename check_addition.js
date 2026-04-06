const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkAdditionQuestion() {
  try {
    console.log('Checking addition question...');
    
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
    
    const connection = await pool.getConnection();
    
    const [questions] = await connection.execute('SELECT * FROM questions WHERE id = 5');
    if (questions.length > 0) {
      const q = questions[0];
      console.log('\n加法题详情：');
      console.log(`ID: ${q.id}`);
      console.log(`Title: ${q.title}`);
      console.log(`Sample Input: ${JSON.stringify(q.sample_input)}`);
      console.log(`Sample Output: ${JSON.stringify(q.sample_output)}`);
    }
    
    connection.release();
    pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkAdditionQuestion();