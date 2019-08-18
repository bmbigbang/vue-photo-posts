import Vue from 'vue'
import Vuex from 'vuex'

import { defaultClient as apolloClient } from './main'
import { gql } from 'apollo-boost';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    }
  },
  actions: {
    getPosts: ({ commit }) => {
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
      }).catch(err => {
        console.error(err);
        console.dir(err);
      })
    }
  },
  getters: {
    posts: state => state.posts
  }
})
