import Layout from './components/layout.vue';
import HomePage from './components/home.vue';
import BookPage from './components/book.vue'
import LoginPage from './components/login.vue'
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
    component: Layout,
    tabs: [
      {
        path: '/',
        id: 'home',
        component: HomePage
      },
      {
        path: '/book/',
        id: 'book',
        component: BookPage
      }
    ]
  },
  {
    path: '/login/',
    component: LoginPage,
  },
  {
    path: '/homepage/',
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
