<template>
    <div>
        <h1>Dear {{user.name}}</h1>
        <div class="manageGroups" v-if="own_groups[0]">
            <h4>Groups you manage:</h4>
            <ul>
                <li v-for="group in own_groups">
                    {{ group.name }}
                </li>
            </ul>
        </div>
        <div v-else>
            <h5>Haven't admin any groups yet!</h5>
        </div>
        <hr>
        <div class="joinedGroups" v-if="joingroups[0]" >
            <h4>Joined groups:</h4>
            <ul>
                <li v-for="group in joingroups">
                    {{ group.name }}
                </li>
            </ul>
        </div>
        <div v-else>
            <h5>Haven't joined any groups yet!</h5>
        </div>
    </div>
</template>

<script>

    // import {mapGetters} from 'vuex'

export default {
    computed: {
        joingroups() {
            return this.$store.getters['groups/groupsJoined'];

        },
        own_groups() {
            return this.$store.getters['groups/groupsManage'];
        },
        user () {
            return this.$store.state.authentication.user.user_data;
            // return this.$store.state.authentication.user;
        },
    },
    mounted(){
        return this.$store.dispatch('groups/loadGroups');
    },
    created () {
        // this.$store.dispatch('users/getAll');
    }
};
</script>