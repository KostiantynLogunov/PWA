<template>
    <div class="">
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="updatedTask" md-persistent>
            <span>{{$lang.messages.you_updated_task}}</span>
            <md-button class="md-accent" @click="updatedTask = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="addedNewTask" md-persistent>
            <span>{{$lang.messages.you_added_new_task}}</span>
            <md-button class="md-accent" @click="addedNewTask = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <div class="alert alert-warning text-center" v-if="!groupTasks">{{$lang.messages.no_data_yet}}
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>
        <div v-else>
                        <full-calendar :events="events"
                                       :config="config"
                                       @event-selected="eventSelected"
                                       @event-created="eventCreated"
                        >
                        </full-calendar>
        </div>

        <md-dialog :md-active.sync="editingTask">
            <md-dialog-title>{{$lang.groups.editing_task}}</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editTask()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>{{$lang.fields.title}}</label>
                                        <md-input name="title" v-model="value_edit_task.title" :disabled="processingTask" />
                                    </md-field>

                                    <md-field>
                                        <label>{{$lang.fields.description}}</label>
                                        <md-textarea name="description" v-model="value_edit_task.description" :disabled="processingTask" />
                                    </md-field>

                                    <!--<md-field>-->
                                    <!--<label>Status</label>-->
                                    <div class="text-center">
                                        <select name="status" v-model="value_edit_task.status" :disabled="processingTask">
                                            <option value="New">{{$lang.fields.new}}</option>
                                            <option value="In progress">{{$lang.fields.in_progress}}</option>
                                            <option value="Complated">{{$lang.fields.complated}}</option>
                                            <option value="Postponed">{{$lang.fields.postponed}}</option>
                                        </select>
                                    </div>
                                    <br>
                                    <!--</md-field>-->
                                </div>
                                <br>
                                <div class="md-layout-item md-small-size-100 text-center">
                                    <label>{{$lang.fields.start}}</label>
                                    <date-picker v-model="value_edit_task.start_date" :config="options"></date-picker>
                                    <br>
                                    <label>{{$lang.fields.end}}</label>
                                    <date-picker v-model="value_edit_task.end_date" :config="options"></date-picker>
                                    <div class="md-layout-item md-small-size-100 text-left">
                                        <fieldset id="membersTag">
                                            <label class="control-label" style="color: grey">{{$lang.fields.members}}</label>
                                            <tags-input element-id="tags"
                                                        class="form-control"
                                                        v-model="value_edit_task.members"
                                                        :existing-tags="allUsers"
                                                        :typeahead="true"
                                                        :placeholder="$lang.messages.add_responsable_member"
                                                        :only-existing-tags="true"
                                                        name="members"
                                                        :disabled="processingTask"
                                            >
                                            </tags-input>
                                            <br>
                                            <br>
                                        </fieldset>
                                    </div>

                                    <div class="md-layout-item md-small-size-100 text-center">
                                        <select name="event" v-model="value_edit_task.event"  :disabled="processingTask">
                                            <option v-for="group_event in group_events" :value="group_event.timeline.name">
                                                {{ group_event.timeline.name }}
                                            </option>
                                        </select>
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
                                <md-button :disabled="processingTask" class="md-primary" @click="CancelEditingTask">{{$lang.buttons.close}}</md-button>
                                <md-button :disabled="processingTask"
                                           type="submit"
                                           class="md-accent md-raised"
                                >{{$lang.buttons.update}}</md-button>
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
        </md-dialog>

        <md-dialog :md-active.sync="creatingNewTask">
            <md-dialog-title>{{$lang.groups.creating_task}}</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="createTask()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>{{$lang.fields.title}}</label>
                                        <md-input name="title" v-model="form.title" :disabled="processingTask" />
                                    </md-field>

                                    <md-field>
                                        <label>{{$lang.fields.description}}</label>
                                        <md-textarea name="description" v-model="form.description" :disabled="processingTask" />
                                    </md-field>

                                    <div class="text-center">
                                        <select name="status" v-model="form.status" :disabled="processingTask">
                                            <option value="New">{{$lang.fields.new}}</option>
                                            <option value="In progress">{{$lang.fields.in_progress}}</option>
                                            <option value="Complated">{{$lang.fields.complated}}</option>
                                            <option value="Postponed">{{$lang.fields.postponed}}</option>
                                        </select>
                                    </div>
                                    <br>
                                </div>
                                <br>

                                <div class="md-layout-item md-small-size-100 text-center">
                                    <div class="md-layout-item md-small-size-100 text-left">
                                        <fieldset class="membersTag">
                                            <label class="control-label" style="color: grey">{{$lang.fields.members}}</label>
                                            <tags-input element-id="tags"
                                                        class="form-control"
                                                        v-model="form.members"
                                                        :existing-tags="allUsers"
                                                        :typeahead="true"
                                                        placeholder="Add a responsable member"
                                                        :only-existing-tags="true"
                                                        name="members"
                                                        :disabled="processingTask"
                                            >
                                            </tags-input>
                                            <br>
                                            <br>
                                        </fieldset>
                                    </div>

                                    <div class="md-layout-item md-small-size-100 text-center">
                                        <select name="event" v-model="form.event"  :disabled="processingTask" placeholder="Select event">
                                            <option value="" disabled selected>{{$lang.fields.select_event}}</option>
                                            <option v-for="group_event in group_events" :value="group_event.timeline.name">
                                                {{ group_event.timeline.name }}
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                        </md-card-content>
                        <md-progress-bar md-mode="indeterminate" v-if="processingTask" />
                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingTask" class="md-primary" @click="CancelCreatingTask">{{$lang.buttons.close}}</md-button>
                                <md-button :disabled="processingTask"
                                           type="submit"
                                           class="md-accent md-raised"
                                >{{$lang.buttons.create}}</md-button>
                            </md-dialog-actions>
                        </md-card-actions>
                        <div class="deleteErrors" v-if="createErrors">
                            <p v-for="error in createErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="errors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>
                    </md-card>
                </form>
            </div>
        </md-dialog>

    </div>
