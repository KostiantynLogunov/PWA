<template>
    <div>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="flagDeleteDocument" md-persistent>
            <span>You deleted a document!</span>
            <md-button class="md-accent" @click="flagDeleteDocument = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->
        <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="docUploaded" md-persistent>
            <span>You downloaded a new document!</span>
            <md-button class="md-accent" @click="docUploaded = false">Close</md-button>
        </md-snackbar>
        <!--SNACKBAR-->

        <div class="btn-getFiles text-center">
            <md-button type="buttom" class="md-primary" v-if="!showUploadForm" @click="showUploadForm = !showUploadForm">Upload document</md-button>

            <md-button type="buttom" >
                <file-picker-button :config="gConfig" @picked="showDetails">
                    Open Google Drive Dialog
                </file-picker-button>
            </md-button>

            <md-button type="buttom" class="md-primary"><div id="dropbox-container" ref="dropboxContainer"></div></md-button>
            <br>
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="downloadingFile"></md-progress-spinner>
        </div>

        <md-dialog :md-active.sync="showUploadForm">
            <md-dialog-title>New Document</md-dialog-title>
            <div md-dynamic-height>
                <form class="md-layout" @submit.prevent="uploadNewDoc" >
                    <md-card class="md-layout-item md-size-100 md-small-size-100">

                        <md-card-content>
                            <div class="md-layout md-gutter">
                                <div class="md-layout-item md-small-size-100">
                                    <md-field>
                                        <label for="name">Name</label>
                                        <!--<md-input name="name" id="name" autocomplete="given-name" v-model="form.name" :disabled="uploading" v-validate="'required|alpha_num'"/>-->
                                        <md-input name="name" id="name" autocomplete="given-name" v-model="form.name" :disabled="uploading" />
                                    </md-field>
                                </div>
                            </div>

                            <!--<span class="errors">{{ errors.first('name') }}</span>-->

                            <input-tag :tags.sync="form.tags"
                                       placeholder="add a tag"
                                       :disabled="uploading"
                            ></input-tag>

                            <md-field>
                                <!--<label>File</label>-->
                                <!--<md-file v-model="form.file" name="file" v-validate="'required'"/>-->
                                <!--<md-file v-model="file" id="file" ref="file" v-on:change="handleFileUpload()"/>-->
                                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
                            </md-field>
                            <!--<span class="errors">{{ errors.first('file') }}</span>-->

                            <md-checkbox v-model="form.shared" class="md-primary">Shared</md-checkbox>

                        </md-card-content>

                        <md-card-actions>
                            <md-button :disabled="uploading" class="md-accent" @click="CancelUploadForm">Close</md-button>
                            <md-button type="submit" class="md-primary" :disabled="uploading">Upload document</md-button>
                        </md-card-actions>

                        <div class="errors" v-if="uploadsErrors">
                            <p class="pl-3" v-for="error in uploadsErrors">
                                {{ error[0] }}
                            </p>
                        </div>

                        <md-progress-bar md-mode="indeterminate" v-if="uploading" />
                    </md-card>
                </form>
            </div>
        </md-dialog>

        <div class="alert alert-warning text-center" v-if="!groupDocuments.length">No any Documents yet....
            <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
        </div>

        <div class="md-layout" v-else>
            <md-table v-model="documents" md-sort="name" md-sort-order="asc" md-card >
                <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="deleteProcess" />
                <md-table-toolbar>
                    <h1 class="md-title">Documents</h1>
                </md-table-toolbar>

                <md-table-row slot="md-table-row" slot-scope="{ item }" v-if="groupDocuments.length">

                    <md-table-cell md-label="Sharing" md-sort-by="shared">
                        <input type="checkbox" :checked="item.shared== '1'" disabled>
                    </md-table-cell>
                    <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                    <md-table-cell md-label="Tag" md-sort-by="tag">{{ item.tag }}</md-table-cell>
                    <md-table-cell md-label="Owner" md-sort-by="owner">{{ item.owner }}</md-table-cell>
                    <md-table-cell md-label="Date Created" md-sort-by="created_at">{{ item.created_at }}</md-table-cell>
                    <md-table-cell md-label="Date Update" md-sort-by="updated_at">{{ item.updated_at }}</md-table-cell>
                    <md-table-cell md-label="Mention Link" md-sort-by="token">{{ item.token }}</md-table-cell>
                    <md-table-cell md-label="Actions" v-if="checkAuthor(item.user_id) || checkGroupAdmins(currentUser_id)">
                        <button class="btn btn-warning"><i class="far fa-edit"></i></button>
                        <button class="btn btn-danger" @click="deleteDocument(item.id, item.index)" :disabled="deleteProcess"><i class="far fa-trash-alt"></i></button>

                    </md-table-cell>

                </md-table-row>
            </md-table>
        </div>
    </div>
</template>

