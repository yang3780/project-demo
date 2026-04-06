<template>
  <div class="space-y-4">
    <h2 class="text-2xl font-bold">题库管理</h2>
    
    <!-- 搜索和筛选 -->
    <div class="card p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-gray-600 mb-1">题目ID</label>
          <input type="number" v-model="searchParams.id" class="input w-full" placeholder="输入题目ID" />
        </div>
        <div>
          <label class="block text-gray-600 mb-1">难度级别</label>
          <select v-model="searchParams.difficulty" class="input w-full">
            <option value="">全部</option>
            <option value="1">简单</option>
            <option value="2">中等</option>
            <option value="3">困难</option>
          </select>
        </div>
        <div>
          <label class="block text-gray-600 mb-1">知识点分类</label>
          <select v-model="searchParams.type" class="input w-full">
            <option value="">全部</option>
            <option value="字符串">字符串</option>
            <option value="数组">数组</option>
            <option value="链表">链表</option>
            <option value="树">树</option>
            <option value="图论">图论</option>
            <option value="动态规划">动态规划</option>
            <option value="贪心">贪心</option>
            <option value="回溯">回溯</option>
          </select>
        </div>
      </div>
      <div class="mt-4 flex justify-end">
        <button class="btn btn-primary" @click="searchQuestions">搜索</button>
        <button class="btn btn-outline ml-2" @click="resetSearch">重置</button>
        <button class="btn btn-success ml-2" @click="openCreateModal">添加题目</button>
      </div>
    </div>
    
    <!-- 题目列表 -->
    <div class="card">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-gray-50">
              <th class="px-4 py-2 text-left">
                <input type="checkbox" v-model="selectAll" @change="toggleSelectAll" />
              </th>
              <th class="px-4 py-2 text-left">ID</th>
              <th class="px-4 py-2 text-left">题目</th>
              <th class="px-4 py-2 text-left">难度</th>
              <th class="px-4 py-2 text-left">分类</th>
              <th class="px-4 py-2 text-left">积分</th>
              <th class="px-4 py-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="questions.length === 0" class="border-b">
              <td colspan="7" class="px-4 py-4 text-center text-gray-500">暂无题目</td>
            </tr>
            <tr v-for="question in questions" :key="question.id" class="border-b">
              <td class="px-4 py-2">
                <input type="checkbox" v-model="selectedQuestions" :value="question.id" />
              </td>
              <td class="px-4 py-2">{{ question.id }}</td>
              <td class="px-4 py-2">
                <div class="font-medium">{{ question.title }}</div>
                <div class="text-sm text-gray-500 line-clamp-1">{{ question.description }}</div>
              </td>
              <td class="px-4 py-2">{{ getDifficultyText(question.difficulty) }}</td>
              <td class="px-4 py-2">{{ question.type }}</td>
              <td class="px-4 py-2">{{ question.score }}</td>
              <td class="px-4 py-2">
                <div class="flex space-x-2">
                  <button class="btn btn-sm btn-primary" @click="openEditModal(question)">编辑</button>
                  <button class="btn btn-sm btn-danger" @click="deleteQuestion(question.id)">删除</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div class="mt-4 flex justify-between items-center p-4 border-t">
        <div>
          <span>已选择 {{ selectedQuestions.length }} 个题目</span>
          <button 
            v-if="selectedQuestions.length > 0" 
            class="btn btn-danger ml-2" 
            @click="batchDelete"
          >
            批量删除
          </button>
        </div>
        <div class="flex space-x-2">
          <button 
            class="btn btn-outline px-3 py-1" 
            :disabled="currentPage === 1" 
            @click="handlePageChange(currentPage - 1)"
          >
            上一页
          </button>
          <span class="flex items-center px-3 py-1">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button 
            class="btn btn-outline px-3 py-1" 
            :disabled="currentPage === totalPages" 
            @click="handlePageChange(currentPage + 1)"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
    <!-- 创建题目模态框 -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">添加题目</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showCreateModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="createQuestion">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 mb-1">题目名称</label>
                <input type="text" v-model="newQuestion.title" class="input w-full" required />
              </div>
              <div>
                <label class="block text-gray-600 mb-1">题目描述</label>
                <textarea v-model="newQuestion.description" class="input w-full h-32" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">输入格式</label>
                <textarea v-model="newQuestion.input_format" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">输出格式</label>
                <textarea v-model="newQuestion.output_format" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">样例输入</label>
                <textarea v-model="newQuestion.sample_input" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">样例输出</label>
                <textarea v-model="newQuestion.sample_output" class="input w-full h-16" required></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">难度级别</label>
                  <select v-model="newQuestion.difficulty" class="input w-full" required>
                    <option value="1">简单</option>
                    <option value="2">中等</option>
                    <option value="3">困难</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">知识点分类</label>
                  <select v-model="newQuestion.type" class="input w-full" required>
                    <option value="字符串">字符串</option>
                    <option value="数组">数组</option>
                    <option value="链表">链表</option>
                    <option value="树">树</option>
                    <option value="图论">图论</option>
                    <option value="动态规划">动态规划</option>
                    <option value="贪心">贪心</option>
                    <option value="回溯">回溯</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">积分</label>
                  <input type="number" v-model="newQuestion.score" class="input w-full" required />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">时间限制 (ms)</label>
                  <input type="number" v-model="newQuestion.time_limit" class="input w-full" required />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">内存限制 (KB)</label>
                  <input type="number" v-model="newQuestion.memory_limit" class="input w-full" required />
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" class="btn btn-outline" @click="showCreateModal = false">取消</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  {{ isSubmitting ? '提交中...' : '提交' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    
    <!-- 编辑题目模态框 -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-semibold">编辑题目</h3>
            <button class="text-gray-500 hover:text-gray-700" @click="showEditModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <form @submit.prevent="updateQuestion">
            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 mb-1">题目名称</label>
                <input type="text" v-model="editQuestion.title" class="input w-full" required />
              </div>
              <div>
                <label class="block text-gray-600 mb-1">题目描述</label>
                <textarea v-model="editQuestion.description" class="input w-full h-32" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">输入格式</label>
                <textarea v-model="editQuestion.input_format" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">输出格式</label>
                <textarea v-model="editQuestion.output_format" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">样例输入</label>
                <textarea v-model="editQuestion.sample_input" class="input w-full h-16" required></textarea>
              </div>
              <div>
                <label class="block text-gray-600 mb-1">样例输出</label>
                <textarea v-model="editQuestion.sample_output" class="input w-full h-16" required></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">难度级别</label>
                  <select v-model="editQuestion.difficulty" class="input w-full" required>
                    <option value="1">简单</option>
                    <option value="2">中等</option>
                    <option value="3">困难</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">知识点分类</label>
                  <select v-model="editQuestion.type" class="input w-full" required>
                    <option value="字符串">字符串</option>
                    <option value="数组">数组</option>
                    <option value="链表">链表</option>
                    <option value="树">树</option>
                    <option value="图论">图论</option>
                    <option value="动态规划">动态规划</option>
                    <option value="贪心">贪心</option>
                    <option value="回溯">回溯</option>
                  </select>
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">积分</label>
                  <input type="number" v-model="editQuestion.score" class="input w-full" required />
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-1">时间限制 (ms)</label>
                  <input type="number" v-model="editQuestion.time_limit" class="input w-full" required />
                </div>
                <div>
                  <label class="block text-gray-600 mb-1">内存限制 (KB)</label>
                  <input type="number" v-model="editQuestion.memory_limit" class="input w-full" required />
                </div>
              </div>
              <div class="flex justify-end space-x-2">
                <button type="button" class="btn btn-outline" @click="showEditModal = false">取消</button>
                <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                  {{ isSubmitting ? '更新中...' : '更新' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { questionAPI } from '../utils/api'

// 状态
const questions = ref([])
const searchParams = ref({ id: '', difficulty: '', type: '' })
const selectedQuestions = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = ref(false)
const isSubmitting = ref(false)

// 模态框状态
const showCreateModal = ref(false)
const showEditModal = ref(false)

// 题目数据
const newQuestion = ref({
  title: '',
  description: '',
  input_format: '',
  output_format: '',
  sample_input: '',
  sample_output: '',
  difficulty: '1',
  score: 10,
  type: '字符串',
  time_limit: 1000,
  memory_limit: 32768
})

const editQuestion = ref({
  id: '',
  title: '',
  description: '',
  input_format: '',
  output_format: '',
  sample_input: '',
  sample_output: '',
  difficulty: '',
  score: 0,
  type: '',
  time_limit: 0,
  memory_limit: 0
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(questions.value.length / pageSize.value)
})

// 计算当前页的题目
const paginatedQuestions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return questions.value.slice(start, end)
})

