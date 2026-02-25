<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Halaman Kasir</h2>
        <p class="text-slate-300 mt-1">Daftar struk yang dibuat oleh akun kasir Anda.</p>
      </div>
      <RouterLink to="/new" class="no-print">
        <Button>➕ Buat Struk</Button>
      </RouterLink>
    </div>

    <div class="mt-6">
      <Card class="p-5">
        <div v-if="store.loading" class="text-sm text-slate-300">Memuat...</div>
        <div v-else-if="store.error" class="text-sm text-rose-300">{{ store.error }}</div>
        <div v-else class="divide-y divide-white/10">
          <div v-for="t in myList" :key="t.id" class="py-3 px-3 hover:bg-white/5 rounded-xl transition flex items-center justify-between gap-3">
            <RouterLink :to="`/receipt/${t.id}`" class="flex-1 min-w-0 block">
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <p class="text-sm font-semibold truncate">{{ t.patientName || '—' }}</p>
                  <p class="text-xs text-slate-400 truncate">{{ t.code }} • {{ shortDate(t.createdAt) }}</p>
                </div>
                <div class="text-right">
                  <p class="text-sm font-semibold">{{ rupiah(t.total) }}</p>
                  <p class="text-xs text-slate-400">{{ t.paymentMethod || '-' }}</p>
                </div>
              </div>
            </RouterLink>
          </div>

          <div v-if="myList.length === 0" class="py-8 text-center text-sm text-slate-400">
            Belum ada struk yang dibuat oleh Anda.
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useReceiptsStore } from '../stores/receipts'
import { useAuthStore } from '../stores/auth'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { rupiah, shortDate } from '../lib/format'

const store = useReceiptsStore()
const auth = useAuthStore()

onMounted(async () => {
  await store.fetchAll()
})

const myList = computed(() => {
  if (!auth.user) return []
  return store.items.filter(t => t.user && Number(t.user.id) === Number(auth.user.id))
})
</script>

<style scoped></style>
