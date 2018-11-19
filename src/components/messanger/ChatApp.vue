<template>
    <div class="row justify-content-center">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">
                    <h6 >{{ user.name }}</h6>
	                <md-button class="md-raised md-primary" @click="generalChat">General Group Chat</md-button>
	                <md-button class="md-icon-button md-raised" @click="showOtherUsers = !showOtherUsers">
                        <i class="fas fa-users">
                            <i v-if="newSmsFromId != null"
                               class="fas fa-envelope fa-pulse text-danger"></i>
                        </i>
                    </md-button>
                </div>


                <!--</div>-->
                <div class="card-body">
                    <div class="chat-app">
	                    <GeneralGroupChat v-if="showGeneralChat"/>
                        <Conversation v-if="!showGeneralChat"
                                      :contact="selectedContact"
                                      :messages="messages"
                                      @new="saveNewMessage"
                                      @checkNewMsg="checkNewSms"
                        />

                        <ContactsList :showOtherUsers="showOtherUsers" :contacts="contacts" :newMsgFromId="newSmsFromId"
                                      @selected="startConversationWith"  @checkNewMsg="checkNewSms"/>
                    </div>
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import axios from 'axios'
    import { config } from '../../_services/config'

    import Conversation from './Conversation';
    import ContactsList from './ContactsList';
    import GeneralGroupChat from './GeneralGroupChat';

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
            }
        },

	    created(){
            	let newSmsFrom = localStorage.getItem("newSmsFrom");
            	if (newSmsFrom != null || newSmsFrom != undefined){
		            this.newSmsFromId = +newSmsFrom;
	            }
	    },

        mounted() {
            this.user = this.$store.getters.currentUser;

            axios.get(config.apiUrl + '/contacts', {
                headers: {
                    "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                }
            })
                .then((response) => {
                    this.contacts = response.data;
                })
                .catch((err) => {
                    console.log(err);
                })
                .finally( () => {
                });

            var io = require('socket.io-client');
            // var socket = io.connect('http://pwa.mybest.com.ua:6001');
            var socket = io.connect('http://192.168.13.13:3000');


            socket.on("news-action." + this.user.id + ":App\\Events\\PrivateMessage", function (data) {

                // console.log(data.message.text);

                this.newSmsFromId = +data.message.from;
                // localStorage.setItem("newSms", 'is');

                if (this.selectedContact && data.message.from == this.selectedContact.id)
                    this.messages.push(data.message);

            }.bind(this));
        },

        methods: {

	        generalChat(){
	            // console.log('general chat')
		        this.showGeneralChat = !this.showGeneralChat;
	        },

            checkNewSms(data){
                if (data.contact_id == this.newSmsFromId)
                {
	                this.newSmsFromId = null;
	                localStorage.removeItem("newSmsFrom");
	                // $eventHub.$emit('sms-reed');
                }

            },

            startConversationWith(contact){

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
                    .finally( () => {
                    });
            },

            saveNewMessage(data)
            {
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
        components: { Conversation, ContactsList, GeneralGroupChat }
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
    .md-card{
        margin: 0;
        padding: 0;
    }
</style>
