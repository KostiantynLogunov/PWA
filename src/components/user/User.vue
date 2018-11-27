<template>
    <div>
	    <!--SNACKBAR-->
	    <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="docUploaded" md-persistent>
		    <span>{{$lang.messages.you_changed_avatar}}</span>
		    <md-button class="md-accent" @click="docUploaded = false">{{$lang.buttons.close}}</md-button>
	    </md-snackbar>
	    <!--SNACKBAR-->

	    <form novalidate class="md-layout" enctype="multipart/form-data" @submit.prevent="sendAvatar()">
			<md-card class="md-layout-item md-size-50 md-small-size-100">
				<md-card-content>
						<label>Avatar:</label><br>
						<img id="avatar" :src="href_avatar" alt="avatar" ><br>

					<input type="file" id="file" ref="file" v-on:change="handleFileUpload()" :disabled="uploading"/>
					<!--<md-field>
						<label>Only images</label>
						<md-file v-model="file" accept="image/*" id="file" ref="file" v-on:change="handleFileUpload()" :disabled="uploading"/>
					</md-field>-->
				</md-card-content>
				<md-card-actions>
					<!--<input type="submit" value="Upload" :disabled="uploading">-->
					<md-button type="submit" class="md-raised" :disabled="uploading">Upload</md-button>
				</md-card-actions>
			</md-card>
	    </form>
		<!--<br>-->
	    <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="uploading" />

		<form novalidate class="md-layout" @submit.prevent="changeSettings()">
			<md-card class="md-layout-item md-size-50 md-small-size-100">
				<md-card-header>
					<div class="md-title">General Settings</div>
				</md-card-header>
				<md-card-content>
					<div class="md-layout md-gutter">
						<div class="md-layout-item 50">
							<md-field>
								<label>UserName</label>
								<md-input type="text" name="username" v-model="form.username" autocomplete="username" :placeholder="user.username"  :disabled="sending"/>
							</md-field>
						</div>

						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Full Name</label>
								<md-input type="text" name="name" autocomplete="name" :placeholder="this.user.name" :disabled="sending" v-model="form.name"/>
							</md-field>
						</div>
					</div>

					<md-field>
						<label>About</label>
						<md-textarea type="text" name="about"  autocomplete="about" :placeholder="this.user.about" :disabled="sending" v-model="form.about"/>
					</md-field>

					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Email</label>
								<md-input type="email" name="email" autocomplete="email" :placeholder="this.user.email" :disabled="sending" v-model="form.email"/>
							</md-field>
						</div>


						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Gender</label>
								<md-select name="gender" :placeholder="this.user.gender" md-dense :disabled="sending" v-model="form.gender">
									<!--<md-option disabled>Select gander</md-option>-->
									<md-option value="male">{{$lang.registerForm.male}}</md-option>
									<md-option value="female">{{$lang.registerForm.female}}</md-option>
									<md-option value="other">{{$lang.registerForm.other}}</md-option>
								</md-select>
							</md-field>
						</div>
					</div>

					<md-card-header>
						<div class="md-title">Personal</div>
					</md-card-header>

					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Birthday</label>
								<md-input type="text" name="birthday" autocomplete="birthday" :placeholder="this.user.birthday" :disabled="sending" v-model="form.birthday"/>
							</md-field>
						</div>

						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Designation</label>
								<md-input type="text" name="designation" autocomplete="designation" :placeholder="this.user.designation" :disabled="sending" v-model="form.designation"/>
							</md-field>
						</div>
					</div>

					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Hobbies</label>
								<md-input type="text" name="hobbies" autocomplete="hobbies" :placeholder="this.user.hobbies" :disabled="sending" v-model="form.hobbies"/>
							</md-field>
						</div>

						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Interests</label>
								<md-input type="text" name="interests" autocomplete="interests" :placeholder="this.user.interests" :disabled="sending" v-model="form.interests"/>
							</md-field>
						</div>
					</div>
					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Phone Number</label>
								<md-input type="text" name="phone" autocomplete="phone" :placeholder="this.user.phone" :disabled="sending" v-model="form.phone"/>
							</md-field>
						</div>
					</div>
					<md-card-header>
						<div class="md-title">Update Password</div>
					</md-card-header>
					<div class="md-layout md-gutter">

						<br>
						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>Current Password</label>
								<md-input type="password" name="current_password" autocomplete="current_password" placeholder="Enter current password" :disabled="sending" v-model="form.current_password"/>
							</md-field>
						</div>

						<div class="md-layout-item md-small-size-50">
							<md-field>
								<label>New Password</label>
								<md-input type="password" name="new_password" placeholder="Enter new password" :disabled="sending" v-model="form.new_password"/>
							</md-field>
						</div>
					</div>

				</md-card-content>

				<md-progress-bar md-mode="indeterminate" v-if="sending" />

				<md-card-actions>
					<md-button type="submit" class="md-raised" :disabled="sending">Save Changes</md-button>
				</md-card-actions>
			</md-card>

			<md-snackbar :md-active.sync="SettingsSaved">The user {{ form.fullName }} has saved settings with success!
				<md-button class="md-accent" @click="SettingsSaved = false">{{$lang.buttons.close}}</md-button></md-snackbar>
		</form>
    </div>
