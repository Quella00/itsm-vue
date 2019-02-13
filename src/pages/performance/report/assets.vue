<template>
	<div class="itsm-tabs-main">	
        <div class="tabs-main">
        	<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:scrollbarH}">
        	<div>
	            <div class="tabs-panel-wrap border query-area">
	                <div class="panel-header">查询条件</div>
	                <div class="panel-body search-content">
	                    <el-form :inline="true" :model="configSynthesisData.form.data" ref="reportForm" label-width="130px" class="search-conditions reset-form">
							<public-order-close-time :configSynthesisData="configSynthesisData"></public-order-close-time>
							
							<!--<el-form-item label="资产分类：" prop="classification">
								<el-input v-model="configSynthesisData.form.data.classification" placeholder="请选择资产分类" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openAssetClassificationDialog"></i>
							</el-form-item>-->
							<el-form-item label="资产：" prop="assetName">
								<el-input v-model="configSynthesisData.form.data.assetName" placeholder="请选择资产" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openRelationAssetDialog"></i>
							</el-form-item>
	
	                    </el-form>
	                </div>
	            </div>
	
	            <div class="tabs-panel-wrap border">
	                <div class="panel-header">
	                    <div class="fl">
	                        <el-button type="normal" icon="el-icon-my-export" @click="exportExcel">导出Excel</el-button>
	                        <el-button type="normal" icon="el-icon-my-export" @click="exportPDF">导出PDF</el-button>
	                    </div>
	                    <div class="fr">
	                    	<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
	                        <el-button type="normal" icon="el-icon-my-search" @click="querySynthesisData">查询</el-button>
	                    </div>
	                </div>
	
	                <div class="panel-body">
	                	<!--<div style="margin-bottom:30px; height:500px; width:100%;">
	                		<div class="echarts-line-assets" id="echarts-line-assets" style="width:100%; height:100%;"></div>
	                	</div>-->
	                	<div class="echarts-container" v-if="configSynthesisData.echart.isNoData">
	                		<div v-if="!configSynthesisData.echart.isShow" class="echarts-nodata-tips">无资产工单数据，无法形成报表</div>
	                		<div class="echarts-line-assets" id="echarts-line-assets" style="width:100%; height:100%;"></div>
	                	</div>
	                    <public-table ref="table" :configSynthesisData="configSynthesisData"></public-table>
	                </div>
					<div class="panel-footer">
						<public-pagination ref="pagination" :configSynthesisData="configSynthesisData"></public-pagination>
					</div>
	            </div>
		    </div>
        	</ies-scrollbar>
        </div>
	    
	    <public-dialogs ref="dialogs" :configSynthesisData="configSynthesisData"></public-dialogs>

    </div>
</template>

<script>
import publicOrderCloseTime from './public/orderCloseTime.vue'
import publicTable from './public/table.vue'
import publicPagination from './public/pagination.vue'
import publicDialogs from './public/dialogs.vue'

