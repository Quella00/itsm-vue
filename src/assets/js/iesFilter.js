const iesFilter = {};
iesFilter.install = function(Vue) {
	
	// 时间戳转化为时间格式
	Vue.filter('formatTime', function (value, format) {
		return ies.formatTime(value, format);
	});
	
}

export default iesFilter;
