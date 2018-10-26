<template>
    <div>
        <div class="snacks-bar">
            <!--SNACKBAR-->
            <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                         :md-active.sync="flagCreateBook" md-persistent>
                <span>You created booking successfully!</span>
                <md-button class="md-accent" @click="flagCreateBook = false">Close</md-button>
            </md-snackbar>
            <!--SNACKBAR-->

        </div>
        <div class="text-center">
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>

            <full-calendar :events="bookingsOfItem"
                           :config="config"
                           @event-created="eventCreated"
            >
            </full-calendar>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    import { FullCalendar } from 'vue-full-calendar'

    export default {
        name: "BookItemInGroup",

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

                position: 'left',
                duration: 4000,

                pandingResponseServer: false,

                processingBook: false,

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

</style>