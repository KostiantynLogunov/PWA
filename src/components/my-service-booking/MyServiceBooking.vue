<template>
    <div>
        <div class="snacks-bar">
            <!--SNACKBAR-->
            <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                         :md-active.sync="flagDeleteBook" md-persistent>
                <span>You deleted booking successfully!</span>
                <md-button class="md-accent" @click="flagDeleteBook = false">Close</md-button>
            </md-snackbar>
            <!--SNACKBAR-->
            <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                         :md-active.sync="flagUpdateBook" md-persistent>
                <span>You updated booking successfully!</span>
                <md-button class="md-accent" @click="flagUpdateBook = false">Close</md-button>
            </md-snackbar>
            <!--SNACKBAR-->
        </div>

        <div class="text-center">
            <div v-if="pandingResponseServer && service == null">
                <div class="alert alert-warning">
                    Loading....<md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
                </div>
            </div>
            <div v-else>
                <full-calendar :events="bookingsOfService"
                               :config="calendarConfig"
                               @event-selected="eventSelected"
                >
                </full-calendar>
            </div>
        </div>


        <md-dialog :md-active.sync="editBook">
            <md-dialog-title>Edit Booking</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="updateBook">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field class="text-center">
                                        <div class="md-layout-item md-small-size-50">
                                            <label>START TIME</label>
                                            <md-input :value="value_edit_book.start" disabled></md-input>
                                        </div>
                                    </md-field>
                                    <md-field>
                                        <div class="md-layout-item md-small-size-50">
                                            <label>END TIME</label>
                                            <md-input :value="value_edit_book.end" disabled></md-input>
                                        </div>
                                    </md-field>

                                    <md-field>
                                        <label>User</label>
                                        <md-input :value="value_edit_book.user_name"
                                                  disabled />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Status</label>
                                            <md-select name="event" v-model="value_edit_book.status" md-dense
                                                       :disabled="processingBook"
                                            >
                                                <md-option value="pending">Pending</md-option>
                                                <md-option value="confirmed">Confirmed</md-option>
                                                <md-option value="rejected">Rejected</md-option>
                                                <md-option value="finished">Finished</md-option>
                                            </md-select>
                                        </md-field>
                                    </div>

                                    <br>
                                </div>
                                <br>
                            </div>

                        </md-card-content>

                        <md-progress-bar md-mode="indeterminate" v-if="processingBook" />

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingBook" class="md-accent"
                                           @click="deleteBook(value_edit_book.book_id)">
                                    Delete</md-button>
                                <md-button :disabled="processingBook" class="md-primary" @click="CancelUpdateBook">
                                    Close</md-button>
                                <md-button :disabled="processingBook"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Update</md-button>
                            </md-dialog-actions>
                        </md-card-actions>

                        <div class="errors" v-if="updateErrors">
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
    import axios from 'axios'
    import {config} from '../../_services/config'

    import { FullCalendar } from 'vue-full-calendar'

    export default {
        name: "MyServiceBooking",
        components: {
            FullCalendar,
        },

        data(){
            return{
                bookingsOfService: [],
                service: null,

                position: 'left',
                duration: 4000,
                flagDeleteBook:false,

                pandingResponseServer: false,

                editBook: false,
                updateErrors: null,
                editErrors: null,
                processingBook: false,
                value_edit_book: {
                    book_id: '',
                    status: null,
                    user_name : '',
                    start: '',
                    end: '',
                },
                flagUpdateBook: false,
            }
        },

        created(){
            this.getServiceBookings();
        },

        computed: {
            calendarConfig(){
                let myConfig = {};

                if (this.service.business_hours != null)
                {
                    // console.log(this.service.business_hours);

                    let business_hours = this.service.business_hours;

                    function bishours(business_hours){
                        let result = [];
                        business_hours = JSON.parse(business_hours);
                        // console.log(business_hours);

                        for (let one_bisiness in business_hours)
                        {
                            one_bisiness = business_hours[one_bisiness];

                            // console.log(one_bisiness);
                            let oneBiss = {
                                dow: null,
                                start: '',
                                end: ''
                            };

                            if( one_bisiness.days.length == 0 )
                                oneBiss.dow = [0, 1, 2, 3, 4, 5, 6];
                            else
                                oneBiss.dow = one_bisiness.days;

                            if( one_bisiness.time.start_time != "" && one_bisiness.time.end_time != "") {
                                oneBiss.start = one_bisiness.time.start_time;
                                oneBiss.end = one_bisiness.time.end_time;
                            }
                            else {
                                oneBiss.start = '00:00';
                                oneBiss.end = '23:59';
                            }
                            result.push(oneBiss);
                        };

                        return result;
                    };

                    myConfig = {
                        defaultView: 'agendaWeek',
                        editable: false,
                        eventLimit: false, // allow "more" link when too many events
                        navLinks: false,
                        allDay: true,
                        selectable: true,
                        selectHelper: false,
                        eventOverlap: false,
                        overlap: false,
                        selectOverlap: false,
                        height: 600,

                        selectConstraint : 'businessHours',
                        businessHours: bishours(business_hours)
                    }
                }
                else
                    myConfig = {
                        defaultView: 'agendaWeek',
                        editable: false,
                        eventLimit: false, // allow "more" link when too many events
                        navLinks: false,
                        allDay: true,
                        selectable: true,
                        selectHelper: false,
                        eventOverlap: false,
                        overlap: false,
                        selectOverlap: false,
                        height: 600,
                    };

                return myConfig;
            }
        },

        methods: {

            findWithAttr(array, attr, value) {
                for(var i = 0; i < array.length; i += 1) {
                    if(array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            },

            deleteBook(book_id){
                if ( !confirm('Are you sure you want to delete this book? ') ) return;

                this.processingBook = true;

                axios.delete(config.apiUrl + '/my_service_book/' + book_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let index = this.findWithAttr(this.bookingsOfService, 'id', book_id);
                        this.$delete(this.bookingsOfService, index);
                        this.flagDeleteBook = true;
                        this.CancelUpdateBook();
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.processingBook = false;
                    });
            },

            CancelUpdateBook(){
                this.editBook = false;
                this.clearFormUpdateBook();
            },

            clearFormUpdateBook(){
                this.value_edit_book.book_id = null;
                this.value_edit_book.status = null;
                this.value_edit_book.user_name = null;
                this.value_edit_book.start = null;
                this.value_edit_book.end = null;
            },

            updateBook(){
                this.processingBook = true;

                let data = {
                    book_id: this.htmlEntities(this.value_edit_book.book_id),
                    status: this.htmlEntities(this.value_edit_book.status),
                    service_id: this.$route.params.service_id,
                };

                axios.put(config.apiUrl + '/my_service_book', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getServiceBookings();
                        this.flagUpdateBook = true;
                        this.CancelUpdateBook();
                    })
                    .catch((err) => {
                        /*let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.updateErrors = data_errors;
                        console.log(this.updateErrors);*/
                        console.log(err);
                    })
                    .finally(() => {
                        this.processingBook = false;
                    });
            },

            eventSelected(event)
            {
                this.updateErrors = null;
                this.editErrors = null;

                this.value_edit_book.book_id = event.id;
                this.value_edit_book.status = event.status;
                this.value_edit_book.user_name = event.user_name;
                this.value_edit_book.start = event.start._i;
                this.value_edit_book.end = event.end._i;

                this.editBook = true;
            },

            getServiceBookings(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/my_service_book/' + this.$route.params.service_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        // console.log(response.data.AllBookingsOfService);
                        // this.bookingsOfService = response.data.AllBookingsOfService;
                        this.service = response.data.service;

                        let i = 0;
                        let bookings = response.data.AllBookingsOfService;

                        for (let index = 0; index < bookings.length; index++)
                        {
                            this.$set(this.bookingsOfService, i, '');

                            let oneBook = bookings[index];

                            let obje = {
                                id : oneBook.id,
                                user_id : oneBook.user_id,
                                user_name : oneBook.user_name,
                                start: oneBook.time_from,
                                end: oneBook.time_till,
                                status: oneBook.status,
                                comment: oneBook.message,
                                title: 'Service: ' + this.service.name + '\n' + oneBook.user_name + '\n' + 'Status: '
                                    + oneBook.status + '\n' + 'Comment: ' + oneBook.message + '\n',/* + 'Providing by: ' + '{{ App\User::getUserName($book->provider_user_id) }}',*/
                                textColor: 'black',
                                // url: 'la-lal-la'
                            };
                            this.bookingsOfService[i] = obje;
                            i++;
                        }
                    })
                    .catch((err) => {
                        /*let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errors = data_errors;*/
                        console.log(err);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return utcTZ;
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },
        }

    }
</script>

<style scoped>
    @import '~fullcalendar/dist/fullcalendar.css';

    div[md-dynamic-height] {  /*form hight for creating service in my service*/
        overflow-y: auto;
    }
</style>
<style>
    .md-menu-content {
        z-index: 10;
    }
</style>