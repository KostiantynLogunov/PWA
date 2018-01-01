<template>
  <div>
    <md-card>
      <md-card-area md-inset>
        <md-card-header>
          <md-card-header-text>
            <div class="md-title">{{ offer.title }}</div>
            <div class="md-subhead">Subtitle here</div>
          </md-card-header-text>

          <md-card-media md-big>
            <img :src="offer.picture" alt="Avatar">
          </md-card-media>
        </md-card-header>
      </md-card-area>

      <md-card-area md-inset>
        <md-card-content>
          <h3 class="md-subheading">Location</h3>
        </md-card-content>
      </md-card-area>

      <md-card-content>
        <h3 class="md-subheading">Today's availability</h3>
        <div class="card-reservation">
          <md-icon>access_time</md-icon>
          <div class="md-button-group">
            <md-button>5:30PM</md-button>
            <md-button>7:30PM</md-button>
            <md-button>9:00PM</md-button>
          </div>
        </div>
      </md-card-content>

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        offer: null
      }
    },
    mounted () {
      this.$http.get('http://bestshops.com.ua/api/offer?id=' + this.$route.params.id).then(response => {
        this.offer = response.data.data
      })
    }

  }
</script>
<style scoped>
  .picture > img {
    color: #fff;
    width:100%;
  }
  .info {
    text-align: right;
    padding: 5px;
    color: #555;
    font-size: 10px;
  }
  .comment {
    padding: 10px;
    color: #555;
  }
  .actions {
    text-align: center;
  }
</style>