export default {
	components: {
		publicOrderCloseTime, publicTable, publicPagination, publicDialogs
	},
	data() {
		return {
			scrollbarH: 0,
			
			// 资产工单报表数据
			configSynthesisData: {
				reportType: 'assets',   // 报表类型
				
				form: {
					data: {
//						classification: '',        // 资产分类name
//						classificationId: '',      // 资产分类id
						
						assetName: '',            // 资产name
						assetId: '',              // 资产id
						
						closeTime: '',            // 工单关闭时间
						startTime: '',            // 开始时间
						endTime: '',              // 结束时间
						
						closeTimeShow: false,     // 工单关闭时间显示隐藏
						closeTimeTag: 7         
					}
				},
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						//classificationId: '',   		// 资产分类id
						assetId: '',           			// 资产id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						
						priorityOrder: '',        		// 优先级0升序1倒叙
						createTimeOrder: '',      		// 发起时间0升序1倒叙   
						closeTimeOrder: '',       		// 关闭时间0升序1倒叙
						responseTimeOrder: '',    		// 响应时间0升序1倒叙
						resolutionTimeOrder: '',  		// 解决时间0升序1倒叙
						evaluationOrder: '',      		// 满意度0升序1降序
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					
					data: []
				},
				
				echart: {
					isNoData: false,
					isShow: true,
					params: {
						//classificationId: '',   		// 资产分类id
						assetId: '',           			// 资产id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
					}
				}
			}
			
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		})
	},
	methods: {

		init(){
//			this.$refs.table.querySynthesisData();
//			this.getAssetsData();
			this.querySynthesisData()
		},
		
		// 获取组织工单报表图表数据
		getAssetsData(){
//			var startTimeAndEndTimeObj = this.$ies.getStartTimeAndEndTime(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.form.data.closeTime);
//			this.configSynthesisData.form.data.startTime = startTimeAndEndTimeObj.startTime;
//			this.configSynthesisData.form.data.endTime = startTimeAndEndTimeObj.endTime;
			
			this.$ies.syncValue(this.configSynthesisData.echart.params, this.configSynthesisData.form.data);
			//this.$axios.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryOrganizatio', this.configSynthesisData.echart.params).then((res) => {
			
			if(this.configSynthesisData.echart.params.assetId){
				this.configSynthesisData.echart.isNoData = true;
			}else{
				this.configSynthesisData.echart.isNoData = false;
				return;
			};
			
			this.configSynthesisData.echart.params.userId = this.$store.state.user.info.userId;
			
			this.$axios.post('/itsm/performance/manager/workOrdeReportForm/queryAsset', this.configSynthesisData.echart.params).then((res) => {
				if(res.status == 200 && res.data && res.data.length) {
					
//					const dataColor = ['#7dcc56', '#ff7c67'];
//					const xAxisData = ['03月01日','03月02日','03月03日','03月04日','03月05日','03月06日','03月07日'];
//					const yAxisData = [
//						{
//							name: '组织1',
//							data: [120, 132, 101, 134, 90, 230, 210]
//						},
//						{
//							name: '组织2',
//							data: [220, 232, 201, 234, 190, 330, 310]
//						}
//					];
//
//					echartStackLine('echarts-line-assets', xAxisData, yAxisData, dataColor);
					this.configSynthesisData.echart.isShow = true;
					const dataColor = ['#ff7c67', '#f4b733', '#8298fa', '#43a6fb', '#30c5cb', '#b58cf2', '#52bf8a'];
					const xAxisData = this.$ies.xAxisDataArray(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.echart.params.startTime, this.configSynthesisData.echart.params.endTime);
					const yAxisData = this.$ies.yAxisDataArray(res.data, 'assetName', 'createTime', 'workOrdeCount', xAxisData);
					echartStackLine('echarts-line-assets', xAxisData, yAxisData, dataColor);	
				}else{
					this.configSynthesisData.echart.isShow = false;
					const dataColor = ['#7dcc56', '#ff7c67'];
					const xAxisData = [];
					const yAxisData = [];
					echartStackLine('echarts-line-assets', xAxisData, yAxisData, dataColor);
				};
				
			});
		},
		
		// 显示选择资产分类弹窗
//		openAssetClassificationDialog() {
//			this.$refs.table.openAssetClassificationDialog();
//		},
        
        // 显示选择资产弹窗(单选)
        openRelationAssetDialog() {
        	//this.$refs.table.openRelationAssetDialog();
        	this.$refs.dialogs.openRelationAssetDialog();
        },
        
        // 查询table数据
        querySynthesisData(){
        	
        	//console.log( this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.form.data.closeTime );
        	
			var startTimeAndEndTimeObj = this.$ies.getStartTimeAndEndTime(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.form.data.closeTime);
			this.configSynthesisData.form.data.startTime = startTimeAndEndTimeObj.startTime;
			this.configSynthesisData.form.data.endTime = startTimeAndEndTimeObj.endTime;
			
			var lastYearToday = this.$ies.getLastYearToday( this.configSynthesisData.form.data.startTime );
			if( Date.parse(this.configSynthesisData.form.data.endTime) - Date.parse(lastYearToday) > 0 ){
				this.$message.info('查询周期最多不能超过一年！');
				return;
			};
        	
        	//this.getAssetsData();
        	this.$refs.table.querySynthesisData();
        },
        
        // 重置查询表单数据
        resetQueryForm(){
        	//this.configSynthesisData.form.data.classificationId = '';
        	this.configSynthesisData.form.data.assetId = '';
        	
        	//this.$refs.table.resetQueryForm();
        	this.$refs.dialogs.resetQueryForm();
        },
        
        // 导出Excel
        exportExcel() {
        	this.$refs.table.exportExcel();
        },
        
        // 导出PDF
        exportPDF() {
        	this.$refs.table.exportPDF();
        }
        
        
	}
}
</script>

<style lang="less">

</style>