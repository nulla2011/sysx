<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue';
  import Search from './components/Search.vue';
  let seiyuuData = ref({});
  onMounted(
    async () =>
      (seiyuuData.value = await fetch('/seiyuu-info.json').then((response) =>
        response.json()
      ))
  );
</script>

<template>
  <Search :fulldata="seiyuuData"></Search>
</template>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
  body {
    background-color: #eee;
  }
</style>
