<template>
    <div>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteService" md-persistent>
            <span>{{$lang.messages.service_deleted}}</span>
            <md-button class="md-accent" @click="flagDeleteService = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR--><!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagCreateService" md-persistent>
            <span>{{$lang.messages.service_created}}</span>
            <md-button class="md-accent" @click="flagCreateService = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR--><!--SNACKBAR--><!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagEditService" md-persistent>
            <span>{{$lang.messages.service_edited}}</span>
            <md-button class="md-accent" @click="flagEditService = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->


        <div class="md-layout">
            <md-table v-model="my_services" md-sort="name" md-sort-order="asc" md-card>
                <md-table-toolbar>
                    <h1 class="md-title">{{$lang.services.title}}</h1>
                    <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
                    <button class="btn btn-success btn-sm" @click="onCreateFormService">{{$lang.buttons.add_new}}</button>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell :md-label="$lang.services.active" md-sort-by="active">
                        <input type="checkbox" :checked="item.active == 'on'" disabled>
                    </md-table-cell>
                    <md-table-cell :md-label="$lang.services.kind" md-sort-by="type">{{ item.kind }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.type" md-sort-by="type">{{ item.type }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.sevice" md-sort-by="service">{{ item.name }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.description">{{ item.description }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.group" md-sort-by="group">{{ item.group_name }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.price" md-sort-by="price">{{ item.price }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.pending" md-sort-by="pending">{{ item.pending }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.confirmed" md-sort-by="confirmed">{{ item.confirmed }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.finished" md-sort-by="finished">{{ item.finished }}</md-table-cell>
                    <md-table-cell :md-label="$lang.services.actions">
                        <button class="btn btn-warning btn-sm"
                                @click="onEditFormService(item)"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm"
                                @click="deleteItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-primary btn-sm" @click="goServiceBook(item.id)">Booking</button>
                        <md-progress-bar md-mode="indeterminate" v-if="deletingService == item.id" />
                    </md-table-cell>
                </md-table-row>
                <div class="alert alert-warning text-center" v-if="!my_services.length && pandingResponseServer==false">{{ $lang.messages.no_service_yet}}
                </div>
            </md-table>
        </div>

        <md-dialog :md-active.sync="creatingService">
            <md-dialog-title>{{$lang.services.create_service}}</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="CreateService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <!--<div class="md-layout md-gutter">-->
                                <div class="md-layout-item md-small-size-100">
                                    <md-checkbox v-model="form_create_service.active" value="on"
                                                 :disabled="processingService">{{$lang.services.active}}</md-checkbox>

	                                <br>
	                                <md-radio v-model="form_create_service.kind" value="service">
		                                {{$lang.services.service}}
		                                <small>({{$lang.services.default}})</small>
	                                </md-radio>
	                                <md-radio v-model="form_create_service.kind" value="item" class="md-primary">{{$lang.services.item}}</md-radio>

                                    <br>
                                    <md-radio v-model="form_create_service.type" value="provide">
                                        {{$lang.services.provide}}
                                        <small>({{$lang.services.default}})</small>
                                    </md-radio>
                                    <md-radio v-model="form_create_service.type" value="request" class="md-primary">{{$lang.services.request}}</md-radio>

                                    <md-field>
                                        <label>{{$lang.services.name}}</label>
                                        <md-input v-model="form_create_service.name"
                                                  :disabled="processingService" />
                                    </md-field>

                                    <md-field>
                                        <label>{{$lang.services.description}}</label>
                                        <md-textarea v-model="form_create_service.description" :disabled="processingService" />
                                    </md-field>

                                    <md-field>
                                        <label>{{$lang.services.price}}({{$lang.services.optional}})</label>
                                        <md-input v-model="form_create_service.price"
                                                  :disabled="processingService" />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>{{$lang.services.target_group}}</label>
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
                                                        {{$lang.services.not_any_groups}}
                                                    </md-option>
                                                </div>
                                            </md-select>
                                        </md-field>
                                    </div>
                                    <div id="business_hours text-center" v-if="form_create_service.type == 'provide'"
                                         v-for="(business, index) in form_create_service.business_hours">
                                        <div class="row">
                                            <md-checkbox v-model="business.days" value="0">{{$lang.services.mo}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="1">{{$lang.services.tu}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="2">{{$lang.services.we}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="3">{{$lang.services.th}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="4">{{$lang.services.fr}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="5">{{$lang.services.sa}}</md-checkbox>
                                            <md-checkbox v-model="business.days" value="6">{{$lang.services.su}}</md-checkbox>
                                        </div>
                                            <div class="md-layout-item md-small-size-100 text-center ">
                                                <label class="align-center">{{$lang.services.start}}
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
                                                <label>{{$lang.services.end}}</label>
                                                <date-picker
                                                        v-model="business.time.end_time"
                                                             :config="options" placeholder="18:00"></date-picker>
                                            </div>
                                        <hr>
                                        <br>
                                    </div>

                                    <md-button class="md-icon-button md-raised md-primary"
                                               @click="addMorebusiness"
                                               v-if="form_create_service.type == 'provide'"
                                    >
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
                                    {{$lang.buttons.close}}</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >{{$lang.buttons.create}}</md-button>
                            </md-dialog-actions>
                        </md-card-actions>


                    </md-card>
                </form>
            </div>
        </md-dialog>

        <md-dialog :md-active.sync="editingService">
            <md-dialog-title>{{$lang.services.edit_service}}</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editService()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <!--<div class="md-layout md-gutter">-->
                            <div class="md-layout-item md-small-size-100">
                                <md-checkbox v-model="form_edit_service.active" value="on"
                                             :disabled="processingService">Active</md-checkbox>

	                            <br>
	                            <md-radio v-model="form_edit_service.kind" value="service">
		                            {{$lang.services.service}}
	                            </md-radio>
	                            <md-radio v-model="form_edit_service.kind" value="item" class="md-primary">{{$lang.services.item}}</md-radio>

                                <br>
                                <md-radio v-model="form_edit_service.type" value="provide">
                                    {{$lang.services.provide}}
                                </md-radio>
                                <md-radio v-model="form_edit_service.type" value="request" class="md-primary">{{$lang.services.request}}</md-radio>

                                <md-field>
                                    <label>{{$lang.services.name}}</label>
                                    <md-input v-model="form_edit_service.name"
                                              :disabled="processingService" />
                                </md-field>

                                <md-field>
                                    <label>{{$lang.services.description}}</label>
                                    <md-textarea v-model="form_edit_service.description" :disabled="processingService" />
                                </md-field>

                                <md-field>
                                    <label>{{$lang.services.price}}({{$lang.services.optional}})</label>
                                    <md-input v-model="form_edit_service.price"
                                              :disabled="processingService" />
                                </md-field>

                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>Target Group{{$lang.services.edit_service}}</label>
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
                                                    Not any groups{{$lang.services.edit_service}}
                                                </md-option>
                                            </div>
                                        </md-select>
                                    </md-field>
                                </div>
                                <div class="text-center" v-if="form_edit_service.type == 'provide'"
                                     v-for="(business, index) in form_edit_service.business_hours">
                                    <div class="row text-center">
                                        <md-checkbox v-model="business.days" value="0">{{$lang.services.mo}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="1">{{$lang.services.tu}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="2">{{$lang.services.we}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="3">{{$lang.services.th}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="4">{{$lang.services.fr}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="5">{{$lang.services.sa}}</md-checkbox>
                                        <md-checkbox v-model="business.days" value="6">{{$lang.services.su}}</md-checkbox>
                                    </div>
                                    <div class="md-layout-item md-small-size-100 text-center ">
                                        <label class="align-center">{{$lang.services.start}}
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
                                        <label>{{$lang.services.end}}</label>
                                        <date-picker
                                                v-model="business.time.end_time"
                                                :config="options" placeholder="18:00"></date-picker>
                                    </div>
                                    <hr>
                                    <br>
                                </div>

                                <md-button class="md-icon-button md-raised md-primary"
                                           @click="addMorebusinessToEditForm"
                                           v-if="form_edit_service.type == 'provide'"
                                >
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
                                    {{$lang.buttons.close}}</md-button>
                                <md-button :disabled="processingService"
                                           type="submit"
                                           class="md-accent md-raised"
                                >{{$lang.buttons.update}}</md-button>
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
                    kind: 'service',
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
                    kind: null,
                    type: 'provide',
                    name: '',
                    description: '',
                    price: '',
                    group_name: '',
                    group_id: '',
                    business_hours: []
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
            goServiceBook(service_id){
                console.log(service_id);
                this.$router.push({ name: 'book-service', params: { service_id: service_id }})
            },

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
                console.log(this.form_edit_service.business_hours);
                // this.$set()
                this.form_edit_service.business_hours.push(obj);
            },

            getCreateConstraints(){
                return {

                    kind: {
                        presence: true,
                        length: {
                            minimum: 4,
                            maximum: 7,
                            message: 'Must be item or service'
                        }
                    },
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
                this.form_create_service.kind = 'service';
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
                this.form_edit_service.kind = null;
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
                this.form_edit_service.kind = service.kind;
                this.form_edit_service.type = service.type;
                this.form_edit_service.name = service.name;
                this.form_edit_service.description = service.description;
                this.form_edit_service.price = service.price;
                this.form_edit_service.group_name = service.group_name;
                this.form_edit_service.group_id = service.group_id;
                if (service.business_hours != null) {
                  let arr = [];
                  for (let key in service.business_hours) {
                    arr.push(service.business_hours[key]);
                  }
                  this.form_edit_service.business_hours = arr;
                }

                // console.log(this.form_edit_service);
            },

            editService(){
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
                if ( !confirm(this.$lang.messages.are_you_sure_delete_service) ) return;

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
                                kind: oneService.kind,
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

    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }

    div[md-dynamic-height] {  /*form hight for creating service in my service*/
        overflow-y: auto;
    }

    .md-card{
        margin: 0;
    }

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

</style>

<style>
    .md-menu-content {
        z-index: 10;
    }
</style>
