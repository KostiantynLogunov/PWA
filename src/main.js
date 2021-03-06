// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuefire from 'vuefire'
import App from './App'
import VueAnalytics from 'vue-analytics'
import VueMaterial from 'vue-material'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'

import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard);

Vue.use(VueMoment, {
    moment,
});

import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { store } from './_store'
import { router } from './_helpers';
import {VueMasonryPlugin} from 'vue-masonry'

import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
Vue.use(datePicker);

Vue.use(Vuefire);

Vue.use(VueMasonryPlugin);
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'
Vue.use(VueMaterial);
Vue.config.productionTip = false;

import {initialize} from  './_helpers/general'
initialize(store, router);

import FullCalendar from 'vue-full-calendar'
Vue.use(FullCalendar);

import Lang from 'vuejs-localization';
Lang.requireAll(require.context('./lang', true, /\.js$/));
Vue.use(Lang);
/*import InputTag from 'vue-input-tag'
Vue.use(InputTag);
Vue.component('input-tag', InputTag);*/

import VoerroTagsInput from '@voerro/vue-tagsinput';
Vue.component('tags-input', VoerroTagsInput);

// import VeeValidate from 'vee-validate';
// Vue.use(VeeValidate);

/*try {
    window.$ = window.jQuery = require('jquery');

} catch (e) {}*/

window.io = require('socket.io-client');

import Toasted from 'vue-toasted';
Vue.use(Toasted);

// Vue.prototype.$eventHub = new Vue();

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});

// app.js

