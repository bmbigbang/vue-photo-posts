import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main'
import { gql } from 'apollo-boost';

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
    getPosts: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: gql`
          query {
            getPosts {
              _id
              title
              imageUrl
              description
              likes
            }
          }
        `,
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
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
})
