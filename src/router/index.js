import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Media from '@/components/Media'
import Home from '@/components/Home'
import PlayList from '@/components/PlayList'
import Player from '@/components/Player'

Vue.use(Router)

export default new Router({
  routes: [
    {
    	path:'/',
    	name: 'Index',
    	component: Index
    },
    {
        path:'/Media/:id',
        name: 'Media',
        component: Media
    },
    {
        path:'/Home',
        name: 'home',
        component: Home
    },
    {
        path: '/PlayList',
        name: 'PlayList',
        component: PlayList
    }
  ]
})
