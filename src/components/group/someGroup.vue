<template>
    <div class="page-container md-layout-column">
        <md-toolbar>
            <div class="md-toolbar-section-end">
                <md-button @click="showSidepanel = true">{{$lang.group_menu.group_menu}}</md-button>
            </div>
        </md-toolbar>

        <md-drawer class="md-right" :md-active.sync="showSidepanel">
            <md-toolbar class="md-transparent" md-elevation="0">
                <span class="md-title">{{$lang.group_menu.group_menu}}</span>
            </md-toolbar>

            <md-list>
                <md-list-item :to="{ name: 'someGroupMembers' }" @click="closeSideMenu">
                <!--<md-list-item @click.prevent="goToLink('someGroupMembers')">-->
                    <md-icon><i class="fas fa-users"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.members}}</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupEvents' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.events}}</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupPosts' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-clipboard"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.posts}}</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupTasks' }"   @click="closeSideMenu">
                    <md-icon><i class="fas fa-thumbtack"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.tasks}}</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupChecklists' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-tasks"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.checklists}}</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupDutyRoster' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.duty_roster}}</span>
                </md-list-item>

                <!--<md-list-item  :to="{ name: 'someGroupSharing' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-share-square"></i></md-icon>
                    <span class="md-list-item-text">Sharing</span>
                </md-list-item>-->

                <md-list-item  :to="{ name: 'someGroupDocuments' }"  @click="closeSideMenu">
                    <md-icon><i class="far fa-file-alt"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.documents}}</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupServices' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-share-square"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.sharing}}</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupNotes' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-book-open"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.notes}}</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupSettings' }"  @click="closeSideMenu"  v-if="checkGroupAdmins(currentUser_id)">
                    <md-icon><i class="fas fa-cogs"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.group_settings}}</span>
                </md-list-item>

                <md-list-item    @click="showConfirm = true">
                    <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                    <span class="md-list-item-text">{{$lang.group_menu.exit_group}}
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
                :md-title="$lang.messages.are_you_sure_exit_from_group"
                :md-content="$lang.messages.if_confirm_you_leave_group"
                :md-confirm-text="$lang.buttons.agree"
                :md-cancel-text="$lang.buttons.disagree"
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
                        console.log(err.response.data.message || err.response.data ||  err.message || err.data);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            }
        },
    }
</script>

<style lang="scss" scoped>
	.phone-viewport {
		width: 322px;
		height: 200px;
		display: inline-flex;
		align-items: flex-end;
		overflow: hidden;
		border: 1px solid rgba(#000, .26);
		background: rgba(#000, .06);
	}
</style>

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