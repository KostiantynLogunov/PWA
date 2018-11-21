<template>
    <div class="page-container md-layout-column">
	    <!--SNACKBAR-->
	    <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagAboutInvite">
		    <span>{{ messageAboutInvite }}</span>
		    <md-button class="md-accent" @click="flagAboutInvite = false">Close</md-button>
	    </md-snackbar>
	    <!--SNACKBAR-->

        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate"
                             v-if="pandingResponseServer"></md-progress-spinner>
        <div class="alert alert-warning" v-if="allActivity.length == 0">No posts were found...</div>

        <div v-for="activity in allActivity" :key="activity.id">
            <div v-if="activity.type == 'event'">
                <one-event :event="activity"></one-event>
            </div>
            <div v-if="activity.type == 'task'">
                <one-task :task="activity"></one-task>
            </div>
            <div v-if="activity.type == 'checklist'">
                <one-checklist :checklist="activity"></one-checklist>
            </div>
            <div v-if="activity.type == 'service'">
                <one-services-request :service="activity"></one-services-request>
            </div>
            <div v-if="activity.type == null">
                <one-post :post="activity"></one-post>
            </div>
            <br>
        </div>
    </div>
</template>

<script>

    import axios from 'axios'
    import {config} from '../../_services/config'

    import OnePost from './OnePost'
    import OneEvent from './OneEvent'
    import OneTask from './OneTask'
    import OneChecklist from './OneChecklist'
    import OneServicesRequest from './OneServicesRequest'

    export default {
        data() {
            return {
                pandingResponseServer: false,
                allActivity: [],

	            position: 'center',
	            duration: 4000,

	            messageAboutInvite: null,
	            flagAboutInvite: false
            }
        },

        mounted() {
            this.getActivity();

	        /*this.messageAboutInvite = localStorage.getItem("AboutInvate");
			console.log('localStorage on login = ' + this.messageAboutInvite);
			if (this.messageAboutInvite ) {
				localStorage.removeItem('AboutInvate');
				this.flagAboutInvite = true;
			}*/
        },

        methods: {
            getActivity() {
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/groups_activity', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        this.allActivity = response.data.activity;
                        this.allActivity = this.allActivity.reverse();
                        this.pandingResponseServer = false;
                        // console.log(this.allActivity);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        },

        components: {
            OnePost, OneEvent, OneTask, OneChecklist, OneServicesRequest
        }
    };
</script>
