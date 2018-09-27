<template>
    <div class="page-container md-layout-column">
            <form novalidate class="md-layout" @submit.prevent="createEvent" >
                <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="eventSaved" md-persistent>
                    <span>You added new event !</span>
                    <md-button class="md-accent" @click="eventSaved = false">Close</md-button>
                </md-snackbar>
                <md-card class="md-layout-item md-size-50 md-small-size-100">
                    <md-card-header>
                        <div class="md-title">Creating Event</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label>Type</label>
                                    <md-select name="type" id="type" v-model="event.type" md-dense :disabled="sending" placeholder="Please select">
                                        <md-option value="private">Private</md-option>
                                        <md-option value="p ublic">Public</md-option>
                                    </md-select>
                                </md-field>

                                <md-field :class="">
                                    <label for="title">Name</label>
                                    <md-input name="name" id="name" autocomplete="given-name" v-model="event.name" :disabled="sending" />
                                </md-field>

                                <md-field :class="">
                                    <label for="location">Location</label>
                                    <md-input name="location" id="location" autocomplete="given-location" v-model="event.location" :disabled="sending" />
                                </md-field>
                            </div>

                            <div class="md-layout-item md-small-size-100">
                                <div class="md-layout md-gutter">
                                    <div class="md-layout-item md-small-size-50">
                                        <label>START DATE</label>
                                        <date-picker v-model="event.start_date" :config="options"></date-picker>
                                    </div>
                                    <div class="md-layout-item md-small-size-50">
                                        <label>END DATE</label>
                                        <date-picker v-model="event.end_date" :config="options"></date-picker>
                                    </div>

                                </div>

                                <div class="md-layout md-gutter"
                                     v-for="(guest, key, index) in event.alt_start_date"
                                     :key="key">

                                    <div class="md-layout-item md-small-size-50">
                                        <label>START DATE</label>
                                        <date-picker v-model="event.alt_start_date[key]" :config="options"></date-picker>
                                    </div>

                                    <div class="md-layout-item md-small-size-50">
                                        <label>END DATE</label>
                                        <date-picker v-model="event.alt_end_date[key]" :config="options"></date-picker>
                                    </div>
                                        <div class="text-danger text-right w-100 mt-1 mr-3 closeAltDate" v-on:click="deleteAltDate(key)">

                                            <i class="fas fa-times-circle"><md-tooltip md-direction="bottom">Close</md-tooltip></i>
                                        </div>
                                </div>
                                <div class="text-center">
                                    <md-button type="button" class="md-primary" @click="AddAltDate">Add new alternative date</md-button>
                                </div>
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label for="about">About</label>
                                        <md-textarea name="about" id="about" autocomplete="given-about" v-model="event.about" :disabled="sending" />
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
                        <md-button type="button" class="md-primary" @click="cancel">Cancel</md-button>
                        <md-button type="submit" class="md-primary md-raised" :disabled="sending">Create Event</md-button>
                    </md-card-actions>
                </md-card>
                <md-snackbar :md-active.sync="eventSaved">The user saved event successfull!</md-snackbar>
            </form>
    </div>
</template>

<script>
    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "newGroupEvent",
        data() {
            return {
                event: {
                    name: null,
                    location: null,
                    start_date: null,
                    end_date: null,
                    about: null,
                    type: null,
                    alt_start_date: {},
                    alt_end_date: {},
                },
                alrDateIterator: 0,

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
                errors: null,
                apiUrl: config.apiUrl,

                sending: false,
                position: 'center',
                duration: 4000,

                eventSaved: false,

            };
        },
        methods: {
            AddAltDate(){
                this.alrDateIterator++;
                this.$set(this.event.alt_start_date,this.alrDateIterator, '');
                this.$set(this.event.alt_end_date,this.alrDateIterator, '');
            },
            deleteAltDate(key){
                this.$delete(this.event.alt_start_date,key);
                this.$delete(this.event.alt_end_date,key);
            },
            cancel() {
                this.$router.push({ name: 'someGroupPosts'})
            },
            createEvent(){
                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.event, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                this.sending = true;

                console.log('...creating event...');

                axios.post(this.apiUrl + '/group-events/' + this.$route.params.groupname, this.$data.event, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.eventSaved = true;
                        this.$router.push({ name: 'myGroupsList'});
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.sending = false;
                    })
            },
            getConstraints() {
                return {
                    type: {
                        presence: true,
                    },
                    name: {
                        presence: true,
                        length: {
                            minimum: 5,
                            message: 'Must be at least 5 characters long',
                            // maximum: 30,
                            // message: 'Must be at max 30 characters long',
                        }
                    },
                    location: {
                        presence: true,
                    },
                    start_date: {
                        presence: true,
                    },
                    end_date: {
                        presence: true,
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .errors {
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
    .fa-times-circle:hover{
        cursor: pointer;
    }
</style>