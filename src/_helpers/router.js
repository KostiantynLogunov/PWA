import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from '../components/home/Home'
import Login from '../components/auth/Login'
import Registration from '../components/auth/Registration'
// import Activity from '../components/Activity'
import someGroup from '../components/group/someGroup'
import someGroupAllPosts from '../components/group/someGroupAllPosts'
import someGroupPosts from '../components/group/someGroupPosts'
import someGroupMembers from '../components/group/someGroupMembers'
import someGroupEvents from '../components/group/someGroupEvents'
import someGroupTasks from '../components/group/someGroupTasks'
import someGroupChecklists from '../components/group/someGroupChecklists'
import someGroupDutyRoster from '../components/group/someGroupDutyRoster'
// import someGroupSharing from '../components/group/someGroupSharing'
import someGroupDocuments from '../components/group/someGroupDocuments'
import someGroupServices from '../components/group/someGroupServices'
import someGroupNotes from '../components/group/someGroupNotes'
import someGroupSettings from '../components/group/someGroupSettings'
import newGroup from '../components/group/newGroup'
import newGroupEvent from '../components/group/newGroupEvent'
import myGroups from '../components/group/myGroups'
import myGroupsList from '../components/group/myGroupsList'
import User from '../components/user/User'
import ChatApp from '../components/messanger/ChatApp'
import MyServices from '../components/my-services/MyServices'
// import MyItems from '../components/my-items/MyItems'
// import MyBookingItem from '../components/my-booking-item/MyBookingItem'
import MyServiceBooking from '../components/my-service-booking/MyServiceBooking'
// import BookItemInGroup from '../components/group/BookItemInGroup'
import BookServiceInGroup from '../components/group/BookServiceInGroup'
import GroupInvite from '../components/group/GroupInvite'

Vue.use(VueRouter);
import { store } from '../_store'

const routes = [
	{
		name: 'login',
		path: '/login',
		component: Login,
	},
	{
		name: 'register',
		path: '/register',
		component: Registration,
		meta: {
			requiresAuth: false
		},
	},
    {
        name: 'home',
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
            {
                name: 'someGroupDutyRoster',
                path: 'duty-roster',
                component: someGroupDutyRoster,
            },
            /*{
                name: 'someGroupSharing',
                path: 'sharing',
                component: someGroupSharing,
                meta: {
                    requiresAuth: true
                },
            },
            {
                name: 'bookItemInGroup',
                path: 'sharing/book-item/:item_id',
                component: BookItemInGroup,
                meta: {
                    requiresAuth: true
                },
            },*/
            {
                name: 'someGroupDocuments',
                path: 'documents',
                component: someGroupDocuments,
                meta: {
                    requiresAuth: true
                },
            },
            {
                name: 'someGroupServices',
                path: 'services',
                component: someGroupServices,
                meta: {
                    requiresAuth: true
                },
            },
            {
                name: 'bookServiceInGroup',
                path: 'services/book-service/:service_id',
                component: BookServiceInGroup,
                meta: {
                    requiresAuth: true
                },
            },
            {
                name: 'someGroupNotes',
                path: 'notes',
                component: someGroupNotes,
            },
            {
                name: 'someGroupSettings',
                path: 'settings',
                component: someGroupSettings,
            },
        ]
    },

    {
        name: 'messenger',
        path: '/messenger',
        component: ChatApp,
        meta: {
            requiresAuth: true
        },
    },

    {
        name: 'services',
        path: '/my_services',
        component: MyServices,
        meta: {
            requiresAuth: true
        },
    },
    {
        name: 'book-service',
        path: '/book-services/:service_id',
        component: MyServiceBooking,
        meta: {
            requiresAuth: true
        },
    },
	{
        name: 'groupinvite',
        path: '/groupinvite/:token',
        component: GroupInvite,
        beforeEnter(from, to, next){
			store.dispatch('workWithInviteToken', from.params.token)
        	// next();
        }
    },

    /*{
        name: 'items',
        path: '/my_items',
        component: MyItems,
        meta: {
            requiresAuth: true
        },
    },
    {
        name: 'book-items',
        path: '/book-item/:item_id',
        component: MyBookingItem,
        meta: {
            requiresAuth: true
        },
    },*/


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