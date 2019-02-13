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
	mounted() {

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
	}
}


</script>

<style lang="less">
</style>