import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/Home'
import Login from '../components/auth/Login'
import Activity from '../components/Activity'
import someGroup from '../components/group/someGroup'
import someGroupAllPosts from '../components/group/someGroupAllPosts'
import someGroupPosts from '../components/group/someGroupPosts'
import someGroupMembers from '../components/group/someGroupMembers'
import someGroupEvents from '../components/group/someGroupEvents'
import someGroupTasks from '../components/group/someGroupTasks'
import someGroupChecklists from '../components/group/someGroupChecklists'
import newGroup from '../components/group/newGroup'
import newGroupEvent from '../components/group/newGroupEvent'
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
                name: 'someGroupAllPosts',
                path: '',
                component: someGroupAllPosts,
            },
            {
                name: 'someGroupMembers',
                path: 'members',
                component: someGroupMembers,
            },
            {
                name: 'someGroupEvents',
                path: 'events',
                component: someGroupEvents,
            },
            {
                name: 'newEvent',
                path: 'new-event',
                component: newGroupEvent,
            },
            {
                name: 'someGroupPosts',
                path: 'posts',
                component: someGroupPosts,
            },
            {
                name: 'someGroupTasks',
                path: 'tasks',
                component: someGroupTasks,
            },
            {
                name: 'someGroupChecklists',
                path: 'checklists',
                component: someGroupChecklists,
            },
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