<template>
    <div class="">
        <div class="snacks-bar">
            <!--SNACKBAR-->
            <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                         :md-active.sync="flagCreateBook" md-persistent>
                <span>You created booking successfully!</span>
                <md-button class="md-accent" @click="flagCreateBook = false">Close</md-button>
            </md-snackbar>
            <!--SNACKBAR-->
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
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>

                <full-calendar :events="bookingsOfItem"
                               :config="config"
                               @event-created="eventCreated"
                               @event-selected="eventSelected"
                >
                </full-calendar>
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
                                            <md-input :value="value_edit_book.start_time" disabled></md-input>
                                        </div>
                                    </md-field>
                                    <md-field>
                                        <div class="md-layout-item md-small-size-50">
                                            <label>END TIME</label>
                                            <md-input :value="value_edit_book.end_time" disabled></md-input>
                                        </div>
                                    </md-field>

                                    <md-field>
                                        <label>Name</label>
                                        <md-input :value="value_edit_book.user_name"
                                                  disabled />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Status</label>
                                            <md-select name="event" v-model="value_edit_book.status" md-dense
                                                       :disabled="processingBook"
                                            >
                                                    <md-option value="new request">New request</md-option>
                                                    <md-option value="approved">Approved</md-option>
                                                    <md-option value="rejected">Rejected</md-option>
                                                    <md-option value="received">Received</md-option>
                                                    <md-option value="returned">Returned</md-option>
                                            </md-select>
                                        </md-field>
                                    </div>

                                    <md-field>
                                        <label>Comment</label>
                                        <md-textarea name="description" v-model="value_edit_book.comment"
                                                     :disabled="processingBook" />
                                    </md-field>

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
    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    import { FullCalendar } from 'vue-full-calendar'

    export default {
        name: "MyBookingItem",
        components: {
            FullCalendar,
        },

        data(){
            return{
                bookingsOfItem: [],

                config: {
                    defaultView: 'agendaWeek',
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

                position: 'left',
                duration: 4000,
                flagDeleteBook:false,

                pandingResponseServer: false,

                editBook: false,
                updateErrors: null,
                editErrors: null,
                processingBook: false,
                value_edit_book: {
                    comment: null,
                    status: null,
                    user_name: null,
                    start_time: null,
                    end_time: null,
                    book_id: null,
                    user_id: null
                },
                flagUpdateBook: false,
                flagCreateBook: false,
            }
        },

        created(){
          this.getItemBookings();
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

                axios.delete(config.apiUrl + '/my_book_item/' + book_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let index = this.findWithAttr(this.bookingsOfItem, 'id', book_id);
                        this.$delete(this.bookingsOfItem, index);
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
                this.value_edit_book.comment = null;
                this.value_edit_book.status = null;
                this.value_edit_book.user_name = null;
                this.value_edit_book.start_time = null;
                this.value_edit_book.end_time = null;
                this.value_edit_book.user_id = null;
                this.value_edit_book.book_id = null;
            },

            updateBook(){
                this.processingBook = true;

                let data = {
                    book_id: this.htmlEntities(this.value_edit_book.book_id),
                    status: this.htmlEntities(this.value_edit_book.status),
                    comments: this.htmlEntities(this.value_edit_book.comment),
                    item_id: this.$route.params.item_id,
                };

                axios.put(config.apiUrl + '/my_book_item', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getItemBookings();
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

                this.value_edit_book.comment = event.comments;
                this.value_edit_book.status = event.status;
                this.value_edit_book.user_name = event.user_name;
                this.value_edit_book.start_time = event.start._i;
                this.value_edit_book.end_time = event.end._i;
                this.value_edit_book.user_id = event.user_id;
                this.value_edit_book.book_id = event.id;

                this.editBook = true;
                // console.log(this.value_edit_book);
            },

            getItemBookings(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/my_book_item/' + this.$route.params.item_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        // console.log(response.data.AllBookingOfItem);
                        // this.bookingsOfItem = response.data.AllBookingOfItem;
                        let i = 0;
                        let bookings = response.data.AllBookingOfItem;

                        for (let index = 0; index < bookings.length; index++)
                        {
                            this.$set(this.bookingsOfItem, i, '');

                            let oneBook = bookings[index];

                            let obje = {
                                id : oneBook.id,
                                user_id : oneBook.user_id,
                                user_name : oneBook.user_name,
                                original_title: oneBook.comments,
                                title  : oneBook.user_name + ': ' + oneBook.comments + '\n' +' (' + oneBook.status +
                                    ')',
                                comments : oneBook.comments,
                                description  : oneBook.description,
                                status  : oneBook.status,
                                start : oneBook.time_from,
                                end : oneBook.time_till,
                                textColor: 'black',
                                // url: 'la-lal-la'
                            };
                            this.bookingsOfItem[i] = obje;
                            i++;
                            // console.log(oneBook);
                        }
                        // console.log(this.bookingsOfItem);
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

            eventCreated(event){
                let comment = prompt('Write your comment : ');
                if (comment)
                {
                    let data = {
                        item_id: this.$route.params.item_id,
                        startBook: this.$moment.utc(event.start._d).valueOf(),
                        endBook: this.$moment.utc(event.end._d).valueOf(),
                        commetnBook: comment,
                    };

                    axios.post(config.apiUrl + '/my_book_item', data, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            this.getItemBookings();
                            this.flagCreateBook = true;
                            // console.log(response);
                        })
                        .catch((err) => {
                            /*let data_errors = [];
                            data_errors.push(err.message);
                            data_errors.push(err.response.data.message);
                            this.errors = data_errors;
                            console.log(this.errors);*/
                            console.log(err);
                        })
                        .finally(() => {
                            // this.processingItem = false;
                        });
                }

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
</style>
<style>
    .md-menu-content {
        z-index: 10;
    }
</style>