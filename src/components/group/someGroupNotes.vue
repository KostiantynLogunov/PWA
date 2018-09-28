<template>
    <div class="page-container md-layout-column">
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
                        <div class="md-title">Creating Note</div>
                    </md-card-header>

                    <md-card-content>
                        <div class="md-layout md-gutter">
                            <div class="md-layout-item md-small-size-100">
                                <md-field :class="">
                                    <label for="title">Title</label>
                                    <md-input name="title" id="title" v-model="form.title" :disabled="sending" />
                                </md-field>

                                <md-field>
                                    <label for="description">Description</label>
                                    <md-textarea name="description" id="description" v-model="form.description" :disabled="sending" />
                                </md-field>

                                <md-field>
                                    <label for="tag">Tags:</label>
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

        <br>
        <div class="alert alert-warning" v-if="groupNotes.length == 0">No notes were found...</div>
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

                    <md-card-actions>
                        <md-button class="md-primary"><i class="far fa-edit"></i></md-button>
                        <md-button class="md-accent"><i class="far fa-trash-alt"></i></md-button>
                    </md-card-actions>
                </md-ripple>
            </md-card>
            <md-snackbar :md-position="position" :md-duration="duration" :md-active.sync="noteSaved" md-persistent>
                <span>You added new note successful !</span>
                <md-button class="md-accent" @click="noteSaved = false">Close</md-button>
            </md-snackbar>
        </div>
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

            showSnackbarNote: false,
            position: 'center',
            duration: 4000,
            pandingResponseServer: false,
            showSnackbar: false,

            position: 'center',
            duration: 4000,
        }),
        mounted(){
            this.updateNotes();
        },
        methods: {
            updateNotes(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group_notes/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        this.groupNotes = response.data.notes;
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