<template>
    <div>
        <h1>Hi {{user.name}}!</h1>
        <p>You're logged in with Vue + Vuex & JWT & Vue-resource!!</p>

        <p>
            <router-link to="/login">Logout</router-link>
        </p>
    </div>
</template>

<script>
export default {
    computed: {
        user () {
            return this.$store.state.authentication.user.user_data;

            // return this.$store.state.authentication.user;
        },
        users () {
            return this.$store.state.users.all;
        }
    },
    created () {
        // this.$store.dispatch('users/getAll');
    }
};
</script>