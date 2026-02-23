<template>
  <div
    :class="[
      'min-h-screen flex items-center justify-center transition-colors duration-300',
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
        : 'bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100'
    ]"
  >
    <!-- Background Glow (Dark Only) -->
    <div
      v-if="isDark"
      class="absolute inset-0 -z-10
      bg-[radial-gradient(1000px_600px_at_10%_-10%,rgba(59,130,246,0.15),transparent),
      radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.10),transparent)]"
    />

    <div class="w-full max-w-sm px-4">
      <!-- Card -->
      <div
        :class="[
          'rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300',
          isDark
            ? 'bg-slate-800 border border-white/10'
            : 'bg-white'
        ]"
      >
        <!-- Header -->
        <div
          class="px-6 py-8 text-center bg-gradient-to-r from-blue-600 to-blue-700"
        >
          <h1 class="text-3xl font-bold text-white mb-1">Struk App</h1>
          <p class="text-sm text-blue-100">
            Sistem Manajemen Resep Klinik
          </p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="p-6 space-y-4">
          <!-- Username Field -->
          <div>
            <label
              :class="[
                'block text-xs font-semibold mb-1.5 transition-colors',
                isDark ? 'text-gray-200' : 'text-gray-700'
              ]"
            >
              Username
            </label>
            <div class="relative">
              <input
                v-model="form.username"
                type="text"
                placeholder="Masukkan username"
                :disabled="isLoading || isCooldown"
                :class="[
                  'w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all',
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500',
                  (isLoading || isCooldown) && 'opacity-50 cursor-not-allowed'
                ]"
              />
              <svg
                :class="[
                  'absolute right-2.5 top-2.5 w-4 h-4 transition-colors',
                  isDark ? 'text-slate-400' : 'text-gray-400'
                ]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </div>

          <!-- Password Field -->
          <div>
            <label
              :class="[
                'block text-xs font-semibold mb-1.5 transition-colors',
                isDark ? 'text-gray-200' : 'text-gray-700'
              ]"
            >
              Password
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                :disabled="isLoading || isCooldown"
                :class="[
                  'w-full px-3 py-2 text-sm border-2 rounded-lg focus:outline-none transition-all',
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-500',
                  (isLoading || isCooldown) && 'opacity-50 cursor-not-allowed'
                ]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                :disabled="isCooldown"
                :class="[
                  'absolute right-2.5 top-2.5 transition-colors',
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600',
                  isCooldown && 'cursor-not-allowed opacity-50'
                ]"
              >
                <svg
                  v-if="showPassword"
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z"
                  />
                </svg>
                <svg
                  v-else
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- Cooldown Warning -->
          <div v-if="isCooldown" :class="[
            'bg-red-50 border-l-4 border-red-500 p-3 rounded text-sm transition-colors',
            isDark && 'bg-red-500/10 border-red-500/50'
          ]">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-red-600 text-lg" :class="isDark && 'text-red-400'">🔒</span>
              <p :class="['text-xs font-semibold', isDark ? 'text-red-300' : 'text-red-700']">
                Akun Terkunci Sementara
              </p>
            </div>
            <p :class="['text-xs', isDark ? 'text-red-200' : 'text-red-600']">
              Coba lagi dalam {{ cooldownTimer }} detik.
            </p>
          </div>

          <!-- Failed Attempt Tracking -->
          <div v-if="failedAttempts > 0 && !isCooldown" :class="[
            'flex items-center gap-2 p-2.5 rounded text-xs transition-colors',
            isDark
              ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          ]">
            <span>⚠</span>
            <span>
              {{ failedAttempts }}/10 percobaan gagal
              <span v-if="failedAttempts >= 8" class="font-semibold">(Hati-hati!)</span>
            </span>
          </div>

          <!-- Error Alert -->
          <div v-if="error && !isCooldown" :class="[
            'border-l-4 border-red-500 p-2.5 rounded text-xs transition-colors',
            isDark
              ? 'bg-red-500/10 text-red-300'
              : 'bg-red-50 text-red-700'
          ]">
            <p>{{ error }}</p>
          </div>

          <!-- Login Button -->
          <button
            type="submit"
            :disabled="isLoading || isCooldown"
            :class="[
              'w-full font-semibold py-2 rounded-lg text-sm transition-all duration-200 flex items-center justify-center space-x-2',
              isCooldown
                ? isDark
                  ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white',
              isLoading && 'opacity-70 cursor-not-allowed'
            ]"
          >
            <svg
              v-if="isLoading"
              class="animate-spin h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>{{ isCooldown ? 'Terkunci...' : isLoading ? 'Sedang login...' : 'Login' }}</span>
          </button>

          <!-- Demo Credentials -->
          <div
            :class="[
              'rounded-lg p-2.5 border text-xs transition-colors',
              isDark
                ? 'bg-blue-500/10 border-blue-500/30 text-blue-200'
                : 'bg-blue-50 border-blue-200 text-blue-700'
            ]"
          >
            <p class="font-semibold mb-1">📝 Demo Credentials:</p>
            <p>
              <strong>Username:</strong> admin<br />
              <strong>Password:</strong> 123456
            </p>
          </div>
        </form>
      </div>

      <!-- Footer -->
      <p
        :class="[
          'text-center text-xs mt-4 transition-colors',
          isDark ? 'text-gray-400' : 'text-gray-600'
        ]"
      >
        Struk App © 2026 • Sistem Manajemen Resep Klinik
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Card from '@/components/ui/Card.vue'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  username: '',
  password: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const error = ref(null)
