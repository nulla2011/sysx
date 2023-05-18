<template>
  <div class="quote">
    <font-awesome-icon icon="fa-solid fa-quote-left" transform="grow-25" class="quote-left" />
    <div class="wrap">
      <blockquote>
        <p>
          使用女声优名字的拼音缩写交流，可能会造成一些语言障碍和理解上的困难。这是因为拼音缩写通常只包含声母和韵母，而不包含声调和其他语音细节，这可能会导致缩写的含义不够明确或有歧义。此外，由于女声优的名字在不同的拼音系统中可能有不同的拼写和发音，因此在不同的语言环境中使用拼音缩写可能会导致交流混淆。
        </p><br />
        <p>另外，使用女声优名字的拼音缩写交流，可能会出现一些误解和不适当的情况。例如，缩写可能会被误解为某些不文明或不礼貌的词语，或者被用于一些不适当的场合，对女声优造成负面影响。</p><br>
        <p>因此，建议在交流中尽可能使用女声优的全名或艺名，以确保交流的准确性和尊重女声优的个人隐私和权益。如果必须使用拼音缩写，应该谨慎地选择合适的缩写，并尽可能在交流前明确其含义和上下文。</p>
      </blockquote>
      <cite>—出自 ChatGPT 的回答</cite>
    </div>
    <font-awesome-icon icon="fa-solid fa-quote-right" transform="grow-25" class="quote-right" />
  </div>
</template>
<style lang="scss" >
$color: #78afff;
$backgroundcolor: #fefefe;
$border: 2px;

.quote {
  position: absolute;
  top: 290px;
  z-index: -3;
  margin-block: 5px;
  left: 50vw;
  transform: translate(-50%, 0);
  background-color: $backgroundcolor;
  padding: 1em;
  max-width: 38em;
  display: flex;
  background:
    linear-gradient(to right, $color $border, $backgroundcolor $border, $backgroundcolor calc(100% - $border), $color calc(100% - $border)) 0 100%;
  background-repeat: no-repeat;

  .quote-left,
  .quote-right {
    color: $color;
    width: 9em;
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
  }
}
</style>