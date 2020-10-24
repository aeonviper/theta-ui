import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import vuetify from './vuetify'

Vue.config.productionTip = false;

Vue.use(VueRouter)

import axios from 'axios'

import application from './application.vue'

const router = new VueRouter({
	routes: [
	]
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.role === 'Administrator')) {
		if (store.state.principal.role === 'Administrator') {
			next();
			return;
		}
		next('/administrator');
	} else if (to.matched.some(record => record.meta.role === 'Tenant')) {
		if (store.state.principal.role === 'Tenant') {
			next();
			return;
		}
		next('/tenant');
	} else if (to.matched.some(record => record.meta.role)) {
		if (store.state.principal.role) {
			next();
			return;
		}
		next('/');
	} else {
		next();
	}
})

axios.defaults.baseURL = '';

if (window.location.origin.includes("localhost")) {
	axios.defaults.withCredentials = true;
	axios.defaults.baseURL = 'http://localhost:8900/epsilon';
}

Vue.prototype.$window = window;

/* eslint-disable no-unused-vars */

new Vue({
	router,
	store,
	vuetify,
	render: display => display(application),
	data: () => {
		return {
			loader: { count: 0, stroke: 7, diameter: 50, value: false }
		};
	},
	created: () => {
		axios.interceptors.request.use(
			request => {
				this.load();
				return request;
			},
			error => {
				this.unload();

				let notification = { title: 'Unknown error', content: "" };
				if (error.response) {
					if (error.response.status == 400) {
						notification.title = 'Bad request';
					} else if (error.response.status == 500) {
						notification.title = 'Server error';
					} else if (error.response.status == 401) {
						notification.title = 'Unauthorized';
					} else if (error.response.status == 403) {
						notification.title = 'Forbidden';
					} else if (error.response.status == 404) {
						notification.title = 'Not found';
					} else {
						notification.title = 'Notification (' + error.response.status + ')';
					}
					notification.content = error.response.data;
				}
				store.commit("showNotification", notification);

				return Promise.reject(error);
			}
		);

		axios.interceptors.response.use(
			response => {
				this.unload();
				return response;
			},
			error => {

				this.unload();

				let notification = { title: 'Unknown error', content: "" };
				if (error.response) {
					if (error.response.status == 400) {
						notification.title = 'Bad request';
					} else if (error.response.status == 500) {
						notification.title = 'Server error';
					} else if (error.response.status == 401) {
						notification.title = 'Unauthorized';
					} else if (error.response.status == 403) {
						notification.title = 'Forbidden';
					} else if (error.response.status == 404) {
						notification.title = 'Not found';
					} else {
						notification.title = 'Notification (' + error.response.status + ')';
					}
					notification.content = error.response.data;
				}
				store.commit("showNotification", notification);

				return Promise.reject(error);
			}
		);
	},
	methods: {
		load() {
			this.loader.count++;
			this.loader.value = true;
		},
		unload() {
			this.loader.count--;
			if (this.loader.count < 0) {
				this.loader.count = 0;
			}
			this.loader.value = this.loader.count > 0;
		},
		ellipsify(text, limit) {
			if (text && text.length > limit) {
				return text.substring(0, limit) + '...';
			}
			return text;
		},
		logSuccess: function (o) {
			// console.log('>> Success: ' + JSON.stringify(o.data));
		},
		logError: function (o) {
			// console.log('>> Error: ' + JSON.stringify(o.response.data));
			// Sentry.captureMessage(JSON.stringify(o.response.data));
		},
		clone(object) {
			return JSON.parse(JSON.stringify(object));
		},
		textify(text, before, after) {
			if (text && text.trim().length > 0) {
				return (before ? before : '') + text + (after ? after : '');
			}
			return text;
		},
		isImage(text) {
			if (text) {
				let q = text.toLowerCase();
				return q.endsWith('.jpg') || q.endsWith('.jpeg') || q.endsWith('.png');
			}
			return false;
		},
		isVideo(text) {
			if (text) {
				let q = text.toLowerCase();
				return q.endsWith('.mp4');
			}
			return false;
		},
		asset(text) {
			if (text) {
				if (text.toLowerCase().startsWith('http')) {
					return text; 
				} else {
					return axios.defaults.baseURL + '/asset/file/' + text;
				}
			}
			return null;
		}
	}
}).$mount('#application')
