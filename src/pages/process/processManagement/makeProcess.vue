<template>
	<div class="itsm-tabs-main makeProcess">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							标准流程模板
						</div>
						<div class="panel-body">
							<ies-scrollbar class="ies-scrollbar">
								<div class="process-chart">
									
									<template v-if="configSaveProcessSteps.params.processType == 1">
										<img src="../../../assets/img/process/process-chart-event.png" alt="" />
									</template>
									<template v-else-if="configSaveProcessSteps.params.processType == 2">
										<img src="../../../assets/img/process/process-chart-problem.png" alt="" />
									</template>
									<template v-else-if="configSaveProcessSteps.params.processType == 3">
										<img src="../../../assets/img/process/process-chart-change.png" alt="" />
									</template>
									<template v-else-if="configSaveProcessSteps.params.processType == 4">
										<img src="../../../assets/img/process/process-chart-release.png" alt="" />
									</template>
									<template v-else="configSaveProcessSteps.params.processType == 5">
										<img src="../../../assets/img/process/process-chart-spare.png" alt="" />
									</template>
								</div>
							</ies-scrollbar>
						</div>
					</div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							流程制作
							<div class="panel-header-right">
								<el-button type="normal" icon="el-icon-my-withdraw" @click="returnLastStep">撤销上一步</el-button>
							</div>
						</div>
						<div class="panel-body">
		                    <!-- 流程节点详情map -->
		                    <iesProcessSteps :configProcessStepsData="configSaveProcessSteps"></iesProcessSteps>
		                    <div  style="text-align:center; padding:20px 0 40px;">
		                    	<el-button type="normal" @click="saveProcesSteps">&nbsp;保&nbsp;存&nbsp;</el-button>
		                    </div>
							
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		
	</div>
</template>

