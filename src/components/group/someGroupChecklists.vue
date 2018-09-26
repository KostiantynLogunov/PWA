<template>
    <div class="page-container md-layout-column">
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
            <span>You added a new CheckList !</span>
            <md-button class="md-accent" @click="showSnackbar = false">Close</md-button>
        </md-snackbar>

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
                                <md-field>
                                    <label for="title">Title</label>
                                    <md-input name="title" id="title" autocomplete="title" v-model="form.title" :disabled="sending" />
                                </md-field>

                                <md-field>
                                    <label for="description">Description</label>
                                    <md-textarea name="description" id="description" autocomplete="description" v-model="form.description" :disabled="sending" />
                                </md-field>


                                <div class="text-center w-100">
                                    <div class="viewport">
                                        <h6>To Do List</h6>
                                        <input v-model="newTodo" :disabled="sending" />
                                        <md-button class="md-icon-button md-list-action" @click="AddTodo(newTodo)" >
                                            <md-icon class="md-primary" >
                                                <i class="fas fa-plus-circle"></i>
                                            </md-icon>
                                        </md-button>

                                        <md-list>
                                            <md-list-item v-for="(todo, key, index) in form.todolist"
                                                          :key="key">
                                                <span class="w-100"
                                                      v-on:click="todo.check = !todo.check"
                                                      :style="todo.check ? 'text-decoration: line-through' : ''"
                                                >
                                                    {{ todo.todo }}
                                                    </span>

                                                <md-button class="md-icon-button md-list-action" @click="deleteTodo(key)">
                                                    <md-icon class="md-accent" ><i class="fas fa-times-circle"></i></md-icon>
                                                </md-button>
                                            </md-list-item>
                                        </md-list>
                                    </div>
                                </div>
                            </div>

                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="members">Members</label>
                                    <md-input name="members" id="members" autocomplete="members" v-model="form.responsible_user" :disabled="sending" />
                                </md-field>

                                <md-field :class="">
                                    <label>Target Event</label>
                                    <md-select name="event" id="event" v-model="form.target_event" md-dense :disabled="sending" placeholder="Please choose event">

                                        <div v-if="group_events.length">
                                            <div v-for="group_event in group_events">
                                                <md-option :value="group_event.timeline.name">
                                                    {{ group_event.timeline.name }}
                                                </md-option>
                                            </div>

                                        </div>
                                        <div v-else>
                                            <md-option  value="" disabled>
                                                Not any events
                                            </md-option>
                                        </div>
                                    </md-select>
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
        <div class="alert alert-warning" v-if="!groupChecklist">No Checklist yet....
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>
        <div v-for="checklist in groupChecklist">
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>
                    <md-card-header>
                        <div class="md-title">
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
                        <md-button @click="turnComment(checklist.id)"><i class="far fa-comments"></i>
                            Comments</md-button>

                    </md-card-actions>
                    <transition name="boom">
                        <md-card-content v-if="comenntsVisable.indexOf(checklist.id) >= 0">
                            <form novalidate class="md-layout" @submit.prevent="">
                                <md-card class="md-layout-item md-size-50 md-small-size-100">
                                    <md-card-content>
                                        <div class="md-layout md-gutter">
                                            <div class="md-layout-item md-small-size-100">
                                                <md-field :class="">
                                                    <label for="comment">Comment</label>
                                                    <md-input name="comment" id="comment" @keyup.enter="sendComment(checklist.id)" autocomplete="given-comment" v-model="formComment.comment" :disabled="sendingComment" />
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
                                            <div class="md-subhead">{{ convertDate(remark.created_at) | moment("from") }}</div>
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
        name: "someGroupChecklist",
        data: () => ({
            form: {
                title: '',
                description: '',
                todolist: {},
                responsible_user: '',
                target_event: '',
            },
            group_events: null,
            alrDateIterator: 0,
            newTodo: null,

            showSnackbar: false,
            position: 'center',
            duration: 4000,


            creatingForm: false,
            checklistSaved: false,
            sending: false,
            errors: null,
            groupChecklist: false,
            avatarUrl: config.avatarUrl,
            apiUrl: config.apiUrl,
            avatarDefaultUrl: config.avatarDefaultUrl,

            sendingComment: false,
            comenntsVisable: [],
            formComment: {
                comment: '',
                checklist_id: '',
                type: 'checklist'
            },
            errorsComment: null,

            pandingResponseServer: false
        }),
        mounted(){
            this.updateChecklist();
        },
        methods: {
            AddTodo(newTodo){
                if (!newTodo) return;

                this.$set(this.form.todolist,this.alrDateIterator, '');
                let oneTodo = {
                    todo: newTodo,
                    check: false
                };
                this.form.todolist[this.alrDateIterator] = oneTodo;
                this.alrDateIterator++;
                this.newTodo = null;
            },
            deleteTodo(key){
                this.$delete(this.form.todolist,key);
            },
            updateChecklist(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-checklists/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.pandingResponseServer = false;
                        if (response.data.group_checklist.length)
                            this.groupChecklist = response.data.group_checklist;
                        this.group_events = response.data.group_events;
                    });
            },

            createCheckList() {

                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                this.pandingResponseServer = true;
                this.sending = true;
                // send to api this.form.post
                axios.post(this.apiUrl + '/group-checklists/' + this.$route.params.groupname, this.$data.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.showSnackbar = true;
                        this.creatingForm = false;
                        this.clearForm();
                        this.updateChecklist();
                    })
                    .catch((err) => {
                        // let errorMessage = err.response.message || err.message;
                        // this.errors = err.response.data;
                        console.log(err);
                    })
                    .finally(() => {
                        this.sending = false;
                        this.pandingResponseServer = false;
                    })
            },

            sendComment(checklist_id) {

                this.errorsComment = null;

                const constraints = this.validateComment();

                const errors = validate(this.$data.formComment, constraints);

                if (errors) {
                    this.errorsComment = errors;
                    return ;
                }


                this.sendingComment = true;
                this.formComment.checklist_id = +checklist_id;
                // send to api this.form.post
                axios.post(this.apiUrl + '/task-comment', this.formComment, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.formComment.comment = '';

                        this.updateChecklist();
                    })
                    .catch((err) => {
                        let errorMessage = err.response.data.message || err.message;
                        this.errors = err.response.data;
                        console.log(errorMessage);
                    })
                    .finally(() => {
                        this.sendingComment = false;
                    });
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
                    description: {
                        presence: true,
                        length: {
                            minimum: 10,
                            message: 'Must be at least 10 characters long'
                        }
                    },
                }
            },

            turnComment(task_id) {
                if (this.comenntsVisable.indexOf(task_id) >= 0) {
                    this.comenntsVisable.splice(this.comenntsVisable.indexOf(task_id), 1)
                } else {
                    this.comenntsVisable.push(task_id)
                }
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
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

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },

            clearForm(){
                this.form.title = '';
                this.form.description = '';
                this.form.todolist = {};
                this.form.responsible_user = '';
                this.form.target_event = '';
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

    .comment-description{
        border: 1px solid lightblue;
        border-radius: 5px;
        padding: 5px;
        margin-left: 10px;
        margin-right: 10px;
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

    .viewport {
        width: 220px;
        max-width: 100%;
        display: inline-block;
        vertical-align: top;
        overflow: auto;
        border: 1px solid rgba(#000, .12);
    }

</style>