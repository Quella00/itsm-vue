import Vue from 'vue'
import Vuex from 'vuex'

import ola from './ola.js'
import sla from './sla.js'
import asset from './asset.js'
import user from './user.js'
//import serviceDesk from './serviceDesk.js'
import process from './process.js'
import knowledge from './knowledge.js'
Vue.use(Vuex);

const store = new Vuex.Store({
	state: {
		testValue: '我是测试数据'
	},
	mutations: {
		
	},
    modules: {
		ola: ola,
		sla: sla,
		asset: asset,
//		serviceDesk:serviceDesk，
        user: user,
		process: process,
		knowledge:knowledge
    }
    
    
    //modules:{a:moduleA}
});

export default store;



