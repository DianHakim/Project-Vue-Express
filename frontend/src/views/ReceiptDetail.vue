<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap no-print">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Detail Struk</h2>
        <p class="text-slate-300 mt-1">Print, hapus, atau cek rincian.</p>
      </div>
      <div class="flex gap-2">
        <RouterLink to="/new"><Button variant="ghost">➕ Baru</Button></RouterLink>
        <Button variant="ghost" @click="print">🖨️ Print</Button>
        <Button variant="danger" @click="remove" :disabled="deleting">🗑️ Hapus</Button>
      </div>
    </div>

    <div class="mt-6">
      <div v-if="loading" class="text-sm text-slate-300">Memuat...</div>
      <div v-else-if="error" class="text-sm text-rose-300">{{ error }}</div>
      <div v-else-if="receipt">
        <ReceiptPaper :clinic="clinic" :data="receiptView" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import Button from '../components/ui/Button.vue'
import ReceiptPaper from '../components/receipt/ReceiptPaper.vue'
import { useReceiptsStore } from '../stores/receipts'
import { useAppStore } from '../stores/app'
import { shortDate } from '../lib/format'

const props = defineProps({ id: String })
const store = useReceiptsStore()
const app = useAppStore()

const loading = ref(true)
const deleting = ref(false)
const error = ref(null)
const receipt = ref(null)

onMounted(async () => {
  app.load()
  await load()
})

const clinic = computed(() => app.clinic)

const receiptView = computed(() => {
  if (!receipt.value) return null
  return {
    code: receipt.value.code,
    createdAtText: shortDate(receipt.value.createdAt),
    patientName: receipt.value.patientName,
    unit: receipt.value.unit,
    paymentMethod: receipt.value.paymentMethod,
    items: (receipt.value.items || []).map(it => ({
      name: it.name,
      qty: it.qty,
      price: it.price,
      total: it.qty * it.price
    })),
    subtotal: receipt.value.subtotal,
    discount: receipt.value.discount,
    tax: receipt.value.tax,
    total: receipt.value.total,
    paid: receipt.value.paid,
    change: receipt.value.change,
    note: receipt.value.note
  }
})

async function load() {
  loading.value = true
  error.value = null
  try {
    receipt.value = await store.fetchOne(props.id)
  } catch (e) {
    error.value = e.userMessage || 'Gagal memuat.'
  } finally {
    loading.value = false
  }
}

function print() {
  window.print()
}

async function remove() {
  if (!confirm('Hapus transaksi ini?')) return
  deleting.value = true
  try {
    await store.remove(props.id)
    window.location.href = '/'
  } catch (e) {
    alert(e.userMessage || 'Gagal hapus.')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped></style>
