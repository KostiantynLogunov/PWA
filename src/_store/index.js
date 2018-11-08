import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import { getLocalUser, getAllUsers } from "../_helpers/auth";
import axios from "axios/index";
import {config} from '../_services/config'
import { router } from '../_helpers';

const user = getLocalUser();
const allUser = getAllUsers();

export const store = new Vuex.Store({

    state: {
        currentUser: user,
        isLoggedIn: !!user,
        loading: false,
        auth_error: null,
        groupsManage: [],
        groupsJoined: [],
        groupPosts: [],

        allUsers: allUser,

	    // aboutInvite: null
    },

    getters: {
    	/*getAboutInfo(state){
		    return state.aboutInvite;
	    },*/
        getAllUsers(state){
          return state.allUsers;
        },
        isLoading(state){
            return state.loading;
        },
        isLoggedIn(state){
            return state.isLoggedIn;
        },
        auth_error(state){
            return state.auth_error;
        },
        currentUser(state){
            return state.currentUser    ;
        },
        groupsManage(state){
            return state.groupsManage;
        },
        groupsJoined(state){
            return state.groupsJoined;
        },
        groupPosts(state) {
            return state.groupPosts;
        }
    },

    mutations: {
    	/*setAboutInvate(state, message){
    		state.aboutInvite = message;
	    },
	    clearAboutInvate(state){
		    state.aboutInvite = null;
	    },*/
        setAllUsers(state, payload) {
            let AllUsers = payload;
            let countUsers = AllUsers.length;
            let objUsers = {};
            for (let i = 0; i < countUsers; i++)
                objUsers[AllUsers[i].id] = AllUsers[i].name;

            state.allUsers = objUsers;

            localStorage.setItem("allUsers", JSON.stringify(objUsers));
        },
        loginSuccess(state, payload) {
            state.auth_error = null;
            state.isLoggedIn = true;
            state.loading = false;
            state.currentUser = Object.assign({}, payload.user, {token: payload.access_token});

            localStorage.setItem("user", JSON.stringify(state.currentUser));
        },
        loginFailed(state, payload) {
            state.loading = false;
            state.auth_error = payload.error;
        },
        login(state) {
            state.loading = true;
            state.auth_error = null;
        },
        logout(state) {
            localStorage.removeItem("user");
            state.isLoggedIn = false;
            state.currentUser =null;
        },
        updateGroups(state, data){
            state.groupsManage = data.own_groups;
            state.groupsJoined = data.joingroup;
        },
        updateGroupPosts(state, data) {
            state.groupPosts = data.groupPosts;
        }
    },

    actions: {
        login(store) {
            store.commit('login');
        },

        getGroups(store) {
            axios.get(config.apiUrl + '/mygroups', {
                headers: {
                    "Authorization": `Bearer ${store.state.currentUser.token}`
                }
            })
                .then((response) => {
                    store.commit('updateGroups', response.data)
                })
                /*.catch((err) => {
                    console.log(err);
                    reject("errorr!!");
                })*/
        },

        getGroupPosts(store) {
            axios.get(config.apiUrl + '/group-posts', {
                headers: {
                    "Authorization": `Bearer ${store.state.currentUser.token}`
                }
            })
                .then((response) => {
                    store.commit('updateGroupPosts', response.data)
                })
            /*.catch((err) => {
                console.log(err);
                reject("errorr!!");
            })*/
        },

        getAllUsers(store){
            axios.get(config.apiUrl + '/search_users', {
                headers: {
                    "Authorization": `Bearer ${store.state.currentUser.token}`
                }
            })
                .then((response) => {
                    store.commit('setAllUsers', response.data.data);
                })
        },

	    workWithInviteToken(store, inviteToken)
	    {
			console.log(inviteToken);
			let user_id = null;
			if (store.state.currentUser)
				user_id = store.getters.currentUser.id;

			let data = {
				inviteToken: inviteToken,
				user_id: user_id,
			};

		    axios.post(config.apiUrl + '/groupinvite', data)
			    .then((response) => {
			    	// console.log(response.data.message);
				    // localStorage.setItem("AboutInvate", response.data.message);
			    	if (response.data.status == 'go group'){
					    router.push({ name: 'someGroupAllPosts', params: { groupname: response.data.group_alias }});
				    }
				    else if (response.data.status == 'fail'){
					    router.push({ name: 'home'});
				    } else if (response.data.status == 'go login'){
					    console.log('go login');
					    localStorage.setItem("inviteToken", inviteToken);
					    router.push({ name: 'login'});
				    }
			    })
			    .catch((err) => {
				    // console.log(err);
			    })
	    }
    },

    // strict: process.env.NODE_ENV !== 'production'
});