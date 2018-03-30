// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Header from './components/Header'
import Source from './components/Source'
import Footer from './components/Footer'
import router from './router'

Vue.config.productionTip = false

Vue.component('Header', Header)
Vue.component('Source', Source)
Vue.component('Footer', Footer)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
