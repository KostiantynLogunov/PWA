<template>
    <div class="md-layout w-100">
        <md-table v-model="items" md-sort="name" md-sort-order="asc" md-card class="w-100">
            <md-table-toolbar>
                <h1 class="md-title">Shared Items</h1>
                <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Sharing" md-sort-by="is_active">
                    <input type="checkbox" :checked="item.is_active == 'on'" disabled>
                </md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Group" md-sort-by="group_name">{{ item.group_name }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="Current Lent" md-sort-by="lent">{{ item.lent }}</md-table-cell>
                <md-table-cell md-label="Actions">
                    <button class="btn btn-primary">Booking</button>
                </md-table-cell>
            </md-table-row>
            <div class="alert alert-warning text-center" v-if="!items.length && pandingResponseServer==false">No any Services Items yet....
            </div>
        </md-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupSharing",
        data: () => ({
            items: [
                /*{
                    is_active: false,
                    name: "Shawna Dubbin",
                    group_name: "Laravel",
                    status: "New",
                    lent: "-",
                },*/
            ],
            errors: null,
            groupItems: false,
            pandingResponseServer: false,

        }),
        mounted(){
            this.updateSharingItems();
        },
        methods: {
            updateSharingItems(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-sharingitems/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        let index, i = 0;
                        let group_serices = response.data.items;

                        for (index = 0; index < group_serices.length; index++) {

                            this.$set(this.items, i, '');

                            let oneService= group_serices[index];

                            let obje = {
                                is_active: oneService.is_active ? oneService.is_active : '0',
                                name: oneService.name,
                                group_name: oneService.group.name,
                                status: '-',
                                lent: "-",
                            };
                            this.items[i] = obje;
                            i++;
                        }
                        this.groupItems = group_serices;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally( () => {
                        this.pandingResponseServer = false;
                    });
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },
        }
    }
</script>

<style scoped>
    .md-card{
        margin: 0;
    }
    .md-field {
        max-width: 300px;
    }
    .md-table{
        overflow: auto;
    }
    .md-layout {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>