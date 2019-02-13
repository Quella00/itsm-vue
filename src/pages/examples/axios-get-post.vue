<template>

	<div class="itsm-tabs-main">
		
		<div class="tabs-main">

			<div class="tabs-panel-wrap border">
				<div style="height:100px; background-color:#fff; ">面板1</div>
			</div>

			<div class="tabs-panel-wrap border">
				<div class="div" style="height:100px; background-color:#fff; ">面板2</div>
				<el-button @click="addH">添加高度</el-button>
			</div>

			<div class="tabs-panel-wrap border" v-autoHeight="changeH">
				<ies-scrollbar class="ies-scrollbar">
					<div class="div" style="height:800px; background-color:#fff; ">
						面板3-自适应
					</div>
				</ies-scrollbar>
			</div>

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
	        
	        tableH: '',
	        
	        changeH: 0

		};
	},
	methods: {
		addH() {
			//console.log('点击了按钮');
			var divH = $('.div').height() + 10;
			$('.div').height( divH );
			
			this.changeH ++;
			//console.log( this.changeH );
		},
		change() {
			$('#change').height('200');
		}
	},
	mounted() {

	}
}




</script>

<style lang="less">
</style>