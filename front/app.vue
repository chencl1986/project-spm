<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { init } from './utils/spm'

  onMounted(() => {
    init({
      hooks: [
        async () => {
          await fetch('http://localhost:9000/log', {
            mode: 'no-cors',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ a: 1 })
          })
        }
      ]
    })
  })
</script>
