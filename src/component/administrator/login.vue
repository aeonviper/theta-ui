<template>
	<v-main>
		<div
			class="d-flex flex-column justify-center align-center"
			style="background-color:#d2d6de;background-size:cover;background-attachment:fixed;min-height:100vh;display:flex;flex-direction:column;"
		>
			<v-form ref="form" v-model="valid" @submit.prevent="login">
				<v-card width="360">
					<v-card-title class="title d-flex justify-center align-center" style="background-color:#003366;color:white;">
						<v-img max-width="150" src="../../asset/logo.png"></v-img>
					</v-card-title>
					<v-card-text>
						<v-text-field v-model="email" :rules="emailRules" label="Email" required></v-text-field>
						<v-text-field v-model="password" :rules="passwordRules" type="password" label="Password" required></v-text-field>
					</v-card-text>
					<v-card-actions class="py-4">
						<v-spacer></v-spacer>
						<v-btn :disabled="!valid" type="submit" color="primary darken-1" depressed tile>Login</v-btn>
					</v-card-actions>
				</v-card>
			</v-form>
		</div>
	</v-main>
</template>

<script>
export default {
	data: () => {
		return {
			valid: true,
			email: null,
			emailRules: [v => !!v || "Email is required", v => /.+@.+\..+/.test(v) || "Email must be valid"],
			password: null,
			passwordRules: [v => !!v || "Password is required"]
		};
	},
	methods: {
		login() {
			this.$store
				.dispatch("login", {
					type: "Administrator",
					email: this.email,
					password: this.password
				})
				.then(() => this.$router.push("/administrator/dashboard"))
				.catch(() => {});
		}
	}
};
</script>