// import { config } from '../_services';
import { authHeader } from '../_helpers';

import Vue from 'vue'

 let apiUrl = 'http://social.loc/api';
// let apiUrl = 'http://social.mybest.com.ua/api';

export const userService = {
    login,
    logout,
    getAll
};

async function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' },
        body: JSON.stringify({ email, password })
    };

    let promise = new Promise((resolve, reject) => {

        Vue.http.post('auth/login', JSON.stringify({ email, password }))
            .catch((error) => {
                console.log(error);

                reject(error.data && error.data.msg ? error.data && error.data.msg : 'Something went wrong.');
            })
            .then(response => {

                let user = response.body;

                if (user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(user));
                }
                 resolve (user);
            });
    });

    return promise;
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}


