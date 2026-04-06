const axios = require('axios');

// API配置
const API_BASE_URL = 'http://localhost:3000/api';

// 测试用户信息
const testUser = {
  username: 'testuser_new',
  password: 'password123',
  email: 'testuser_new@example.com'
};

// 注册用户
async function registerUser() {
  try {
    console.log('注册测试用户...');
    const response = await axios.post(`${API_BASE_URL}/users/register`, testUser);
    console.log('注册成功:', response.data);
  } catch (error) {
    console.error('注册失败:', error.message);
    if (error.response) {
      console.error('错误响应:', error.response.data);
    }
  }
}

// 启动注册
registerUser();
