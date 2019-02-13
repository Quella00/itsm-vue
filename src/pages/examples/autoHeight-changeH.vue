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

				
				
				<div class="panel-header">
					面板头部{{changeH}}
				</div>
				<div class="panel-body">

					<el-table border :data="tableData3" :max-height="changeH">
						<el-table-column prop="date" label="日期" width="180">
						</el-table-column>
						<el-table-column prop="name" label="姓名" width="180">
						</el-table-column>
						<el-table-column prop="address" label="地址">
						</el-table-column>
					</el-table>

				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage3" :page-sizes="[100, 200, 300, 400]" :page-size="100" layout="total, sizes, prev, pager, next, jumper" :total="400">
					</el-pagination>
				</div>
				
				
				
			</div>

		</div>

	</div>

</template>

<script>
	export default {
		data() {
			return {
				changeH: 0,
				
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

				currentPage3: 0

			};
		},
		methods: {
			addH() {
				//console.log('点击了按钮');
				var divH = $('.div').height() + 10;
				$('.div').height(divH);
				this.changeH++;
				//console.log( this.changeH );
			},
			
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
			}
		},
		mounted() {

		}
	}
</script>

<style lang="less">

</style>