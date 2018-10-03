<template>
    <div class="">
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="updatedTask" md-persistent>
            <span>You update a task !</span>
            <md-button class="md-accent" @click="updatedTask = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <div class="alert alert-warning text-center" v-if="!groupTasks">No Data yet....
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>
        <div v-else>

            <full-calendar :events="events" :config="config" @event-selected="eventSelected"></full-calendar>
            <!--<full-calendar :events="events" :config="config" ></full-calendar>-->
        </div>

        <md-dialog :md-active.sync="editingTask">
            <md-dialog-title>Editing Task</md-dialog-title>
                <div md-dynamic-height>
                    <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editTask()">
                        <md-card class="md-layout-item md-size-100 md-small-size-100">

                            <md-card-content>
                                <div class="md-layout md-gutter">
                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Title</label>
                                            <md-input name="title" v-model="value_edit_task.title" :disabled="processingTask" />
                                        </md-field>

                                        <md-field>
                                            <label>Description</label>
                                            <md-textarea name="description" v-model="value_edit_task.description" :disabled="processingTask" />
                                        </md-field>

                                        <!--<md-field>-->
                                            <!--<label>Status</label>-->
                                        <div class="text-center">
                                            <select name="status" v-model="value_edit_task.status" :disabled="processingTask">
                                                <option value="New">New</option>
                                                <option value="In progress">In progress</option>
                                                <option value="Complated">Complated</option>
                                                <option value="Postponed">Postponed</option>
                                            </select>
                                        </div>
                                        <br>
                                        <!--</md-field>-->
                                    </div>
                                    <br>
                                    <div class="md-layout-item md-small-size-100 text-center">
                                        <!--<div class="md-layout md-gutter">-->
                                            <!--<div class="md-layout-item md-small-size-0">-->
                                                <label>START DATE</label>
                                                <date-picker v-model="value_edit_task.start_date" :config="options"></date-picker>
                                            <!--</div>-->
                                            <!--<div class="md-layout-item md-small-size-50">-->
                                        <br>
                                                <label>END DATE</label>
                                                <date-picker v-model="value_edit_task.end_date" :config="options"></date-picker>
                                            <!--</div>-->
                                        <!--</div>-->

                                        <div class="md-layout-item md-small-size-100">
                                            <md-field>
                                                <label>Members</label>
                                                <md-input name="members" v-model="value_edit_task.members" :disabled="processingTask" />
                                            </md-field>
                                        </div>

                                        <div class="md-layout-item md-small-size-100 text-center">
                                            <!--<md-field>-->
                                                <!--<label>Target Event</label>-->
                                                <select name="event" v-model="value_edit_task.event"  :disabled="processingTask">
                                                    <!--<div v-if="group_events.length">-->
                                                        <!--<div v-for="group_event in group_events">-->
                                                            <option v-for="group_event in group_events" :value="group_event.timeline.name">
                                                                {{ group_event.timeline.name }}
                                                            </option>
                                                        <!--</div>-->
                                                    <!--</div>-->
                                                    <!--<div v-else>-->
                                                        <!--<md-option  value="" disabled>-->
                                                            <!--Not any events-->
                                                        <!--</md-option>-->
                                                    <!--</div>-->
                                                </select>
                                            <!--</md-field>-->
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
                editable: true,
                eventLimit: false, // allow "more" link when too many events
                navLinks: false,
                allDay: true,
                //if admin
                selectable: false,
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
            currentUser: null,
            id_author_of_group: null,
        }),
        mounted(){
            this.updateDutyRoster();
            this.currentUser = this.$store.getters.currentUser;
        },
        methods: {
            checkAdmin(user_id){
                return this.currentUser.id == user_id;
            },

            checkGroupAuthor() {
                return this.id_author_of_group == this.currentUser.id;
            },

            eventSelected(event)
            {
                this.errors = null;
                this.errorsComment = null;
                this.updateErrors = null;
                this.editErrors = null;

                if (this.checkGroupAuthor() || this.checkAdmin()){
                    this.value_edit_task.title = event.original_title;
                    this.value_edit_task.description = event.description;
                    this.value_edit_task.status = event.status;
                    this.value_edit_task.members = event.responsible_user;
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
                    alert('Permision dinaided !');
                    return;
                }
            },


            CancelEditingTask(){
                this.editingTask = false;
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
                        this.id_author_of_group = response.data.id_author_of_group;
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