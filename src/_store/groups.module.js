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

            let token = JSON.parse(localStorage.getItem('user')).token;

            /*const requestOptions = {
                method: 'POST',
                headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin' : '*',
                        'Authorization': 'Bearer' + token
                    }
            };*/

            let promise = new Promise((resolve, reject) => {

                Vue.http.get('auth/groups', {
                        method: 'GET',
                        headers: { 'Authorization': 'Bearer' + token }
                    }
                )
                    .then(response => {
                        resolve (store.commit('loadGroups', response.body));
                    })
                    .catch((error) => {
                        console.log(error);

                        reject(error.data && error.data.msg ? error.data && error.data.msg : 'Something went wrong.');
                    });
            });
        }
    },
};