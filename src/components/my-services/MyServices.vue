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
        <!--SNACKBAR--><!--SNACKBAR--><!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagEditService" md-persistent>
            <span>You edited service successfully!</span>
            <md-button class="md-accent" @click="flagEditService = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->


        <div class="md-layout">
            <md-table v-model="my_services" md-sort="name" md-sort-order="asc" md-card >
                <md-table-toolbar>
                    <h1 class="md-title">My Helping Services</h1>
                    <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
                    <button class="btn btn-success btn-sm" @click="onCreateFormService">Add New Service</button>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Active" md-sort-by="active">
                        <input type="checkbox" :checked="item.active == 'on'" disabled>
                    </md-table-cell>
                    <md-table-cell md-label="Type" md-sort-by="type">{{ item.type }}</md-table-cell>
                    <md-table-cell md-label="Sevice" md-sort-by="service">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Description">{{ item.description }}</md-table-cell>
                    <md-table-cell md-label="Group" md-sort-by="group">{{ item.group_name }}</md-table-cell>
                    <md-table-cell md-label="Price" md-sort-by="price">{{ item.price }}</md-table-cell>
                    <md-table-cell md-label="Pending" md-sort-by="pending">{{ item.pending }}</md-table-cell>
                    <md-table-cell md-label="Confirmed" md-sort-by="confirmed">{{ item.confirmed }}</md-table-cell>
                    <md-table-cell md-label="Finished" md-sort-by="finished">{{ item.finished }}</md-table-cell>
                    <md-table-cell md-label="Actions">
                        <button class="btn btn-warning btn-sm"
                                @click="onEditFormService(item)"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm"
                                @click="deleteItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-primary btn-sm">Booking</button>
                        <md-progress-bar md-mode="indeterminate" v-if="deletingService == item.id" />
                    </md-table-cell>
                </md-table-row>
                <div class="alert alert-warning text-center" v-if="!my_services.length && pandingResponseServer==false">No any
                    Helping Services yet....
                </div>
            </md-table>
        </div>

        <md-dialog :md-active.sync="creatingService">
            <md-dialog-title>Create Service</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="CreateService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <!--<div class="md-layout md-gutter">-->
                                <div class="md-layout-item md-small-size-100">
                                    <md-checkbox v-model="form_create_service.active" value="on"
                                                 :disabled="processingService">Active</md-checkbox>

                                    <br>
                                    <md-radio v-model="form_create_service.type" value="provide">
                                        Provide service
                                        <small>(Default)</small>
                                    </md-radio>
                                    <md-radio v-model="form_create_service.type" value="request" class="md-primary">Request service</md-radio>

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
                                    <div id="business_hours text-center" v-if="form_create_service.type == 'provide'"
                                         v-for="(business, index) in form_create_service.business_hours">
                                        <div class="row">
                                            <md-checkbox v-model="business.days" value="1">mo</md-checkbox>
                                            <md-checkbox v-model="business.days" value="2">tu</md-checkbox>
                                            <md-checkbox v-model="business.days" value="3">we</md-checkbox>
                                            <md-checkbox v-model="business.days" value="4">th</md-checkbox>
                                            <md-checkbox v-model="business.days" value="5">fr</md-checkbox>
                                            <md-checkbox v-model="business.days" value="6">sa</md-checkbox>
                                            <md-checkbox v-model="business.days" value="7">su</md-checkbox>
                                        </div>
                                            <div class="md-layout-item md-small-size-100 text-center ">
                                                <label class="align-center">START DATE
                                                    <md-button class="md-icon-button md-accent"
                                                               @click="removeBusiness(index)"
                                                    >
                                                            <i class="fas fa-times-circle"></i>
                                                    </md-button>
                                                </label>
                                                <date-picker
                                                        v-model="business.time.start_time"
                                                             :config="options" placeholder="10:00"></date-picker>
                                            </div>
                                            <br>
                                            <div class="md-layout-item md-small-size-100 text-center">
                                                <label>END DATE</label>
                                                <date-picker
                                                        v-model="business.time.end_time"
                                                             :config="options" placeholder="18:00"></date-picker>
                                            </div>
                                        <hr>
                                        <br>
                                    </div>

                                    <md-button class="md-icon-button md-raised md-primary" @click="addMorebusiness">
                                        <md-icon>add</md-icon>
                                    </md-button>
                                </div>
                            <!--</div>-->

                        </md-card-content>

                        <md-progress-bar md-mode="indeterminate" v-if="processingService" />
                        <div class="errors" v-if="storeErrors">
                            <p v-for="error in storeErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="createErrors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in createErrors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>
                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingService" class="md-primary" @click="CancelCreateService">
                                    Close</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Create</md-button>
                            </md-dialog-actions>
                        </md-card-actions>


                    </md-card>
                </form>
            </div>
        </md-dialog>

        <md-dialog :md-active.sync="editingService">
            <md-dialog-title>Edit Service</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <!--<div class="md-layout md-gutter">-->
                            <div class="md-layout-item md-small-size-100">
                                <md-checkbox v-model="form_edit_service.active" value="on"
                                             :disabled="processingService">Active</md-checkbox>

                                <br>
                                <md-radio v-model="form_edit_service.type" value="provide">
                                    Provide service
                                </md-radio>
                                <md-radio v-model="form_edit_service.type" value="request" class="md-primary">Request service</md-radio>

                                <md-field>
                                    <label>Name</label>
                                    <md-input v-model="form_edit_service.name"
                                              :disabled="processingService" />
                                </md-field>

                                <md-field>
                                    <label>Description</label>
                                    <md-textarea v-model="form_edit_service.description" :disabled="processingService" />
                                </md-field>

                                <md-field>
                                    <label>Price(optional)</label>
                                    <md-input v-model="form_edit_service.price"
                                              :disabled="processingService" />
                                </md-field>

                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>Target Group</label>
                                        <md-select name="event" v-model="form_edit_service.group_id" md-dense
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
                                <div class="text-center" v-if="form_edit_service.type == 'provide'"
                                     v-for="(business, index) in form_edit_service.business_hours">
                                    <div class="row text-center">
                                        <md-checkbox v-model="business.days" value="1">mo</md-checkbox>
                                        <md-checkbox v-model="business.days" value="2">tu</md-checkbox>
                                        <md-checkbox v-model="business.days" value="3">we</md-checkbox>
                                        <md-checkbox v-model="business.days" value="4">th</md-checkbox>
                                        <md-checkbox v-model="business.days" value="5">fr</md-checkbox>
                                        <md-checkbox v-model="business.days" value="6">sa</md-checkbox>
                                        <md-checkbox v-model="business.days" value="7">su</md-checkbox>
                                    </div>
                                    <div class="md-layout-item md-small-size-100 text-center ">
                                        <label class="align-center">START DATE
                                            <md-button class="md-icon-button md-accent"
                                                       @click="removeBusinessFromEdit(index)"
                                            >
                                                <i class="fas fa-times-circle"></i>
                                            </md-button>
                                        </label>
                                        <date-picker
                                                v-model="business.time.start_time"
                                                :config="options" placeholder="10:00"></date-picker>
                                    </div>
                                    <br>
                                    <div class="md-layout-item md-small-size-100 text-center">
                                        <label>END DATE</label>
                                        <date-picker
                                                v-model="business.time.end_time"
                                                :config="options" placeholder="18:00"></date-picker>
                                    </div>
                                    <hr>
                                    <br>
                                </div>

                                <md-button class="md-icon-button md-raised md-primary"
                                           @click="addMorebusinessToEditForm">
                                    <md-icon>add</md-icon>
                                </md-button>
                            </div>
                            <!--</div>-->

                        </md-card-content>

                        <md-progress-bar md-mode="indeterminate" v-if="processingService" />
                        <div class="errors" v-if="updateErrors">
                            <p v-for="error in updateErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="editErrors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in editErrors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingService" class="md-primary" @click="CancelEditService">
                                    Close</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Update</md-button>
                            </md-dialog-actions>
                        </md-card-actions>


                    </md-card>
                </form>
            </div>
        </md-dialog>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'
    import validate from 'validate.js'

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

                flagCreateService: false,
                creatingService: false,
                storeErrors: [],
                createErrors: [],
                form_create_service: {
                    active: null,
                    type: 'provide',
                    name: '',
                    description: '',
                    price: '',
                    group_id: '',
                    business_hours:[
                        {
                            days: [],
                            time: {
                                start_time: '',
                                end_time: ''
                            }
                        },
                    ]
                },

                flagEditService:false,
                updateErrors: null,
                editErrors: null,
                editingService: false,
                processingService: false,
                form_edit_service: {
                    service_id: null,
                    active: null,
                    type: 'provide',
                    name: '',
                    description: '',
                    price: '',
                    group_name: '',
                    group_id: '',
                    business_hours:[]
                },


                options: {
                    format: 'HH:mm',
                    useCurrent: false,
                    showClear: true,
                    showClose: true,
                    icons: {
                        time: 'far fa-clock',
                        date: 'far fa-calendar',
                        up: 'fas fa-arrow-up',
                        down: 'fas fa-arrow-down',
                        previous: 'fas fa-chevron-left',
                        next: 'fas fa-chevron-right',
                        today: 'fas fa-calendar-check',
                        clear: 'far fa-trash-alt',
                        close: 'far fa-times-circle'
                    }
                },
            }
        },

        created() {
            this.getHelpingServices()
        },

        methods: {
            removeBusiness(index){
                this.$delete(this.form_create_service.business_hours, index);
            },

            removeBusinessFromEdit(index){
                this.$delete(this.form_edit_service.business_hours, index);
            },

            addMorebusiness(){
                let obj = {
                    days: [],
                    time: {
                        start_time: '',
                        end_time: ''
                    }
                };
                this.form_create_service.business_hours.push(obj);
            },

            addMorebusinessToEditForm(){
                let obj = {
                    days: [],
                    time: {
                        start_time: '',
                        end_time: ''
                    }
                };
                this.form_edit_service.business_hours.push(obj);
            },

            getCreateConstraints(){
                return {

                    type: {
                        presence: true,
                        length: {
                            minimum: 7,
                            maximum: 8,
                            message: 'Must be provide or request'
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
                // console.log(this.form_create_service); return;

                this.createErrors = null;

                const constraints = this.getCreateConstraints();

                const errors = validate(this.form_create_service, constraints);

                if (errors) {
                    this.createErrors = errors;
                    return ;
                }

                this.processingService = true;

                // send to api this.form_create_item
                axios.post(config.apiUrl + '/my_services', this.form_create_service, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.flagCreateService = true;
                        this.getHelpingServices();
                        this.processingService = false;
                        this.CancelCreateService();
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
                        this.processingService = false;
                    });
            },

            CancelCreateService(){
                this.creatingService = false;
                this.clearCreateFormService();
            },

            CancelEditService(){
                this.editingService = false;
                this.clearEditFormService();
            },

            onCreateFormService()
            {
                this.storeErrors = null;
                this.createErrors = null;
                this.creatingService = true;
            },

            clearCreateFormService(){
                this.form_create_service.active = false;
                this.form_create_service.type = 'provide';
                this.form_create_service.name = '';
                this.form_create_service.description = '';
                this.form_create_service.price = null;
                this.form_create_service.group_id = '';
                this.form_create_service.business_hours = [
                    {
                        days: [],
                        time: {
                            start_time: '',
                            end_time: ''
                        }
                    },
                ];
            },

            clearEditFormService(){
                this.updateErrors = null;
                this.editErrors = null;
                this.form_edit_service.service_id = null;
                this.form_edit_service.active = false;
                this.form_edit_service.type = 'provide';
                this.form_edit_service.name = '';
                this.form_edit_service.description = '';
                this.form_edit_service.price = null;
                this.form_edit_service.group_id = '';
                this.form_edit_service.business_hours = [];
            },

            onEditFormService(service) {
                this.editingService = true;

                this.form_edit_service.service_id = service.id;
                this.form_edit_service.active = service.active;
                this.form_edit_service.type = service.type;
                this.form_edit_service.name = service.name;
                this.form_edit_service.description = service.description;
                this.form_edit_service.price = service.price;
                this.form_edit_service.group_name = service.group_name;
                this.form_edit_service.group_id = service.group_id;
                this.form_edit_service.business_hours = service.business_hours;

                // console.log(this.form_edit_service);
            },

            editService(){
                console.log('storing service...');
                this.editErrors = null;

                const constraints = this.getCreateConstraints();

                const errors = validate(this.form_edit_service, constraints);

                if (errors) {
                    this.editErrors = errors;
                    return ;
                }

                this.processingService = true;
                // send to api this.form_create_item
                axios.put(config.apiUrl + '/my_services', this.form_edit_service, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.flagEditService = true;
                        this.getHelpingServices();
                        this.processingService = false;
                        this.CancelEditService();
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
                        this.processingService = false;
                    });
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
                                group_name: oneService.group.name,
                                group_id: oneService.group.id,
                                price: oneService.price,
                                pending: '0',
                                confirmed: oneService.confirmed,
                                finished: '0',
                                business_hours: JSON.parse(oneService.business_hours),
                            };
                            // console.log(obje);
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
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }

</style>
<style>
    .md-menu-content {
        z-index: 10;
    }
    div[md-dynamic-height] {
        overflow: auto;
    }
    .bootstrap-datetimepicker-widget {

        /*width: 100px;*/
        /*background: red;*/
    }
</style>