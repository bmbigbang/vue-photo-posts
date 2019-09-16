import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md',
  },
  theme: { themes: {
    light: {
      primary: "#159648",
      secondary: "#90705c",
      accent: "#254441",
      error: "#ff6666",
      warning: "#bcb382",
      info: "#78909C",
      success: "#388E3C",
      link: "#3d5afe"
    }
  }}
});
