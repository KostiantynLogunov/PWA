<template>
    <div class="text-center">
        <form novalidate class="md-layout" @submit.prevent="validatePost">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">What's going on ?</div>
                </md-card-header>

                <md-card-content>
                    <div class="md-layout md-gutter">
                        <div class="md-layout-item md-small-size-100">
                            <md-field>
                                <md-textarea name="post" id="post" autocomplete="given-name" v-model="form.post" :disabled="sending" />
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
                    <md-button type="button" class="md-primary" @click="createEvent">Create event</md-button>
                    <md-button type="submit" class="md-primary md-raised" :disabled="sending">Post</md-button>
                </md-card-actions>


            </md-card>



            <md-snackbar :md-active.sync="postSaved">The user post was saved with success!</md-snackbar>
        </form>
    </div>
</template>

<script>
    import validate from 'validate.js'
    import axios from 'axios'

    export default {
        name: "someGroupPosts",
        data: () => ({
            form: {
                post: '',
            },
            postSaved: false,
            sending: false,
            errors: null,
        }),
        methods: {
            validatePost() {
                console.log(this.form.post);

                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.form, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                // send to api this.form.post
            },
            getConstraints(){
                return {
                    post: {
                        presence: true,
                        length: {
                            minimum: 5,
                            message: 'Must be at least 5 characters long'
                        }
                    },
                }
            },
            createEvent(){
                console.log('createEvent')
            }
        }
    }
</script>

<style scoped>
    md-progress-bar {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
    }

    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
    li {
        list-style: none;
    }
</style>