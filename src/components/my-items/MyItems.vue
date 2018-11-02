<template>
    <div>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                     :md-active.sync="flagDeleteItem" md-persistent>
            <span>You deleted item successfully!</span>
            <md-button class="md-accent" @click="flagDeleteItem = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                     :md-active.sync="updatedItem" md-persistent>
            <span>You edited item successfully!</span>
            <md-button class="md-accent" @click="updatedItem = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration"
                     :md-active.sync="createdItem" md-persistent>
            <span>You created item successfully!</span>
            <md-button class="md-accent" @click="createdItem = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <div class="md-layout" >
            <md-table v-model="myItems" md-sort="name" md-sort-order="asc" md-card>
                <md-table-toolbar>
                    <h1 class="md-title">My Shared Items</h1>
                    <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
                    <button class="btn btn-success btn-sm" @click="onCreateFormItem">Add New Item</button>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }">
                    <md-table-cell md-label="Sharing" md-sort-by="is_active">
                        <input type="checkbox" :checked="item.is_active" disabled>
                    </md-table-cell>
                    <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Group" md-sort-by="group_name">{{ item.group.name }}</md-table-cell>
                    <md-table-cell md-label="Status" md-sort-by="status">{{ item.status }}</md-table-cell>
                    <md-table-cell md-label="Current Lent" md-sort-by="lent">{{ item.lent }}</md-table-cell>
                    <md-table-cell md-label="Active Booking" md-sort-by="lent">-</md-table-cell>
                    <md-table-cell md-label="Actions">
                        <button class="btn btn-warning btn-sm" @click="onEditFormItem(item)"><i class="fas fa-edit">
                        </i></button>
                        <button class="btn btn-danger btn-sm" @click="deleteItem(item.id)"><i class="fas fa-trash-alt"></i></button>
                        <button class="btn btn-primary" @click="BookItem(item.id)">
                            <!--<router-link class="btn btn-primary" :to="{ name: 'book-items', params:  { item_id: item.id} }">-->
                                Booking
                            <!--</router-link>-->
                        </button>
                        <md-progress-bar md-mode="indeterminate" v-if="deletingItem == item.id" />
                    </md-table-cell>
                </md-table-row>
                <div class="alert alert-warning text-center" v-if="!myItems.length && pandingResponseServer==false">No any Services Items yet....
                </div>
            </md-table>
        </div>

        <md-dialog :md-active.sync="editingItem">
            <md-dialog-title>Edit Item</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editItem()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>Name</label>
                                        <md-input name="title" v-model="form_edit_item.name"
                                                  :disabled="processingItem" />
                                    </md-field>

                                    <md-field>
                                        <md-checkbox v-model="form_edit_item.is_active"
                                                     :disabled="processingItem">Availabel for sharing</md-checkbox>
                                    </md-field>

                                    <md-field>
                                        <label>Description</label>
                                        <md-textarea name="description" v-model="form_edit_item.description" :disabled="processingItem" />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Target Group</label>
                                            <md-select name="event" v-model="form_edit_item.group.id" md-dense
                                                       :placeholder="form_edit_item.group.name"
                                                       :disabled="processingItem">
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

                        <md-progress-bar md-mode="indeterminate" v-if="processingItem" />

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingItem" class="md-primary" @click="CancelEditingItem">
                                    Close</md-button>
                                <md-button :disabled="processingItem"
                                           type="submit"
                                           class="md-accent md-raised"
                                >Update</md-button>
                            </md-dialog-actions>
                        </md-card-actions>

                        <div class="deleteErrors" v-if="updateErrors">
                            <p v-for="error in updateErrors">{{ error }}</p>
                        </div>

                        <div class="errors" v-if="editErrors">
                            <ul>
                                <li v-for="(fieldsError, fieldName) in editErrors" :key="fieldName">
                                    {{ fieldsError.join('\n') }}
                                </li>
                            </ul>
                        </div>
                    </md-card>
                </form>
            </div>
        </md-dialog>

        <md-dialog :md-active.sync="creatingItem">
            <md-dialog-title>Create Item</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="CreateItem()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label>Name</label>
                                        <md-input name="title" v-model="form_create_item.name"
                                                  :disabled="processingItem" />
                                    </md-field>

                                    <md-field>
                                        <md-checkbox v-model="form_create_item.is_active"
                                                     :disabled="processingItem">Availabel for sharing</md-checkbox>
                                    </md-field>

                                    <md-field>
                                        <label>Description</label>
                                        <md-textarea name="description" v-model="form_create_item.description" :disabled="processingItem" />
                                    </md-field>

                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label>Target Group</label>
                                            <md-select name="event" v-model="form_create_item.group_id" md-dense
                                                       placeholder="Please select target group"
                                                       :disabled="processingItem">
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

                        <md-progress-bar md-mode="indeterminate" v-if="processingItem" />

                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processingItem" class="md-primary" @click="CancelCreateItem">
                                    Close</md-button>
                                <md-button :disabled="processingItem"
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
    import validate from 'validate.js'

    export default {
        name: "MyItems",
        data() {
            return {
                myItems: [],
                my_groups: [],

                position: 'left',
                duration: 4000,
                pandingResponseServer: false,
                flagDeleteItem: false,
                deletingItem: false,
                editingItem: false,
                creatingItem: false,
                processingItem: false,


                form_edit_item:{
                    item_id: '',
                    is_active: false,
                    name: '',
                    group: {
                        id: '',
                        name: ''
                    },
                    description: '',
                },
                updateErrors: null,
                editErrors: null,
                updatedItem: false,

                creatingItem: false,
                form_create_item:{
                    is_active: false,
                    name: '',
                    group_id: '',
                    description: '',
                },
                storeErrors: null,
                createErrors: null,
                createdItem: false,
            }
        },

        created() {
            this.getMyItems();
        },

        methods: {
            BookItem(item_id){
                this.$router.push({ name: 'book-items', params: { item_id: item_id }})
            },
            CreateItem(){
                this.createErrors = null;

                const constraints = this.getCreateConstraints();

                const errors = validate(this.form_create_item, constraints);

                if (errors) {
                    this.createErrors = errors;
                    return ;
                }
                this.processingItem = true;
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
                        this.createdItem = true;
                        this.getMyItems();
                        this.creatingItem = false;
                        this.clearCreateFormItem();
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

            CancelCreateItem(){
                this.creatingItem = false;
                this.clearCreateFormItem();
            },

            onCreateFormItem()
            {
                this.storeErrors = null;
                this.createErrors = null;
                this.creatingItem = true;
            },

            clearCreateFormItem(){
                this.form_create_item.is_active = false;
                this.form_create_item.name = '';
                this.form_create_item.group_id = '';
                this.form_create_item.description = '';
            },

            clearEditFormItem(){
              this.form_edit_item.item_id = '';
              this.form_edit_item.is_active = false;
              this.form_edit_item.name = '';
              this.form_edit_item.group_id = '';
              this.form_edit_item.description = '';
            },

            onEditFormItem(item){

                this.form_edit_item.item_id = item.id;
                this.form_edit_item.is_active = item.is_active;
                this.form_edit_item.name = item.name;
                this.form_edit_item.group.id = item.group.id;
                this.form_edit_item.group.name = item.group.name;
                this.form_edit_item.description = item.description;

                this.editingItem = true;
            },

            CancelEditingItem(){
                this.editingItem = false;
                this.clearEditFormItem();
            },

            editItem(){
                this.updateErrors = null;
                this.editErrors = null;

                const constraints = this.getConstraints();
                const errors = validate(this.form_edit_item, constraints);
                if (errors) {
                    this.editErrors = errors;
                    return ;
                }
                this.processingItem = true;

                let data = {
                    name: this.htmlEntities(this.form_edit_item.name),
                    group_id: this.htmlEntities(this.form_edit_item.group.id),
                    description: this.htmlEntities(this.form_edit_item.description),
                    is_active: this.form_edit_item.is_active,
                    item_id: this.htmlEntities(this.form_edit_item.item_id),
                };

                axios.put(config.apiUrl + '/my_sharingitems', data, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.getMyItems();
                        this.updatedItem = true;
                        this.CancelEditingItem();
                    })
                    .catch((err) => {
                        /*let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.updateErrors = data_errors;
                        console.log(this.updateErrors);*/
                        console.log(err);
                    })
                    .finally(() => {
                        this.processingItem = false;
                    });
            },

            getCreateConstraints(){
                return {
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
                    is_active: {
                        presence: true,
                    },
                }
            },

            getConstraints(){
                return {
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
                    item_id: {
                        presence: true,
                        numericality: {
                            onlyInteger: true,
                            greaterThanOrEqualTo: 0
                        }
                    },
                    is_active: {
                        presence: true,
                    },
                }
            },

            findWithAttr(array, attr, value) {
                for(var i = 0; i < array.length; i += 1) {
                    if(array[i][attr] === value) {
                        return i;
                    }
                }
                return -1;
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },

            deleteItem(item_id)
            {
                if ( !confirm('Are you sure you want to delete the item? ') ) return;

                this.deletingItem = item_id;

                axios.delete(config.apiUrl + '/my_sharingitems/' + item_id, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        let index = this.findWithAttr(this.myItems, 'id', item_id);
                        this.$delete(this.myItems, index);
                        this.flagDeleteItem = true;
                    })
                    .catch((err) => {
                        console.log(err);
                    })
                    .finally(() => {
                        this.deletingItem = false;
                    });
            },

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
                        let group_item = response.data.my_items;
                        this.my_groups = response.data.my_groups;

                        for (index = 0; index < group_item.length; index++) {

                            this.$set(this.myItems, i, '');

                            let oneItem = group_item[index];

                            let obje = {
                                id: oneItem.id,
                                is_active: oneItem.is_active == 'on' ? true : false,
                                name: oneItem.name,
                                group: oneItem.group,
                                description: oneItem.description,
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
    .md-card{
        margin: 0;
        padding: 0;
    }
    div[md-dynamic-height] {  /*form hight for creating service in my service*/
        overflow-y: auto;
    }
    md-card{
        margin: 0;
        padding: 0;
    }
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
    md-content {
        padding: 0;
        margin: 0;
    }
    .md-content {
        padding: 0;
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
        overflow-y: scroll; /* has to be scroll, not auto */
        -webkit-overflow-scrolling: touch;
    }
</style>
<style>


    .md-menu-content {
        z-index: 10;
    }
    .md-card{
        margin: 0;
        padding: 0;
    }

    md-card{
        margin: 0;
        padding: 0;
    }
    md-content {
        padding: 0;
        margin: 0;
    }
    .md-content {
        padding: 0;
        margin: 0;
    }

    .md-menu-content {
        z-index: 10;
    }
</style>