<template>
    <div class="conversation">
        <h1>{{ contact ? contact.name : 'Select a Contact' }}</h1>
        <MessagesFeed :contact="contact" :messages="messages"/>
        <MessageComposer @send="sendMessage"/>
    </div>
</template>

<script>
    import axios from 'axios'
    import { config } from '../../_services/config'

    import MessageComposer from './MessageComposer';
    import MessagesFeed from './MessagesFeed';

    export default {
        name: "Conversation",
        props: {
            contact: {
                type: Object,
                default: null
            },
            messages: {
                type: Array,
                default: []
            }
        },
        methods: {
            sendMessage(text) {

                this.$emit('checkNewMsg', { contact_id: this.contact.id });

                if (!this.contact) return;

                let data = {
                    contact_id: this.contact.id,
                    text: text
                };

                axios.post(config.apiUrl + '/conversation/send', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.$emit('new', response.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {

                    });
            }
        },
        components:{MessageComposer, MessagesFeed}
    }
</script>

<style lang="scss" scoped>
    .conversation {
        flex: 5;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        h1 {
            font-size: 20px;
            padding: 10px;
            margin: 0;
            border-bottom: 1px dashed lightgrey;
        }
    }
</style>