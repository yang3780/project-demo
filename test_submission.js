const axios = require('axios');
const mysql = require('mysql2/promise');

// 数据库连接配置
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'algorithm_tool'
};

// API配置
const API_BASE_URL = 'http://localhost:3000/api';

// 测试用户信息
const testUser = {
  username: 'testuser_new',
  password: 'password123'
};

// 测试题目ID
const TEST_QUESTION_ID = 1;

// 测试代码
const testCode = {
  python: `n = int(input())
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

print(' '.join(map(str, twoSum(nums, target))))`,
  cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> hashmap;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (hashmap.find(complement) != hashmap.end()) {
            return {hashmap[complement], i};
        }
        hashmap[nums[i]] = i;
    }
    return {};
}

int main() {
    int n, target;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    cin >> target;
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    return 0;
}`,
  javascript: `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let n, nums, target;
let count = 0;

rl.on('line', (line) => {
    if (count === 0) {
        n = parseInt(line);
    } else if (count === 1) {
        nums = line.split(' ').map(Number);
    } else if (count === 2) {
        target = parseInt(line);
        console.log(twoSum(nums, target).join(' '));
        rl.close();
    }
    count++;
});

function twoSum(nums, target) {
    const hashmap = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (hashmap.has(complement)) {
            return [hashmap.get(complement), i];
        }
        hashmap.set(nums[i], i);
    }
    return [];
}`
};

// 测试流程
async function runTest() {
  let connection;
  let token;
  
  try {
    console.log('=== 测试开始 ===\n');
    
    // 1. 连接数据库
    console.log('1. 连接数据库...');
    connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功\n');
    
    // 2. 登录获取token
    console.log('2. 登录获取token...');
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, testUser);
    token = loginResponse.data.token;
    console.log('登录成功，获取到token\n');
    
    // 3. 获取用户初始积分
    console.log('3. 获取用户初始积分...');
    const initialScoreResponse = await axios.get(`${API_BASE_URL}/user-scores/total-score`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const initialScore = initialScoreResponse.data.total_score || 0;
    console.log(`用户初始积分: ${initialScore}\n`);
    
    // 4. 提交代码（多次提交，直到获得AC结果）
    console.log('4. 提交代码（多次提交，直到获得AC结果）...');
    let submissionStatus;
    let submissionId;
    let submitCount = 0;
    const maxSubmissions = 5;
    
    while (submitCount < maxSubmissions) {
      submitCount++;
      console.log(`\n第 ${submitCount} 次提交:`);
      
      const submissionResponse = await axios.post(`${API_BASE_URL}/submissions`, {
        question_id: TEST_QUESTION_ID,
        code: testCode.python,
        language: 'python'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      submissionId = submissionResponse.data.submission_id;
      console.log(`代码提交成功，提交ID: ${submissionId}`);
      
      // 轮询获取判题结果
      console.log('轮询获取判题结果...');
      let attempts = 0;
      const maxAttempts = 30;
      const interval = 1000;
      
      while (attempts < maxAttempts) {
        const statusResponse = await axios.get(`${API_BASE_URL}/submissions/${submissionId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        submissionStatus = statusResponse.data;
        console.log(`判题状态: ${submissionStatus.status}`);
        
        if (submissionStatus.status !== 'PENDING') {
          break;
        }
        
        attempts++;
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
      console.log('判题完成，结果:', submissionStatus.status);
      
      if (submissionStatus.status === 'AC') {
        console.log('提交成功，获得AC结果！');
        break;
      }
    }
    
    console.log('');
    console.log('最终判题结果:', submissionStatus);
    console.log('');
    
    // 6. 验证提交记录是否存储
    console.log('6. 验证提交记录是否存储...');
    const [submissionRows] = await connection.execute(
      'SELECT * FROM submissions WHERE id = ?',
      [submissionId]
    );
    
    if (submissionRows.length > 0) {
      console.log('提交记录存储成功');
      console.log('提交记录:', submissionRows[0]);
    } else {
      console.log('提交记录存储失败');
    }
    console.log('');
    
    // 7. 验证积分是否增加（如果提交成功）
    if (submissionStatus.status === 'AC') {
      console.log('7. 验证积分是否增加...');
      const finalScoreResponse = await axios.get(`${API_BASE_URL}/user-scores/total-score`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const finalScore = finalScoreResponse.data.total_score || 0;
      
      console.log(`用户最终积分: ${finalScore}`);
      console.log(`积分变化: ${finalScore - initialScore}`);
      
      // 验证积分记录
      const [scoreRows] = await connection.execute(
        'SELECT * FROM user_question_scores WHERE user_id = ? AND question_id = ?',
        [loginResponse.data.user.id, TEST_QUESTION_ID]
      );
      
      if (scoreRows.length > 0) {
        console.log('积分记录存储成功');
        console.log('积分记录:', scoreRows[0]);
      } else {
        console.log('积分记录存储失败');
      }
    } else {
      console.log('7. 提交未通过，积分未增加');
    }
    console.log('');
    
    // 8. 验证提交历史查询
    console.log('8. 验证提交历史查询...');
    const historyResponse = await axios.get(`${API_BASE_URL}/submissions/user/${TEST_QUESTION_ID}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log(`获取到 ${historyResponse.data.length} 条提交记录`);
    if (historyResponse.data.length > 0) {
      console.log('最近一条提交记录:', historyResponse.data[0]);
    }
    console.log('');
    
    console.log('=== 测试完成 ===');
    
  } catch (error) {
    console.error('测试过程中出错:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 启动测试
runTest();
