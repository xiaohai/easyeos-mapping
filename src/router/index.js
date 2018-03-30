import Vue from 'vue'
import Router from 'vue-router'
import Mapping from '@/components/Mapping'
import Keys from '@/components/Keys'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mapping',
      component: Mapping
    }, {
      path: '/keys',
      name: 'Keys',
      component: Keys
    }
  ]
})
