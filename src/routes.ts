import Layout from './components/Layout.vue';
import HomePage from './components/HomePage.vue';
import LoginPage from './components/Login.vue'
import NotFoundPage from './pages/not-found.vue'
import Home from './pages/home.vue'
import AboutPage from './pages/about.vue';
import FormPage from './pages/form.vue';
import DynamicRoutePage from './pages/dynamic-route.vue';

import PanelLeftPage from './pages/panel-left.vue';
import PanelRightPage from './pages/panel-right.vue';

export default [
  {
    path: '/',
    component: Layout
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/home/',
    component: Home,
  },
  {
    path: '/panel-left/',
    component: PanelLeftPage,
  },
  {
    path: '/panel-right/',
    component: PanelRightPage,
  },
  {
    path: '/about/',
    component: AboutPage,
  },
  {
    path: '/form/',
    component: FormPage,
  },
  {
    path: '/dynamic-route/blog/:blogId/post/:postId/',
    component: DynamicRoutePage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  }
];
