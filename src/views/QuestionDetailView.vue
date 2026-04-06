<template>
  <div class="space-y-4">
    <!-- 顶部导航 -->
    <div class="flex items-center space-x-4 mb-4">
      <router-link to="/questions" class="btn btn-outline">返回题库</router-link>
      <router-link to="/algorithm" class="btn btn-outline">查看演示</router-link>
    </div>

    <!-- 题目基本信息 -->
    <div class="card">
      <div class="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 class="text-2xl font-bold mb-2">{{ question.title }}</h1>
          <div class="flex items-center space-x-4">
            <span :class="getDifficultyClass(question.difficulty)">{{ getDifficultyText(question.difficulty) }}</span>
            <span class="text-gray-500">积分: {{ question.score }}</span>
            <span class="text-gray-500">{{ question.time_limit }}ms / {{ question.memory_limit }}MB</span>
          </div>
        </div>
        <div>
          <span class="text-gray-500">类型: {{ question.type }}</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区 -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <!-- 左侧：题目描述 -->
      <div class="lg:col-span-2">
        <div class="card h-full">
          <div class="flex border-b mb-4">
            <button 
              class="px-4 py-2 border-b-2" 
              :class="activeTab === 'description' ? 'border-primary text-primary' : 'border-transparent'"
              @click="activeTab = 'description'"
            >
              题目描述
            </button>
            <button 
              class="px-4 py-2 border-b-2" 
              :class="activeTab === 'solution' ? 'border-primary text-primary' : 'border-transparent'"
              @click="activeTab = 'solution'"
            >
              题解
            </button>
          </div>
          
          <div v-if="activeTab === 'description'" class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">题目描述</h3>
              <div class="text-gray-700 whitespace-pre-wrap">{{ question.description }}</div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">输入格式</h3>
              <div class="text-gray-700 whitespace-pre-wrap">{{ question.input_format }}</div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">输出格式</h3>
              <div class="text-gray-700 whitespace-pre-wrap">{{ question.output_format }}</div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">样例输入</h3>
              <div class="bg-gray-100 p-3 rounded-md text-gray-700 whitespace-pre-wrap">{{ question.sample_input }}</div>
            </div>
            <div>
              <h3 class="font-semibold mb-2">样例输出</h3>
              <div class="bg-gray-100 p-3 rounded-md text-gray-700 whitespace-pre-wrap">{{ question.sample_output }}</div>
            </div>
          </div>
          
          <div v-else>
            <div class="text-gray-700">
              <p>题解内容正在准备中...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧：代码编辑器 + 提交区 -->
      <div class="lg:col-span-3">
        <div class="card h-full">
          <!-- 语言选择 -->
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-4">
              <label class="text-gray-600">语言:</label>
              <select v-model="selectedLanguage" class="input">
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="javascript">JavaScript</option>
              </select>
            </div>
            <button class="btn btn-primary" @click="submitCode">提交代码</button>
          </div>
          
          <!-- 代码编辑器 -->
          <div class="border rounded-md mb-4">
            <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
              <span class="text-gray-600">{{ selectedLanguage }}</span>
              <div class="flex space-x-2">
                <button class="text-gray-500 hover:text-gray-700" @click="resetCode">重置</button>
              </div>
            </div>
            <div class="p-4">
              <textarea
                v-model="code"
                class="w-full h-64 font-mono text-sm bg-white border-0 outline-none resize-none"
                placeholder="请输入代码..."
              ></textarea>
            </div>
          </div>
          
          <!-- 判题结果 -->
          <div v-if="submissionResult" class="mb-4 p-4 rounded-md" :class="getResultClass(submissionResult.status)">
            <div class="flex items-center justify-between">
              <h3 class="font-semibold">{{ getResultText(submissionResult.status) }}</h3>
              <span class="text-gray-600">{{ submissionResult.exec_time }}ms / {{ submissionResult.memory_used }}KB</span>
            </div>
            <p class="mt-2 text-sm">{{ submissionResult.message || '' }}</p>
          </div>
          
          <!-- 历史提交记录 -->
          <div class="mt-6">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold">历史提交</h3>
              <button class="text-sm text-primary hover:underline" @click="showHistory = !showHistory">
                {{ showHistory ? '收起' : '展开' }}
              </button>
            </div>
            <div v-if="showHistory" class="space-y-2">
              <div 
                v-for="submission in submissions" 
                :key="submission.id"
                class="p-2 border rounded-md flex justify-between items-center"
                :class="getResultClass(submission.status)"
              >
                <div class="flex items-center space-x-4">
                  <span class="text-sm">{{ submission.language }}</span>
                  <span class="text-sm">{{ submission.submitted_at }}</span>
                </div>
                <span class="font-medium">{{ getResultText(submission.status) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { questionAPI, submissionAPI } from '../utils/api'

const route = useRoute()
const questionId = route.params.id

// 题目数据
const question = ref({})
const isLoading = ref(true)

// 状态
const activeTab = ref('description')
const selectedLanguage = ref('python')
const code = ref('')
const submissionResult = ref(null)
const showHistory = ref(false)
const isSubmitting = ref(false)

// 提交记录
const submissions = ref([])

// 页面加载时获取题目数据和提交历史
onMounted(async () => {
  await loadQuestionData()
  await loadSubmissionHistory()
  setDefaultCode()
  isLoading.value = false
})

// 加载题目数据
const loadQuestionData = async () => {
  try {
    const data = await questionAPI.getQuestionById(questionId)
    question.value = data
  } catch (error) {
    console.error('获取题目数据失败:', error)
  }
}

// 加载提交历史
const loadSubmissionHistory = async () => {
  try {
    const data = await submissionAPI.getUserQuestionSubmissions(questionId)
    submissions.value = data
  } catch (error) {
    console.error('获取提交历史失败:', error)
  }
}

// 根据语言设置默认代码
const setDefaultCode = () => {
  switch (selectedLanguage.value) {
    case 'python':
      code.value = `# 请在此输入您的代码

`
      break
    case 'cpp':
      code.value = `#include <iostream>
using namespace std;

int main() {
    
    return 0;
}`
      break
    case 'javascript':
      code.value = `const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

`
      break
  }
}

// 提交代码
const submitCode = async () => {
  isSubmitting.value = true
  try {
    // 提交代码到后端
    const response = await submissionAPI.submitCode({
      question_id: questionId,
      code: code.value,
      language: selectedLanguage.value
    })
    
    // 轮询获取判题结果
    const submissionId = response.submission_id
    await pollSubmissionStatus(submissionId)
    
    // 重新加载提交历史
    await loadSubmissionHistory()
  } catch (error) {
    console.error('提交代码失败:', error)
    alert('提交失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}

// 轮询获取判题结果
const pollSubmissionStatus = async (submissionId) => {
  let attempts = 0
  const maxAttempts = 30
  const interval = 500
  
  while (attempts < maxAttempts) {
    try {
      const status = await submissionAPI.getSubmissionStatus(submissionId)
      if (status.status !== 'PENDING') {
        submissionResult.value = {
          status: status.status,
          exec_time: status.exec_time || 0,
          memory_used: status.memory_used || 0,
          message: status.message || ''
        }
        return
      }
    } catch (error) {
      console.error('获取提交状态失败:', error)
    }
    
    attempts++
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  // 超时处理
  submissionResult.value = {
    status: 'ERROR',
    exec_time: 0,
    memory_used: 0,
    message: '判题超时，请稍后重试'
  }
}

// 重置代码
const resetCode = () => {
  setDefaultCode()
}



// 获取难度对应的类名
const getDifficultyClass = (difficulty) => {
  switch (difficulty) {
    case 1: return 'difficulty-easy'
    case 2: return 'difficulty-medium'
    case 3: return 'difficulty-hard'
    default: return ''
  }
}

// 获取难度对应的文本
const getDifficultyText = (difficulty) => {
  switch (difficulty) {
    case 1: return '简单'
    case 2: return '中等'
    case 3: return '困难'
    default: return ''
  }
}

// 获取结果对应的类名
const getResultClass = (status) => {
  switch (status) {
    case 'AC': return 'bg-green-50 border-green-200 text-green-800'
    case 'WA': return 'bg-red-50 border-red-200 text-red-800'
    case 'TLE': return 'bg-yellow-50 border-yellow-200 text-yellow-800'
    case 'RE': return 'bg-purple-50 border-purple-200 text-purple-800'
    case 'CE': return 'bg-blue-50 border-blue-200 text-blue-800'
    case 'ERROR': return 'bg-gray-50 border-gray-200 text-gray-800'
    default: return ''
  }
}

// 获取结果对应的文本
const getResultText = (status) => {
  switch (status) {
    case 'AC': return 'Accepted'
    case 'WA': return 'Wrong Answer'
    case 'TLE': return 'Time Limit Exceeded'
    case 'RE': return 'Runtime Error'
    case 'CE': return 'Compilation Error'
    case 'ERROR': return 'Error'
    default: return status
  }
}
</script>