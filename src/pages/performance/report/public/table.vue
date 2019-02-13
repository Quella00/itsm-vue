<template>
	<div>
	    <el-table :data="configSynthesisData.table.data" @sort-change="sortChange" border style="width:100%;" class="simple-table">
	        
	        <template v-if="configSynthesisData.reportType == 'synthesis'">
	        	<el-table-column prop="workOrderCode" label="工单编号" :min-width="100" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="workOrderCode" label="工单编号" :min-width="100"></el-table-column>
	        </template>
	        
	        <el-table-column prop="workOrderTypeName" label="工单类型" :min-width="90"></el-table-column>
	        <el-table-column prop="priority" label="优先级" :min-width="90" sortable="custom"></el-table-column>
	        
	        <template v-if="configSynthesisData.reportType == 'organization'">
	        	<el-table-column prop="createUserName" label="发起人" :min-width="90" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="createUserName" label="发起人" :min-width="90"></el-table-column>
	        </template>
	        
	        <el-table-column prop="createTime" label="发起时间" :min-width="110" sortable="custom"></el-table-column>
	        <el-table-column prop="workOrderCloseTime" label="关闭时间" :min-width="110" sortable="custom"></el-table-column>
	        
	        <template v-if="configSynthesisData.reportType == 'assets'">
	        	<el-table-column prop="assetName" label="关联资产" :min-width="100" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="assetName" label="关联资产" :min-width="100"></el-table-column>
	        </template>
	        
	        <template v-if="configSynthesisData.reportType == 'maintenanceGroup'">
	        	<el-table-column prop="handleUserNameList" label="运维工程师" :min-width="100" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="handleUserNameList" label="运维工程师" :min-width="100"></el-table-column>
	        </template>
	        
	        <template v-if="configSynthesisData.reportType == 'response'">
	        	<el-table-column prop="responseTime" label="响应时间" :min-width="110" sortable="custom" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="responseTime" label="响应时间" :min-width="110" sortable="custom"></el-table-column>
	        </template>
	        
	        <template v-if="configSynthesisData.reportType == 'handle'">
	        	<el-table-column prop="resolutionTime" label="处理时间" :min-width="110" sortable="custom" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="resolutionTime" label="处理时间" :min-width="110" sortable="custom"></el-table-column>
	        </template>

	        <template v-if="configSynthesisData.reportType == 'satisfaction'">
	        	<el-table-column prop="evaluation" label="满意度" :min-width="90" sortable="custom" fixed="left"></el-table-column>
	        </template>
	        <template v-else>
	        	<el-table-column prop="evaluation" label="满意度" :min-width="90" sortable="custom"></el-table-column>
	        </template>
	        
	        <el-table-column prop="service" label="操作" :min-width="90" fixed="right">
	        	<template slot-scope="scope">
	                <a href="javascript:;" @click="openWorkOrderDetail(scope.row.workOrderId, scope.row.instanceId, scope.row.workOrderType)">查看详情</a>
	                <!--<a href="javascript:;" @click="openWorkOrderDetail('5bfe8aa3f16e4296a7dddb3916cb13c3', '8651689f4cae492fbcb8d42b34e889e1', 1)">查看详情</a>-->
	            </template>
	        </el-table-column>
	    </el-table>

	    <!-- 选择资产分类弹窗 -->
        <!--<ies-assetDialog v-model="configAssetDialog.show" v-if="configAssetDialog.show" @assetChooseHandler="closeAssetClassificationDialogHandler" :defaultSelect='configAssetDialog.selectId' :type='configAssetDialog.type'></ies-assetDialog>-->
	    
		<!-- 选择关联资产弹窗 -->
		<!--<ies-relationAssetDialog v-model="configRelationAssetDialog.show" v-if="configRelationAssetDialog.show" @relationAssetChooseHandler="closeRelationAssetChooseHandler" :defaultSelect='configRelationAssetDialog.selectId'></ies-relationAssetDialog>-->
	    
	    <!-- 选择组织弹窗 -->
		<!--<ies-organizationDialog v-model="configOrganizationDialog.show" v-if="configOrganizationDialog.show" @groupChooseHandler="closeOrganizationHandler" :defaultSelect='configOrganizationDialog.selectId'></ies-organizationDialog>-->
	    
		<!-- 选择发起人弹窗(搜索时候单选的) -->
		<!--<ies-personRadioDialog v-model="configPersonRadioDialog.show" v-if="configPersonRadioDialog.show" @selectPersonRadioHandler="closePersonRadioHandler" :defaultSelect='configPersonRadioDialog.data'></ies-personRadioDialog>-->

		<!-- 选择运维组弹窗 -->
		<!--<ies-maintenanceGroupDialog v-model="configMaintenanceGroupDialog.show" v-if="configMaintenanceGroupDialog.show" @selectMaintenanceGroupHandler="closeMaintenanceGroupHandler" :defaultSelect='configMaintenanceGroupDialog.data'></ies-maintenanceGroupDialog>-->
	    
		<!-- 运维工程师弹窗 -->
		<!--<ies-personRadioDialog v-model="configMaintenanceEngineerDialog.show" v-if="configMaintenanceEngineerDialog.show" @selectPersonRadioHandler="closeMaintenanceEngineerHandler" :defaultSelect='configMaintenanceEngineerDialog.data'></ies-personRadioDialog>-->
	
	</div>
