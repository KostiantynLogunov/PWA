<template>
    <div class="page-container md-layout-column">
        <br>
        <md-tabs  md-alignment="centered">
            <md-tab :key="key" id="tab-home" :md-label="$lang.groups.all" style="min-height: 120px;">
                <md-list class="md-triple-line" v-if="group_events">
                    <md-list-item  v-for="event in group_events" :key="event.id">
                        <md-avatar v-if="event.user.avatar">
                            <img :src="event.user.avatar" alt="People">
                        </md-avatar>
                        <md-avatar v-else>
                            <img :src="avatarDefaultUrl" alt="">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ event.timeline.name }}</span>
                        </div>
                            <span class="md-primary">{{ event.created_at }}</span>
                    </md-list-item>
                </md-list>
                <md-list v-else>
                    <div class="alert alert-warning">{{$lang.messages.no_events_added_yet}}</div>
                </md-list>
            </md-tab>

            <md-tab id="tab-pages" :md-label="$lang.groups.ongoing">
                <md-list class="md-triple-line" v-if="ongoing_events">
                    <md-list-item v-for="event in ongoing_events" :key="event.id">
                        <md-avatar v-if="event.user">
                            <img :src="event.user.avatar" alt="People">
                        </md-avatar>
                        <md-avatar v-else>
                            <img :src="avatarDefaultUrl" alt="">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ event.timeline.name }}</span>
                        </div>

                        <span class="md-primary">{{ event.created_at }}</span>
                    </md-list-item>
                </md-list>
                <md-list v-else>
                    <div class="alert alert-warning">{{$lang.messages.no_events_added_yet}}</div>
                </md-list>
            </md-tab>

            <md-tab id="tab-posts" :md-label="$lang.groups.upcoming">
                <md-list class="md-triple-line" v-if="upcoming_events">
                    <md-list-item v-for="event in upcoming_events" :key="event.id">
                        <md-avatar v-if="event.user">
                            <img :src="event.user.avatar" alt="People">
                        </md-avatar>
                        <md-avatar v-else>
                            <img :src="avatarDefaultUrl" alt="">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ event.timeline.name }}</span>
                            <!--<span>Brunch this weekend?</span>-->
                        </div>

                        <!--<md-button class="md-icon-button md-list-action">-->
                        <span class="md-primary">{{ event.created_at }}</span>
                        <!--</md-button>-->
                    </md-list-item>
                    <!--{{ updateRender()}}-->
                </md-list>
                <md-list v-else>
                    <div class="alert alert-warning">{{$lang.messages.no_events_added_yet}}</div>
                </md-list>
            </md-tab>

            <md-tab id="tab-new" :md-label="$lang.groups.new" v-if="checkGroupAdmins(currentUser_id)">
                <div class="text-center">
                    <md-button type="button" class="md-raised md-primary" @click="CreateEvent">{{$lang.buttons.create_event}}</md-button>
                </div>
            </md-tab>

        </md-tabs>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupEvents",
        data() {
            return {
                key: 0,
                group_events: [],
                ongoing_events: [],
                upcoming_events: [],
                sending: false,
                avatarDefaultUrl: config.avatarDefaultUrl,
                errors: false,

                currentUser_id: null,
                groupAdminsID: [],
            }
        },
        created() {
            this.getEvents();
            this.currentUser_id = this.$store.getters.currentUser.id;
        },
        methods: {
            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            getEvents(){
                axios.get(config.apiUrl + '/group-events/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.group_events = response.data.group_events;
                        this.ongoing_events = response.data.ongoing_events;
                        this.upcoming_events = response.data.upcoming_events;
                        this.groupAdminsID = response.data.admins_id;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    });
            },

            CreateEvent(){
                this.$router.push({ name: 'newEvent'})
            },

        },
        computed:{
            updateRender(){
                this.$forceUpdate;
            }
        }
    }
</script>

<style scoped>

    md-list {
        width: 320px;
        max-width: 100%;
        display: inline-block;
        vertical-align: top;
        border: 1px solid rgba(#000, .12);
    }
</style>