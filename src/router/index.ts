import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/components/Layout.vue'
import Login from '@/components/Login.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Layout',
            component: Layout,
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
        }
    ]
})
