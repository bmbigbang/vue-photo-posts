import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';

import FormAlert from './components/shared/FormAlert'

Vue.component('form-alert', FormAlert);

import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

export const defaultClient = new ApolloClient({
  uri: 'https://vue-photo-posts.herokuapp.com/graphql',
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
        if (err.name === "AuthenticationError") {
          // set auth error in state (to show in snackbar)
          store.commit("setAuthError", err);
          // sign out user
          store.dispatch('signOutUser');
        }
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
