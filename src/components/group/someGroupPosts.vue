<template>
    <div class="page-container md-layout-column">
        <form novalidate class="md-layout" @submit.prevent="createPost">
            <!--SNACKBAR-->
            <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbarPost" md-persistent>
                <span>You created new post!</span>
                <md-button class="md-accent" @click="showSnackbar = false">Close</md-button>
            </md-snackbar>
            <!--SNACKBAR-->
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

            <md-snackbar :md-active.sync="postSaved">The user post was saved with success!</md-snackbar>
        </form>
        <br>
        <div class="alert alert-warning" v-if="groupPosts.length == 0">No posts were found...</div>
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        <div v-for="post in groupPosts" :key="post.id">
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
                                            <md-button class="md-accent"><i class="fas fa-times"></i></md-button>
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
            groupPosts: false,

            showSnackbarPost: false,
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

            pandingResponseServer: false
        }),
        mounted(){
            this.updatePosts();
        },

        methods: {
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
                        this.sending = false;
                        this.showSnackbarPost = true;
                        this.updatePosts();
                    })
                    .catch((err) => {
                        let errorMessage = err.response.data.message || err.message;
                        this.errors = err.response.data;
                        this.sending = false ;
                        console.log(errorMessage);
                    })
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

            createEvent(){
                console.log('createEvent')
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
                        let errorMessage = err.response.data.message || err.message;
                        // this.liking = false ;
                        console.log(errorMessage);
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
                        this.sendingComment = false;
                        this.updatePosts();
                    })
                    .catch((err) => {
                        let errorMessage = err.response.data.message || err.message;
                        this.errors = err.response.data;
                        this.sendingComment = false ;
                        console.log(errorMessage);
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

    .errors{
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

</style>