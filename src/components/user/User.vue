<template>
    <div>
        <h1>Hi {{ user.name }}!</h1>
        <p>You're logged in with Vue + Vuex & JWT & Vue-resource!!</p>

        <p>
            <a href="" @click.prevent="logout" >Logout</a>
        </p>
    </div>
</template>

<script>
    export default {
        name: "User",
        methods: {
            logout() {
                this.$store.commit('logout');
                this.$router.push('/login');
            }
        },
        computed: {
            user () {
                return this.$store.getters.currentUser;
                // return this.$store.state.authentication.user;
            }
        },
        created () {
            // this.$store.dispatch('users/getAll');
        }
    };
</script>

