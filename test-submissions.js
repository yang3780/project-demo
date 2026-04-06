const pool = require('./src/config/db');

async function testSubmissionsTable() {
  try {
    console.log('Testing submissions table...');
    
    // 查询所有提交记录
    const [submissions] = await pool.execute('SELECT * FROM submissions ORDER BY submitted_at DESC');
    
    console.log('Submissions in database:', submissions.length);
    
    if (submissions.length > 0) {
      console.log('Recent submissions:');
      submissions.slice(0, 5).forEach(submission => {
        console.log({
          id: submission.id,
          user_id: submission.user_id,
          question_id: submission.question_id,
          language: submission.language,
          status: submission.status,
          submitted_at: submission.submitted_at
        });
      });
    } else {
      console.log('No submissions found.');
    }
    
    // 查询用户的提交记录
    const [userSubmissions] = await pool.execute('SELECT * FROM submissions WHERE user_id = ? ORDER BY submitted_at DESC', [6]);
    console.log('\nSubmissions for user 6 (testuser_new):', userSubmissions.length);
    
    if (userSubmissions.length > 0) {
      userSubmissions.forEach(submission => {
        console.log({
          id: submission.id,
          question_id: submission.question_id,
          language: submission.language,
          status: submission.status,
          submitted_at: submission.submitted_at
        });
      });
    } else {
      console.log('No submissions found for user 6.');
    }
    
    pool.end();
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error testing submissions table:', error);
    pool.end();
  }
}

testSubmissionsTable();
