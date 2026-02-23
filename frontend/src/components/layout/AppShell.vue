<template>
  <div
    :class="[
      'relative min-h-screen overflow-hidden transition-colors duration-300',
      isDark
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-100 text-slate-800'
    ]"
  >
    <!-- Background Glow (Dark Only) -->
    <div
      v-if="isDark && !isLoginPage"
      class="absolute inset-0 -z-10 
      bg-[radial-gradient(1000px_600px_at_10%_-10%,rgba(59,130,246,0.25),transparent),
      radial-gradient(800px_500px_at_90%_0%,rgba(16,185,129,0.20),transparent),
      radial-gradient(900px_500px_at_50%_120%,rgba(139,92,246,0.15),transparent)]">
    </div>

    <!-- ================= HEADER ================= -->
    <header
      v-if="!isLoginPage"
      :class="[
        'relative no-print backdrop-blur-xl border-b transition-colors duration-300',
        isDark
          ? 'bg-slate-900/40 border-white/5'
          : 'bg-white/70 border-slate-200'
      ]"
    >
      <div class="mx-auto max-w-6xl px-4 py-6 flex items-center justify-between">

        <!-- Logo -->
        <div class="flex items-center gap-3">
          <div
            :class="[
              'h-12 w-12 rounded-2xl grid place-items-center overflow-hidden ring-1 transition-all duration-300',
              isDark
                ? 'bg-white/10 ring-white/15'
                : 'bg-slate-200 ring-slate-300'
            ]"
          >
            <img src="/logo.png" alt="Logo" class="h-8 w-8 object-contain" />
          </div>

          <div>
            <p :class="isDark ? 'text-slate-400' : 'text-slate-500'" class="text-sm">
              Struk Generator
            </p>
            <h1 class="text-lg font-semibold tracking-tight">
              Klinik & Kasir
            </h1>
          </div>
        </div>

        <!-- Nav + Controls -->
        <div class="flex items-center gap-4">

          <nav class="flex items-center gap-2 text-sm">
            <RouterLink class="navlink" to="/">Dashboard</RouterLink>
            <RouterLink class="navlink" to="/new">Buat Struk</RouterLink>
            <RouterLink class="navlink" to="/settings">Settings</RouterLink>
            <RouterLink class="navlink" to="/trash">🗑️ Trash</RouterLink>
          </nav>

          <div class="flex items-center gap-3">

            <!-- User -->
            <div
              v-if="authStore.user"
              :class="[
                'px-3 py-2 rounded-xl text-xs flex items-center gap-2 ring-1 transition-all',
                isDark
                  ? 'bg-white/5 ring-white/10 text-slate-300'
                  : 'bg-slate-200 ring-slate-300 text-slate-700'
              ]"
            >
              👤 {{ authStore.user.username }}
            </div>

            <!-- Theme Toggle -->
            <button
              @click="toggleTheme"
              class="px-3 py-2 rounded-xl text-sm transition-all duration-200 active:scale-95 ring-1"
              :class="isDark
                ? 'bg-white/10 ring-white/15 hover:bg-white/20'
                : 'bg-slate-200 ring-slate-300 hover:bg-slate-300'"
            >
              {{ isDark ? '☀ Light' : '🌙 Dark' }}
            </button>

            <!-- Logout -->
            <button
              @click="handleLogout"
              class="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-95 ring-1"
              :class="isDark
                ? 'bg-red-500/20 text-red-300 ring-red-500/30 hover:bg-red-500/30'
                : 'bg-red-50 text-red-700 ring-red-200 hover:bg-red-100'"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </header>

    <!-- ================= MAIN ================= -->
    <main class="relative">
      <div
        :class="[
          'mx-auto max-w-6xl px-4',
          isLoginPage ? '' : 'pb-10 pt-6'
        ]"
      >

        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>

      </div>
    </main>

    <!-- ================= FOOTER ================= -->
    <footer
      v-if="!isLoginPage"
      :class="[
        'relative no-print border-t mt-10 transition-colors duration-300',
        isDark
          ? 'border-white/5 text-slate-500'
          : 'border-slate-200 text-slate-500'
      ]"
    >
      <div class="mx-auto max-w-6xl px-4 py-8 text-xs flex justify-between flex-wrap">
        <p>© {{ year }} Struk App • Vue 3 + Express + MySQL</p>
        <p class="opacity-80">Tip: klik “Print” untuk cetak versi thermal.</p>
      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const year = new Date().getFullYear()
const isDark = ref(true)

const isLoginPage = computed(() => route.path === '/login')

/* ================= INIT THEME ================= */

onMounted(() => {
  const saved = localStorage.getItem('theme')

  if (saved === 'dark') {
    isDark.value = true
  } else {
    isDark.value = false
  }

  applyTheme()
})

watch(isDark, () => {
  applyTheme()
})

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }

  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

function toggleTheme() {
  isDark.value = !isDark.value
}

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
  transition: all 0.18s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.navlink {
  @apply px-3 py-2 rounded-xl transition-all duration-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 hover:scale-[1.03] active:scale-95;
}

:deep(.dark) .navlink {
  @apply text-slate-300 hover:text-white hover:bg-white/10;
}

.router-link-active {
  @apply bg-slate-300 text-slate-900;
}

:deep(.dark) .router-link-active {
  @apply bg-white/15 text-white;
}
</style>