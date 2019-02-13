const user = {
	state: {
		info: JSON.parse(localStorage.getItem('userInfo'))
	},
	mutations: {
		changeUser(state, v){
            localStorage.setItem('userInfo', JSON.stringify(v));
            state.info = v
		},
		changeUserImagePath(state, v){
			state.info.imagePath = v;
			localStorage.setItem('userInfo', JSON.stringify(state.info));
		},
		changeUserInfo(state, v){
			for(var item in v) {
				state.info[item] = v[item];
			}
			localStorage.setItem('userInfo', JSON.stringify(state.info));
		},
		updateUser(state){
            state.info = JSON.parse(localStorage.getItem('userInfo'));
        }
	}
};

export default user;