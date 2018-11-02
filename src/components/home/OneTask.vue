<template>
    <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
        <md-ripple>

            <md-card-header>
                <div class="md-title">
                    <span v-if="task.user">
                        <img :src="task.user.avatar" alt="avatar">
                    </span>
                    <span v-else>
                            <img :src="avatarDefaultUrl" alt="default">
                        </span>
                    {{ task.user.name }} (task)
                </div>
                <div class="md-subhead">
                    {{ convertDate(task.created_at) | moment("from") }}
                </div>
            </md-card-header>

            <md-card-content>
                {{ task.title }}<br>
                <span v-if="task.responsible_user">Responsible user: {{ task.responsible_user }} <br></span>
                Task description: {{ task.description }}
            </md-card-content>

        </md-ripple>
    </md-card>
</template>

<script>
    import {config} from '../../_services/config'

    export default {
        name: "OneTask",

        data(){
            return {
                avatarDefaultUrl: config.avatarDefaultUrl,
            }
        },

        props: [
            'task'
        ],

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