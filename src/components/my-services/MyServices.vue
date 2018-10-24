<template>
    <div>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteService" md-persistent>
            <span>You deleted service successfully!</span>
            <md-button class="md-accent" @click="flagDeleteService = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>

        <div class="alert alert-warning text-center" v-if="!my_services.length && pandingResponseServer==false">No any
            Helping Services yet....
        </div>
        <div class="md-layout" v-else>
            <md-table v-model="my_services" md-sort="name" md-sort-order="asc" md-card >
                <md-table-toolbar>
                    <h1 class="md-title">My Helping Services</h1>
                    <button class="btn btn-success btn-sm">Add New Service</button>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Active" md-sort-by="active">
                        <input type="checkbox" :checked="item.is_active == 'on'" disabled>
                    </md-table-cell>
                    <md-table-cell md-label="Type" md-sort-by="type">{{ item.type }}</md-table-cell>
                    <md-table-cell md-label="Sevice" md-sort-by="service">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                    <md-table-cell md-label="Group" md-sort-by="group">{{ item.group }}</md-table-cell>
                    <md-table-cell md-label="Price" md-sort-by="price">{{ item.price }}</md-table-cell>
                    <md-table-cell md-label="Pending" md-sort-by="pending">{{ item.pending }}</md-table-cell>
                    <md-table-cell md-label="Confirmed" md-sort-by="confirmed">{{ item.confirmed }}</md-table-cell>
                    <md-table-cell md-label="Finished" md-sort-by="finished">{{ item.finished }}</md-table-cell>
                    <md-table-cell md-label="Actions">
                        <button class="btn btn-warning btn-sm"
                                @click="onEditForm(item)"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm"
                                @click="deleteItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-primary btn-sm">Booking</button>
                    </md-table-cell>
                </md-table-row>
            </md-table>
        </div>

        <md-dialog :md-active.sync="editingService">
            <md-dialog-title>Edit Service</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>Title</label>
                                        <md-input name="title" v-model="form_edit_service.name"
                                                  :disabled="processingService" />
                                    </md-field>

                                    <md-field>
                                        <label>Description</label>
                                        <md-textarea name="description" v-model="form_edit_service.description" :disabled="processingService" />
                                    </md-field>

                                    <div class="text-center">
                                        <select name="status" v-model="form_edit_service.group"
                                                :disabled="processingService">
                                            <option value="New">New</option>
                                            <option value="In progress">In progress</option>
                                            <option value="Complated">Complated</option>
                                            <option value="Postponed">Postponed</option>
                                        </select>
                                    </div>
                                    <br>
                                </div>
                                <br>
                            </div>
                            <!--<div class="errors" v-if="errors">
                                <ul>
                                    <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                                        {{ fieldsError.join('\n') }}
                                    </li>
                                </ul>
                            </div>-->
                        </md-card-content>

                        <md-progress-bar md-mode="indeterminate" v-if="processingService" />

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingService" class="md-primary" @click="CancelEditingService">Close</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Update</md-button>
                            </md-dialog-actions>
                        </md-card-actions>

                        <!--<div class="deleteErrors" v-if="updateErrors">
                            <p v-for="error in updateErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="editErrors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in editErrors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>-->
                    </md-card>
                </form>
            </div>
        </md-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "MyServices",
        data(){
            return {
                my_services: [],
                pandingResponseServer: false,

                position: 'left',
                duration: 4000,
                flagDeleteService: false,

                editingService: false,
                processingService: false,
                form_edit_service:{
                    active: false,
                    type: '',
                    name: '',
                    description: '',
                    price: '',
                    group: '',
                }
            }
        },

        created() {
            this.getHelpingServices()
        },

        methods: {
            onEditForm(service) {
                this.editingService = true;
            },
            editService(){

            },

            CancelEditingService(){
                this.editingService = false;
                console.log('canceling...');
            },

            deleteItem(service_id) {
                if ( !confirm('Are you sure you want to delete service? ') ) return;
                axios.delete(config.apiUrl + '/my_services/' + service_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getHelpingServices();
                        this.flagDeleteService = true;
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.deletingPost = 0;
                    });
            },

            getHelpingServices() {
                this.my_services = [];
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/my_services', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        // console.log(response.data.my_services);

                        let index, i = 0;
                        let group_serices = response.data.my_services;

                        for (index = 0; index < group_serices.length; index++) {

                            this.$set(this.my_services, i, '');

                            let oneService = group_serices[index];

                            let obje = {
                                id: oneService.id,
                                active: oneService.active,
                                type: oneService.type,
                                name: oneService.name,
                                // user: oneService.user.name,
                                description: oneService.description,
                                group: oneService.group.name,
                                price: oneService.price,
                                pending: '0',
                                confirmed: '0',
                                finished: '0',
                            };
                            this.my_services[i] = obje;
                            i++;
                        }
                        // this.groupServices = group_serices;
                    })
                    .catch((err) => {
                        // this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(err);
                    })
                    .finally(() => {
                        this.pandingResponseServer = false;
                    });
            }
        },
    }
</script>

<style scoped>
    .md-table{
        overflow: auto;
    }
</style>