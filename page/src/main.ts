import { createApp } from 'vue';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';

import loadimg from './assets/loading-spin.svg';

createApp(App)
  .use(VueLazyload, {
    loading: loadimg,
  })
  .mount('#app');
