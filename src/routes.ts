import Layout from './components/Layout.vue';
import LoginPage from './components/Login.vue'
import NotFoundPage from './pages/not-found.vue'

export default [
  {
    path: '/',
    component: Layout,
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  }
];
