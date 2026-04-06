const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkQuestions() {
  try {
    console.log('Checking questions in database...');
    
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
    
    const [questions] = await connection.execute('SELECT * FROM questions');
    console.log('Questions found:', questions.length);
    
    if (questions.length > 0) {
      console.log('\nQuestion details:');
      questions.forEach(q => {
        console.log(`\nID: ${q.id}`);
        console.log(`Title: ${q.title}`);
        console.log(`Sample Input: ${q.sample_input}`);
        console.log(`Sample Output: ${q.sample_output}`);
      });
    } else {
      console.log('No questions found! Let\'s add a test question...');
      
      const sampleInput = `4
2 7 11 15
9`;
      
      const sampleOutput = `0 1`;
      
      await connection.execute(
        'INSERT INTO questions (title, description, input_format, output_format, sample_input, sample_output, difficulty, score, type, time_limit, memory_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          '两数之和',
          '给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。',
          '第一行输入数组长度 n，第二行输入 n 个整数，第三行输入目标值 target',
          '输出两个整数，用空格分隔，表示答案的下标',
          sampleInput,
          sampleOutput,
          'easy',
          100,
          'algorithm',
          1000,
          256000
        ]
      );
      
      console.log('Test question added successfully with ID 1!');
    }
    
    connection.release();
    pool.end();
    console.log('\nCheck completed!');
  } catch (error) {
    console.error('Error checking questions:', error);
  }
}

checkQuestions();