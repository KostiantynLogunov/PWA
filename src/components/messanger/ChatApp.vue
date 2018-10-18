<template>
    <div class="row justify-content-center">
        <div class="col-sm-12">
            <div class="card">
                <div class="card-header">My 1st MESSANGER</div>

                <div class="card-body">
                    <div class="chat-app">
                        <Conversation :contact="selectedContact" :messages="messages" @new="saveNewMessage" @checkNewMsg="checkNewSms"/>
                        <ContactsList :contacts="contacts" :newMsgFromId="newSmsFromId" @selected="startConversationWith"  @checkNewMsg="checkNewSms"/>
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

    export default {

        data() {
            return {
                selectedContact: null,
                messages: [],
                contacts: [],
                user: false,
                newSmsFromId: null,
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
            // var socket = io(':6001');
            var socket = io.connect('http://192.168.10.10:3000');

            socket.on("news-action." + this.user.id + ":App\\Events\\PrivateMessage", function (data) {

                // console.log(data.message.text);

                this.newSmsFromId = +data.message.from;

                if (this.selectedContact && data.message.from == this.selectedContact.id)
                    this.messages.push(data.message);

            }.bind(this));
        },
        methods: {
            checkNewSms(data){
                if (data.contact_id == this.newSmsFromId) this.newSmsFromId = null;
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
        components: { Conversation, ContactsList }
    }
</script>

<style lang="scss" scoped>
    .chat-app {
        display: flex;
    }
</style>
