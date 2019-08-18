import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'

import ApolloClient from 'apollo-boost';

import VueApollo from 'vue-apollo';

Vue.use(VueApollo);

const defaultClient = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
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
}).$mount('#app');
