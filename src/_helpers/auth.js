import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios);

export function login(credentials) {
    return new Promise((resolve, reject) => {
        axios.post('http://social.loc/api/auth/login', credentials)
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