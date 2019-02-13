<template>
	<div>
	    <!-- 选择资产分类弹窗 -->
        <ies-assetDialog v-model="configAssetDialog.show" v-if="configAssetDialog.show" @assetChooseHandler="closeAssetClassificationDialogHandler" :defaultSelect='configAssetDialog.selectId' :type='configAssetDialog.type'></ies-assetDialog>
	    
		<!-- 选择关联资产弹窗 -->
		<ies-relationAssetDialog v-model="configRelationAssetDialog.show" v-if="configRelationAssetDialog.show" @relationAssetChooseHandler="closeRelationAssetChooseHandler" :defaultSelect='configRelationAssetDialog.selectId'></ies-relationAssetDialog>
	    
	    <!-- 选择组织弹窗 -->
		<ies-organizationDialog v-model="configOrganizationDialog.show" v-if="configOrganizationDialog.show" @groupChooseHandler="closeOrganizationHandler" :defaultSelect='configOrganizationDialog.selectId'></ies-organizationDialog>
	    
		<!-- 选择发起人弹窗(搜索时候单选的) -->
		<ies-personRadioDialog v-model="configPersonRadioDialog.show" v-if="configPersonRadioDialog.show" @selectPersonRadioHandler="closePersonRadioHandler" :defaultSelect='configPersonRadioDialog.data'></ies-personRadioDialog>

		<!-- 选择运维组弹窗 -->
		<ies-maintenanceGroupDialog v-model="configMaintenanceGroupDialog.show" v-if="configMaintenanceGroupDialog.show" @selectMaintenanceGroupHandler="closeMaintenanceGroupHandler" :defaultSelect='configMaintenanceGroupDialog.data'></ies-maintenanceGroupDialog>
	    
		<!-- 运维工程师弹窗 -->
		<ies-personRadioDialog v-model="configMaintenanceEngineerDialog.show" v-if="configMaintenanceEngineerDialog.show" @selectPersonRadioHandler="closeMaintenanceEngineerHandler" :defaultSelect='configMaintenanceEngineerDialog.data'></ies-personRadioDialog>
	</div>
</template>

<script>
export default {
	props: ['configSynthesisData'],
	data() {
		return {
			// 资产分类弹窗配置
			configAssetDialog: {
				show: false,       // 弹窗的显示/隐藏
				selectId: '',      // 选中的区域节点id
				type: 'search'     // 搜索时，禁用分类也显示
			},
			
        	// 关联资产弹窗配置
        	configRelationAssetDialog:{
        		show: false,
        		selectId: ''
        	},
        	
			// 选择组织弹窗配置	
			configOrganizationDialog: {
				show: false, 	          // 弹窗的显示/隐藏
//              selectId:'',
//              type: '',
                
                selectId: {
					organizationId: '',
					type: 'search'
                }

                
			},
			
			// 选择人员弹窗（单选）配置
			configPersonRadioDialog: {
				show:false,
				data:{
					type: 'search',
					id: ''
				}
			},

			configMaintenanceGroupDialog: {
				show:false,
				data: {
					type: 'search',
					selectId: ''
				}
			},
			
			// 选择运维工程师弹窗配置
			configMaintenanceEngineerDialog: {
				show:false,
				data:{
					type: 'maintenanceEngineer',
					id: ''
				}
			},
		}
	},
	methods: {
		
		
		// 重置查询表单数据
		resetQueryForm() {
			this.$parent.$refs['reportForm'].resetFields();
			this.configSynthesisData.form.data.startTime = '';
			this.configSynthesisData.form.data.endTime = '';
			this.configSynthesisData.form.data.closeTimeTag = 7;
			this.configSynthesisData.form.data.closeTimeShow = false;
			
			this.configAssetDialog.selectId = '';
			this.configRelationAssetDialog.selectId = '';
			//this.configOrganizationDialog.selectId = '';
			this.configOrganizationDialog.selectId.organizationId = '';
			this.configPersonRadioDialog.data.id = '';
			this.configMaintenanceGroupDialog.data.selectId = '';
			this.configMaintenanceEngineerDialog.data.id = '';
		},
		
        
		// 显示资产分类弹窗
		openAssetClassificationDialog(){
			this.configAssetDialog.show = true
		},
        // 资产分类弹窗关闭回调方法
        closeAssetClassificationDialogHandler(node) {
			this.configSynthesisData.form.data.classification = node.categoryName;
			this.configSynthesisData.form.data.classificationId = node.id;
			this.configAssetDialog.selectId = node.id;
        },
        
        // 显示资产弹窗
        openRelationAssetDialog(){
        	this.configRelationAssetDialog.show = true;
        },
        // 关闭选择资产弹窗的回调
        closeRelationAssetChooseHandler(data){
        	data = JSON.parse(data);
        	this.configSynthesisData.form.data.assetName = data.name;
        	this.configSynthesisData.form.data.assetId = data.id;
        	this.configRelationAssetDialog.selectId = data.id;
        },
        
		// 显示选择组织弹窗
		openOrganizationDialog() {
			this.configOrganizationDialog.show = true;
		},
		// 关闭选择组织弹窗的回调
		closeOrganizationHandler(node){
			this.configSynthesisData.form.data.createUserOrganizationName = node.organizationName;
			this.configSynthesisData.form.data.createUserOrganizationId = node.id;
			//this.configOrganizationDialog.selectId = node.id;
			this.configOrganizationDialog.selectId.organizationId = node.id;
		},
        
		// 显示选择人员弹窗(单选)
		openPersonRadioDialog() {
			this.configPersonRadioDialog.show = true;
		},
		// 关闭选择人员弹窗(单选)回调
		closePersonRadioHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.createUserName = data.userName;
			this.configSynthesisData.form.data.createUserId = data.id;
			this.configPersonRadioDialog.data.id = data.id;
		},
        
        // 显示选择运维组弹窗
        openMaintenanceGroupDialog(){
        	this.configMaintenanceGroupDialog.show = true;
        },
		// 关闭选择运维组弹窗回调
		closeMaintenanceGroupHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.createUserOperationName = data.groupName;
			this.configSynthesisData.form.data.createUserOperationId = data.id;
			this.configMaintenanceGroupDialog.data.selectId = data.groupCode;
		},
        
        // 显示选择运维工程师弹窗
        openMaintenanceEngineerDialog() {
        	this.configMaintenanceEngineerDialog.show = true;
        },
        // 关闭选择运维工程师弹窗回调
        closeMaintenanceEngineerHandler(data) {
        	console.log(data);
			data = JSON.parse(data);
			this.configSynthesisData.form.data.itsmNames = data.userName;
			this.configSynthesisData.form.data.itsmIds = data.id;
			this.configMaintenanceEngineerDialog.data.id = data.id;
        }
		
	}
}
</script>

<style>
</style>