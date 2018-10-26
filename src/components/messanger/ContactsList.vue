<template>
    <transition name="boom">
    <div class="contacts-list" v-if="showOtherUsers">
        <ul>
            <li v-for="(contact, index) in contacts" :key="contact.id"
                @click="selectContact(index, contact)"
                :class="{ 'selected': index == selected }"
            >
                <div class="avatar">
                    <img :src="contact.avatar" :alt="contact.name">
                </div>
                <div class="contact">
                    <p class="name">{{ contact.name }}
                        <i class="fas fa-envelope fa-2x fa-pulse text-danger" v-if="newMsgFromId == contact.id"></i>
                    </p>
                </div>
            </li>
        </ul>
    </div>
    </transition>
    <!--<md-drawer class="md-right" :md-active.sync="showOtherUsers">
        <md-toolbar class="md-transparent" md-elevation="0">
            <span class="md-title">Other Users</span>
        </md-toolbar>
        <md-list class="contacts-list">
            <md-list-item v-for="(contact, index) in contacts" :key="contact.id"
                          @click="selectContact(index, contact)"
                          :class="{ 'selected': index == selected }"
            >
                <div class="avatar">
                    <img :src="contact.avatar" :alt="contact.name">
                </div>
                <div class="contact">
                    <p class="name">{{ contact.name }}
                        <i class="fas fa-envelope fa-2x fa-pulse text-danger" v-if="newMsgFromId == contact.id"></i>
                    </p>
                </div>
            </md-list-item>
        </md-list>
    </md-drawer>-->
</template>

<script>
    export default {
        name: "ContactsList",
        props: {
            contacts: {
                type: Array,
                default: []
            },
            newMsgFromId: {
                type: Number,
            },
            showOtherUsers: {
                type: Boolean
            }
        },
        data(){
            return {
                selected: 0,
                // showOtherUsers: true,
            }
        },
        methods: {
            selectContact(index, contact) {
                this.selected = index;

                // this.newMsgFromId = false;
                this.$emit('checkNewMsg', { contact_id: contact.id });

                this.$emit('selected', contact);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .boom-enter-active{
        animation: slideIn 0.5s;
    }

    .boom-leave-active{
        animation: slideOut 0.5s;
    }

    @keyframes slideIn {
        from {transform: translateX(1000px)}
        to {transform: translateX(0px)}
    }
    @keyframes slideOut {
        from {transform: translateX(0px)}
        to {transform: translateX(2000px)}
    }

    .contacts-list {
        flex: 2;
        max-height: 600px;
        overflow: scroll;
        border-left: 1px solid #a6a6a6;
    }
    ul {
        list-style-type: none;
        padding-left: 0;

        li {
            display: flex;
            padding: 2px;
            border-bottom: 1px solid #aaaaaa;
            height: 80px;
            position: relative;
            cursor: pointer;

            &.selected {
                background: #dfdfdf;
            }

            .avatar{
                flex: 1;
                display: flex;
                align-items: center;

                img {
                    width: 35px;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    border-radius: 50%;
                    margin: 0 auto;
                }
            }

            .contact {
                flex: 3;
                font-size: 10px;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                justify-content: center;

                p {
                    margin: 0;

                    &.name {
                        display: flex;
                        font-weight: bold;
                        justify-content: space-around;
                    }
                }
            }
        }
    }
</style>