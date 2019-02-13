<!--用户管理--运维组管理-->
<template>
	<div class="itsm-tabs-main maintenance-group">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form :inline="true" :model="maintenanceGroup.searchForm" class="search-conditions" label-width="110px">						
						<el-form-item label="名称：">
							<el-input placeholder="请输入名称" v-model="maintenanceGroup.searchForm.name"></el-input>
						</el-form-item>					
						<el-form-item label="组织：">
							<el-input placeholder="请选择组织" readonly v-model="maintenanceGroup.searchForm.organizationName" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectOrganizationShow(1)"></i>
						</el-form-item>					
						<el-form-item label="人员：" style="margin-right:0px">
							<el-input placeholder="请选择人员" readonly v-model="maintenanceGroup.searchForm.userName" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectPersonRadioShow"></i>
						</el-form-item>
						</el-row>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteMaintenance">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchCondition">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddEditMaintenanceDialog('add')">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="maintenanceGroup.tableData" @selection-change="handleSelectionChange" stripe style="width: 100%">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column label="编号" prop="groupCode" show-overflow-tooltip></el-table-column>
						<el-table-column label="名称" prop="groupName" show-overflow-tooltip></el-table-column>
						<el-table-column label="组长" prop="leaderName" show-overflow-tooltip></el-table-column>
						<el-table-column label="组织" prop="organizationName" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openAddEditMaintenanceDialog('edit',scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="maintenanceGroup.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="maintenanceGroup.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="maintenanceGroup.pagination.total">
					</el-pagination>
				</div>
			</div>
			<!--增加运维组-->
			<el-dialog :title='addEditMaintenanceDialog.title' width="776px" :close-on-click-modal='false' :visible="addEditMaintenanceDialog.show" v-if="addEditMaintenanceDialog.show" custom-class="add-maintenance" @close="closeAddEditMaintenanceDialog" v-drag>
				<div class="add-maintenance-content">
					<div class="dialog-tabs">
						<ul class="clearfix">
							<li :class="{active:addEditMaintenanceDialog.basicInfo}" @click="changeView('basicInfo')">
								<a href="javascript:;">基本信息</a>
							</li>
							<li :class="{active:addEditMaintenanceDialog.personInfo}" @click="changeView('personInfo')" id="personInfoTab">
								<a href="javascript:;">人员信息</a>
							</li>
						</ul>
					</div>
					<div class="dialog-tabs-content">
						<!--基本信息-->
						<div class="basic-info clearfix" v-show="addEditMaintenanceDialog.basicInfo">
							<div class="fl basic-info-left">
								<el-form ref="addEditMaintenanceForm" :model="addEditMaintenanceDialog.ruleForm" :rules="addEditMaintenanceDialog.rules" label-width="80px">
									<el-form-item label="编号：" prop="groupCode">
										<el-input v-model="addEditMaintenanceDialog.ruleForm.groupCode" :disabled="addEditMaintenanceDialog.type=='edit'" placeholder="请输入编号"></el-input>
									</el-form-item>
									<el-form-item label="名称：" prop="groupName">
										<el-input v-model="addEditMaintenanceDialog.ruleForm.groupName" placeholder="请输入名称"></el-input>
									</el-form-item>
									<el-form-item label="组织：" prop="organizationName">
										<el-input v-model="addEditMaintenanceDialog.ruleForm.organizationName" readonly placeholder="请选择组织" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="selectOrganizationShow()"></i>
									</el-form-item>
									<el-form-item label="描述：" prop="description">
										<el-input type="textarea" v-model="addEditMaintenanceDialog.ruleForm.description" placeholder="请输入描述"></el-input>
									</el-form-item>
								</el-form>
							</div>
							<div class="fl basic-info-right">
								<div class="tabs-panel-wrap border">
									<div class="panel-header">
										分类
									</div>
									<div class="panel-body">
										 <ies-scrollbar class="ies-scrollbar">
                    						<div v-changeTreeH>
												<el-tree :data="addEditMaintenanceDialog.categoryTreeData" :default-expanded-keys="[1]" show-checkbox node-key="id" :default-checked-keys="addEditMaintenanceDialog.defaultCheckKeys" :props="addEditMaintenanceDialog.defaultProps" :render-content="renderContent" ref="categoryTree"></el-tree>
                    						</div>
                    					</ies-scrollbar>
                    				</div>
								</div>
							</div>
						</div>
						<!--人员信息-->
						<div class="person-info" v-show="addEditMaintenanceDialog.personInfo" >
							<div style="padding:10px;height: 397px;">
								<div class="tabs-panel-wrap border"  v-if="addEditMaintenanceDialog.personInfo" v-autoHeight="tableHeight">
									<div class="panel-header">
										<div class="panel-header-left">
											<el-button type="normal" icon="el-icon-my-delete" @click="deletePerson">删除</el-button>
										</div>
										<div class="panel-header-right">
											<el-button type="normal" icon="el-icon-my-add" @click="selectPersonCheckboxShow">添加</el-button>
										</div>
									</div>
									<div class="panel-body">
										<el-table :data="addEditMaintenanceDialog.tableData" stripe :fit="true" @selection-change="personSelectionChange" style="width: 100%;" :max-height="tableHeight">
											<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
											<el-table-column label="登录ID" prop="loginName" show-overflow-tooltip></el-table-column>
											<el-table-column label="用户名" prop="userName" show-overflow-tooltip></el-table-column>
											<el-table-column label="组织" prop="organizationName" show-overflow-tooltip></el-table-column>
											<el-table-column label="操作" prop="operation">
												<template slot-scope="scope">
													<i class="el-icon-my-identity" :class="{leader:addEditMaintenanceDialog.leaderId == scope.row.id}" @click="setLeader(scope.row.id)" :title="addEditMaintenanceDialog.leaderId == scope.row.id ?'组长' : '设置组长'"></i>
												</template>
											</el-table-column>
										</el-table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div slot="footer" class="dialog-footer">
					<el-button type="normal" @click="saveAddEditMaintenanceDialog">确定</el-button>
				</div>
			</el-dialog>
		</div>
		
		<!-- 选择组织弹窗 -->
		<ies-organizationDialog v-model="selectOrganizationDialog.show" v-if="selectOrganizationDialog.show" @groupChooseHandler="organizationChooseHandler" :defaultSelect='selectOrganizationDialog.defaultSelectId'></ies-organizationDialog>
		
			
		<!--选择人员弹窗(搜索时候单选的)-->
		<ies-personRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-personRadioDialog>	
		
			
		<!--选择人员弹窗(搜索时候多选的)-->
		<ies-personCheckboxDialog v-model="selectPersonCheckboxDialog.show"  v-if="selectPersonCheckboxDialog.show" @selectPersonCheckboxHandler="selectPersonCheckboxHandler" :defaultSelect='selectPersonCheckboxDialog.data'></ies-personCheckboxDialog>	
	</div>
</template>

<script>
	
	export default {
		name:'maintenanceGroup',
		components: {

		},
		props: {

		},
		data() {
			let validator = this.$ies.validator;
			return {
				tableHeight:'',
				// 页面整体数据
				maintenanceGroup: {
					tableData: [],
					selected: [],
					searchForm: {
						name: '',
						organizationName: '',
						organizationId:'',
						userId: '',
						userName:''
					},
					searchConditions:{
						name: '',
						organizationId:'',
						userId: ''
					},
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				},
				// 选择组织弹窗    		
				selectOrganizationDialog: {
					show: false, 	// 弹窗的显示/隐藏
                    type:'',
                    defaultSelectId:''
				},
				// 选择人员弹窗（单选）
				selectPersonRadioDialog:{
					show:false,
					data:{
						type:'search',
						id:''
					}
				},
				// 选择人员弹窗（多选）
				selectPersonCheckboxDialog:{
					show:false,
					data:{}
				},
				// 增加编辑运维组
				addEditMaintenanceDialog: {
					show: false,
					basicInfo: true,
					personInfo: false,
					currentView: 'basicInfo',
					isToggled:false, //能否切换tab
					isType:'',// 是否需要刷新数据到第一页
					type:'',
					title:'',
					id:'',
					ruleForm: {
						groupCode:'',
						groupName:'',
						description:'',
						organizationId:'',
						organizationName:'',
						realOrganizationId:''
					},
					rules: {
						groupCode: [{validator:validator.space,trigger: 'blur',options:{max:6}},{required: true,message:'请输入编号',trigger: 'blur'},{ validator: validator.number, trigger: 'blur' }],
						groupName : [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message:'请输入名称',trigger: 'blur'},{ validator:validator.name,trigger: 'blur' }],
						organizationName: [{required: true,message: '请选择组织',trigger: 'change'}],
						description:[{validator:validator.space,trigger: 'blur',options:{max:200}}]
					},
					leaderId: '',
					selected: [], // 人员信息表中用户选中的要删除的数据id
					tableData: [],
					userIdList:[],
					categoryTreeData:[],
					categoryIdList:[],
					defaultProps: {
						children: 'children',
						label: 'categoryName'
					},
					defaultCheckKeys:[] // 分类树默认展开的id数组
				}
			};
		},
		mounted() {
			const self = this;
			self.$nextTick(function() {
				self.init();
			});
		},
		methods: {
			// 初始化
			init(){	
				this.getMaintenanceGroupTableData();
			},
			//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
			/********************************运维组分页查询********************************************/
			// 获取表格数据
			getMaintenanceGroupTableData() {
				var params = {
					groupName:this.maintenanceGroup.searchConditions.name,
					organizationId:this.maintenanceGroup.searchConditions.organizationId,
					userId:this.maintenanceGroup.searchConditions.userId,
					pageNum:this.maintenanceGroup.pagination.currentPage,
					pageSize :this.maintenanceGroup.pagination.pageSize
				}
				this.$axios.post('/itsm/system/permission/operationGroup/query',params).then((res) => {
                    if(res.status==200){
                        this.maintenanceGroup.tableData = res.data.list;
                        this.maintenanceGroup.pagination.total = res.data.total;
                    }else{
                        this.$message(res.message);
                    }
                });				
			},
			// sizeChange事件
			handleSizeChange(size) {
				this.maintenanceGroup.pagination.pageSize = size;
                this.getMaintenanceGroupTableData();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.maintenanceGroup.pagination.currentPage = currentPage;
                this.getMaintenanceGroupTableData();
			},
			// 选择表格数据
			handleSelectionChange(v) {
				this.maintenanceGroup.selected = v.map(v => v.id);
			},
			// 点击查询
			search() {
				this.maintenanceGroup.searchConditions.name = this.maintenanceGroup.searchForm.name;
				this.maintenanceGroup.searchConditions.organizationId = this.maintenanceGroup.searchForm.organizationId;
				this.maintenanceGroup.searchConditions.userId = this.maintenanceGroup.searchForm.userId;
				this.maintenanceGroup.pagination.currentPage = 1;
				this.getMaintenanceGroupTableData();
			},
			// 重置
			resetSearchCondition() {
				this.maintenanceGroup.searchForm.name = "";
				this.maintenanceGroup.searchForm.organizationId = "";
				this.maintenanceGroup.searchForm.userId = "";
				this.maintenanceGroup.searchConditions.name = "";
				this.maintenanceGroup.searchForm.organizationName = "";
				this.maintenanceGroup.searchForm.userName = "";
				this.selectPersonRadioDialog.data = {};
			},
			/********************************删除运维组********************************************/
			// 删除运维组
			deleteMaintenance() {
				const self = this;
				if (self.maintenanceGroup.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/itsm/system/permission/operationGroup/batchDelete',{groupIdList:self.maintenanceGroup.selected.toString()}).then((res) => {
	                    if (res.status==200) {
	                       self.$message({type: 'success',message:res.message});
	                       self.getMaintenanceGroupTableData();
	                    } else {
	                       self.$message({type: 'error',message:res.message}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
				});
			},
			/********************************新增、编辑运维组********************************************/
			// 打开新增/编辑运维组弹窗
			openAddEditMaintenanceDialog(type,id) {
				const self = this;			
				self.addEditMaintenanceDialog.show = true;
				self.addEditMaintenanceDialog.ruleForm = {
						groupCode:'',
						groupName:'',
						description:'',
						organizationId:'',
						organizationName:'',
						realOrganizationId:''
				},
				self.addEditMaintenanceDialog.currentView = "basicInfo";
				self.addEditMaintenanceDialog.basicInfo = true;
				self.addEditMaintenanceDialog.personInfo = false;
				self.addEditMaintenanceDialog.id = id;
				self.addEditMaintenanceDialog.type = type;
				self.addEditMaintenanceDialog.title = type == 'add' ? '新增运维组' : '编辑运维组'
				self.addEditMaintenanceDialog.tableData = type == 'add' ? [] :self.addEditMaintenanceDialog.tableData;
				self.addEditMaintenanceDialog.defaultCheckKeys = type == 'add' ? [] :self.addEditMaintenanceDialog.defaultCheckKeys;
				self.addEditMaintenanceDialog.isToggled = type == 'add' ? false :true;
				self.addEditMaintenanceDialog.isType = type == 'add' ? 'add' : 'edit';
				self.addEditMaintenanceDialog.ruleForm.organizationId = '';       // 清空组织树默认值
				self.selectOrganizationDialog.type = 2;
				//获取分类树数据
				self.getCategoryTreeData();
				if (type == 'edit') {
//					console.log("打开弹窗时候组长是"+self.addEditMaintenanceDialog.leaderId);
					self.editMaintenanceData();
					self.selectOrganizationDialog.type = 3;
				}
			},
			// 运维组详情回显
			editMaintenanceData() {
				const self = this;
				//回显基本信息
				self.$axios.post('/itsm/system/permission/operationGroup/detail',{id:this.addEditMaintenanceDialog.id}).then((res) => {
                    if (res.status == 200) {
                       self.addEditMaintenanceDialog.ruleForm.groupCode = res.data.basic.groupCode;
                       self.addEditMaintenanceDialog.ruleForm.groupName = res.data.basic.groupName;
                       self.addEditMaintenanceDialog.ruleForm.organizationId = res.data.basic.organizationId;
                       self.addEditMaintenanceDialog.ruleForm.realOrganizationId = res.data.basic.organizationId;//接口返回的组织id,而不是页面上用户选择的，防止用户选择完组织没有提交，就去选择人员
                       self.addEditMaintenanceDialog.ruleForm.description = res.data.basic.description;
                       self.addEditMaintenanceDialog.ruleForm.organizationName = res.data.basic.organizationName;
                       if (res.data.basic.category) { //获取分类
                       	   self.$refs.categoryTree.setCheckedKeys(res.data.basic.category.split(","));
                       } 
                       //获取人员信息
                       self.addEditMaintenanceDialog.tableData = res.data.users;//获取人员信息
                       self.addEditMaintenanceDialog.leaderId = "";//清空组长
                       self.addEditMaintenanceDialog.tableData.forEach(function(val, index) {
							if (val.isLeader == 1) {
                       			self.addEditMaintenanceDialog.leaderId =  val.id;  //获取队长id
                       	  }							
						});
//						console.log(self.addEditMaintenanceDialog.leaderId);
                    } else {
                        self.$message(res.message);
                    }
            	});
			},
			// 新增运维组
			addMaintenance() {
				//分类树选中的id数组
				this.addEditMaintenanceDialog.categoryIdList = this.$refs.categoryTree.getCheckedKeys(true);
				var params = {
					groupCode:this.addEditMaintenanceDialog.ruleForm.groupCode,
					groupName:this.addEditMaintenanceDialog.ruleForm.groupName,
					organizationId:this.addEditMaintenanceDialog.ruleForm.organizationId,
					description:this.addEditMaintenanceDialog.ruleForm.description,
					category:this.addEditMaintenanceDialog.categoryIdList.toString(),
				}
				this.$axios.post('/itsm/system/permission/operationGroup/add',params).then((res) => {
                    if (res.status == 200) {
                       this.$message({message:res.message,type:'success'});
                       this.addEditMaintenanceDialog.isToggled = true;
                       $("#personInfoTab").click();
                       this.addEditMaintenanceDialog.type = 'edit';
						//新增的时候接口返回一个新增的运维组id
					   this.addEditMaintenanceDialog.id = res.data.groupId;
					   this.editMaintenanceData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
                });
			},
			// 编辑运维组
			editMaintenance() {
				//分类树选中的id数组
				this.addEditMaintenanceDialog.categoryIdList = this.$refs.categoryTree.getCheckedKeys(true);
				var params = {
					id:this.addEditMaintenanceDialog.id,
					groupCode:this.addEditMaintenanceDialog.ruleForm.groupCode,
					groupName:this.addEditMaintenanceDialog.ruleForm.groupName,
					organizationId:this.addEditMaintenanceDialog.ruleForm.organizationId,
					description:this.addEditMaintenanceDialog.ruleForm.description,
					category:this.addEditMaintenanceDialog.categoryIdList.toString(),
				}
				this.$axios.post('/itsm/system/permission/operationGroup/update',params).then((res) => {
                    if(res.status == 200){
                       this.$message({message:res.message,type:'success'});                       
                       if (this.addEditMaintenanceDialog.basicInfo) {
                       		$("#personInfoTab").click();
                       		this.editMaintenanceData();
                       } else {
                       	 	this.addEditMaintenanceDialog.show = false;
                       	 	if(this.addEditMaintenanceDialog.isType == 'add'){
                       	 		this.maintenanceGroup.pagination.currentPage = 1;
                       	 	}
                       		this.getMaintenanceGroupTableData();
                       } 
                    }else{
                        this.$message({message:res.message,type:'error'});
                    }
                });
			},
			// 删除人员（新增编辑运维组中的人员信息）
			deletePerson() {
				const self = this;
				if(self.addEditMaintenanceDialog.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					var params = {
						groupId:self.addEditMaintenanceDialog.id,
						userIdList:self.addEditMaintenanceDialog.selected.toString()
					}
					self.$axios.post('/itsm/system/permission/operationGroup/batchDeleteGroupUserRel',params).then((res) => {
	                    if(res.status == 200){
	                       self.$message({message:res.message,type:'success'});
	                       self.editMaintenanceData();
//	                       self.addEditMaintenanceDialog.leaderId = "";
	                    }else if(res.status == 400){
	                        self.$message({message:"该运维组编号或者运维组名称已被使用",type:'error'});
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
				});
			},
			// 表格数据选择（新增编辑运维组中的人员信息）
			personSelectionChange(v) {
				this.addEditMaintenanceDialog.selected = v.map(v => v.id);
			},
			// 设置组长
			setLeader(data) {
//				this.addEditMaintenanceDialog.leaderId = data;
				var params = {
//                  	userId:this.addEditMaintenanceDialog.leaderId,
                    	userId:data,
                    	groupId:this.addEditMaintenanceDialog.id
                }
				this.$axios.post('/itsm/system/permission/operationGroup/addGroupLeader',params).then((res) => {
                    if (res.status==200) {
                       this.$message({message:res.message,type:'success'});
                       this.editMaintenanceData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
                });
			},
			// 保存运维组
			saveAddEditMaintenanceDialog() {
				const self = this;
//				console.log(self.addEditMaintenanceDialog.type);
				self.$refs['addEditMaintenanceForm'].validate((valid) => {
					if(valid){						
						self.addEditMaintenanceDialog.type == 'add' ? self.addMaintenance() : self.editMaintenance();
					} else {
						if(self.addEditMaintenanceDialog.currentView == 'personInfo'){
							this.$message({message:'请完善基本信息',type:'warning'});
						}
					}
				})
			},
			// 关闭新增/编辑运维组弹窗
			closeAddEditMaintenanceDialog() {
//				console.log("关闭弹窗");
				if(this.addEditMaintenanceDialog.isType == 'add' && this.addEditMaintenanceDialog.type == 'edit'){
           	 		this.maintenanceGroup.pagination.currentPage = 1;
           	 	}
           		this.getMaintenanceGroupTableData();
				this.addEditMaintenanceDialog.show = false;				
				this.addEditMaintenanceDialog.leaderId = "";
				this.addEditMaintenanceDialog.id = "";// 清空当前运维组的id
				this.addEditMaintenanceDialog.selected = [];
				this.addEditMaintenanceDialog.tableData = [];
				this.addEditMaintenanceDialog.userIdList = [];
				this.addEditMaintenanceDialog.categoryTreeData = [];
				this.addEditMaintenanceDialog.categoryIdList = [];
				this.addEditMaintenanceDialog.defaultCheckKeys = [];
                this.addEditMaintenanceDialog.ruleForm.realOrganizationId = "";
                this.addEditMaintenanceDialog.ruleForm.organizationId = "";
			},
			/********************************选择组织弹窗********************************************/
			// 选择组织弹窗
			selectOrganizationShow(v) {
				const self = this;
				
				if(v){
				  self.selectOrganizationDialog.type = v;	
				}
				console.log('状态:'+self.selectOrganizationDialog.type)
				// 查询
				if( self.selectOrganizationDialog.type == 1 ){
					self.selectOrganizationDialog.defaultSelectId = {
						organizationId:self.maintenanceGroup.searchForm.organizationId,
						type:'search'
					}
						
				}
				// 新增
				if( self.selectOrganizationDialog.type == 2 ){
					self.selectOrganizationDialog.defaultSelectId = {
						organizationId:self.addEditMaintenanceDialog.ruleForm.organizationId
					}
				}
				// 编辑
				if( self.selectOrganizationDialog.type == 3 ){
					self.selectOrganizationDialog.defaultSelectId = {
						organizationId:self.addEditMaintenanceDialog.ruleForm.organizationId
					}
				}
//				console.log(self.selectOrganizationDialog.defaultSelectId);
				this.$nextTick( ()=>{
					self.selectOrganizationDialog.show = true;
				});
				//v == 1 && (self.addEditMaintenanceDialog.ruleForm.organizationId = ''); // 清空组织树默认勾选
			},
			// 关闭组织弹窗回调
			organizationChooseHandler(v) {
	            const self = this;
				console.log("传过来" + v.id + v.organizationName);
				// 1：搜索区域的组织
				if (self.selectOrganizationDialog.type == 1) {
					self.maintenanceGroup.searchForm.organizationId = v.id;
					self.maintenanceGroup.searchForm.organizationName = v.organizationName;
				}

				// 2：新增和编辑弹框内的组织
				if (self.selectOrganizationDialog.type == 2 || self.selectOrganizationDialog.type == 3) {
					self.addEditMaintenanceDialog.ruleForm.organizationId = v.id;
					self.addEditMaintenanceDialog.ruleForm.organizationName = v.organizationName;
				}
        	},
        	/********************************选择人员弹窗（单选）********************************************/
			// 选择人员弹窗(单选)
			selectPersonRadioShow() {
				this.selectPersonRadioDialog.show = true;
				 this.selectPersonRadioDialog.data = {
				 	type:'search',
				 	id:this.maintenanceGroup.searchForm.userId
				 }
			},
			// 关闭选择人员弹窗(单选)回调
			selectPersonRadioHandler(data) {
				if (data) {
					var data = JSON.parse(data);
					this.maintenanceGroup.searchForm.userName = data.userName;
	                this.maintenanceGroup.searchForm.userId = data.id;
//	                this.selectPersonRadioDialog.data.id = data.id;
				}
			},
			/********************************选择人员弹窗（多选）********************************************/
			// 选择人员弹窗(多选)
			selectPersonCheckboxShow() {
				this.selectPersonCheckboxDialog.show = true;
				//获取新增人员信息的id数组
				this.selectPersonCheckboxDialog.data = {
					type:'maintenance',//说明这里是运维组关联的人员
					organizationId:this.addEditMaintenanceDialog.ruleForm.realOrganizationId,//组织id
					groupId:this.addEditMaintenanceDialog.id,  //运维组id
				}
			},
			// 关闭选择人员弹窗(多选)回调
			selectPersonCheckboxHandler(data) {
//				console.log('关闭选择人员弹窗(多选)回调' +data);
				if (data) {					
					var oldData = this.addEditMaintenanceDialog.tableData;
                    var newData = data;
                    var nowData = oldData.concat();
                    var oldDataList = oldData.map(oldData => oldData.id);
                    for(var i = 0;i < newData.length;i ++) {  
                    	if(oldDataList.indexOf(newData[i].id) === -1){
                    		nowData.push(newData[i]);
                    	} 
				    } 
//				    console.log(JSON.stringify(oldData));
//				    console.log(JSON.stringify(newData));
//                  console.log(JSON.stringify(nowData));
                    this.addEditMaintenanceDialog.userIdList = nowData.map(nowData => nowData.id);
                    var params = {
                    	userIds:this.addEditMaintenanceDialog.userIdList.toString(),
                    	groupId:this.addEditMaintenanceDialog.id
                    }
				
                    this.$axios.post('/itsm/system/permission/operationGroup/addGroupUserRel',params).then((res) => {
	                    if (res.status==200) {
	                       this.$message({message:res.message,type:'success'});
	                       this.editMaintenanceData();
	                    } else {
	                        this.$message({message:res.message,type:'error'});
	                    }
	                });	
	            }
			},			
			// 重置表单
			reset(ref) {
				this.$refs[ref].resetFields();
			},
			// 切换tab
			changeView(item) {
				if(!this.addEditMaintenanceDialog.isToggled && this.addEditMaintenanceDialog.type == 'add'){
					return;
				}
				this.addEditMaintenanceDialog.personInfo = true ? item == "personInfo" : false;
				this.addEditMaintenanceDialog.basicInfo = true ? item == "basicInfo" : false;
				this.addEditMaintenanceDialog.currentView = item;
			},
			// 获取分类树数据
			getCategoryTreeData() {
				this.$axios.post('/itsm/system/config/category/queryOpenCategoryAll').then((res) => {
                    if (res.status==200) {
                       this.addEditMaintenanceDialog.categoryTreeData = res.data.top;
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
                });
			},
			// 渲染分类树数据
			renderContent(h, { node, data, store }) {
				return h('span', [
					h('i', {
							style: {
								color: '#ff9a32',
								'margin-right': '5px'
							},
							class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
						}),
					h('span', node.label)
				]); 
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

</style>