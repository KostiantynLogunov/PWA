<template>
	<div class="general-group-chat">
		<h1 class="text-center"> GENERAL CHAT of GROUP {{ group.name }}</h1>

		<div class="row">
			<div class="col-sm-12 text-center">
				<div class="textarea-chat">
					<div v-for="msg in messages"
					     :key="msg.id"
					     :class="msg.user.id == $store.getters.currentUser.id ? 'text-right' : 'text-left'"
					>
						<md-avatar>
							<img :src="msg.user.avatar" alt="People">
						</md-avatar>

						<span><b>{{ msg.user.name }}</b></span><br>
						<span v-html="lookForLink(msg.body )"></span>
						<p style="font-size: 0.7rem">{{ msg.created_at }}</p>
					</div>
				</div>
				<!--<hr>-->
				<input type="text" class="form-control"
				       v-model="textMessage"
				       @keyup.enter="sendMessage"
				       placeholder="Write youe msg...."
				       @keydown="typingText"
				>
				<span v-if="activeUser" class="text-center"><b>{{ activeUser.name}}</b> typing text...</span>
				<br>
			</div>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'
	import {config} from '../../_services/config'

	export default {
		name: "GeneralGroupChat",

		props: ['group', 'messages', 'activeUser'],

		data() {
			return {
				textMessage: '',
			}
		},

		methods: {
			lookForLink(value)
			{
				let re = /([^\"=]{2}|^)((https?|ftp):\/\/\S+[^\s.,> )\];'\"!?])/;
				let subst = '$1<a href="$2" target="_blank">$2</a>';
				let withlink = value.replace(re, subst);

				return withlink;
			},

			typingText() {
				this.$emit('typingText', {group_id: this.group.id});
			},

			sendMessage() {
				axios.post(config.apiUrl + '/general-group-messages', {body: this.textMessage, group_id: this.group.id},
					{
						headers: {
							"Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
							// "X-Socket-Id": Echo.socketId,
						}
					})
					.then((response) => {
						this.$emit('showEnteredMsg', response.data.result);
						this.textMessage = '';
					})
				;
			}
		},
	}
</script>

<style lang="scss" scoped>

	.textarea-chat {
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