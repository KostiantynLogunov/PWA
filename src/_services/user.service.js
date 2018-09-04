// import { config } from '../_services';
import { authHeader } from '../_helpers';

import Vue from 'vue'
// console.log(config)

let apiUrl = 'http://social.loc/api';

export const userService = {
    login,
    logout,
    getAll
};

function login(email, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : '*' },
        body: JSON.stringify({ email, password })
    };
    Vue.http.post('auth/login', JSON.stringify({ email, password }))
        .then(handleResponse)
        .then(user => {
            // console.log(user);
            console.log(user.token);
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }
            return user;
        });

    /*return fetch(`${apiUrl}/auth/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });*/
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getAll() {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`${apiUrl}/users`, requestOptions).then(handleResponse);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}