</template>

<script>

    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    import { FullCalendar } from 'vue-full-calendar'
    // import moment from 'moment'

    export default {
        name: "someGroupDutyRoster",

        components: {
            FullCalendar,
        },

        data: () => ({

            events: [],

            config: {
                defaultView: 'month',
                editable: false,
                eventLimit: false, // allow "more" link when too many events
                navLinks: false,
                allDay: true,
                //if admin
                selectable: true,
                selectHelper: false,

                eventOverlap: false,
                overlap: false,
                selectOverlap: false,

                height: 600,
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

            value_edit_task: {
                title: '',
                description: '',
                status: null,
                members: null,
                event: null,
                start_date: null,
                end_date: null,
                id: null,
                author_id: null
            },

            editingTask: false,
            updateErrors: false,
            editErrors: false,
            processingTask: false,

            updatedTask: false,
            position: 'center',
            duration: 4000,

            sending: false,
            errors: null,
            groupTasks: false,
            group_events: false,
            avatarUrl: config.avatarUrl,
            apiUrl: config.apiUrl,
            avatarDefaultUrl: config.avatarDefaultUrl,

            pandingResponseServer: false,
            currentUser_id: null,
            id_author_of_group: null,
            allUsers: null,

            groupAdminsID: null,

            creatingNewTask: false,
            form: {
                title: '',
                description: '',
                status: 'New',
                members: [],
                event: '',
                start_date: null,
                end_date: null,
            },
            addedNewTask: false,
            createErrors: false
        }),

        mounted(){
            this.updateDutyRoster();
            this.currentUser_id = this.$store.getters.currentUser.id;
            this.allUsers = this.$store.getters.getAllUsers;
        },

        methods: {

            createTask() {
                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }
                this.processingTask = true;
                // send to api this.form.post
                axios.post(this.apiUrl + '/group-tasks/' + this.$route.params.groupname, this.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.addedNewTask = true;
                        this.clearForm();
                        this.updateDutyRoster();
                        this.creatingNewTask = false;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.createErrors = data_errors;
                    })
                    .finally(() => {
                        this.processingTask = false;
                    });
            },

            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            eventCreated(event){
                if ( this.checkGroupAdmins(this.currentUser_id) && confirm('Are you sure you want to create new task ? ') ) {
                    // console.log(event);

                    this.form.start_date = this.$moment.unix(event.start._i / 1000).format("YYYY/MM/DD HH:mm");
                    this.form.end_date = this.$moment.unix(event.end._i / 1000).format("YYYY/MM/DD HH:mm");
                    // console.log(this.form.start_date);
                    // console.log(this.form.end_date);
                    this.creatingNewTask = true;
                }
            },

            eventSelected(event)
            {
                this.errors = null;
                this.errorsComment = null;
                this.updateErrors = null;
                this.editErrors = null;

                if ( this.checkGroupAdmins(this.currentUser_id) ){
                    this.value_edit_task.title = event.original_title;
                    this.value_edit_task.description = event.description;
                    this.value_edit_task.status = event.status;
                    let objMembers = [];
                    event.responsible_user.forEach(function (member, i) {
                        objMembers.push((member.id).toString());
                    });
                    // console.log(objMembers);
                    this.value_edit_task.members = objMembers;


                    this.value_edit_task.event = event.target_event;
                    this.value_edit_task.start_date = event.time_from;
                    this.value_edit_task.end_date = event.time_till;
                    this.value_edit_task.id = event.id;
                    this.value_edit_task.author_id = event.author_id;

                    this.errors = null;
                    this.errorsComment = null;
                    this.updateErrors = null;
                    this.editErrors = null;

                    this.editingTask = true;
                    return;

                } else {
                    alert('Permission denied !');
                    return;
                }
            },


            CancelEditingTask(){
                this.editingTask = false;
                this.clearTaskEDitForm();
            },

            CancelCreatingTask(){
                this.creatingNewTask = false;
                this.clearForm();
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
                        this.updateDutyRoster();
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

            updateDutyRoster(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-dutyroster/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupAdminsID = response.data.admins_id;

                        let index, i = 0;
                        let group_tasks = response.data.group_tasks;

                        for (index = 0; index < group_tasks.length; index++) {

                            this.$set(this.events, i, '');

                            let oneTask = group_tasks[index];

                            let obje = {
                                id : oneTask.id,
                                author_id : oneTask.author_id,
                                title  : oneTask.title + ' (' + oneTask.user.name + '/' + oneTask.status + ')',
                                original_title  : oneTask.title,
                                description  : oneTask.description,
                                status  : oneTask.status,
                                time_from  : oneTask.time_from,
                                time_till  : oneTask.time_till,
                                responsible_user    : oneTask.responsible_user,
                                target_event    : oneTask.target_event,
                                start  : oneTask.time_from,
                                end    : oneTask.time_till,
                                textColor: 'black',
                                // url: 'la-lal-la'
                            };
                            this.events[i] = obje;
                            i++;
                            // console.log(oneTask);
                        }
                        // console.log(this.events);
                        this.groupTasks = response.data.group_tasks;
                        this.group_events = response.data.group_events;
                        // console.log(response.data.group_tasks);
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally( () => {
                        this.pandingResponseServer = false;
                    });
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
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
    @import '~fullcalendar/dist/fullcalendar.css';

    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        /*padding: 21px 0 2px 0;*/
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

    #membersTag input:focus{
        border: none;
        outline: none;
    }
    .membersTag input:focus{
        border: none;
        outline: none;
    }
</style>