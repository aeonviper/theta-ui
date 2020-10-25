<template>
	<v-app>
		<v-main style="display:flex;align-items:center;">
			<center>
				<h1>Page not found</h1>
				<p>The page you are looking for does not exist</p>
				<v-btn small @click="$router.back()" color="primary">Go back</v-btn>
			</center>
		</v-main>
	</v-app>
</template>