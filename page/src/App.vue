<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue';
import Search from './components/Search.vue';
import Show from './components/Show.vue';
import GitHub from './components/GitHub.vue';
import Quote from "./components/Quote.vue";

let seiyuuData: Ref<{ [key: string]: seiyuu }> = ref({});
let name: Ref<string> = ref('');
let seiyuu = computed(() => {
  return seiyuuData.value?.[name.value];
});
let nameHTML = computed(() => {
  let jaName = seiyuu.value.jaName;
  if (Array.isArray(jaName)) {
    let ruby = jaName.reduce(
      (p, c) => (p = p + c[0] + '<rt>' + (c[1] ?? '') + '</rt>' + '<span></span>'),
      ''
    );
    return '<ruby>' + ruby + '</ruby>';
  } else {
    return jaName;
  }
});
onMounted(
  async () =>
  (await fetch('/sysx/seiyuu-info.json').then((response) => response.json()).then((value) => {
    seiyuuData.value = value;
    let loading = document.querySelector('.loading-screen')!;
    loading.classList.add('animating-fadeout');
    setTimeout(() => {
      if (loading) loading.remove();
    }, 600);
  }))
);
const processSelect = (n: string) => {
  name.value = n;
};
</script>

<template>
  <h1 class="title">
    <ruby>女<rt>n</rt>声<rt>s</rt>优<rt>y</rt>拼<rt>p</rt>音<rt>y</rt>缩<rt>s</rt>写<rt>x</rt>查<rt>c</rt>询<rt>x</rt></ruby>
  </h1>
  <GitHub></GitHub>
  <Search id="search" :fulldata="seiyuuData" @selected="processSelect"></Search>
  <Quote v-show="!name"></Quote>
  <Show id="show" v-if="name">
    <template v-if="seiyuu?.photo" #photo>
      <div id="photo"><img v-lazy="seiyuu?.photo" /></div>
    </template>
    <template #zhName>
      {{ seiyuu?.zhName }}
    </template>
    <template #jaName>
      <div v-if="Array.isArray(seiyuu?.jaName)">
        <ruby v-for="n in seiyuu?.jaName">
          <rb>{{ n[0] }}</rb>
          <rt>{{ n[1] ?? '' }}</rt>
        </ruby>
      </div>
      <div v-else>{{ seiyuu?.jaName }}</div>
    </template>
    <template #birth>
      {{ seiyuu?.birth }}
    </template>
    <template #jimusho>
      {{ seiyuu?.jimusho ?? '无' }}
    </template>
    <template #profile>
      <div class="link-container" v-if="seiyuu?.profile">
        <a class="link" :href="seiyuu?.profile" target="_blank">Profile
          <font-awesome-icon icon="fa-solid fa-up-right-from-square" transform="shrink-5" />
        </a>
      </div>
      <div class="link-container" v-if="seiyuu?.twitter">
        <a class="link" :href="seiyuu?.twitter" target="_blank">
          <font-awesome-icon icon="fa-brands fa-twitter" />
          Twitter
          <font-awesome-icon icon="fa-solid fa-up-right-from-square" transform="shrink-5" />
        </a>
      </div>
      <div class="link-container" v-if="seiyuu?.instagram">
        <a class="link" :href="seiyuu?.instagram" target="_blank">
          <font-awesome-icon icon="fa-brands fa-instagram" />
          Instagram
          <font-awesome-icon icon="fa-solid fa-up-right-from-square" transform="shrink-5" />
        </a>
      </div>
      <div class="link-container" v-if="seiyuu?.blog">
        <a class="link" :href="seiyuu?.blog" target="_blank">Blog
          <font-awesome-icon icon="fa-solid fa-up-right-from-square" transform="shrink-5" />
        </a>
      </div>
    </template>
  </Show>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@200;300;400;500&display=swap');

// @import url('https://fonts.font.im/css?family=Nunito:200,300,400,600');
#app {
  font-family: Nunito, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  margin-top: 60px;
  margin-left: calc(100vw - 100%);
}

body {
  background-color: #f6f7f8;
}

.title {
  text-align: center;
  font-weight: 500;
  font-size: 35px;
  letter-spacing: 0.12em;
  color: #1a2b3c;

  rt {
    font-size: 20px;
  }
}

#show {
  position: absolute;
  top: 320px;
  // left: 0;
  right: 0;
  z-index: -2;

  #photo {
    width: 200px;
    flex: 1 1 200px;
    display: flex;
    margin: 0 20px;
    margin-bottom: 45px;

    img {
      max-width: 250px;
      min-width: 200px;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      border: 0.01px solid #999;
    }
  }

  rt {
    line-height: normal;
    font-size: 15px;
    letter-spacing: -0.1em;
  }

  rb {
    font-size: 18px;
  }

  .link-container {
    color: #3351b7;
    width: 180px;
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 2em;
    font-size: 17px;

    .link:visited {
      color: #632157;
    }

    .link:hover {
      color: #d23232;
    }

  }
}
</style>
