<template>
    <div>
        <div class="alert alert-warning text-center" v-if="!groupTasks">No Data yet....
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>
        <div v-else>
            <full-calendar :events="events" :config="config"></full-calendar>
        </div>
    </div>

</template>

<script>
    // import validate from 'validate.js'
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
            events: [
                /*{
                    title: 'test',
                    allDay: true,
                    start: moment(),
                    end: moment().add(1, 'd'),
                    // color: 'yellow',
                    textColor: 'black',
                },*/
            ],
            config: {
                defaultView: 'month',
                editable: false,
                eventLimit: false, // allow "more" link when too many events
                navLinks: false,
                allDay: true,
                //if admin
                selectable: true,
                selectHelper: true,

                eventOverlap: false,
                overlap: false,
                selectOverlap: false,
            },

            sending: false,
            errors: null,
            groupTasks: false,
            group_events: false,
            avatarUrl: config.avatarUrl,
            apiUrl: config.apiUrl,
            avatarDefaultUrl: config.avatarDefaultUrl,

            pandingResponseServer: false,
        }),
        mounted(){
            this.updateDutyRoster();
        },
        methods: {
            updateDutyRoster(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-dutyroster/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        let index, i = 0;
                        let group_tasks = response.data.group_tasks;

                        for (index = 0; index < group_tasks.length; index++) {

                            this.$set(this.events, i, '');

                            let oneTask = group_tasks[index];

                            let obje = {
                                title  : oneTask.title + ' (' + oneTask.user.name + '/' + oneTask.status + ')',
                                start  : oneTask.time_from,
                                end    : oneTask.time_till,
                                textColor: 'black',
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
                        console.log(err);
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
</style>