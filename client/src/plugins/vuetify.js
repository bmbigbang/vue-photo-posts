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
            secondary: "#9F7E69",
            accent: "#254441",
            error: "#ff6f59",
            warning: "#bcb382",
            info: "#78909C",
            success: "#388E3C"
        }
    }}
});
