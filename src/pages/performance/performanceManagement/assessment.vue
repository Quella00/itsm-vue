<template>
	<div class="itsm-tabs-main assessment-page">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div>
					
					<div class="tabs-panel-wrap border">
						<div class="panel-header">运维组考核管理 </div>
						<div class="panel-body">
							<el-form :inline="true" :model="configSynthesisData.form.data" ref="kpiForm" class="search-conditions">
								<el-form-item label="运维组编号：" prop="operationCode">
									<el-input v-model="configSynthesisData.form.data.operationCode" type="text"  placeholder="请输入运维组编号"></el-input>
								</el-form-item>
								<el-form-item label="运维组名称：" prop="operationName">
									<el-input v-model="configSynthesisData.form.data.operationName" placeholder="请输入运维组名称"></el-input>
									<!--<el-input v-model="configSynthesisData.form.data.operationName" placeholder="请选择运维组" auto-complete="off" readonly="readonly"></el-input>-->
									<!--<i class="el-icon-my-more" @click="openMaintenanceGroupDialog"></i>-->
								</el-form-item>
							</el-form>
						</div>

						<div class="tabs-panel-wrap border" style="margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fr">
									<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
									<el-button type="normal" icon="el-icon-my-search" @click="queryKpiData">查询</el-button>
									<el-button type="normal" icon="el-icon-my-circleAdd" @click="openKpiRuleDialog(1)">新增</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table ref="assetTable" :data="configSynthesisData.table.data" stripe style="width: 100%;">
									<el-table-column prop="operationCode" label="运维组编号" width="200"></el-table-column>
									<el-table-column prop="operationName" label="运维组名称" width="200" show-overflow-tooltip></el-table-column>
									<el-table-column prop="formula" label="考核算法" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetArea" label="操作" width="100">
			                            <template slot-scope="scope">
			                                <i class="el-icon-my-edit" title="编辑" @click="openKpiRuleDialog(1, scope.row.id)"></i>
			                                <i class="el-icon-my-delete" title="删除" @click="deleteKpiData(1, scope.row.id)"></i>
			                            </template>
									</el-table-column>
								</el-table>
							</div>

							<div class="panel-footer">
								<el-pagination @size-change="changeKpiSize" @current-change="changeKpiCurrent" :current-page="configSynthesisData.table.params.pageNum" :page-size="configSynthesisData.table.params.pageSize" :page-sizes="configSynthesisData.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSynthesisData.table.total"></el-pagination>
							</div>
						</div>
					</div>

					<div class="tabs-panel-wrap border">
						<div class="panel-header">角色考核管理</div>
						<div class="panel-body">
							<el-form :inline="true" :model="configSynthesisData.form.data" ref="roleKpiForm" class="search-conditions">
								<el-form-item label="角色名称：" prop="roleName">
									<el-input v-model="configSynthesisData.form.data.roleName" type="text"  placeholder="请输入角色名称"></el-input>
								</el-form-item>
							</el-form>
						</div>
						
						<div class="tabs-panel-wrap border" style="margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fr">
									<el-button type="normal" icon="el-icon-my-search" @click="queryRoleKpiData">查询</el-button>
									<el-button type="normal" icon="el-icon-my-circleAdd" @click="openKpiRuleDialog(2)">新增</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table ref="assetTable" :data="configSynthesisData.roleTable.data" stripe style="width: 100%;">
									<el-table-column prop="roleName" label="角色名称 " width="200"></el-table-column>
									<el-table-column prop="formula" label="考核算法" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetArea" label="操作" width="100">
			                            <template slot-scope="scope">
			                                <i class="el-icon-my-edit" title="编辑" @click="openKpiRuleDialog(2, scope.row.id)"></i>
			                                <i class="el-icon-my-delete" title="删除" @click="deleteKpiData(2, scope.row.id)"></i>
			                            </template>
									</el-table-column>
								</el-table>
							</div>
							<div class="panel-footer">
								<el-pagination @size-change="changeRoleKpiSize" @current-change="changeRoleKpiCurrent" :current-page="configSynthesisData.roleTable.params.pageNum" :page-size="configSynthesisData.roleTable.params.pageSize" :page-sizes="configSynthesisData.roleTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSynthesisData.roleTable.total"></el-pagination>
							</div>
						</div>
					</div>
					
				</div>
			</ies-scrollbar>
		</div>
		
		<!--选择角色弹窗-->
		<!--<ies-roleRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-roleRadioDialog>-->
	    
		<!--绩效考核规则弹窗-->
	    <assessmentRules-dialog v-model="configKpiRuleDialog.show" v-if="configKpiRuleDialog.show" @selectKpiRuleHandler="closeKpiRuleHandler" :defaultSelect='configKpiRuleDialog.data'></assessmentRules-dialog>
		
		<!-- 选择运维组弹窗 -->
		<!--<ies-maintenanceGroupDialog v-model="configMaintenanceGroupDialog.show" v-if="configMaintenanceGroupDialog.show" @selectMaintenanceGroupHandler="closeMaintenanceGroupHandler" :defaultSelect='configMaintenanceGroupDialog.selectId'></ies-maintenanceGroupDialog>-->
		
	</div>
