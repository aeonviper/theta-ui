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
				info: '#00C0EF',
				success: '#00A65A',
				warning: '#F39C12'
			}
		}
	}
});
