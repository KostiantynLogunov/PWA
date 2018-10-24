<template>
    <div>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteService" md-persistent>
            <span>You deleted service successfully!</span>
            <md-button class="md-accent" @click="flagDeleteService = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR--><!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagCreateService" md-persistent>
            <span>You created service successfully!</span>
            <md-button class="md-accent" @click="flagCreateService = false">Close</md-button>
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
                    <button class="btn btn-success btn-sm" @click="onCreateFormService">Add New Service</button>
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
                        <md-progress-bar md-mode="indeterminate" v-if="deletingService == item.id" />
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

        <md-dialog :md-active.sync="creatingService">
            <md-dialog-title>Create Service</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="CreateService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                        <md-checkbox v-model="form_create_service.active"
                                                     :disabled="processingService">Active</md-checkbox>
                                    <br>
                                        <md-radio v-model="form_create_service.type" value="provide">Provide service
                                            <small>(Default)</small></md-radio>
                                        <md-radio v-model="form_create_service.type" value="request"
                                                  class="md-primary">Request service</md-radio>

                                    <md-field>
                                        <label>Name</label>
                                        <md-input v-model="form_create_service.name"
                                                  :disabled="processingService" />
                                    </md-field>

                                    <md-field>
                                        <label>Description</label>
                                        <md-textarea v-model="form_create_service.description" :disabled="processingService" />
                                    </md-field>

                                    <md-field>
                                        <label>Price(optional)</label>
                                        <md-input v-model="form_create_service.price"
                                                  :disabled="processingService" />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Target Group</label>
                                            <md-select name="event" v-model="form_create_service.group_id" md-dense
                                                       placeholder="Please select target group"
                                                       :disabled="processingService">
                                                <div v-if="my_groups.length">
                                                    <div v-for="group in my_groups">
                                                        <md-option :value="group.id">
                                                            {{ group.name }}
                                                        </md-option>
                                                    </div>
                                                </div>
                                                <div v-else>
                                                    <md-option  disabled>
                                                        Not any groups
                                                    </md-option>
                                                </div>
                                            </md-select>
                                        </md-field>
                                    </div>


                                    <br>
                                </div>
                                <br>
                            </div>

                        </md-card-content>

                        <md-progress-bar md-mode="indeterminate" v-if="processingService" />

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingService" class="md-primary" @click="CancelCreateService">
                                    Close</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Update</md-button>
                            </md-dialog-actions>
                        </md-card-actions>

                        <div class="deleteErrors" v-if="storeErrors">
                            <p v-for="error in storeErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="createErrors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in createErrors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>
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
                my_groups: [],

                pandingResponseServer: false,

                position: 'left',
                duration: 4000,
                flagDeleteService: false,

                deletingService: false,
                editingService: false,
                processingService: false,
                form_edit_service:{
                    active: false,
                    type: '',
                    name: '',
                    description: '',
                    price: '',
                    group: '',
                },

                flagCreateService: false,
                creatingService: false,
                storeErrors: [],
                createErrors: [],
                form_create_service:{
                    active: '',
                    type: 'provide',
                    name: '',
                    description: '',
                    price: null,
                    group_id: '',
                    business_hours: null,
                },
            }
        },

        created() {
            this.getHelpingServices()
        },

        methods: {
            getCreateConstraints(){
                return {
                    active: {
                        presence: true,
                    },
                    type: {
                        presence: true,
                        length: {
                            minimum: 8,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    name: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    description: {
                        presence: true,
                        length: {
                            minimum: 5,
                            message: 'Must be at least 5 characters long'
                        }
                    },
                    group_id: {
                        presence: true,
                        numericality: {
                            onlyInteger: true,
                            greaterThanOrEqualTo: 0,
                            message: 'Please select target group'
                        }
                    },
                }
            },

            CreateService(){
                this.createErrors = null;

                const constraints = this.getCreateConstraints();

                const errors = validate(this.form_create_item, constraints);

                if (errors) {
                    this.createErrors = errors;
                    return ;
                }
                this.processingService = true;
                let data = {
                    name: this.htmlEntities(this.form_create_item.name),
                    group_id: this.htmlEntities(this.form_create_item.group_id),
                    description: this.htmlEntities(this.form_create_item.description),
                    is_active: this.form_create_item.is_active ? 'on' : null,
                };
                // send to api this.form_create_item
                axios.post(config.apiUrl + '/my_sharingitems', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.flagCreateService = true;
                        this.getHelpingServices();
                        this.processingService = false;
                        this.clearCreateFormService();
                    })
                    .catch((err) => {
                        /*let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.errors = data_errors;
                        console.log(this.errors);*/
                        console.log(err);
                    })
                    .finally(() => {
                        this.processingItem = false;
                    });
            },

            CancelCreateService(){
                this.creatingService = false;
                this.clearCreateFormService();
            },

            onCreateFormService()
            {
                this.storeErrors = null;
                this.createErrors = null;
                this.creatingService = true;
            },

            clearCreateFormService(){
                this.form_create_service.is_active = false;
                this.form_create_service.name = '';
                this.form_create_service.group_id = '';
                this.form_create_service.description = '';
            },


            onEditForm(service) {
                this.editingService = true;
            },
            editService(){

            },

            CancelEditingService(){
                this.editingService = false;
            },

            findWithAttr(array, attr, value) {
                for(var i = 0; i < array.length; i += 1) {
                    if(array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            },

            deleteItem(service_id) {
                if ( !confirm('Are you sure you want to delete service? ') ) return;

                this.deletingService = service_id;

                axios.delete(config.apiUrl + '/my_services/' + service_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let index = this.findWithAttr(this.my_services, 'id', service_id);
                        this.$delete(this.my_services, index);
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
                // this.my_services = [];
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
                        this.my_groups = response.data.my_groups;

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
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },
        },
    }
</script>

<style scoped>
    .md-table{
        overflow: auto;
    }
</style>
<style>
    .md-menu-content {
        z-index: 10;
    }
</style>