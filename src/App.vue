<template>

  <div class="page-container">
    <md-app md-mode="reveal">
      <md-app-toolbar class="md-primary">
        <md-button class="md-icon-button" @click="menuVisible = !menuVisible">
          <md-icon>menu</md-icon>
        </md-button>
        <span class="md-title">Bestshops</span>
      </md-app-toolbar>

      <md-app-drawer :md-active.sync="menuVisible">
        <md-toolbar class="md-transparent" md-elevation="0">Доступні дії</md-toolbar>

        <md-list>
          <md-list-item to="/">
            <md-icon>move_to_inbox</md-icon>
            <span class="md-list-item-text">Головна</span>
          </md-list-item>

          <md-list-item to="/post">
            <md-icon>send</md-icon>
            <span class="md-list-item-text">Створити пропозицію</span>
          </md-list-item>

        </md-list>
      </md-app-drawer>

      <md-app-content>
        <router-view></router-view>
      </md-app-content>
    </md-app>
  </div>

</template>

<script>
  export default {
    name: 'app',
    data: function () {
      return {
        menuVisible: false
      }
    }
  }
</script>


