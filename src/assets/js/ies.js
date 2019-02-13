import './iesJqextend.js'

(function(ies){
	
	function Ies() {
		this.baseURL = '';
		this.yzzMockBaseURL = 'http://localhost:3000/yzz';
		this.zsyMockBaseURL = 'http://localhost:3000/zsy';
		this.xohuMockBaseURL = 'http://localhost:3000/xohu';
		this.zsMockBaseURL = 'http://localhost:3000/zs';
		this.zjMockBaseURL = 'http://localhost:3000/zj';
	}
	var _toString = Object.prototype.toString,trim = String.prototype.trim;
	Ies.prototype = {

    	/**
    	 * @apiGroup ies
    	 * @api /js/ies.js formatTime
    	 * @apiName formatTime
		 * @apiDescription 时间戳转化为时间格式
    	 * @apiparam {number} value 时间戳
    	 * @apiparam {string} format 时间显示格式
    	 */
    	formatTime: function(value, format) {
    		var dateTime, yy, mm, dd, hh, MM, ss, am_pm, AM_PM;
    		var value = Number( value );
    		var format = format || 'yy-mm-dd hh:MM:ss';
    		
    		//时间戳不为数字类型，返回空
    		if( !value ){
    			return '';
    		}
    		
    		dateTime = new Date(value);
    		yy = dateTime.getFullYear();
    		mm = dateTime.getMonth() + 1;
    		dd = dateTime.getDate();
    		hh = dateTime.getHours();
    		MM = dateTime.getMinutes();
    		ss = dateTime.getSeconds();
    		
    		//是否显示上午和下午
			if( format.indexOf('am/pm') > -1 ) {
				am_pm =  hh > 12 ? '下午' : '上午';
				hh = hh > 12 ? hh - 12 : hh;
			}
    		
    		//是否显示AM和PM
			if( format.indexOf('AM/PM') > -1 ) {
				AM_PM =  hh > 12 ? 'AM' : 'PM';
				hh = hh > 12 ? hh - 12 : hh;
			}
    		
    		format = format.replace( 'yy', yy );       						//年
    		format = format.replace( 'mm', mm < 10 ? '0' + mm : mm );   	//月
    		format = format.replace( 'dd', dd < 10 ? '0' + dd : dd );		//日
    		format = format.replace( 'hh', hh < 10 ? '0' + hh : hh );		//时
    		format = format.replace( 'MM', MM < 10 ? '0' + MM : MM );		//分
    		format = format.replace( 'ss', ss < 10 ? '0' + ss : ss );		//秒
			format = format.replace( 'am/pm', am_pm );		                //上午、下午
			format = format.replace( 'AM/PM', AM_PM );		                //AM、PM
    		return format;
    	},
    	
    	//批量删除函数
		publicDeleteData: function( confCheckedAll, fun, _this ) {	
			if( confCheckedAll.checkeds.length <= 0 ){
				_this.$message.error('至少选择一条信息');
				return;
			}
			
			if( fun(_this) !== false ){
				confCheckedAll.checkeds = [];
				_this.$message.info('删除成功');
			}else{
				_this.$message.error('删除失败');
			};
		},
		
		// 键盘按键的判断
		showKeyCode: function(ev) {
			if( ev.keyCode ){
				//console.log(ev.keyCode);
				
				if(ev.keyCode == 13){
					console.log('你按下了Enter键');
				}
				if(ev.keyCode == 17){
					console.log('你按下了Ctrl键');
				}
				if(ev.keyCode == 8){
					console.log('你按下了Backspace键');
				}
				
			}
		},
		
		// 获取自动高度方法
		autoHeight: function(el, binding) {
			var tempH = 0; // 高度
			var tempN = 0; // 面板数量
			var findClass; // 查找的class名称

			//console.log( binding.arg );
			findClass = binding.arg || 'tabs-panel-wrap';
			$(el).parent().find( '.' + findClass ).each(function(){
				tempN ++;
				if( $(this).hasClass( findClass ) &&  this !== el ) {					
					tempH += $(this).outerHeight();
					//console.log( $(this).outerHeight() );
					//console.log( $(this).height() );
				}
				//console.log( tempN );
			});
			
			
			tempH = $(el).parent().height() - tempH - (tempN-1) * 10;
			$(el).css({
				height: tempH + 'px',
				//'overflow-y': 'auto'
			});
			
			$(el).children().click();
			
			return tempH;
		},



		
		bulrFocus(e) {
			e.target.blur();
		},





		// ajax请求基础参数
		ajaxConfig: {
			url: '',
			data: '',
			dataType: 'json',
			type: 'post',
			timeout: 10000,
			beforeSend: function() {
				this.loading = vm.$loading( this.loadingOptions );
			},
			complete: function() {
				setTimeout(() => {
					this.loading.close();
		        }, 500);
			},
			error: function(xhr, type, errorThrown) {
				console.log(type + errorThrown);
				//return callback();
			},
			loading: '',
			loadingOptions: {
				lock: true,
				text: 'Loading',
				spinner: 'el-icon-loading',
				background: 'rgba(255, 255, 255, 0.5)'
			}
		},
		
		// post请求
		post: function(url, data, callback) {
			
			const ajaxConfig = $.extend({}, this.ajaxConfig, ajaxConfig);
			ajaxConfig.url = url ? ajaxConfig.url + url :  ajaxConfig.url;
			ajaxConfig.data = data || '';
			ajaxConfig.type = 'post';
			
			ajaxConfig.success = function(data) {
				if( data ) {
					console.log('接口数据获取成功！');
					return callback(data);
				} else {
					console.log('接口数据获取失败！');
					return callback(data);
				}
			};
			
			$.ajax(ajaxConfig);
			
		},
		
		// get请求
		get: function(url, callback) {
			
			const ajaxConfig = $.extend({}, this.ajaxConfig, ajaxConfig);
			ajaxConfig.url = url ? ajaxConfig.url + url :  ajaxConfig.url;
			ajaxConfig.type = 'get';
			
			ajaxConfig.success = function(data) {
				if( data ) {
					console.log('接口数据获取成功！');
					return callback(data);
				} else {
					console.log('接口数据获取失败！');
					return callback(data);
				}
			};
			
			$.ajax(ajaxConfig);
			
		},
		
		

		//判定 是undefined
		isUndef: function (v) {
			return v === undefined || v === null
		},

		//判定 是defined
		isDef: function (v) {
			return v !== undefined && v !== null 
		},

		//判定是 TRUE
		isTrue: function (v) {
			return v === true 
		},

		//判定是 false  
		isFalse: function (v) {
			return v === false 
		},

		//判断是否是原始类型
		isPrimitive: function (value) {
			return typeof value === 'string' || typeof value === 'number'
		},

		//复杂数据类型检测
		isObject: function (obj) {
			return obj !== null && typeof obj === 'object'  
		},

		//对象检测
		isPlainObject: function (obj) {
			return _toString.call(obj) === '[object Object]'
		},

		//正则检测
		isRegExp: function (v) {
			return _toString.call(v) === '[object RegExp]'  
		},

		//数组检测
		isArray: function (v) {
			return _toString.call(v) === '[object Array]'  
		},

		//字符串长度检测
		isInlong: function(min,max){
			return { min: min, max: max, message: '长度在'+min+'到'+max+'个字符', trigger: 'blur' }
		},

		//检测两次输入是否一致
		isIdentical: function(arg1,arg2,form){
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
					if (arg2 !== '') {
						form.validateField('arg2');
					}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== arg1) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};

			return {
				pass:validatePass,
				checkePass:validatePass2
			}
		},

		//验证手机号码
		isMobile: function(rule, value, callback){
			var reg = /^1[3|5|8]\d{9}$/;
			if(!reg.test(value)){
				callback(new Error('手机号码格式不正确!'));
			}else{
				callback();
			}
		},

		//验证座机号码
		isPhone: function(rule, value, callback){
			var reg = /^0\d{2,3}-?\d{7,8}$/;
			if(!reg.test(value)){
				callback(new Error('座机号码格式不正确!'));
			}else{
				callback();
			}
		},

		//转字符串
		toString: function (val) { 
			return val == null? '': typeof val === 'object'? JSON.stringify(val, null, 2): String(val)
		},
		
		trim: String.prototype.trim,
		//深拷贝
		deepCopy: function(obj) {
			var str = JSON.stringify(obj);
			return JSON.parse(str);
		},
		
		/**	
		 * syncValue 同步对象的源数据到目标对象
		 * @param {targetObj} 目标对象
		 * @param {sourceObj} 源对象
		 */
		syncValue: function(targetObj, sourceObj) {
			for(var key in targetObj) {
				if( key in sourceObj ){
					targetObj[key] = sourceObj[key];
				}
			}
		},
		
		/**
		* dispatch 查找父级
		* @param { self } 当前 Vue 实例
		* @param { componentName } 组件名称
		* @return { params } 参数
		*/
		dispatch: function(self, componentName) {
			var parent = self.$parent || self.$root;
			var name = parent.$options.name;
	  
			while (parent && (!name || name !== componentName)) {
			  parent = parent.$parent;
	  
			  parent && (name = parent.$options.name);
			}

			parent && (this.component = parent);
			return this.component;
		},
		
		/**
		* broadcast 查找子级
		* @param { self } 当前 Vue 实例
		* @param { componentName } 组件名称 name
		* @return 匹配到的组件实例
		*/
		broadcast: function(self, componentName) {
			self.$children.forEach(child => {	
			  var name = child.$options.name;

			  if (name === componentName) {
				this.component = child;
			  } else {
				this.broadcast(child, componentName);
			  }
			});

			return this.component;
		},
		
		
		
		
		
		/**
		 * @apiGroup ies
		 * @apidoc /assets/js/ies.js renderContent
		 * @apiName renderContent
		 * @apiDescriptions 树节点的内容区的渲染 Function
		 */
		tree: {
			renderContent(h, { node, data, store }) {
				
	            if (node.childNodes.length > 0) {
	                return h('span',
	                    [
	                        h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: 'el-icon-my-file' }),
	                        h('span', node.label)
	                    ]);
	            } else {
	                return h('span',
	                    [
	                        h('i', { style: { color: '#ffba72', 'margin-right': '5px' }, class: 'el-icon-my-text' }),
	                        h('span', node.label)
	                    ]);
	            }
	        },
		},
		initObject: function(params,value){
			if(this.isPlainObject(params) && this.isPlainObject(value)){
				for(let k in params){
					params[k] = value[k]
				}
			}else{
				console.warn("params and value should be Object!");
			}
		},
		formatObject: function(params,rules) {
			let isNext = false;
			this.isPlainObject(params)?(this.isArray(rules)?isNext = true:console.warn("rules should be Array!")):isNext = false;
			if(!isNext) return;
			for(let k in params){
				if(params[k]==="" || params[k]==null || params[k]==undefined || rules.indexOf(k)!=-1){
					delete params[k];
				}else{
					this.formatObject(params[k],rules)
				}
			}
		},
		validator: {
			name(rule, value, callback){
				if(value&&trim.call(value)!='') {
					/^\s+|\s+$/.test(value)?
						callback('禁止首尾出现空格!'):
						value.length>32?
							callback('长度为 1 到 32 位!'):
							callback();
				} else {
					!value?callback():callback('禁止输入纯空格字符串');
				}
			},
			number(rule, value, callback){
				if(value&&trim.call(value)!=''){
					value.length<=6?
					/^(\d|[a-zA-Z])+$/.test(value)?
						callback():
						callback(new Error('仅允许输入字母和数字!')):
					callback(new Error('长度为 1 至 6 位!'));
				} else {
					!value?callback():callback('禁止输入纯空格字符串');
				}
			},
			floorAndRoomNumber(rule, value, callback){
				if(value&&trim.call(value)!=''){
					value.length>6?
					callback(new Error('长度为 1 到 6 位!')):
					/^(\d|\-|[a-zA-Z])+$/.test(value)?
						callback():
						callback(new Error('仅允许输入字母、数字和-!'));
				} else {
					!value?callback():callback('禁止输入纯空格字符串');
				}
			},
			
			// 不允许为纯空格
			space(rule, value, callback) {
				var min = 1, max;
				if(rule.options && rule.options.min){
					min = rule.options.min;
				}
				if(rule.options && rule.options.max){
					max = rule.options.max;
				}
				
				if(value == null || value == undefined){
					value = '';
				}
				
				if(trim.call(value) != '') {
					/^\s+|\s+$/.test(value)?
						callback('禁止首尾出现空格!'):
						(value.length < min || value.length > max) ?
							callback('长度为 '+ min +' 到 '+ max +' 位!'):
							callback();
				} else {
					!value? callback() : callback('禁止输入纯空格字符串!');
				}
			},
			
			// 允许数字和字母
			type(rule, value, callback) {
				if( /^[A-Za-z0-9/]+$/.test(value) ) {
					callback();
				} else {
					!value?callback():callback('仅允许输入字母、数字和/!');
				}
			},

			// 允许数字和字母
			numLetter(rule, value, callback) {
				if( /^[A-Za-z0-9]+$/.test(value) ) {
					callback();
				} else {
					!value?callback():callback('仅允许输入字母和数字!');
				}
			},
			
			// 仅允许输入数字
			num(rule, value, callback){
				if(/^(\d)+$/.test(value)){
					callback()
				}else{
					!value?callback():callback('仅允许输入数字!');
				}
			},
			
			// 验证手机号码
			mobile(rule, value, callback){
				/^1[3|4|5|7|8]\d{9}$/.test(value) ?
					callback():
					callback('手机号码格式不正确!');
			},
			
			// 联系电话
			phone(rule, value, callback){
				if(!value) {
					callback();
				}
				/^0\d{2,3}-?\d{7,8}$/.test(value) ?
					callback():
					callback('联系电话格式不正确!');
					
			},
			//验证计划开始结束时间
			checkPlanTime(rule, value, callback){
				if(value){	
					var nowDateTime = Date.parse(new Date());
					var fromDateTime = Date.parse(new Date(value[0].replace(new RegExp(/-/gm) ,"/")));
					var toDateTime = Date.parse(new Date(value[1].replace(new RegExp(/-/gm) ,"/")));	
					var maxDateTime = (new Date().setFullYear(new Date().getFullYear()+1));
					console.log("nowDateTime"+nowDateTime)
					console.log("fromDateTime"+fromDateTime)
					console.log("toDateTime"+toDateTime)
					console.log("maxDateTime"+maxDateTime)
					if(fromDateTime < nowDateTime || fromDateTime > maxDateTime || toDateTime < nowDateTime || toDateTime > maxDateTime) {
						return callback(new Error('请选择当前时间起一年内的时间'));
					} else {
						return callback();
					}
				}
			},
		},
		
		// 获取工单关闭时间的开始和结束时间的对象
		getStartTimeAndEndTime: function(closeTimeTag, closeTime){
			let startTime, endTime;
			if(closeTimeTag && closeTimeTag != 0){
				const nowTime = new Date();
				startTime = this.formatTime(nowTime.getTime() - 24*60*60*1000*(closeTimeTag - 1), 'yy-mm-dd');
				endTime = this.formatTime(nowTime.getTime(), 'yy-mm-dd');
			}else{
				startTime = closeTime[0];
				endTime = closeTime[1];
			}
			return {
				startTime: startTime,
				endTime: endTime
			}
		},
		
		// 获取当前的多少天的日期
		dateList: function( date, num ){
			var dateList = [];
			var date = new Date( date );
			for(var i = 0; i < num; i++){
				var day = date;
				var y = day.getFullYear();
				var m = day.getMonth() + 1;
				m = m >= 10 ? m : '0' + m;
				var d = day.getDate();
				d = d >= 10 ? d : '0' + d;
				var dayTemp = y + '-' + m + '-' + d;
				dateList.unshift( dayTemp );
				day.setDate(day.getDate() - 1);
			};
			return dateList;
		},

		// 获取日期数组
		xAxisDataArray: function(closeTimeTag, startTime, endTime){
			let xAxisData = [];
			if(closeTimeTag && closeTimeTag != 0){
				xAxisData = this.dateList( new Date(), closeTimeTag );
			}else{
				var days = parseInt(Math.abs( Date.parse(endTime) - Date.parse(startTime) ) / (24*60*60*1000));
				xAxisData = this.dateList( endTime, days + 1 );
			};
			return xAxisData;
		},
		
		// 获取图标的数据
		yAxisDataArray: function(targetData, targetName, createTime, workOrdeCount, xAxisData){
			let yAxisData = [];
			let nameData = {};
			let nameIndex = 1;
			
			if(targetName == 'responseStatus'){
				['响应未超时', '响应超时'].forEach((item)=>{
					nameData[ item ] = nameIndex ++;
					yAxisData[ yAxisData.length ] = {};
					yAxisData[ yAxisData.length - 1 ].name = item;
					yAxisData[ yAxisData.length - 1 ].data = [];
					for(var i = 0; i < xAxisData.length; i++){
						yAxisData[ yAxisData.length - 1 ].data[i] = 0;
					};
				});
			}
			
			if(targetName == 'resolutionStatus'){
				['处理未超时', '处理超时'].forEach((item)=>{
					nameData[ item ] = nameIndex ++;
					yAxisData[ yAxisData.length ] = {};
					yAxisData[ yAxisData.length - 1 ].name = item;
					yAxisData[ yAxisData.length - 1 ].data = [];
					for(var i = 0; i < xAxisData.length; i++){
						yAxisData[ yAxisData.length - 1 ].data[i] = 0;
					};
				});
			}
			
			if(targetName == 'evaluation'){
				['非常满意', '满意', '一般', '不满意', '非常不满意'].forEach((item)=>{
					nameData[ item ] = nameIndex ++;
					yAxisData[ yAxisData.length ] = {};
					yAxisData[ yAxisData.length - 1 ].name = item;
					yAxisData[ yAxisData.length - 1 ].data = [];
					for(var i = 0; i < xAxisData.length; i++){
						yAxisData[ yAxisData.length - 1 ].data[i] = 0;
					};
				});
			}
			
			
			targetData.forEach((item)=>{
				
				// 响应工单报表
				if(targetName == 'responseStatus'){
					if(item[targetName] == '0'){
						item[targetName] = '响应未超时'
					}else{
						item[targetName] = '响应超时'
					}
				};
				
				// 处理工单报表
				if(targetName == 'resolutionStatus'){
					if(item[targetName] == '0'){
						item[targetName] = '处理未超时'
					}else{
						item[targetName] = '处理超时'
					}
				};
				
				// 不在nameData对象中
				if(item[targetName] && !nameData[ item[targetName] ] && item[targetName] !=='未评价'){
					nameData[ item[targetName] ] = nameIndex ++;
					
					yAxisData[ yAxisData.length ] = {};
					yAxisData[ yAxisData.length - 1 ].name = item[targetName];
					yAxisData[ yAxisData.length - 1 ].data = [];
					//console.log(xAxisData);
					for(var i = 0; i < xAxisData.length; i++){
						yAxisData[ yAxisData.length - 1 ].data[i] = 0;
					};
					
					if(item[createTime]){
						var index = xAxisData.indexOf(item[createTime]);
						if( index > -1 ){
							yAxisData[ yAxisData.length -1 ].data[index] = item[workOrdeCount];
						}
					}
					
				}else if(item[targetName] && nameData[ item[targetName] ]){
					// 已在nameData对象中
					var index1 = nameData[ item[targetName] ];
					
					if(item[createTime]){
						var index2 = xAxisData.indexOf(item[createTime]);
						if( index2 > -1 ){
							yAxisData[ index1 - 1 ].data[ index2 ] = item[workOrdeCount];
						}
					}
				}
			});
			
			console.log( nameData );
			return yAxisData;
		},
		
		
        // 获取下一年的今天的日期
        getLastYearToday(date){
        	var strYear = new Date(date).getFullYear() + 1;
        	var strDay = new Date(date).getDate();
        	var strMonth = new Date(date).getMonth() + 1;
			if(strMonth < 10) {
				strMonth = '0' + strMonth;
			};
			if(strDay < 10) {
				strDay= '0' + strDay;
			};
			var datastr = strYear + '-' + strMonth + '-' + strDay;  
			return datastr; 
        },
		
		
	}
	
	/**
	 * @apiGroup ies
	 * @apidoc /assets/js/ies.js
	 * @apiName equals
	 * @apiDescriptions 对比2个数组之间的区别 Array.equals(Array)
	 */
    Array.prototype.equals = function (array) {
		if (!array)
			return false;

		if (this.length != array.length)
			return false;

		for (var i = 0, l = this.length; i < l; i++) {
			if (this[i] instanceof Array && array[i] instanceof Array) {
				if (!this[i].equals(array[i]))
					return false;       
			}           
			else if (this[i] !== array[i]) { 
				return false;   
			}           
		}       
		return true;
	}
    
	window[ies] = new Ies();
	
})('ies')

export default ies;