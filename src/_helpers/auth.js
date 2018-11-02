import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import {config} from '../_services/config'

Vue.use(VueAxios, axios);

export function login(credentials) {
    return new Promise((resolve, reject) => {
        // axios.post('http://social.loc/api/auth/login', credentials)
        axios.post(config.apiUrl + '/auth/login', credentials)
            .then((response) => {
                resolve(response.data);
            })
            .catch((err) => {
                reject("Wrong email or password");
            })
    })
}

export function getLocalUser() {
    const userStr = localStorage.getItem("user");

    if (!userStr) {
        return null;
    }

    return JSON.parse(userStr);
}

export function getAllUsers() {
    const allUserStr = localStorage.getItem("allUsers");

    if (!allUserStr) {
        return null;
    }

    return JSON.parse(allUserStr);
}