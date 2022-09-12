<template>
  <div>spm: {{ spm }}</div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'
  import { record } from '@/utils/spm'

  const spm = ref('')

  onMounted(async () => {
    spm.value =
      window.location.search.match(/(?<=spm=)[a-zA-Z0-9\.]+/)?.[0] ?? ''
    record({
      spm: spm.value,
      type: 'pv'
    })
  })
</script>
