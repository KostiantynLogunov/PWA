// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuefire from 'vuefire'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import VueAnalytics from 'vue-analytics'
import {VueMasonryPlugin} from 'vue-masonry'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(Vuefire)
Vue.use(VueResource)
Vue.use(VueMasonryPlugin)
Vue.use(VueAnalytics, {
  id: 'UA-101944993-1',
  router
})
Vue.use(VueMaterial)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
