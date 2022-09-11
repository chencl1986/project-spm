<template>
  <div>spm: {{ spm }}</div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { record } from '@/utils/spm'

  const spm = ref('')

  onMounted(async () => {
    const search = window.location.search.replace('?', '')
    const arr = search.split('&')
    const query: Record<string, string> = {}
    arr.forEach((str: string): void => {
      const item = str.split('=')
      query[item[0]] = item[1]
    })
    spm.value = query.spm ?? ''
    record({
      spm: spm.value,
      type: 'pv'
    })
  })
</script>
