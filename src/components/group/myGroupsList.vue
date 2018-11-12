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
                    <h4>{{$lang.groups.groups_you_manage}}</h4>
                    <md-button class="md-raised md-primary" @click="pushToNewGroup">{{$lang.buttons.create_group}}</md-button>
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
                                <router-link :to="{ name: 'someGroupAllPosts', params:  { groupname: group.username} }">
                                    {{ group.name }}
                                </router-link>
                            </span>

                                <md-button class="md-accent" v-if="pandding" @click="confirmDelete(group.id)"><i class="fas fa-trash-alt"></i></md-button>

                        </li>

                    </ul>
                </div>
                <div v-else>
                    <div class="alert alert-warning">
                        <i>{{$lang.messages.no_any_managed_group}}</i>
                        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
                    </div>
                </div>
            </md-content>
            <md-content class="md-layout-item">
                <div class="header"><h4>{{$lang.groups.joined_groups}}</h4></div>
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

                                <router-link :to="{ name: 'someGroupAllPosts', params:  { groupname: group.username} }">
                                    {{ group.name }}
                                </router-link>
                            </span>

                            <md-button class="md-raised md-accent" @click="unjoin(group.username)">{{$lang.buttons.unjoin}}</md-button>
                        </li>
                    </ul>
                </div>

                <div v-else>

                    <div class="alert alert-warning">
                        <i>{{$lang.messages.no_any_joined_group}}</i>
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
                apiUrl: config.apiUrl,
                pandingResponseServer: false,
                errors: false,
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
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandding = true;
                    });

            },
            pushToNewGroup() {
                this.$router.push({ name: 'newGroup'})
            },
            unjoin(groupname) {
                axios.delete(config.apiUrl + '/group-unjoin/' + groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.$store.dispatch('getGroups')
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    });
            }
        },
        computed: {
            joingroups() {
                this.pandingResponseServer = false;
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
            this.pandingResponseServer = true;
            return this.$store.dispatch('getGroups');
        }
    };
</script>

<style scoped>
    .md-layout-item {
        height: 80%;
        /*margin: 10px;*/
        min-width: 100px;
    }
    .header{
        display: flex;
        justify-content: space-between;
        align-items: center;
        /*padding: 20px;*/
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