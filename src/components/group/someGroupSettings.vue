<template>
    <div class="page-container md-layout-column">
        <div class="alert alert-warning" v-if="!group_info">{{$lang.messages.loading}}
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
            <div class="errors" v-if="errors">
                <div class="alert alert-danger">
                    {{ errors}}
                </div>
            </div>
        </div>
        <div v-else>
            <form novalidate class="md-layout" @submit.prevent="updateSettings" >
                <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
                    <span>{{$lang.messages.you_updated_group_information}}</span>
                    <md-button class="md-accent" @click="showSnackbar = false">{{$lang.buttons.close}}</md-button>
                </md-snackbar>
                <md-card class="md-layout-item md-size-100 md-small-size-100">
                    <md-card-header>
                        <div class="md-title">{{$lang.groups.general_settings}}</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="username">{{$lang.fields.username}}</label>
                                    <md-input name="username" id="username"  :value="form.username" disabled readonly/>
                                </md-field>

                                <md-field :class="">
                                    <label for="name">{{$lang.fields.name}}</label>
                                    <md-input name="name" id="name" v-model="form.name" :disabled="pandingResponseServer" />
                                </md-field>

                                <md-field>
                                    <label for="about">{{$lang.fields.about}}</label>
                                    <md-textarea name="about" id="about" v-model="form.about" :disabled="pandingResponseServer" />
                                </md-field>



                                <!--<md-field >-->
                                    <label>PRIVACY{{$lang.fields.title}}</label>
                                    <md-radio v-model="form.type" value="open" class="md-primary" :disabled="pandingResponseServer"><i class="fas fa-globe"></i> {{$lang.fields.open_group}}
                                        <br><small>{{$lang.fields.anyone_can_see_and_join_group}}</small></md-radio>
                                    <md-radio v-model="form.type" value="close" class="md-primary" :disabled="pandingResponseServer"><i class="fas fa-lock"></i> {{$lang.fields.close_group}}
                                        <br><small>{{$lang.fields.anyone_can_see_and_request_to_join_group}}</small></md-radio>
                                    <md-radio v-model="form.type" value="secret" class="md-primary" :disabled="pandingResponseServer"><i class="fas fa-hamsa"></i> {{$lang.fields.secret_group}}
                                        <br><small>{{$lang.fields.only_members_can_access_group}}</small></md-radio>
                                <!--</md-field>-->

                                <md-field>
                                    <label>{{$lang.fields.WHO_CAN_ADD_MEMBERS_TO_THIS_GROUP}}</label>
                                    <md-select name="member_privacy" id="member_privacy" v-model="form.member_privacy" md-dense :disabled="pandingResponseServer">
                                        <md-option value="members" selected>{{$lang.fields.members}}</md-option>
                                        <md-option value="only_admins">{{$lang.fields.admins}}</md-option>
                                    </md-select>
                                </md-field>

                                <md-field>
                                    <label>{{$lang.fields.WHO_CAN_POST_ON_THIS_GROUP}}</label>
                                    <md-select name="post_privacy" id="post_privacy" v-model="form.post_privacy" md-dense :disabled="pandingResponseServer">
                                        <md-option value="members">{{$lang.fields.members}}</md-option>
                                        <md-option value="only_admins">{{$lang.fields.admins}}</md-option>
                                        <md-option value="everyone">{{$lang.fields.everyOne}}</md-option>
                                    </md-select>
                                </md-field>

                                <md-field>
                                    <label>{{$lang.fields.WHO_CAN_ADD_EVENTS_TO_GROUP}}</label>
                                    <md-select name="event_privacy" id="event_privacy" v-model="form.event_privacy" md-dense :disabled="pandingResponseServer">
                                        <md-option value="members">{{$lang.fields.members}}</md-option>
                                        <md-option value="only_admins">{{$lang.fields.admins}}</md-option>
                                    </md-select>
                                </md-field>


                                <md-checkbox v-model="invite" @change="checkInviteUrl" class="md-primary" :checked="url_invite"></md-checkbox>{{$lang.fields.ALLOW_INVATION_BY_URL}}
                                    <transition name="boom">
                                        <md-button type="button" class="md-raised md-accent" :disabled="pandingResponseServer" v-if="url_invite"
                                                   v-clipboard:copy="url_invite"
                                                   v-clipboard:success="onCopy"
                                                   v-clipboard:error="onError"
                                        >{{$lang.buttons.copy}}</md-button>

                                    </transition>
                                    <md-field>
                                        <transition name="boom">
                                            <md-input readonly disabled :value="url_invite"/>
                                        </transition>
                                    </md-field>

                                    <md-dialog-alert
                                            :md-active.sync="second"
                                            md-title="You successfully copied link !"
                                            :md-content="$lang.fields.you_just_copied + ' ' + url_invite" />
                            </div>
                        </div>
                        <div class="errors" v-if="errors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>
                    </md-card-content>
                    <md-progress-bar md-mode="indeterminate" v-if="pandingResponseServer" />
                    <md-card-actions>
                        <md-button type="submit" class="md-primary md-raised ml-3" :disabled="pandingResponseServer">{{$lang.buttons.update}}</md-button>
                    </md-card-actions>
                </md-card>
                <md-snackbar :md-active.sync="showSnackbar">{{$lang.messages.you_updated_group_information}}</md-snackbar>
            </form>
        </div>
    </div>
