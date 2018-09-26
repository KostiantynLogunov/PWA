<template>
    <div>
        <form novalidate class="md-layout" @submit.prevent="authenticate">
            <md-card class="md-layout-item md-size-50 md-small-size-100">
                <md-card-header>
                    <div class="md-title">Login</div>
                </md-card-header>

                <md-card-content>

                    <md-field >
                        <label for="email">Email</label>
                        <md-input type="email" name="email" id="email" v-model="form.email" :disabled="sending" />
                    </md-field>

                    <div class="md-layout-item md-small-size-100">
                        <md-field >
                            <label for="password">Password</label>
                            <md-input type="password" name="password" id="password" v-model="form.password" :disabled="sending" />
                        </md-field>
                    </div>
                </md-card-content>

                <md-progress-bar md-mode="indeterminate" v-if="sending" />

                <md-card-actions>
                    <md-button type="submit" class="md-primary" :disabled="sending">Login</md-button>
                </md-card-actions>
                <div class="errors" v-if="authError">
                    <ul>
                        <li >
                            {{ authError }}
                        </li>
                    </ul>
                </div>
                <div class="errors" v-if="errors">
                    <ul>
                        <li v-for="(fieldsError, fieldName) in errors" :key="fieldName">
                            {{ fieldsError.join('\n') }}
                        </li>
                    </ul>
                </div>
            </md-card>

            <md-snackbar :md-active.sync="userLogged">The user was logged with success!</md-snackbar>
        </form>

    </div>
</template>

<script>
    import {login} from '../../_helpers/auth';
    import validate from 'validate.js'

    export default {
        name: "Login",
        data() {
            return {
                form: {
                    email: '',
                    password: ''
                },
                errors: null,
                sending: false,
                userLogged: false,

            };
        },
        methods: {
            authenticate(){

                this.sending = true;
                this.errors = null;
                const constraints = this.getConstraints();
                const errorsValid = validate(this.$data.form, constraints);

                if (errorsValid) {
                    this.errors = errorsValid;
                    this.sending = false;
                    return ;
                }

                this.$store.dispatch('login');

                login(this.$data.form)
                    .then((res) => {
                        this.userLogged = true;
                        this.$store.commit("loginSuccess", res);
                        this.clearForm();
                        this.sending = false;

                        this.$router.push({path: '/'});
                    })
                    .catch((error) => {
                        this.sending = false;
                        this.$store.commit("loginFailed", {error});
                    });
            },

            clearForm () {
                this.form.password= null
                this.form.email = null
            },

            getConstraints(){
                return {
                    email: {
                        presence: true,
                        email: true
                    },
                    password: {
                        presence: true,
                        length: {
                            minimum: 6,
                            message: 'Must be at least 6 characters long'
                        }
                    }
                }
            },
        },
        computed: {
            authError() {
                return this.$store.getters.auth_error;
            }
        },

    }
</script>

<style scoped>
    .errors{
        /*background: lightcoral;*/
        color: orangered;
        padding: 21px 0 2px 0;
    }
</style>