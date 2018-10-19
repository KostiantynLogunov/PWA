<template>
    <div class="page-container md-layout-column">
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"
                             v-if="pandingResponseServer"></md-progress-spinner>
        <div class="alert alert-warning" v-if="allActivity.length == 0">No posts were found...

        </div>

        <!--<div v-for="post in Activity" :key="post.id">-->
        <!--<md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">-->
        <!--<md-ripple>-->

        <!--<md-card-header>-->
        <!--<div class="md-title">-->

        <!--<span v-if="post.user">-->
        <!--<img :src="post.user.avatar" alt="avatar">-->
        <!--</span>-->
        <!--<span v-else>-->
        <!--<img :src="avatarDefaultUrl" alt="default">-->
        <!--</span>-->

        <!--{{ post.user.name }}-->
        <!--</div>-->
        <!--<div class="md-subhead">-->
        <!--{{ convertDate(post.created_at) | moment("from") }}-->
        <!--</div>-->
        <!--</md-card-header>-->

        <!--<md-card-content>-->
        <!--{{ post.description }}-->
        <!--</md-card-content>-->

        <!--<md-card-actions>-->
        <!--<md-button class="md-primary" @click="likePost(post.id)" :disabled="liking"><i class="far fa-thumbs-up"></i>-->
        <!--Like-->
        <!--</md-button>-->
        <!--<md-button @click="turnComment(post.id)"><i class="far fa-comment"></i>-->
        <!--Comment-->
        <!--</md-button>-->
        <!--</md-card-actions>-->
        <!--<transition name="boom">-->
        <!--<md-card-content v-if="comenntsVisable.indexOf(post.id) >= 0">-->
        <!--<form novalidate class="md-layout" @submit.prevent="">-->
        <!--<md-card class="md-layout-item md-size-50 md-small-size-100">-->
        <!--<md-card-content>-->
        <!--<div class="md-layout md-gutter">-->
        <!--<div class="md-layout-item md-small-size-100">-->
        <!--<md-field :class="">-->
        <!--<label for="comment">Comment</label>-->
        <!--<md-input @keyup.enter="sendComment(post.id)" name="comment" id="comment"-->
        <!--autocomplete="given-comment" v-model="formComment.comment"-->
        <!--:disabled="sendingComment"/>-->
        <!--</md-field>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="errors" v-if="errorsComment">-->
        <!--<ul>-->
        <!--<li v-for="(fieldsError, fieldName) in errorsComment" :key="fieldName">-->
        <!--{{ fieldsError.join('\n') }}-->
        <!--</li>-->
        <!--</ul>-->
        <!--</div>-->
        <!--</md-card-content>-->
        <!--</md-card>-->
        <!--</form>-->

        <!--<br>-->
        <!--<div v-for="comment in post.comments">-->
        <!--<md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">-->
        <!--<md-ripple>-->
        <!--<md-card-header>-->
        <!--<div class="md-title">-->
        <!--<span v-if="comment.user.avatar">-->
        <!--<img :src="comment.user.avatar" alt="avatar">-->
        <!--</span>-->
        <!--<span v-else>-->
        <!--<img :src="avatarDefaultUrl" alt="">-->
        <!--</span>-->
        <!--{{ comment.user.name }}-->
        <!--</div>-->
        <!--<div class="md-subhead">{{ convertDate(comment.created_at) | moment("from") }}</div>-->
        <!--</md-card-header>-->

        <!--<md-card-content class="comment-description">-->
        <!--<h6>{{ comment.description }}</h6>-->
        <!--</md-card-content>-->

        <!--<md-card-actions>-->
        <!--<md-button class="md-primary"><i class="far fa-thumbs-up"></i></md-button>-->
        <!--<span v-if="checkAuthor(comment.user_id) || checkGroupAdmins(currentUser_id)">-->
        <!--<md-button class="md-accent"><i class="fas fa-times"></i></md-button>-->
        <!--</span>-->
        <!--<md-button><i class="far fa-share-square"></i></md-button>-->
        <!--</md-card-actions>-->
        <!--</md-ripple>-->
        <!--</md-card>-->
        <!--<br>-->
        <!--</div>-->
        <!--</md-card-content>-->
        <!--</transition>-->
        <!--</md-ripple>-->
        <!--</md-card>-->
        <!--<br>-->
        <!--</div>-->
    </div>
</template>

<script>

    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        data() {
            return {
                pandingResponseServer: false,
                allActivity: []
            }
        },

        mounted() {
            this.getActivity()
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser;
            }
        },

        methods: {
            getActivity() {
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/groups_activity/', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        console.log(response.data);
                        this.allActivity = response.data.activity;
                        this.pandingResponseServer = false;

                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },
    };
</script>
