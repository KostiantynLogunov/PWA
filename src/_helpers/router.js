import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home'
import Login from '../components/auth/Login'
import Activity from '../components/Activity'
import someGroup from '../components/group/someGroup'
import someGroupPosts from '../components/group/someGroupPosts'
import someGroupMembers from '../components/group/someGroupMembers'
import newGroup from '../components/group/newGroup'
import myGroups from '../components/group/myGroups'
import myGroupsList from '../components/group/myGroupsList'
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
        // name: 'groups',
        path: '/groups',
        component: myGroups,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                name: 'myGroupsList',
                path: '/',
                component: myGroupsList,
            },
            {
                name: 'newGroup',
                path: 'new',
                component: newGroup,
            },
        ]
    },
    {
        // name: 'someGroup',
        path: '/groups/:groupname',
        component: someGroup,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                name: 'someGroupPosts',
                path: '',
                component: someGroupPosts,
            },
            {
                name: 'someGroupMembers',
                path: 'members',
                component: someGroupMembers,
            }
        ]
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