
<template>
  <div>
    
    <div v-masonry transition-duration="0.3s" item-selector=".item">
        <div v-masonry-tile class="item image-card" v-for="(offer, index) in offers" @click="displayDetails(offer.id)">
            <div class="image-card__picture">
              <img :src="offer.picture" />
            </div>
            <div class="image-card__comment mdl-card__actions">
              <span>{{ offer.title }}</span>
            </div>
        </div>
    </div>

    <router-link class="add-picture-button mdl-button mdl-js-button mdl-button--fab mdl-button--colored" to="/post">
      <i class="material-icons">add</i>
    </router-link>
  </div>
</template>
...
<style scoped>
  .add-picture-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 998;
  }
  .image-card {
    position: relative;
    margin-bottom: 8px;
    width: 500px;
  }
  .image-card__picture > img {
    width:100%;
  }
  .image-card__comment {
    position: absolute;
    bottom: 0;
    height: 52px;
    padding: 16px;
    text-align: right;
    background: rgba(0, 0, 0, 0.5);
  }
  .image-card__comment > span {
    color: #fff;
    font-size: 14px;
    font-weight: bold;
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
    }
  }
</script>