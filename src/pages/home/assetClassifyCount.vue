<template>
	<div class="panel-content border">
		<div class="panel-header">
			资产分类统计
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshAssetClassifyCount"></span>
			</div>
		</div>
		<div class="panel-body" style="height:305px;" v-getWidth="maxWidth">
			<template v-if="show">
				<template v-if="maxWidth < 520">
					<ies-scrollbar class="ies-scrollbar">
						<div style="position:relative; width:100%; min-width:520px; height:285px;">
							<div class="echarts-pie-assetCount" id="echarts-pie-assetCount" style="width:100%; height:100%;">
							</div>
							<div class="btn-more-asset">
								<el-button type="primary" size="normal" @click="openPage">更多资产查询  >></el-button>
							</div>
						</div>
					</ies-scrollbar>
				</template>
				<template v-else>
					<div style="position:relative; width:100%; min-width:520px; height:285px;">
						<div class="echarts-pie-assetCount" id="echarts-pie-assetCount" style="width:100%; height:100%;">
						</div>
						<div class="btn-more-asset">
							<el-button type="primary" size="normal" @click="openPage">更多资产查询  >></el-button>
						</div>
					</div>
				</template>
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
			maxWidth: '',      // scrollbar是否启用
			
			show: true,
			dataColor: ['#7dcc56', '#45b1ff', '#b58cf2', '#ff8533', '#ffc649']
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.getAssetCountData();
		},
		
		// 获取资产分类统计
		getAssetCountData() {
			this.$axios.post('/assets/apply/statistical').then((res) => {
			 	if(res.status == 200 && res.data && res.data.length) {
			 		this.show = true;
			 		this.$nextTick(()=>{
			 			echartPie('echarts-pie-assetCount', res.data, this.dataColor);
			 		});
			 	} else {
			 		this.show = false;
			 	}
			});
		},
		
		// 更多资产查询
		openPage() {
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/assetUtilization');
		},
		
		// 刷新
		refreshAssetClassifyCount() {
			this.getAssetCountData();
		}
	}
}
</script>

<style lang="less">

</style>