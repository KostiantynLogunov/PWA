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
    },
    getters: {
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
        }
    },
    mutations: {
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
    }
});