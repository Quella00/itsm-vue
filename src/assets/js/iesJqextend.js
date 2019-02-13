(function($) {
	$.fn.extend({
		
		/**	
		 * serializeObject表单数据序列化
		 * type = null, 默认返回为jsonp格式的对象
		 * type = string, 返回字符串
		 * type = array, 返回字符串
		 * 
		 * 具体返回的数据格式需要和后端确认决定，像checkbox是返回数组还是字符串
		 */
		serializeObject: function( type ) {
			let obj = {};
			const arr = this.serializeArray();
			$.each(arr, function() {
				
				if($('input[name = ' + this.name + ']').attr('type') === 'checkbox') {
					if(this.value !== '') {
						if(!obj[this.name]) {
							obj[this.name] = [];
						}

						obj[this.name].push(this.value);
					}
				} else {	
					if(this.value !== '') {
						obj[this.name] = this.value;
					}
				}

			});
			
			if(type == 'string') {
				obj = JSON.stringify(obj);
			} else if (type == 'array') {
				obj = JSON.stringify(obj).split(',');
			}
			
			return obj;
		}
	});
})(jQuery);