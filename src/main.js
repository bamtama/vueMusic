// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);

import MintUI from 'mint-ui'
import './assets/reset.css'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)

import App from './App'
import router from './router'

// import axios from 'axios'
// Vue.prototype.$http = axios.create({
// 	baseURL: '/muzapi'
// })

import PlayerNav from './components/PlayerNav'
Vue.component('player-nav', PlayerNav)

Vue.config.productionTip = false

import store from './store/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store:store,
  template: '<App/>',
  components: { App }
})
