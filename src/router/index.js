import Vue from 'vue'
import Router from 'vue-router'
import Mapping from '@/components/Mapping'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Mapping',
      component: Mapping
    }
  ]
})
