<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <!-- 左侧：Logo + 项目名称 -->
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
            <span class="text-white font-bold">A</span>
          </div>
          <h1 class="text-xl font-bold text-gray-800">算法可视化教学工具</h1>
        </div>

        <!-- 中间：搜索框 -->
        <div class="hidden md:flex flex-1 max-w-md mx-8">
          <input
            type="text"
            placeholder="搜索题目、算法..."
            class="input w-full"
          />
        </div>

        <!-- 右侧：导航链接 + 用户菜单 -->
        <div class="flex items-center space-x-4">
          <nav class="hidden md:flex space-x-1">
            <router-link to="/" class="nav-link" active-class="active">首页</router-link>
            <router-link to="/questions" class="nav-link" active-class="active">题库</router-link>
            <router-link to="/algorithm" class="nav-link" active-class="active">算法演示</router-link>
            <router-link to="/ai" class="nav-link" active-class="active">AI 助手</router-link>
          </nav>

          <!-- 用户菜单 -->
          <div v-if="isLoggedIn" class="relative group">
            <button class="flex items-center space-x-2 hover:text-primary transition-colors">
              <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
                <span class="text-gray-600">{{ user.username.charAt(0).toUpperCase() }}</span>
              </div>
              <span class="text-gray-600">{{ user.username }}</span>
            </button>
            <div class="absolute right-0 mt-2 w-24 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2">
              <router-link to="/profile" class="block px-2 py-1 text-sm text-gray-700 hover:bg-gray-100">个人中心</router-link>
              <button class="block w-full text-left px-2 py-1 text-sm text-gray-700 hover:bg-gray-100" @click="logout">退出登录</button>
            </div>
          </div>
          <div v-else class="flex space-x-2">
            <router-link to="/login" class="btn btn-outline">登录</router-link>
            <router-link to="/register" class="btn btn-primary">注册</router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="container mx-auto px-4 py-6">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 页脚 -->
    <footer class="bg-gray-800 text-white py-8">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <h2 class="text-xl font-bold mb-2">算法可视化教学工具</h2>
            <p class="text-gray-400">帮助同学们更直观地学习算法</p>
          </div>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-400 hover:text-white">关于我们</a>
            <a href="#" class="text-gray-400 hover:text-white">使用指南</a>
            <a href="#" class="text-gray-400 hover:text-white">联系方式</a>
          </div>
        </div>
        <div class="mt-8 pt-4 border-t border-gray-700 text-center text-gray-400">
          <p>&copy; 2026 算法可视化教学工具. 保留所有权利.</p>
        </div>
      </div>
    </footer>

    <!-- 全局AI助手按钮 -->
    <div class="fixed bottom-6 right-6 z-50">
      <!-- 圆形按钮 -->
      <button 
        @click="toggleAIFloat" 
        class="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-110"
        aria-label="打开AI算法助手"
      >
        <span class="text-sm font-medium">AI助手</span>
      </button>

      <!-- AI浮窗 -->
      <div 
        v-if="showAIFloat" 
        class="absolute bottom-20 right-0 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden transition-all duration-300 transform"
      >
        <div class="bg-primary text-white p-4 flex justify-between items-center">
          <h3 class="font-semibold">{{ currentConversation.title }}</h3>
          <div class="flex space-x-3">
            <button @click="clearMessages" class="text-white hover:opacity-80 text-xs">
              清空
            </button>
            <button @click="newConversation" class="text-white hover:opacity-80 text-xs">
              新对话
            </button>
            <button @click="showAIFloat = false" class="text-white hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div 
          class="p-4 max-h-96 overflow-y-auto scrollbar-styled"
          ref="messagesContainerRef"
        >
          <div 
            v-for="(message, index) in currentConversation.messages" 
            :key="index"
            class="flex mb-4" 
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div 
              class="max-w-[80%] p-3 rounded-lg whitespace-pre-wrap"
              :class="message.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100'"
            >
              <p>{{ message.content }}</p>
              <div class="text-xs mt-1" :class="message.role === 'user' ? 'text-blue-100' : 'text-gray-500'">
                {{ message.timestamp }}
              </div>
            </div>
          </div>
          
          <!-- 加载状态 -->
          <div v-if="isLoading" class="flex justify-start mb-4">
            <div class="bg-gray-100 p-3 rounded-lg">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t p-3">
          <div class="flex space-x-2 items-end">
            <textarea
              v-model="aiInput"
              placeholder="输入你的问题... (Shift+Enter 换行)"
              class="input flex-1 resize-none"
              rows="1"
              @keydown="handleKeyDown"
              @input="autoResize"
              ref="textareaRef"
            ></textarea>
            <button 
              @click="sendAIMessage" 
              class="btn btn-primary"
              :disabled="!aiInput.trim() || isLoading"
            >
              发送
            </button>
          </div>
          <div class="mt-2 text-xs text-gray-500">
            按 Enter 发送，Shift+Enter 换行
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI, aiAPI } from './utils/api'

const router = useRouter()
const isLoggedIn = ref(false)
const user = ref(null)

