<template>
	<v-main style="margin:0 10px;">
		<div style="height:10px;"></div>
		<v-data-table :headers="fieldList" :items="personList" sort-by="id" :search="keyword" :footer-props="{ itemsPerPageOptions: [50,100,500,-1] }">
			<template v-slot:top>
				<v-row no-gutters style="padding:5px 0 0 0;">
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<h2>{{ $root.capitalizeFirst(title) }} list</h2>
						</div>
					</v-col>
					<v-col cols="12" sm="6">
						<div class="d-flex px-2">
							<v-text-field v-model="keyword" append-icon="mdi-magnify" label="Search" hide-details style="margin-right:10px;"></v-text-field>
							<v-btn small fab dark color="secondary" title="Add" @click="showAddPerson">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</div>
					</v-col>
				</v-row>
			</template>
			<template v-slot:item.active="{ item }">
				<v-icon v-if="item.active === true" color="green" title="Active">mdi-check</v-icon>
				<v-icon v-else color="red" title="Inactive">mdi-block-helper</v-icon>
			</template>
			<template v-slot:item.map.birthDate="{ item }">{{ item.map.birthDateFull }}</template>
			<template v-slot:item.role="{ item }">
				<v-chip v-for="role in item.roleSet" :key="role" class="mr-2">{{ $root.enum(role) }}</v-chip>
			</template>
			<template v-slot:item.action="{ item }">
				<v-icon @click="showEditPerson(item)">mdi-pencil</v-icon>
				<v-icon @click="showDeletePerson(item)">mdi-delete</v-icon>
			</template>
			<template v-slot:no-data>Empty list</template>
		</v-data-table>

		<v-dialog v-model="dialogAdd" max-width="1000px">
			<v-card>
				<v-card-title>
					<span class="headline">Add {{ title }}</span>
					<v-spacer></v-spacer>
					<v-btn fab small elevation="0" @click="dialogAdd = false"><v-icon>mdi-close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="6">
							<div style="display:flex;justify-content:space-between;">
								<div class="label">Date of birth</div>
								<a @click="person.map.birthDate = null;">Clear</a>
							</div>
							<v-date-picker first-day-of-week="1" v-model="person.map.birthDate" full-width></v-date-picker>
						</v-col>
						<v-col cols="6">
							<v-text-field v-model="person.name" label="Name"></v-text-field>
							<v-text-field v-model="person.email" label="Email"></v-text-field>
							<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
							<v-switch v-model="person.active" label="Active"></v-switch>
							<v-select v-model="person.roleSet" :items="roleList" label="Role" multiple chips item-value="value" item-text="text"></v-select>
							<v-file-input v-model="attachment" accept="image/*" label="Foto"></v-file-input>
							<div class="d-flex justify-center align-center">
								<v-file-input v-model="attachment1" accept="image/*, application/pdf" label="Lampiran"></v-file-input>
								<v-file-input v-model="attachment2" accept="image/*, application/pdf" label="Lampiran"></v-file-input>
							</div>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogAdd = false">Cancel</v-btn>
					<v-btn @click="addPerson" color="primary">Add</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogEdit" max-width="1000px">
			<v-card>
				<v-card-title>
					<span class="headline">Edit {{ title }}</span>
					<v-spacer></v-spacer>
					<v-btn fab small elevation="0" @click="dialogEdit = false"><v-icon>mdi-close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>
					<v-row>
						<v-col cols="6">
							<v-card v-if="person.image">
								<media :name="person.image"></media>
								<v-btn @click="$root.downloadAsset(person.image)" fab small style="position:absolute;right:10px;bottom:10px;">
									<v-icon>mdi-download</v-icon>
								</v-btn>
							</v-card>
							<div style="display:flex;justify-content:space-between;">
								<div class="label">Date of birth</div>
								<a @click="person.map.birthDate = null;">Clear</a>
							</div>
							<v-date-picker first-day-of-week="1" v-model="person.map.birthDate" full-width></v-date-picker>
						</v-col>
						<v-col cols="6">
							<v-text-field v-model="person.name" label="Name"></v-text-field>
							<v-text-field v-model="person.email" label="Email"></v-text-field>
							<v-text-field v-model="person.password" label="Password" type="password"></v-text-field>
							<v-switch v-model="person.active" label="Active"></v-switch>
							<v-select v-model="person.roleSet" :items="roleList" label="Role" multiple chips item-value="value" item-text="text"></v-select>
							<v-file-input v-model="attachment" accept="image/*" label="Foto"></v-file-input>
							<div class="d-flex justify-center align-center">
								<v-file-input v-model="attachment1" accept="image/*, application/pdf" label="Lampiran"></v-file-input>
								<v-file-input v-model="attachment2" accept="image/*, application/pdf" label="Lampiran"></v-file-input>
							</div>
						</v-col>
					</v-row>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogEdit = false">Cancel</v-btn>
					<v-btn @click="editPerson" color="primary">Edit</v-btn>
				</v-card-actions>
				<div class="pa-5">
					<v-row>
						<v-col v-for="item in person.attachmentList" :key="item" cols="4">
							<v-card class="ma-2">
								<media :name="item"></media>
								<v-btn @click="$root.downloadAsset(item)" fab small style="position:absolute;right:10px;bottom:10px;">
									<v-icon>mdi-download</v-icon>
								</v-btn>
								<v-btn @click="deleteAttachment(person, item)" fab small style="position:absolute;right:60px;bottom:10px;">
									<v-icon>mdi-delete</v-icon>
								</v-btn>
							</v-card>
						</v-col>
					</v-row>
				</div>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogDelete" max-width="600px">
			<v-card>
				<v-card-title>
					<span class="headline">Delete {{ title }}</span>
					<v-spacer></v-spacer>
					<v-btn fab small elevation="0" @click="dialogDelete = false"><v-icon>mdi-close</v-icon></v-btn>
				</v-card-title>
				<v-card-text>Are you sure you want to delete '{{ person.name }}' ({{ person.id }})?</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn @click="dialogDelete = false">Cancel</v-btn>
					<v-btn @click="deletePerson" color="accent">Delete</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
	</v-main>