</template>

<script>
export default {
	props: ['configSynthesisData'],
	data() {
		return {
			
//			// 资产分类弹窗配置
//			configAssetDialog: {
//				show: false,       // 弹窗的显示/隐藏
//				selectId: '',      // 选中的区域节点id
//				type: 'search'     // 搜索时，禁用分类也显示
//			},
//			
//      	// 关联资产弹窗配置
//      	configRelationAssetDialog:{
//      		show: false,
//      		selectId: ''
//      	},
//      	
//			// 选择组织弹窗配置	
//			configOrganizationDialog: {
//				show: false, 	          // 弹窗的显示/隐藏
//              selectId:'',
//              type: ''
//			},
//			
//			// 选择人员弹窗（单选）配置
//			configPersonRadioDialog: {
//				show:false,
//				data:{
//					type: 'search',
//					id: ''
//				}
//			},
//
//			configMaintenanceGroupDialog: {
//				show:false,
//				data: {
//					type: 'search',
//					selectId: ''
//				}
//			},
//			
//			// 选择运维工程师弹窗配置
//			configMaintenanceEngineerDialog: {
//				show:false,
//				data:{
//					type: 'maintenanceEngineer',
//					id: ''
//				}
//			},

		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		})
	},
	methods: {

		init(){
			//this.getSynthesisData();
		},
		
		// 获取table数据
		getSynthesisData(){
			
			this.configSynthesisData.table.params.userId = this.$store.state.user.info.userId;
			
			//this.$axios.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryWorkOrdeReportForm', this.configSynthesisData.table.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/workOrdeReportForm/queryWorkOrdeReportForm', this.configSynthesisData.table.params).then((res) => {
				if(res.status == 200 && res.data && res.data.list && res.data.list.length) {
					this.configSynthesisData.table.data = res.data.list.map((item)=>{
						
						var workOrderTypeName;
						if(item.workOrderType == 1){
							workOrderTypeName = '事件工单';
						}else if(item.workOrderType == 2){
							workOrderTypeName = '问题工单';
						}else if(item.workOrderType == 3){
							workOrderTypeName = '变更工单';
						}else if(item.workOrderType == 4){
							workOrderTypeName = '发布工单';
						}else if(item.workOrderType == 5){
							workOrderTypeName = '备件工单';
						};
						
						item.responseTime = (item.responseTime === null) ? '--' : item.responseTime;
						item.resolutionTime = (item.resolutionTime === null) ? '--' : item.resolutionTime;
						
						return {
							workOrderTypeName: workOrderTypeName,
							
							workOrderCode: item.workOrderCode,
							workOrderType: item.workOrderType,
							priority: item.priority,
							createUserName: item.createUserName,
							createTime: item.createTime,
							workOrderCloseTime: item.workOrderCloseTime,
							assetName: item.assetName,
							handleUserNameList: item.handleUserNameList,
							responseTime: item.responseTime + ' (分)',
							resolutionTime: item.resolutionTime + ' (分)',
							evaluation: item.evaluation,
							workOrderId: item.workOrderId,
							instanceId: item.instanceId
						}
					});
					this.configSynthesisData.table.total = res.data.total;
				}else{
					this.configSynthesisData.table.data = [];
					this.configSynthesisData.table.total = 0;
				}
			});
		},
		
		// 打开工单详情页
		openWorkOrderDetail(orderId, instanceId, orderType){
			let workOrderType = (orderType==1&&'event'||orderType==2&&'question'||orderType==3&&'change'||orderType==4&&'publish'||orderType==5&&'spare');
			let params = {
				orderId: orderId,
				instanceId: instanceId
			}
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/workOrder/orderDatail/' + workOrderType, JSON.stringify(params));
		},
		
		// 排序发生变化的执行
		sortChange( obj ){
			console.log( obj );
			this.configSynthesisData.table.params.priorityOrder = '';
			this.configSynthesisData.table.params.createTimeOrder = '';
			this.configSynthesisData.table.params.closeTimeOrder = '';
			this.configSynthesisData.table.params.responseTimeOrder = '';
			this.configSynthesisData.table.params.resolutionTimeOrder = '';
			this.configSynthesisData.table.params.evaluationOrder = '';
			
			if( obj.prop && obj.order == 'ascending' ){
				if( obj.prop == 'priority'){
					this.configSynthesisData.table.params.priorityOrder = 0;
				}
				if( obj.prop == 'createTime'){
					this.configSynthesisData.table.params.createTimeOrder = 0;
				}
				if( obj.prop == 'workOrderCloseTime'){
					this.configSynthesisData.table.params.closeTimeOrder = 0;
				}
				if( obj.prop == 'responseTime'){
					this.configSynthesisData.table.params.responseTimeOrder = 0;
				}
				if( obj.prop == 'resolutionTime'){
					this.configSynthesisData.table.params.resolutionTimeOrder = 0;
				}
				if( obj.prop == 'evaluation'){
					this.configSynthesisData.table.params.evaluationOrder = 0;
				}
			}else if( obj.prop && obj.order == 'descending' ){
				if( obj.prop == 'priority'){
					this.configSynthesisData.table.params.priorityOrder = 1;
				}
				if( obj.prop == 'createTime'){
					this.configSynthesisData.table.params.createTimeOrder = 1;
				}
				if( obj.prop == 'workOrderCloseTime'){
					this.configSynthesisData.table.params.closeTimeOrder = 1;
				}
				if( obj.prop == 'responseTime'){
					this.configSynthesisData.table.params.responseTimeOrder = 1;
				}
				if( obj.prop == 'resolutionTime'){
					this.configSynthesisData.table.params.resolutionTimeOrder = 1;
				}
				if( obj.prop == 'evaluation'){
					this.configSynthesisData.table.params.evaluationOrder = 1;
				}
			}
			
			this.configSynthesisData.table.params.pageNum = 1;
			this.getSynthesisData();
		},
		
		// 查询table数据
		querySynthesisData(){
			this.configSynthesisData.table.params.pageNum = 1;
			this.$ies.syncValue(this.configSynthesisData.table.params, this.configSynthesisData.form.data);
			this.getSynthesisData();
		},
		
