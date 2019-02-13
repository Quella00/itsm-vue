const iesDirective = {};
iesDirective.install = function(Vue) {

	// 测试demo
	Vue.directive('demo', {
		bind(el, binding, vnode, oldVnode) {
			el.innerHTML = binding.value
		}
	});

	// 元素获取焦点
	Vue.directive('focus', {
		inserted: function(el) {
			if(el.tagName === 'INPUT') { // 定义在input
				el.focus();
			} else if(el.getElementsByTagName('input').length) { // 定义在el-input
				el.getElementsByTagName('input')[0].focus();
			} else { // 其它
				el.focus();
			}
		}
	});

	// 获取自动高度
	Vue.directive('autoHeight', {
		inserted: function(el, binding, vnode) {

			var headerH = 0,
				footerH = 0,
				bodyH;
			var tempH = ies.autoHeight(el, binding);

			if($(el).find('.panel-header')) {
				headerH = $(el).find('.panel-header').outerHeight() || 0;
			}

			if($(el).find('.panel-footer')) {
				footerH = $(el).find('.panel-footer').outerHeight() || 0;
			}

			//console.log(headerH, footerH);

			if($(el).find('.panel-body')) {

				bodyH = tempH - headerH - footerH - 20;

				if(binding.expression) {
					vnode.context[binding.expression] = bodyH;
				} else {
					var component = ies.broadcast(vnode.context, 'ElTable');
					component && component.$nextTick(function() {
						this.layout.setMaxHeight(bodyH);

						var bodyHeight = (this.showHeader ? bodyH - this.layout.headerHeight - this.layout.footerHeight : bodyH - this.layout.footerHeight) + 'px';
						var fixedHeight = (this.layout.scrollX && this.data.length) ? this.layout.gutterWidth + 'px' : '';
						var fixedBodyHeight = this.layout.scrollX ? bodyH - this.layout.gutterWidth : bodyH;
						this.showHeader && (fixedBodyHeight -= this.layout.headerHeight);
						fixedBodyHeight += 'px';

						var {
							bodyWrapper,
							fixedWrapper,
							fixedBodyWrapper,
							rightFixedWrapper,
							rightFixedBodyWrapper
						} = this.$refs;

						bodyWrapper.style['max-height'] = bodyHeight;
						if(this.fixedColumns.length) {
							fixedWrapper.style['bottom'] = fixedHeight;
							fixedBodyWrapper.style['max-height'] = fixedBodyHeight;
							fixedWrapper.style['overflow'] = 'hidden';
						}

						if(this.rightFixedColumns.length) {
							rightFixedWrapper.style['bottom'] = fixedHeight;
							rightFixedBodyWrapper.style['max-height'] = fixedBodyHeight;
							rightFixedWrapper.style['overflow'] = 'hidden';
						}
					})
				}

			}
			return bodyH;

		},
		update: function(el, binding, vnode) {
			// 检测是否有更新
			console.log('检测是否有更新');
			if(binding.oldValue && binding.value !== binding.oldValue) {
				console.log('update');
				console.log(binding.value, binding.oldValue);

				var headerH = 0,
					footerH = 0,
					bodyH;
				var tempH = ies.autoHeight(el, binding);
	
				if($(el).find('.panel-header')) {
					headerH = $(el).find('.panel-header').outerHeight() || 0;
				}
	
				if($(el).find('.panel-footer')) {
					footerH = $(el).find('.panel-footer').outerHeight() || 0;
				}

				if($(el).find('.panel-body')) {

					bodyH = tempH - headerH - footerH - 20;
	
					if(binding.expression) {
						vnode.context[binding.expression] = bodyH;
					}
				}

			}

		}
	});

	//树结构的变化
	Vue.directive('changeTreeH', {
		inserted: function(el, binding, vnode) {
			/*
			vnode.context[binding.value] = function(){
				var w, h;
				setTimeout(function(){
					h = $(el).find('.el-tree').height();
					w = $(el).find('.el-tree').width();
					$(el).css({
						width: w,
						height: h
					})

					$(el).children().click();
				},500);
			}
			*/
			var component = ies.broadcast(vnode.context, 'ElTree');
			var w, h;
			setTimeout(function() {
				h = $(el).find('.el-tree').outerHeight();
				w = $(el).find('.el-tree').outerWidth();
				$(el).css({
					width: w,
					height: h
				})
				$(el).children().click();
			}, 500);
			
			component && component.$on('node-expand', function() {
				var w, h;
				setTimeout(function() {
					h = $(el).find('.el-tree').outerHeight();
					w = $(el).find('.el-tree').outerWidth();
					console.log(w,h);
					$(el).css({
						width: w,
						height: h
					})

					$(el).children().click();
				}, 500);
			});

//			component && component.$on('node-collapse', function() {
//				var w, h;
//				setTimeout(function() {
//					h = $(el).find('.el-tree').height();
//					w = $(el).find('.el-tree').width();
//					$(el).css({
//						width: w,
//						height: h
//					})
//
//					$(el).children().click();
//				}, 500);
//			});
		},
		update: function(el, binding, vnode) {
			// 检测是否有更新
			// console.log('changeTreeH检测是否有更新');
			var component = ies.broadcast(vnode.context, 'ElTree');
			var parentW = $(el).parent().parent().outerWidth();
			var parentH = $(el).parent().parent().outerHeight();
			var w, h;
			setTimeout(function() {
				h = $(el).find('.el-tree').outerHeight();
				w = $(el).find('.el-tree').outerWidth();
				
				if(parentW >= w){
					$(el).parent().css({
						'margin-left': 0
					});
					$(el).parent().find('.vue-scrollbar__scrollbar-horizontal .scrollbar').css({
						'left': '0%'
					});
				}
				
				if(parentH >= h){
					$(el).parent().css({
						'margin-top': 0
					});
					$(el).parent().find('.vue-scrollbar__scrollbar-vertical .scrollbar').css({
						'top': '0%'
					});
				}
				
				$(el).css({
					width: w,
					height: h
				});

				$(el).children().click();
			}, 500);
		}
	});
	
	// scrollbar滚动条的监听，指令的值{scrollbar:***,changeH:****}
	Vue.directive('changeScrollbarH', {
		update: function(el, binding, vnode) {
			//console.log('数据更新时scrollbar滚动条的H监听');
			if('changeH' in binding.value && binding.value.changeH == binding.oldValue.changeH) {
				return;
			};
	
			if('scrollbar' in binding.value){
				const scrollbar = binding.value.scrollbar;
				setTimeout(()=>{
					scrollbar.getSize();
					scrollbar.scrollToY( scrollbar.top );
					$(el).click();
				},500);
			};
		}
	});
	
	// 获取元素的宽度
	Vue.directive('getWidth', {
		inserted: function(el, binding, vnode) {
			if(binding.expression) {
				vnode.context[binding.expression] = $(el).width();
			}
			return $(el).width();
		}
	});
	
	// 拖拽事件
//	Vue.directive('drag', {
//		inserted: function(el, binding, vnode) {
//	        var oDiv=$(el);
//	        oDiv.on('mousedown', '.el-dialog__body', function(ev){
//	        	ev.stopPropagation();
//	        });
//	        oDiv.on('mousedown', '.el-dialog', function(ev){
//	        	
//		        	//console.log('mousedown');
//		        	var oDialog=$(el).find('.el-dialog')[0];
//		        	
//		        	//console.log( oDialog );
//		        	console.log( $(el).find('.el-dialog') );
//		        	console.log( $(el) );
//		        	console.log( ev );
//		        	
//		            var disX=ev.clientX-oDialog.offsetLeft;
//		            var disY=ev.clientY-oDialog.offsetTop;
//		            
//		            //var disTop = oDialog.marginTop
//		
//		            document.onmousemove=function(ev){
//		                var l=ev.clientX-disX;
//		                var t=ev.clientY-disY;
//		                oDialog.style.left=l+'px';
//		                oDialog.style.top=t+'px';
//		            };
//		            document.onmouseup=function(){
//		                document.onmousemove=null;
//		                document.onmouseup=null;
//		            };
//	        });
//
//		}
//	});
	
	
	Vue.directive('drag', {
		inserted: function(el, binding, vnode) {
	        var oDiv=$(el);
            var mx = 0,my = 0;      //鼠标x、y轴坐标（相对于left，top）
            var dx = 0,dy = 0;      //对话框坐标（同上）
            var isDraging = false;      //不可拖动
	        
	        oDiv.on('mousedown', '.el-dialog__body', function(e){
	        	e.stopPropagation();
	        });
	        oDiv.on('mousedown', '.el-dialog', function(e){
	        	
			        e = e || window.event;
			        mx = e.pageX;     //点击时鼠标X坐标
			        my = e.pageY;     //点击时鼠标Y坐标
			        dx = $(el).find('.el-dialog').offset().left;
			        dy = $(el).find('.el-dialog').offset().top;
			        isDraging = true;      //标记对话框可拖动           
	        	
		            document.onmousemove=function(e){
		            	console.log('bbb');
				        var e = e || window.event;
				        var x = e.pageX;      //移动时鼠标X坐标
				        var y = e.pageY;      //移动时鼠标Y坐标
				        if(isDraging){        //判断对话框能否拖动
				            var moveX = dx + x - mx - ( $(window).width() - $(el).find('.el-dialog').width() )/2 ;
				            var moveY = dy + y - my - $(window).height() * 0.15;      
				            $(el).find('.el-dialog').css({
				            	"left":moveX + 'px',
				            	"top":moveY + 'px'
				            });
				        };
		            };
			        
		            document.onmouseup=function(){
		            	isDraging = false;
		                document.onmousemove=null;
		                document.onmouseup=null;
		            };
	        });
		}
	});
	
	
	// 正整数
	Vue.directive('number', {
		bind: function(el){

		},
        unbind: function(el) {

        }
	});

	
}

export default iesDirective;