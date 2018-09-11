<template>
    <div>
        <h1>Dear {{ currentUser.name }}</h1>
        <br>
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
    name: 'Groups',
    computed: {
        joingroups() {
            return this.$store.getters.groupsJoined;

        },
        own_groups() {
            return this.$store.getters.groupsManage;
        },
        currentUser () {
            return this.$store.getters.currentUser;
        }
    },
    mounted(){
        return this.$store.dispatch('getGroups');
    },
    created () {
        // this.$store.dispatch('users/getAll');
    }
};
</script>