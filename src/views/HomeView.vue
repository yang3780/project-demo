<template>
  <div class="space-y-8">
    <!-- Banner 区域 -->
    <section class="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-8 md:p-12">
      <div class="container mx-auto">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">算法可视化教学工具</h2>
        <p class="text-lg md:text-xl mb-6 max-w-2xl">通过直观的可视化演示和互动练习，帮助你更轻松地理解和掌握各种算法知识</p>
        <div class="flex flex-wrap gap-4">
          <router-link to="/algorithm" class="btn bg-white text-blue-600 hover:bg-gray-100">开始算法演示</router-link>
          <router-link to="/questions" class="btn bg-blue-700 text-white hover:bg-blue-800">浏览题库</router-link>
        </div>
      </div>
    </section>

    <!-- 热门算法演示卡片 -->
    <section>
      <h3 class="text-2xl font-bold mb-4">热门算法演示</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card cursor-pointer" @click="navigateToAlgorithm('bubble')">
          <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-blue-600 font-bold">排序</span>
          </div>
          <h4 class="text-lg font-semibold mb-2">冒泡排序</h4>
          <p class="text-gray-600 text-sm">通过相邻元素比较和交换，逐步将最大元素冒泡到数组末尾</p>
        </div>
        <div class="card cursor-pointer" @click="navigateToAlgorithm('dijkstra')">
          <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-green-600 font-bold">图论</span>
          </div>
          <h4 class="text-lg font-semibold mb-2">Dijkstra算法</h4>
          <p class="text-gray-600 text-sm">用于解决带权有向图中的最短路径问题</p>
        </div>
        <div class="card cursor-pointer" @click="navigateToAlgorithm('binary-search')">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-yellow-600 font-bold">搜索</span>
          </div>
          <h4 class="text-lg font-semibold mb-2">二分查找</h4>
          <p class="text-gray-600 text-sm">在有序数组中快速定位目标元素的高效算法</p>
        </div>
        <div class="card cursor-pointer" @click="navigateToAlgorithm('tree')">
          <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <span class="text-purple-600 font-bold">树</span>
          </div>
          <h4 class="text-lg font-semibold mb-2">二叉树遍历</h4>
          <p class="text-gray-600 text-sm">包括前序、中序、后序和层次遍历等多种遍历方式</p>
        </div>
      </div>
    </section>

    <!-- 推荐题目 -->
    <section>
      <h3 class="text-2xl font-bold mb-4">推荐题目</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-lg font-semibold">两数之和</h4>
            <span class="difficulty-easy">简单</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">给定一个整数数组和一个目标值，找出和为目标值的两个数</p>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-sm">积分: 10</span>
            <router-link to="/question/1" class="text-primary hover:underline">查看详情</router-link>
          </div>
        </div>
        <div class="card">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-lg font-semibold">最长回文子串</h4>
            <span class="difficulty-medium">中等</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">找出字符串中最长的回文子串</p>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-sm">积分: 20</span>
            <router-link to="/question/2" class="text-primary hover:underline">查看详情</router-link>
          </div>
        </div>
        <div class="card">
          <div class="flex justify-between items-start mb-2">
            <h4 class="text-lg font-semibold">合并K个排序链表</h4>
            <span class="difficulty-hard">困难</span>
          </div>
          <p class="text-gray-600 text-sm mb-4">合并k个排序链表，返回合并后的排序链表</p>
          <div class="flex justify-between items-center">
            <span class="text-gray-500 text-sm">积分: 30</span>
            <router-link to="/question/3" class="text-primary hover:underline">查看详情</router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 学习进度（登录后） -->
    <section v-if="isLoggedIn" class="card">
      <h3 class="text-2xl font-bold mb-4">学习进度</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-gray-500 mb-1">已解题数</h4>
          <p class="text-2xl font-bold">{{ userStats.solvedCount }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-gray-500 mb-1">总积分</h4>
          <p class="text-2xl font-bold">{{ userStats.totalScore }}</p>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="text-gray-500 mb-1">最近提交</h4>
          <p class="text-2xl font-bold">{{ userStats.recentSubmissions }}</p>
        </div>
      </div>
      <div class="bg-gray-50 rounded-lg p-4">
          <p class="text-center text-gray-500 mb-4">最近7天提交记录</p>
          <div class="space-y-2">
            <div 
              v-for="day in weeklySubmissions" 
              :key="day.date"
              class="flex justify-between items-center p-2 border-b border-gray-200"
            >
              <span class="text-gray-600">{{ day.date }}</span>
              <span class="font-medium">{{ day.count }} 次</span>
            </div>
            <div v-if="weeklySubmissions.length === 0" class="text-center text-gray-500 py-4">
              暂无提交记录
            </div>
          </div>
        </div>
    </section>


  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI, userScoreAPI, submissionAPI } from '../utils/api'

const router = useRouter()
const isLoggedIn = ref(false)
const user = ref(null)
const userStats = ref({
  solvedCount: 0,
  totalScore: 0,
  recentSubmissions: 0
})
const weeklySubmissions = ref([])

const navigateToAlgorithm = (algorithm) => {
  router.push(`/algorithm?type=${algorithm}`)
}

// 获取用户信息和统计数据
const getUserData = async () => {
  console.log('开始获取用户数据...')
  const token = localStorage.getItem('token')
  console.log('Token:', token ? '存在' : '不存在')
  
  if (token) {
    try {
      console.log('开始获取用户信息...')
      // 获取用户信息
      const userInfo = await userAPI.getCurrentUser()
      console.log('用户信息:', userInfo)
      user.value = userInfo
      isLoggedIn.value = true
      console.log('登录状态设置为true')
      
      console.log('开始获取用户统计数据...')
      // 获取用户统计数据
      const [solvedCount, totalScore, weeklyData] = await Promise.all([
        userScoreAPI.getSolvedQuestionCount(),
        userScoreAPI.getTotalScore(),
        submissionAPI.getWeeklySubmissionCount()
      ])
      
      console.log('已解题数:', solvedCount)
      console.log('总积分:', totalScore)
      console.log('最近7天提交数据:', weeklyData)
      
      // 计算最近7天的总提交数
      let totalSubmissions = 0
      if (Array.isArray(weeklyData)) {
        totalSubmissions = weeklyData.reduce((sum, day) => sum + day.count, 0)
      } else if (weeklyData && typeof weeklyData === 'object') {
        totalSubmissions = weeklyData.count || 0
      }
      console.log('最近7天总提交数:', totalSubmissions)
      
      userStats.value = {
        solvedCount: solvedCount.count || 0,
        totalScore: totalScore.total_score || 0,
        recentSubmissions: totalSubmissions
      }
      console.log('用户统计数据:', userStats.value)
      
      if (Array.isArray(weeklyData)) {
        weeklySubmissions.value = weeklyData
      } else {
        // 处理非数组响应
        weeklySubmissions.value = []
      }
      

    } catch (error) {
      console.error('获取用户数据失败:', error)
      console.error('错误详情:', error.message)
      console.error('错误堆栈:', error.stack)
      isLoggedIn.value = false
      user.value = null
      console.log('登录状态设置为false')
    }
  } else {
    console.log('没有找到token，用户未登录')
  }
}

onMounted(() => {
  getUserData()
})
</script>