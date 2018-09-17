<template>
    <div class="page-container md-layout-column">
        <form novalidate class="md-layout" @submit.prevent="createPost">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">What's going on ?</div>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field>
                                <md-textarea name="post" id="post" autocomplete="given-name" v-model="form.post" :disabled="sending" />
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
                    <md-button type="button" class="md-primary">Create event</md-button>
                    <md-button type="submit" class="md-primary md-raised" :disabled="sending">Post</md-button>
                </md-card-actions>
            </md-card>

            <md-snackbar :md-active.sync="postSaved">The user post was saved with success!</md-snackbar>
        </form>
        <br>
        <div class="alert alert-warning" v-if="groupPosts.length == 0">No posts were found...</div>
        <div v-for="post in groupPosts">
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>
                    <md-card-header>
                        <div class="md-title">
                            <img :src="avatarUrl + post.author.avatar_url[0].source" alt="avatar">
                            {{ post.author.name }}
                        </div>
                        <div class="md-subhead">Created {{ post.created_at }}</div>
                    </md-card-header>

                    <md-card-content>
                        {{ post.description }}
                    </md-card-content>

                    <md-card-actions>
                        <md-button><i class="far fa-thumbs-up"></i>
                            Like</md-button>
                        <md-button><i class="far fa-comment"></i>
                            Comment</md-button>
                    </md-card-actions>
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
            errors: null,
            groupPosts: false,
            avatarUrl: config.avatarUrl,
            showSidepanel: false,
            apiUrl: config.apiUrl
        }),
        mounted(){
            this.updatePosts();
        },

        methods: {
            updatePosts(){
                axios.get(config.apiUrl + '/group-posts/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
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
                        this.sending = false;
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

</style>