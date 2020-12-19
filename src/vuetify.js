import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		themes: {
			light: {
				primary: '#007ACC',
				secondary: '#0094FF',
				accent: '#FF00DC',
				info: '#00c0ef',
				success: '#00a65a',
				warning: '#f39c12'
			}
		}
	}
});
