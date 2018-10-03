<template>
    <div class="page-container md-layout-column">
        <!--<div v-for="usr in allUsers">{{ usr }}</div>-->
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteTask" md-persistent>
            <span>You deleted a task!</span>
            <md-button class="md-accent" @click="flagDeleteTask = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
            <span>You added new task !</span>
            <md-button class="md-accent" @click="showSnackbar = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="updatedTask" md-persistent>
            <span>You edited a task !</span>
            <md-button class="md-accent" @click="updatedTask = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <div class="text-center" v-if="!creatingForm">
            <div v-if="checkGroupAuthor()">
                <md-button type="submit" class="md-primary md-raised"  @click="creatingForm = true; editingTask = null" :disabled="sending">Create Task</md-button>
            </div>
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

                                <br>
                                <div class="md-layout-item md-small-size-100">
                                        <!--<label>Members</label>-->
                                        <!--<md-input name="members" id="members" autocomplete="given-members" v-model="form.members" :disabled="sending" />-->


                                    <fieldset class="form-group" id="usersTag">
                                        <label class="control-label">MEMBERS</label>
                                        <tags-input element-id="tags"
                                                    class="form-control"
                                                    v-model="form.members"
                                                    :existing-tags="allUsers"
                                                    :typeahead="true"
                                                    placeholder="Add a member"
                                                    :only-existing-tags="true"
                                                    name="members"
                                        >
                                        </tags-input>
                                        <!--<button type="button" @click="ToConsoleSelectedTags">+</button>-->
                                    </fieldset>
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
                            Responsible users:
                            <span v-for="member in task.responsible_user" class="one_member_link">
                                <!-- link = member.link-->
                                <a class="mr-3">
                                    <span v-if="member.avatar">
                                        <img :src="member.avatar" alt="avatar">
                                    </span>
                                    <span v-else>
                                        <img :src="avatarDefaultUrl" alt="">
                                    </span>
                                    {{ member.name }}</a>
                            </span>
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
                        <div v-if="checkAdmin(task.author_id) || checkGroupAuthor()">
                            <md-button :disabled="editingTask == task.id" @click="onFormEditTask(task.title, task.description, task.status, task.responsible_user, task.target_event, task.time_from, task.time_till, task.id)"><i class="far fa-edit"></i>
                                Edit</md-button>
                            <md-button class="md-accent" :disabled="deleteProcess" @click="deleteTask(task.id)"><i class="far fa-trash-alt"></i>
                            Delete</md-button>

                        </div>

                    </md-card-actions>
                    <div v-if="deletingTask == task.id">
                        <md-progress-bar class="md-accent"  md-mode="indeterminate" v-if="deleteProcess" />
                        <div class="errors" v-if="deleteErrors">
                            <p v-for="error in deleteErrors">{{ error }}</p>
                        </div>
                    </div>


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

                <div v-if="editingTask == task.id">
                    <form novalidate class="md-layout" @submit.prevent="editTask()">
                        <md-card class="md-layout-item md-size-100 md-small-size-100">
                            <h5 class="text-center">Editing Task</h5>

                            <md-card-content>
                                <div class="md-layout md-gutter">
                                    <div class="md-layout-item md-small-size-100">
                                        <md-field :class="">
                                            <label for="title">Title</label>
                                            <md-input name="title" v-model="value_edit_task.title" :disabled="processingTask" />
                                        </md-field>

                                        <md-field>
                                            <label for="description">Description</label>
                                            <md-textarea name="description" v-model="value_edit_task.description" :disabled="processingTask" />
                                        </md-field>

                                        <md-field>
                                            <label>Status</label>
                                            <md-select name="status" v-model="value_edit_task.status" :disabled="processingTask" :placeholder="value_edit_task.status">
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
                                                <date-picker v-model="value_edit_task.start_date" :config="options"></date-picker>
                                            </div>
                                            <div class="md-layout-item md-small-size-50">
                                                <label>END DATE</label>
                                                <date-picker v-model="value_edit_task.end_date" :config="options"></date-picker>
                                            </div>
                                        </div>

                                        <div class="md-layout-item md-small-size-100">
                                            <md-field>
                                                <label>Members</label>
                                                <md-input name="members" v-model="value_edit_task.members" :disabled="processingTask" />
                                            </md-field>
                                        </div>

                                        <div class="md-layout-item md-small-size-100">
                                            <md-field :class="">
                                                <label>Target Event</label>
                                                <md-select name="event" v-model="value_edit_task.event" md-dense :disabled="processingTask">
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
                            <md-progress-bar md-mode="indeterminate" v-if="processingTask" />
                            <md-card-actions>
                                <md-dialog-actions>
                                    <md-button :disabled="processingTask" class="md-primary" @click="CancelEditingTask">Close</md-button>
                                    <md-button :disabled="processingTask"
                                               type="submit"
                                               class="md-accent md-raised"
                                    >Update</md-button>
                                </md-dialog-actions>
                            </md-card-actions>
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
                        </md-card>

                    </form>
                </div>
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
            selectedTags: [],
            form: {
                title: '',
                description: '',
                status: '',
                members: [],
                event: '',
                start_date: null,
                end_date: null,
            },
            allUsers: null,

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

            currentUser: false,
            id_author_of_group: null,
            flagDeleteTask: false,
            deleteErrors: false,
            deletingTask: false,
            editingTask: null,
            editErrors: false,
            updatedTask: false,
            processingTask: false,
            updateErrors: false,

            value_edit_task: {
                title: null,
                description: null,
                status: null,
                members: null,
                event: null,
                start_date: null,
                end_date: null,
                id: null,
            },
            deleteProcess: false
        }),
        mounted(){
            this.updateTasks();
            this.currentUser = this.$store.getters.currentUser;
            this.getAllUsers();
        },

        methods: {
            getAllUsers(){
                axios.get(config.apiUrl + '/search_users', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let AllUsers = response.data.data;
                        let countUsers = AllUsers.length;
                        // console.log(AllUsers);
                        let objUsers = {};
                        for (let i = 0; i < countUsers; i++)
                            objUsers[AllUsers[i].id] = AllUsers[i].name;

                        this.allUsers = objUsers;
                        // console.log(this.allUsers);
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errors = data_errors;
                        console.log(data_errors);
                    })
                    .finally(() => {
                        // this.pandingResponseServer = false;
                    });
            },
            ToConsoleSelectedTags(){
                console.log(this.selectedTags);
            },

            CancelEditingTask(){
                this.editingTask = null;
                this.clearTaskEDitForm();
            },

            clearTaskEDitForm(){
                this.value_edit_task.title = null;
                this.value_edit_task.description = null;
                this.value_edit_task.status = null;
                this.value_edit_task.members = null;
                this.value_edit_task.event = null;
                this.value_edit_task.start_date = null;
                this.value_edit_task.end_date = null;
                this.value_edit_task.id = null;
            },

            onFormEditTask(task_title, task_description, task_status, task_members, task_event, task_start_date, task_end_date, task_id){
                this.clearTaskEDitForm();

                this.editingTask = this.htmlEntities(task_id);

                this.errors = null;
                this.errorsComment = null;
                this.updateErrors = null;
                this.editErrors = null;

                this.value_edit_task.title = this.htmlEntities(task_title);
                this.value_edit_task.description = this.htmlEntities(task_description);
                this.value_edit_task.status = this.htmlEntities(task_status);
                this.value_edit_task.members = this.htmlEntities(task_members);
                this.value_edit_task.event = this.htmlEntities(task_event);
                this.value_edit_task.start_date = this.htmlEntities(task_start_date);
                this.value_edit_task.end_date = this.htmlEntities(task_end_date);
                this.value_edit_task.id = this.htmlEntities(task_id);
            },

            checkAdmin(user_id){
                return this.currentUser.id == user_id;
            },

            checkGroupAuthor() {
                return this.id_author_of_group == this.currentUser.id;
            },

            editTask(){
                this.errors = null;
                this.errorsComment = null;
                this.updateErrors = null;
                this.editErrors = null;

                const constraints = this.getConstraints();
                const errors = validate(this.$data.value_edit_task, constraints);
                if (errors) {
                    this.editErrors = errors;
                    return ;
                }
                this.processingTask = true;

                axios.put(config.apiUrl + '/group-tasks/' + this.$route.params.groupname, this.$data.value_edit_task, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.updateTasks();
                        this.updatedTask = true;
                        this.CancelEditingTask();
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.updateErrors = data_errors;
                        // console.log(this.updateErrors);
                    })
                    .finally(() => {
                        this.processingTask = false;
                    });
            },

            deleteTask(task_id){
                this.deletingTask = task_id;
                this.deleteProcess = true;
                axios.delete(config.apiUrl + '/group_tasks/' + task_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.updateTasks();
                        this.flagDeleteTask = true;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.deleteErrors = data_errors;
                        console.log(this.deleteErrors);
                    })
                    .finally(() => {
                        this.deleteProcess = false;
                    });
            },

            updateTasks(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-tasks/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.id_author_of_group = response.data.id_author_of_group;
                        this.groupTasks = response.data.group_tasks;
                        this.group_events = response.data.group_events;
                        // console.log(response.data.group_tasks);
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errors = data_errors;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
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
                axios.post(this.apiUrl + '/group-tasks/' + this.$route.params.groupname, this.$data.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.showSnackbar = true;
                        this.clearForm();
                        this.updateTasks();
                        this.creatingForm = false;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errors = data_errors;
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
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errorsComment = data_errors;
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
        /*list-style: none;*/
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
<style>
    .badge-light {
        color: white!important;
        background: #448AFF!important;
    }
    .badge:hover {
        color: white!important;
        background: #448AFF!important;
    }

    #usersTag input:focus{
        border: none;
        outline: none;
    }
</style>