<script>
    export default {
        data() {
            return {
            	// 获取流程制作节点
				configQueryProcessNodesByTemplatesId: {
					params:{
						processTemplatesVersionId: '',
						pageNum: 1,
						pageSize: 100
					}
				},
            	
            	// 获取流程制作节点的属性
				configQueryAllNodePropertyByVersionId: {
					params:{
						processNodeVersionId: '',
						pageNum: 1,
						pageSize: 100
					}
				},
            	
            	// 保存流程节点的配置
				configSaveProcessSteps: {
					state: 'operation',          // 状态state:view, operation
					operationType: '',           // 操作的流程类型（add,edit）
					
					nodeData: [],                // 节点数据
					nodePropertyData: [],        // 节点属性数据
					stepsData: [],               // 操作步骤
					
					params:{
						processList: [],
						processTemplatesNode: '',
						processType: '',
						processTemplatesId: '',
						id: ''
					}
				},
				
				// 保存初始流程节点及属性的配置
				configInitProcessSteps: {
					isProcessStepsChange: false, // 流程节点是否被修改
					
					nodeData: '',               // 节点数据
					params:{
						processList: ''         // 需要保存的节点属性数据
					}
				},
				
				// 角色管理的数据源
				configProcessRoleData: {
					data: []
				},
				
				// 流程节点对应的角色
				//configProcessRoleList: processRoleList
            }
        },
        mounted() { 
        	//console.log( this.configProcessRoleList );
        	this.$nextTick( ()=>{
        		this.configQueryProcessNodesByTemplatesId.params.processTemplatesVersionId = this.$route.query.versionId;
        		this.configQueryAllNodePropertyByVersionId.params.processNodeVersionId = this.$route.query.versionId;
        		
        		this.configSaveProcessSteps.params.processTemplatesId = this.$route.query.templatesId;
        		this.configSaveProcessSteps.params.processType = this.$route.query.processType;
        		
        		// 获取流程操作类型
        		this.configSaveProcessSteps.operationType = this.$route.query.operationType;
        		
        		this.init();
        	})
        },
        methods: {
        	init() {
        		this.configSaveProcessSteps.stepsData = [];
        		
        		this.getProcessTemplatesUuid();
        		this.getQueryProcessNodesByTemplatesId();
      			//this.getQueryAllNodeProperty();
        	},
        	
			// 获取流程管理的id
			getProcessTemplatesUuid() {
				this.$axios.post('/itsm/process/manager/templates/getProcessTemplatesUuid').then((res) => {
					if(res.status == 200) {
						this.configSaveProcessSteps.params.id = res.data;
					}else{
						this.configSaveProcessSteps.params.id = '';
					}
				});
			},
			
			// 获取流程制作节点
			getQueryProcessNodesByTemplatesId() {
				this.$axios.post('/itsm/process/manager/node/queryProcessNodesByTemplatesId', this.configQueryProcessNodesByTemplatesId.params).then((res) => {
					if(res.status == 200 && res.data.list && res.data.list.length) {
						this.configSaveProcessSteps.nodeData = res.data.list.map((item, index)=>{
							
							return {
								id: item.id,
								processNodeSerial: index,    // 审核节点的标识
								processNodeName: item.processNodeName,
								processNodeNum: item.processNodeNum,
								processNodeDescribe: item.processNodeDescribe,
								processNodeAction: item.processNodeAction
							}
						});
						
						this.getQueryAllNodeProperty();
						
					}else{
						this.configSaveProcessSteps.nodeData = [];
					}
				});
			},
			
			// 获取流程制作节点属性
			getQueryAllNodeProperty() {
				if(this.configSaveProcessSteps.operationType == 'add') {
					
					var processNodeId = this.configSaveProcessSteps.nodeData.map((item)=>{
						return item.id
					}).join();
					
					this.$axios.post('/itsm/process/manager/node/property/queryAllNodePropertyBaseByNodeId', {processNodeId: processNodeId}).then((res) => {
						if(res.status == 200) {
							
							
							
							var processNodeIdArr = processNodeId.split(',');
							
							// 根据节点顺序，排列节点属性顺序
							this.configSaveProcessSteps.nodePropertyData = [];
							for(var i = 0; i < processNodeIdArr.length; i++){
								for(var j = 0; j < res.data.length; j++){
									if(processNodeIdArr[i] == res.data[j].id) {
										this.configSaveProcessSteps.nodePropertyData.push(res.data[j]);
										break;
									}
								}
							};
							
							//console.log( this.configSaveProcessSteps.nodePropertyData );
							
							// 初始化提交的节点属性
							this.configSaveProcessSteps.params.processList = this.configSaveProcessSteps.nodePropertyData.map((item, index)=>{
								return {
									id: item.id,
									//processNodeSerial: index + 1,   // 审核节点的标识
									processNodeSerial: index,   // 审核节点的标识
									
									processTemplatesId: this.configSaveProcessSteps.params.processTemplatesId,
									//processNodeId: item.processNodeId,
									processNodeId: item.id,
									processNodeVersionId: this.configSaveProcessSteps.params.id,
									
									processNodeName: item.processNodeName,        			// 节点名称
									processRoleName: item.processRoleName,                	// 流程角色
									processRoleId: Number(item.processRoleId),            	// 流程角色
									handleTime: item.handleTime,                  			// 是否计入处理时间
									closeWorkOrder: item.closeWorkOrder,          			// 是否拥有关闭工单权限
									hangUpWorkOrder: item.hangUpWorkOrder,        			// 是否可以挂起工单  
									rejectWorkOrder: item.rejectWorkOrder,                  // 是否可以回滚 
									confirmCloseWorkOrder: item.confirmCloseWorkOrder,      // 是否可以确认关闭工单
									
									acceptWorkOrder: item.acceptWorkOrder,                  // 是否有受理权限  
									appointWorkOrder: item.appointWorkOrder,                // 是有指派的权限  
									startupWorkOrder: item.startupWorkOrder,                // 是否有启动的权限  
									
									noticeNextNodeEmail: item.noticeNextNodeEmail,                   // 是否邮件通知下一个节点用户
									noticeNextNodeSms: item.noticeNextNodeSms,                       // 是否短信通知下一个节点用户
									noticeWorkOrderCreator: item.noticeWorkOrderCreator,             // 是否通知工单创建者
									noticeWorkOrderCreatorEmail: item.noticeWorkOrderCreatorEmail,   // 是否邮件通知工单创建者
									noticeWorkOrderCreatorSms: item.noticeWorkOrderCreatorSms,       // 是否短信通知工单创建者
									baseProperty: item.baseProperty                                  // 是否是基本属性
								}
							});
							
							console.log( this.configSaveProcessSteps.params.processList );
							console.log( '--------------' );
							//console.log( this.configSaveProcessSteps.params.processList );
							//console.log( JSON.stringify(this.configSaveProcessSteps.params.processList) );
							
						}else{
							this.configSaveProcessSteps.nodePropertyData = [];
							this.configSaveProcessSteps.params.processList = [];
						}
					});
					
				} else {
					this.$axios.post('/itsm/process/manager/node/property/queryAllNodePropertyByVersionId', this.configQueryAllNodePropertyByVersionId.params).then((res) => {
						if(res.status == 200) {
							this.configSaveProcessSteps.nodePropertyData = res.data;
							
							this.configSaveProcessSteps.params.processList = this.configSaveProcessSteps.nodePropertyData.map((item, index)=>{
								return {
									id: item.id,
									//processNodeSerial: index+1,   // 审核节点的标识
									processNodeSerial: index,   // 审核节点的标识
									
									processTemplatesId: item.processTemplatesId,
									//processNodeId: item.processNodeId,
									processNodeId: item.id,
									processNodeVersionId: this.configSaveProcessSteps.params.id,
									
									processNodeName: item.processNodeName,        			// 节点名称
									processRoleName: item.processRoleName,                	// 流程角色
									processRoleId: Number(item.processRoleId),            	// 流程角色
									handleTime: item.handleTime,                  			// 是否计入处理时间
									closeWorkOrder: item.closeWorkOrder,          			// 是否拥有关闭工单权限
									hangUpWorkOrder: item.hangUpWorkOrder,        			// 是否可以挂起工单  
									rejectWorkOrder: item.rejectWorkOrder,                  // 是否可以回滚  
									confirmCloseWorkOrder: item.confirmCloseWorkOrder,      // 是否可以确认关闭工单
									
									acceptWorkOrder: item.acceptWorkOrder,                  // 是否有受理权限  
									appointWorkOrder: item.appointWorkOrder,                // 是有指派的权限  
									startupWorkOrder: item.startupWorkOrder,                // 是否有启动的权限  
									
									noticeNextNodeEmail: item.noticeNextNodeEmail,                   // 是否邮件通知下一个节点用户
									noticeNextNodeSms: item.noticeNextNodeSms,                       // 是否短信通知下一个节点用户
									noticeWorkOrderCreator: item.noticeWorkOrderCreator,             // 是否通知工单创建者
									noticeWorkOrderCreatorEmail: item.noticeWorkOrderCreatorEmail,   // 是否邮件通知工单创建者
									noticeWorkOrderCreatorSms: item.noticeWorkOrderCreatorSms,       // 是否短信通知工单创建者
									baseProperty: item.baseProperty                                  // 是否是基本属性
								}
							});
							
							// 初始节点的id
							this.configInitProcessSteps.nodeData = this.configSaveProcessSteps.nodeData.map((item)=>{
								return item.id
							}).join();
							// 初始节点的属性
							this.configInitProcessSteps.params.processList = JSON.stringify(this.configSaveProcessSteps.params.processList);
							
							
						}else{
							this.configSaveProcessSteps.nodePropertyData = [];
							this.configSaveProcessSteps.params.processList = [];
						}
					});
				}
			},
			
			// 撤销上一步
			returnLastStep() {
				if(this.configSaveProcessSteps.stepsData.length) {
					var lastStep = this.configSaveProcessSteps.stepsData[this.configSaveProcessSteps.stepsData.length - 1];
					
					// 删除的撤销
					if(lastStep.type == 'deleteNode') {
						this.configSaveProcessSteps.nodeData.splice(lastStep.index, 0 , lastStep.data);
					};
					// 新增的撤销
					if(lastStep.type == 'addNode') {
						this.configSaveProcessSteps.nodeData.splice(lastStep.index + 1, 1 );
					};
					
					this.configSaveProcessSteps.stepsData.pop();
				}else{
					this.$message.info('没有可以撤销的步骤');
				}
			},
			
			// 保存流程操作的节点
			saveProcesSteps() {
				console.log( this.configSaveProcessSteps.params.processList );
				console.log( this.configSaveProcessSteps.nodeData );

                // 根据现有节点数据来筛选需要保留的节点属性的数据
				var processListTemp = [];
				for(var i = 0; i < this.configSaveProcessSteps.nodeData.length; i++) {
					for(var j = 0; j < this.configSaveProcessSteps.params.processList.length; j++) {
						if( this.configSaveProcessSteps.nodeData[i].id == this.configSaveProcessSteps.params.processList[j].processNodeId && this.configSaveProcessSteps.nodeData[i].processNodeSerial == this.configSaveProcessSteps.params.processList[j].processNodeSerial ){
						//if( this.configSaveProcessSteps.nodeData[i].id == this.configSaveProcessSteps.params.processList[j].processNodeId ){
							this.configSaveProcessSteps.params.processList[j].processNodeSerial = i;
							processListTemp.push( this.configSaveProcessSteps.params.processList[j] );
							break;
						}
					}
				};
				
				// 节点属性数据转化为json类型的字符串
				//this.configSaveProcessSteps.params.processList = JSON.stringify(this.configSaveProcessSteps.params.processList);
				
				// 获取节点的数组字符串
				this.configSaveProcessSteps.params.processTemplatesNode = this.configSaveProcessSteps.nodeData.map((item)=>{
					return item.id;
				}).join();
				
				//console.log(this.configInitProcessSteps.nodeData);
				//console.log(this.configSaveProcessSteps.params.processTemplatesNode);
				console.log(this.configInitProcessSteps.nodeData !== this.configSaveProcessSteps.params.processTemplatesNode);
				
				//console.log(this.configInitProcessSteps.params.processList);
				//console.log(processListTemp);
				console.log(this.configInitProcessSteps.params.processList !== JSON.stringify(processListTemp));
				
				// 判断流程制作是否有修改
				if(this.configInitProcessSteps.nodeData !== this.configSaveProcessSteps.params.processTemplatesNode) {
					this.isProcessStepsChange = true;
				};
				if( this.configInitProcessSteps.params.processList !== JSON.stringify(processListTemp)) {
					this.isProcessStepsChange = true;
				};
				
				//console.log( this.isProcessStepsChange );
				//console.log( JSON.stringify(this.configSaveProcessSteps.nodeData) );
				//console.log( JSON.stringify(this.configSaveProcessSteps.params) );
				
				//return;
				
				if( this.isProcessStepsChange ) {
					// 保存流程制作的数据
					
					// 节点属性数据转化为json类型的字符串
					//this.configSaveProcessSteps.params.processList = processListTemp;
					this.configSaveProcessSteps.params.processList = JSON.stringify(processListTemp);
					
					//this.$axios.post('http://192.168.3.22:9600/itsm/process/manager/templates/saveProcesTemplatesVersion', this.configSaveProcessSteps.params).then((res) => {
					this.$axios.post('/itsm/process/manager/templates/saveProcesTemplatesVersion', this.configSaveProcessSteps.params).then((res) => {

						if(res.status == 200) {
							this.$message.success(res.message);
							
//							if(this.configSaveProcessSteps.operationType !== 'add') {
//								this.$store.state.process.pageEditProcessFlag = !this.$store.state.process.pageEditProcessFlag;
//							}
							
							if(this.configSaveProcessSteps.params.processType == 1) {
								if(this.configSaveProcessSteps.operationType !== 'add') {
									this.$store.state.process.pageEditEventProcessFlag = !this.$store.state.process.pageEditEventProcessFlag;
								}
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/process/processManagement/eventProcess/makeEventProcess');
								this.$store.state.process.pageEventProcessFlag = !this.$store.state.process.pageEventProcessFlag;
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/eventProcess?type=1');
							}
							if(this.configSaveProcessSteps.params.processType == 2) {
								if(this.configSaveProcessSteps.operationType !== 'add') {
									this.$store.state.process.pageEditProblemProcessFlag = !this.$store.state.process.pageEditProblemProcessFlag;
								}
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/process/processManagement/problemProcess/makeProblemProcess');
								this.$store.state.process.pageProblemProcessFlag = !this.$store.state.process.pageProblemProcessFlag;
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/problemProcess?type=2');
							}
							if(this.configSaveProcessSteps.params.processType == 3) {
								if(this.configSaveProcessSteps.operationType !== 'add') {
									this.$store.state.process.pageEditChangeProcessFlag = !this.$store.state.process.pageEditChangeProcessFlag;
								}
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/process/processManagement/changeProcess/makeChangeProcess');
								this.$store.state.process.pageChangeProcessFlag = !this.$store.state.process.pageChangeProcessFlag;
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/changeProcess?type=3');
							}
							if(this.configSaveProcessSteps.params.processType == 4) {
								if(this.configSaveProcessSteps.operationType !== 'add') {
									this.$store.state.process.pageEditReleaseProcessFlag = !this.$store.state.process.pageEditReleaseProcessFlag;
								}
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/process/processManagement/releaseProcess/makeReleaseProcess');
								this.$store.state.process.pageReleaseProcessFlag = !this.$store.state.process.pageReleaseProcessFlag;
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/releaseProcess?type=4');
							}
							if(this.configSaveProcessSteps.params.processType == 5) {
								if(this.configSaveProcessSteps.operationType !== 'add') {
									this.$store.state.process.pageEditSpareProcessFlag = !this.$store.state.process.pageEditSpareProcessFlag;
								}
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/process/processManagement/spareProcess/makeSpareProcess');
								this.$store.state.process.pageSpareProcessFlag = !this.$store.state.process.pageSpareProcessFlag;
								this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/spareProcess?type=5');
							}
							
						}else{
							this.$message.error(res.message);
						}
					});
				} else {
					this.$message.warning('您没有对流程进行有效编辑，无法保存为新版本');
					return;
				}

			}
		},
    }
</script>

<style lang="less">
	.makeProcess{
		.process-chart {
			width:1629px;padding:30px 0 10px;
		}
	}
</style>