const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

const testUser = {
  username: 'testuser_new',
  password: 'password123'
};

const correctPythonCode = `a, b = map(int, input().split())
print(a + b)`;

const wrongPythonCode = `a, b = map(int, input().split())
print(a - b)`;

async function testAdditionQuestion() {
  try {
    console.log('=== 加法题判题测试开始 ===\n');
    
    console.log('1. 登录获取token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, testUser);
    const token = loginResponse.data.token;
    console.log('登录成功\n');
    
    console.log('2. 测试正确的 Python 加法代码...');
    const correctResult = await testCodeSubmission(token, correctPythonCode, 'python', '正确的加法代码');
    
    console.log('\n3. 测试错误的 Python 加法代码...');
    const wrongResult = await testCodeSubmission(token, wrongPythonCode, 'python', '错误的加法代码');
    
    console.log('\n=== 测试总结 ===');
    console.log(`正确代码测试结果: ${correctResult} (期望: AC)`);
    console.log(`错误代码测试结果: ${wrongResult} (期望: WA)`);
    
    const allPassed = correctResult === 'AC' && wrongResult === 'WA';
    console.log(`\n整体测试: ${allPassed ? '通过' : '失败'}`);
    
  } catch (error) {
    console.error('测试过程中出错:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

async function testCodeSubmission(token, code, language, description) {
  try {
    console.log(`\n--- 测试: ${description} ---`);
    console.log('正在提交代码...');
    
    const submissionResponse = await axios.post(`${API_BASE_URL}/submissions`, {
      question_id: 5,
      code: code,
      language: language
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('提交响应:', submissionResponse.data);
    const submissionId = submissionResponse.data.submission_id;
    const judgeResult = submissionResponse.data.judge_result;
    console.log(`代码提交成功，提交ID: ${submissionId}，判题结果: ${judgeResult}`);
    
    return judgeResult;
    
  } catch (error) {
    console.error(`测试失败:`, error.message);
    if (error.response) {
      console.error(`错误响应:`, error.response.data);
    }
    return 'ERROR';
  }
}

testAdditionQuestion();