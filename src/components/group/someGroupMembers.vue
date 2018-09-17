<template>
    <div class="page-container md-layout-column">
        <br>
        <md-tabs  md-alignment="centered">
            <md-tab id="tab-home" md-label="Add member">
                <form novalidate class="md-layout md-size-50 md-small-size-100" @submit.prevent="addMember">
                        <input type="text" class="form-control" v-model="form.name" :disabled="sending">
                </form>
            </md-tab>
            <md-tab id="tab-pages" md-label="Members">
                <md-list class="md-triple-line">
                    <md-list-item v-for="member in members" :key="member.id">
                        <md-avatar>
                            <img :src="avatarUrl + member.avatar_url[0].source" alt="People">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ member.name }}</span>
                            <!--<span>Brunch this weekend?</span>-->
                        </div>

                        <md-button class="md-icon-button md-list-action">
                            <md-icon class="md-primary">star</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </md-tab>
            <md-tab id="tab-posts" md-label="Admins">
                Admins here:
                <md-list class="md-triple-line">
                    <md-list-item v-for="admin in admins" :key="admin.id">
                        <md-avatar>
                            <img :src="avatarUrl + admin.avatar_url[0].source" alt="People">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ admin.name }}</span>
                            <!--<span>Brunch this weekend?</span>-->
                        </div>

                        <md-button class="md-icon-button md-list-action">
                            <md-icon class="md-primary">star</md-icon>
                        </md-button>
                    </md-list-item>
                </md-list>
            </md-tab>
        </md-tabs>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupMembers",
        data() {
            return {
                form: {
                    name: ''
                },
                members: [],
                admins: [],
                sending: false,
                avatarUrl: config.avatarUrl,
            }
        },
        mounted() {
            this.getMembers();
            this.getGroupAdmins();
        },
        methods: {
            addMember() {
                console.log('adding new members');
            },
            getMembers(){
                axios.get(config.apiUrl + '/group-members/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.members = response.data.group_members;
                        // console.log(this.members);
                    });
            },
            getGroupAdmins(){
                axios.get(config.apiUrl + '/group-admins/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.admins = response.data.group_admins;
                        // console.log(this.members);
                    });
            }
        }
    }
</script>

<style scoped>
    md-list {
        width: 320px;
        max-width: 100%;
        display: inline-block;
        vertical-align: top;
        border: 1px solid rgba(#000, .12);
    }
</style>