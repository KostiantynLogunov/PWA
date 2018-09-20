<template>
    <div class="page-container md-layout-column">
        <br>
        <md-tabs  md-alignment="centered">
            <md-tab id="tab-home" md-label="All" style="min-height: 120px;">
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
                    <div class="alert alert-warning">No events added yet!</div>
                </md-list>
            </md-tab>

            <md-tab id="tab-pages" md-label="Ongoing">
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
                    <div class="alert alert-warning">No events added yet!</div>
                </md-list>
            </md-tab>

            <md-tab id="tab-posts" md-label="Upcoming">
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
                </md-list>
                <md-list v-else>
                    <div class="alert alert-warning">No events added yet!</div>
                </md-list>
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
                group_events: [],
                ongoing_events: [],
                upcoming_events: [],
                sending: false,
                avatarDefaultUrl: config.avatarDefaultUrl,
            }
        },
        created() {
            this.getEvents();
        },
        methods: {
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
                    });
            },
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