<template>
  <input v-model="text" />
  <div v-for="item in results">
    <div class="py">{{ item.pysx }}</div>
    <div class="zh-name">{{ item.zhName }}</div>
    <img :src="item.photo" :alt="item.zhName" />
  </div>
</template>
<script setup lang="ts">
  import { Ref, ref, watch } from 'vue';

  interface seiyuu {
    zhName: string;
    pysx: string | null;
    jaName: string[][] | string;
    photo: string;
  }
  let text = ref('');
  let results: Ref<seiyuu[]> = ref([]);
  let props = defineProps({ fulldata: Object });
  watch(text, () => {
    results.value = [];
    if (text.value.length > 1) {
      for (const key in props.fulldata) {
        let py = props.fulldata[key].pysx;
        if (py) {
          if ((py as string).startsWith(text.value)) {
            results.value.push(props.fulldata[key]);
          }
        }
      }
    }
  });
</script>
<style>
  input {
    border: 2px solid #1092e1;
    border-radius: 6px;
    padding: 0.2em 1em;
    min-height: 50px;
    font-size: 1.6em;
    outline: none;
    /* font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; */
    font-weight: 400;
  }
</style>
