<template>
  <div class="w-full">
    <div class="rounded-2xl bg-white text-slate-900 ring-1 ring-slate-200 shadow-soft overflow-hidden">
      <div class="px-6 py-5 border-b border-slate-200">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-xs tracking-wide text-slate-500 uppercase">Struk Pembayaran</p>
            <h2 class="text-lg font-semibold leading-tight">{{ clinic.name }}</h2>
            <p class="text-sm text-slate-600 mt-1">{{ clinic.address }}</p>
            <p class="text-sm text-slate-600">{{ clinic.phone }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-500">No. Transaksi</p>
            <p class="font-mono font-semibold">{{ data.code }}</p>
            <p class="text-xs text-slate-500 mt-2">Tanggal</p>
            <p class="text-sm">{{ data.createdAtText }}</p>
          </div>
        </div>
      </div>

      <div class="px-6 py-5">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Info label="Pasien" :value="data.patientName || '-'"/>
          <Info label="Dokter/Unit" :value="data.unit || '-'"/>
          <Info label="Metode" :value="data.paymentMethod || '-'"/>
        </div>

        <div class="mt-5 border-t border-slate-200 pt-4">
          <div class="flex items-center justify-between">
            <p class="text-sm font-semibold">Rincian</p>
            <p class="text-xs text-slate-500">Qty • Harga</p>
          </div>

          <div class="mt-3 space-y-2">
            <div v-for="(it, idx) in data.items" :key="idx" class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-sm font-medium truncate">{{ it.name }}</p>
                <p class="text-xs text-slate-500">{{ it.qty }} × {{ rupiah(it.price) }}</p>
              </div>
              <p class="text-sm font-semibold whitespace-nowrap">{{ rupiah(it.total) }}</p>
            </div>
          </div>

          <div class="mt-4 border-t border-slate-200 pt-4 space-y-2">
            <Row label="Subtotal" :value="rupiah(data.subtotal)" />
            <Row label="Diskon" :value="rupiah(data.discount)" />
            <Row label="Pajak" :value="rupiah(data.tax)" />
            <div class="h-px bg-slate-200 my-2"></div>
            <Row label="Total" :value="rupiah(data.total)" strong />
            <Row label="Bayar" :value="rupiah(data.paid)" />
            <Row label="Kembali" :value="rupiah(data.change)" />
          </div>
        </div>

        <div class="mt-5 text-xs text-slate-600">
          <p class="font-medium">Catatan:</p>
          <p>{{ data.note || 'Terima kasih, semoga lekas sehat.' }}</p>
        </div>
      </div>

      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <p class="text-xs text-slate-500">Powered by Struk App</p>
        <p class="text-xs text-slate-500 font-mono">{{ data.code }}</p>
      </div>
    </div>

    <!-- Thermal print view -->
    <div class="hidden print-only">
      <div class="p-2 font-mono text-[11px] leading-4 text-black">
        <div class="text-center">
          <div class="font-bold">{{ clinic.name }}</div>
          <div>{{ clinic.address }}</div>
          <div>{{ clinic.phone }}</div>
          <div class="mt-1">------------------------------</div>
        </div>
        <div class="mt-1">
          <div>No: {{ data.code }}</div>
          <div>Tgl: {{ data.createdAtText }}</div>
          <div>Pasien: {{ data.patientName || '-' }}</div>
          <div>Unit: {{ data.unit || '-' }}</div>
          <div>Metode: {{ data.paymentMethod || '-' }}</div>
          <div>------------------------------</div>
        </div>
        <div>
          <div v-for="(it, idx) in data.items" :key="idx" class="flex justify-between gap-2">
            <div class="truncate max-w-[160px]">{{ it.name }} ({{ it.qty }}x)</div>
            <div>{{ rupiah(it.total).replace('Rp','').trim() }}</div>
          </div>
          <div>------------------------------</div>
          <div class="flex justify-between"><div>Subtotal</div><div>{{ rupiah(data.subtotal).replace('Rp','').trim() }}</div></div>
          <div class="flex justify-between"><div>Diskon</div><div>{{ rupiah(data.discount).replace('Rp','').trim() }}</div></div>
          <div class="flex justify-between"><div>Pajak</div><div>{{ rupiah(data.tax).replace('Rp','').trim() }}</div></div>
          <div>------------------------------</div>
          <div class="flex justify-between font-bold"><div>TOTAL</div><div>{{ rupiah(data.total).replace('Rp','').trim() }}</div></div>
          <div class="flex justify-between"><div>Bayar</div><div>{{ rupiah(data.paid).replace('Rp','').trim() }}</div></div>
          <div class="flex justify-between"><div>Kembali</div><div>{{ rupiah(data.change).replace('Rp','').trim() }}</div></div>
          <div>------------------------------</div>
        </div>
        <div class="mt-1 text-center">
          <div>{{ data.note || 'Terima kasih.' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { rupiah } from '../../lib/format'

defineProps({
  clinic: { type: Object, required: true },
  data: { type: Object, required: true }
})
</script>

<style scoped>
/* Keep printable width sane */
@media print {
  .print-only { width: 80mm; }
}
</style>
