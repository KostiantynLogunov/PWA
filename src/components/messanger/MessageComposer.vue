<template>
    <div class="composer">
        <textarea v-model="message" @keydown.enter="send" placeholder="Enter your message"></textarea>
    </div>
</template>

<script>
    export default {
        name: "MessageComposer",
        data(){
            return {
                message: ''
            }
        },
        methods: {
            send(event){
                event.preventDefault();

                if (this.message == '') return;

                this.$emit('send', this.message);
                this.message = '';
            }
        }
    }
</script>

<style lang="scss" scoped>
    .composer textarea {
        width: 96%;
        margin: 10px;
        resize: none;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        border: 1px solid lightgrey;
        padding: 6px;
    }
</style>