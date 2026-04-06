import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 从localStorage获取token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    if (error.response) {
      // 处理401错误（未授权）
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      return Promise.reject(error.response.data)
    }
    return Promise.reject(error)
  }
)

// API方法
export const userAPI = {
  // 注册
  register: (data) => api.post('/users/register', data),
  // 登录
  login: (data) => api.post('/users/login', data),
  // 获取当前用户信息
  getCurrentUser: () => api.get('/users/me'),
  // 获取排行榜
  getLeaderboard: () => api.get('/users/leaderboard')
}

export const questionAPI = {
  // 获取题目列表
  getQuestions: (params) => api.get('/questions', { params }),
  // 获取题目详情
  getQuestionById: (id) => api.get(`/questions/${id}`),
  // 创建题目
  createQuestion: (data) => api.post('/questions', data),
  // 更新题目
  updateQuestion: (id, data) => api.put(`/questions/${id}`, data),
  // 删除题目
  deleteQuestion: (id) => api.delete(`/questions/${id}`)
}

export const submissionAPI = {
  // 提交代码
  submitCode: (data) => api.post('/submissions', data),
  // 获取提交状态
  getSubmissionStatus: (id) => api.get(`/submissions/${id}`),
  // 获取用户的所有提交
  getUserSubmissions: () => api.get('/submissions/user/all'),
  // 获取题目相关的所有提交
  getQuestionSubmissions: (questionId) => api.get(`/submissions/question/${questionId}`),
  // 获取用户对特定题目的提交
  getUserQuestionSubmissions: (questionId) => api.get(`/submissions/user/${questionId}`),
  // 获取用户最近一周的提交数
  getWeeklySubmissionCount: () => api.get('/submissions/user/weekly/count')
}

export const userScoreAPI = {
  // 获取用户已解决的题目
  getSolvedQuestions: () => api.get('/user-scores/solved'),
  // 获取用户已解决的题目数量
  getSolvedQuestionCount: () => api.get('/user-scores/solved/count'),
  // 获取用户的总分数
  getTotalScore: () => api.get('/user-scores/total-score')
}

// 大模型 API - 使用代理避免跨域问题
const AI_API_URL = '/xfyun-api/v2'
const AI_API_KEY = 'c3dc746dde963c916b29cbc0386bad42:ZDE4NjMxMGY1Zjk4NTRiZjUyYmY4NTc2'

export const aiAPI = {
  // 调用大模型聊天
  chat: async (messages) => {
    try {
      console.log('[AI API] 发送请求，消息数:', messages.length)
      console.log('[AI API] 请求消息:', messages)
      
      const response = await axios.post(
        `${AI_API_URL}/chat/completions`,
        {
          model: 'xop35qwen2b',
          messages: messages,
          temperature: 0.7
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AI_API_KEY}`
          },
          timeout: 120000
        }
      )
      
      console.log('[AI API] 完整响应:', response)
      console.log('[AI API] 响应数据:', response.data)
      return response.data
    } catch (error) {
      console.error('[AI API] ========== 错误详情 ==========')
      console.error('[AI API] 错误消息:', error.message)
      console.error('[AI API] 响应状态:', error.response?.status)
      console.error('[AI API] 响应数据:', error.response?.data)
      console.error('[AI API] 请求配置:', {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data
      })
      console.error('[AI API] ==============================')
      throw error
    }
  }
}

export default api