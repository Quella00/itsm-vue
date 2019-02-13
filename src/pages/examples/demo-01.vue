<template>

	<div class="itsm-tabs-main">
		
		<div class="tabs-left border">
		    <ies-scrollbar class="ies-scrollbar">
		    	<div class="tabs-panel-wrap">
					<div style="height:1000px; background-color:#fff;">树结构</div>
				</div>
		    </ies-scrollbar>
		</div>
		
		<div class="tabs-right">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板1</div>
					</div>
		
					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板2</div>
					</div>
					
					<div class="tabs-panel-wrap border">
						<div class="div" style="height:100px; background-color:#fff; ">面板3
						
						<el-button @click="addH">增加高度</el-button>
						
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		
	</div>
	
</template>

<script>

export default {
	data () {
		return {

	        tableData3: [{
	          date: '2016-05-03',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-02',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-04',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-01',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-08',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-06',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-07',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-02',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-04',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-01',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-08',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-06',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }, {
	          date: '2016-05-07',
	          name: '王小虎',
	          address: '上海市普陀区金沙江路 1518 弄'
	        }],
	        
	        tableH: ''

		};
	},
	methods: {
		
		/**
		 * @apiGroup demo
		 * @api {测试} examples/demo-01.vue 方法名：addH
		 * @apiparam {Object} value 时间戳
		 * 
		 * @apisuccess {object} success 成功
		 * @apisuccess {String} success.msg  成功提示语 
		 * @apisuccess {String} success.name  姓名 
		 * @apisuccess {Integer} success.age 年龄 
		 */
		addH() {
			console.log('点击了按钮');
			var divH = $('.div').height() + 50;
			$('.div').height( divH );
		}
	},
	mounted() {
		

		
//		this.$nextTick( () => {
//
//			var _this = this;
//			$(function(){
//				_this.tableH = $('.table-wrap').height();
//				console.log( _this.tableH );
//			});
//			
//		});


	}
}

//$(function(){
//	var isScrollAuto = $('.tabs-right').find('.tabs-panel-wrap').hasClass('scrollAuto');
//	
//	if( isScrollAuto ) {
//		$('.tabs-right').css({
//			//height: '100%'
//		})
//	} else {
//		$('.tabs-right').css({
//			//height: '100%',
//			'overflow-y': 'auto'
//		});
//		return;
//	}
//	
//	var h = $('.tabs-right').height();
//	console.log( h );
//	
//	var totalH = 0;
//	$('.tabs-right .tabs-panel-wrap').each(function(){
//		
//		if( !$(this).hasClass('scrollAuto') ) {
//			console.log( this );
//			
//			console.log( $(this).outerHeight(true) );
//			totalH += $(this).outerHeight(true);
//		}
//	});
//	
//	var thatH = h - totalH - 10;
//	
//	$('.scrollAuto').css({
//		height: thatH + 'px',
//		'overflow-y': 'auto'
//	});
//
//	
//})



</script>

<style lang="less">
</style>