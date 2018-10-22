<template>
    <div>
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>

                    <md-card-header>
                        <div class="md-title">
                        <span v-if="post.user">
                            <img :src="post.user.avatar" alt="avatar">
                        </span>
                            <span v-else>
                            <img :src="avatarDefaultUrl" alt="default">
                        </span>
                            {{ post.user.name }} (post)
                        </div>
                        <div class="md-subhead">
                            {{ convertDate(post.created_at) | moment("from") }}
                        </div>
                    </md-card-header>

                    <md-card-content>
                        {{ post.description }}
                    </md-card-content>

                </md-ripple>
            </md-card>
    </div>
</template>

<script>
    import {config} from '../../_services/config'

    export default {
        name: "OnePost",

        props: [
            'post'
        ],

        data(){
            return {
                avatarDefaultUrl: config.avatarDefaultUrl,
            }
        },

        methods: {
            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
            },
        }
    }
</script>

<style scoped>
    img{
        height: 40px;
        padding-right: 10px;
    }
</style>