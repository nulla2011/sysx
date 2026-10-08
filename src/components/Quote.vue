<template>
  <div class="quote">
    <div class="wrap">
      <a class="link-wordle" href="/wordle" target="_blank">🟩基于女声优缩写的 wordle 游戏已经上线，欢迎体验⬛</a>
    </div>
  </div>
</template>
<style lang="scss">
$color: #78afff;
$backgroundcolor: #fefefe;
$border: 2px;

.quote {
  position: absolute;
  top: 290px;
  z-index: -3;
  margin-block: 100px;
  left: 50vw;
  transform: translate(-50%, 0);
  background-color: $backgroundcolor;
  padding: 1em;
  max-width: 38em;
  min-width: 24em;

  @media screen and (max-width: 480px) {
    min-width: 100vw;
  }

  display: flex;
  background: linear-gradient(to right, $color $border, $backgroundcolor $border, $backgroundcolor calc(100% - $border), $color calc(100% - $border)) 0 100%;
  background-repeat: no-repeat;

  .quote-left,
  .quote-right {
    color: $color;
    width: 2em;
    opacity: 50%;
  }

  .quote-left {
    align-self: flex-start;
  }

  .quote-right {
    align-self: flex-end;
  }

  .wrap {
    display: flex;
    flex-direction: column;
    // flex: 1;
  }

  blockquote {
    color: #666;
    line-height: 1.4em;
    top: 0;
    margin-inline: 1em;
    margin-bottom: 2em;
    margin-top: 1em;

  }

  cite {
    text-align: right;
    padding-right: 2em;
    color: #111;
  }

  .link-wordle {
    font-size: 20px;
    color: #0768f8;
  }
}
</style>