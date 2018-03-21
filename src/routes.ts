import Layout from './components/layout.vue';
import HomePage from './components/home.vue';
import BookPage from './components/book.vue';
import LoginPage from './components/login.vue';
import BookByAllPage from './components/bookpages/bookbyall.vue';
import BookByTimePage from './components/bookpages/bookbytime.vue';
import BookByRoomPage from './components/bookpages/bookbyroom.vue';
import SelectTimePage from './components/bookpages/selecttime.vue';
import AutoPage from './components/auto.vue'

import NotFoundPage from './pages/not-found.vue';
import Home from './pages/home.vue';
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
      },
      {
        path: "/auto/",
        id: "auto",
        component: AutoPage
      }
    ],
    on: {
      pageBeforeIn: function (event, page) {
        console.log("Before In Main Layout.")
      }
    }
  },
  {
    path: '/login/',
    component: LoginPage,
    on: {
      pageBeforeIn: function (event, page) {
        console.log("Before In Login.")
      }
    }
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
    path: '/book/:bookType/byall/:buildingID/:bookDate/',
    component: BookByAllPage
  },
  {
    path: '/book/:bookType/bytime/:buildingID/:bookDate/',
    component: BookByTimePage
  },
  {
    path: '/book/:bookType/byroom/:buildingID/:bookDate/',
    component: BookByRoomPage
  },
  {
    path: '/selecttime/:bookType/:bookDate/:seatID/',
    component: SelectTimePage
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  }
];