// AI助手浮窗相关
const showAIFloat = ref(false)
const aiInput = ref('')
const isLoading = ref(false)
const textareaRef = ref(null)
const messagesContainerRef = ref(null)

// 对话数据
const conversations = ref([
  {
    title: '新对话',
    lastMessage: '',
    messages: []
  }
])

// 状态
const activeConversation = ref(0)

// 当前对话
const currentConversation = ref(conversations.value[0])

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  user.value = null
  router.push('/login')
}

// 页面加载时检查登录状态
const checkLoginStatus = async () => {
  const token = localStorage.getItem('token')
  const userInfo = localStorage.getItem('user')
  
  if (token && userInfo) {
    try {
      // 验证token是否有效
      const currentUser = await userAPI.getCurrentUser()
      user.value = currentUser
      isLoggedIn.value = true
    } catch (error) {
      // token无效，清除登录状态
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      isLoggedIn.value = false
      user.value = null
    }
  }
}

// 处理登录成功事件
const handleLoginSuccess = () => {
  checkLoginStatus()
}

// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendAIMessage()
  }
}

// 自动调整 textarea 高度
const autoResize = () => {
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
      textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 200) + 'px'
    }
  })
}

// 滚动到消息底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTo({
        top: messagesContainerRef.value.scrollHeight,
        behavior: 'smooth'
      })
    }
  })
}

// 新建对话
const newConversation = () => {
  const newConv = {
    title: '新对话',
    lastMessage: '',
    messages: []
  }
  conversations.value.push(newConv)
  activeConversation.value = conversations.value.length - 1
  currentConversation.value = newConv
}

// 清空消息
const clearMessages = () => {
  currentConversation.value.messages = []
  currentConversation.value.lastMessage = ''
}

// AI助手相关方法
const toggleAIFloat = () => {
  showAIFloat.value = !showAIFloat.value
  // 首次打开时添加欢迎消息
  if (showAIFloat.value && currentConversation.value.messages.length === 0) {
    currentConversation.value.messages.push({
      role: 'assistant',
      content: '你好！我是AI助手，有什么可以帮你的吗？',
      timestamp: new Date().toLocaleTimeString()
    })
  }
  // 滚动到底部
  scrollToBottom()
}

const sendAIMessage = async () => {
  if (!aiInput.value.trim() || isLoading.value) return
  
  const message = aiInput.value.trim()
  aiInput.value = ''
  
  // 重置 textarea 高度
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
  
  // 添加用户消息
  currentConversation.value.messages.push({
    role: 'user',
    content: message,
    timestamp: new Date().toLocaleTimeString()
  })
  
  // 更新对话标题和最后消息
  if (currentConversation.value.title === '新对话') {
    currentConversation.value.title = message.substring(0, 20) + (message.length > 20 ? '...' : '')
  }
  currentConversation.value.lastMessage = message
  
  // 滚动到底部
  scrollToBottom()
  
  // 调用大模型 API
  isLoading.value = true
  
  try {
    // 构建消息历史 - 添加系统提示
    const systemPrompt = {
      role: 'system',
      content: '你是一个算法学习助手，专门帮助用户学习算法和数据结构。请用简洁、清晰的语言回答问题，必要时提供代码示例。'
    }
    
    const conversationMessages = currentConversation.value.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }))
    
    // 将系统提示放在最前面
    const messages = [systemPrompt, ...conversationMessages]
    
    const response = await aiAPI.chat(messages)
    
    let reply = '抱歉，我遇到了问题，请稍后重试。'
    
    // 尝试多种响应格式
    if (response && response.choices && response.choices.length > 0 && response.choices[0].message) {
      reply = response.choices[0].message.content
    } else if (response && response.data && response.data.choices && response.data.choices.length > 0) {
      reply = response.data.choices[0].message.content
    } else if (response && response.message) {
      reply = response.message.content
    } else if (response && response.content) {
      reply = response.content
    } else if (typeof response === 'string') {
      reply = response
    } else if (response) {
      reply = JSON.stringify(response, null, 2)
    }
    
    currentConversation.value.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString()
    })
    currentConversation.value.lastMessage = reply.substring(0, 20) + (reply.length > 20 ? '...' : '')
    
    // 滚动到底部
    scrollToBottom()
  } catch (error) {
    let errorMsg = '抱歉，我遇到了技术问题，请稍后重试。'
    
    if (error.response) {
      errorMsg += `\n服务器响应: ${error.response.status} ${error.response.statusText}`
      if (error.response.data) {
        errorMsg += `\n详情: ${JSON.stringify(error.response.data, null, 2)}`
      }
    } else if (error.request) {
      errorMsg += '\n无法连接到服务器，请检查网络连接'
    } else {
      errorMsg += `\n错误信息: ${error.message}`
    }
    
    currentConversation.value.messages.push({
      role: 'assistant',
      content: errorMsg,
      timestamp: new Date().toLocaleTimeString()
    })
    
    // 滚动到底部
    scrollToBottom()
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  checkLoginStatus()
  // 监听登录成功事件
  window.addEventListener('loginSuccess', handleLoginSuccess)
})

onUnmounted(() => {
  // 移除事件监听
  window.removeEventListener('loginSuccess', handleLoginSuccess)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>