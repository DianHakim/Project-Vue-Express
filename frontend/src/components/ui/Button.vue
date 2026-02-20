<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonClass"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  variant: { type: String, default: 'primary' } 
  // primary | secondary | ghost | danger
})

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

const variants = {
  primary:
    'bg-indigo-500 text-white hover:bg-indigo-600 dark:bg-indigo-500 dark:hover:bg-indigo-600',

  secondary:
    'bg-slate-300 text-slate-800 hover:bg-slate-400 dark:bg-white/10 dark:text-white dark:hover:bg-white/20',

  ghost:
    'bg-transparent hover:bg-slate-200 dark:hover:bg-white/10',

  danger:
    'bg-rose-500 text-white hover:bg-rose-600'
}

const buttonClass = computed(() => {
  return `${base} ${variants[props.variant]}`
})
</script>

<style scoped></style>
