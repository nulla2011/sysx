<template>
  <div class="main">
    <slot name="photo"></slot>
    <div class="infoText">
      <table>
        <thead id="zhName">
          <slot name="zhName"></slot>
        </thead>
        <tbody>
          <tr>
            <td class="description">姓名</td>
            <td class="content">
              <slot name="jaName"></slot>
            </td>
          </tr>
          <tr>
            <td class="description">出生</td>
            <td class="content">
              <slot name="birth"></slot>
            </td>
          </tr>
          <tr>
            <td class="description">所属</td>
            <td class="content">
              <slot name="jimusho"></slot>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <div id="links-container">
        <slot name="profile"></slot>
        <slot name="twitter"></slot>
        <slot name="instagram"></slot>
        <slot name="blog"></slot>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
  .main {
    max-width: 640px;
    min-width: 300px;
    display: flex;
    flex-wrap: wrap;
    // margin-left: calc(100vw - 100% + (100% - (100vw - 100%) - 580px) / 2);
    margin: 0 auto;
    justify-content: space-evenly;
    left: calc(100vw - 100%);
  }
  .infoText {
    flex: 0 1 360px;
    margin: 0 10px 0 10px;
    // line-height: 2;
    table {
      width: 360px;
      margin-bottom: 20px;
      #zhName {
        color: #fafbff;
        text-align: center;
        background-color: cadetblue;
        font-size: 20px;
        line-height: 2em;
      }
      tr {
        display: flex;
        color: #122232;
        border-bottom: 0.01px solid #cfcfcf;
        border-right: 0.01px solid #cfcfcf;
        .description {
          padding: 0.4em;
          background-color: #dddddd;
          flex: 1 0 60px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .content {
          padding: 0.4em 0;
          flex: 1 0 150px;
          text-align: center;
        }
      }
    }
    hr {
      border: 0;
      border-top: 1px solid #444;
    }
    #links-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;
      // justify-content: space-around;
      align-items: center;
      margin-top: 20px;
      width: 360px;
    }
  }
</style>