<script>
    // import Vue from 'vue';
    import InputTag from 'vue-input-tag'
    import FilePickerButton from 'vue-google-picker'

    import axios from 'axios'
    import { config } from '../../_services/config'


    export default {
        name: "someGroupDocuments",

        components: {
            'input-tag': InputTag,
            FilePickerButton
        },

        // data: () => ({
        data() {
            return {
                documents: [
                    {},
                ],
                groupDocuments: false,
                pandingResponseServer: false,

                currentUser_id: null,
                groupAdminsID: [],
                deleteProcess: false,
                flagDeleteDocument: false,

                position: 'center',
                duration: 4000,

                form: {
                    name: '',
                    tags: [],
                    file_name: '',
                    shared: false
                },
                file: '',

                docUploaded: false,
                single: null,
                showUploadForm: false,

                tagsArray: [],
                uploading: false,
                uploadsErrors: false,

                gConfig: null,
                downloadingFile: false
            }
        },
        created() {
            this.gConfig = {
                // The Browser API key obtained from the Google API Console.
                // developerKey: 'xxxxxxxYYYYYYYY-12345678',
                developerKey: config.apiGoogleKey,

                // The Client ID obtained from the Google API Console. Replace with your own Client ID.
                // clientId: '1234567890-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com',
                clientId: config.clientIdGoogle,

                // Scope to use to access user's drive.
                scope: 'https://www.googleapis.com/auth/drive.file'
            }
        },

        mounted(){
            this.updateDocuments();
            this.currentUser_id = this.$store.getters.currentUser.id;

            let that = this;

            let options = {

                success(files) {
                    files.forEach((file) => {
                        let fileData = {
                            downloadUrl: file.link,
                            filename: file.name
                        };

                        that.downloadingFile = true;

                        axios.post(config.apiUrl + '/download_file_dropbox/' + that.$route.params.groupname, fileData, {
                            headers: {
                                "Authorization": `Bearer ${that.$store.getters.currentUser.token}`
                            }
                        })
                            .then((response) => {
                                that.updateDocuments();
                                that.docUploaded = true;
                                that.downloadingFile = false;
                            })

                        });

                },
                cancel: function() {
                    //optional
                },
                linkType: "direct", // "preview" or "direct"
                multiselect: false, // true or false
                // extensions: ['.png', '.jpg'],
            };

            var button = Dropbox.createChooseButton(options);
            // document.getElementById("dropbox-container").appendChild(button);
            this.$refs.dropboxContainer.appendChild(button);
        },

        methods: {
            showDetails (data) {
                if(data.picked === 'picked') {

                    console.log('lalala')
                    console.log(data.docs)
                }
            },

            handleFileUpload(){
                this.file = this.$refs.file.files[0];
            },

            uploadNewDoc(){
                /*this.$validator.validateAll().then((result) => {

                    if (result) {
                        // do your code
                    }
                })*/
                let formData = new FormData();
                formData.append('file', this.file);
                formData.append('name', this.htmlEntities(this.form.name));
                formData.append('tags', this.form.tags.join(','));
                if (this.form.shared)
                    formData.append('shared', 'on');

                this.uploading = true;
                axios.post(config.apiUrl + '/group_documents/' + this.$route.params.groupname, formData, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then((response) => {
                        this.updateDocuments();
                        this.docUploaded = true;
                        this.CancelUploadForm();
                    })
                    .catch((err) => {
                        console.log(err.request.response);
                        this.uploadsErrors = JSON.parse(err.response.request.response);
                        // console.log(this.uploadsErrors);
                    })
                    .finally(() => {
                        this.uploading = false;
                    });
            },

            CancelUploadForm() {
                this.form.name = '';
                this.form.tags = [];
                this.form.file_name = '';
                this.showUploadForm = false;
                this.uploading = false;
            },

            deleteDocument(doc_id, index){
                // console.log(index);
                if (confirm('Are you sure you want to delete this document ?'))
                {
                    this.deleteProcess = true;
                    axios.delete(config.apiUrl + '/group_documents/' + doc_id, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            // this.$delete(this.documents, index);
                            this.updateDocuments();
                            this.flagDeleteDocument = true;
                        })
                        .catch((err) => {
                            let data_errors = [];
                            data_errors.push(err.message);
                            data_errors.push(err.response.data.message);
                            this.deleteErrors = data_errors;
                            console.log(this.deleteErrors);
                        })
                        .finally(() => {
                            this.deleteProcess = false;
                        });
                }
            },

            checkAuthor(user_id){
                return this.currentUser_id == user_id;
            },

            checkGroupAdmins(user_id) {
                return this.groupAdminsID.indexOf(user_id) >= 0;
            },

            updateDocuments(){
                this.pandingResponseServer = true;
                this.documents = [{}];
                axios.get(config.apiUrl + '/group_documents/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {
                        // console.log(response.data.documents);
                        this.groupAdminsID = response.data.admins_id;
                        let index, i = 0;
                        let group_documents = response.data.documents;

                        for (index = 0; index < group_documents.length; index++) {

                            this.$set(this.documents, i, '');

                            let oneDocument= group_documents[index];

                            let obje = {
                                shared: oneDocument.shared ? '1' : '0',
                                name: oneDocument.name_from_user,
                                tag: oneDocument.tag,
                                owner: oneDocument.user.name,
                                created_at: oneDocument.created_at,
                                updated_at: oneDocument.updated_at,
                                token: oneDocument.token,
                                id: oneDocument.id,
                                index: index,
                            };
                            this.documents[i] = obje;
                            i++;
                        }
                        this.groupDocuments = group_documents;
                        // console.log(this.documents);
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

    .md-table{
        overflow: auto;
    }

    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        /*padding: 21px 0 2px 0;*/
    }
    .md-card{
        margin: 0;
    }

    .md-layout {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }
</style>