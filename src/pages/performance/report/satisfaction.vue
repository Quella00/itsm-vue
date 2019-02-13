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
							
							<el-form-item label="运维工程师：" prop="itsmNames">
								<el-input v-model="configSynthesisData.form.data.itsmNames" placeholder="请选择运维工程师" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openMaintenanceEngineerDialog"></i>
							</el-form-item>
							
							
							<el-form-item label="满意度：" prop="evaluationScope">
								<el-select v-model="configSynthesisData.form.data.evaluationScope" placeholder="请选择满意度" focus="selectOnFocus">
									<el-option v-for="item in configSynthesisData.evaluationDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
								</el-select>
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
	                	<!--<div class="echarts-container" style="margin-bottom:30px; height:400px; width:100%; position:relative;">
	                		<div v-if="!configSynthesisData.echart.isShow" class="echarts-nodata-tips">无工单满意度数据，无法形成报表</div>
	                		<div class="echarts-line-satisfaction" id="echarts-line-satisfaction" style="width:100%; height:100%;"></div>
	                	</div>-->
	                	<div class="echarts-container">
	                		<div v-if="!configSynthesisData.echart.isShow" class="echarts-nodata-tips">无工单满意度数据，无法形成报表</div>
	                		<div class="echarts-line-satisfaction" id="echarts-line-satisfaction" style="width:100%; height:100%;"></div>
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
			
			// 处理工单报表数据
			configSynthesisData: {
				reportType: 'satisfaction',   // 报表类型
				
				form: {
					data: {
						workOrderStatusLabel:'',  // 处理状态label
						workOrderStatus:'',       // 处理状态value
						
						itsmNames: '',            // 运维工程师name集合
						itsmIds: '',         // 运维工程师Id集合
						
						evaluationScope: '',        // 满意度value
						
						closeTime: '',            // 工单关闭时间
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						
						closeTimeShow: false,     // 工单关闭时间显示隐藏
						closeTimeTag: 7         
					}
				},
				
				// 满意度下拉数据源
				evaluationDropDownData: [
					{ value:'', label: '请选择' },
					{ value:5, label: '非常满意' },
					{ value:4, label: '满意' },
					{ value:3, label: '一般' },
					{ value:2, label: '不满意' },
					{ value:1, label: '非常不满意' },
				],
				
				// 工单关闭时间选择标签数据源
				closeTimeTagData: [
					{ value:7, name: '最近7天' },
					{ value:30, name: '最近30天' },
					{ value:90, name: '最近90天' },
					{ value:0, name: '指定日期' }
				],
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						workOrderStatus: '',   			// 处理状态value
						itsmIds: '',                    // 运维工程师Id集合
						
						evaluationScope: '',                 // 满意度value
						
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
					isShow: true,
					params: {
						workOrderStatus: '',   	        // 处理状态value
						itsmIds: '',                    // 运维工程师Id集合
						
						evaluationScope: '',                 // 满意度value
						
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
//			this.getAssetsData();
//			this.$refs.table.querySynthesisData();
			this.querySynthesisData();
		},
		
		// 获取组织工单报表图表数据
		getAssetsData(){
//			var startTimeAndEndTimeObj = this.$ies.getStartTimeAndEndTime(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.form.data.closeTime);
//			this.configSynthesisData.form.data.startTime = startTimeAndEndTimeObj.startTime;
//			this.configSynthesisData.form.data.endTime = startTimeAndEndTimeObj.endTime;
			
			this.$ies.syncValue(this.configSynthesisData.echart.params, this.configSynthesisData.form.data);
			
			this.configSynthesisData.echart.params.userId = this.$store.state.user.info.userId;
			
			//this.$axios.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryOrganizatio', this.configSynthesisData.echart.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/workOrdeReportForm/queryEvaluation', this.configSynthesisData.echart.params).then((res) => {
				if(res.status == 200 && res.data && res.data.length) {
					
//					const dataColor = ['#7dcc56', '#ff7c67'];
//					const xAxisData = ['03月01日','03月02日','03月03日','03月04日','03月05日','03月06日','03月07日'];
//					const yAxisData = [
//						{
//							name: '非常满意',
//							data: [50, 60, 51, 30, 20, 80, 70]
//						}
//					];
//					echartLine02('echarts-line-satisfaction', xAxisData, yAxisData, dataColor);
					
					this.configSynthesisData.echart.isShow = true;
					const dataColor = ['#66d423', '#3edcc0', '#4a9ffe', '#ffc425', '#ff7377', '#cc80f0'];
					const xAxisData = this.$ies.xAxisDataArray(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.echart.params.startTime, this.configSynthesisData.echart.params.endTime);
					const yAxisData = this.$ies.yAxisDataArray(res.data, 'evaluation', 'createTime', 'workOrdeCount', xAxisData);
					echartLine('echarts-line-satisfaction', xAxisData, yAxisData, dataColor);
					
				}else{
					this.configSynthesisData.echart.isShow = false;
					const dataColor = [];
					const xAxisData = [];
					const yAxisData = [];
					echartLine('echarts-line-satisfaction', xAxisData, yAxisData, dataColor);
					
				}
			});
		},
		
		// 工单关闭时间标签选择
		selectTimeTag( v ){
			this.$refs.table.selectTimeTag(v);
		},
        
		// 显示选择运维工程师弹窗
		openMaintenanceEngineerDialog() {
			this.$refs.dialogs.openMaintenanceEngineerDialog();
		},
        
        // 查询table数据
        querySynthesisData(){
			var startTimeAndEndTimeObj = this.$ies.getStartTimeAndEndTime(this.configSynthesisData.form.data.closeTimeTag, this.configSynthesisData.form.data.closeTime);
			this.configSynthesisData.form.data.startTime = startTimeAndEndTimeObj.startTime;
			this.configSynthesisData.form.data.endTime = startTimeAndEndTimeObj.endTime;
			
			var lastYearToday = this.$ies.getLastYearToday( this.configSynthesisData.form.data.startTime );
			if( Date.parse(this.configSynthesisData.form.data.endTime) - Date.parse(lastYearToday) > 0 ){
				this.$message.info('查询周期最多不能超过一年！');
				return;
			};
        	
        	this.getAssetsData();
        	this.$refs.table.querySynthesisData();
        },
        
        // 重置查询表单数据
        resetQueryForm(){
        	this.configSynthesisData.form.data.workOrderStatus = '';
        	this.configSynthesisData.form.data.itsmIds = '';
        	
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