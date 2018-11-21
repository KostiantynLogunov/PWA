<template>
	<div>
		    <div class="page-container ">
				<md-app md-mode="reveal">
					<md-app-toolbar class="md-primary">
						<md-button class="md-icon-button" @click="menuVisible = !menuVisible">
							<md-icon>menu</md-icon>
						</md-button>
						<span class="md-title">OMC</span>

						<div class="md-toolbar-section-end">
							<md-menu>
								<md-button class="md-icon-button" @click="" md-menu-trigger>
									<!--<md-icon>more_vert</md-icon>-->
									{{language}}
								</md-button>
								<md-menu-content>
									<md-menu-item @click="changeLanguage('en')">
										<span>EN</span>
										<!--<md-icon>add</md-icon>-->
									</md-menu-item>

									<md-menu-item @click="changeLanguage('pt')">
										<span>PT</span>
										<!--<md-icon>add</md-icon>-->
									</md-menu-item>
								</md-menu-content>
							</md-menu>
						</div>

					</md-app-toolbar>

					<md-app-drawer :md-active.sync="menuVisible">
						<md-toolbar class="md-transparent" md-elevation="0">{{$lang.left_menu.main_menu}}</md-toolbar>

						<md-list>
							<md-list-item @click.prevent="goRegister" v-if="!currentUser">
								<md-icon><i class="fas fa-user-plus"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.sign_up}}</span>
							</md-list-item>

							<md-list-item @click.prevent="goLogin" v-if="!currentUser">
								<md-icon><i class="fas fa-sign-in-alt"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.login}}</span>
							</md-list-item>

							<md-list-item @click.prevent="goHome" v-if="currentUser">
								<md-icon>move_to_inbox</md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.home}}</span>
							</md-list-item>

							<md-list-item @click.prevent="goGroups" v-if="currentUser">
								<md-icon><i class="fas fa-users"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.groups}}</span>
							</md-list-item>

							<md-list-item @click.prevent="goMessenger" v-if="currentUser">
								<md-icon><i class="far fa-comments"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.messenger}}</span>
							</md-list-item>

							<md-list-item @click.prevent="goMyServices" v-if="currentUser">
								<md-icon><i class="fas fa-share-square"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.sharing}}</span>
							</md-list-item>

							<md-list-item v-if="currentUser" @click.prevent="logout">
								<md-icon><i class="fas fa-sign-out-alt"></i></md-icon>
								<span class="md-list-item-text" >{{$lang.left_menu.logout}}</span>
							</md-list-item>

							<md-list-item @click.prevent="">
								<md-icon><i class="fas fa-info-circle"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.about}}</span>
							</md-list-item>

							<md-list-item @click.prevent="">
								<md-icon><i class="fas fa-user-secret"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.privacy}}</span>
							</md-list-item>

							<md-list-item @click.prevent="">
								<md-icon><i class="fas fa-at"></i></md-icon>
								<span class="md-list-item-text">{{$lang.left_menu.contact}}</span>
							</md-list-item>
						</md-list>
					</md-app-drawer>

					<md-app-content  style="background: #EFF3F6" >
						<!--<div class="phone-viewport">-->
							<router-view></router-view>
							<md-bottom-bar md-type="shift" v-if="currentUser">
								<md-bottom-bar-item md-label="Home" md-icon="home" @click="goHome"></md-bottom-bar-item>

								<md-bottom-bar-item md-label="Chat" class="md-icon-button" @click="goMessenger">
									<!--<span class="badge badge-danger" v-if="countNewMessages>0"></span>-->
									<i class="fas fa-envelope fa-pulse text-danger" v-if="newSms"></i>
									<md-icon>chat</md-icon>
								</md-bottom-bar-item>
								<md-menu>
									<md-bottom-bar-item  md-label="Create" md-icon="add" class="md-icon-button" md-menu-trigger></md-bottom-bar-item>
									<md-menu-content>
										<md-menu-item @click="goCreateNewGroup">
											<span>New Group</span>
											<md-icon>add</md-icon>
										</md-menu-item>

										<md-menu-item @click="">
											<span>New Event</span>
											<md-icon>add</md-icon>
										</md-menu-item>
									</md-menu-content>
								</md-menu>

								<md-bottom-bar-item md-label="Settings" md-icon="settings" @click="goSettings"></md-bottom-bar-item>
							</md-bottom-bar>
						<!--</div>-->
					</md-app-content>
				</md-app>
		    </div>
	</div>
