<template>
    <div class="alert alert-warning text-center" v-if="!groupDocuments">No any Documents yet....
        <md-progress-spinner :md-diameter="30" :md-stroke="3" md-mode="indeterminate" v-if="pandingResponseServer"></md-progress-spinner>
    </div>
    <div class="md-layout" v-else>
        <md-table v-model="documents" md-sort="name" md-sort-order="asc" md-card >
            <md-table-toolbar>
                <h1 class="md-title">Documents</h1>
            </md-table-toolbar>

            <md-table-row slot="md-table-row" slot-scope="{ item }">
                <md-table-cell md-label="Sharing" md-sort-by="shared">
                    <input type="checkbox" :checked="item.shared== '1'" disabled>
                </md-table-cell>
                <md-table-cell md-label="Name" md-sort-by="name">{{ item.name }}</md-table-cell>
                <md-table-cell md-label="Tag" md-sort-by="tag">{{ item.tag }}</md-table-cell>
                <md-table-cell md-label="Owner" md-sort-by="owner">{{ item.owner }}</md-table-cell>
                <md-table-cell md-label="Date Created" md-sort-by="created_at">{{ item.created_at }}</md-table-cell>
                <md-table-cell md-label="Date Update" md-sort-by="updated_at">{{ item.updated_at }}</md-table-cell>
                <md-table-cell md-label="Mention Link" md-sort-by="token">{{ item.token }}</md-table-cell>
                <md-table-cell md-label="Actions">
                    <button class="btn btn-warning"><i class="far fa-edit"></i></button>
                    <button class="btn btn-danger"><i class="far fa-trash-alt"></i></button>
                </md-table-cell>
            </md-table-row>
        </md-table>
    </div>
</template>

<script>
    import axios from 'axios'
    import {config} from '../../_services/config'

    export default {
        name: "someGroupDocuments",
        data: () => ({
            documents: [
                {},
            ],
            errors: null,
            groupDocuments: false,
            pandingResponseServer: false,

        }),
        mounted(){
            this.updateSharingServices();
        },
        methods: {
            updateSharingServices(){
                this.pandingResponseServer = true;
                axios.get(config.apiUrl + '/group_documents/' + this.$route.params.groupname, {
                    headers: {
                        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`
                    }
                })
                    .then((response) => {

                        // console.log(response.data.documents);

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
                            };
                            this.documents[i] = obje;
                            i++;
                        }
                        this.groupDocuments = group_documents;
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

</style>