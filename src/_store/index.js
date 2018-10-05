import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import { getLocalUser } from "../_helpers/auth";
import axios from "axios/index";
import {config} from '../_services/config'

const user = getLocalUser();

export const store = new Vuex.Store({
    state: {
        currentUser: user,
        isLoggedIn: !!user,
        loading: false,
        auth_error: null,
        groupsManage: [],
        groupsJoined: [],
        groupPosts: [],

        allUsers: null,
    },
    getters: {
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
        setAllUsers(state, payload) {
            let AllUsers = payload;
            let countUsers = AllUsers.length;
            let objUsers = {};
            for (let i = 0; i < countUsers; i++)
                objUsers[AllUsers[i].id] = AllUsers[i].name;

            state.allUsers = objUsers;
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
    }
});