</template>

<script>
/* eslint-disable no-unused-vars */
import axios from "axios";
import media from "./media";

export default {
	components: {
		media
	},
	data: function() {
		return {
			title: "person",
			fieldList: [
				{
					text: "Id",
					value: "id"
				},
				{ text: "Name", value: "name" },
				{ text: "Email", value: "email" },
				{ text: "Active", value: "active" },
				{ text: "Birth date", value: "map.birthDate" },
				{ text: "Role", value: "role", sortable: false },
				{ text: "", value: "action", sortable: false }
			],
			keyword: "",
			personList: [],
			person: {
				map: {}
			},
			dialogAdd: false,
			dialogEdit: false,
			dialogDelete: false,
			roleList: [],
			attachment: null,
			attachment1: null,
			attachment2: null
		};
	},
	mounted: function() {
		this.listPerson();
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
		listPerson() {
			axios
				.get("/system/person/list")
				.then(response => {
					this.personList = response.data;
				})
				.catch(() => {});
		},
		showAddPerson() {
			this.person = {
				map: {}
			};
			this.dialogAdd = true;
		},
		addPerson() {
			let formData = new FormData();
			formData.append("person", JSON.stringify(this.person));
			if (this.attachment) {
				formData.append("attachment", this.attachment);
			}
			if (this.attachment1) {
				formData.append("attachment1", this.attachment1);
			}
			if (this.attachment2) {
				formData.append("attachment2", this.attachment2);
			}
			axios
				.post("/system/person/add", formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then(() => {
					this.dialogAdd = false;
					this.listPerson();
				})
				.catch(() => {});
		},
		showEditPerson(item) {
			this.person = this.$root.clone(item);
			this.dialogEdit = true;
		},
		editPerson() {
			let formData = new FormData();
			formData.append("person", JSON.stringify(this.person));
			if (this.attachment) {
				formData.append("attachment", this.attachment);
			}
			if (this.attachment1) {
				formData.append("attachment1", this.attachment1);
			}
			if (this.attachment2) {
				formData.append("attachment2", this.attachment2);
			}
			axios
				.post("/system/person/edit?&id=" + this.person.id, formData, {
					headers: {
						"Content-Type": "multipart/form-data"
					}
				})
				.then(() => {
					this.dialogEdit = false;
					this.listPerson();
				})
				.catch(() => {});
		},
		showDeletePerson(item) {
			this.person = this.$root.clone(item);
			this.dialogDelete = true;
		},
		deletePerson() {
			axios
				.delete("/system/person/delete?&id=" + this.person.id)
				.then(() => {
					this.dialogDelete = false;
					this.listPerson();
				})
				.catch(() => {});
		},
		deleteAttachment(entity, name) {
			if (confirm("Are you sure you want to delete this attachment?")) {
				axios
					.post("/system/person/attachment/delete?&personId=" + entity.id, { id: entity.id, name: name })
					.then(response => {
						this.person.attachmentList = response.data.attachmentList;
						this.listPerson();
					})
					.catch(() => {});
			}
		},
	}
};
</script>