// 分页控制
const handlePageChange = (page) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedQuestions.value = questions.value.map(q => q.id)
  } else {
    selectedQuestions.value = []
  }
}

// 获取题目列表
const getQuestions = async () => {
  isLoading.value = true
  try {
    const response = await questionAPI.getQuestions(searchParams.value)
    questions.value = response
  } catch (error) {
    console.error('获取题目列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 搜索题目
const searchQuestions = () => {
  currentPage.value = 1
  getQuestions()
}

// 重置搜索
const resetSearch = () => {
  searchParams.value = { id: '', difficulty: '', type: '' }
  currentPage.value = 1
  getQuestions()
}

// 打开创建题目模态框
const openCreateModal = () => {
  newQuestion.value = {
    title: '',
    description: '',
    input_format: '',
    output_format: '',
    sample_input: '',
    sample_output: '',
    difficulty: '1',
    score: 10,
    type: '字符串',
    time_limit: 1000,
    memory_limit: 32768
  }
  showCreateModal.value = true
}

// 打开编辑题目模态框
const openEditModal = (question) => {
  editQuestion.value = {
    id: question.id,
    title: question.title,
    description: question.description,
    input_format: question.input_format,
    output_format: question.output_format,
    sample_input: question.sample_input,
    sample_output: question.sample_output,
    difficulty: question.difficulty.toString(),
    score: question.score,
    type: question.type,
    time_limit: question.time_limit,
    memory_limit: question.memory_limit
  }
  showEditModal.value = true
}

// 创建题目
const createQuestion = async () => {
  isSubmitting.value = true
  try {
    await questionAPI.createQuestion(newQuestion.value)
    showCreateModal.value = false
    getQuestions()
    alert('题目创建成功')
  } catch (error) {
    console.error('创建题目失败:', error)
    alert('创建题目失败')
  } finally {
    isSubmitting.value = false
  }
}

// 更新题目
const updateQuestion = async () => {
  isSubmitting.value = true
  try {
    await questionAPI.updateQuestion(editQuestion.value.id, editQuestion.value)
    showEditModal.value = false
    getQuestions()
    alert('题目更新成功')
  } catch (error) {
    console.error('更新题目失败:', error)
    alert('更新题目失败')
  } finally {
    isSubmitting.value = false
  }
}

// 删除题目
const deleteQuestion = async (id) => {
  if (confirm('确定要删除这个题目吗？')) {
    try {
      await questionAPI.deleteQuestion(id)
      getQuestions()
      alert('题目删除成功')
    } catch (error) {
      console.error('删除题目失败:', error)
      alert('删除题目失败')
    }
  }
}

// 批量删除
const batchDelete = async () => {
  if (selectedQuestions.value.length === 0) return
  
  if (confirm(`确定要删除选中的 ${selectedQuestions.value.length} 个题目吗？`)) {
    try {
      for (const id of selectedQuestions.value) {
        await questionAPI.deleteQuestion(id)
      }
      selectedQuestions.value = []
      selectAll.value = false
      getQuestions()
      alert('批量删除成功')
    } catch (error) {
      console.error('批量删除失败:', error)
      alert('批量删除失败')
    }
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

// 初始加载
onMounted(() => {
  getQuestions()
})
</script>
