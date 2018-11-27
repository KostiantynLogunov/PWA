<template>
    <div class="row justify-content-center">
        <div class="col-sm-12">
            <div class="card">
                <br>
                <div class="card-header">
                    <h6>{{ user.name }}</h6>
                    <md-menu>
                        <md-button class="md-raised md-primary " md-menu-trigger>General Group Chat <i class="fas fa-sort-down"></i>
                        </md-button>
                        <md-menu-content>
                            <md-menu-item v-for="group in groups" :key="group.id" @click="generalChat(group.id, group.name)">
                                <span class="general-chats-item">{{ group.name }}</span>
                                <md-icon>chat</md-icon>
                            </md-menu-item>
                        </md-menu-content>
                    </md-menu>
                    <md-button class="md-icon-button md-raised" @click="pressAllContacts">
                        <i class="fas fa-users">
                            <i v-if="newSmsFromId != null"
                               class="fas fa-envelope fa-pulse text-danger"></i>
                        </i>
                    </md-button>
                </div>


                <!--</div>-->
                <div class="card-body">
                    <div class="chat-app">
                        <GeneralGroupChat v-if="showGeneralChat"
                                          :group="chooseGroup"
                                          :messages="groupChatMessages"
                                          @showEnteredMsg="PrintEnteredMsg($event)"
                                          :activeUser="isActive"
                                          @typingText="actionUser($event)"
                        />
                        <Conversation v-if="!showGeneralChat"
                                      :contact="selectedContact"
                                      :messages="messages"
                                      @new="saveNewMessage"
                                      @checkNewMsg="checkNewSms"
                        />

                        <ContactsList :showOtherUsers="showOtherUsers" :contacts="contacts" :newMsgFromId="newSmsFromId"
                                      @selected="startConversationWith" @checkNewMsg="checkNewSms"/>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    import Conversation from './Conversation';
    import ContactsList from './ContactsList';
    import GeneralGroupChat from './GeneralGroupChat';
    import Echo from 'laravel-echo'

    export default {

        data() {
            return {
                selectedContact: null,
                messages: [],
                contacts: [],
                user: false,
                newSmsFromId: null,
                showOtherUsers: false,
                showGeneralChat: false,
                groups: null,
                chooseGroup: {
                    id: null,
                    name: null,
                },
                groupChatMessages: null,
                isActive: false,
                typingTimer: false
            }
        },

        created()
        {
            let newSmsFrom = localStorage.getItem("newSmsFrom");
            if (newSmsFrom != null || newSmsFrom != undefined) {
                this.newSmsFromId = +newSmsFrom;
            }
            this.groups = this.$store.state.allUserGroups;
            // console.log(this.groups);

            window.Echo = new Echo({
                broadcaster: 'socket.io',
                host: 'http://social.loc:6013',
                auth:
                    {
                        headers:
                            {
                                "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                            }
                    }
            });
        },

        mounted() {
            this.user = this.$store.getters.currentUser;

            axios.get(config.apiUrl + '/contacts', {
                headers: {
                    "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                }
            })
                .then((response) => {
                    this.contacts = response.data.contacts;
                    // console.log(this.contacts);
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally(() => {
                });

            var io = require('socket.io-client');
            // var socket = io.connect('http://pwa.mybest.com.ua:6001');
            var socket = io.connect('http://192.168.10.10:3000');


            socket.on("news-action." + this.user.id + ":App\\Events\\PrivateMessage", function (data) {

                // console.log(data.message.text);

                this.newSmsFromId = +data.message.from;
                // localStorage.setItem("newSms", 'is');

                if (this.selectedContact && data.message.from == this.selectedContact.id)
                    this.messages.push(data.message);

            }.bind(this));
        },

        computed: {
            channel() {
                return window.Echo.private('group-room.' + this.chooseGroup.id)
            }
        },

        watch: {
            'chooseGroup.id': function (newVal, oldVal) {
                if (oldVal) {
                    window.Echo.leave('group-room.' + oldVal);
                    console.log('left channel ' + oldVal);
                }

                console.log('chooseGroup-id changed: ', newVal, ' | was: ', oldVal);

                if (newVal) {
                    // window.Echo.private('group-room.' + newVal)
                    this.channel
                        .listen('PrivateChat', ({data}) => {
                            this.isActive = false;
                            if (data.user_id != this.$store.getters.currentUser.id) {
                                let msg = {
                                    body: data.body,
                                    created_at: data.created_at,
                                    group_id: data.group_id,
                                    user: {
                                        id: data.user_id,
                                        avatar: data.user_avatar,
                                        name: data.user_name,
                                    }
                                };
                                this.groupChatMessages.push(msg);
                            }

                            // if (message.name != this.$store.getters.currentUser.name)
                            // this.messages.push(data.body)
                        })
                        .listenForWhisper('typing', (e) => {
                            this.isActive = e;

                            if (this.typingTimer) clearTimeout(this.typingTimer);
                            this.typingTimer = setTimeout(() => {
                                this.isActive = false;
                            }, 500)
                        });

                    axios.get(config.apiUrl + '/group-chat/' + newVal, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            this.groupChatMessages = response.data.messages;
                            // console.log(this.groupChatMessages);
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                        });
                }
            },
        },

        methods:
            {
                pressAllContacts() {
                    this.showOtherUsers = !this.showOtherUsers;
                    this.showGeneralChat = false;
                    this.chooseGroup.id = null;
                    // window.Echo.leave('group-room.' + this.chooseGroup.id);
                },

                actionUser(data) {
                    this.channel
                    // window.Echo.private('group-room.' + data.group_id)
                        .whisper('typing', {
                            name: this.user.name
                        });
                },

                PrintEnteredMsg(data) {
                    let msg = {
                        body: data.body,
                        created_at: data.created_at,
                        group_id: data.group_id,
                        user: {
                            id: this.$store.getters.currentUser.id,
                            avatar: this.$store.getters.currentUser.avatar,
                            name: this.$store.getters.currentUser.name,
                        }
                    };
                    this.groupChatMessages.push(msg);
                },

                generalChat(group_id, group_name) {
                    // console.log('general chat')
                    this.chooseGroup.id = group_id;
                    this.chooseGroup.name = group_name;
                    // console.log(this.group);
                    this.showGeneralChat = true;
                    this.showOtherUsers = false;

                },

                checkNewSms(data) {
                    if (data.contact_id == this.newSmsFromId) {
                        this.newSmsFromId = null;
                        localStorage.removeItem("newSmsFrom");
                        // $eventHub.$emit('sms-reed');
                    }

                },

                startConversationWith(contact) {

                    axios.get(config.apiUrl + `/conversation/${contact.id}`, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            // console.log(this.selectedContact);
                            this.messages = response.data;
                            this.selectedContact = contact;
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                        .finally(() => {
                        });
                },

                saveNewMessage(data) {
                    if (!this.selectedContact) {
                        alert('Select user');
                        data.text = "";
                        return;
                    }

                    let params = {
                        channels: 'news-action.' + this.selectedContact.id,
                        text: data.text,
                        from: this.user.id,
                        to: this.selectedContact.id
                    };


                    // console.log(params);

                    axios.post(config.apiUrl + '/send-private-msg', params, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            // console.log(response);
                            this.messages.push(data);
                            // console.log(data);
                        });
                }
            },

        beforeRouteLeave(to, from, next) {
            window.Echo.leave('group-room.' + this.chooseGroup.id);
            next();
        },

        components: {Conversation, ContactsList, GeneralGroupChat}
    }
</script>

<style lang="scss" scoped>
    .chat-app {
        display: flex;
        transition-duration: 0.1s;
    }

    .card-header {
        /*margin: 0;*/
        /*padding: 0;*/
        display: flex;
        justify-content: space-between;
    }

    .card-body {
        margin: 0;
        padding: 0;
    }

    .md-card {
        margin: 0;
        padding: 0;
    }

    .general-chats-item {
        cursor: pointer;
    }

    .general-chats-item:hover {
        color: blue;
    }
</style>
