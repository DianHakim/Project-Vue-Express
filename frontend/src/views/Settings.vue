<template>
  <div class="pt-6">
    <div class="flex items-start justify-between gap-4 flex-wrap">
      <div>
        <h2 class="text-2xl font-semibold tracking-tight">Settings</h2>
        <p class="text-slate-300 mt-1">Atur identitas klinik untuk tercetak di struk.</p>
      </div>
      <div class="flex gap-2 no-print">
        <Button variant="ghost" @click="reset">Reset</Button>
        <Button @click="save">Simpan</Button>
      </div>
    </div>

    <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card class="p-5">
        <div class="space-y-4">
          <div>
            <label class="label">Nama Klinik</label>
            <input v-model="clinic.name" class="input" />
          </div>
          <div>
            <label class="label">Alamat</label>
            <textarea v-model="clinic.address" rows="3" class="input"></textarea>
          </div>
          <div>
            <label class="label">Telepon</label>
            <input v-model="clinic.phone" class="input" />
          </div>
          <p class="text-xs text-slate-400">Data disimpan di browser (localStorage).</p>
        </div>
      </Card>

      <div class="lg:sticky lg:top-6 h-fit">
        <p class="text-sm text-slate-300 mb-3">Preview</p>
        <ReceiptPaper :clinic="clinic" :data="preview" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import Card from '../components/ui/Card.vue'
import Button from '../components/ui/Button.vue'
import ReceiptPaper from '../components/receipt/ReceiptPaper.vue'
import { shortDate } from '../lib/format'

const preview = computed(() => ({
  code: 'TRX-EXAMPLE-001',
  createdAtText: shortDate(new Date()),
  patientName: 'Contoh Pasien',
  unit: 'Poli KIA',
  paymentMethod: 'Cash',
  items: [
    { name: 'Konsultasi', qty: 1, price: 100000, total: 100000 }
  ],
  subtotal: 100000,
  discount: 0,
  tax: 0,
  total: 100000,
  paid: 100000,
  change: 0,
  note: 'Terima kasih.'
}))

const clinic = reactive({
  name: 'Klinik Ratnasari Sehat RSA',
  address: 'Alamat Klinik (ubah di Settings)',
  phone: '+62 811-2111-1570'
})

onMounted(() => {
  const raw = localStorage.getItem('struk_app_settings')
  if (raw) Object.assign(clinic, JSON.parse(raw))
})

function save() {
  localStorage.setItem('struk_app_settings', JSON.stringify(clinic))
  alert('Tersimpan.')
}

function reset() {
  clinic.name = 'Klinik Ratnasari Sehat RSA'
  clinic.address = 'Alamat Klinik (ubah di Settings)'
  clinic.phone = '+62 811-2111-1570'
}
</script>

<style scoped>
.label { @apply text-xs text-slate-300; }
.input { @apply w-full rounded-xl bg-white/5 ring-1 ring-white/10 px-3 py-2 text-sm placeholder:text-slate-500 focus:ring-white/20 focus:outline-none; }
</style>