//		// 重置查询表单数据
//		resetQueryForm() {
//			this.$parent.$parent.$refs['reportForm'].resetFields();
//			this.configSynthesisData.form.data.startTime = '';
//			this.configSynthesisData.form.data.endTime = '';
//			this.configSynthesisData.form.data.closeTimeTag = 7;
//			this.configSynthesisData.form.data.closeTimeShow = false;
//			
//			this.configAssetDialog.selectId = '';
//			this.configRelationAssetDialog.selectId = '';
//			this.configOrganizationDialog.selectId = '';
//			this.configPersonRadioDialog.data.id = '';
//			this.configMaintenanceGroupDialog.data.selectId = '';
//			this.configMaintenanceEngineerDialog.data.id = '';
//		},
        
		// 导出Excel
		exportExcel(){
			var self = this;
			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
			var params = "?Token=" + token; 
			for(var key in this.configSynthesisData.table.params){
				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
			}
			//console.log( params );
			
			//window.location.href = '/api/itsm/performance/manager/workOrdeReportForm/export' + params;
			//window.location.href = 'http://192.168.3.22:9900/itsm/performance/manager/workOrdeReportForm/export' + params;
			window.location.href = '/api/itsm/performance/manager/workOrdeReportForm/export' + params;
		},
		// 导出PDF
		exportPDF(){
			var self = this;
			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
			var params = "?Token=" + token; 
			for(var key in this.configSynthesisData.table.params){
				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
			}
			//console.log( params );
			
			//window.location.href = 'http://192.168.3.22:9900/itsm/performance/manager/operationReportForm/export';
			
			//window.location.href = 'http://192.168.3.22:9900/itsm/performance/manager/workOrdeReportForm/exportPdf' + params;
			//window.open('/api/itsm/performance/manager/workOrdeReportForm/exportPdf' + params);
			//window.open('http://192.168.3.22:9900/itsm/performance/manager/workOrdeReportForm/exportPdf' + params);
			window.open('/api/itsm/performance/manager/workOrdeReportForm/exportPdf' + params);
		},
		
        
	}
}
</script>

<style lang="less">
</style>