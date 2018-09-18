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
                <md-list-item :to="{ name: 'someGroupMembers' }">
                    <md-icon><i class="fas fa-users"></i></md-icon>
                    <span class="md-list-item-text">Members</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupEvents' }">
                    <md-icon><i class="far fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">Events</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupPosts' }">
                    <md-icon><i class="far fa-clipboard"></i></md-icon>
                    <span class="md-list-item-text">Post</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupTasks' }" >
                    <md-icon><i class="fas fa-thumbtack"></i></md-icon>
                    <span class="md-list-item-text">Tasks</span>
                </md-list-item>

                <md-list-item :to="{ name: 'someGroupChecklists' }"  >
                    <md-icon><i class="fas fa-tasks"></i></md-icon>
                    <span class="md-list-item-text">Checklists</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="fas fa-calendar-alt"></i></md-icon>
                    <span class="md-list-item-text">Duty roster</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="far fa-share-square"></i></md-icon>
                    <span class="md-list-item-text">Sharing</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="far fa-file-alt"></i></md-icon>
                    <span class="md-list-item-text">Documents</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="fas fa-file-signature"></i></md-icon>
                    <span class="md-list-item-text">Helping services</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="fas fa-book-open"></i></md-icon>
                    <span class="md-list-item-text">Notes</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="fas fa-cogs"></i></md-icon>
                    <span class="md-list-item-text">Group settings</span>
                </md-list-item>

                <md-list-item to="#" >
                    <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                    <span class="md-list-item-text">Exit group</span>
                </md-list-item>
            </md-list>
        </md-drawer>

        <md-content>
            <router-view></router-view>
        </md-content>
    </div>
    <!--<div class="page-container">
        <h1> The <span class="text-danger">{{ $route.params.groupname }}</span> group is here</h1>

        <router-view></router-view>
    </div>-->
</template>

<script>
    export default {
        name: "someGroup",
        data(){
            return {
                showSidepanel: false
            }
        }
    }
</script>

<style scoped>
    .page-container {
        min-height: 300px;
        overflow: hidden;
        position: relative;
        border: 1px solid rgba(#000, .12);
        background: #EFF3F6;
    }
    md-drawer {
        width: 230px;
        max-width: calc(100vw - 125px);
    }
    md-content {
        padding: 16px;
        background: none;
    }
</style>