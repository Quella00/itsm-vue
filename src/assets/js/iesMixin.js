const iesMixin = {};
iesMixin.install = function(Vue) {
	Vue.mixin({
		
		// 创建组件
	    created: function () {
			//console.log('组件创建完成');
	    },
	    
//		// 自定义过滤器
//	    filters: {
//	    	// 时间戳转化为时间格式
//	    	formatTime2(value, format) {
//	    		return ies.formatTime(value, format);
//	    	}
//	
//	    }
	    
	});
}

export default iesMixin;