</template>

<script>
	import {config} from '../../_services/config'
	import axios from 'axios'

    export default {
        name: "User",
	    data(){
        	return {
              	form: {
                    username: null,
              	    name: null,
              	    about: null,
              	    email: null,
              	    gender: null,
              	    country: null,
              	    city: null,
              	    birthday: null,
              	    designation: null,
              	    hobbies: null,
              	    interests: null,
              	    phone: null,
                    current_password: null,
                    new_password: null,

				},
                SettingsSaved: false,
                sending: false,
		        file: '',
		        uploading: false,
		        docUploaded: false,
		        href_avatar: '',
		        position: 'center',
		        duration: 4000,
		        user: null
	        }
	    },

        created () {
            this.href_avatar = this.$store.getters.currentUser.avatar;
            this.user = this.$store.getters.currentUser;
			// console.log(this.user);
            this.form.username = this.user.username;
            this.form.name = this.user.name;
            this.form.about = this.user.about;
            this.form.email = this.user.email;
            this.form.gender = this.user.gender;
            this.form.country = this.user.country;
            this.form.city = this.user.city;
            this.form.birthday = this.user.birthday;
            this.form.designation = this.user.designation;
            this.form.hobbies = this.user.hobbies;
            this.form.interests = this.user.interests;
            this.form.phone = this.user.phone;
        },

        methods:
	    {
	        handleFileUpload(){

	            // console.log(this.$refs.file);
		        this.file = this.$refs.file.files[0];
		        // this.file = this.file.target.files[0];
                // console.log(this.file);
	        },

	        sendAvatar(){
		        let formData = new FormData();
		        formData.append('timeline_id', this.user.timeline_id);
		        formData.append('timeline_type', 'user');
		        formData.append('change_avatar', this.file);

		        this.uploading = true;
		        axios.post(config.apiUrl + '/change-user-avatar', formData, {
			        headers: {
				        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
				        'Content-Type': 'multipart/form-data'
			        }
		        })
			        .then((response) => {
				        this.docUploaded = true;
				        this.file = null;
				        let user= response.data.user;
						let currentToken = this.$store.getters.currentUser.token;
				        let currentUser = Object.assign({}, user, {token: currentToken});
				        localStorage.setItem("user", JSON.stringify(currentUser));
                        this.$store.state.currentUser = currentUser;
				        this.href_avatar = user.avatar;
			        })
			        .catch((err) => {
				        console.log(err);
			        })
			        .finally(() => {
				        this.uploading = false;
			        });
	        },

            changeSettings()
			{
                this.sending = true;
                axios.post(config.apiUrl + '/change-user-settings', this.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
                    }
                })
                  .then((response) => {
                      this.SettingsSaved = true;
                      let user = response.data.user;
                      let currentToken = this.$store.getters.currentUser.token;
                      let currentUser = Object.assign({}, user, {token: currentToken});
                      localStorage.setItem("user", JSON.stringify(currentUser));
                      this.$store.state.currentUser = currentUser;
                  })
                  .catch((err) => {
                      console.log(err.response.data);
                  })
                  .finally(() => {
                      this.sending = false;
                  });
            },
        }
    };
</script>

<style>
	#avatar{
		height: 100px;
	}
</style>
