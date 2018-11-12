<template>
    <div class="page-container md-layout-column">
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="noteSaved" md-persistent>
            <span>{{$lang.messages.you_added_new_note_successful}}</span>
            <md-button class="md-accent" @click="noteSaved = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="noteDeleted" md-persistent>
            <span>{{$lang.messages.you_deleted_note_successful}}</span>
            <md-button class="md-accent" @click="noteDeleted = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="updatedNote" md-persistent>
            <span>{{$lang.messages.you_updated_note_successful}}</span>
            <md-button class="md-accent" @click="updatedNote = false">{{$lang.buttons.close}}</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <div v-if="checkGroupAdmins(currentUser_id)">
            <div class="text-center" v-if="!creatingForm">
                <md-empty-state
                        md-icon="devices_other"
                        md-label="Create your Note"
                        md-description="Creating Note, you'll be able to upload your design and collaborate with people.">
                    <md-button class="md-primary md-raised"  @click="creatingForm = true" :disabled="sending">Create your Note</md-button>
                </md-empty-state>
            </div>

            <div v-else>
                <form novalidate class="md-layout" @submit.prevent="createNote" >
                    <md-card class="md-layout-item md-size-50 md-small-size-100">
                        <md-card-header>
                            <div class="md-title">{{$lang.groups.creating_note}}</div>
                        </md-card-header>

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field :class="">
                                        <label for="title">{{$lang.fields.title}}</label>
                                        <md-input name="title" id="title" v-model="form.title" :disabled="sending" />
                                    </md-field>

                                    <md-field>
                                        <label for="description">{{$lang.fields.description}}</label>
                                        <md-textarea name="description" id="description" v-model="form.description" :disabled="sending" />
                                    </md-field>

                                    <md-field>
                                        <label for="tag">{{$lang.fields.tags}}</label>
                                        <md-textarea name="tag" id="tag" v-model="form.tag" :disabled="sending" />
                                    </md-field>
                                </div>
                            </div>
                            <div class="errors" v-if="errors">
                                <ul>
                                    <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                                        {{ fieldsError.join('\n') }}
                                    </li>
                                </ul>
                            </div>
                        </md-card-content>
                        <md-progress-bar md-mode="indeterminate" v-if="sending" />
                        <md-card-actions>
                            <md-button type="button" class="md-accent" @click="creatingForm = false"><i class="fas fa-minus-circle"></i></md-button>
                            <md-button type="submit" class="md-primary md-raised" :disabled="sending"><i class="fas fa-plus-circle"></i></md-button>
                        </md-card-actions>
                    </md-card>
                </form>
            </div>
        </div>

        <br>
        <div class="alert alert-warning" v-if="groupNotes.length == 0">{{$lang.messages.no_notes_were_found}}</div>
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        <div v-for="note in groupNotes" :key="note.id">
            <md-card md-with-hover class="md-layout-item md-size-50 md-small-size-100">
                <md-ripple>

                    <md-card-header>
                        <div class="md-title">
                            {{ note.title }}
                        </div>
                        <div class="md-subhead">
                            {{ convertDate(note.created_at) | moment("from") }}
                        </div>
                    </md-card-header>

                    <md-card-content>
                        {{ note.description }}
                        <hr>
                        <i class="fas fa-tags"></i>
                        {{ note.tag }}
                    </md-card-content>

                    <md-card-actions v-if="checkAuthor(note.user_id) || checkGroupAdmins(currentUser_id)">
                        <md-button class="md-primary" @click="onFormEditNote(note.title, note.description, note.tag, note.id)"><i class="far fa-edit"></i></md-button>
                        <md-button class="md-accent" @click="deleteNote(note.id)"><i class="far fa-trash-alt"></i></md-button>
                    </md-card-actions>
                </md-ripple>
                <md-progress-bar class="md-accent"  md-mode="indeterminate" v-if="deletingNoteProcess == note.id" />
                <div class="errors" v-if="deletingErrors == note.id">
                    <ul>
                        <li v-for="(fieldsError, fieldName) in delete_errors" :key="fieldName">
                            {{ fieldsError.join('\n') }}
                        </li>
                    </ul>
                </div>
            </md-card>
        </div>

        <md-dialog :md-active.sync="formEditingNote">
            <md-dialog-title>{{$lang.groups.editing_note}}</md-dialog-title>
            <div md-dynamic-height>
                <form md-dynamic-height novalidate class="md-layout" @submit.prevent="editNote()">
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout md-gutter">
                                    <div class="md-layout-item md-small-size-100">
                                        <md-field>
                                            <label >{{$lang.fields.title}}</label>
                                            <md-input v-model="value_edit_note.title" :disabled="processEditingNote" />
                                        </md-field>

                                        <md-field>
                                            <label>{{$lang.fields.description}}</label>
                                            <md-textarea v-model="value_edit_note.description" :disabled="processEditingNote" />
                                        </md-field>

                                        <md-field>
                                            <label >{{$lang.fields.tags}}</label>
                                            <md-textarea  v-model="value_edit_note.tags" :disabled="processEditingNote" />
                                        </md-field>
                                    </div>
                                </div>
                            </div>
                        </md-card-content>
                        <md-card-actions>
                            <md-dialog-actions>
                                <md-button :disabled="processEditingNote" class="md-primary" @click="CancelEditingNote">{{$lang.buttons.close}}</md-button>
                                <md-button :disabled="processEditingNote"
                                           type="submit"
                                           class="md-accent md-raised"
                                >{{$lang.buttons.update}}</md-button>
                            </md-dialog-actions>
                        </md-card-actions>
                        <div class="errors" v-if="updateErrorsServer">
                            <p v-for="error in updateErrorsServer">{{ error }}</p>
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
            <md-progress-bar md-mode="indeterminate" v-if="processEditingNote" />
        </md-dialog>
    </div>
