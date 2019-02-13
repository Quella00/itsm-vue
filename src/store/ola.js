const ola = {
	state: {
		olaId: '',
		pageOlaFlag: false,
	},
	mutations: {
		// 改变olaId的值
		changeOlaId(state, value){
            state.olaId = value
        },
        // 改变pageOlaFlag的值
        changePageOlaFlag(state, value) {
        	state.pageOlaFlag = value
        }
	}
};

export default ola;