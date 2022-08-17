<template>
  <div class="search">
    <div class="bar"><input v-model="text" @click="loadThis" @focus="loadThis" /></div>
    <div class="list" v-if="isLoaded">
      <div
        class="container"
        v-for="item in results"
        @click="$emit('selected', item.zhName)"
      >
        <div class="img"><img v-lazy="item.photo ?? img_404" :alt="item.zhName" /></div>
        <div class="text">
          <div class="zh-name">{{ item.zhName }}</div>
          <div class="py">
            <!-- <span class="highlight">{{ text }}</span
            >{{ item.pysx?.slice(text.length) }} -->
            {{ item.pysx }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { searchWidth } from '../settings';
  import { Ref, ref, watch } from 'vue';
  import img_404 from '../assets/no-image-icon-23485.png';
  import { debounce } from 'lodash';

  let text = ref('');
  let results: Ref<seiyuu[]> = ref([]);
  let props = defineProps({ fulldata: Object });
  let isLoaded: Ref<boolean> = ref(false);
  const loadThis = () => {
    isLoaded.value = true;
  };
  const handleClick = (ev: MouseEvent) => {
    if (!document.querySelector('.bar')!.contains(ev.target as HTMLElement)) {
      isLoaded.value = false;
    }
  };
  watch(isLoaded, (value) => {
    let searchEl: HTMLElement = document.querySelector('.search')!;
    let inputEL: HTMLElement = document.querySelector('input')!;
    if (value) {
      searchEl.style['boxShadow'] = '0 0 12px #555';
    } else {
      searchEl.style['boxShadow'] = '0 0 4px #888';
    }
  });
  document.addEventListener('click', handleClick);
  let inputDebounce = debounce(() => {
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
    isLoaded.value = true;
  }, 400);
  watch(text, () => {
    inputDebounce();
  });
</script>

<style lang="scss">
  $height: 70px;
  $width: 300px;
  $bg: #f2f2f2;
  .search {
    margin: auto;
    width: $width;
    background-color: white;
    box-shadow: 0 0 5px #777;
    border-radius: 6px;
    overflow: hidden;
  }
  .bar {
    // padding: 5px 10px;
    // background-color: #f8f8f8;
    background-color: $bg;
    input {
      background-color: #fff;
      border: 2px solid #777;
      &:focus {
        border-color: #4eafeb;
      }
      box-sizing: border-box;
      border-radius: 6px;
      padding: 0.2em 0.9em;
      height: 50px;
      width: 100%;
      font-size: 1.6em;
      outline: none;
      font-family: Nunito, sans-serif;
      /* font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; */
      font-weight: 500;
    }
  }
  .container {
    background-color: $bg;
    &:hover {
      background-color: #aed4ec;
    }
    border-bottom: 0.01px solid #999;
    height: $height;
    width: 100%;
    padding: 5px;
    padding-left: 10px;
    box-sizing: border-box;
    cursor: pointer;
    &:last-child {
      border-bottom: none;
    }
  }
  .img {
    // margin: 5px;
    display: inline-block;
    width: $height - 10px;
    height: $height - 10px;
    overflow: hidden;
    border-radius: 5px;
    img {
      width: $height - 10px;
      height: $height - 10px;
      object-fit: cover;
      // box-shadow: 0 0 3px #333;
    }
  }
  .text {
    margin-left: 15px;
    height: $height - 6px;
    position: relative;
    display: inline-block;
    vertical-align: top;
    .zh-name {
      font-size: 22px;
      height: $height * 0.5;
      color: #2c3d4e;
    }
    .py {
      font-size: 16px;
      color: #777;
      height: $height * 0.5 - 6px;
    }
  }
  .highlight {
    color: #333;
  }
</style>
