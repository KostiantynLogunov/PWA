<template>
    <div class="feed" ref="feed">
        <ul v-if="contact">
            <li v-for="message in messages" :key="message.id"
                :class="`message${message.to == contact.id ? ' sent' : ' received' }`"
            >
                <div class="text" v-html="lookForLink(message.text)"></div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "MessagesFeed",
        props: {
            contact: {
                type: Object,
            },
            messages: {
                type: Array,
                required: true
            }
        },

        methods: {
            lookForLink(value)
            {
                let re = /([^\"=]{2}|^)((https?|ftp):\/\/\S+[^\s.,> )\];'\"!?])/;
                let subst = '$1<a href="$2" target="_blank">$2</a>';
                let withlink = value.replace(re, subst);

                return withlink;
            },

            scrollToBottom(){
                setTimeout(() => {
                    this.$refs.feed.scrollTop = this.$refs.feed.scrollHeight - this.$refs.feed.clientHeight;
                }, 50)
            }
        },

        watch: {
            contact(contact) {
                this.scrollToBottom();
            },
            messages(messages) {
                this.scrollToBottom();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .feed {
        min-height: 477px;
        background: #f0f0f0;
        height: 100%;
        max-height: 470px;
        overflow: scroll;

        ul {
            list-style-type: none;
            padding: 5px;

            li {
                &.message {
                    margin: 10px 0;
                    width: 100%;

                    .text {
                        max-width: 200px;
                        -webkit-border-radius: 5px;
                        -moz-border-radius: 5px;
                        border-radius: 5px;
                        padding: 12px;
                        display: inline-block;
                    }

                    &.received{
                        text-align: right;

                        .text {
                            background: #b2b2b2;
                        }
                    }

                    &.sent{
                        text-align: left;

                        .text {
                            background: #81c4f9;
                        }
                    }
                }
            }
        }
    }
</style>