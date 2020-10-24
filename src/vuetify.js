import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#003366',
				secondary: '#00C0F3',
				accent: '#8F257A',
				info: '#00c0ef',
				success: '#00a65a',
				warning: '#f39c12'
			}
		}
	}
});
