<template>
    <div class="page-container md-layout-column">
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="showSnackbarPost" md-persistent>
            <span>You updated info about member!</span>
            <md-button class="md-accent" @click="showSnackbarPost = false">Close</md-button>
        </md-snackbar>
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
                        <md-avatar v-if="member.avatar">
                            <img :src="member.avatar" alt="People">
                        </md-avatar>
                        <md-avatar v-else>
                            <img :src="avatarDefaultUrl" alt="">
                        </md-avatar>

                        <div class="md-list-item-text">
                            <span>{{ member.name }}</span>
                            <!--member.pivot.role_id-->
                        </div>

                        <div class="col-md-6">

                            <form novalidate class="md-layout" @submit.prevent="assign(member.id, member.pivot.tag, member.pivot.role_id, member.pivot.group_id)">
                                <div class="row">

                                    <input type="text" name="tag" v-model="member.pivot.tag" placeholder="Tag" :disabled="sending == member.id" size="5"/>
                                    <select name="member_role"  :disabled="sending == member.id" v-model="member.pivot.role_id">
                                        <option v-for="(role, index) in member_role_optionsmembers" :key="role.id"
                                                :value="index"
                                        >{{ role }}</option>
                                    </select>
                                    <button  type="submit" class="btn btn-sm btn-success" @click=""><i class="fas fa-check-circle"></i></button>
                                    <button  type="button" class="btn btn-sm btn-danger" @click="deleteMember(member.id)"><i class="fas fa-trash"></i></button>
                                    <md-progress-spinner :md-diameter="20" :md-stroke="4" md-mode="indeterminate" v-if="sending == member.id"></md-progress-spinner>
                                </div>

                            </form>
                        </div>
                    </md-list-item>

                </md-list>
            </md-tab>
            <md-tab id="tab-posts" md-label="Admins">
                <md-list class="md-triple-line">
                    <md-list-item v-for="admin in admins" :key="admin.id">
                        <md-avatar v-if="admin.avatar">
                            <img :src="admin.avatar" alt="People">
                        </md-avatar>
                        <md-avatar v-else>
                            <img :src="avatarDefaultUrl" alt="">
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
        <div class="errors" v-if="assignErrors">
            <p v-for="error in assignErrors">{{ error }}</p>
        </div>
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
                info_user: {
                    tag: '',
                    member_role: 2,
                },
                members: [],
                admins: [],
                sending: 0,
                avatarUrl: config.avatarUrl,
                avatarDefaultUrl: config.avatarDefaultUrl,
                errors: false,
                member_role_optionsmembers: null,
                assignErrors: null,

                showSnackbarPost: false,
                position: 'left',
                duration: 4000,
            }
        },
        mounted() {
            this.getMembers();
            this.getGroupAdmins();
        },
        methods: {
            assign(member_id, member_tag, member_role_id, group_id){

                this.assignErrors = null;
                this.sending = member_id;

                let info_member = {
                    tag: member_tag,
                    member_role: member_role_id,
                    user_id: member_id,
                    group_id: group_id,
                };


                axios.put(config.apiUrl + '/group-members/update-role', info_member, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getMembers();
                        this.showSnackbarPost = true;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.assignErrors = data_errors;
                        // console.log(data_errors);
                    })
                    .finally(() => {
                        info_member = null;
                        this.sending = 0;
                    });
            },
            deleteMember(member_id){
                console.log('delete member ' + member_id);
            },
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
                        this.member_role_optionsmembers = response.data.member_role_options;
                        // console.log(this.member_role_optionsmembers);
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
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
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
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
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
</style>