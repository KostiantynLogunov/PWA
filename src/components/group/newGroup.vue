<template>
    <div class="customer-new">
        <form @submit.prevent="add">
            <table class="table">
                <tr>
                    <th>Name</th>
                    <td>
                        <input type="text" class="form-control" v-model="group.name" placeholder="Group name">
                    </td>
                </tr>
                <tr>
                    <th>Alias</th>
                    <td>
                        <input type="text" class="form-control" v-model="group.username" placeholder="Group alias">
                    </td>
                </tr>
                <tr>
                    <th>About</th>
                    <td>
                        <textarea class="form-control" rows="2" v-model="group.about"></textarea>
                    </td>
                </tr>
                <tr>
                    <th>Privacy</th>
                    <td>
                        <md-radio v-model="group.type" value="open" selected>Open group</md-radio>
                        <md-radio v-model="group.type" value="close">Close group</md-radio>
                        <md-radio v-model="group.type" value="secret">Secret group</md-radio>
                    </td>
                </tr>
                <tr>
                    <td>
                        <md-button class="md-accent" @click="cancel">Cancel</md-button>
                    </td>
                    <td class="text-right">
                        <input type="submit" class="btn btn-primary"  :disabled="pandding" value="Create Group">
                    </td>
                </tr>
            </table>
        </form>
        <div class="errors" v-if="errors">
            <ul>
                <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                    {{ fieldsError.join('\n') }}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {config} from '../../_services/config'
    import validate from 'validate.js'
    import axios from 'axios'

    export default {
        name: "newGroup",
        data() {
            return {
                group: {
                    name: '',
                    username: '',
                    about: '',
                    type: 'open',
                },
                errors: null,
                pandding: false,
                apiUrl: config.apiUrl
            };
        },
        methods: {
            cancel() {
                this.$router.push({ name: 'myGroupsList'})
            },
            add(){
                this.errors = null;

                const constraints = this.getConstraints();

                const errors = validate(this.$data.group, constraints);

                if (errors) {
                    this.errors = errors;
                    return ;
                }

                this.pandding = true;

                    axios.post(this.apiUrl + '/group-create', this.$data.group, {
                        headers: {
                            "Authorization": `Bearer ${this.$store.state.currentUser.token}`
                        }
                    })
                        .then((response) => {
                            this.pandding = false;
                            this.$router.push({ name: 'myGroupsList'});
                        })
                        .catch((err) => {
                            let errorMessage = err.response.data.message || err.message;
                            this.errors = err.response.data;
                            this.pandding = false ;
                            console.log(errorMessage);
                        })


            },
            getConstraints() {
                return {
                    name: {
                        presence: true,
                        length: {
                            minimum: 3,
                            message: 'Must be at least 3 characters long'
                        }
                    },
                    username: {
                        presence: true,
                        length: {
                            minimum: 5,
                            message: 'Must be at least 5 characters long'
                        }
                    },
                    about: {
                        presence: true,
                        length: {
                            minimum: 10,
                            message: 'Must be at least 10 digits long'
                        }
                    }
                }
            }
        }
        /*computed: {
            currentUser() {
                return this.$store.getters.currentUser
            }
        },
        */
    }
</script>

<style scoped>
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        border-radius: 5px;
        padding: 21px 0 2px 0;
    }
</style>