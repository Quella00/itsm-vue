<template>

	<div class="itsm-tabs-main">
		
		<div class="tabs-left border">
		    <ies-scrollbar class="ies-scrollbar">
		    	<div class="tabs-panel-wrap">
					<div style="height:1000px; background-color:#fff;">树结构1</div>
				</div>
		    </ies-scrollbar>
		</div>
		
		<div class="tabs-right">
			
			<div class="tabs-panel-wrap border">
				<div style="height:100px; background-color:#fff; ">面板1</div>
			</div>

			<div class="tabs-panel-wrap border">
				<div style="height:100px; background-color:#fff; ">面板2</div>
			</div>

			<div class="tabs-panel-wrap border clickme" v-autoHeight>
				<ies-scrollbar class="ies-scrollbar">
					<div class="div" style="height:800px; background-color:#fff; ">面板3-自适应
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
	        
	        tableH: ''

		};
	},
	methods: {
		addH() {
			console.log('点击了按钮');
			var divH = $('.div').height();
			$('.div').height( divH );
		}
	},
	mounted() {

	}
}




</script>

<style lang="less">
</style>