const process = {
	state: {
		eventProcessIndexChange: false,
		
//		pageProcessFlag: {
//			event: false,
//			problem: false,
//			change: false,
//			release: false,
//			Spare: false
//		},
		
		pageProcessFlag: false,          		    // process页面变化标识
		
		pageEventProcessFlag: false,
		pageProblemProcessFlag: false,
		pageChangeProcessFlag: false,
		pageReleaseProcessFlag: false,
		pageSpareProcessFlag: false,
		
		pageEditProcessFlag: false,             // editProcess页面变化标识
		
		pageEditEventProcessFlag: false,
		pageEditProblemProcessFlag: false,
		pageEditChangeProcessFlag: false,
		pageEditReleaseProcessFlag: false,
		pageEditSpareProcessFlag: false,
		

		formVersion: {
			event: '',
			problem: '',
			change: '',
			release: '',
			spareParts: ''
		},
		formType: ''

	},
	mutations: {
		// 改变eventProcessIndexChange的值
		changeEventProcessIndex(state, value){
            state.eventProcessIndexChange = value
		},
		changeFormVersion(state, value) {
                state.formVersion[value.type] = value.id;
		},
		changeFormType(state, value) {
			state.formType = value;
		}
	}
};

export default process;