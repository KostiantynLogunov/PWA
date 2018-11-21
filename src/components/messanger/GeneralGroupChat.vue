<template>
	<div class="general-group-chat">
		<h1 class="text-center"> GENERAL CHAT of GROUP  {{ group.name }}</h1>
		<!--<GeneralMessagesFeed />
		<GeneralMessageComposer />-->
		<!--<hr>-->

		<div class="row">
			<div class="col-sm-12">
				<div class="textarea-chat">
		                <div v-for="msg in messages" :key="msg.id" :class="msg.user.id == $store.getters.currentUser.id ? 'text-right' : ''">
			                <md-avatar>
				                <img :src="msg.user.avatar" alt="People">
			                </md-avatar>

			                <span><b>{{ msg.user.name }}</b></span><br>
			                <span>{{ msg.body }}</span>
			                <p style="font-size: 0.7rem">{{ msg.created_at }}</p>
		                </div>
				</div>
				<!--<hr>-->
				<input type="text" class="form-control" v-model="textMessage" @keyup.enter="sendMessage" placeholder="Write youe msg....">
				<br>
			</div>
		</div>
	</div>
</template>

<script>
	import GeneralMessageComposer from './GeneralMessageComposer';
	import GeneralMessagesFeed from './GeneralMessagesFeed';

	import axios from 'axios'
	import { config } from '../../_services/config'

	import Echo from 'laravel-echo'

	export default {
		name: "GeneralGroupChat",

		props: ['group', 'messages'],

		data(){
			return {
				// messages: [],
				textMessage: '',

			}
		},

		created(){

		},

		mounted()
		{
			// console.log(this.group);
		},

		/*watch: {
			group: function(newVal, oldVal) {
				console.log('group changed: ', newVal, ' | was: ', oldVal)
			},
		},*/

	  methods: {
		  sendMessage() {
			  axios.post(config.apiUrl + '/general-group-messages', { body: this.textMessage, group_id: this.group.id },
				  {
					  headers: {
						  "Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
						  // "X-Socket-Id": Echo.socketId,
					  }
				  })
				  .then((response) => {
					  // this.groupChatMessages = response.data.messages;
					  // console.log(response.data);
					  this.$emit('showEnteredMsg', response.data.result);
					  // this.messages.push(this.textMessage);
					  this.textMessage = '';
				  });

		  }
	  },

  // components:{GeneralMessageComposer, GeneralMessagesFeed}
}

</script>

<style lang="scss" scoped>

	.textarea-chat{
		/*min-height: 20vh;*/
		background: lightgrey;
	}
	.general-group-chat {
	        flex: 5;
	        display: flex;
	        flex-direction: column;
	        justify-content: space-between;

	        h1 {
	            font-size: 20px;
	            padding: 10px;
	            margin: 0;
	            border-bottom: 1px dashed lightgrey;
	        }
	}
</style>