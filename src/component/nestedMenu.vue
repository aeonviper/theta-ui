<template>
	<v-menu :close-on-content-click="false" offset-x :transition="transition" :value="openMenu" v-if="$root.anyInSetInList($store.state.principal.roleSet, permissionList)">
		<template v-slot:activator="{ on, attrs }">
			<v-list-item dense v-if="isSubMenu" v-bind="attrs" v-on="on">
				<v-list-item-icon>
					<v-icon>mdi-chevron-right</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ name }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
			<v-list-item dense v-else-if="!isSubMenu" v-bind="attrs" v-on="on" @click="openMenu = true">
				<v-list-item-icon>
					<v-icon>mdi-chevron-right</v-icon>
				</v-list-item-icon>
				<v-list-item-content>
					<v-list-item-title>{{ name }}</v-list-item-title>
				</v-list-item-content>
			</v-list-item>
		</template>
		<v-card class="pa-2">
			<template v-for="(item, index) in menuItemList">
				<v-divider :key="index" v-if="item.isDivider" />
				<nested-menu :key="index" :name="item.name" :menu-item-list="item.menu" :is-sub-menu="true" @nested-menu-click="emitClickEvent" :permission-list="item.permissionList" v-else-if="item.menu" />
				<v-list-item dense :key="index" @click="emitClickEvent(item)" link :to="item.link" v-else-if="$root.anyInSetInList($store.state.principal.roleSet, item.permissionList)">
					<v-list-item-icon>
						<v-icon>{{ item.icon }}</v-icon>
					</v-list-item-icon>
					<v-list-item-content>
						<v-list-item-title>{{ item.name }}</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</template>
		</v-card>
	</v-menu>
</template>

<script>
export default {
	name: "nestedMenu",
	props: {
		name: { type: String, default: "" },
		menuItemList: { type: Array, default: () => [] },
		isSubMenu: { type: Boolean, default: false },
		transition: { type: String, default: "scale-transition" },
		permissionList: { type: Array, default: () => [] }
	},
	data: function() {
		return {
			openMenu: false
		};
	},
	methods: {
		emitClickEvent(item) {
			this.$emit("nested-menu-click", item);
			this.openMenu = false;
		}
	}
};
</script>