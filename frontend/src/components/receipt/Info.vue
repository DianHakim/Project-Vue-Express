<template>
  <div class="rounded-xl bg-slate-50 border border-slate-200 px-4 py-3">
    <p class="text-xs text-slate-500">{{ label }}</p>
    <p class="text-sm font-semibold mt-1 truncate">{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  label: String,
  value: String
})
</script>

<style scoped></style>
