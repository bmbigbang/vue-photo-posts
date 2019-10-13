import Vue from 'vue'
import Vuex from 'vuex'
import Router from './router'

import { defaultClient as apolloClient } from './main'

import {
  GET_POSTS, SIGNIN_USER, GET_CURRENT_USER,
  SIGNUP_USER, ADD_POST, SEARCH_POSTS, GET_USER_POSTS,
  UPDATE_USER_POST
} from './queries'

var _ = require('lodash');

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: true,
    error: null,
    authError: null
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    setUserPosts: (state, payload) => {
      state.userPosts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = [])
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit('setLoading', true);
      apolloClient.query({
        query: GET_CURRENT_USER
      })
          .then(({ data }) => {
            commit('setLoading', false);
            commit('setUser', data.getCurrentUser);
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
    getUserPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: GET_USER_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit('setUserPosts', data.getUserPosts)
      }).catch(err => {
        console.error(err);
      });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient.query({
        query: SEARCH_POSTS,
        variables: payload
      }).then(({ data }) => {
        commit("setSearchResults", data.searchPosts)
      }).catch(err => console.error(err));
    },
    addPost: ({ commit }, payload) => {
      commit('setLoading', true);
      apolloClient
          .mutate({
            mutation: ADD_POST,
            variables: payload,
            update: (cache, { data: { addPost } }) => {
              // first read the query from the cache to update
              const data = cache.readQuery({ query: GET_POSTS });
              // Create updated data
              data.getPosts.unshift(addPost);
              // Write updated data back to query
              cache.writeQuery({
                query: GET_POSTS,
                data
              })
            },
            // this ensures the update to data is added immediately to the cache
            optimisticResponse: {
              __typename: 'Mutation',
              addPost: {
                __typename: 'Post',
                _id: -1,
                ...payload
              }
            }
          })
          .then(({ data }) => {
            commit('setLoading', false);
          })
          .catch(err => {
            commit('setLoading', false);
            console.error(err);
            console.dir(err);
          })
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
          .mutate({
            mutation: UPDATE_USER_POST,
            variables: payload
          })
          .then(({ data }) => {
            const index = _.findIndex(state.userPosts, ['_id', data.updateUserPost._id]);
            const userPosts = state.userPosts;
            userPosts[index] = data.updateUserPost;
            commit("setUserPosts", userPosts);
          })
          .catch(err => {
            console.error(err);
          })
    },
    signInUser: ({ commit }, payload) => {
      // clear error to be able to show other errors
      commit('clearError');
      commit('setLoading', true);
      apolloClient
          .mutate({
            mutation: SIGNIN_USER,
            variables: payload
          }).then(({ data }) => {
            commit('setLoading', false);
            localStorage.setItem('token', data.signInUser.token);
            // to make sure created method is run in main.js (getCurrentUser),
            // reload the page manually
            Router.go('/');
          }).catch(err => {
            commit('setLoading', false);
            commit('setError', err);
            console.error(err);
            console.dir(err);
          })
    },
    signOutUser: async ({ commit }) => {
      // clean user in state
      commit('clearUser');

      // end session and remove related user data
      localStorage.setItem('token', '');
      await apolloClient.clearStore();

      // redirect home from private page
      await Router.push('/');
    },
    signUpUser: ({ commit }, payload) => {
      // clear error to be able to show other errors
      commit('clearError');
      commit('setLoading', true);
      apolloClient
          .mutate({
            mutation: SIGNUP_USER,
            variables: payload
          }).then(({ data }) => {
            commit('setLoading', false);
            localStorage.setItem('token', data.signUpUser.token);
            // to make sure created method is run in main.js (getCurrentUser),
            // reload the page manually
            Router.go('/');
          }).catch(err => {
            commit('setLoading', false);
            commit('setError', err);
            console.error(err);
            console.dir(err);
          })
    },
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    loading: state => state.loading,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    error: state => state.error,
    authError: state => state.authError
  }
})
