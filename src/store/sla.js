const sla = {
	state: {
		serviceLevelName: ''
	},
	mutations: {
		// 改变olaId的值
		changeSlaServiceLevelName(state, value){
            state.serviceLevelName = value
        },
	}
};

export default sla;