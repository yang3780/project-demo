<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">AI 助手</h2>
    
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- 左侧：历史对话列表 -->
      <div class="lg:col-span-1">
        <div class="card fixed-height-card">
          <h3 class="text-lg font-semibold mb-4">历史对话</h3>
          <div class="space-y-2 overflow-y-auto scrollbar-styled" style="max-height: calc(100% - 80px);">
            <div 
              v-for="(conversation, index) in conversations" 
              :key="index"
              class="p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
              :class="activeConversation === index ? 'bg-blue-50 border-blue-200' : ''"
              @click="switchConversation(index)"
            >
              <div class="font-medium text-sm truncate">{{ conversation.title }}</div>
              <div class="text-xs text-gray-500 mt-1">{{ conversation.lastMessage }}</div>
            </div>
            <button class="w-full p-3 border border-dashed rounded-md text-center text-gray-500 hover:bg-gray-50 transition-colors"
              @click="newConversation">
              + 新建对话
            </button>
          </div>
        </div>
      </div>
      
      <!-- 右侧：对话区 -->
      <div class="lg:col-span-3">
        <div class="card fixed-height-card flex flex-col">
          <div class="flex justify-between items-center border-b p-4 flex-shrink-0">
            <h3 class="text-lg font-semibold">{{ currentConversation.title }}</h3>
            <div class="flex space-x-2">
              <button class="text-gray-500 hover:text-gray-700" @click="clearMessages">
                清空
              </button>
              <button class="text-gray-500 hover:text-gray-700" @click="deleteConversation">
                删除
              </button>
            </div>
          </div>
          
          <!-- 消息列表 -->
          <div 
            class="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-styled"
            ref="messagesContainerRef"
          >
            <div 
              v-for="(message, index) in currentConversation.messages" 
              :key="index"
              class="flex message-fade-in" 
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
            <div v-if="isLoading" class="flex justify-start message-fade-in">
              <div class="bg-gray-100 p-3 rounded-lg">
                <div class="flex space-x-2">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 输入区 -->
          <div class="border-t p-4 flex-shrink-0">
            <div class="flex space-x-2 items-end">
              <textarea
                v-model="inputMessage"
                placeholder="输入你的问题... (Shift+Enter 换行)"
                class="input flex-1 resize-none"
                rows="1"
                @keydown="handleKeyDown"
                @input="autoResize"
                ref="textareaRef"
              ></textarea>
              <button class="btn btn-primary" @click="sendMessage" :disabled="!inputMessage.trim() || isLoading">
                发送
              </button>
            </div>
            <div class="mt-2 text-xs text-gray-500">
              AI 助手可以帮助你理解算法概念、解答编程问题、提供学习建议 | 按 Enter 发送，Shift+Enter 换行
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { aiAPI } from '../utils/api'

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
const inputMessage = ref('')
const isLoading = ref(false)
const textareaRef = ref(null)
const messagesContainerRef = ref(null)

// 当前对话
const currentConversation = ref(conversations.value[0])

// 处理键盘事件
const handleKeyDown = (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    sendMessage()
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

// 切换对话
const switchConversation = (index) => {
  activeConversation.value = index
  currentConversation.value = conversations.value[index]
  // 滚动到底部
  scrollToBottom()
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

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return
  
  const message = inputMessage.value.trim()
  inputMessage.value = ''
  
  // 重置 textarea 高度
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = 'auto'
    }
  })
  
  console.log('[AIView] 发送消息:', message)
  
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
    
    console.log('[AIView] 调用 API，消息历史:', messages)
    
    const response = await aiAPI.chat(messages)
    console.log('[AIView] API 响应:', response)
    
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
    
    console.log('[AIView] 解析后的回复:', reply)
    
    currentConversation.value.messages.push({
      role: 'assistant',
      content: reply,
      timestamp: new Date().toLocaleTimeString()
    })
    currentConversation.value.lastMessage = reply.substring(0, 20) + (reply.length > 20 ? '...' : '')
    
    // 滚动到底部
    scrollToBottom()
  } catch (error) {
    console.error('[AIView] AI 调用失败:', error)
    
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

// 清空消息
const clearMessages = () => {
  currentConversation.value.messages = []
  currentConversation.value.lastMessage = ''
}

// 删除对话
const deleteConversation = () => {
  if (conversations.value.length > 1) {
    conversations.value.splice(activeConversation.value, 1)
    activeConversation.value = 0
    currentConversation.value = conversations.value[0]
  } else {
    alert('至少需要保留一个对话')
  }
}
</script>