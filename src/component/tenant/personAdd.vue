<template>
	<v-main style="margin:0 10px;">
		<div style="height:10px;"></div>
		<v-card>
			<v-card-title>
				<span class="headline">Add</span>
			</v-card-title>
			<v-card-text>
				<v-text-field v-model="person.name" label="Name"></v-text-field>
				<v-text-field v-model="person.email" label="Email"></v-text-field>
				<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
				<v-switch v-model="person.active" label="Active"></v-switch>
				<v-select v-model="person.role" label="Role" :items="roleList"></v-select>
			</v-card-text>
			<v-card-actions>
				<v-spacer></v-spacer>
				<v-btn @click="$router.push('/tenant/person')">Cancel</v-btn>
				<v-btn @click="addPerson" color="primary">Add</v-btn>
			</v-card-actions>
		</v-card>
	</v-main>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";

export default {
	data: function() {
		return {
			person: {},
			roleList: []
		};
	},
	mounted: function() {
		this.listRole();
	},
	methods: {
		listRole() {
			axios
				.get("/system/common/person/role/list")
				.then(response => {
					this.roleList = response.data;
				})
				.catch(() => {});
		},
		addPerson() {
			axios
				.post("/system/person/add", { person: this.person })
				.then(() => {
					this.$router.push("/tenant/dashboard");
				})
				.catch(() => {});
		}
	}
};
</script>