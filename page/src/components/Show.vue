<template>
  <div>
    <div id="photo"><slot name="photo"></slot></div>
    <div id="zhName"><slot name="zhName"></slot></div>
  </div>
</template>
<style lang="scss">
  #photo {
    width: 200px;
  }
  #zhName {
    color: #aaa;
  }
</style>
