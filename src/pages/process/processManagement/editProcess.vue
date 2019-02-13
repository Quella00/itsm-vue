<template>
	<div class="itsm-tabs-main edit-process">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					流程版本
				</div>
				<div class="panel-body">
					<el-table ref="editProcessTable" :data="editProcessConfig.table.data" stripe>
						<el-table-column label="版本号" prop="processVersion" show-overflow-tooltip class-name="column-padding"></el-table-column>
						<el-table-column label="最后修改人" prop="lastEditUser" show-overflow-tooltip></el-table-column>
						<el-table-column label="最后修改时间" prop="lastEditTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="状态">
							<template slot-scope="scope">
								<!--<el-radio v-model="scope.row.state" :label="2" @change="updateVersionStatus(scope.row.id)">&nbsp;</el-radio>-->
								<el-radio v-model="editProcessConfig.table.radioCheckedId" :label="scope.row.id" @change="updateVersionStatus(scope.row.id)">&nbsp;</el-radio>
							</template>
						</el-table-column>
						
						<el-table-column label="操作">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openMakeProcess(scope.row.id)"></i>
							</template>
						</el-table-column>
						<el-table-column label="" show-overflow-tooltip>
							<template slot-scope="scope">
								<a class="viewDetail" href="javascript:;" @click="changeProcessStepsMap(scope.row.id)">点击查看详情</a>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="height: auto; padding-bottom:20px;">
					<!--流程节点详情map-->
					<iesProcessSteps :configProcessStepsData="configProcessSteps"></iesProcessSteps>
                	<el-pagination @size-change="changeSize" @current-change="changeCurrent" :current-page="editProcessConfig.table.params.pageNum" :page-size="editProcessConfig.table.params.pageSize" :page-sizes="editProcessConfig.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="editProcessConfig.table.total"></el-pagination>
                </div>
			</div>
		</div>
	</div>
</template>

<script>
export default{
	data() {
		return {
			// 流程版本配置
			editProcessConfig: {
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						processTemplateId: '',       // 流程管理id
						
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					radioCheckedId: '',              // 启动的ID
					data: []
				}
			},
			
			// 流程节点详情配置
			configProcessSteps: {
				params: {
					processTemplatesVersionId: '',       // 流程版本id
                    pageNum: 1,                          // 当前页
					pageSize: 100                        // 每页数量
				},
				nodeData: [],							 // 流程节点数据
				state: 'view'                            // 状态state:view, operation
			}
			
		}
	},
	mounted() {
		this.$nextTick( ()=>{
			this.editProcessConfig.table.params.processTemplateId = this.$route.query.id;
			this.init();
		});
	},
	activated() {
		this.$refs.editProcessTable.doLayout();
	},
	methods: {
		init(){
			this.getProcessVersionTableData();
		},
		
		// 获取table数据
		getProcessVersionTableData(){
			this.$axios.post('/itsm/process/manager/templates/queryTemplatesVersionList', this.editProcessConfig.table.params).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					this.editProcessConfig.table.data = res.data.list.map((item)=>{
						// 获取默认的流程版本id
						if( item.status == 2 ){
							this.editProcessConfig.table.radioCheckedId = item.id;
							this.configProcessSteps.params.processTemplatesVersionId = item.id;
						}
						
						return {
							id: item.id,
							processVersion: item.processVersion,
							lastEditUser: item.updateUser,
							lastEditTime: item.updateTime,
							state: item.status
						}
					});
					this.editProcessConfig.table.total = res.data.total;
					
					// 获取流程节点图
					this.getProcessStepsMap();
					
				}else{
					this.editProcessConfig.table.data = [];
					this.editProcessConfig.table.total = 0;
				}
			});
		},
		
		// 获取流程节点图
		getProcessStepsMap() {
			this.$axios.post('/itsm/process/manager/node/queryProcessNodesByTemplatesId', this.configProcessSteps.params).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					this.configProcessSteps.nodeData = res.data.list.map((item)=>{
						return {
							id: item.id,
							processNodeName: item.processNodeName,
							processNodeNum: item.processNodeNum,
							processNodeDescribe: item.processNodeDescribe,
							processNodeAction: item.processNodeAction
						}
					});
				}else{
					this.configProcessSteps.nodeData = [];
				}
			});
		},
		
		// 制作流程节点
		openMakeProcess( val ) {
			var query = {
				templatesId: this.editProcessConfig.table.params.processTemplateId,
				processType: this.$route.query.processType,
				versionId: val
			}
			
			if( this.$route.query.processType == 1 ){
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/eventProcess/makeEventProcess', JSON.stringify(query));
			};
			if( this.$route.query.processType == 2 ){
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/problemProcess/makeProblemProcess', JSON.stringify(query));
			};
			if( this.$route.query.processType == 3 ){
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/changeProcess/makeChangeProcess', JSON.stringify(query));
			};
			if( this.$route.query.processType == 4 ){
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/releaseProcess/makeReleaseProcess', JSON.stringify(query));
			};
			if( this.$route.query.processType == 5 ){
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/spareProcess/makeSpareProcess', JSON.stringify(query));
			};
		
		},
		
		// 更改版本状态
		updateVersionStatus( val ) {
			var params = {
				id: val,
				templatesId: this.editProcessConfig.table.params.processTemplateId
			}

			//this.$axios.post('http://192.168.3.22:9600/itsm/process/manager/templates/updateVersionStatus', params).then((res) => {
			this.$axios.post('/itsm/process/manager/templates/updateVersionStatus', params).then((res) => {
				if(res.status == 200 ) {
					this.$message.success(res.message);
					this.changeProcessStepsMap( val );
					
					if( this.$route.query.processType == 1 ){
						this.$store.state.process.pageEventProcessFlag = !this.$store.state.process.pageEventProcessFlag;
					};
					if( this.$route.query.processType == 2 ){
						this.$store.state.process.pageProblemProcessFlag = !this.$store.state.process.pageProblemProcessFlag;
					};
					if( this.$route.query.processType == 3 ){
						this.$store.state.process.pageChangeProcessFlag = !this.$store.state.process.pageChangeProcessFlag;
					};
					if( this.$route.query.processType == 4 ){
						this.$store.state.process.pageReleaseProcessFlag = !this.$store.state.process.pageReleaseProcessFlag;
					};
					if( this.$route.query.processType == 5 ){
						this.$store.state.process.pageSpareProcessFlag = !this.$store.state.process.pageSpareProcessFlag;
					};
				}else{
					this.$message.error(res.message);
				}
			});
		},
		
		// 切换流程线路图
		changeProcessStepsMap( val ) {
			this.configProcessSteps.params.processTemplatesVersionId = val;
			this.getProcessStepsMap();
		},
		
		// pageSize 改变时会触发
		changeSize( val ) {
			this.editProcessConfig.table.params.pageSize = val;
          	this.getProcessVersionTableData();
		},
		// currentPage 改变时会触发
		changeCurrent( val ) {
        	this.editProcessConfig.table.params.pageNum = val;
          	this.getProcessVersionTableData();
		}
		
	}
}
</script>

<style lang="less">
.edit-process{
	.column-padding{
		padding-left:20px !important;
	}
	.viewDetail{
		color:#57a9fd;
	}
}
</style>