</template>

<script>
import assessmentRulesDialog from './dialog/assessmentRulesDialog.vue'
	
export default {
	components:{
		assessmentRulesDialog
	},
	data () {
		return {
			// 运维组绩效报表数据
			configSynthesisData: {
				form: {
					data: {
						operationCode: '',           // 运维组编号
						
						operationName: '',        // 运维组名称
						operationId: '',          // 运维组id

						roleName: '',                // 角色name
						roleId: '',                  // 角色id
					}
				},
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						kpiType: 1,   				     // 1代表运维组，2代表角色
						operationCode: '',                    
						operationName: '',           		      		
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					data: [],
				},
				
				roleTable: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						kpiType: 2,   							
						roleName: '',              		
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					data: []
				},
				
			},
			
			// 绩效考评规则弹窗
//			selectRoleDialog:{
//				show:false,
//				data:{
//					type:'search',
//					id:''
//				}
//			},

            // 绩效考评规则弹窗
			configKpiRuleDialog:{
				show: false,
				data: {
					kpiType: '',
					id: ''
				}
			},
			
			// 选择角色弹窗（单选）
//			selectPersonRadioDialog:{
//				show:false,
//				data:{
//					type:'search',
//					id:''
//				}
//			},
			
			// 选择运维组弹窗配置
//			configMaintenanceGroupDialog: {
//				show:false,
//				selectId: ''
//			}
			
		}
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.getKpiListData();
			this.getRoleKpiListData();
		},
		
		// 获取运维组kpi列表数据
		getKpiListData(){
			//this.$axios.post('/yzz/itsm/performance/manager/queryKpiList', this.configSynthesisData.table.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/queryKpiList', this.configSynthesisData.table.params).then((res) => {
				if(res.status == 200 && res.data && res.data.list && res.data.list.length) {
					this.configSynthesisData.table.data = res.data.list;
					this.configSynthesisData.table.total = res.data.total;
				}else{
					this.configSynthesisData.table.data = [];
					this.configSynthesisData.table.total = 0;
				}
			});
		},
		
		// 获取角色kpi列表数据
		getRoleKpiListData(){
			//this.$axios.post('/yzz/itsm/performance/manager/queryKpiList', this.configSynthesisData.roleTable.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/queryKpiList', this.configSynthesisData.roleTable.params).then((res) => {
				if(res.status == 200 && res.data && res.data.list && res.data.list.length) {
					this.configSynthesisData.roleTable.data = res.data.list;
					this.configSynthesisData.roleTable.total = res.data.total;
				}else{
					this.configSynthesisData.roleTable.data = [];
					this.configSynthesisData.roleTable.total = 0;
				}
			});
		},
		
		// 查询运维组table数据
		queryKpiData(){
			this.configSynthesisData.table.params.pageNum = 1;
			this.$ies.syncValue(this.configSynthesisData.table.params, this.configSynthesisData.form.data);
			this.getKpiListData();
		},
		
		// 重置运维组查询表单数据
		resetQueryForm(){
			this.$refs['kpiForm'].resetFields();
			//this.configMaintenanceGroupDialog.selectId = '';
		},
		
		// 删除绩效考核数据
		deleteKpiData( type, v ){
			this.$confirm('请确认是否要删除该信息？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				closeOnClickModal: false
			}).then( ()=>{
				//this.$axios.post('/yzz/itsm/performance/manager/del', {ids: v}).then((res) => {
				this.$axios.post('/itsm/performance/manager/del', {ids: v}).then((res) => {
					if(res.status == 200) {
						type == 1 && this.getKpiListData(); // 刷新运维组列表
						type == 2 && this.getRoleKpiListData(); // 刷新角色列表
						this.$message.success( res.message );
					}
				});
			}).catch(() => {
				this.$message.info('已取消删除!');
			});
		},
		
		// 查询角色table数据
		queryRoleKpiData(){
			this.configSynthesisData.roleTable.params.pageNum = 1;
			this.$ies.syncValue(this.configSynthesisData.roleTable.params, this.configSynthesisData.form.data);
			this.getRoleKpiListData();
		},
		
        // pageSize 改变时会触发
        changeKpiSize( v ) {
        	this.configSynthesisData.table.params.pageSize = v;
            this.getKpiListData();
        },
        
        // currentPage 改变时会触发
        changeKpiCurrent( v ) {
            this.configSynthesisData.table.params.pageNum = v;
            this.getKpiListData();
        },
		
        // 角色列表 pageSize 改变时会触发
        changeRoleKpiSize( v ) {
        	this.configSynthesisData.roleTable.params.pageSize = v;
            this.getRoleKpiListData();
        },
        
        // 角色列表 currentPage 改变时会触发
        changeRoleKpiCurrent( v ) {
            this.configSynthesisData.roleTable.params.pageNum = v;
            this.getRoleKpiListData();
        },
		
