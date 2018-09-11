<template>
    <div>
        <h1>Hi {{ currentUser.name }}!</h1>
        <p>You're logged in with Vue + Vuex & JWT & Vue-resource!!</p>

        <p>
            <a href="" @click.prevent="logout" >Logout</a>
        </p>
    </div>
</template>

<script>
export default {
    methods: {
        logout() {
            this.$store.commit('logout');
            this.$router.push('/login');
        }
    },
    computed: {
        currentUser () {
            return this.$store.getters.currentUser;
        }
    },
    created () {
        // this.$store.dispatch('users/getAll');
    }
};
</script>