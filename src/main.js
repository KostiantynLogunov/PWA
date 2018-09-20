// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuefire from 'vuefire'
import App from './App'
import VueAnalytics from 'vue-analytics'
import VueMaterial from 'vue-material'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

Vue.use(VueMoment, {
    moment,
});

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { store } from './_store'
import { router } from './_helpers';
import {VueMasonryPlugin} from 'vue-masonry'
// import {myDatepicker} from 'vue-datepicker'
// Vue.use(myDatepicker);
Vue.use(Vuefire);



Vue.use(VueMasonryPlugin);

Vue.use(VueMaterial);
Vue.config.productionTip = false;

import {initialize} from  './_helpers/general'
initialize(store, router);


new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
