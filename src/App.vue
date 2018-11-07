<template>

    <div class="page-container">
        <md-app md-mode="reveal">
            <md-app-toolbar class="md-primary">
                <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
                    <md-icon>menu</md-icon>
                </md-button>

                <span class="md-title">OMC</span>

                <!--<div class="md-toolbar-section-end" v-if=" $route.name === 'someGroupPosts' ">
                    <md-button class="md-icon-button" @click="showSidepanel = true">
                        <i class="fas fa-chevron-circle-down" @click="showSidepanel = true"></i>
                        &lt;!&ndash;<md-icon>more_very</md-icon>&ndash;&gt;
                    </md-button>
                </div>-->
            </md-app-toolbar>

            <md-app-drawer :md-active.sync="menuVisible">
                <md-toolbar class="md-transparent" md-elevation="0">Main Menu:</md-toolbar>

                <md-list>
	                <md-list-item @click.prevent="goRegister" v-if="!currentUser">
		                <md-icon><i class="fas fa-user-plus"></i></md-icon>
		                <span class="md-list-item-text">Sign Up</span>
	                </md-list-item>

	                <md-list-item @click.prevent="goLogin" v-if="!currentUser">
		                <md-icon><i class="fas fa-sign-in-alt"></i></md-icon>
		                <span class="md-list-item-text">Login</span>
	                </md-list-item>





                    <md-list-item @click.prevent="goHome" v-if="currentUser">
                        <md-icon>move_to_inbox</md-icon>
                        <span class="md-list-item-text">Home page</span>
                    </md-list-item>

                    <md-list-item @click.prevent="goGroups" v-if="currentUser">
                        <md-icon><i class="fas fa-users"></i></md-icon>
                        <span class="md-list-item-text">Groups</span>
                    </md-list-item>


                    <md-list-item @click.prevent="goMessenger" v-if="currentUser">
                        <md-icon><i class="far fa-comments"></i></md-icon>
                        <span class="md-list-item-text">Messenger</span>
                    </md-list-item>

                    <md-list-item @click.prevent="goMyServices" v-if="currentUser">
                        <md-icon><i class="fas fa-share-square"></i></md-icon>
                        <span class="md-list-item-text">Sharing</span>
                    </md-list-item>

                    <!--<md-list-item @click.prevent="goMyItems">
                        <md-icon><i class="fas fa-thumbtack"></i></md-icon>
                        <span class="md-list-item-text">My items</span>
                    </md-list-item>-->

                    <md-list-item v-if="currentUser" @click.prevent="logout">
                        <md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
                        <span class="md-list-item-text" >Logout</span>
                    </md-list-item>


	                <md-list-item @click.prevent="">
		                <md-icon><i class="fas fa-info-circle"></i></md-icon>
		                <span class="md-list-item-text">About</span>
	                </md-list-item>

	                <md-list-item @click.prevent="">
		                <md-icon><i class="fas fa-user-secret"></i></md-icon>
		                <span class="md-list-item-text">Privacy</span>
	                </md-list-item>

	                <md-list-item @click.prevent="">
		                <md-icon><i class="fas fa-at"></i></md-icon>
		                <span class="md-list-item-text">Contact</span>
	                </md-list-item>

                </md-list>
            </md-app-drawer>

            <md-app-content  style="background: #EFF3F6" >

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
                // showSidepanel: false
            }
        },

        computed: {
            currentUser() {
                return this.$store.getters.currentUser
            }
        },

        methods: {
            goMyItems(){
                this.menuVisible = false;
                this.$router.push('/my_items');
            },

            goMyServices(){
                this.menuVisible = false;
                this.$router.push('/my_services');
            },

            goMessenger(){
                this.menuVisible = false;
                this.$router.push('/messenger');
            },

            logout() {
                this.$store.commit('logout');
                this.$router.push('/login');
                this.menuVisible = false;
            },
            goGroups() {
                this.menuVisible = false;
                this.$router.push('/groups');

            },
            goHome() {
                this.menuVisible = false;
                this.$router.push('/');
            },

	        goRegister() {
		        this.menuVisible = false;
		        this.$router.push({ name: 'register' });
	        },

	        goLogin() {
		        this.menuVisible = false;
		        this.$router.push({ name: 'login' });
	        }

        }
    }
</script>

<style>
    .page-container{
        background: #EFF3F6;
    }
    md-app-drawer {
        width: 150px;
        max-width: calc(100vw - 125px);
    }
    md-content {
        padding: 0;
    }
    .md-content {
        padding: 0;
    }
    .md-app{
        min-height: 100vh;
    }

</style>

