<template>
    <div class="alert alert-warning text-center" v-if="!groupServices">No any Helping Services yet....
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
    </div>
    <div class="md-layout" v-else>
        <md-table v-model="services" md-sort="name" md-sort-order="asc" md-card >
            <md-table-toolbar>
                <h1 class="md-title">Shared Helping Services</h1>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Type" md-sort-by="type">{{ item.type }}</md-table-cell>
                <md-table-cell md-label="Sevice" md-sort-by="service">{{ item.service }}</md-table-cell>
                <md-table-cell md-label="User" md-sort-by="user">{{ item.user }}</md-table-cell>
                <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                <md-table-cell md-label="Group" md-sort-by="group">{{ item.group }}</md-table-cell>
                <md-table-cell md-label="Price" md-sort-by="price">{{ item.price }}</md-table-cell>
                <md-table-cell md-label="Pending" md-sort-by="pending">{{ item.pending }}</md-table-cell>
                <md-table-cell md-label="Confirmed" md-sort-by="confirmed">{{ item.confirmed }}</md-table-cell>
                <md-table-cell md-label="Finished" md-sort-by="finished">{{ item.finished }}</md-table-cell>
                <md-table-cell md-label="Actions">
                    <button class="btn btn-primary btn-sm" @click="goBookItemInGroup(item.id)">Booking</button>
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupServices",
        data: () => ({
            services: [],
            errors: null,
            groupServices: false,
            pandingResponseServer: false,

        }),
        mounted(){
            this.updateHelpingServices();
        },
        methods: {
            goBookItemInGroup(item_id){
                console.log(item_id);
                this.$router.push({ name: 'bookServiceInGroup', params: { service_id: item_id }})
            },

            updateHelpingServices() {
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group_helpingservices/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        let index, i = 0;
                        let group_serices = response.data.helping_services;

                        for (index = 0; index < group_serices.length; index++) {

                            this.$set(this.services, i, '');

                            let oneService = group_serices[index];

                            let obje = {
                                id: oneService.id,
                                type: oneService.type,
                                service: oneService.name,
                                user: oneService.user.name,
                                description: oneService.description,
                                group: oneService.group.name,
                                price: oneService.price,
                                pending: '0',
                                confirmed: '0',
                                finished: '0',
                            };
                            this.services[i] = obje;
                            i++;
                        }
                        this.groupServices = group_serices;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            },
        }
    }
</script>

<style scoped>

    /*.md-table{
        overflow: auto;
    }*/

    md-layout {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .md-layout {
        overflow-x: scroll;
        -webkit-overflow-scrolling: touch;
    }
    .module {
        overflow-x: scroll; /* has to be scroll, not auto */
        -webkit-overflow-scrolling: touch;
    }

    .md-card{
        margin: 0;
    }

</style>
