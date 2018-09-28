<template>
    <div class="page-container md-layout-column">
        <div class="text-center" v-if="!creatingForm">
            <md-button type="submit" class="md-primary md-raised"  @click="creatingForm = true" :disabled="sending">Create Task</md-button>
        </div>
        <div v-else>
            <form novalidate class="md-layout" @submit.prevent="createTask" >
                <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
                    <span>You added new task !</span>
                    <md-button class="md-accent" @click="showSnackbar = false">Close</md-button>
                </md-snackbar>
                <md-card class="md-layout-item md-size-50 md-small-size-100">
                    <md-card-header>
                        <div class="md-title">Creating Task</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="title">Title</label>
                                    <md-input name="title" id="title" autocomplete="given-title" v-model="form.title" :disabled="sending" />
                                </md-field>

                                <md-field>
                                    <label for="description">Description</label>
                                    <md-textarea name="description" id="description" autocomplete="given-description" v-model="form.description" :disabled="sending" />
                                </md-field>

                                <md-field :class="">
                                    <label>Status</label>
                                    <md-select name="status" id="status" v-model="form.status" md-dense :disabled="sending" placeholder="Please select status">
                                        <md-option value="New">New</md-option>
                                        <md-option value="In progress">In progress</md-option>
                                        <md-option value="Complated">Complated</md-option>
                                        <md-option value="Postponed">Postponed</md-option>
                                    </md-select>
                                </md-field>
                            </div>

                            <div class="md-layout-item md-small-size-100">


                                    <div class="md-layout md-gutter">
                                            <div class="md-layout-item md-small-size-50">
                                                <label>START DATE</label>
                                                <date-picker v-model="form.start_date" :config="options"></date-picker>
                                            </div>
                                        <div class="md-layout-item md-small-size-50">
                                            <label>END DATE</label>
                                            <date-picker v-model="form.end_date" :config="options"></date-picker>
                                        </div>
                                    </div>


                                <div class="md-layout-item md-small-size-100">
                                    <md-field :class="">
                                        <label for="members">Members</label>
                                        <md-input name="members" id="members" autocomplete="given-members" v-model="form.members" :disabled="sending" />
                                    </md-field>
                                </div>

                                <div class="md-layout-item md-small-size-100">
                                    <md-field :class="">
                                        <label>Target Event</label>
                                        <md-select name="event" id="event" v-model="form.event" md-dense :disabled="sending">

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
                        <md-button type="submit" class="md-primary md-raised" :disabled="sending">Create Task</md-button>
                    </md-card-actions>
                </md-card>
                <md-snackbar :md-active.sync="taskSaved">The user saved task successfull!</md-snackbar>
            </form>
        </div>

        <br>

        <div class="alert alert-warning" v-if="!groupTasks.length">No tasks yet....
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>
        <div v-for="task in groupTasks">
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
                            {{ task.title }}
                        </div>
                        <div class="md-subhead">Status: {{ task.status }}&nbsp;&nbsp;
                            <span><i class="far fa-calendar-alt"></i>&nbsp;{{ task.time_from }}&nbsp;-&nbsp;{{ task.time_till }}</span>
                        </div>
                    </md-card-header>

                    <md-card-content>
                        <h6>{{ task.description }}</h6>
                        <br>
                        <div v-if="task.responsible_user">
                            Responsible users: {{ task.responsible_user }}
                        </div>
                        <div v-else>
                            <div class="alert alert-warning">No responsable user !</div>
                        </div>
                        <br>
                        <div class="">
                            <span v-if="task.user.avatar">
                                <img :src="task.user.avatar" alt="avatar">
                            </span>
                            <span v-else>
                                <img :src="avatarDefaultUrl" alt="">
                            </span>
                            {{ task.user.name }}
                            <div class="md-subhead">{{ convertDate(task.created_at) | moment("from") }}</div>
                        </div>
                    </md-card-content>

                    <md-card-actions>
                        <md-button @click="turnComment(task.id)"><i class="far fa-comments"></i>
                                Comments</md-button>
                        <md-button class=""><i class="far fa-edit"></i>
                            Edit</md-button>
                        <md-button class="md-accent"><i class="far fa-trash-alt"></i>
                            Delete</md-button>
                    </md-card-actions>
                    <transition name="boom">
                        <md-card-content v-if="comenntsVisable.indexOf(task.id) >= 0">
                            <form novalidate class="md-layout" @submit.prevent="">
                                <md-card class="md-layout-item md-size-50 md-small-size-100">
                                    <md-card-content>
                                        <div class="md-layout md-gutter">
                                            <div class="md-layout-item md-small-size-100">
                                                <md-field :class="">
                                                    <label for="comment">Comment</label>
                                                    <md-input name="comment" id="comment" @keyup.enter="sendComment(task.id)" autocomplete="given-comment" v-model="formComment.comment" :disabled="sendingComment" />
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
                            <div v-for="remark in task.remark">
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
        name: "someGroupTasks",

        data: () => ({
            form: {
                title: '',
                description: '',
                status: '',
                members: '',
                event: '',
                start_date: null,
                end_date: null,
            },
            options: {
                format: 'YYYY/MM/DD HH:mm',
                useCurrent: false,
                showClear: true,
                showClose: true,
                icons: {
                    time: 'far fa-clock',
                    date: 'far fa-calendar',
                    up: 'fas fa-arrow-up',
                    down: 'fas fa-arrow-down',
                    previous: 'fas fa-chevron-left',
                    next: 'fas fa-chevron-right',
                    today: 'fas fa-calendar-check',
                    clear: 'far fa-trash-alt',
                    close: 'far fa-times-circle'
                }
            },
            showSnackbar: false,
            position: 'center',
            duration: 4000,


            creatingForm: false,
            taskSaved: false,
            sending: false,
            errors: null,
            groupTasks: false,
            group_events: false,
            avatarUrl: config.avatarUrl,
            apiUrl: config.apiUrl,
            avatarDefaultUrl: config.avatarDefaultUrl,

            sendingComment: false,
            comenntsVisable: [],
            formComment: {
                comment: '',
                task_id: '',
                type: 'task'
            },
            errorsComment: null,

            pandingResponseServer: false,
            selectedDate_from: null,
            selectedDate_to: null,
        }),
        mounted(){
            this.updateTasks();
        },
        methods: {
            updateTasks(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-tasks/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {

                        this.groupTasks = response.data.group_tasks;
                        this.group_events = response.data.group_events;
                        // console.log(response.data.group_tasks);
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                        // this.sending = false;
                    });
            },

            createTask() {
                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }
                this.sending = true;
                // send to api this.form.post
                axios.put(this.apiUrl + '/group-tasks/' + this.$route.params.groupname, this.$data.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.showSnackbar = true;
                        this.clearForm();
                        this.updateTasks();
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.sending = false;
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
                            minimum: 5,
                            message: 'Must be at least 5 characters long'
                        }
                    },
                    status: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    start_date: {
                        presence: true,
                    },
                    end_date: {
                        presence: true,
                    },
                }
            },

            sendComment(task_id) {
                this.formComment.comment = this.htmlEntities(this.formComment.comment);

                this.errorsComment = null;

                const constraints = this.validateComment();

                const errors = validate(this.$data.formComment, constraints);

                if (errors) {
                    this.errorsComment = errors;
                    return ;
                }


                this.sendingComment = true;
                this.formComment.task_id = +task_id;
                // send to api this.form.post
                axios.post(this.apiUrl + '/task-comment', this.formComment, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.formComment.comment = '';
                        this.updateTasks();
                    })
                    .catch((err) => {
                        this.errorsComment = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errorsComment);
                    })
                    .finally(() => {
                        this.sendingComment = false;
                });
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
                this.form.status = '';
                this.form.members = '';
                this.form.event = '';
                this.form.start_date = '';
                this.form.end_date = '';
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
</style>