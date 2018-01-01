
<template>
  <div>
    
    <div v-masonry transition-duration="0.3s" item-selector=".card-expansion">

        <div v-masonry-tile class="card-expansion" v-for="(offer, index) in offers" @click="displayDetails(offer.id)">
          <md-card>
            <md-card-media>
              <img :src="offer.picture" alt="People">
            </md-card-media>

            <md-card-header>
              <div class="md-title">{{ offer.title }}</div>
              <div class="md-subhead">{{ offer.network }}</div>
              <div class="md-subhead">
                <md-icon>location_on</md-icon>
                <span>2 miles</span>
              </div>              
            </md-card-header>

          </md-card>
        </div>
    </div>

  </div>
</template>
...
<style scoped>

  .card-expansion {

  }

  .md-card {
    width: 400px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

</style>


<script>
  export default {
    methods: {
      displayDetails (id) {
        this.$router.push({name: 'detail', params: { id: id }})
      }
    },
    data () {
      return {
        'offers': null
      }
    },
    mounted () {
      this.$http.get('http://bestshops.com.ua/api/offers').then(response => {
        this.offers = response.data.data
      })
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          this.position = position.coords
          console.log(this.position)
        })
      }
    }
  }
</script>