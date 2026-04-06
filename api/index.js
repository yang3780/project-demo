const app = require('../src/app');
const { connectDB } = require('../src/config/db');

// 确保数据库连接
let dbConnected = false;

// Vercel Serverless Function handler
module.exports = async (req, res) => {
  try {
    // 只在第一次请求时连接数据库
    if (!dbConnected) {
      await connectDB();
      dbConnected = true;
    }
    // 处理请求
    app(req, res);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Server error',
      error: error.message
    });
  }
};