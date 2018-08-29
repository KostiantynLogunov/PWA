<template>

  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">OMC</span>

          <div class="md-toolbar-section-end">
            <md-button class="md-icon-button">
              <md-icon>more_vert</md-icon>
            </md-button>
          </div>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Actions:</md-toolbar>

        <md-list>
          <md-list-item to="/">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Home page</span>
          </md-list-item>

          <md-list-item to="/activity">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Activity</span>
          </md-list-item>


          <md-list-item to="/login" v-if="this.$store.state.authentication.user">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Logout</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        

        <div class="jumbotron">
            <div class="container">
                <div class="row">
                    <div class="col-sm-6 offset-sm-3">
                        <div v-if="alert.message" :class="`alert ${alert.type}`">{{alert.message}}</div>
                        
                    </div>
                </div>
            </div>
        </div>

        <router-view></router-view>

      </md-app-content>
    </md-app>

  </div>


</template>

<script>
/* eslint-disable */
  export default {
    name: 'app',
    data: function () {
      return {
        menuVisible: false
      }
    },
    computed: {
        alert () {
            return this.$store.state.alert
        }
    },
    watch:{
        $route (to, from){
            // clear alert on location change
            this.$store.dispatch('alert/clear');
        }
    }     
  }
</script>


