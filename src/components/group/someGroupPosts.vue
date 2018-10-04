<template>
    <div class="page-container md-layout-column">
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="showSnackbarPost" md-persistent>
            <span>You created new post!</span>
            <md-button class="md-accent" @click="showSnackbarPost = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeletePost" md-persistent>
            <span>You deleted post successfull!</span>
            <md-button class="md-accent" @click="flagDeletePost = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="updatedPost" md-persistent>
            <span>You updated new post!</span>
            <md-button class="md-accent" @click="updatedPost = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <div v-if="checkGroupAdmins(currentUser_id)" >
        <form novalidate class="md-layout" @submit.prevent="createPost">

            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">What's going on ?</div>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field>
                                <md-textarea name="post" id="post" autocomplete="given-post" v-model="form.post" :disabled="sending" />
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

                <md-progress-bar md-mode="indeterminate" v-if="sending" />

                <md-card-actions>
                    <md-button type="button" class="md-primary" @click="CreateEvent">Create event</md-button>
                    <md-button type="submit" class="md-primary md-raised" :disabled="sending">Post</md-button>
                </md-card-actions>
            </md-card>
        </form>
        </div>
        <br>

        <div class="alert alert-warning" v-if="groupPosts.length == 0">No posts were found...</div>
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        <div v-for="post in groupPosts" :key="post.id">
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>
                    <div v-if="deletingPost == post.id">
                        <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="deletingPost != 0" />
                    </div>
                    <md-card-header>
                        <div class="md-title">
                            <md-list-item>
                                <div>
                                    <span v-if="post.user">
                                        <img :src="post.user.avatar" alt="avatar">
                                    </span>
                                    <span v-else>
                                        <img :src="avatarDefaultUrl" alt="default">
                                    </span>

                                    {{ post.user.name }}
                                </div>

                                <div class="deleteErrors" v-if="deleteErrors">
                                    <p v-for="error in deleteErrors">{{ error }}</p>
                                </div>

                                <md-dialog :md-active.sync="editingPost">
                                    <md-progress-bar md-mode="indeterminate" v-show="processingPost" />

                                    <form novalidate class="md-layout" @submit.prevent="editPost(value_edit_post.id)">
                                        <md-dialog-title>Editing post</md-dialog-title>
                                        <div class="md-layout-item md-small-size-100">
                                            <md-field>
                                                <md-textarea name="post" v-model="value_edit_post.post" :disabled="processingPost" />
                                            </md-field>
                                        </div>

                                        <div class="deleteErrors" v-if="updateErrors">
                                            <p v-for="error in updateErrors">{{ error }}</p>
                                        </div>

                                        <div class="errors" v-if="editErrors">
                                            <ul>
                                                <li v-for="(fieldsError, fieldName) in editErrors" :key="fieldName">
                                                    {{ fieldsError.join('\n') }}
                                                </li>
                                            </ul>
                                        </div>

                                        <md-dialog-actions>
                                            <md-button :disabled="processingPost" class="md-primary" @click="CancelEditingPost()">Close</md-button>
                                            <md-button :disabled="processingPost"
                                                       type="submit"
                                                       class="md-accent md-raised"
                                            >Update</md-button>
                                        </md-dialog-actions>
                                    </form>
                                </md-dialog>
                                <div v-if="checkAuthor(post.user_id) || checkGroupAdmins(currentUser_id)">
                                    <md-menu md-size="small" md-align-trigger>
                                        <md-button class="md-icon-button md-list-action" md-menu-trigger>
                                            <md-icon class="md-primary"><i class="fas fa-angle-down"></i></md-icon>
                                        </md-button>

                                        <md-menu-content>
                                            <md-menu-item @click="onFormUpdatePost(post.id, post.description)" :disabled="processingPost"><span><i class="far fa-edit"></i> Edit</span></md-menu-item>
                                            <md-menu-item @click="deletePost(post.id)" :disabled="deletingPost != 0"><span><i class="fas fa-trash"></i> Delete</span></md-menu-item>
                                        </md-menu-content>
                                    </md-menu>
                                </div>

                            </md-list-item>
                        </div>
                        <div class="md-subhead">
                            {{ convertDate(post.updated_at) | moment("from") }}
                        </div>
                    </md-card-header>

                    <md-card-content>
                        {{ post.description }}
                    </md-card-content>

                    <md-card-actions>
                        <md-button class="md-primary" @click="likePost(post.id)" :disabled="liking"><i class="far fa-thumbs-up"></i>
                            Like</md-button>
                        <md-button @click="turnComment(post.id)"><i class="far fa-comment"></i>
                            Comment</md-button>
                    </md-card-actions>

                    <transition name="boom">
                        <md-card-content v-if="comenntsVisable.indexOf(post.id) >= 0">
                            <form novalidate class="md-layout" @submit.prevent="">
                                <md-card class="md-layout-item md-size-50 md-small-size-100">
                                    <md-card-content>
                                        <div class="md-layout md-gutter">
                                            <div class="md-layout-item md-small-size-100">
                                                <md-field :class="">
                                                    <label for="comment">Comment</label>
                                                    <md-input @keyup.enter="sendComment(post.id)" name="comment" id="comment" autocomplete="given-comment" v-model="formComment.comment" :disabled="sendingComment" />
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
                                                <md-button class="md-accent"><i class="fas fa-times"></i></md-button>
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
</template>

