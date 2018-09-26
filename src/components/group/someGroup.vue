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

                <md-list-item  :to="{ name: 'someGroupSettings' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-cogs"></i></md-icon>
                    <span class="md-list-item-text">Group settings</span>
                </md-list-item>

                <md-list-item  :to="{ name: 'someGroupExit' }"  @click="closeSideMenu">
                    <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                    <span class="md-list-item-text">Exit group</span>
                </md-list-item>
            </md-list>
        </md-drawer>

        <md-content>
            <router-view></router-view>
        </md-content>
    </div>
</template>

<script>
    export default {
        name: "someGroup",
        data(){
            return {
                showSidepanel: false
            }
        },
        methods: {
            closeSideMenu() {
                this.showSidepanel = false;
                // this.$router.push({ name: link });
            },

        }
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