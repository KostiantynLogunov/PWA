# Launch project
>First you have to launch backend api:
``` bash
# git clone https://kostiantyn777@bitbucket.org/mybestcom/social.git
# git pull origin develop 
# composer update 
# npm install
# edit file .env
# php artisan migrate
``` 


>Second step is launch front application PWA:
``` bash
# git clone https://kostiantyn777@bitbucket.org/mybestcom/social_pwa.git
# git pull origin devop
# npm install
# npm run build

```
For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


#For start work of sockets for chats and queue you have to do next steps:
- in the folder backend api project someone must run service ws.server/server.js. Console command for this: "node ws.server/server.js". It's service will launch sokets for individual chats for every user.
- For work of general chats and for work of channels for every user for notification, launch next console command in the folder backend api project :  "laravel-echo-server start". It's for work of channels for every genereal chat of some group.
- All messages work through queue. You have to launch work with queue. For this in the folder backend api project launch next console command: "php artisan work:queue --tries=3". 
    "--tries=3" MUST HAVE !
 - Next you can launch domain with front app.
 
 - WARNING:
  The file src/_srvices/config.js has general options for different works. Project uses this options. But some files of project use these options inside the file.Example: src/App.vue. If you need to edit options example for work with sockets you have to look for needed options in this files.