</template>

<script>
    /* eslint-disable */
    import axios from 'axios'
    import { config } from './_services/config'
    import Echo from 'laravel-echo'

    export default {
        name: 'app',

        data: function () {
            return {
                menuVisible: false,
                // showSidepanel: false
	            countNewMessages: 1,
	            language: null,
	            newSms: null,
	            user: null,
	            groups: null
            }
        },

	    created()
	    {
		    let lang = localStorage.getItem("lang");
		    if (lang == null || lang == undefined)
		    {
			    lang = 'en';
			    localStorage.setItem("lang", lang );
			    this.$lang.setLang(lang);
			    this.language = 'en';
		    } else {
			    this.$lang.setLang(lang);
			    this.language = lang;
		    }
	    },

	    mounted()
	    {
		    this.user = this.$store.getters.currentUser;

		    if (this.user) {
			    var io = require('socket.io-client');
			    // var socket = io.connect('http://pwa.mybest.com.ua:6001');
			    var socket = io.connect('http://192.168.13.13:3000');

			    socket.on("news-action." + this.user.id + ":App\\Events\\PrivateMessage", function (data)
			    {
				    localStorage.setItem("newSmsFrom", data.message.from);
				    this.newSms = data.message.from;
			    }.bind(this));


			    /*if (localStorage.getItem("allUserGroups"))
			    {
				    // console.log('user E');
				    // console.log(localStorage.getItem("allUserGroups"));
				    let userGroups = JSON.parse(localStorage.getItem("allUserGroups"));
				    // if (userGroups == null || userGroups == undefined) {
					//     this.$store.dispatch('getUserGroups');
				    // }
				    if (userGroups != null || userGroups != undefined) {
					    window.Echo = new Echo({
						    broadcaster: 'socket.io',
						    host: 'http://social.loc:6006',
						    auth:
							    {
								    headers:
									    {
										    "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
									    }
							    }
					    });

					    for (let group of userGroups) {
						    console.log(group.id);
						    window.Echo.private('group-room.' + group.id)
							    .listen('PrivateChat', ({data}) => {
								    console.log(data);
								    // if (message.name != this.$store.getters.currentUser.name)
								    // this.messages.push(data.body)
							    });
					    }
				    }
			    }*/
		    }



	    },

        computed: {
            currentUser() {

                return this.$store.getters.currentUser
            }
        },

	    /*watch:{
        	'$store.state.allUserGroups' : function (newVal, oldVal) {
        		/!*console.log('new ' + val);
        		console.log('old ' + oldVal);*!/
		        if (this.$store.state.allUserGroups != null) {
			        console.log('user E');

			        let userGroups = JSON.parse(localStorage.getItem("allUserGroups"));
			        console.log(userGroups);
			        window.Echo = new Echo({
				        broadcaster: 'socket.io',
				        host: 'http://social.loc:6006',
				        auth:
					        {
						        headers:
							        {
								        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
							        }
					        }
			        });

			        for (let group of userGroups) {
				        console.log(group.id);
				        window.Echo.private('group-room.' + group.id)
				        // this.channel(group.id)
					        .listen('PrivateChat', ({data}) => {
						        console.log(data);
						        // if (message.name != this.$store.getters.currentUser.name)
						        // this.messages.push(data.body)
					        });
			        }
		        }
		        if (newVal == null)
		        {
			        for (let group of oldVal) {
				        window.Echo.leave('group-room.' + group.id);
			        }

		        }
	        }
	    },*/

        methods: {
	        changeLanguage(lang){
	            console.log('changed language to ' + lang);
	             // lang = 'pt';
		        this.$lang.setLang(lang);
		        localStorage.setItem("lang", lang);
		        this.language = lang;
	        },

	        goCreateNewGroup(){
		        this.$router.push({name: 'newGroup'})
	        },

	        goSettings(){
		        // console.log('some Settings...' + this.$store.getters.currentUser.username);
		        this.$router.push({name: 'profile', params: {username: this.$store.getters.currentUser.username}});
	        },

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
	            this.newSms = null;
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
<style lang="scss" scoped>
	.phone-viewport {
		width: 100%;
		height: 100vh;
		display: inline-flex;
		align-items: flex-end;
		overflow: hidden;
		border: 1px solid rgba(#000, .26);
		background: rgba(#EFF3F6, .06);
	}
</style>

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


</style>

