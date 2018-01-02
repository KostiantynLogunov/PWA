
<template>
  <div>
    
    <div class="md-layout md-gutter">
      <div class="md-layout-item">
        <md-field>
          <label for="movie">Вигляд</label>
          <md-select v-model="movie" name="movie" id="movie">
            <md-option value="fight-club" selected>Список</md-option>
            <md-option value="godfather">Мапа</md-option>
            <md-option value="godfather-ii">Godfather II</md-option>
            <md-option value="godfather-iii">Godfather III</md-option>
            <md-option value="godfellas">Godfellas</md-option>
            <md-option value="pulp-fiction">Pulp Fiction</md-option>
            <md-option value="scarface">Scarface</md-option>
          </md-select>
        </md-field>
      </div>

      <div class="md-layout-item">
        <md-field>
          <label for="movie">Сортування</label>
          <md-select v-model="movie" name="movie" id="movie">
            <md-option value="fight-club">Розмір знижки</md-option>
            <md-option value="godfather">Віддаленість</md-option>
          </md-select>
        </md-field>
      </div>  

      <div class="md-layout-item">
        <md-field>
          <label for="movie">Категорії</label>
          <md-select v-model="movie" name="movie" id="movie">
            <md-option value="fight-club">Розмір знижки</md-option>
            <md-option value="godfather">Віддаленість</md-option>
          </md-select>
        </md-field>
      </div>             
    </div>

    <div v-masonry transition-duration="0.3s" item-selector=".card-expansion">

        <div v-masonry-tile class="card-expansion" v-for="(offer, index) in offers" @click="displayDetails(offer.id)">

          <md-card>
            <md-card-header>

              <md-card-header-text>

              <md-avatar>
                <img :src="offer.logo" alt="Avatar">
              </md-avatar>

              <div class="md-title">{{ offer.network }}</div>
              <div class="md-subhead">{{ offer.distance }}</div>          

              </md-card-header-text>

        <md-menu md-size="big" md-direction="bottom-end">
          <md-button class="md-icon-button" md-menu-trigger>
            <md-icon>more_vert</md-icon>
          </md-button>

          <md-menu-content>
            <md-menu-item @click="doACall">
              <span>Call</span>
              <md-icon>phone</md-icon>
            </md-menu-item>

            <md-menu-item @click="sendMessage">
              <span>Send a message</span>
              <md-icon>message</md-icon>
            </md-menu-item>
          </md-menu-content>
        </md-menu>

            </md-card-header>            

            <md-card-media>
              <img :src="offer.picture" alt="People">
            </md-card-media>

            <md-card-header>
              <div class="md-title">{{ offer.title }}</div>
              <div class="md-subhead md-layout">
                <div class="md-layout-item price">
                  <md-icon>label</md-icon> 
                  <span><strong>{{ offer.price }}</strong></span>
                </div>

                <div class="md-layout-item">
                  <md-icon>access_time</md-icon> 
                  <span>{{ offer.date_active }}</span>
                </div>                
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
    width: 330px;
    margin: 4px;
    display: inline-block;
    vertical-align: top;
  }

  .price {
    color: red;
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