<template>
    <div class="page-container md-layout-column">
	    <div class="snackbars">
	        <!--SNACKBAR-->
	        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="showSnackbarPost" md-persistent>
	            <span>{{$lang.messages.you_updated_info_about_member}}</span>
	            <md-button class="md-accent" @click="showSnackbarPost = false">{{$lang.buttons.close}}</md-button>
	        </md-snackbar>
	        <!--SNACKBAR-->
	        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="deletedMember" md-persistent>
	            <span>{{$lang.messages.you_deleted_member}}</span>
	            <md-button class="md-accent" @click="deletedMember = false">{{$lang.buttons.close}}</md-button>
	        </md-snackbar>
		    <!--SNACKBAR-->
		    <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="aboutAddMember" md-persistent>
			    <span>{{ msgAbotAddMember }}</span>
			    <md-button class="md-accent" @click="aboutAddMember = false">{{$lang.buttons.close}}</md-button>
		    </md-snackbar>
		    <!--SNACKBAR-->
	    </div>

        <br>
        <md-tabs  md-alignment="centered">

            <md-tab id="tab-home" :md-label="$lang.groups.add_member">
                <form novalidate class="md-layout md-size-50 md-small-size-50" @submit.prevent="">
                    <input type="text" class="form-control" v-model="form.searchname" @input="searchMember(form.searchname)">
                </form>
                <md-progress-bar md-mode="indeterminate" v-if="gettingUser" />
            </md-tab>

            <md-tab id="tab-pages" :md-label="$lang.groups.members">
                <md-list class="md-triple-line">
                    <md-list-item v-for="member in members" :key="member.id">
                        <div class="">
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
                        </div>

                        <div v-if="checkGroupAdmins(currentUser_id)">
                            <form novalidate class="md-layout" @submit.prevent="assign(member.id, member.pivot.tag, member.pivot.role_id, member.pivot.group_id)">
                                <div class="row">

                                    <input type="text" name="tag" v-model="member.pivot.tag" :placeholder="$lang.groups.tag" :disabled="sending == member.id" size="5"/>
                                    <select name="member_role"  :disabled="sending == member.id" v-model="member.pivot.role_id">
                                        <option v-for="(role, index) in member_role_optionsmembers" :key="role.id"
                                                :value="index"
                                        >{{ role }}</option>
                                    </select>
                                    <button  type="submit" class="btn btn-sm btn-success" :disabled="sending == member.id"><i class="fas fa-check-circle"></i></button>
                                    <button  type="button" class="btn btn-sm btn-danger" @click="deleteMember(member.id, member.pivot.group_id)" :disabled="sending == member.id"><i class="fas fa-trash"></i></button>
                                    <md-progress-spinner :md-diameter="20" :md-stroke="4" md-mode="indeterminate" v-if="sending == member.id"></md-progress-spinner>
                                </div>

                            </form>
                        </div>
                    </md-list-item>

                </md-list>
            </md-tab>
            <md-tab id="tab-posts" :md-label="$lang.groups.admins">
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
        <hr>
        <md-list>

            <md-list-item v-for="user in gotUsers" :key="user.id">

                <md-avatar>
                    <img :src="user.avatar" alt="People">
                </md-avatar>

                <div class="md-list-item-text">
                    <span>{{ user.name }}</span>
                    <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="additingUser == user.id" />
                </div>

                <md-button class=" md-list-action md-primary" @click="addMember(user.id)" :disabled="additingUser == user.id">
                    <i class="fas fa-plus-circle"></i>
                    {{$lang.buttons.join}}
                </md-button>

            </md-list-item>
        </md-list>

        <div class="errors" v-if="memberErrors">
            <ul >
                <li v-for="error in memberErrors">{{ error }}</li>
            </ul>
        </div>
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
                    searchname: ''
                },
                gotUsers: {},
                gettingUser: false,

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
                memberErrors: null,
                member_role_optionsmembers: null,
                assignErrors: null,
                additingUser: false,

                showSnackbarPost: false,
                deletedMember: false,
                position: 'left',
                duration: 4000,
                aboutAddMember: false,
                msgAbotAddMember: false,

                currentUser_id: false,
                groupAdminsID: [],
            }
        },
        mounted() {
            this.currentUser_id = this.$store.getters.currentUser.id;
            this.getMembers();
            this.getGroupAdmins();
        },
        computed:{
            updateRender(){
                this.$forceUpdate;
            }
        },
        methods: {
            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            addMember(member_id) {
              // console.log(member_id);
              let user_id = {
                  user_id: member_id,
              };
                this.additingUser = member_id;
                axios.post(config.apiUrl + '/group_members_add/' + this.$route.params.groupname, user_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getMembers();
                        if (response.data.message)
                            this.msgAbotAddMember = response.data.message;
                        else this.msgAbotAddMember = this.$lang.messages.successfully_accepted_member;

                        this.aboutAddMember = true;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.memberErrors = data_errors;
                        // console.log(this.updateErrors);
                    })
                    .finally(() => {
                        this.additingUser = false;
                    });
            },

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
                        this.getGroupAdmins();
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

            deleteMember(member_id, group_id){

                this.assignErrors = null;
                this.sending = member_id;

                let info_member = {
                    user_id: member_id,
                    group_id: group_id,
                };

                let headers = {"Authorization": `Bearer ${this.$store.getters.currentUser.token}`};

                axios.delete(config.apiUrl + '/group_members', { params: info_member, headers })
                    .then((response) => {
                        this.getMembers();
                        this.deletedMember = true;
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

            searchMember(searchname) {

                if (searchname.length == 0 ) {
                    this.gotUsers = {};
                    return;
                }
                this.gettingUser = true;
                axios.post(config.apiUrl + '/group_members/' + this.$route.params.groupname, this.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let users = response.data.users;
                        for (let i = 0; i < users.length; i++) {
                            let user = users[i][0];

                            let oneUser = {
                                id: user.id,
                                name: user.name,
                                username: user.username,
                                avatar: user.avatar,
                            };

                            this.$set(this.gotUsers, i, oneUser);
                        }
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.memberErrors = data_errors;
                        // console.log(this.updateErrors);
                    })
                    .finally(() => {
                        this.gettingUser = false;
                    });

            },
            getMembers(){
                axios.get(config.apiUrl + '/group-members/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupAdminsID = response.data.admins_id;
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
        border: 1px solid grey;
    }
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }

    .md-list-item:hover{
        background: #EFF3F6;
        cursor: crosshair;
        border-radius: 5px;
    }


</style>