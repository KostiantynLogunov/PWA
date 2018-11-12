<template>
	<div>
		<form  class="md-layout" @submit.prevent="registration">
			<md-card class="md-layout-item md-size-50 md-small-size-100">
				<md-card-header>
					<div class="md-title">{{$lang.registerForm.create_account}}</div>
				</md-card-header>

				<md-card-content>

					<div class="md-layout md-gutter">
						<div class="md-layout-item md-size-50 md-small-size-50 ">
							<md-field>
								<label for="affiliate">{{$lang.registerForm.affiliate_code}} <small>({{$lang.registerForm.optional}})</small></label>
								<md-input type="affiliate" name="affiliate" id="affiliate" v-model="form.affiliate" :disabled="sending" />
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50">
							<md-field>
								<label for="email">{{$lang.registerForm.email}}</label>
								<md-input type="email" name="email" id="email" autocomplete="email" v-model="form.email" :disabled="sending" required/>
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50 ">
							<md-field >
								<label for="name">{{$lang.registerForm.name}}</label>
								<md-input name="name" id="name" autocomplete="name" v-model="form.name" :disabled="sending" required/>
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50">
							<md-field>
								<label>{{$lang.registerForm.gender}}</label>
								<md-select name="gender" id="gender" v-model="form.gender" md-dense :disabled="sending" required>
									<!--<md-option disabled>Select gander</md-option>-->
									<md-option value="male">{{$lang.registerForm.male}}</md-option>
									<md-option value="female">{{$lang.registerForm.famale}}</md-option>
									<md-option value="other">{{$lang.registerForm.none}}</md-option>
								</md-select>
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50">
							<md-field>
								<label for="username">{{$lang.registerForm.username}}</label>
								<md-input name="username" id="username" autocomplete="username" v-model="form.username" :disabled="sending" required/>
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50">
							<md-field>
								<label for="password">{{$lang.registerForm.password}}</label>
								<md-input type="password" name="password" id="password" autocomplete="password" v-model="form.password" :disabled="sending" required/>
							</md-field>
						</div>

						<div class="md-layout-item md-size-50 md-small-size-50">
							<md-field>
								<label for="phone">{{$lang.registerForm.phone}}</label>
								<md-input type="tel" name="phone" id="phone" autocomplete="phone" v-model="form.phone" :disabled="sending" required/>
							</md-field>
						</div>
					</div>
				</md-card-content>

				<div class="errors" v-if="createErrors">
					<ul>
						<li v-for="(fieldsError, fieldName) in createErrors" :key="fieldName">
							{{ fieldsError.join('\n') }}
						</li>
					</ul>
				</div>

				<md-progress-bar md-mode="indeterminate" v-if="sending" />

				<md-card-actions>
					<md-button type="submit" class="md-primary" :disabled="sending">{{$lang.registerForm.sign_and_login}}</md-button>
				</md-card-actions>
			</md-card>
		</form>
	</div>
</template>

<script>
	import validate from 'validate.js'
	import axios from 'axios'
	import {config} from '../../_services/config'


    export default {
        name: "Registration",

	    data() {
        	return {
		        form: {
			        affiliate: '',
			        name: null,
			        username: null,
			        gender: null,
			        email: null,
			        password: null,
			        phone: null,
			        inviteToken: null
		        },
		        sending: false,
		        createErrors: null,

		        newAccountCreated: false,

	        }
	    },

	    created(){
		    if (localStorage.getItem("inviteToken")){
			    this.form.inviteToken = localStorage.getItem("inviteToken");
		    }
	    },

	     methods: {
		     registration()
		     {
			     this.createErrors = null;

			     const constraints = this.getConstraints();

			     const errors = validate(this.form, constraints);

			     if (errors) {
				     this.createErrors = errors;
				     return ;
			     }
			     this.sending = true;


			     // send to api this.form.post
			     axios.post(config.apiUrl + '/auth/register_new_account', this.form)
				     .then((response) => {
					     this.$store.dispatch('login');
					     this.$store.commit("loginSuccess", response.data);
					     this.clearForm();
					     if (localStorage.getItem("inviteToken"))
						     localStorage.removeItem('inviteToken');

					     let res = response.data;
					     if (res.aboutInvite.status == 'go group')
					     {
						     console.log(res.aboutInvite.message);
						     this.$router.push({ name: 'someGroupAllPosts', params: { 'groupname': res.aboutInvite.group_alias }});
					     }
				         else if(res.aboutInvite.status == 'fail')
					     {
						     console.log(res.aboutInvite.message);
						     this.$router.push({path: '/'});
					     }
					     else
				             this.$router.push({path: '/'});
				     })
				     .catch((err) => {
					     /*let data_errors = [];
					     data_errors.push(err.message);
					     data_errors.push(err.response.data.message);
					     this.errors = data_errors;
					     console.log(this.errors);*/
					     console.log(err);
				     })
				     .finally(() => {
					     this.sending = false;
				     });
		     },

		     getConstraints(){
			     return {
				     name: {
					     presence: true,
					     length: {
						     minimum: 3,
						     message: 'Must be at least 3 characters long'
					     }
				     },
				     username: {
					     presence: true,
					     length: {
						     minimum: 5,
						     maximum: 25,
						     message: 'Must be at least 5 characters long and maximum 25 characters'
					     }
				     },
				     gender: {
					     presence: true,
					     length: {
						     minimum: 4,
						     maximum: 6,
						     message: 'Must be male or female or none'
					     }
				     },
				     email: {
					     presence: true,
					     email: true
				     },
				     password: {
					     presence: true,
					     length: {
						     minimum: 6,
						     message: 'Must be at least 6 characters long'
					     }
				     },
				     phone: {
					     presence: true,
					     length: {
						     minimum: 6,
						     message: 'Must be at least 6 characters long'
					     }
				     },
			     }
		     },

		     htmlEntities(str) {
			     return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
		     },

		     clearForm(){
			     this.form.affiliate = '';
			     this.form.name = null;
			     this.form.username = null;
			     this.form.gender = null;
			     this.form.email = null;
			     this.form.password = null;
			     this.form.phone = null;
			     this.form.inviteToken = null;
		     }
	     }
    }
</script>

<style scoped>
	.errors{
		color: orangered;
		padding: 21px 0 2px 0;
	}
</style>