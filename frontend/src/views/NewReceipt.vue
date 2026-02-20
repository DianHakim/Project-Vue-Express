<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap no-print">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Buat Struk</h2>
        <p class="text-slate-300 mt-1">Form cepat + preview realtime, siap print.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="ghost" @click="reset">Reset</Button>
        <Button :disabled="saving" @click="save">💾 Simpan</Button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card class="p-5 no-print">
        <form class="space-y-4" @submit.prevent="save">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="label">Nama Pasien</label>
              <input v-model="form.patientName" class="input" placeholder="Mis: Ny. Sari" />
            </div>
            <div>
              <label class="label">Unit/Dokter</label>
              <input v-model="form.unit" class="input" placeholder="Mis: Poli KIA / dr. ..." />
            </div>
            <div>
              <label class="label">Metode Bayar</label>
              <select v-model="form.paymentMethod" class="input">
                <option value="Cash">Cash</option>
                <option value="Transfer">Transfer</option>
                <option value="QRIS">QRIS</option>
                <option value="Debit">Debit</option>
              </select>
            </div>
            <div>
              <label class="label">Diskon (Rp)</label>
              <input v-model.number="form.discount" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="label">Pajak (Rp)</label>
              <input v-model.number="form.tax" type="number" min="0" class="input" />
            </div>
            <div>
              <label class="label">Bayar (Rp)</label>
              <input v-model.number="form.paid" type="number" min="0" class="input" />
            </div>
          </div>

          <div>
            <div class="flex items-center justify-between">
              <label class="label">Item</label>
              <Button variant="ghost" type="button" @click="addItem">➕ Tambah</Button>
            </div>

            <div class="mt-2 space-y-2">
              <div v-for="(it, idx) in form.items" :key="idx" class="rounded-xl bg-white/5 ring-1 ring-white/10 p-3">
                <div class="grid grid-cols-1 sm:grid-cols-12 gap-2 items-end">
                  <div class="sm:col-span-6">
                    <label class="label2">Nama</label>
                    <input v-model="it.name" class="input" placeholder="Mis: USG / Konsultasi" />
                  </div>
                  <div class="sm:col-span-2">
                    <label class="label2">Qty</label>
                    <input v-model.number="it.qty" type="number" min="1" class="input" />
                  </div>
                  <div class="sm:col-span-3">
                    <label class="label2">Harga</label>
                    <input v-model.number="it.price" type="number" min="0" class="input" />
                  </div>
                  <div class="sm:col-span-1 flex justify-end">
                    <Button variant="danger" type="button" @click="removeItem(idx)" title="Hapus">✕</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label class="label">Catatan</label>
            <textarea v-model="form.note" rows="3" class="input" placeholder="Terima kasih..."></textarea>
          </div>

          <p v-if="error" class="text-sm text-rose-300">{{ error }}</p>
        </form>
      </Card>

      <div class="lg:sticky lg:top-6 h-fit">
        <div class="flex items-center justify-between mb-3 no-print">
          <p class="text-sm text-slate-300">Preview</p>
          <div class="flex gap-2">
            <Button variant="ghost" @click="print">🖨️ Print</Button>
          </div>
        </div>

        <ReceiptPaper :clinic="clinic" :data="computedReceipt" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import ReceiptPaper from '../components/receipt/ReceiptPaper.vue'
import Info from '../components/receipt/Info.vue'
import Row from '../components/receipt/Row.vue'
import { useReceiptsStore } from '../stores/receipts'
import { useAppStore } from '../stores/app'
import { padLeft, shortDate } from '../lib/format'

const store = useReceiptsStore()
const app = useAppStore()
const saving = ref(false)
const error = ref(null)

onMounted(() => app.load())

const form = reactive({
  patientName: '',
  unit: '',
  paymentMethod: 'Cash',
  discount: 0,
  tax: 0,
  paid: 0,
  note: 'Terima kasih, semoga lekas sehat.',
  items: [
    { name: 'Konsultasi', qty: 1, price: 100000 }
  ]
})

function addItem() {
  form.items.push({ name: '', qty: 1, price: 0 })
}

function removeItem(idx) {
  form.items.splice(idx, 1)
}

function reset() {
  form.patientName = ''
  form.unit = ''
  form.paymentMethod = 'Cash'
  form.discount = 0
  form.tax = 0
  form.paid = 0
  form.note = 'Terima kasih, semoga lekas sehat.'
  form.items = [{ name: 'Konsultasi', qty: 1, price: 100000 }]
  error.value = null
}

const clinic = computed(() => app.clinic)

const computedReceipt = computed(() => {
  const items = form.items.map(it => ({
    name: it.name || 'Item',
    qty: Number(it.qty || 0),
    price: Number(it.price || 0),
    total: Number(it.qty || 0) * Number(it.price || 0)
  }))
  const subtotal = items.reduce((a, b) => a + b.total, 0)
  const discount = Number(form.discount || 0)
  const tax = Number(form.tax || 0)
  const total = Math.max(0, subtotal - discount + tax)
  const paid = Number(form.paid || 0)
  const change = Math.max(0, paid - total)

  const now = new Date()
  const code = `TRX-${now.getFullYear()}${padLeft(now.getMonth()+1,2)}${padLeft(now.getDate(),2)}-${padLeft(now.getHours(),2)}${padLeft(now.getMinutes(),2)}${padLeft(now.getSeconds(),2)}`

  return {
    code,
    createdAtText: shortDate(now),
    patientName: form.patientName,
    unit: form.unit,
    paymentMethod: form.paymentMethod,
    items,
    subtotal,
    discount,
    tax,
    total,
    paid,
    change,
    note: form.note
  }
})

function print() {
  window.print()
}

async function save() {
  error.value = null
  if (!form.items.length) {
    error.value = 'Minimal 1 item.'
    return
  }
  if (computedReceipt.value.total > computedReceipt.value.paid) {
    error.value = 'Nominal bayar kurang dari total.'
    return
  }

  saving.value = true
  try {
    const payload = {
      patientName: form.patientName,
      unit: form.unit,
      paymentMethod: form.paymentMethod,
      discount: Number(form.discount || 0),
      tax: Number(form.tax || 0),
      paid: Number(form.paid || 0),
      note: form.note,
      items: form.items.map(it => ({ name: it.name, qty: Number(it.qty||0), price: Number(it.price||0) }))
    }
    const created = await store.create(payload)
    window.location.href = `/receipt/${created.id}`
  } catch (e) {
    error.value = e.userMessage || 'Gagal menyimpan.'
  } finally {
    saving.value = false
  }
}

</script>

<style scoped>
.label { @apply text-xs text-slate-300; }
.label2 { @apply text-[11px] text-slate-400; }
.input { @apply w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm placeholder:text-slate-500 focus:ring-white/20 focus:outline-none; }
</style>