//      // 显示选择运维组弹窗
//      openMaintenanceGroupDialog(){
//      	this.configMaintenanceGroupDialog.show = true;
//      },
//		// 关闭选择运维组弹窗回调
//		closeMaintenanceGroupHandler(data) {
//			data = JSON.parse(data);
//			this.configSynthesisData.form.data.operationName = data.groupName;
//			this.configSynthesisData.form.data.operationId = data.groupCode;
//			this.configMaintenanceGroupDialog.selectId = data.groupCode;
//		},
		
		// 显示绩效规则弹窗
		openKpiRuleDialog(type, id) {
			// type: 1是运维组， 2是角色
			this.configKpiRuleDialog.show = true;
			this.configKpiRuleDialog.data = {
					kpiType: type,
					id: id
			}
		},
		// 关闭绩效规则弹回调
		closeKpiRuleHandler( type, id ){
			if(type === 1){
				if(!id){
					this.configSynthesisData.table.params.pageNum = 1;
				}
				this.getKpiListData();
			}else if(type === 2){
				if(!id){
					this.configSynthesisData.roleTable.params.pageNum = 1;
				}
				this.getRoleKpiListData();
			}
		},
		
//		// 选择角色弹窗(单选)
//		selectPersonRadioShow() {
//			this.selectPersonRadioDialog.show = true;
//			this.selectPersonRadioDialog.data = {
//			 	type:'search',
//			 	id:this.maintenanceGroup.searchForm.userId
//			}
//		},
//		// 关闭选择角色弹窗(单选)回调
//		selectPersonRadioHandler(data) {
//			if (data) {
//				var data = JSON.parse(data);
//				this.maintenanceGroup.searchForm.userName = data.userName;
//              this.maintenanceGroup.searchForm.userId = data.id;
////	            this.selectPersonRadioDialog.data.id = data.id;
//			}
//		},
		

	}
}
</script>

<style lang="less">
.assessment-page {
	.search-conditions {
		padding: 15px 0px 0px 40px;
		.el-form-item {
			margin-right: 70px;
			.el-input__inner{ 
				width: 202px; 
			}
		}
	}
}
</style>