<template>
  <div class="flex flex-col lg:flex-row gap-6">
    <!-- 侧边栏筛选器 -->
    <aside class="lg:w-64 shrink-0">
      <div class="card sticky top-24">
        <h3 class="text-lg font-semibold mb-4">筛选条件</h3>
        
        <!-- 难度筛选 -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">难度</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="radio" name="difficulty" v-model="filters.difficulty" value="" class="mr-2">
              <span>全部</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="difficulty" v-model="filters.difficulty" value="1" class="mr-2">
              <span>简单</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="difficulty" v-model="filters.difficulty" value="2" class="mr-2">
              <span>中等</span>
            </label>
            <label class="flex items-center">
              <input type="radio" name="difficulty" v-model="filters.difficulty" value="3" class="mr-2">
              <span>困难</span>
            </label>
          </div>
        </div>
        
        <!-- 类型筛选 -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">类型</h4>
          <div class="space-y-2">
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="排序" class="mr-2">
              <span>排序</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="图论" class="mr-2">
              <span>图论</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="动态规划" class="mr-2">
              <span>动态规划</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="字符串" class="mr-2">
              <span>字符串</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="数组" class="mr-2">
              <span>数组</span>
            </label>
            <label class="flex items-center">
              <input type="checkbox" v-model="filters.types" value="树" class="mr-2">
              <span>树</span>
            </label>
          </div>
        </div>
        
        <!-- 搜索框 -->
        <div class="mb-4">
          <h4 class="text-sm font-medium text-gray-700 mb-2">搜索</h4>
          <input
            type="text"
            placeholder="按标题搜索"
            v-model="filters.search"
            class="input w-full"
          />
        </div>
        
        <!-- 重置按钮 -->
        <button class="btn btn-outline w-full" @click="resetFilters">重置筛选</button>
      </div>
    </aside>
    
    <!-- 右侧题目列表 -->
    <main class="flex-1">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold">题库</h2>
        <div class="text-gray-500">共 {{ filteredQuestions.length }} 道题目</div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="question in filteredQuestions"
          :key="question.id"
          class="card cursor-pointer hover:border-primary transition-colors"
          @click="navigateToQuestion(question.id)"
        >
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-lg font-semibold">{{ question.title }}</h3>
            <span :class="getDifficultyClass(question.difficulty)">{{ getDifficultyText(question.difficulty) }}</span>
          </div>
          <p class="text-gray-600 text-sm mb-4 line-clamp-2">{{ question.description }}</p>
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <span class="text-gray-500 text-sm">积分: {{ question.score }}</span>
              <span class="text-gray-500 text-sm">{{ question.type }}</span>
            </div>
            <span class="text-gray-400 text-sm">{{ question.time_limit }}ms / {{ question.memory_limit }}MB</span>
          </div>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="mt-8 flex justify-center">
        <div class="flex space-x-2">
          <button class="btn btn-outline px-3 py-1" :disabled="currentPage === 1">上一页</button>
          <span class="flex items-center px-3 py-1">第 {{ currentPage }} 页，共 {{ totalPages }} 页</span>
          <button class="btn btn-outline px-3 py-1" :disabled="currentPage === totalPages">下一页</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { questionAPI } from '../utils/api'

const router = useRouter()

// 从API获取题目数据
const questions = ref([])
const isLoading = ref(false)

// 页面加载时获取题目数据
onMounted(async () => {
  isLoading.value = true
  try {
    const data = await questionAPI.getQuestions()
    questions.value = data
  } catch (error) {
    console.error('获取题目失败:', error)
  } finally {
    isLoading.value = false
  }
})

// 筛选条件
const filters = ref({
  difficulty: '',
  types: [],
  search: ''
})

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 过滤后的题目
const filteredQuestions = computed(() => {
  let result = questions.value
  
  // 按难度筛选
  if (filters.value.difficulty) {
    result = result.filter(q => q.difficulty == filters.value.difficulty)
  }
  
  // 按类型筛选
  if (filters.value.types.length > 0) {
    result = result.filter(q => filters.value.types.includes(q.type))
  }
  
  // 按搜索词筛选
  if (filters.value.search) {
    const searchTerm = filters.value.search.toLowerCase()
    result = result.filter(q => q.title.toLowerCase().includes(searchTerm))
  }
  
  return result
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQuestions.value.length / pageSize.value)
})

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

// 重置筛选条件
const resetFilters = () => {
  filters.value = {
    difficulty: '',
    types: [],
    search: ''
  }
}

// 导航到题目详情页
const navigateToQuestion = (id) => {
  router.push(`/question/${id}`)
}
</script>