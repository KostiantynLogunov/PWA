<template>
	<div class="page-container md-layout-column">
		<!--SNACKBAR-->
		<md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbarPost" md-persistent>
			<span>{{$lang.messages.you_created_post}}</span>
			<md-button class="md-accent" @click="showSnackbar = false">{{$lang.buttons.close}}</md-button>
		</md-snackbar>
		<!--SNACKBAR-->

		<!--SNACKBAR-->
		<md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteComment" md-persistent>
			<span>{{$lang.messages.you_deleted_post}}</span>
			<md-button class="md-accent" @click="flagDeleteComment = false">{{$lang.buttons.close}}</md-button>
		</md-snackbar>
		<!--SNACKBAR-->

		<form novalidate class="md-layout" @submit.prevent="createPost">

			<md-card class="md-layout-item md-size-50 md-small-size-100" v-if="checkGroupAdmins(currentUser_id)">
				<md-card-header>
					<div class="md-title">{{$lang.groups.title_creating_post}}</div>
				</md-card-header>

				<md-card-content>
					<div class="md-layout md-gutter">
						<div class="md-layout-item md-small-size-100">
							<md-field>
								<md-textarea name="post" id="post" autocomplete="given-post" v-model="form.post" :disabled="sending"/>
							</md-field>
						</div>
					</div>

					<div class="errors" v-if="errors">
						<ul>
							<li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
								{{ fieldsError.join('\n') }}
							</li>
						</ul>
					</div>
				</md-card-content>

				<md-progress-bar md-mode="indeterminate" v-if="sending"/>

				<md-card-actions>
					<md-button type="button" class="md-primary" @click="CreateEvent">{{$lang.buttons.create_event}}</md-button>
					<md-button type="submit" class="md-primary md-raised" :disabled="sending">{{$lang.buttons.post}}</md-button>
				</md-card-actions>
			</md-card>

			<md-snackbar :md-active.sync="postSaved">{{$lang.messages.post_saved_success}}</md-snackbar>
		</form>

		<br>
		<div class="alert alert-warning" v-if="allActivity.length == 0">{{$lang.messages.no_posts_were_found}}</div>
		<md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"
		                     v-if="pandingResponseServer"></md-progress-spinner>
		<div v-for="post in allActivity" :key="post.id">
			<div v-if="post.type == 'event'">
				<one-event :event="post"></one-event>
			</div>
			<div v-if="post.type == 'task'">
				<one-task :task="post"></one-task>
			</div>
			<div v-if="post.type == 'checklist'">
				<one-checklist :checklist="post"></one-checklist>
			</div>
			<div v-if="post.type == 'service'">
				<one-services-request :service="post"></one-services-request>
			</div>
			<div v-if="post.type == null">
				<!--<one-post :post="activity"></one-post>-->
				<div>
					<md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
						<md-ripple>
							<md-card-header>
								<div class="md-title">
					                <span v-if="post.user">
					                    <img :src="post.user.avatar" alt="avatar">
					                </span>
									<span v-else>
					                  <img :src="avatarDefaultUrl" alt="default">
					                 </span>
									{{ post.user.name }}
								</div>
								<div class="md-subhead">
									{{ convertDate(post.created_at) | moment("from") }}
								</div>
							</md-card-header>

							<md-card-content>
								{{ post.description }}
							</md-card-content>

							<md-card-actions>
								<md-button class="md-primary" @click="likePost(post.id)" :disabled="liking"><i class="far fa-thumbs-up"></i>
									{{$lang.buttons.like}}
								</md-button>
								<md-button @click="turnComment(post.id)"><i class="far fa-comment"></i>
									{{$lang.buttons.comment}}
								</md-button>
							</md-card-actions>
							<transition name="boom">
								<md-card-content v-if="comenntsVisable.indexOf(post.id) >= 0">
									<form novalidate class="md-layout" @submit.prevent="">
										<md-card class="md-layout-item md-size-50 md-small-size-100">
											<md-card-content>
												<div class="md-layout md-gutter">
													<div class="md-layout-item md-small-size-100">
														<md-field :class="">
															<label for="comment">{{$lang.buttons.comment}}</label>
															<md-input @keyup.enter="sendComment(post.id)" name="comment" id="comment"
															          autocomplete="given-comment" v-model="formComment.comment"
															          :disabled="sendingComment"/>
														</md-field>
													</div>
												</div>
												<div class="errors" v-if="errorsComment">
													<ul>
														<li v-for="(fieldsError, fieldName) in errorsComment" :key="fieldName">
															{{ fieldsError.join('\n') }}
														</li>
													</ul>
												</div>
											</md-card-content>
										</md-card>
									</form>

									<br>
									<div v-for="comment in post.comments">
										<md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
											<md-ripple>
												<md-card-header>
													<div class="md-title">
							                            <span v-if="comment.user.avatar">
							                                <img :src="comment.user.avatar" alt="avatar">
							                            </span>
																					<span v-else>
							                                <img :src="avatarDefaultUrl" alt="">
							                            </span>
														{{ comment.user.name }}
													</div>
													<div class="md-subhead">{{ convertDate(comment.created_at) | moment("from") }}</div>
												</md-card-header>

												<md-card-content class="comment-description">
													<h6>{{ comment.description }}</h6>
												</md-card-content>

												<md-card-actions>
													<md-button class="md-primary"><i class="far fa-thumbs-up"></i></md-button>
													<span v-if="checkAuthor(comment.user_id) || checkGroupAdmins(currentUser_id)">
                                                        <md-button class="md-accent" @click="deleteComment(comment.id)"><i class="fas fa-times"></i></md-button>
                                                    </span>
													<md-button><i class="far fa-share-square"></i></md-button>
												</md-card-actions>
											</md-ripple>
										</md-card>
										<br>
									</div>
								</md-card-content>
							</transition>
						</md-ripple>
					</md-card>
					<br>
				</div>
			</div>
			<br>
		</div>


	</div>
