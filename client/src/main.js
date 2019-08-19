import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'

import ApolloClient from 'apollo-boost';

import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

export const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  // include auth token with requests to back-end
  fetchOptions: {
    credentials: 'include'
  },
  request: operation => {
    // if no token in localStorage, add a default
    if (!localStorage.token) {
      localStorage.setItem('token', '');
    }

    // add token to an auth header
    operation.setContext({
      headers: {
        authorization: localStorage.getItem('token')
      }
    })
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log('[networkError]', networkError);
    }

    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;
Vue.prototype.$debugger = function() {
  debugger;
};

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
  apolloProvider,
  created() {
    // execute getCurrentUser query to get authentication status
    this.$store.dispatch('getCurrentUser');
  }
}).$mount('#app');
