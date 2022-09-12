<template>
  <div v-for="ia in 2" :key="'a' + ia" :data-spma="'a' + ia">
    <div v-for="ib in 2" :key="'b' + ib" :data-spmb="'b' + ib">
      <div v-for="ic in 2" :key="'c' + ic" :data-spmc="'c' + ic">
        <a
          v-for="id in 10"
          :key="'d' + id"
          :data-spmd="'d' + id"
          href="/detail"
          data-spm-pv
        >
          跳转到详情 {{ ia }} {{ ib }} {{ ic }} {{ id }}
        </a>
      </div>
    </div>
  </div>
  <div v-for="ia in 2" :key="'a' + ia" :data-spma="'a' + ia">
    <div v-for="ib in 2" :key="'b' + ib" :data-spmb="'b' + ib">
      <div v-for="ic in 2" :key="'c' + ic" :data-spmc="'c' + ic">
        <span
          v-for="id in 10"
          :key="'d' + id"
          :data-spmd="'d' + id"
          data-spm-click
        >
          点击 {{ ia }} {{ ib }} {{ ic }} {{ id }}
        </span>
      </div>
    </div>
  </div>
  <div v-for="ia in 2" :key="'a' + ia" :data-spma="'a' + ia">
    <div v-for="ib in 2" :key="'b' + ib" :data-spmb="'b' + ib">
      <div v-for="ic in 2" :key="'c' + ic" :data-spmc="'c' + ic">
        <div
          v-for="id in scrollCount"
          :key="'d' + id"
          :data-spmd="'d' + id"
          style="height: 50px; background-color: pink; margin-bottom: 10px"
          data-spm-exposure
        >
          滚动 {{ ia }} {{ ib }} {{ ic }} {{ id }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { init, record } from '@/utils/spm'
  const scrollCount = ref(5)

  onMounted(() => {
    init({
      clickHooks: [
        async (event, spm: string) => {
          // @ts-ignore
          if (event.target.hasAttribute('data-spm-pv')) {
            // @ts-ignore
            event.target.setAttribute('href', `/detail?spm=${spm}`)
          }
        },
        async (event, spm: string) => {
          // @ts-ignore
          if (event.target.hasAttribute('data-spm-click')) {
            record({
              spm,
              type: 'click'
            })
          }
        }
      ],
      intersectionHooks: [
        (
          target: HTMLElement,
          observerTarget: HTMLElement | Document,
          spm: string
        ): void => {
          record({
            spm,
            type: 'exposure'
          })
        }
      ]
    })
    setTimeout(() => {
      scrollCount.value = 10
    }, 1000)
  })
</script>
