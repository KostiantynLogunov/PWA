<template>
    <div class="page-container md-layout-column">
        <div class="text-center" v-if="!creatingForm">
            <md-button type="submit" class="md-primary md-raised"  @click="creatingForm = true" :disabled="sending">Create CheckList</md-button>
        </div>
        <div v-else>
            <form novalidate class="md-layout" @submit.prevent="createCheckList" >
                <md-card class="md-layout-item md-size-50 md-small-size-100">
                    <md-card-header>
                        <div class="md-title">Creating CheckList</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <!--<md-field :class="getValidationClass('firstName')">-->
                                <md-field :class="">
                                    <label for="title">Title</label>
                                    <md-input name="title" id="title" autocomplete="given-name" v-model="form.title" :disabled="sending" />
                                </md-field>
                            </div>

                            <div class="md-layout-item md-small-size-100">
                                <md-field>
                                    <label for="description">Description</label>
                                    <md-textarea name="description" id="description" autocomplete="given-name" v-model="form.description" :disabled="sending" />
                                </md-field>
                            </div>

                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="members">Members</label>
                                    <md-input name="members" id="members" autocomplete="given-name" v-model="form.members" :disabled="sending" />
                                </md-field>
                            </div>

                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="event">Target Event</label>
                                    <md-input name="event" id="event" autocomplete="given-name" v-model="form.event" :disabled="sending" />
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
                        <md-button type="button" class="md-primary" @click="creatingForm = false">Cancel</md-button>
                        <md-button type="submit" class="md-primary md-raised" :disabled="sending">Create Checklist</md-button>
                    </md-card-actions>
                </md-card>

                <md-snackbar :md-active.sync="checklistSaved">The user saved Checklist successfull!</md-snackbar>
            </form>
        </div>

        <br>
        <div class="alert alert-warning" v-if="!groupChecklist">No Checklist yet....</div>
        <div v-for="checklist in groupChecklist">
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>
                    <md-card-header>
                        <div class="md-title">
                            <!--<span v-if="task.author.avatar_url[0]">
                                    <img :src="avatarUrl + task.author.avatar_url[0].source" alt="avatar">
                                </span>
                            <span v-else>
                                    <img :src="avatarDefaultUrl" alt="default">
                            </span>-->
                            {{ checklist.title }}
                        </div>
                    </md-card-header>

                    <md-card-content>
                        <h6>{{ checklist.description }}</h6>
                        <div v-if="checklist.responsible_user">
                            Responsible users: {{ checklist.responsible_user }}
                        </div>
                        <div v-else>
                            <div class="alert alert-warning">No responsable user !</div>
                        </div>
                        <div v-if="checklist.todolist">
                            <ul><b>Items:</b>
                                <li v-for="todo in checklist.todolist">
                                    <input type="checkbox" :checked="todo.check" disabled>
                                    {{ todo.todo }}
                                </li>
                            </ul>
                        </div>
                        <div class="md-layout-item md-layout md-gutter">
                            <div class="md-layout-item">
                                <span v-if="checklist.author">
                                    <img :src="checklist.author.avatar" alt="avatar">
                                </span>
                                <span v-else>
                                    <img :src="avatarDefaultUrl" alt="">
                                </span>
                                {{ checklist.author.name }} <br>
                                {{ convertDate(checklist.updated_at) | moment("from", "now") }}
                            </div>
                            <div class="md-layout-item">
                                <md-button class=""><i class="far fa-edit"></i>
                                    Edit</md-button>
                                <md-button class="md-accent"><i class="far fa-trash-alt"></i>
                                    Delete</md-button>
                            </div>
                        </div>
                    </md-card-content>

                    <md-card-actions>
                        <md-button @click="comenntsVisable = !comenntsVisable; comment = ''"><i class="far fa-comments"></i>
                            Comments</md-button>

                    </md-card-actions>
                    <md-card-content v-if="comenntsVisable">
                        <form novalidate class="md-layout" @submit.prevent="sendCommit">
                            <md-card class="md-layout-item md-size-50 md-small-size-100">
                                <md-card-content>
                                    <div class="md-layout md-gutter">
                                        <div class="md-layout-item md-small-size-100">
                                            <md-field :class="">
                                                <label for="title">Comment</label>
                                                <md-input name="comment" id="comment" autocomplete="given-name" v-model="comment" :disabled="sendingComment" />
                                            </md-field>
                                        </div>
                                    </div>

                                </md-card-content>
                            </md-card>
                        </form>

                        <br>
                        <div v-for="remark in checklist.remark">
                            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                                <md-ripple>
                                    <md-card-header>
                                        <div class="md-title">
                                            <span v-if="remark.user.avatar">
                                                <img :src="remark.user.avatar" alt="avatar">
                                            </span>
                                            <span v-else>
                                                <img :src="avatarDefaultUrl" alt="">
                                            </span>
                                            {{ remark.user.name }}
                                        </div>
                                        <div class="md-subhead">Created {{ remark.created_at }}</div>
                                    </md-card-header>

                                    <md-card-content class="comment-description">
                                        <h6>{{ remark.text }}</h6>
                                    </md-card-content>

                                    <md-card-actions>
                                        <md-button class="md-primary"><i class="far fa-thumbs-up"></i>
                                        </md-button>
                                        <md-button class="md-accent"><i class="fas fa-times"></i>
                                        </md-button>
                                    </md-card-actions>
                                </md-ripple>
                            </md-card>
                            <br>
                        </div>
                    </md-card-content>
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
        name: "someGroupChecklist",
        data: () => ({
            form: {
                title: '',
                description: '',
                members: '',
                event: '',
            },
            comment: '',
            sendingComment: false,
            creatingForm: false,
            checklistSaved: false,
            sending: false,
            errors: null,
            groupChecklist: false,
            avatarUrl: config.avatarUrl,
            apiUrl: config.apiUrl,
            avatarDefaultUrl: config.avatarDefaultUrl,
            comenntsVisable: false,
        }),
        mounted(){
            this.updateChecklist();
        },
        methods: {
            updateChecklist(){
                axios.get(config.apiUrl + '/group-checklists/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        if (response.data.group_checklist.length)
                            this.groupChecklist = response.data.group_checklist;
                        console.log(this.groupChecklist);
                    });
            },

            createCheckList() {

                console.log('creating new checklist....');

                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                this.sending = true;
                // send to api this.form.post
                /*axios.post(this.apiUrl + '/group-tasks/' + this.$route.params.groupname, this.$data.form, {
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
                    })*/
            },
            getConstraints(){
                return {
                    title: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                }
            },

            sendCommit() {
                console.log('sending comments...');
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
            },

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

    .comment-description{
        border: 1px solid lightblue;
        border-radius: 5px;
        padding: 5px;
        margin-left: 10px;
        margin-right: 10px;
    }

</style>