<template>

    <div class="page-container">
        <md-app md-mode="reveal">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <md-icon>menu</md-icon>
                </md-button>
                <span class="md-title">OMC</span>

                <div class="md-toolbar-section-end" v-if="$route.name === 'myGroupsList' || $route.matched[0].name === 'groups'">
                    <md-button class="md-icon-button">
                        <i class="fas fa-chevron-circle-down"></i>
                        <!--<md-icon>more_very</md-icon>-->
                    </md-button>
                </div>
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0">Actions:</md-toolbar>

                <md-list>
                    <md-list-item to="/">
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">Home page</span>
                    </md-list-item>

                    <md-list-item to="/groups" v-if="currentUser">
                        <md-icon><i class="fas fa-users"></i></md-icon>
                        <span class="md-list-item-text">Groups</span>
                    </md-list-item>


                    <md-list-item to="/activity">
                        <md-icon>send</md-icon>
                        <span class="md-list-item-text">Activity</span>
                    </md-list-item>


                    <md-list-item v-if="currentUser" @click.prevent="logout">
                        <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                        <span class="md-list-item-text" >Logout</span>
                    </md-list-item>

                </md-list>
            </md-app-drawer>

            <md-app-content  style="background: #EFF3F6" >


                <!--<div class="jumbotron">
                    <div class="container">
                        <div class="row">
                            <div class="col-sm-6 offset-sm-3">
                                &lt;!&ndash;<div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>&ndash;&gt;

                            </div>
                        </div>
                    </div>
                </div>-->

                <router-view></router-view>

            </md-app-content>
        </md-app>

    </div>


</template>

<script>
    /* eslint-disable */
    export default {
        name: 'app',
        data: function () {
            return {
                menuVisible: false,
            }
        },
        computed: {
            currentUser() {
                return this.$store.state.currentUser
            }
        },
        methods: {
            logout() {
                this.$store.commit('logout');
                this.$router.push('/login');
                this.menuVisible = false;
            }
        }
    }
</script>

<style>
    .page-container{
        background: #EFF3F6;
    }
    body{
        height: 300px;

    }
</style>

