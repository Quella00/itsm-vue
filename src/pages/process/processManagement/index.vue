<template>
	<div class="itsm-tabs-main process">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 105px;">
					<el-form :inline="true" :model="configProcess.form.data" class="search-conditions">
						<el-form-item label="流程名称：">
							<el-input placeholder="请输入流程名称" v-model="configProcess.form.data.processName"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="queryProcessTableData">查询</el-button>
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddBaseInfo">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="processTable" :data="configProcess.table.data" stripe :fit="true">
						<el-table-column label="流程名称" prop="processName" show-overflow-tooltip class-name="column-padding">
							<template slot-scope="scope">
								<a class="edit-baseInfo" href="javascript:;" @click="openEditBaseInfoDialog(scope.row.id)">{{scope.row.processName}}</a>
							</template>
						</el-table-column>
						<el-table-column label="当前版本" prop="currentVersion" show-overflow-tooltip>
						</el-table-column>
						<el-table-column label="创建人" prop="creatUser" show-overflow-tooltip></el-table-column>
						<el-table-column label="最后修改人" prop="lastEditUser" show-overflow-tooltip></el-table-column>
						<el-table-column label="最后修改时间" prop="lastEditTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" width="100">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openEditProcess(scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
                	<el-pagination @size-change="changeSize" @current-change="changeCurrent" :current-page="configProcess.table.params.pageNum" :page-size="configProcess.table.params.pageSize" :page-sizes="configProcess.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configProcess.table.total"></el-pagination>
                </div>
			</div>
		</div>
		
		<!--编辑基本信息弹窗-->
		<editbaseinfo-dialog v-if="configEditBaseInfoDialog.show" :configEditBaseInfoDialog="configEditBaseInfoDialog" @callback="refreshProcessTableData"></editbaseinfo-dialog>
		
	</div>
</template>

<script>
import editbaseinfoDialog from './editBaseInfoDialog.vue'
	
export default {
	components:{
		editbaseinfoDialog
	},
	data() {
		let validator = this.$ies.validator;
		return {
			// 事件流程管理
			configProcess: {
				form: {
					data: {
						processName: ''              // 流程名称
					}
				},
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						processName: '',             // 流程名称
						processType: '',             // 流程类型
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					data: []
				}
			},
			// 流程管理基本信息弹窗配置
			configEditBaseInfoDialog: {
				show: false,
				id: '',             // 流程管理的id
				processType: ''     // 流程管理的type
			}
		}
	},
	mounted() {
		this.$nextTick( ()=>{
			// 获取流程管理的类型，1:事件流程，2：问题流程，3：变更流程，4：发布流程，5：备件流程
			this.configProcess.table.params.processType = this.$route.query.type;
			this.init();
		});
	},
	activated() {
		this.$refs.processTable.doLayout();
	},
	methods:{
		init() {
			this.getProcessTableData();
		},
		
		// 获取流程管理table数据
		getProcessTableData() {
			this.$axios.post('/itsm/process/manager/templates/queryTemplatesList', this.configProcess.table.params).then((res) => {
				if(res.status == 200 && res.data && res.data.list.length) {
					this.configProcess.table.data = res.data.list.map((item)=>{
						return {
							id: item.id,
							processName: item.processName,
							currentVersion: item.processVersion,
							creatUser: item.createUser,
							lastEditUser: item.updateUser,
							lastEditTime: item.updateTime
						}
					});
					this.configProcess.table.total = res.data.total;
				}else{
					this.configProcess.table.data = [];
					this.configProcess.table.total = 0;
				}
			});
		},
		
		// 查询流程管理table数据
		queryProcessTableData() {
			this.configProcess.table.params.pageNum = 1;
			this.$ies.syncValue(this.configProcess.table.params, this.configProcess.form.data);
			this.getProcessTableData();
		},
		
		// 新增事件流程管理
		openAddBaseInfo( val ) {
			if( this.configProcess.table.params.processType == 1 ) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/eventProcess/addEventBaseInfo?processType=1');
			};
			if( this.configProcess.table.params.processType == 2 ) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/problemProcess/addProblemBaseInfo?processType=2');
			};
			if( this.configProcess.table.params.processType == 3 ) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/changeProcess/addChangeBaseInfo?processType=3');
			};
			if( this.configProcess.table.params.processType == 4 ) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/releaseProcess/addReleaseBaseInfo?processType=4');
			};
			if( this.configProcess.table.params.processType == 5 ) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/spareProcess/addSpareBaseInfo?processType=5');
			};
		},
		
		// 打开编辑流程管理基本信息弹框
		openEditBaseInfoDialog( val ) {
			this.configEditBaseInfoDialog.id = val;
			this.configEditBaseInfoDialog.processType = this.configProcess.table.params.processType;
			this.configEditBaseInfoDialog.show = true;
		},
		// 刷新流程管理table数据
		refreshProcessTableData() {
			this.getProcessTableData();
		},
		
		// 编辑事件流程管理
		openEditProcess( val ) {
			const query = {
				id: val,
				processType: this.configProcess.table.params.processType
			}
			
			if( this.configProcess.table.params.processType == 1) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/eventProcess/editEventProcess', JSON.stringify(query));
			};
			if( this.configProcess.table.params.processType == 2) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/problemProcess/editProblemProcess', JSON.stringify(query));
			};
			if( this.configProcess.table.params.processType == 3) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/changeProcess/editChangeProcess', JSON.stringify(query));
			};
			if( this.configProcess.table.params.processType == 4) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/releaseProcess/editReleaseProcess', JSON.stringify(query));
			};
			if( this.configProcess.table.params.processType == 5) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/process/processManagement/spareProcess/editSpareProcess', JSON.stringify(query));
			};
			
		},
		
		// pageSize 改变时会触发
		changeSize( val ) {
			this.configProcess.table.params.pageSize = val;
          	this.getProcessTableData();
		},
		// currentPage 改变时会触发
		changeCurrent( val ) {
        	this.configProcess.table.params.pageNum = val;
          	this.getProcessTableData();
		}
		
	}
}
</script>

<style lang="less">
	.process{
		.search-conditions{
			padding: 28px 0 0 40px;
		}
		.column-padding{
			padding-left:20px !important;
		}
		.edit-baseInfo{
			color:#57a9fd;
		}
	}
</style>