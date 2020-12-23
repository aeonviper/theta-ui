import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import vuetify from './vuetify'

/* eslint-disable no-unused-vars */

Vue.config.productionTip = false;

Vue.use(VueRouter)

import axios from 'axios'

import application from './application.vue'

import index from './component/index'
import notFound from './component/notFound'
import unauthorized from './component/unauthorized'
import navigation from './component/navigation'
import registration from './component/registration'

import administratorAuthentication from './component/administrator/authentication'
import administratorNavigation from './component/administrator/navigation'
import administratorDashboard from './component/administrator/dashboard'
import administratorPerson from './component/administrator/person'
import administratorStaff from './component/administrator/staff'

import tenantAuthentication from './component/tenant/authentication'
import tenantNavigation from './component/tenant/navigation'
import tenantDashboard from './component/tenant/dashboard'
import tenantPerson from './component/tenant/person'
import tenantPersonAdd from './component/tenant/personAdd'
import tenantPersonEdit from './component/tenant/personEdit'

import userAuthentication from './component/user/authentication'
import userNavigation from './component/user/navigation'
import userDashboard from './component/user/dashboard'

const router = new VueRouter({
	routes: [
		// common
		{ path: '', component: navigation, props: true,
			children: [
				{ path: '/', component: index, props: true },
				{ path: '/register', component: registration, props: true }
			] 
		},
		{ path: '/unauthorized', component: unauthorized, props: true },
		{ path: '/notfound', component: notFound, props: true },
		{ path: '*', redirect: '/notfound' },

		// administrator portal
		{ path: '', component: navigation, props: true, children: [{ path: '/administrator', component: administratorAuthentication, props: true }] },
		{
			path: '', component: administratorNavigation, props: true,
			children: [
				{ path: '/administrator/person', component: administratorPerson, props: true, meta: { role: "Administrator" } },
				{ path: '/administrator/staff', component: administratorStaff, props: true, meta: { role: "Administrator" } },
				{ path: '/administrator/dashboard', component: administratorDashboard, props: true, meta: { role: "Administrator" } }
			]
		},

		// tenant portal
		{ path: '', component: navigation, props: true, children: [{ path: '/tenant', component: tenantAuthentication, props: true }] },
		{
			path: '', component: tenantNavigation, props: true,
			children: [
				{ path: '/tenant/dashboard', component: tenantDashboard, props: true, meta: { role: "Tenant" } },
				{ path: '/tenant/person', component: tenantPerson, props: true, meta: { role: "Tenant" } },
				{ path: '/tenant/person/add', component: tenantPersonAdd, props: true, meta: { role: "Tenant" } },
				{ path: '/tenant/person/edit/:entityId', component: tenantPersonEdit, props: true, meta: { role: "Tenant" } }
			]
		},

		// user portal
		{ path: '', component: navigation, props: true, children: [{ path: '/user', component: userAuthentication, props: true }] },
		{
			path: '', component: userNavigation, props: true,
			children: [
				{ path: '/user/dashboard', component: userDashboard, props: true, meta: { role: "User" } }
			]
		}
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
	} else if (to.matched.some(record => record.meta.role === 'User')) {
		if (store.state.principal.role === 'User') {
			next();
			return;
		}
		next('/user');
	} else {
		next();
	}
})

axios.defaults.baseURL = '';

if (window.location.origin.includes("localhost")) {
	axios.defaults.withCredentials = true;
	axios.defaults.baseURL = 'http://localhost:8900/theta';
}

Vue.prototype.$window = window;

new Vue({
	router,
	store,
	vuetify,
	render: display => display(application),
	data: function() {
		return {
			loader: { count: 0, stroke: 7, diameter: 50, value: false },
			monthList: [
				"January",
				"February",
				"March",
				"April",
				"May",
				"June",
				"July",
				"August",
				"September",
				"October",
				"November",
				"December"
			]
		};
	},
	created: function() {
		axios.interceptors.request.use(
			request => {
				this.load();
				return request;
			},
			error => {
				this.unload();

				let notification = { title: 'Unknown error', content: '' };
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

				let notification = { title: 'Unknown error', content: '' };
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
		ellipsify(text, limit) {
			if (text && text.length > limit) {
				return text.substring(0, limit) + '...';
			}
			return text;
		},
		textify(text, before, after) {
			if (text && text.trim().length > 0) {
				return (before ? before : '') + text + (after ? after : '');
			}
			return text;
		},
		enum(text) {
			if (text) {
				return text.replace(/_/g, ' ');
			}
			return text;
		},
		downloadAsset(name) {
			location.href = axios.defaults.baseURL + "/asset/file/" + name + "?download&time=" + (new Date());
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
		asset(text, resolution) {
			if (text) {
				if (text.toLowerCase().startsWith('http')) {
					return text; 
				} else {
					return axios.defaults.baseURL + '/asset/' + resolution + '/' + text;
				}
			}
			return null;
		},
		formatDateTime(instant) {
			if (instant != null) {
				return (
					instant.getDate() +
					" " +
					this.monthList[instant.getMonth() - 1] +
					" " +
					instant.getFullYear() +
					" " +
					(instant.getHours() < 10 ? "0" : "") +
					instant.getHours() +
					":" +
					(instant.getMinutes() < 10 ? "0" : "") +
					instant.getMinutes()
				);
			} else {
				return "";
			}
		}
	}
}).$mount('#application')
