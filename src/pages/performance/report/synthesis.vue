<template>
	<div class="itsm-tabs-main">	
        <div class="tabs-main">
        <ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:scrollbarH}">
        <div>
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">查询条件</div>
                <div class="panel-body search-content">
                    <el-form :inline="true" :model="configSynthesisData.form.data" ref="reportForm" label-width="130px" class="search-conditions reset-form">
						<!--<el-form-item label="资产分类：" prop="classification">
							<el-input v-model="configSynthesisData.form.data.classification" placeholder="请选择资产分类" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openAssetClassificationDialog"></i>
						</el-form-item>-->
						<el-form-item label="资产：" prop="assetName">
							<el-input v-model="configSynthesisData.form.data.assetName" placeholder="请选择资产" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openRelationAssetDialog"></i>
						</el-form-item>
						<el-form-item label="发起组织：" prop="createUserOrganizationName">
							<el-input v-model="configSynthesisData.form.data.createUserOrganizationName" placeholder="请选择发起组织" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openOrganizationDialog"></i>
						</el-form-item>
						<el-form-item label="发起人：" prop="createUserName">
							<el-input v-model="configSynthesisData.form.data.createUserName" placeholder="请选择发起人" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openPersonRadioDialog"></i>
						</el-form-item>
						<el-form-item label="处理运维组：" prop="createUserOperationName">
							<el-input v-model="configSynthesisData.form.data.createUserOperationName" placeholder="请选择处理运维组" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openMaintenanceGroupDialog"></i>
						</el-form-item>
						<el-form-item label="运维工程师：" prop="itsmNames">
							<el-input v-model="configSynthesisData.form.data.itsmNames" placeholder="请选择运维工程师" auto-complete="off" readonly="readonly"></el-input>
							<i class="el-icon-my-more" @click="openMaintenanceEngineerDialog"></i>
						</el-form-item>
						<el-form-item label="满意度：" prop="evaluationScope">
							<el-select v-model="configSynthesisData.form.data.evaluationScope" placeholder="请选择满意度" focus="selectOnFocus">
								<el-option v-for="item in configSynthesisData.evaluationDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="响应状态：" prop="responseStatus">
							<el-select v-model="configSynthesisData.form.data.responseStatus" placeholder="请选择响应状态" focus="selectOnFocus">
								<el-option v-for="item in configSynthesisData.responseStatusDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="处理状态：" prop="resolutionStatus">
							<el-select v-model="configSynthesisData.form.data.resolutionStatus" placeholder="请选择处理状态" focus="selectOnFocus">
								<el-option v-for="item in configSynthesisData.resolutionStatusDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="工单关闭时间：" prop="closeTime">
                            <el-date-picker v-model="configSynthesisData.form.data.closeTime" type="daterange" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                class="date-picker" ></el-date-picker>
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
import publicTable from './public/table.vue'
import publicPagination from './public/pagination.vue'
import publicDialogs from './public/dialogs.vue'

