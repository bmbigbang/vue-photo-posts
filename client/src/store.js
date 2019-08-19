import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main'

import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from './queries'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: true
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    }
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
          .then(({ data }) => {
            commit('setLoading', false);
            console.log(data.getCurrentUser);
      })
          .catch(err => {
            commit('setLoading', false);
            console.error(err);
            console.dir(err);
          })
    },
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      apolloClient
          .query({
            query: GET_POSTS
          }).then(({ data }) => {
            // mutate the state with new data
            // commit passes data from actions to mutation functions
            commit('setPosts', data.getPosts);
            commit('setLoading', false);
          }).catch(err => {
            commit('setLoading', false);
            console.error(err);
            console.dir(err);
          })
    },
    signInUser: ({ commit }, payload) => {
      apolloClient
          .mutate({
            mutation: SIGNIN_USER,
            variables: payload
          }).then(({ data }) => {
            localStorage.setItem('token', data.signInUser.token);
          }).catch(err => {
            console.error(err);
            console.dir(err);
          })
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
})
