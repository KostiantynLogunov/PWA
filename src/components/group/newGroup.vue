<template>
    <div class="customer-new">
        <form @submit.prevent="add">
            <table class="table">
                <tr>
                    <th>{{$lang.fields.name}}</th>
                    <td>
                        <input type="text" class="form-control" v-model="group.name" placeholder="Group name">
                    </td>
                </tr>
                <tr>
                    <th>{{$lang.fields.alias}}</th>
                    <td>
                        <input type="text" class="form-control" v-model="group.username" placeholder="Group alias">
                    </td>
                </tr>
                <tr>
                    <th>{{$lang.fields.about}}</th>
                    <td>
                        <textarea class="form-control" rows="2" v-model="group.about"></textarea>
                    </td>
                </tr>
                <tr>
                    <th>{{$lang.fields.privacy}}</th>
                    <td>
                        <md-radio v-model="group.type" value="open" selected>{{$lang.fields.open_group}}</md-radio>
                        <md-radio v-model="group.type" value="close">{{$lang.fields.close_group}}</md-radio>
                        <md-radio v-model="group.type" value="secret">{{$lang.fields.secret_group}}</md-radio>
                    </td>
                </tr>
                <tr>
                    <td>
                        <md-button class="md-accent" @click="cancel">{{$lang.buttons.cancel}}</md-button>
                    </td>
                    <td class="text-right">
                        <input type="submit" class="btn btn-primary"  :disabled="pandding" :value="$lang.buttons.create_group">
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
                apiUrl: config.apiUrl,

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
                        	this.$router.push({ name: 'myGroupsList'});
	                        this.$store.dispatch('getUserGroups');
                        })
                        .catch((err) => {
                            this.errors = err.response.data.message || err.response.data ||  err.message || err.data;
                            console.log(this.errors);
                        })
                        .finally(() => {
                            this.pandding = false;
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