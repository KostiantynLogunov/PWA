<template>
    <div>
        <div class="snacks-bar">
            <!--SNACKBAR-->
            <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                         :md-active.sync="flagCreateBook" md-persistent>
                <span>{{$lang.messages.you_created_booking_successfully}}</span>
                <md-button class="md-accent" @click="flagCreateBook = false">{{$lang.buttons.close}}</md-button>
            </md-snackbar>
            <!--SNACKBAR-->

        </div>
        <div class="text-center">
            <div v-if="pandingResponseServer && service == null">
                <div class="alert alert-warning">
                    {{$lang.messages.loading}}<md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"></md-progress-spinner>
                </div>
            </div>
            <div v-else>
                <full-calendar :events="bookingsOfService"
                               :config="calendarConfig"
                               @event-created="eventCreated"
                >
                </full-calendar>
            </div>
        </div>

	    <md-dialog :md-active.sync="doBooking">
		    <md-dialog-title>{{$lang.groups.booking}}</md-dialog-title>
		    <div md-dynamic-height>
			    <form md-dynamic-height novalidate class="md-layout" @submit.prevent="sendNewBooking">
				    <md-card class="md-layout-item md-size-100 md-small-size-100">

					    <md-card-content>
						    <div class=" md-small-size-100">
							    <md-field>
								    <div class="md-layout-item md-small-size-50">
									    <label>{{$lang.fields.start}}</label>
									    <md-input  disabled :value="data.startBook | moment('subtract', '2 hours', 'MM-DD-YYYY HH:mm')"></md-input>
								    </div>
							    </md-field>
							    <md-field>
								    <div class="md-layout-item md-small-size-50">
									    <label>{{$lang.fields.end}}</label>
									    <md-input :value="data.endBook | moment('subtract', '2 hours', 'MM-DD-YYYY HH:mm')" disabled></md-input>
								    </div>
							    </md-field>
								    <br>
								    <div class="md-layout-item md-small-size-100">
									    <md-field>
										    <label>{{$lang.fields.message}}</label>
										    <md-input v-model="data.message" :disabled="processCreateBook" required/>
									    </md-field>
								    </div>
						    </div>
					    </md-card-content>
					    <md-card-actions>
						    <md-dialog-actions>
							    <md-button :disabled="processCreateBook" class="md-primary" @click="cancelFormCreatedBook">{{$lang.buttons.close}}</md-button>
							    <md-button :disabled="processCreateBook"
							               type="submit"
							               class="md-accent md-raised"
							    >{{$lang.buttons.book}}</md-button>
						    </md-dialog-actions>
					    </md-card-actions>
					    <!--<div class="errors" v-if="serverErrors">
						    <p v-for="error in serverErrors">{{ error }}</p>
					    </div>

					    <div class="errors" v-if="editErrors">
						    <ul>
							    <li v-for="(fieldsError, fieldName) in validateErrors" :key="fieldName">
								    {{ fieldsError.join('\n') }}
							    </li>
						    </ul>
					    </div>-->
				    </md-card>
			    </form>
		    </div>
		    <md-progress-bar md-mode="indeterminate" v-if="processCreateBook" />
	    </md-dialog>

    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    import { FullCalendar } from 'vue-full-calendar'

    export default {
        name: "BookServiceInGroup",
        components: {
            FullCalendar,
        },

        data(){
            return{
                bookingsOfService: [],
                service: null,
                
                position: 'left',
                duration: 4000,

                pandingResponseServer: false,

                processingBook: false,

                flagCreateBook: false,

	            doBooking: false,
	            data: {
		            service_id: null,
		            IdUserWantBook: null,
		            startBook: null,
		            endBook: null,
		            message: null,
	            },
	            processCreateBook: false,
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

	        clearData(){
		        this.data.service_id = null;
		        this.data.IdUserWantBook = null;
		        this.data.startBook = null;
		        this.data.endBook = null;
		        this.data.message = null;
	        },

	        cancelFormCreatedBook(){
            	this.doBooking = false;
            	this.clearData();
	        },

            eventCreated(event)
            {
	            this.data.service_id = this.$route.params.service_id;
	            this.data.IdUserWantBook = this.$store.getters.currentUser.id;
	            this.data.startBook = this.$moment.utc(event.start._d).valueOf();
	            this.data.endBook = this.$moment.utc(event.end._d).valueOf();

	            this.doBooking = true;
            },

	        sendNewBooking(){
            	this.processCreateBook = true;
		        axios.post(config.apiUrl + '/my_service_book', this.data, {
			        headers: {
				        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
			        }
		        })
			        .then((response) => {
				        this.getServiceBookings();
				        this.flagCreateBook = true;
				        this.cancelFormCreatedBook();
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
				        this.processCreateBook = false;
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