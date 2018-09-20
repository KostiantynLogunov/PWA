<template>
    <div class="page-container md-layout-column">
        <div class="text-center" v-if="!creatingForm">
            <md-button type="submit" class="md-primary md-raised"  @click="creatingForm = true" :disabled="sending">Create Task</md-button>
        </div>
        <div v-else>
            <form novalidate class="md-layout" @submit.prevent="createTask" >
                <md-card class="md-layout-item md-size-50 md-small-size-100">
                    <md-card-header>
                        <div class="md-title">Creating Task</div>
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
                                    <label>Status</label>
                                    <md-select name="status" id="status" v-model="form.status" md-dense :disabled="sending">
                                        <md-option value="New">New</md-option>
                                        <md-option value="In progress">In progress</md-option>
                                        <md-option value="Complated">Complated</md-option>
                                        <md-option value="Postponed">Postponed</md-option>
                                    </md-select>
                                </md-field>

                                    <div class="md-layout md-gutter">
                                        <div class="row">
                                            <span>Departure Date：</span>
                                            <!--<date-picker :date="startTime" :option="option" :limit="limit"></date-picker>-->
                                        </div>
                                        <!--<div class="md-layout-item md-small-size-50">
                                            <md-datepicker v-model="selectedDate_from" md-immediately/>
                                        </div>
                                        <div class="md-layout-item md-small-size-50">
                                            <md-datepicker v-model="selectedDate_to" />
                                        </div>-->
                                    </div>


                                <div class="md-layout-item md-small-size-100">
                                    <md-field :class="">
                                        <label for="members">Members</label>
                                        <md-input name="members" id="members" autocomplete="given-name" v-model="form.members" :disabled="sending" />
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
                                                    <md-input name="comment" id="comment" @keyup.enter="sendComment(task.id)" autocomplete="given-name" v-model="formComment.comment" :disabled="sendingComment" />
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
    // import {myDatepicker} from 'vue-datepicker'

    export default {
        name: "someGroupTasks",
        data: () => ({
            form: {
                title: '',
                description: '',
                status: '',
                members: '',
                event: '',
            },


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


            // for Vue 2.0
            startTime: {
                time: ''
            },
            endtime: {
                time: ''
            },
            option: {
                type: 'day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format: 'YYYY-MM-DD HH:mm',
                placeholder: 'when?',
                inputStyle: {
                    'display': 'inline-block',
                    'padding': '6px',
                    'line-height': '22px',
                    'font-size': '16px',
                    'border': '2px solid #fff',
                    'box-shadow': '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
                    'border-radius': '2px',
                    'color': '#5F5F5F'
                },
                color: {
                    header: '#ccc',
                    headerText: '#f00'
                },
                buttons: {
                    ok: 'Ok',
                    cancel: 'Cancel'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            },
            timeoption: {
                type: 'min',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format: 'YYYY-MM-DD HH:mm'
            },
            multiOption: {
                type: 'multi-day',
                week: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                format:"YYYY-MM-DD HH:mm"
            },
            limit: [{
                type: 'weekday',
                available: [1, 2, 3, 4, 5]
                },
                {
                    type: 'fromto',
                    from: '2016-02-01',
                    to: '2016-02-20'
            }]
        }),
        components: {
            // 'date-picker': myDatepicker
        },
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
                        this.pandingResponseServer = false;
                        this.groupTasks = response.data.group_tasks;
                        this.group_events = response.data.group_events;
                        console.log(response.data.group_events);
                    });
            },

            createTask() {

                console.log('creating new task....');

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
                        this.sendingComment = false;
                        this.updateTasks();
                    })
                    .catch((err) => {
                        let errorMessage = err.response.data.message || err.message;
                        this.errors = err.response.data;
                        this.sendingComment = false ;
                        console.log(errorMessage);
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