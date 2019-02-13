<!--用户管理--角色管理-->
<template>
	<div class="itsm-tabs-main role">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 105px;">
					<el-form :inline="true" :model="role.searchForm" class="search-conditions">
						<el-form-item label="角色名称：" style="margin-right: 185px;">
							<el-input placeholder="请输入角色名称" v-model="role.searchName"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteRole">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>	
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="addRole('add')">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="role.tableData" stripe style="width: 100%">
						<el-table-column width="55" align="center">
							<template slot-scope="scope">
								<el-radio v-model="role.radio" :label="scope.row" :disabled="/[(App)]/g.test(scope.row.roleName)"></el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="check" label=" " :width="15" align="center"></el-table-column>
						<el-table-column label="角色名称" prop="roleName" show-overflow-tooltip></el-table-column>
						<el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openEditRoleDialog(scope.row)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>

			<!--增加、编辑角色弹窗-->
			<el-dialog :title="editRoleDialog.type == 'add' ? '新建角色' : '编辑角色'" width="776px" :visible.sync="editRoleDialog.show" custom-class="addRole" @close="closeEditRoleDialog" :close-on-click-modal='false' v-drag>
				<div class="addEditRole-content">
					<div class="dialog-tabs">
						<ul class="clearfix">
							<li :class="{active:editRoleDialog.basicInfo}" @click="changeView('basicInfo')">
								<a href="javascript:;">基本信息</a>
							</li>
							<li :class="{active:editRoleDialog.permissionsSet}" @click="changeView('permissionsSet')" v-show="editRoleDialog.type != 'add'">
								<a href="javascript:;">权限设置</a>
							</li>
							<li :class="{active:editRoleDialog.personManage}" @click="changeView('personManage')" v-show="editRoleDialog.type != 'add'">
								<a href="javascript:;">人员管理</a>
							</li>
						</ul>
					</div>
					<div class="dialog-tabs-content">
						<!--基本信息-->
						<div class="basic-info" v-show="editRoleDialog.basicInfo">
							<el-form :inline="true" ref="editRoleForm" :model="editRoleDialog.ruleForm" :rules="editRoleDialog.rules" label-width="120px">
								<el-form-item label="角色名称：" prop="name">
									<el-input v-model="editRoleDialog.ruleForm.name" placeholder="请输入角色名称" :disabled ="editRoleDialog.type != 'add'"></el-input>
								</el-form-item>
								<el-form-item label="描述：" prop="desc">
									<el-input type="textarea" placeholder="请输入描述" v-model="editRoleDialog.ruleForm.desc"></el-input>
								</el-form-item>
							</el-form>
						</div>
						<!--权限设置-->
						<div class="permissions-set" v-show="editRoleDialog.permissionsSet">
							<div style="float: left;" v-show="roleType == 'pc'">
								<div style="padding-left: 33px;">PC端权限</div>

								<el-tree :data="editRoleDialog.permissionData" show-checkbox node-key="id" :default-expanded-keys="editRoleDialog.defaultExpanded" :props="editRoleDialog.defaultProps" 
								:node-expand="nodeExpand" ref="permissionTree"></el-tree>
							</div>

							<div style="float: left;" v-show="roleType == 'app'">
								<div style="padding-left: 33px;">App端权限</div>

								<el-tree :data="editRoleDialog.permissionAppData" show-checkbox node-key="id" :default-expanded-keys="editRoleDialog.defaultAppExpanded" :props="editRoleDialog.defaultProps" 
								:node-expand="nodeAppExpand" ref="permissionAppTree"></el-tree>
							</div>
						</div>
						<!--人员信息-->
						<div class="personManage" v-show="editRoleDialog.personManage">
							<div class="select-person-content" style="padding: 10px 10px 0px; height: 412px;">								
								<div class="tabs-panel-wrap border" v-if="editRoleDialog.personManage" v-autoHeight="tableH">
									<div class="panel-header">
										<div class="panel-header-left">
											<el-button type="normal" icon="el-icon-my-delete" @click="deletePerson">删除</el-button>
										</div>
										<div class="panel-header-right">											
											<el-button type="normal" icon="el-icon-my-add" @click="selectPersonCheckboxShow">添加</el-button>
										</div>
									</div>
									<div class="panel-body">
										<el-table :data="editRoleDialog.tableData" stripe :fit="true"  style="width: 100%;" @selection-change="personSelectionChange" :max-height="tableH">
											<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
											<el-table-column label="工号" prop="userCode" show-overflow-tooltip></el-table-column>
											<el-table-column label="登录ID" prop="loginName" show-overflow-tooltip></el-table-column>
											<el-table-column label="用户名" prop="userName" show-overflow-tooltip></el-table-column>
										</el-table>
									</div>
								
								</div>
							</div>
						</div>
					</div>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="normal" @click="saveRole">保存</el-button>
				</div>
			</el-dialog>
		</div>
		<!--选择人员弹窗(搜索时候多选的)-->
		<ies-personCheckDialog v-model="selectPersonCheckboxDialog.show" v-if="selectPersonCheckboxDialog.show" @selectPersonCheckboxHandler="selectPersonCheckboxHandler" :defaultSelect='selectPersonCheckboxDialog.data'></ies-personCheckDialog>	
	</div>
