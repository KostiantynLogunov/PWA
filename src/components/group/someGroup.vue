<template>
    <div class="page-container md-layout-column">
        <md-toolbar>
            <div class="md-toolbar-section-end">
                <md-button @click="showSidepanel = true">Group Menu</md-button>
            </div>
        </md-toolbar>

        <md-drawer class="md-right" :md-active.sync="showSidepanel">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">Group Menu</span>
            </md-toolbar>

            <md-list>
                <md-list-item :to="{ name: 'someGroupMembers' }" @click="closeSideMenu">
                <!--<md-list-item @click.prevent="goToLink('someGroupMembers')">-->
                    <md-icon><i class="fas fa-users"></i></md-icon>
                    <span class="md-list-item-text">Members</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupEvents' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">Events</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupPosts' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-clipboard"></i></md-icon>
                    <span class="md-list-item-text">Posts</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupTasks' }"   @click="closeSideMenu">
                    <md-icon><i class="fas fa-thumbtack"></i></md-icon>
                    <span class="md-list-item-text">Tasks</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupChecklists' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-tasks"></i></md-icon>
                    <span class="md-list-item-text">Checklists</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupDutyRoster' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">Duty roster</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupSharing' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-share-square"></i></md-icon>
                    <span class="md-list-item-text">Sharing</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupDocuments' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-file-alt"></i></md-icon>
                    <span class="md-list-item-text">Documents</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupServices' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-file-signature"></i></md-icon>
                    <span class="md-list-item-text">Helping services</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupNotes' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-book-open"></i></md-icon>
                    <span class="md-list-item-text">Notes</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupSettings' }"  @click="closeSideMenu"  v-if="checkGroupAdmins(currentUser_id)">
                    <md-icon><i class="fas fa-cogs"></i></md-icon>
                    <span class="md-list-item-text">Group settings</span>
                </md-list-item>

                <md-list-item    @click="showConfirm = true">
                    <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                    <span class="md-list-item-text">Exit group
                        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
                    </span>
                </md-list-item>
            </md-list>
        </md-drawer>



        <md-content>
            <router-view></router-view>
        </md-content>
        <md-dialog-confirm
                :md-active.sync="showConfirm"
                md-title="Are you sure you want to exit from this group?"
                md-content="if you confirm you will leave this group."
                md-confirm-text="Agree"
                md-cancel-text="Disagree"
                @md-cancel="showConfirm = false"
                @md-confirm="unjoin" />
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroup",
        data(){
            return {
                showSidepanel: false,
                showConfirm: false,
                pandingResponseServer: false,
                errors: false,

                currentUser_id: null,
                groupAdminsID: [],
            }
        },
        beforeCreate(){
            this.$store.dispatch('getAllUsers');
        },
        created() {
            this.getGroupAdminsId();
        },

        mounted(){
            this.currentUser_id = this.$store.getters.currentUser.id;
        },

        methods: {
            getGroupAdminsId(){
                axios.get(config.apiUrl + '/group_admins_id/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupAdminsID = response.data.admins_id;
                    });
            },

            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            closeSideMenu() {
                this.showSidepanel = false;
            },

            unjoin() {
                this.showConfirm = false;

                this.pandingResponseServer = true;

                axios.delete(config.apiUrl + '/group-unjoin/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.showSidepanel = false;
                        this.$router.push({name: 'myGroupsList'})
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            }
        },
    }
</script>

<style scoped>
    .page-container {
        min-height: 100vh;
        overflow: hidden;
        position: relative;
        background: #EFF3F6;
        padding: 0;
        margin: 0;
    }
    md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
        padding: 0;
        margin: 0;
    }
    md-content {
        padding: 0;
        margin: 0;
        background: none;
    }
</style>