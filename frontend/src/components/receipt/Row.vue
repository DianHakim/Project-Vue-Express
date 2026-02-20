<template>
  <div class="flex items-center justify-between gap-4">
    <p class="text-sm text-slate-600" :class="{ 'font-semibold text-slate-900': strong }">{{ label }}</p>
    <p class="text-sm" :class="{ 'font-semibold text-slate-900': strong }">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String,
  strong: { type: Boolean, default: false }
})
</script>

<style scoped></style>
