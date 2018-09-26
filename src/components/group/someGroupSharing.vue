<template>
    <div class="alert alert-warning text-center" v-if="!groupServices">No any Services Items yet....
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
    </div>
    <div class="md-layout" v-else>
        <md-table v-model="items" md-sort="name" md-sort-order="asc" md-card md-fixed-header>
            <md-table-toolbar>
                <h1 class="md-title">Shared Items</h1>
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
            groupServices: false,
            pandingResponseServer: false,

        }),
        mounted(){
            this.updateSharingServices();
        },
        methods: {
            updateSharingServices(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group-sharingservices/' + this.$route.params.groupname, {
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
                        this.groupServices = group_serices;
                    })
                    .catch((err) => {
                        console.log(err);
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
    .md-field {
        max-width: 300px;
    }
</style>