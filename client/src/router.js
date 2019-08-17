import Vue from 'vue'
import Router from 'vue-router'
import Home from './components/Home.vue'
import AddPost from "./components/AddPost";
import Posts from "./components/Posts";
import Profile from "./components/Profile";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

Vue.use(Router);

export default new Router({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/post/add',
      name: 'addPost',
      component: AddPost
    },
    {
      path: '/posts',
      name: 'posts',
      component: Posts
    },
    {
      path: '/signin',
      name: 'signIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'signUp',
      component: SignUp
    },
  ]
})
