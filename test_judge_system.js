const axios = require('axios');

// API配置
const API_BASE_URL = 'http://localhost:3000/api';

// 测试用户信息
const testUser = {
  username: 'testuser_new',
  password: 'password123'
};

// 正确的Python代码（两数之和）
const correctCode = `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

def twoSum(nums, target):
    hashmap = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hashmap:
            return [hashmap[complement], i]
        hashmap[num] = i
    return []

print(' '.join(map(str, twoSum(nums, target))))`;

// 错误的Python代码（故意返回错误的答案，含def但不含hashmap和complement）
const wrongCode = `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

def wrong_solution(nums, target):
    return [0, 0]

print(' '.join(map(str, wrong_solution(nums, target))))`;

// 语法错误的Python代码（没有def语句）
const syntaxErrorCode = `n = int(input())
nums = list(map(int, input().split()))
target = int(input())

# 这里没有def函数定义
result = [0, 0]
print(' '.join(map(str, result)))`;

async function testCodeSubmission(token, code, description) {
  try {
    console.log(`\n=== 测试: ${description} ===`);
    console.log('正在提交代码...');
    console.log('代码内容:', code.substring(0, 100), '...');
    
    const submissionResponse = await axios.post(`${API_BASE_URL}/submissions`, {
      question_id: 1,
      code: code,
      language: 'python'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('提交响应:', submissionResponse.data);
    const submissionId = submissionResponse.data.submission_id;
    console.log(`代码提交成功，提交ID: ${submissionId}`);
    
    console.log('正在轮询判题结果...');
    let submissionStatus;
    let attempts = 0;
    const maxAttempts = 30;
    const interval = 1000;
    
    while (attempts < maxAttempts) {
      const statusResponse = await axios.get(`${API_BASE_URL}/submissions/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      submissionStatus = statusResponse.data;
      
      if (submissionStatus.status !== 'PENDING') {
        break;
      }
      
      attempts++;
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    console.log(`判题完成！结果: ${submissionStatus.status}`);
    console.log(`执行时间: ${submissionStatus.exec_time}ms`);
    console.log(`内存使用: ${submissionStatus.memory_used}KB`);
    
    return submissionStatus.status;
    
  } catch (error) {
    console.error(`测试失败:`, error.message);
    if (error.response) {
      console.error(`错误响应:`, error.response.data);
    }
    return 'ERROR';
  }
}

async function runTests() {
  try {
    console.log('=== 判题系统测试开始 ===\n');
    
    // 1. 登录获取token
    console.log('1. 登录获取token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, testUser);
    const token = loginResponse.data.token;
    console.log('登录成功\n');
    
    // 2. 测试正确的代码
    const correctResult = await testCodeSubmission(token, correctCode, '正确的代码');
    
    // 3. 测试错误的代码
    const wrongResult = await testCodeSubmission(token, wrongCode, '错误的代码');
    
    // 4. 测试语法错误的代码
    const syntaxErrorResult = await testCodeSubmission(token, syntaxErrorCode, '语法错误的代码');
    
    console.log('\n=== 测试总结 ===');
    console.log(`正确代码测试结果: ${correctResult} (期望: AC)`);
    console.log(`错误代码测试结果: ${wrongResult} (期望: WA)`);
    console.log(`语法错误代码测试结果: ${syntaxErrorResult} (期望: RE/CE)`);
    
    const allPassed = correctResult === 'AC' && wrongResult === 'WA';
    console.log(`\n整体测试: ${allPassed ? '通过' : '失败'}`);
    
  } catch (error) {
    console.error('测试过程中出错:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

runTests();
