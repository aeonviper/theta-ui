<template>
	<v-app>
		<router-view></router-view>

		<v-dialog v-model="$store.state.notification.show" width="500">
			<v-card style="padding:20px;">
				<div style="display:flex;justify-content:space-between;">
					<h2 style="margin-bottom:10px;">{{$store.state.notification.title}}</h2>
					<v-btn icon color="secondary" @click="closeNotification">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</div>
				<template v-if="$store.state.notification.content && $store.state.notification.content.type == 'NOTIFICATION'">
					<div style="color:#C42126;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.fieldErrorList">{{item}}</div>
					<div style="color:#ED5025;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.errorList">{{item}}</div>
					<div style="color:#E26026;font-size:14px;" :key="item" v-for="item in $store.state.notification.content.noticeList">{{item}}</div>
				</template>
				<template v-else>
					<div style="color:#E26026;font-size:14px;">{{$store.state.notification.content}}</div>
				</template>
				<div style="text-align:center;margin-top:20px;">
					<v-btn color="#009ec1" @click="closeNotification">Close</v-btn>
				</div>
			</v-card>
		</v-dialog>

		<img v-show="$root.loader.value" src="loader.gif" class="loader" />
	</v-app>
</template>

<script>
export default {
	methods: {
		closeNotification() {
			this.$store.commit("hideNotification");
		}
	}
};
</script>