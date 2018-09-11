import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home'
import Login from '../components/auth/Login'
import Activity from '../components/Activity'
import Groups from '../components/user/Groups'
import User from '../components/user/User'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Home,
        meta: {
            requiresAuth: true
        },
    },
    {
        name: 'groups',
        path: '/groups',
        component: Groups,
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/activity',
        component: Activity
    },
    {
        name: 'user',
        path: ':username',
        component: User,
        meta: {
            requiresAuth: true
        },
    },
    // otherwise redirect to home
    {
        path: '*',
        redirect: '/'
    }
];

export const router = new VueRouter({
    routes,
    mode: 'history'
});