</template>

<script>
    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupSettings",
        data: () => ({
            form: {
                username: '',
                name: '',
                about: '',
                type: '',
                member_privacy: '',
                post_privacy: '',
                event_privacy: null,
            },
            second:false,

            url_invite: false,
            invite: false,

            showSnackbar: false,
            position: 'center',
            duration: 4000,

            errors: null,
            group_info: false,

            pandingResponseServer: false,
        }),
        mounted(){
            this.getGroupInfo();
        },
        methods: {
            onCopy: function (e) {
                // alert('You just copied: ' + e.text)
                this.second =true;
            },
            onError: function (e) {
                alert('Failed to copy texts')
            },

            checkInviteUrl(){
                this.pandingResponseServer =true;

                axios.post(config.apiUrl + '/toggle_allow_invite', this.group_info, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        if (response.data.allow) {
	                        let my_domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                            this.url_invite = my_domain + '/groupinvite/' + response.data.token;
                            this.invite = true;
                        } else {
                            this.url_invite = false;
                            this.invite = false;
                        }
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message ||err.response.data ||  err.message;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            },

            getGroupInfo() {
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/settings/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        this.group_info = response.data;

                        this.form.username = response.data.group.username;
                        this.form.name = response.data.group.name;
                        this.form.about = response.data.group.about;
                        this.form.type = response.data.type;
                        this.form.member_privacy = response.data.group.member_privacy;
                        this.form.post_privacy = response.data.group.post_privacy;
                        this.form.event_privacy = response.data.group.event_privacy;

                        if (response.data.group.invation_token) {
	                        let my_domain = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
                            this.url_invite = my_domain + '/groupinvite/' +response.data.group.invation_token;
                            this.invite = true;
                        } else {
                            this.url_invite = false;
                            this.invite = false;
                        }
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message ||err.response.data ||  err.message;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            },

            updateSettings() {
                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }
                this.pandingResponseServer = true;
                // send to api this.form.post
                axios.put(config.apiUrl + '/settings/' + this.$route.params.groupname, this.$data.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getGroupInfo();
                        this.showSnackbar = true;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            },

            getConstraints(){
                return {
                    username: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    name: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    about: {
                        presence: true,
                        length: {
                            minimum: 5,
                            message: 'Must be at least 5 characters long'
                        }
                    },
                    type: {
                        presence: true,
                        length: {
                            minimum: 4,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    member_privacy: {
                        presence: true,
                        length: {
                            minimum: 4,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    post_privacy: {
                        presence: true,
                        length: {
                            minimum: 4,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    event_privacy: {
                        presence: true,
                        length: {
                            minimum: 4,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                }
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },

            clearForm(){
                this.form.title = '';
                this.form.description = '';
                this.form.status = '';
                this.form.members = '';
                this.form.event = '';
                this.form.start_date = '';
                this.form.end_date = '';
            }
        }
    }
</script>

<style scoped>
    .md-radio {
        display: flex;
    }

    .boom-enter-active{
        animation: slideIn 0.5s;
    }

    .boom-leave-active{
        animation: slideOut 0.5s;
    }

    @keyframes slideIn {
        from {transform: translateX(-1000px)}
        to {transform: translateX(0px)}
    }
    @keyframes slideOut {
        from {transform: translateX(0px)}
        to {transform: translateX(-2000px)}
    }
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
</style>