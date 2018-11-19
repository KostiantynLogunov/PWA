<template>
	<div class="general-group-chat">
		<h1 class="text-center"> GENERAL GROUP CHAT </h1>
		<!--<GeneralMessagesFeed />
		<GeneralMessageComposer />-->
		<hr>
		<div class="row">
			<div class="col-sm-12">
                <textarea class="form-control" rows="10" readonly>
                    {{ messages.join('\n') }}
                </textarea>
				<hr>
				<input type="text" class="form-control" v-model="textMessage" @keyup.enter="sendMessage">
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

	/*window.io = require('socket.io-client');
	window.Echo = new Echo({
		broadcaster: 'socket.io',
		host: window.location.hostname + ':6001'
	});*/

	export default {
		name: "GeneralGroupChat",

		data(){
			return {
				messages: [],
				textMessage: ''
			}
		},

		mounted(){
			window.Echo = new Echo({
				broadcaster: 'socket.io',
				host: 'http://social.loc:6006',
				auth:
					{
						headers:
							{
								"Authorization": `Bearer ${this.$store.getters.currentUser.token}`
							}
					}
			});

			console.log(Echo.socketId);

			/*window.Echo.channel('chat')
				.listen('Message', ({message}) => {
					// console.log(message);
					if (message.name != this.$store.getters.currentUser.name)
						this.messages.push(message.text)
				});*/

			window.Echo.private('room.2')
				.listen('PrivateChat', ({data}) => {
					// console.log(message);
					// if (message.name != this.$store.getters.currentUser.name)
						this.messages.push(data.body)
				});
		},

		methods: {
			sendMessage() {
				axios.post(config.apiUrl + '/general-group-messages', { body: this.textMessage, room_id: 2 },
					{
						headers: {
							"Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
							// "X-Socket-Id": Echo.socketId,
						}
					});
				this.messages.push(this.textMessage);
				this.textMessage = '';
			}
		},

		// components:{GeneralMessageComposer, GeneralMessagesFeed}
	}

</script>

<style lang="scss" scoped>
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