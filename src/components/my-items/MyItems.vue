<template>
    <div class="alert alert-warning text-center" v-if="!myItems.length">No any Services Items yet....
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
    </div>
    <div class="md-layout" v-else>
        <md-table v-model="myItems" md-sort="name" md-sort-order="asc" md-card >
            <md-table-toolbar>
                <h1 class="md-title">My Shared Items</h1>
                <button class="btn btn-success btn-sm">Add New Item</button>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Sharing" md-sort-by="is_active">
                    <input type="checkbox" :checked="item.is_active == 'on'" disabled>
                </md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Group" md-sort-by="group_name">{{ item.group_name }}</md-table-cell>
                <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
                <md-table-cell md-label="Current Lent" md-sort-by="lent">{{ item.lent }}</md-table-cell>
                <md-table-cell md-label="Active Booking" md-sort-by="lent">-</md-table-cell>
                <md-table-cell md-label="Actions">
                    <button class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
                    <button class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
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
        name: "MyItems",
        data() {
            return {
                myItems: [],
                pandingResponseServer: false,
            }
        },

        created() {
            this.getMyItems();
        },

        methods: {
            getMyItems() {
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/my_sharingitems', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
// console.log(response.data.my_items);
                        let index, i = 0;
                        let group_serices = response.data.my_items;

                        for (index = 0; index < group_serices.length; index++) {

                            this.$set(this.myItems, i, '');

                            let oneService= group_serices[index];

                            let obje = {
                                is_active: oneService.is_active ? oneService.is_active : '0',
                                name: oneService.name,
                                group_name: oneService.group.name,
                                status: '-',
                                lent: "-",
                            };
                            this.myItems[i] = obje;
                            i++;
                        }
                    })
                    .catch((err) => {
                        // this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(err);
                    })
                    .finally( () => {
                        this.pandingResponseServer = false;
                    });
            }
        }

    }
</script>

<style scoped>

</style>