</template>

<script>
	import validate from 'validate.js'
	import axios from 'axios'
	import {config} from '../../_services/config'

	import OneEvent from '../home/OneEvent'
	import OneTask from '../home/OneTask'
	import OneChecklist from '../home/OneChecklist'
	import OneServicesRequest from '../home/OneServicesRequest'

	export default {
		name: "someGroupPosts",

		components: {
			OneEvent, OneTask, OneChecklist, OneServicesRequest
		},

		data: () => ({
			form: {
				post: '',
			},
			postSaved: false,
			sending: false,
			liking: false,
			errors: null,
			groupPosts: false,
			allActivity: [],

			showSnackbarPost: false,
			flagDeleteComment: false,
			position: 'center',
			duration: 4000,

			avatarUrl: config.avatarUrl,
			showSidepanel: false,
			apiUrl: config.apiUrl,
			avatarDefaultUrl: config.avatarDefaultUrl,

			comenntsVisable: [],
			sendingComment: false,
			formComment: {
				comment: '',
				post_id: '',
			},
			errorsComment: null,

			pandingResponseServer: false,

			currentUser_id: null,
			groupAdminsID: [],
		}),
		mounted() {
			this.updatePosts();
			this.currentUser_id = this.$store.getters.currentUser.id;
		},

		methods: {

			deleteComment(comment_id){
				if( !confirm('Are you sure to delete comment ?') ) return;

				axios.delete(config.apiUrl + '/comment_delete/' + comment_id, {
					headers: {
						"Authorization": `Bearer ${this.$store.getters.currentUser.token}`
					}
				})
					.then((response) => {
						this.flagDeleteComment = true;
						this.updatePosts();
					})
					.catch((err) => {
						/*let data_errors = [];
						data_errors.push(err.message);
						data_errors.push(err.response.data.message);
						this.deleteErrors = data_errors;*/
						console.log(err);
					})
					.finally(() => {
						// this.deleteProcess = false;
					});
			},

			checkAuthor(user_id) {
				return this.currentUser_id == user_id;
			},

			checkGroupAdmins(user_id) {
				return this.groupAdminsID.indexOf(user_id) >= 0;
			},

			CreateEvent() {
				this.$router.push({name: 'newEvent'})
			},

			updatePosts() {
				this.pandingResponseServer = true;
				axios.get(config.apiUrl + '/group-all-posts/' + this.$route.params.groupname, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.currentUser.token}`
					}
				})
					.then((response) => {
						this.pandingResponseServer = false;

						this.allActivity = response.data.activity;
						this.allActivity = this.allActivity.reverse();

						// this.groupPosts = response.data.groupPosts;
						this.groupAdminsID = response.data.admins_id;
					})
					.catch((err) => {
						this.errors = err.response.data.message || err.response.data || err.message || err.data;
						console.log(this.errors);
					});
			},

			createPost() {

				this.errors = null;

				const constraints = this.getConstraints();

				const errors = validate(this.$data.form, constraints);

				if (errors) {
					this.errors = errors;
					return;
				}

				this.sending = true;
				// send to api this.form.post
				axios.post(this.apiUrl + '/group-posts/' + this.$route.params.groupname, this.$data.form, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.currentUser.token}`
					}
				})
					.then((response) => {
						this.form.post = '';
						this.showSnackbarPost = true;
						this.updatePosts();
					})
					.catch((err) => {
						this.errors = err.response.data.message || err.response.data || err.message || err.data;
						console.log(this.errors);
					})
					.finally(() => {
						this.sending = false;
					});
			},

			getConstraints() {
				return {
					post: {
						presence: true,
						length: {
							minimum: 5,
							message: 'Must be at least 5 characters long'
						}
					},
				}
			},

			convertDate(datetimeString) {
				let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
				let currentTZ = this.$moment(utcTZ.valueOf());
				return currentTZ;
			},

			likePost(post_id) {
				// this.liking = true;
				axios.put(config.apiUrl + '/like-post/' + post_id, [], {
					headers: {
						"Authorization": `Bearer ${this.$store.state.currentUser.token}`
					}
				})
					.then((response) => {
						// this.liking = false;
						console.log(response);
					})
					.catch((err) => {
						this.errorsComment = err.response.data.message || err.response.data || err.message || err.data;
						console.log(this.errorsComment);
					})
			},

			validateComment() {
				return {
					comment: {
						presence: true,
						length: {
							minimum: 2,
							message: 'Must be at least 2 characters long'
						}
					},
				}
			},

			sendComment(post_id) {
				this.formComment.comment = this.htmlEntities(this.formComment.comment);

				this.errorsComment = null;

				const constraints = this.validateComment();

				const errors = validate(this.$data.formComment, constraints);

				if (errors) {
					this.errorsComment = errors;
					return;
				}


				this.sendingComment = true;
				this.formComment.post_id = +post_id;
				// send to api this.form.post
				axios.post(this.apiUrl + '/post-comment', this.formComment, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.currentUser.token}`
					}
				})
					.then((response) => {
						this.formComment.comment = '';
						this.updatePosts();
					})
					.catch((err) => {
						this.errorsComment = err.response.data.message || err.response.data || err.message || err.data;
						console.log(this.errorsComment);
					})
					.finally(() => {
						this.sendingComment = false;
					});
			},

			turnComment(post_id) {
				if (this.comenntsVisable.indexOf(post_id) >= 0) {
					this.comenntsVisable.splice(this.comenntsVisable.indexOf(post_id), 1)
				} else {
					this.comenntsVisable.push(post_id)
				}
			},

			htmlEntities(str) {
				return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos');
			}
		}
	}
</script>

<style scoped>
	md-progress-bar {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
	}

	.errors {
		/*background: lightcoral;*/
		color: orangered;
		border-radius: 5px;
		padding: 21px 0 2px 0;
	}

	li {
		list-style: none;
	}

	md-card {
		/*margin: 20px;*/
		/*padding: 20px;*/
	}

	img {
		height: 40px;
		padding-right: 10px;
	}

	.boom-enter-active {
		animation: slideIn 0.5s;
	}

	.boom-leave-active {
		animation: slideOut 0.5s;
	}

	@keyframes slideIn {
		from {
			transform: translateX(-1000px)
		}
		to {
			transform: translateX(0px)
		}
	}

	@keyframes slideOut {
		from {
			transform: translateX(0px)
		}
		to {
			transform: translateX(-2000px)
		}
	}

</style>
