import axios from 'axios'

export function initialize(store, router) {
    router.beforeEach((to, from, next) => {
        const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
        const currentUser = store.state.currentUser;

        if (requiresAuth && !currentUser) {
            next('/login');
        } else if (to.path == '/login' && currentUser) {
            next('/');
        } else if (to.path == '/register' && currentUser) {
	        next('/');
        } else {
            next();
        }
    });

    axios.interceptors.response.use(null, (error) => {
        if (error.response.status == 401) {
            store.commit('logout');
            router.push('/login');
        }

        return Promise.reject(error);
    });

    /*if (store.state.currentUser) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${store.getters.currentUser.token}`;
    }*/
}