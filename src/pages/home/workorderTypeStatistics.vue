<template>
	<div class="panel-content border">
		<div class="panel-header">
			工单类型统计
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshWorkorderTypeStatistics"></span>
			</div>
		</div>
		<div class="panel-body" style="height:279px;">
			<template v-if="show">
				<div class="echarts-stackbar-worksheetCount" id="echarts-stackbar-worksheetCount" style="width:100%; height:100%;">
				</div>
			</template>
			<template v-else>
				<p class="noData">暂无数据</p>
			</template>

		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: true,
			dataColor: ['#7dcc56', '#ff7c67']
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
			
//			setTimeout(()=>{
//				// 工单类型统计
//				var data = [
//					[20, 32, 30, 34, 90],
//					[20, 12, 11, 13, 9]
//				];
//				echartStackBar('echarts-stackbar-worksheetCount', data, this.dataColor);
//			},1000);

		});
	},
	methods: {
		init() {
			this.getWorkorderTypeStatisticsData();
		},
		
		// 获取运维支持能力
		getWorkorderTypeStatisticsData() {
			this.$axios.post('/itsm/process/manager/sla/processSLAIndexReportForm').then((res) => {
			 	if(res.status == 200 && res.data && res.data.length) {
			 		
			 		this.show = true;
			 		
			 		var dataArr = [
			 			[0, 0, 0, 0, 0],
			 			[0, 0, 0, 0, 0]
			 		];
			 		res.data.forEach((item, index)=>{
			 			if(item.overTimeStatus == 0){
				 			for(var i = 1; i <= 5; i++){
				 				if(item.workOrderType == i) {
				 					dataArr[0][i-1] = item.sumCount;
				 					return;
				 				}
				 				
				 			}
			 			}else if(item.overTimeStatus == 1){
				 			for(var i = 1; i <= 5; i++){
				 				if(item.workOrderType == i) {
				 					dataArr[1][i-1] = item.sumCount;
				 					return;
				 				}
				 				
				 			}
			 			}
			 		});
			 		this.$nextTick(()=>{
			 			echartStackBar2('echarts-stackbar-worksheetCount', dataArr, this.dataColor);
			 		});
			 	} else {
			 		this.show = false;
			 	}
			});
		},
		
		// 刷新
		refreshWorkorderTypeStatistics() {
			this.getWorkorderTypeStatisticsData();
		}
	}
}
</script>

<style>
</style>