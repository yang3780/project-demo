<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">个人中心</h2>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="card p-8 text-center">
      <div class="flex justify-center space-x-2 mb-4">
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
      </div>
      <p class="text-gray-600">加载中...</p>
    </div>
    
    <!-- 内容区域 -->
    <template v-else>
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧：个人信息卡片 -->
        <div class="lg:col-span-1">
          <div class="card">
            <div class="flex flex-col items-center p-4">
              <div class="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center mb-4">
                <span class="text-2xl font-bold text-gray-600">{{ user?.username?.charAt(0).toUpperCase() || 'U' }}</span>
              </div>
              <h3 class="text-xl font-semibold mb-1">{{ user?.username || '未知用户' }}</h3>
              <p class="text-gray-500 mb-1">{{ user?.email || '未知邮箱' }}</p>
              <div class="mb-4">
                <span :class="user?.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 rounded-full text-xs font-medium">
                  {{ user?.role === 'admin' ? '管理员' : '普通用户' }}
                </span>
              </div>
              <div class="w-full space-y-2">
                <div class="flex justify-between">
                  <span class="text-gray-600">总积分</span>
                  <span class="font-semibold">{{ user?.total_score || 0 }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">已解题数</span>
                  <span class="font-semibold">{{ solvedQuestions.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">总提交数</span>
                  <span class="font-semibold">{{ submissions.length }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">注册时间</span>
                  <span class="text-sm text-gray-500">{{ user?.created_at || '未知' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧：Tab 切换内容 -->
        <div class="lg:col-span-3">
          <div class="card">
            <!-- Tab 切换 -->
            <div class="flex border-b">
              <button 
                v-for="tab in availableTabs" 
                :key="tab.id"
                class="px-4 py-2 border-b-2"
                :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent'"
                @click="activeTab = tab.id"
              >
                {{ tab.name }}
              </button>
            </div>
            
            <!-- 提交记录 -->
            <div v-if="activeTab === 'submissions'" class="p-4">
              <div class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left">题目</th>
                      <th class="px-4 py-2 text-left">语言</th>
                      <th class="px-4 py-2 text-left">状态</th>
                      <th class="px-4 py-2 text-left">时间</th>
                      <th class="px-4 py-2 text-left">内存</th>
                      <th class="px-4 py-2 text-left">提交时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="submissions.length === 0" class="border-b">
                      <td colspan="6" class="px-4 py-4 text-center text-gray-500">暂无提交记录</td>
                    </tr>
                    <tr v-for="submission in paginatedSubmissions" :key="submission.id" class="border-b">
                      <td class="px-4 py-2">{{ submission.question || '未知题目' }}</td>
                      <td class="px-4 py-2">{{ submission.language || '未知语言' }}</td>
                      <td class="px-4 py-2">
                        <span :class="getResultClass(submission.status)">{{ getResultText(submission.status) }}</span>
                      </td>
                      <td class="px-4 py-2">{{ submission.exec_time || 0 }}ms</td>
                      <td class="px-4 py-2">{{ submission.memory_used || 0 }}KB</td>
                      <td class="px-4 py-2">{{ submission.submitted_at || '未知时间' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <!-- 分页 -->
              <div class="mt-4 flex justify-center">
                <div class="flex space-x-2">
                  <button class="btn btn-outline px-3 py-1" :disabled="currentPage === 1" @click="handlePageChange(currentPage - 1)">上一页</button>
                  <span class="flex items-center px-3 py-1">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
                  <button class="btn btn-outline px-3 py-1" :disabled="currentPage === totalPages" @click="handlePageChange(currentPage + 1)">下一页</button>
                </div>
              </div>
            </div>
            
            <!-- 已解题目 -->
            <div v-if="activeTab === 'solved'" class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="solvedQuestions.length === 0" class="col-span-full p-8 text-center text-gray-500">
                  暂无已解题目
                </div>
                <div 
                  v-for="question in solvedQuestions" 
                  :key="question.id"
                  class="card hover:border-primary transition-colors"
                >
                  <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-semibold">{{ question.title || '未知题目' }}</h4>
                    <span :class="getDifficultyClass(question.difficulty)">{{ getDifficultyText(question.difficulty) }}</span>
                  </div>
                  <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ question.description || '无描述' }}</p>
                  <div class="flex justify-between items-center">
                    <span class="text-gray-500 text-sm">积分: {{ question.score || 0 }}</span>
                    <span class="text-gray-500 text-sm">通过时间: {{ question.solved_at || '未知时间' }}</span>
                  </div>
                </div>
              </div>
            </div>
            

            
            <!-- 个人设置 -->
            <div v-if="activeTab === 'settings'" class="p-4">
              <form class="space-y-4">
                <div>
                  <label class="block text-gray-600 mb-1">用户名</label>
                  <input type="text" class="input w-full" :value="user?.username || ''" />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">邮箱</label>
                  <input type="email" class="input w-full" :value="user?.email || ''" />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">密码</label>
                  <input type="password" class="input w-full" placeholder="输入新密码" />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">确认密码</label>
                  <input type="password" class="input w-full" placeholder="确认新密码" />
                </div>
                <div>
                  <button type="button" class="btn btn-primary">保存修改</button>
                </div>
              </form>
            </div>
            
            <!-- 管理员用户管理 -->
            <div v-if="activeTab === 'admin'" class="p-4">
              <h3 class="text-lg font-semibold mb-4">用户管理</h3>
              
              <!-- 加载状态 -->
              <div v-if="isLoadingUsers" class="flex justify-center space-x-2 mb-4">
                <div class="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
                <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-3 h-3 bg-primary rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
              
              <!-- 用户列表 -->
              <div v-else class="overflow-x-auto">
                <table class="min-w-full">
                  <thead>
                    <tr class="bg-gray-50">
                      <th class="px-4 py-2 text-left">ID</th>
                      <th class="px-4 py-2 text-left">用户名</th>
                      <th class="px-4 py-2 text-left">邮箱</th>
                      <th class="px-4 py-2 text-left">角色</th>
                      <th class="px-4 py-2 text-left">总积分</th>
                      <th class="px-4 py-2 text-left">注册时间</th>
                      <th class="px-4 py-2 text-left">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="allUsers.length === 0" class="border-b">
                      <td colspan="7" class="px-4 py-4 text-center text-gray-500">暂无用户</td>
                    </tr>
                    <tr v-for="userItem in allUsers" :key="userItem.id" class="border-b">
                      <td class="px-4 py-2">{{ userItem.id }}</td>
                      <td class="px-4 py-2">{{ userItem.username }}</td>
                      <td class="px-4 py-2">{{ userItem.email }}</td>
                      <td class="px-4 py-2">
                        <select 
                          v-model="userItem.role" 
                          class="input" 
                          @change="updateUserRole(userItem.id, userItem.role)"
                        >
                          <option value="user">普通用户</option>
                          <option value="admin">管理员</option>
                        </select>
                      </td>
                      <td class="px-4 py-2">{{ userItem.total_score }}</td>
                      <td class="px-4 py-2">{{ userItem.created_at }}</td>
                      <td class="px-4 py-2">
                        <button 
                          class="btn btn-sm btn-outline" 
                          @click="deleteUser(userItem.id)"
                          :disabled="userItem.id === user.id"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- 管理员题库管理 -->
            <div v-if="activeTab === 'admin-questions'" class="p-4">
              <h3 class="text-lg font-semibold mb-4">题库管理</h3>
              <div class="card p-6 text-center">
                <p class="mb-4">点击下方按钮进入题库管理页面</p>
                <router-link to="/admin/questions" class="btn btn-primary">
                  前往题库管理
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { userAPI, submissionAPI, userScoreAPI } from '../utils/api'

// 用户数据
const user = ref(JSON.parse(localStorage.getItem('user')) || null)
const submissions = ref([])
const solvedQuestions = ref([])
const allUsers = ref([])

// Tab 配置
const tabs = ref([
  { id: 'submissions', name: '提交记录' },
  { id: 'solved', name: '已解题目' },
  { id: 'settings', name: '个人设置' },
  { id: 'admin', name: '用户管理', requireAdmin: true },
  { id: 'admin-questions', name: '题库管理', requireAdmin: true }
])

// 状态
const activeTab = ref('submissions')
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const isSubmitting = ref(false)
const isLoadingUsers = ref(false)

// 缓存数据
const cachedData = ref({
  user: null,
  submissions: [],
  solvedQuestions: []
})

// 计算当前页的提交记录
const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return submissions.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(submissions.value.length / pageSize.value)
})

// 可用的标签页
const availableTabs = computed(() => {
  return tabs.value.filter(tab => {
    if (!tab.requireAdmin) return true
    return user.value && user.value.role === 'admin'
  })
})

// 分页控制
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 获取用户数据
const getUserData = async () => {
  isLoading.value = true
  try {
    // 并行获取数据，减少加载时间
    const [userInfo, subs, solved] = await Promise.all([
      userAPI.getCurrentUser(),
      submissionAPI.getUserSubmissions(),
      userScoreAPI.getSolvedQuestions()
    ])
    
    console.log('获取用户信息:', userInfo)
    user.value = userInfo
    submissions.value = subs
    solvedQuestions.value = solved
    

  } catch (error) {
    console.error('获取用户数据失败:', error)
  } finally {
    isLoading.value = false
  }
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
    case 'AC': return 'text-green-600 font-medium'
    case 'WA': return 'text-red-600 font-medium'
    case 'TLE': return 'text-yellow-600 font-medium'
    case 'RE': return 'text-purple-600 font-medium'
    case 'CE': return 'text-blue-600 font-medium'
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
    default: return status
  }
}

// 获取所有用户（管理员）
const getAllUsers = async () => {
  // 确保用户是管理员
  if (!user.value || user.value.role !== 'admin') {
    console.error('用户不是管理员，无法获取用户列表')
    return
  }
  
  isLoadingUsers.value = true
  try {
    console.log('开始获取用户列表...')
    const token = localStorage.getItem('token')
    console.log('Token:', token ? '已获取' : '未获取')
    
    const response = await fetch('/api/users/admin/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    
    console.log('响应状态:', response.status)
    
    if (response.ok) {
      const data = await response.json()
      console.log('获取用户列表成功:', data)
      allUsers.value = data
    } else {
      const errorData = await response.json().catch(() => ({}))
      console.error('获取用户列表失败:', response.status, errorData)
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  } finally {
    isLoadingUsers.value = false
  }
}

// 更新用户角色
const updateUserRole = async (userId, role) => {
  try {
    const response = await fetch('/api/users/admin/role', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId, role })
    })
    
    if (!response.ok) {
      console.error('更新用户角色失败')
    }
  } catch (error) {
    console.error('更新用户角色失败:', error)
  }
}

// 删除用户
const deleteUser = async (userId) => {
  if (userId === user.value?.id) return
  
  if (confirm('确定要删除这个用户吗？')) {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        allUsers.value = allUsers.value.filter(u => u.id !== userId)
      } else {
        console.error('删除用户失败')
      }
    } catch (error) {
      console.error('删除用户失败:', error)
    }
  }
}

// 监听标签页切换，当切换到管理员标签页时加载用户列表
watch(activeTab, async (newTab) => {
  if (newTab === 'admin') {
    // 确保用户数据已加载
    if (!user.value) {
      await getUserData()
    }
    // 只有管理员才能查看用户管理
    if (user.value?.role === 'admin') {
      getAllUsers()
    }
  }
})

onMounted(() => {
  getUserData()
})
</script>