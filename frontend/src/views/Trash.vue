<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">🗑️ Sampah</h2>
        <p class="text-slate-300 mt-1">Data transaksi yang telah dihapus dan dapat dipulihkan.</p>
      </div>
      <RouterLink to="/" class="no-print">
        <Button>← Kembali ke Dashboard</Button>
      </RouterLink>
    </div>

    <div class="mt-6">
      <Card class="p-5 lg:col-span-2">
        <div class="flex items-center justify-between gap-3 mb-4">
          <div>
            <p class="text-sm font-semibold">Data Terhapus</p>
            <p class="text-xs text-slate-400">Total: {{ store.deleted.length }} transaksi</p>
          </div>
          <input 
            v-model="q" 
            class="w-full max-w-xs rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm placeholder:text-slate-500 focus:ring-white/20"
            placeholder="Cari pasien / kode..." 
          />
        </div>

        <div v-if="store.deletedLoading" class="text-sm text-slate-300 py-8 text-center">
          Loading...
        </div>
        <div v-else-if="store.error" class="text-sm text-rose-300 py-8 text-center">
          {{ store.error }}
        </div>
        <div v-else class="divide-y divide-white/10">
          <div
            v-for="t in filtered"
            :key="t.id"
            class="py-4 px-3 hover:bg-white/5 rounded-xl transition flex items-center justify-between gap-4"
          >
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold truncate">{{ t.patientName || '—' }}</p>
              <p class="text-xs text-slate-400 truncate">
                {{ t.code }} • Dihapus: {{ relativeDate(t.deletedAt) }}
              </p>
              <p v-if="t.items && t.items.length" class="text-xs text-slate-500 mt-1">
                {{ t.items.length }} item • {{ rupiah(t.total) }}
              </p>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <button
                v-if="authStore.isAdmin"
                @click="restoreItem(t.id)"
                class="px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ring-1"
                :class="
                  isRestoring === t.id
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30 hover:bg-emerald-500/30'
                "
                :disabled="isRestoring === t.id"
              >
                {{ isRestoring === t.id ? '⟳ ...' : '↩️ Pulihkan' }}
              </button>
              <button
                v-if="authStore.isAdmin"
                @click="deletePermanently(t.id)"
                class="px-3 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ring-1"
                :class="
                  isDeleting === t.id
                    ? 'opacity-50 cursor-not-allowed'
                    : 'bg-red-500/20 text-red-300 ring-red-500/30 hover:bg-red-500/30'
                "
                :disabled="isDeleting === t.id"
              >
                {{ isDeleting === t.id ? '⟳ ...' : '🗑️ Hapus Tetap' }}
              </button>
            </div>
          </div>

          <div v-if="filtered.length === 0" class="py-8 text-center text-sm text-slate-400">
            {{ store.deleted.length === 0 ? 'Tidak ada data terhapus.' : 'Tidak ada yang cocok dengan pencarian.' }}
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import { useReceiptsStore } from '../stores/receipts'
import { rupiah } from '../lib/format'
import api from '../lib/http'
import { useAuthStore } from '../stores/auth'

const store = useReceiptsStore()
const authStore = useAuthStore()
const q = ref('')
const isRestoring = ref(null)
const isDeleting = ref(null)

const filtered = computed(() => {
  let result = store.deleted
  const s = q.value.trim().toLowerCase()
  if (s) {
    result = result.filter(x =>
      String(x.patientName || '').toLowerCase().includes(s) ||
      String(x.code || '').toLowerCase().includes(s)
    )
  }
  return result.sort((a, b) => new Date(b.deletedAt) - new Date(a.deletedAt))
})

function relativeDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Baru saja'
  if (diffMins < 60) return `${diffMins}m yang lalu`
  if (diffHours < 24) return `${diffHours}h yang lalu`
  if (diffDays < 7) return `${diffDays}h yang lalu`
  
  return date.toLocaleDateString('id-ID')
}

async function restoreItem(id) {
  if (!confirm('Yakin ingin memulihkan transaksi ini?')) return
  
  try {
    isRestoring.value = id
    await store.restore(id)
    alert('Transaksi berhasil dipulihkan!')
  } catch (error) {
    alert('Gagal memulihkan: ' + (error.response?.data?.message || error.message))
  } finally {
    isRestoring.value = null
  }
}

async function deletePermanently(id) {
  if (!confirm('Yakin ingin menghapus PERMANEN? Data tidak bisa dikembalikan!')) return
  
  try {
    isDeleting.value = id
    await api.delete(`/transactions/${id}/permanent`)
    store.deleted = store.deleted.filter(x => x.id !== id)
    alert('Transaksi berhasil dihapus secara permanen!')
  } catch (error) {
    alert('Gagal menghapus: ' + (error.response?.data?.message || error.message))
  } finally {
    isDeleting.value = null
  }
}

onMounted(async () => {
  await store.fetchDeleted()
})
</script>

<style scoped></style>
