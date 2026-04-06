<template>
  <div class="max-w-md mx-auto">
    <h2 class="text-2xl font-bold mb-6 text-center">注册</h2>
    <div class="card p-6">
      <form @submit.prevent="register">
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
          <label class="block text-gray-600 mb-1">邮箱</label>
          <input 
            type="email" 
            v-model="form.email" 
            class="input w-full" 
            placeholder="请输入邮箱"
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
        <div class="mb-4">
          <label class="block text-gray-600 mb-1">确认密码</label>
          <input 
            type="password" 
            v-model="form.confirmPassword" 
            class="input w-full" 
            placeholder="请确认密码"
            required
          />
        </div>
        <div class="mb-6">
          <button type="submit" class="btn btn-primary w-full" :disabled="isLoading">
            {{ isLoading ? '注册中...' : '注册' }}
          </button>
        </div>
        <div class="text-center">
          <p>已有账号？ <router-link to="/login" class="text-primary hover:underline">立即登录</router-link></p>
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
  email: '',
  password: '',
  confirmPassword: ''
})
const isLoading = ref(false)
const error = ref('')

const register = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    await userAPI.register({
      username: form.value.username,
      password: form.value.password,
      email: form.value.email
    })
    // 注册成功后跳转到登录页
    alert('注册成功，请登录')
    router.push('/login')
  } catch (err) {
    error.value = err.error || '注册失败，请重试'
    alert(error.value)
  } finally {
    isLoading.value = false
  }
}
</script>