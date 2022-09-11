<template>
  <div v-for="ia in 2" :key="'a' + ia" :data-spma="'a' + ia">
    <div v-for="ib in 2" :key="'b' + ib" :data-spmb="'b' + ib">
      <div v-for="ic in 2" :key="'c' + ic" :data-spmc="'c' + ic">
        <a
          v-for="id in 10"
          :key="'d' + id"
          :data-spmd="'d' + id"
          href="/detail"
        >
          跳转到详情 {{ ia }} {{ ib }} {{ ic }} {{ id }}
        </a>
      </div>
    </div>
  </div>
  <div v-for="ia in 2" :key="'a' + ia" :data-spma="'a' + ia">
    <div v-for="ib in 2" :key="'b' + ib" :data-spmb="'b' + ib">
      <div v-for="ic in 2" :key="'c' + ic" :data-spmc="'c' + ic">
        <span v-for="id in 10" :key="'d' + id" :data-spmd="'d' + id">
          点击 {{ ia }} {{ ib }} {{ ic }} {{ id }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { init, record } from '@/utils/spm'

  onMounted(() => {
    init({
      hooks: [
        async (event, spm: string) => {
          if (event.target.tagName.toLowerCase() === 'a') {
            event.target.setAttribute('href', `/detail?spm=${spm}`)
          }
        },
        async (event, spm: string) => {
          if (event.target.tagName.toLowerCase() === 'span') {
            record({
              spm,
              type: 'click'
            })
          }
        }
      ]
    })
  })
</script>
