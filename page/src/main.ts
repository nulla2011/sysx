import { createApp } from 'vue';
import App from './App.vue';
import VueLazyload from 'vue-lazyload';

import './style/reset.scss';

import loadimg from './assets/loading-spin.svg';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
library.add(fab, fas);

createApp(App)
  .use(VueLazyload, {
    loading: loadimg,
  })
  .component('font-awesome-icon', FontAwesomeIcon)
  .mount('#app');
