<script setup lang="ts">
  import { onMounted, ref, Ref } from 'vue';
  import Search from './components/Search.vue';
  import Show from './components/Show.vue';
  let seiyuuData: Ref<{ [key: string]: seiyuu }> = ref({});
  let name = ref('');
  onMounted(
    async () =>
      (seiyuuData.value = await fetch('/seiyuu-info.json').then((response) =>
        response.json()
      ))
  );
  const processSelect = (n: string) => {
    name.value = n;
  };
</script>

<template>
  <h1 class="title">
    <ruby
      >女<rt>n</rt>声<rt>s</rt>优<rt>y</rt>拼<rt>p</rt>音<rt>y</rt>缩<rt>s</rt>写<rt>x</rt>查<rt>c</rt>询<rt
        >x</rt
      ></ruby
    >
  </h1>
  <Search id="search" :fulldata="seiyuuData" @selected="processSelect"></Search>
  <Show id="show">
    <template v-if="seiyuuData[name]?.photo" #photo>
      <img v-lazy="seiyuuData[name]?.photo" />
    </template>
    <template #zhName>{{ seiyuuData[name]?.zhName }}</template>
  </Show>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500&display=swap');
  // @import url('https://fonts.font.im/css?family=Nunito:200,300,400,600');
  #app {
    // font-family: Avenir, Helvetica, Arial, sans-serif;
    font-family: Nunito, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    /* color: #2c3e50; */
    margin-top: 60px;
    margin-left: calc(100vw - 100%);
  }
  body {
    background-color: #eee;
  }
  .title {
    text-align: center;
    font-weight: 500;
    font-size: 35px;
    letter-spacing: 0.18em;
    rt {
      font-size: 20px;
    }
    color: #1a2b3c;
  }
  #search {
    position: relative;
    top: 50px;
  }
  #show {
    position: absolute;
    top: 320px;
    left: 0;
    right: 0;
    width: 500px;
    margin-left: calc(100vw - 100% + (100% - (100vw - 100%) - 500px) / 2);
    z-index: -2;
  }
</style>