</template>

<script>
	export default {
		name:'role',
		components: {

		},
		props: {

		},
		data() {
			let validator = this.$ies.validator;
			return {
				roleType: 'pc',    // pc or app
				tableH: '',
				// 页面整体数据
				role: {
					tableData: [],
					searchName:'',					
					searchConditions:{
						searchName:''
					},
					radio:''
				},
				// 增加编辑角色弹窗
				editRoleDialog: {
					id:'',//编辑的角色的id
					show: false,
					basicInfo: true,
					permissionsSet: false,
					personManage: false,
					currentView: 'basicInfo',
					ruleForm: {
						name: '',
						desc: ''
					},
					rules: {
						name: [{required: true,message: '请输入名称',trigger: 'blur'},{validator:validator.space,trigger: 'blur',options:{max:32}}],
						desc: [{validator:validator.space,trigger: 'blur',options:{max:200}}]
					},
					permissionData: [{
						id:0,
						resourceName: '全选/全取消',
						children: []
					}],
					permissionAppData: [{
						id:0,
						resourceName: '全选/全取消',
						children: []
					}],
					// expanddata
					defaultExpanded: [0],
					defaultAppExpanded: [0],
					defaultProps: {
						children: 'children',
						label: 'resourceName'
					},
					permissionIdList:[],//权限树的选中id数组
					tableData: [],//人员信息数组
					tableDataIdList:[],//要提交的人员id数组
					selected:[],//人员信息选中的id数组	
					type:'',
				},
				// 选择人员弹窗（多选）
				selectPersonCheckboxDialog:{
					show:false,
					data:{}
				},
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.init();				
			});
		},
		methods: {
			/********************************角色分页查询********************************************/
			// 初始化
			init(){
				this.getRoleData();
			},
			// 获取表格数据
			getRoleData(){
				var params = {	
					roleName:this.role.searchConditions.searchName
				}
				this.$axios.post('/itsm/system/permission/role/queryRoleByPage',params).then((res) => {
                    if(res.status == 200){
                    	this.role.tableData = res.data;
                    	this.role.radio = '';
                    } else {
                        this.$message(res.message);
                    }
                });
			},			
			// 点击查询
			search(){
				this.role.searchConditions.searchName = $.trim(this.role.searchName);
				this.getRoleData();
			},
			// 新增角色
			addRole(type){
				this.editRoleDialog.type = type;
				this.editRoleDialog.show = true;
			},
			// 删除角色
			deleteRole(){
				const self = this;
				if(self.role.radio == ''){
					self.$message.warning("请先选择一个角色");
					return;
				}else{
					self.$confirm('是否确定删除选中的角色?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						self.$axios.post('/itsm/system/permission/role/deleteRole',{id:self.role.radio.id}).then( (res) => {
							if(res.status == 200) {
								self.$message.success('删除成功');
								self.getRoleData();
							} else {
								self.$message.error('删除失败');
							}
						});
					}).catch(() => {
						self.$message.info('已取消删除');
					});
				}
			},
			/********************************编辑角色********************************************/
			// 打开编辑角色弹窗
			openEditRoleDialog(row) {
				this.editRoleDialog.show = true;
				this.editRoleDialog.id = row.id;
				// 获取所有的权限
                this.$axios.post('/itsm/system/permission/resource/queryResourceByAll',{ usability:1 }).then((res) => {
                    if(res.status == 200){
                    	this.editRoleDialog.permissionData[0].children = res.data.top;
                    } else {
                        this.$message({message: res.message,type: 'warning'});
                    }
				});
				
				// 获取 App 权限
                this.$axios.post('/itsm/system/permission/resource/queryAppResourceTree').then((res) => {
                    if(res.status == 200){
						this.editRoleDialog.permissionAppData[0].children = res.data;
						this.getRoleInfo();
                    } else {
                        this.$message({message: res.message,type: 'warning'});
                    }
                });		
			},
			//获取角色的详情
			getRoleInfo(){
				// 获取角色信息
				this.$axios.post('/itsm/system/permission/role/queryRoleInfo',{roleId:this.editRoleDialog.id}).then((res) => {
                    if(res.status == 200){
                    	// 基本信息
						this.editRoleDialog.ruleForm.name = res.data.roleList.roleName;
						this.editRoleDialog.ruleForm.desc = res.data.roleList.description;

                        this.roleType = /[(App)]/g.test(res.data.roleList.roleName) ? 'app' : 'pc';

						// 权限设置
						var v = res.data.resourceList;	
						v = v.filter((item)=>{ return item.parentFlag == false;});		
						this.editRoleDialog.permissionIdList = v.map(v => v.id);
						this.$refs.permissionTree.setCheckedKeys(this.editRoleDialog.permissionIdList);
						this.$refs.permissionAppTree.setCheckedKeys(res.data.appResourceList.map(v => v.id));
						// 人员管理
						this.editRoleDialog.tableData = res.data.userList;
                    } else {
                        this.$message({message: res.message,type: 'warning'});
                    }
                });
			},
			// 遍历查找
			findParent(source, target, id) {
				const self = this;
				source.forEach(function(v,k){
					if(v.id == id){
						let parentResourceId = parseInt(v.parentResourceId)
						if(target.indexOf(parentResourceId) == -1 && parentResourceId != 0){
							target.push(parentResourceId);
						}
						return;
					}else{
						v.children&&self.findParent(v.children, target, id);
					}
				})
			},
			// 保存角色
			saveRole() {
				this.editRoleDialog.type == 'add' ? this.addNewRole() : this.editRole();
			},
			// 新增
			addNewRole(){
				var params = {
					roleName:this.editRoleDialog.ruleForm.name,
					description:this.editRoleDialog.ruleForm.desc
				}
				this.$refs['editRoleForm'].validate((valid) => {
					if(valid){
						this.$axios.post('/itsm/system/permission/role/addRole',params).then((res) => {
		                    if(res.status == 200){
		                    	this.$message({message: res.message,type:'success'});
		                    	this.editRoleDialog.show = false;
		                    	this.getRoleData();
		                    } else {
		                        this.$message({message: res.message,type:'error'});
		                    }
		                });
					}
				})
			},
			// 编辑编辑
			editRole(){
				// 权限树选中的id数组
				const self = this;
				
				this.editRoleDialog.permissionIdList = this.$refs.permissionTree.getCheckedKeys().concat(this.$refs.permissionAppTree.getCheckedKeys());

				for(let i = 0; i<this.editRoleDialog.permissionIdList.length; i++){
					self.findParent(self.editRoleDialog.permissionData[0].children, this.editRoleDialog.permissionIdList, this.editRoleDialog.permissionIdList[i]);
				}
				// 人员id数组
				var v = this.editRoleDialog.tableData;
				this.editRoleDialog.tableDataIdList = v.map(v => v.id);
				var params = {
					id:this.editRoleDialog.id,
					description:this.editRoleDialog.ruleForm.desc,
					resourceIds:this.editRoleDialog.permissionIdList.toString(),
					userIds:this.editRoleDialog.tableDataIdList.toString(),
				}
				
				this.$refs['editRoleForm'].validate((valid) => {
					if(valid){
						this.$axios.post('/itsm/system/permission/role/updateRole',params).then((res) => {
		                    if(res.status == 200){
		                    	this.$message({message: res.message,type:'success'});
		                    	this.editRoleDialog.show = false;
		                    	this.getRoleData();
		                    } else {
		                        this.$message({message: res.message,type:'error'});
		                    }
		                });
					}
				})
			},
			// 选择人员弹窗(多选)
			selectPersonCheckboxShow() {
				this.selectPersonCheckboxDialog.data = {
					type:'rolePerson',
					selected:this.editRoleDialog.tableData
				}
				this.selectPersonCheckboxDialog.show = true;
				
			},
			// 关闭选择人员弹窗回调
			selectPersonCheckboxHandler(data){
				this.editRoleDialog.tableData = data;
			},
			// 表格数据选择（新增编辑运维组中的人员信息）
			personSelectionChange(v){
				this.editRoleDialog.selected = v.map(v => v.id);
			},
			// 删除人员
			deletePerson(){
				const self = this;
				if(self.editRoleDialog.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				var d = self.editRoleDialog.tableData.filter((v) => {
	                    return !self.editRoleDialog.selected.includes(v.id);
			       })
		        self.editRoleDialog.tableData = d;
			},			
			// 切换tab
			changeView(item) {
				this.editRoleDialog.basicInfo = true ? item == "basicInfo" : false;
				this.editRoleDialog.permissionsSet = true ? item == "permissionsSet" : false;
				this.editRoleDialog.personManage = true ? item == "personManage" : false;
				this.editRoleDialog.currentView = item;
			},			
			// 关闭新增/编辑运维组弹窗
			closeEditRoleDialog() {				
				//tab重置
				this.editRoleDialog.currentView = "basicInfo";
				this.editRoleDialog.basicInfo = true;
				this.editRoleDialog.permissionsSet = false;
				this.editRoleDialog.personManage = false;
				//弹窗中数据清空
				this.editRoleDialog.id = '';
				this.editRoleDialog.permissionIdList = [];
				this.editRoleDialog.tableData = [];
				this.editRoleDialog.tableDataIdList = [];
				this.editRoleDialog.selected = [];
				this.editRoleDialog.type = '';
				this.editRoleDialog.ruleForm.name = '';
				this.editRoleDialog.ruleForm.desc = '';
				this.$refs['editRoleForm'].resetFields();
			},
			// node-expand
            nodeExpand(data,node,component) {
                this.editRoleDialog.defaultExpanded.push(data.id);
			},	
			// node-expand
            nodeAppExpand(data,node,component) {
                this.editRoleDialog.defaultAppExpanded.push(data.id);
            },	
		},
		filters: {

		},
		computed: {

		},
		watch: {

		}
	}
</script>

<style lang="less">
	.role .el-radio__label{
		display: none;
	}
</style>