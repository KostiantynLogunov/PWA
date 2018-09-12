<template>
    <div>
        <!--<h1>Dear {{ currentUser.name }}</h1>-->
        <!--<hr>-->
        <div class="md-layout-item md-layout md-gutter">
            <md-content class="md-layout-item">
                <div class="header">
                    <h4>Groups you manage:</h4>
                    <md-button class="md-raised md-primary">Create group</md-button>
                </div>
                <div class="manageGroups" v-if="own_groups[0]">
                    <ul>
                        <li v-for="group in own_groups">
                            <span>
                                <span v-if="group.avatar_url[0]">
                                    <img :src="imgUrl + group.avatar_url[0].source" alt="avatar">
                                </span>
                                <span v-else>
                                    <img :src="imgDefaultGroup" alt="default">
                                </span>

                                {{ group.name }}
                            </span>
                            <md-button class="md-accent"><i class="fas fa-trash-alt"></i></md-button>
                        </li>

                    </ul>
                </div>
                <div v-else>
                    <div class="alert alert-warning">
                        <i>Haven't managed any groups yet!</i>
                    </div>
                </div>
            </md-content>
            <md-content class="md-layout-item">
                <div class="header"><h4>Joined Groups:</h4></div>
                <div class="joinedGroups" v-if="joingroups[0]" >
                    <ul>
                        <li v-for="group in joingroups">
                            <span>
                                <span v-if="group.avatar_url[0]">
                                    <img :src="imgUrl + group.avatar_url[0].source" alt="avatar">
                                </span>
                                <span v-else>
                                    <img :src="imgDefaultGroup" alt="default">
                                </span>

                                {{ group.name }}
                            </span>

                            <md-button class="md-raised md-primary">+Join</md-button>
                        </li>
                    </ul>
                </div>
                <div v-else>

                    <div class="alert alert-warning">
                        <i>Haven't joined any groups yet!</i>
                    </div>

                </div>
            </md-content>
        </div>
    </div>
</template>

<script>

    // import {mapGetters} from 'vuex'
    import {config} from '../../_services/config'

export default {
    name: 'Groups',
    data() {
      return {
          imgUrl: config.imgUrl,
          imgDefaultGroup: config.imgDefaultGroup
      }
    },
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

<style scoped>
    .md-layout-item {
        height: 80%;
        margin: 10px;
        min-width: 100px;
    }
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }
    li{
        list-style-type:none;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    img{
        height: 40px;
        padding-right: 10px;
    }

</style>