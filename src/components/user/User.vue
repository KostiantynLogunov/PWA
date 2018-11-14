<template>
    <div>
	    <!--SNACKBAR-->
	    <md-snackbar :md-persistent="true" :md-position="position" :md-duration="duration" :md-active.sync="docUploaded" md-persistent>
		    <span>{{$lang.messages.you_changed_avatar}}</span>
		    <md-button class="md-accent" @click="docUploaded = false">{{$lang.buttons.close}}</md-button>
	    </md-snackbar>
	    <!--SNACKBAR-->


        <h1>It's your profile</h1>
	    <!--<a href="" @click.prevent="logout" >Logout</a>-->
		<p>Avatar:
			<img id="avatar" :src="href_avatar" alt="avatar" >
		</p>
	    <form enctype="multipart/form-data" @submit.prevent="sendAvatar()">
		    <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" :disabled="uploading"/>
		    <input type="submit" value="Upload" :disabled="uploading">
	    </form>
	    <md-progress-bar md-mode="indeterminate" class="md-accent" v-if="uploading" />
    </div>
</template>

<script>
	import {config} from '../../_services/config'
	import axios from 'axios'

    export default {
        name: "User",
	    data(){
        	return {
		        file: '',
		        uploading: false,
		        docUploaded: false,
		        href_avatar: '',
		        position: 'center',
		        duration: 4000,
		        user: null
	        }
	    },
        methods: {
	        handleFileUpload(){
		        this.file = this.$refs.file.files[0];
	        },
	        sendAvatar(){
		        let formData = new FormData();
		        formData.append('timeline_id', this.user.timeline_id);
		        formData.append('timeline_type', 'user');
		        formData.append('change_avatar', this.file);

		        this.uploading = true;
		        axios.post(config.apiUrl + '/change-user-avatar', formData, {
			        headers: {
				        "Authorization": `Bearer ${this.$store.getters.currentUser.token}`,
				        'Content-Type': 'multipart/form-data'
			        }
		        })
			        .then((response) => {
				        this.docUploaded = true;
				        this.file = null;
				        let user= response.data.user;
						let currentToken = this.$store.getters.currentUser.token;
				        let currentUser = Object.assign({}, user, {token: currentToken});
				        localStorage.setItem("user", JSON.stringify(currentUser));
				        this.href_avatar = user.avatar;
			        })
			        .catch((err) => {
				        console.log(err);
			        })
			        .finally(() => {
				        this.uploading = false;
			        });
	        },

	        /*filesChange(name, file){
		        console.log(name);
		        console.log(file);
	        }*/
        },

        created () {
        	this.href_avatar = this.$store.getters.currentUser.avatar;
        	this.user = this.$store.getters.currentUser;
        	console.log(this.$store.getters.currentUser);
        }
    };
</script>

<style>
	#avatar{
		height: 100px;
	}
</style>