<template>
    <div>
        <div>
            <md-dialog-confirm
                    :md-active.sync="active"
                    md-title="Confirmation"
                    md-content="Are you sure to delete group?"
                    md-confirm-text="Agree"
                    md-cancel-text="Disagree"
                    @md-cancel="onCancel"
                    @md-confirm="onConfirm" />
            <md-content class="md-layout-item">
                <div class="header">
                    <h4>Groups you manage:</h4>
                    <md-button class="md-raised md-primary" @click="pushToNewGroup">Create group</md-button>
                </div>
                <div class="manageGroups" v-if="own_groups[0]">
                    <ul>
                        <li v-for="group in own_groups" :key="group.id">
                            <span>
                                <span v-if="group.avatar_url[0]">
                                    <img :src="imgUrl + group.avatar_url[0].source" alt="avatar">
                                </span>
                                <span v-else>
                                    <img :src="imgDefaultGroup" alt="default">
                                </span>

                                <!--<router-link :to="`/${group.username}`">-->
                                <router-link :to="{ name: 'someGroupPosts', params:  { groupname: group.username} }">
                                    {{ group.name }}
                                </router-link>
                            </span>

                                <md-button class="md-accent" v-if="pandding" @click="confirmDelete(group.id)"><i class="fas fa-trash-alt"></i></md-button>

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
                        <li v-for="group in joingroups" :key="group.id">
                            <span>
                                <span v-if="group.avatar_url[0]">
                                    <img :src="imgUrl + group.avatar_url[0].source" alt="avatar">
                                </span>
                                <span v-else>
                                    <img :src="imgDefaultGroup" alt="default">
                                </span>

                                {{ group.name }}
                            </span>

                            <md-button class="md-raised md-primary">UnJoin</md-button>
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
    import axios from 'axios'

    export default {
        name: 'myGroupsList',
        data() {
            return {
                pandding: true,
                active: false,
                groupDelete: {
                    'group_id': false
                },
                imgUrl: config.imgUrl,
                imgDefaultGroup: config.imgDefaultGroup,
                apiUrl: config.apiUrl
            }
        },
        methods: {
            confirmDelete(group_id){
                this.active =true;
                this.groupDelete.group_id = group_id;
            },
            onCancel() {
                this.groupDelete.group_id = false;
            },
            onConfirm(){
                console.log(this.groupDelete.group_id);
                this.pandding = false;
                axios.post( this.apiUrl + '/group-delete', this.groupDelete, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupDelete.group_id = false;
                        this.$store.dispatch('getGroups');
                        this.pandding = true;
                    })
                    .catch((err) => {
                        this.groupDelete.group_id = true;
                        let errorMessage = err.response.data.message || err.message;
                        // this.errors = err.response.data;
                        this.pandding = false ;
                        console.log(errorMessage);
                    })

            },
            pushToNewGroup() {
                this.$router.push({ name: 'newGroup'})
            },
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
        flex-wrap: wrap;
    }
    li{
        list-style-type:none;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
    }

    img{
        height: 40px;
        padding-right: 10px;
    }
</style>