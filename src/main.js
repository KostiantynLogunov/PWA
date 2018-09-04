// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuefire from 'vuefire'
import VueResource from 'vue-resource'
import App from './App'
import { router } from './_helpers';
import VueAnalytics from 'vue-analytics'
import {VueMasonryPlugin} from 'vue-masonry'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { store } from './_store'
import { configureFakeBackend } from './_helpers'
configureFakeBackend()

Vue.use(Vuefire)


Vue.use(VueResource);
Vue.http.options.root = 'http://social.loc/api/';


Vue.use(VueMasonryPlugin)

Vue.use(VueMaterial)
Vue.config.productionTip = false


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});