</template>

<script>
    import validate from 'validate.js'
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupNotes",
        data: () => ({
            form:{
                title: '',
                description: '',
                tag: '',
            },
            noteSaved: false,
            sending: false,
            errors: null,
            groupNotes: false,
            creatingForm: false,

            position: 'center',
            duration: 4000,
            pandingResponseServer: false,

            currentUser_id: null,
            groupAdminsID: [],
            deletingNoteProcess: false,
            noteDeleted: false,
            delete_errors: false,
            deletingErrors: null,

            value_edit_note: {
                title: null,
                description: null,
                tag: null,
                id: null
            },

            formEditingNote: false,
            editErrors: false,
            processEditingNote: false,
            updateErrorsServer: null,
            updatedNote: false
        }),
        mounted(){
            this.updateNotes();
            this.currentUser_id = this.$store.getters.currentUser.id;
        },
        methods: {
            checkAuthor(user_id){
                return this.currentUser_id == user_id;
            },

            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            updateNotes(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group_notes/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupNotes = response.data.notes;
                        this.groupAdminsID = response.data.admins_id;
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally( () => {
                        this.pandingResponseServer = false;
                    });
            },

            createNote() {

                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                this.sending = true;

                this.formEntities();
                // send to api this.form.post
                axios.post(config.apiUrl + '/group_notes/' + this.$route.params.groupname, this.$data.form, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.formClear();
                        this.creatingForm = false;
                        this.noteSaved = true;
                        this.updateNotes();
                    })
                    .catch((err) => {
                        this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                        console.log(this.errors);
                    })
                    .finally( () => {
                        this.sending = false;
                    });
            },

            onFormEditNote(title, description, tags, id) {
                this.clearNoteEditForm();

                this.value_edit_note.title = this.htmlEntities(title);
                this.value_edit_note.description = this.htmlEntities(description);
                this.value_edit_note.tag = this.htmlEntities(tags);
                this.value_edit_note.id = this.htmlEntities(id);

                this.formEditingNote = true;
                this.editErrors = null;
            },

            editNote(){

                const constraints = this.getConstraints();

                const errors = validate(this.$data.value_edit_note, constraints);
                if (errors) {
                    this.editErrors = errors;
                    return ;
                }

                this.processEditingNote = true;

                axios.put(config.apiUrl + '/group_notes/' + this.$route.params.groupname, this.value_edit_note, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.updateNotes();
                        this.updatedNote = true;
                        this.CancelEditingNote();
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.updateErrorsServer = data_errors;
                        // console.log(this.updateErrors);
                    })
                    .finally(() => {
                        this.processEditingNote = false;
                    });
            },

            clearNoteEditForm() {
              this.value_edit_note.title = null;
              this.value_edit_note.description= null;
              this.value_edit_note.tag = null;
            },

            CancelEditingNote(){
                this.formEditingNote = null;
                this.clearNoteEditForm();
            },

            deleteNote(note_id) {
                this.deletingNoteProcess = note_id;
                let note = {
                    note_id: note_id
                };
                let headers = {
                    "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                };

                axios.delete(config.apiUrl + '/group_notes',
                    {params: note, headers})

                    .then((response) => {
                        this.updateNotes();
                        this.noteDeleted = true;
                    })
                    .catch((err) => {
                        let data_errors = [];
                        data_errors.push(err.message);
                        data_errors.push(err.response.data.message);
                        this.delete_errors = data_errors;
                        this.deletingErrors = note_id;
                    })
                    .finally(() => {
                        this.deletingNoteProcess = false;
                    });

            },

            getConstraints(){
                return {
                    title: {
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
                }
            },

            convertDate(datetimeString) {
                let utcTZ = this.$moment.tz(datetimeString, 'UTC').format();
                let currentTZ = this.$moment(utcTZ.valueOf());
                return currentTZ;
            },

            htmlEntities(str) {
                return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g,'&apos');
            },

            formEntities(){
                this.form.title = this.htmlEntities(this.form.title);
                this.form.description = this.htmlEntities(this.form.description);
                this.form.tag = this.htmlEntities(this.form.tag);
            },

            formClear() {
                this.form.title='';
                this.form.description='';
                this.form.tag='';
            }
        }
    }
</script>

<style scoped>
    .errors{
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }

    .md-card{
        margin: 10px;
        padding: 10px;
    }
</style>