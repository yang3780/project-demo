<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">登录</h2>
    <div class="card p-6">
      <form @submit.prevent="login">
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">用户名</label>
          <input 
            type="text" 
            v-model="form.username" 
            class="input w-full" 
            placeholder="请输入用户名"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">密码</label>
          <input 
            type="password" 
            v-model="form.password" 
            class="input w-full" 
            placeholder="请输入密码"
            required
          />
        </div>
        <div class="mb-6">
          <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
            {{ isLoading ? '登录中...' : '登录' }}
          </button>
        </div>
        <div class="text-center">
          <p>还没有账号？ <router-link to="/register" class="text-primary hover:underline">立即注册</router-link></p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../utils/api'

const router = useRouter()
const form = ref({
  username: '',
  password: ''
})
const isLoading = ref(false)
const error = ref('')

const login = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await userAPI.login({
      username: form.value.username,
      password: form.value.password
    })
    // 保存token和用户信息到localStorage
    localStorage.setItem('token', response.token)
    localStorage.setItem('user', JSON.stringify(response.user))
    // 触发登录成功事件，通知App组件更新状态
    window.dispatchEvent(new Event('loginSuccess'))
    // 登录成功后跳转到首页
    router.push('/')
  } catch (err) {
    error.value = err.error || '登录失败，请检查用户名和密码'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>