<script>
    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupPosts",
        data: () => ({
            form: {
                post: '',
            },
            postSaved: false,
            sending: false,
            liking: false,
            errors: null,
            deleteErrors: false,
            groupPosts: false,

            showSnackbarPost: false,
            position: 'left',
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

            deletingPost: 0,
            flagDeletePost: false,
            editingPost: false,
            value_edit_post: {
                post: '',
                id: null,
            },
            editErrors: null,
            updatedPost: false,
            processingPost: false,
            updateErrors: null,
        }),
        mounted(){
            this.updatePosts();
            this.currentUser_id = this.$store.getters.currentUser.id;
        },

        methods: {
            CancelEditingPost(){
                this.editingPost = false;
                this.value_edit_post.post = '';
            },

            onFormUpdatePost(id, description){
                this.editingPost = true;
                this.value_edit_post.id = id;
                this.value_edit_post.post = description;
            },

            editPost(post_id){
                this.editErrors = null;
                const constraints = this.getConstraints();
                const errors = validate(this.$data.value_edit_post, constraints);
                if (errors) {
                    this.editErrors = errors;
                    return ;
                }
                this.processingPost = true;

                this.value_edit_post.post = this.htmlEntities(this.value_edit_post.post);

                axios.put(config.apiUrl + '/group-posts/' + post_id, this.$data.value_edit_post, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.updatePosts();
                        this.updatedPost = true;
                        this.CancelEditingPost();
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.updateErrors = data_errors;
                        // console.log(this.updateErrors);
                    })
                    .finally(() => {
                        this.processingPost = false;
                    });

            },

            deletePost(post_id){
                this.deletingPost = post_id;
                axios.delete(config.apiUrl + '/group-posts/' + post_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.updatePosts();
                        this.flagDeletePost = true;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.deleteErrors = data_errors;
                        console.log(this.deleteErrors);
                    })
                    .finally(() => {
                        this.deletingPost = 0;
                    });
            },

            checkAuthor(user_id){
                return this.currentUser_id == user_id;
            },

            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            CreateEvent(){
                this.$router.push({ name: 'newEvent'})
            },

            updatePosts(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-posts/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.pandingResponseServer = false;
                        this.groupPosts = response.data.groupPosts;
                        this.groupAdminsID = response.data.admins_id;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    });
            },

            createPost() {

                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
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
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.sending = false ;
                    });
            },

            getConstraints(){
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
                        this.errorsComment = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errorsComment);
                    })
            },

            validateComment(){
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
                console.log('sending comments...');
                this.formComment.comment = this.htmlEntities(this.formComment.comment);

                this.errorsComment = null;

                const constraints = this.validateComment();

                const errors = validate(this.$data.formComment, constraints);

                if (errors) {
                    this.errorsComment = errors;
                    return ;
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
                        this.errorsComment = err.response.data.message || err.response.data ||  err.message || err.data;
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
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
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

    .errors, .deleteErrors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
    li {
        list-style: none;
    }
    md-card{
        margin: 20px;
        padding: 20px;
    }
    img{
        height: 40px;
        padding-right: 10px;
    }

    .boom-enter-active{
        animation: slideIn 0.5s;
    }

    .boom-leave-active{
        animation: slideOut 0.5s;
    }

    @keyframes slideIn {
        from {transform: translateX(-1000px)}
        to {transform: translateX(0px)}
    }
    @keyframes slideOut {
        from {transform: translateX(0px)}
        to {transform: translateX(-2000px)}
    }

    .md-menu-item:hover{
        cursor: pointer;
        background: lightgrey;
    }
    .md-dialog{
        padding-right: 5px;
        padding-left: 5px;
        /*margin: 20px;*/
    }
</style>