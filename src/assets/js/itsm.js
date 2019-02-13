import ies from './ies.js'
import iesComponents from './iesComponents.js'
import iesDirective from './iesDirective.js'
import iesFilter from './iesFilter.js'
import iesMixin from './iesMixin.js'

const ITSM = {};
ITSM.install = function (Vue, options) {

	// 添加全局组件
	Vue.use( iesComponents );
  
	// 添加自定义指令
	Vue.use( iesDirective );

  	// 添加自定义过滤器
  	Vue.use( iesFilter );
  
	// 注入组件
	Vue.use( iesMixin );
  
	// 添加实例方法
	Vue.prototype.$ies = ies;

}

export default ITSM;