export default {
	components: {
		publicTable, publicPagination, publicDialogs
	},
	data() {
		return {
			scrollbarH: 0,
			
			// 工单综合报表数据
			configSynthesisData: {
				reportType: 'synthesis',   // 报表类型
				
				form: {
					data: {
//						classification: '',        // 资产分类name
//						classificationId: '',            // 资产分类id
						
						assetName: '',            // 资产name
						assetId: '',              // 资产id
						
						createUserOrganizationName:'',// 发起组织name
						createUserOrganizationId: '',   // 发起组织id
						
						createUserName: '',       // 创建人name
						createUserId: '',           // 创建人id
						
						createUserOperationName: '',        // 处理运维组name
						createUserOperationId: '',          // 处理运维组id
						
						itsmNames: '',            // 运维工程师name集合
						itsmIds: '',              // 运维工程师Id集合
						
						//evaluationLabel: '',      // 满意度label
						evaluationScope: '',           // 满意度value
						
						//overTimeStatusLabel: '',  // 超时状态label
						responseStatus: '',       // 超时状态value
						
						//workOrderStatusLabel:'',  // 处理状态label
						resolutionStatus:'',       // 处理状态value
						
						closeTime: [],            // 工单关闭时间
						startTime: '',           // 开始时间
						endTime: '',              // 结束时间
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
				
				// 响应状态下拉数据源
				responseStatusDropDownData: [
					{ value:'', label: '请选择' },
					{ value:0, label: '未超时' },
					{ value:1, label: '超时' }
				],
				
				// 处理状态下拉数据源
				resolutionStatusDropDownData: [
					{ value:'', label: '请选择' },
					{ value:0, label: '未超时' },
					{ value:1, label: '超时' }
				],
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						//classificationId: '',            // 资产分类id
						assetId: '',              // 资产id
						createUserOrganizationId: '',   // 发起组织id
						createUserId: '',           // 创建人id
						createUserOperationId: '',          // 处理运维组id
						itsmIds: '',              // 运维工程师Id集合
						evaluationScope: '',           // 满意度value
						responseStatus: '',       // 超时状态value
						resolutionStatus: '',      // 处理状态value
						startTime: '',           // 开始时间
						endTime: '',              // 结束时间
						
						priorityOrder: '',        // 优先级0升序1倒叙
						createTimeOrder: '',      // 发起时间0升序1倒叙   
						closeTimeOrder: '',       // 关闭时间0升序1倒叙
						responseTimeOrder: '',    // 响应时间0升序1倒叙
						resolutionTimeOrder: '',  // 解决时间0升序1倒叙
						evaluationOrder: '',      // 满意度0升序1降序
						
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					data: []
				}
			},
			
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		})
	},
	methods: {
		init(){
			var startTimeAndEndTimeObj = this.$ies.getStartTimeAndEndTime(7, '');
			this.configSynthesisData.form.data.closeTime = [startTimeAndEndTimeObj.startTime, startTimeAndEndTimeObj.endTime];
			this.configSynthesisData.form.data.startTime = startTimeAndEndTimeObj.startTime;
			this.configSynthesisData.form.data.endTime = startTimeAndEndTimeObj.endTime;
			//console.log( this.configSynthesisData.form.data.closeTime )
			
			this.$refs.table.querySynthesisData();
		},
		
		// 查询table数据
		querySynthesisData(){
			if(this.configSynthesisData.form.data.closeTime.length){
				this.configSynthesisData.form.data.startTime = this.configSynthesisData.form.data.closeTime[0];
				this.configSynthesisData.form.data.endTime = this.configSynthesisData.form.data.closeTime[1];
			}else{
				this.configSynthesisData.form.data.startTime = '';
				this.configSynthesisData.form.data.endTime = '';
			}
			
			this.$refs.table.querySynthesisData();
//			this.configSynthesisData.table.params.pageNum = 1;
//			this.configSynthesisData.table.params.startTime = this.configSynthesisData.form.data.closeTime[0];
//			this.configSynthesisData.table.params.endTime = this.configSynthesisData.form.data.closeTime[1];
//			
//			this.$ies.syncValue(this.configSynthesisData.table.params, this.configSynthesisData.form.data);
//			console.log( this.configSynthesisData.table.params );
//			this.getSynthesisData();
		},
		
		// 重置查询表单数据
		resetQueryForm() {
			this.configSynthesisData.form.data.assetId = '';
			this.configSynthesisData.form.data.createUserOrganizationId = '';
			this.configSynthesisData.form.data.createUserId = '';
			this.configSynthesisData.form.data.createUserOperationId = '';
			this.configSynthesisData.form.data.itsmIds = '';
			
			this.$refs.dialogs.resetQueryForm();
		},
		
		// 导出Excel
		exportExcel(){
			this.$refs.table.exportExcel();
		},
		// 导出PDF
		exportPDF(){
			this.$refs.table.exportPDF();
		},
		
//		// 显示资产分类弹窗
//		openAssetClassificationDialog(){
//			this.configAssetDialog.show = true
//		},

//      // 资产分类弹窗关闭回调方法
//      closeAssetClassificationDialogHandler(node) {
//			this.configSynthesisData.form.data.classification = node.categoryName;
//			this.configSynthesisData.form.data.classificationId = node.id;
//			this.configAssetDialog.selectId = node.id;
//      },
        
        // 显示资产弹窗
        openRelationAssetDialog(){
        	this.$refs.dialogs.openRelationAssetDialog();
        },
        
		// 显示选择组织弹窗
		openOrganizationDialog() {
			this.$refs.dialogs.openOrganizationDialog();
		},
        
		// 显示选择人员弹窗(单选)
		openPersonRadioDialog() {
			this.$refs.dialogs.openPersonRadioDialog();
		},
        
        // 显示选择运维组弹窗
        openMaintenanceGroupDialog(){
        	this.$refs.dialogs.openMaintenanceGroupDialog();
        },
        
        // 显示选择运维工程师弹窗
        openMaintenanceEngineerDialog() {
        	this.$refs.dialogs.openMaintenanceEngineerDialog();
        }
        
	}
}
</script>

<style lang="less">

</style>