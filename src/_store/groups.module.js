import Vue from 'vue'

export const groups = {
    namespaced: true,
    state:{
        groupsManage: [],
        groupsJoined: [],
    },
    getters:{
        groupsManage(state){
            return state.groupsManage;
        },
        groupsJoined(state){
            return state.groupsJoined;
        }
    },
    mutations:{
        loadGroups(state, data){
            state.groupsManage = data.own_groups;
            state.groupsJoined = data.joingroup;
        }
    },
    actions:{
        loadGroups(store){

            // let token = this.$store.state.authentication.user.token;
            let token = JSON.parse(localStorage.getItem('user')).token;

            let promise = new Promise((resolve, reject) => {

                Vue.http.get('auth/groups', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .catch((error) => {
                        console.log(error);

                        reject(error.data && error.data.msg ? error.data && error.data.msg : 'Something went wrong.');
                    })
                    .then(response => {
                        resolve (store.commit('loadGroups', response.body));
                    });
            });
        }
    },
};