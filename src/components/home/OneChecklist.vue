<template>
    <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
        <md-ripple>

            <md-card-header>
                <div class="md-title">
                    <span v-if="checklist.user">
                        <img :src="checklist.user.avatar" alt="avatar">
                    </span>
                    <span v-else>
                            <img :src="avatarDefaultUrl" alt="default">
                        </span>
                    {{ checklist.user.name }} ({{$lang.groups.checklist}})
                </div>
                <div class="md-subhead">
                    {{ convertDate(checklist.created_at) | moment("from") }}
                </div>
            </md-card-header>

            <md-card-content>
                {{ checklist.title }}<br>
                <span v-if="checklist.responsible_user">{{$lang.groups.responsible_user}} {{ checklist.responsible_user }} <br></span>
            </md-card-content>

        </md-ripple>
    </md-card>
</template>

<script>
    import {config} from '../../_services/config'

    export default {
        name: "OneChecklist",
        props: [
            'checklist'
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