const isDark = ref(true)

// Cooldown & failed attempts
const failedAttempts = ref(0)
const isCooldown = ref(false)
const cooldownTimer = ref(0)
let cooldownInterval = null

const STORAGE_KEY_ATTEMPTS = 'struk_login_attempts'
const STORAGE_KEY_COOLDOWN = 'struk_login_cooldown'
const MAX_ATTEMPTS = 10
const COOLDOWN_DURATION = 60

onMounted(() => {
  // Load theme from storage
  const saved = localStorage.getItem('theme')
  if (saved) {
    isDark.value = saved === 'dark'
  }
  applyTheme()

  // Load failed attempts from storage
  const storedAttempts = localStorage.getItem(STORAGE_KEY_ATTEMPTS)
  const storedCooldown = localStorage.getItem(STORAGE_KEY_COOLDOWN)

  if (storedAttempts) {
    failedAttempts.value = parseInt(storedAttempts)
  }

  // Check if cooldown is still active
  if (storedCooldown) {
    const cooldownEndTime = parseInt(storedCooldown)
    const now = Date.now()
    
    if (now < cooldownEndTime) {
      isCooldown.value = true
      startCooldownTimer(cooldownEndTime)
    } else {
      // Cooldown expired
      localStorage.removeItem(STORAGE_KEY_COOLDOWN)
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS)
      failedAttempts.value = 0
    }
  }
})

onBeforeUnmount(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function startCooldownTimer(endTime) {
  cooldownInterval = setInterval(() => {
    const now = Date.now()
    const remaining = Math.ceil((endTime - now) / 1000)

    if (remaining <= 0) {
      clearInterval(cooldownInterval)
      isCooldown.value = false
      cooldownTimer.value = 0
      failedAttempts.value = 0
      localStorage.removeItem(STORAGE_KEY_COOLDOWN)
      localStorage.removeItem(STORAGE_KEY_ATTEMPTS)
    } else {
      cooldownTimer.value = remaining
    }
  }, 100)
}

async function handleLogin() {
  error.value = null

  if (!form.value.username || !form.value.password) {
    error.value = 'Username dan password harus diisi'
    return
  }

  isLoading.value = true

  try {
    await authStore.login(form.value.username, form.value.password)
    
    // Clear on successful login
    localStorage.removeItem(STORAGE_KEY_ATTEMPTS)
    localStorage.removeItem(STORAGE_KEY_COOLDOWN)
    failedAttempts.value = 0
    
    router.push('/')
  } catch (err) {
    // Increment failed attempts
    failedAttempts.value++
    localStorage.setItem(STORAGE_KEY_ATTEMPTS, String(failedAttempts.value))
    
    error.value = err.userMessage || 'Login gagal'

    // Check if max attempts reached
    if (failedAttempts.value >= MAX_ATTEMPTS) {
      isCooldown.value = true
      const cooldownEndTime = Date.now() + (COOLDOWN_DURATION * 1000)
      localStorage.setItem(STORAGE_KEY_COOLDOWN, String(cooldownEndTime))
      startCooldownTimer(cooldownEndTime)
      error.value = null
    }
  } finally {
    isLoading.value = false
  }
}
</script>
