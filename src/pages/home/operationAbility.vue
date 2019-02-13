<template>
	<div class="panel-content border">
		<div class="panel-header">
			运维支持能力（最近30天）
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshOperationAbility"></span>
			</div>
		</div>
		<div class="panel-body" style="height:279px;">
			<template v-if="show">
				<div class="echarts-bar-operationAbility" id="echarts-bar-operationAbility" style="width:100%; height:100%;">
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
			dataColor: ['#ff9a41', '#7dcc56']
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
			
//			setTimeout(()=>{
//				// 运维支持能力
//				var data = [
//					[2.0, 4.9, 7.0, 6.4, 3.3],
//					[2.6, 5.9, 9.0, 6.0, 2.3]
//				];
//				echartBar('echarts-bar-operationAbility', data, this.dataColor);
//			},1000);

		});
	},
	methods: {
		init() {
			this.getOperationAbilityData();
		},
		
		// 获取运维支持能力
		getOperationAbilityData() {
			this.$axios.post('/work/order/support').then((res) => {
			 	if(res.status == 200 && res.data && res.data.length) {
			 		this.show = true;
			 		this.$nextTick(()=>{
			 			echartBar('echarts-bar-operationAbility', res.data, this.dataColor);
			 		});
			 	} else {
			 		this.show = false;
			 	}
			});
		},
		
		// 刷新
		refreshOperationAbility() {
			this.getOperationAbilityData();
		}
	}
}
</script>

<style>
</style>