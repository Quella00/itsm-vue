<!--用户管理--人员管理-->
<template>
	<div class="itsm-tabs-main person">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>

				<div class="panel-body" style="min-height: 150px;">
					<el-form :inline="true" :model="configPerson.params" ref="searchForm" class="search-conditions" label-width="110px">
						<el-form-item label="工号：" prop="userCode">
							<el-input placeholder="请输入工号" v-model="configPerson.params.userCode"></el-input>
						</el-form-item>

						<el-form-item label="姓名：" prop="userName">
							<el-input placeholder="请输入姓名" v-model="configPerson.params.userName"></el-input>
						</el-form-item>

						<el-form-item label="组织：" prop="organizationName">
							<el-input placeholder="请选择组织" v-model="configPerson.organizationName" readonly></el-input>
							<i class="el-icon-my-more" @click="openOrganizationShow(1)"></i>
						</el-form-item>

						<el-form-item label="在职状态：" prop="availableStatus">
							<el-select v-model="configPerson.params.availableStatus" @focus="selectOnFocus">
								<el-option v-for="item in configPerson.jobStateData" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="账号状态：" prop="accountStatus">
							<el-select v-model="configPerson.params.accountStatus" @focus="selectOnFocus">
								<el-option v-for="item in configPerson.accountStateData" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-import" @click="openUploadDialog">导入</el-button>
						<el-button type="normal" icon="el-icon-my-download" @click="downTemplate" style="width:135px;">下载导入模板</el-button>
						<el-button type="normal" icon="el-icon-my-export" @click="exportUser">导出</el-button>
						<el-button type="normal" icon="el-icon-my-delete" @click="tableDelete">删除</el-button>
					</div>

					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchForm">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="tableSearch">查询</el-button>
						<!--<el-button type="normal" icon="el-icon-my-refresh" @click="refreshTable">刷新</el-button>-->
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddEditPersonDialog()">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="configPerson.data" @selection-change="tableSelectionChange" stripe>
						<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>

						<el-table-column label="工号" prop="userCode" show-overflow-tooltip></el-table-column>

						<el-table-column label="姓名" prop="userName" show-overflow-tooltip></el-table-column>

						<el-table-column label="登录ID" prop="loginName" show-overflow-tooltip></el-table-column>

						<el-table-column label="组织" prop="organizationName" show-overflow-tooltip></el-table-column>

						<el-table-column label="性别" prop="sex">
							<template slot-scope="scope">
								<span>{{ scope.row.sex == 0 ? '男' : '女' }}</span>
							</template>
						</el-table-column>

						<el-table-column label="在职状态" prop="availableStatus">
							<template slot-scope="scope">
								<span>{{ scope.row.availableStatus == 0 ? '在职' : '离职' }}</span>
							</template>
						</el-table-column>

						<el-table-column label="账号状态" prop="accountStatus">
							<template slot-scope="scope">
								<span>{{ scope.row.accountStatus == 0 ? '启用' : '禁用' }}</span>
							</template>
						</el-table-column>

						<el-table-column label="手机号" prop="mobile" show-overflow-tooltip></el-table-column>

						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openAddEditPersonDialog(scope.row)"></i>
								<i class="el-icon-my-reset-password" @click="resetPassword(scope.row)" title="重置密码"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>

				<div class="panel-footer">
					<el-pagination @size-change="tableSizeChange" @current-change="tableCurrentChange" :current-page="configPerson.params.pageNum" :page-size="configPerson.params.pageSize" :page-sizes="configPerson.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configPerson.total"></el-pagination>
				</div>
			</div>

			<!--增加、编辑角色弹窗-->
			<el-dialog :title="addEditPersonDialog.title" width="776px" :visible="addEditPersonDialog.show" v-if="addEditPersonDialog.show" custom-class="addEditPerson" :close-on-click-modal="false" @close="closeAddEditPersonDialog" v-drag>
				<div class="add-edit-person-content">
					<div class="dialog-tabs">
						<ul class="clearfix">
							<li :class="{active:addEditPersonDialog.basicInfo}" @click="changeView('basicInfo')">
								<a href="javascript:;">基本信息</a>
							</li>

							<li :class="{active:addEditPersonDialog.role}" @click="changeView('role')">
								<a href="javascript:;">角色</a>
							</li>

							<li :class="{active:addEditPersonDialog.skill}" @click="changeView('skill')">
								<a href="javascript:;">技能</a>
							</li>
						</ul>
					</div>
					<div class="dialog-tabs-content">
						<!--基本信息-->
						<div class="basic-info" v-show="addEditPersonDialog.basicInfo">
							<el-form :inline="true" ref="addEditForm" :model="addEditPersonDialog.ruleForm" :rules="addEditPersonDialog.rules" label-width="120px" class="basic-info-form">
								<el-form-item label="姓名：" prop="userName">
									<el-input placeholder="请输入姓名" v-model="addEditPersonDialog.ruleForm.userName"></el-input>
								</el-form-item>

								<el-form-item label="登录ID：" prop="loginName">
									<el-input placeholder="请输入登录ID" v-model="addEditPersonDialog.ruleForm.loginName" :disabled="addEditPersonDialog.userID ? true : false"></el-input>
								</el-form-item>

								<el-form-item label="工号：" prop="userCode">
									<el-input placeholder="请输入工号" v-model="addEditPersonDialog.ruleForm.userCode"></el-input>
								</el-form-item>

								<el-form-item label="职位：" prop="position">
									<el-select v-model="addEditPersonDialog.ruleForm.position" @focus="selectOnFocus">
										<el-option v-for="item in addEditPersonDialog.positionData" :key="item.value" :label="item.label" :value="item.value"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="组织：" prop="organizationName">
									<el-input placeholder="请选择组织" v-model="addEditPersonDialog.ruleForm.organizationName" readonly></el-input>
									<i class="el-icon-my-more" @click="openOrganizationShow()"></i>
								</el-form-item>

								<el-form-item label="区域：" prop="areaName">
									<el-input placeholder="请选择区域" v-model="addEditPersonDialog.ruleForm.areaName" readonly></el-input>
									<i class="el-icon-my-more" @click="openAreaDialog"></i>
								</el-form-item>

								<el-form-item label="手机：" prop="mobile">
									<el-input placeholder="请输入手机" v-model="addEditPersonDialog.ruleForm.mobile"></el-input>
								</el-form-item>

								<el-form-item label="联系电话：" prop="phone">
									<el-input placeholder="请输入联系电话" v-model="addEditPersonDialog.ruleForm.phone"></el-input>
								</el-form-item>

								<el-form-item label="电子邮件：" prop="email">
									<el-input placeholder="请输入电子邮件" v-model="addEditPersonDialog.ruleForm.email"></el-input>
								</el-form-item>

								<el-form-item label="性别：" prop="sex">
									<el-radio v-model="addEditPersonDialog.ruleForm.sex" label="0">男</el-radio>
									<el-radio v-model="addEditPersonDialog.ruleForm.sex" label="1">女</el-radio>
								</el-form-item>

								<el-form-item label="账号状态：" prop="accountStatus">
									<el-radio v-model="addEditPersonDialog.ruleForm.accountStatus" label="0">启用</el-radio>
									<el-radio v-model="addEditPersonDialog.ruleForm.accountStatus" label="1">禁用</el-radio>
								</el-form-item>

								<el-form-item label="在职状态：" prop="availableStatus">
									<el-radio v-model="addEditPersonDialog.ruleForm.availableStatus" label="0">在职</el-radio>
									<el-radio v-model="addEditPersonDialog.ruleForm.availableStatus" label="1">离职</el-radio>
								</el-form-item>

								<el-form-item label="描述：" prop="description">
									<el-input type="textarea" placeholder="请输入描述" v-model="addEditPersonDialog.ruleForm.description"></el-input>
								</el-form-item>
							</el-form>
						</div>

						<!--角色-->
						<div class="role" v-show="addEditPersonDialog.role" style="height: 476px">
							<div class="tabs-panel-wrap border">
								<div class="panel-body">
									<el-table ref="roleTable" :data="addEditPersonDialog.configRole.data" @selection-change="roleSelectionChange" stripe>
										<el-table-column type="selection" align="center"></el-table-column>
										<el-table-column label="角色" prop="roleName" show-overflow-tooltip></el-table-column>
										<el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
									</el-table>
								</div>

								<!-- <div class="panel-footer"> 产品说角色列表不需要分页
									<el-pagination @size-change="roleSizeChange" @current-change="roleCurrentChange" :current-page="addEditPersonDialog.configRole.params.pageNum" :page-sizes="addEditPersonDialog.configRole.pageSizes" :page-size="addEditPersonDialog.configRole.params.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="addEditPersonDialog.configRole.total"></el-pagination>
								</div> -->
								
							</div>
						</div>

						<!--人员信息-->
						<div class="skill" v-show="addEditPersonDialog.skill">
							<el-checkbox-group v-model="addEditPersonDialog.configSkill.selected">
								<el-checkbox v-for="item in addEditPersonDialog.configSkill.data" :title="item.skillName" :label="item.id" :key="item.id">{{ item.skillName }}</el-checkbox>
							</el-checkbox-group>
						</div>
					</div>
				</div>

				<div slot="footer" class="dialog-footer">
					<el-button type="normal" @click="submitForm">保存</el-button>
				</div>
			</el-dialog>

			<!-- 组织弹窗 -->
			<ies-organization-dialog v-model="configOrganizationDialog.show" v-if="configOrganizationDialog.show" :default-select="configOrganizationDialog.defaultSelectId" @groupChooseHandler="organizationHandler"></ies-organization-dialog>

			<!-- 区域弹窗 -->
			<ies-area-dialog v-model="configAreaDialog.show"  v-if="configAreaDialog.show" :default-select="addEditPersonDialog.ruleForm.areaId" @areaChooseHandler="areaHandler"></ies-area-dialog>

			<!-- 导入弹窗 -->
			<!--<template v-if="uploadDialog.show">-->
			<el-dialog title="导入" :visible.sync="uploadDialog.show" width="414px" custom-class="upload" :close-on-click-modal="false" @close="closeDialog" v-drag>
				<div class="upload-content">
					<div class="upload-container">
						<div class="input-box">
							<span>上传文件：</span>
							<el-input style="display: inline-block;" name="file" v-model="configUpload.fileName" placeholder="请选择上传的文件" readonly></el-input>
						</div>

						<!-- <form id="form1" method="post" :action="configPerson.urlImport" enctype="multipart/form-data" target="framFile">
						    <input id="file" type="file" name="upFile">
							<input type="submit" value="上传"/>
						</form>
						<iframe id="framFile" name="framFile" style="display:none;"></iframe> -->
						
						<el-upload ref="upload" :headers='{Token: token}' :action="configPerson.urlImport" :on-change="handleChange" :on-success="onSuccess" :on-error="onError" :before-upload="beforeupload" :show-file-list="false" :auto-upload="false" :multiple="false" class="upload-btn">
							<el-button slot="trigger" type="normal" @click="closeMessage">选取文件</el-button>
						</el-upload>
					</div>
				</div>

				<div slot="footer">
					<el-button type="normal" @click="submitUpload">确定</el-button>
				</div>
			</el-dialog>
			<!--</template>-->
		</div>
	</div>
</template>

<script>
	export default {
		name:'person',
		data() {
			let validator = this.$ies.validator;
			return {
				// 导入
				configUpload: {
					fileName: ''
				},
				tableMaxHeight1: '',
				// 页面整体数据
				configPerson: {
					url: '/itsm/system/sso/user/queryUserPageByCondition',    // 用户列表
					urlDown: `/api/itsm/system/sso/user/downloadExcelUser`,        // 下载导入模板（// AJAX 请求会统一加IP地址，这里不是 AJAX 请求，所以手动写上地址）
					
					urlImport: `/api/itsm/system/sso/user/importExcelUser`,         // 导入（// AJAX 请求会统一加IP地址，这里不是 AJAX 请求，所以手动写上地址）
//					urlImport: 'http://192.168.3.32:9103/itsm/system/sso/user/importExcelUser',
					//urlImport: 'http://192.168.2.226:8899/itsm/system/sso/user/importExcelUser',
					
					//urlImport: 'http://192.168.2.226:8899/itsm/servicelevel/uc/importUcByExcel',
					
					urlExport: `/api/itsm/system/sso/user/exportExcelUser`,      // 导出（// AJAX 请求会统一加IP地址，这里不是 AJAX 请求，所以手动写上地址）
//					urlExport: 'http://192.168.3.32:9103/itsm/system/sso/user/exportExcelUser',
					urlDel: '/itsm/system/sso/user/deleteUser',               // 删除用户
					urlReset: '/itsm/system/sso/user/updateUserPassword',     // 重置密码
					data: [],
					selected: [],
					total: 0,
					searchState: false,    // 记录查询状态 
					pageSizes: [10, 20, 30, 40],
					organizationName: '',
					params: {
                        pageNum: 1,            // 当前页
						pageSize: 10,          // 每页数量
						userCode: '',          // 工号
						userName: '',          // 姓名
						organizationId: '',    // 组织 ID
						accountStatus: '',     // 账号状态 [ 0：开启 - 1：关闭 ]
						availableStatus: ''    // 在职状态 [ 0：在职 - 1：离职 ]
					},
					jobStateData: [
						{ value: '', label: '全部' }, 
						{ value: 0, label: '在职' }, 
						{ value: 1, label: '离职' }
					],	
					accountStateData: [
						{ value: '', label: '全部' }, 
						{ value: 0, label: '启用' }, 
						{ value: 1, label: '禁用' }
					]
				},
				// 组织弹框配置
				configOrganizationDialog: {
					show: false,    // 显示 / 隐藏
					position: '',   // 弹窗位置（PS：当一个页面有多个地方用到同一个组件时，因为组件回调只有一个所以要记录组件调用者的特征码以便把回调参数正确的赋值给调用者）
					defaultSelectId: ''
				},
				// 区域弹框配置
				configAreaDialog: {
					show: false     // 显示 / 隐藏
				},
				// 增加编辑角色弹窗
				addEditPersonDialog: {
					urlSave: '/itsm/system/sso/user/saveUser',
					urlEdit: '/itsm/system/sso/user/updateUser',
					//urlEdit: 'http://192.168.3.32:9100/itsm/system/sso/user/updateUser',
					userID: '',  // 编辑时候用户的ID
					show: false,
					basicInfo: true,
					role: false,
					skill: false,
					currentView: 'basicInfo',
					ruleForm: {
						// 基本信息
						userName: '',            // 姓名
						loginName: '',           // 登录 ID
						userCode: '',            // 工号
						position: '',            // 职位
						organizationId: '',      // 组织 ID
						organizationName: '',    // 组织名称
						areaId: '',              // 区域 ID
						areaName: '',            // 区域名称
						mobile: '',              // 手机
						phone: '',               // 联系电话
						email: '',               // 邮箱
						sex: '0',                // 性别 [ 0：男 - 1：女 ]
						accountStatus: '0',      // 账号状态 [ 0：开启 - 1：关闭 ]
						availableStatus: '0',    // 在职状态 [ 0：在职 - 1：离职 ]
						description: ''          // 描述
					},
					rules: {
						userName: [
							{ validator:validator.space, trigger:'blur, change', options:{max:32} },
							{ required: true, message: '请输入姓名', trigger: 'blur' },
							{ validator:validator.name,trigger:'blur' }
						],
						loginName: [
							{ validator:validator.space, trigger: 'blur', options:{max:20} },
							{ required: true, message: '请输入登录ID', trigger: 'blur' },
							{ validator:validator.numLetter, trigger: 'blur'}
						],
						userCode: [
							{ validator:validator.space, trigger: 'blur', options:{max:16}},
							{ required: true, message: '请输入工号', trigger: 'blur' },
							{ validator:validator.num, trigger: 'blur'}
						],
						position: [
							{ required: true, message: '请选择职位', trigger: 'change' }
						],
						organizationName: [
							{ required: true, message: '请选择组织', trigger: 'change' }
						],
						areaName: [
							{ required: true, message: '请选择区域', trigger: 'change' }
						],
						mobile: [
							{ validator:validator.space, trigger: 'blur' },
							{ required: true, message: '请输入手机', trigger: 'blur' },
							{ validator:validator.mobile, trigger: 'blur' }
						],
						phone: [
							{ validator:validator.space, trigger: 'blur', options: {max:20} },
						],
						email:[
							{ validator:validator.space, trigger: 'blur', options:{max:32} },
							{ required: true, message: '请输入电子邮件', trigger: 'blur' },
							{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
						],
						description:[
							{validator:validator.space, trigger: 'blur', options:{max:200} },
						]

					},
					positionData: [
						{ value: '普通职员', label: '普通职员' },
						{ value: '中层', label: '中层' },
						{ value: '部门经理', label: '部门经理' },
						{ value: '管理层', label: '管理层' }
					],
					configRole: {
						url: '/itsm/system/permission/role/queryRoleByPage',
						data: [],
						selected: [],
						selectedDefault: []
						/* 产品说角色列表不需要分页（怕以后该功能激活，所以先保留在此）
						total: 0,
						pageSizes: [2, 4, 6, 8]
						params: {
							pageNum: 1,
							pageSize: 10,
						}
						*/
					},
					configSkill: {
						url: '/itsm/system/permission/skill/querySkillAll',
//						url: 'http://192.168.3.32:9101/itsm/system/permission/skill/querySkillAll',
						data: [],
						selected: [],
						total: 0,
						pageSizes: [2, 4, 6, 8],
						params: {
							pageNum: 1,
							pageSize: 1000,           // 每页数量
						}
					}
				},
				// 导入弹窗
				uploadDialog: {
					show: false,
					loading: null,
					fileList: [],
					message:'',// 导入的错误提示信息
				},
			};
		},
		mounted() {
			this.$nextTick(this.getList);
		},
		methods: {
			// 列表 - 获取列表数据
			getList() {
				const self = this;

                let params = {
					pageNum: self.configPerson.params.pageNum,
					pageSize: self.configPerson.params.pageSize
				}

				if(self.configPerson.searchState){
					params = self.configPerson.params;
				}
				
				self.$axios.post(self.configPerson.url, params).then(res => {
					// console.log('查询列表数据：' + JSON.stringify(res));
					if(res.status == 200){
						self.configPerson.data = res.data.list;
						self.configPerson.total = res.data.total;
					}else{
						self.$message({ type: 'error', message: res.message });
					}
				});
			},
			// 列表 - 选中的数据
			tableSelectionChange(v) {
                const self = this;

                self.configPerson.selected = v.map(v => v.id);
			},
			// 列表 - 删除数据
			tableDelete() {
                const self = this;

				if(!self.configPerson.selected.length){
					self.$message({ type: 'warning', message: '至少选择一条数据' });
					return;
				}

				self.$confirm('请确认是否要删除该信息?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					self.$axios.post(self.configPerson.urlDel, {
						userIds: self.configPerson.selected.join()
					}).then((res) => {
						//self.configPerson.params.pageNum = 1;
						self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
						self.getList();
						// console.log(JSON.stringify(res));
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消删除' });          
				});
			},
			// 列表 - 查询
			tableSearch() {
				const self = this;
				
				self.configPerson.searchState = true;    // 记录查询状态 
				self.configPerson.params.pageNum = 1;
				self.getList();
			},
			// 列表 - 改变每页数量事件
			tableSizeChange(val) {
				const self = this;

				self.configPerson.params.pageSize = val;
				self.getList();
			},
			// 列表 - 改变页码事件
			tableCurrentChange(val) {
				const self = this;

				self.configPerson.params.pageNum = val;
				self.getList();
			},
			
			// 角色 - 获取列表数据
			getRoleList() {
				const self = this;
				
				self.$axios.post(self.addEditPersonDialog.configRole.url).then(res => {
					if(res.status == 200){
						// console.log('角色列表数据：' + JSON.stringify(res.data));
						self.addEditPersonDialog.configRole.data = res.data;
						// self.addEditPersonDialog.configRole.total = res.data.total; // 产品说角色列表不需要分页（怕以后该功能激活，所以先保留分页功能）

						self.$nextTick(() => {
							self.addEditPersonDialog.configRole.selectedDefault.forEach(v => {
								self.addEditPersonDialog.configRole.data.forEach(vs => {
									v.id == vs.id && self.$refs.roleTable.toggleRowSelection(vs);
								});
							});
						})
					}else{
						self.$message({ type: 'error', message: res.message });
					}
				});
			},
			// 角色 - 选中的数据
			roleSelectionChange(v) {
                const self = this;

				self.addEditPersonDialog.configRole.selected = v.map(v => v.id);
			},
			// 角色 - 改变每页数量事件
			roleSizeChange(val) {
				const self = this;

				self.addEditPersonDialog.configRole.params.pageSize = val;
				self.getRoleList();
			},
			// 角色 - 改变页码事件
			roleCurrentChange(val) {
				const self = this;

				self.addEditPersonDialog.configRole.params.pageNum = val;
				self.getRoleList();
			},

            // 技能 - 获取列表数据
			getSkillList() {
				const self = this;
				
				self.$axios.post(self.addEditPersonDialog.configSkill.url, self.addEditPersonDialog.configSkill.params).then(res => {
					if(res.status == 200){
						// console.log('技能列表数据：' + JSON.stringify(res));
						self.addEditPersonDialog.configSkill.data = res.data;
						//self.addEditPersonDialog.configSkill.total = res.data.total;
					}else{
						self.$message({ type: 'error', message: res.message });
					}
				});
			},
			
			// 组织弹出框的回调函数
			organizationHandler(v) {
				
				console.log(v);
				const self = this;

				// 1：搜索区域的组织
				if(self.configOrganizationDialog.position == 1){
					
					if(v){
						self.configPerson.params.organizationId = v.id;
						self.configPerson.organizationName = v.organizationName;
					}else{
						self.configPerson.params.organizationId = '';
						self.configPerson.organizationName = '';
					}
//					self.configPerson.params.organizationId = v.id;
//					self.configPerson.organizationName = v.organizationName;
				}

				// 2：新增和编辑弹框内的组织
				if(self.configOrganizationDialog.position == 2 || self.configOrganizationDialog.position == 3){
					
					if(v){
						self.addEditPersonDialog.ruleForm.organizationId = v.id;
						self.addEditPersonDialog.ruleForm.organizationName = v.organizationName;
					}else{
						self.addEditPersonDialog.ruleForm.organizationId = '';
						self.addEditPersonDialog.ruleForm.organizationName = '';
					}
//					self.addEditPersonDialog.ruleForm.organizationId = v.id;
//					self.addEditPersonDialog.ruleForm.organizationName = v.organizationName;
				}
				
				
			},

			// 区域弹出框的回调函数
			areaHandler(v) {
				const self = this;

                self.addEditPersonDialog.ruleForm.areaId = v.id;
				self.addEditPersonDialog.ruleForm.areaName = v.areaName;

				self.configAreaDialog.show = false;
			},
			// 打开新增 / 编辑弹窗
			openAddEditPersonDialog(item) {
				const self = this;
				
				self.addEditPersonDialog.ruleForm.organizationId = '';         // 清空组织树默认值
				self.addEditPersonDialog.ruleForm.areaId = '';                 // 清空区域树默认值
				self.addEditPersonDialog.configRole.selectedDefault = [];      // 清空角色默认值

                // 编辑的时候回显数据
				if(item) {
					self.addEditPersonDialog.show = true;
					self.configOrganizationDialog.position = 3;
                    self.addEditPersonDialog.title = "编辑人员";

					self.addEditPersonDialog.userID = item.id;
					
					self.$axios.post('/itsm/system/sso/user/queryUserSkillAndRoleRel', { userId: item.id }).then(res => {
						if(res.status == 200){
							const { userBean, roleList, skillList } = res.data;
						
							// 基本信息
							if(userBean){
								self.addEditPersonDialog.ruleForm.userName = userBean.userName;
								self.addEditPersonDialog.ruleForm.loginName = userBean.loginName;
								self.addEditPersonDialog.ruleForm.userCode = userBean.userCode;
								self.addEditPersonDialog.ruleForm.position = userBean.position;
								self.addEditPersonDialog.ruleForm.organizationId = userBean.organizationId;
								self.addEditPersonDialog.ruleForm.organizationName = userBean.organizationName;
								self.addEditPersonDialog.ruleForm.areaId = userBean.areaId;
								self.addEditPersonDialog.ruleForm.areaName = userBean.areaName;
								self.addEditPersonDialog.ruleForm.mobile = userBean.mobile;
								self.addEditPersonDialog.ruleForm.phone = userBean.phone;
								self.addEditPersonDialog.ruleForm.email = userBean.email;
								self.addEditPersonDialog.ruleForm.sex = userBean.sex.toString();
								self.addEditPersonDialog.ruleForm.accountStatus = userBean.accountStatus;
								self.addEditPersonDialog.ruleForm.availableStatus = userBean.availableStatus;
								self.addEditPersonDialog.ruleForm.description = userBean.description;
							}

							// 角色列表选中项						
							if(roleList.length){
								self.addEditPersonDialog.configRole.selectedDefault = roleList;
							}
							
							// 技能选中项
							if(skillList.length){
								self.addEditPersonDialog.configSkill.selected = skillList.map(v => v.id);
							}
						}else{
							self.$message({ type: 'error', message: res.message });
						}
						
						self.getRoleList();    // 获取角色数据列表
						self.getSkillList();   // 获取技能数据列表
						
					});
				} else {
					// 点击新增按钮，调一个接口看看系统授权账户数量是否已达上限，达上限不给新增
					self.$axios.post('/itsm/system/sso/user/checkToRegister').then(res => {
						if(res.status == 200){
							self.addEditPersonDialog.show = true;
							self.configOrganizationDialog.position = 2;
							self.addEditPersonDialog.title = "新增人员";
							
							self.getRoleList();    // 获取角色数据列表
							self.getSkillList();   // 获取技能数据列表
						}else{
							self.$message({ type: 'error', message: res.message });
						}
					})

				}

//				self.getRoleList();    // 获取角色数据列表
//				self.getSkillList();   // 获取技能数据列表
			},
			// 打开组织弹窗
			openOrganizationShow(v) {
				const self = this;
				
				if(v){
					self.configOrganizationDialog.position = v;
				}
				//!v && self.configOrganizationDialog.position = v;
				
				console.log('状态:'+self.configOrganizationDialog.position)
				// 查询
				if( self.configOrganizationDialog.position == 1 ){
					self.configOrganizationDialog.defaultSelectId = {
						organizationId: self.configPerson.params.organizationId,
						type: 'search'
					}
				}
				// 新增/编辑
				if( self.configOrganizationDialog.position == 2 || self.configOrganizationDialog.position == 3 ){
					self.configOrganizationDialog.defaultSelectId = {
						organizationId: self.addEditPersonDialog.ruleForm.organizationId
					}
				}
//				// 编辑
//				if( self.configOrganizationDialog.position == 3 ){
//					self.configOrganizationDialog.defaultSelectId = self.addEditPersonDialog.ruleForm.organizationId;
//				}
				
				this.$nextTick( ()=>{
					self.configOrganizationDialog.show = true;
				});

				

				//v == 1 && (self.addEditPersonDialog.ruleForm.organizationId = ''); // 清空组织树默认勾选
			},
			// 打开区域弹窗
			openAreaDialog() {
                const self = this;

				self.configAreaDialog.show = true;
			},
			selectOrganizationContent(h, { node, data, store }) {
				const self = this;
				return h('span', null, [
					h('el-radio', {
							attrs: {
								value: self.configOrganizationDialog.selected,
								label: node.key
							},
							on: {
								input: (v) => {
									self.configOrganizationDialog.selected = v
								}
							}
						},
						''
					),
					h('i', {
							style: {
								'color': '#ffba72',
								'margin-right': '8px'
							},
							class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
						},
						''
					),
					h('span', null, node.label)
				]);
			},
			saveOrganization() {

			},
			// 切换tab
			changeView(item) {
				const self = this;
		
				self.addEditPersonDialog.basicInfo = true ? item == "basicInfo" : false;
				self.addEditPersonDialog.role = true ? item == "role" : false;
				self.addEditPersonDialog.skill = true ? item == "skill" : false;
				self.addEditPersonDialog.currentView = item;
			},
			// 重置密码
			resetPassword(item) {
				const self = this;
				
				self.$confirm('请确认是否将该人员的登录密码重置为000000', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					closeOnClickModal: false,
					type: 'warning'
				}).then(() => {
					self.$axios.post(self.configPerson.urlReset, {
						id: item.id
					}).then((res) => {
						self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消重置密码' });          
				});
			},
			// 提交表单
			submitForm() {
				const self = this;

                self.$refs['addEditForm'].validate(valid => {
					if (valid) {
						Object.assign(self.addEditPersonDialog.ruleForm, { roleIds: self.addEditPersonDialog.configRole.selected.join() }, { skillIds: self.addEditPersonDialog.configSkill.selected.join() });
						
						// 编辑
                        if(self.addEditPersonDialog.userID){
                            Object.assign(self.addEditPersonDialog.ruleForm, { id: self.addEditPersonDialog.userID });

						    self.$axios.post(self.addEditPersonDialog.urlEdit, self.addEditPersonDialog.ruleForm).then(res => {
								if(res.status == 200){

                                    if(self.addEditPersonDialog.userID == self.userId) {
										self.$store.commit('changeUserInfo',  { userName: self.addEditPersonDialog.ruleForm.userName });
									}
									self.closeAddEditPersonDialog();
									self.$message({ message: res.message, type: 'success' });
									self.getList();
								}else{
									self.$message({ message: res.message, type: 'error' });
								}
							});
						// 新增
						}else{
                            self.$axios.post(self.addEditPersonDialog.urlSave, self.addEditPersonDialog.ruleForm).then(res => {
								if(res.status == 200){
									self.closeAddEditPersonDialog();
									self.configPerson.params.pageNum = 1;
									self.$message({ message: res.message, type: 'success' });
									self.getList();
								}else{
									self.$message({ message: res.message, type: 'error' });
								}
							});
						}
					}else {
						self.$message({ message: '请完善基本信息', type: 'warning' });
					}
				});
			},
			// 关闭新增/编辑运维组弹窗
			closeAddEditPersonDialog() {
				const self = this;
				self.resetAddEditForm();
				self.addEditPersonDialog.show = false;
				self.addEditPersonDialog.currentView = "basicInfo";
				self.addEditPersonDialog.basicInfo = true;
				self.addEditPersonDialog.role = false;
				self.addEditPersonDialog.skill = false;
			},
			// 下载导入模板
			downTemplate() {
				const self = this;

				window.location.href = self.configPerson.urlDown + `?Token=${self.token}`;
			},
			// 导出
			exportUser() {
				const self = this;

				if(!self.configPerson.selected.length){
					self.$message({ type: 'warning', message: '请选中需要导出的人员' });
					return;
				}

				window.location.href = self.configPerson.urlExport + `?userIds=${self.configPerson.selected.join()}&Token=${self.token}`;
			},
			// 重置查询条件
			resetSearchForm() {
                const self = this;

				self.$refs['searchForm'].resetFields();          // 重置搜索表单
				self.configPerson.searchState = false;           // 重置查询状态
				self.configPerson.params.organizationId = '';    // 重置组织ID
				self.configPerson.organizationName = '';         // 重置组织name
				// self.configPerson.params.pageNum = 1;            // 重置页码
				// self.configPerson.params.pageSize = 10;          // 重置每页数量
				// self.getList();                                // 只是重置了查询表单
			},
//			refreshTable() {
//				const self = this;
//				
//				self.getList();
//			},
			// 重置新增和编辑弹出框的内容
			resetAddEditForm() {
				const self = this;

				self.$refs['addEditForm'].resetFields();               // 清空基本信息表单
				self.addEditPersonDialog.userID = '';                  // 清空编辑时的用户 ID
				self.addEditPersonDialog.configSkill.selected = [];    // 清空技能选中项
				self.addEditPersonDialog.configRole.selected = [];     // 清空角色选中项
			},
			// 导入弹窗
			openUploadDialog() {
				this.configUpload.fileName = "";
				this.uploadDialog.show = true;
			},
	        onSuccess(res, file, fileList) {
				const self = this;
                self.$nextTick(() => {
//					self.configUpload.fileName = '';
					self.uploadDialog.loading.close();
				});
				if(res.status == 200) {
					if(res.message) {
						var message = res.data > 0 ? '成功导入'+ res.data +'条数据' : '';
//						var message = '成功导入'+ res.data +'条数据，';
						var errorMsg = res.message.split('第');
						errorMsg.forEach((i,n) => {
							message += n == 0 ? ''+ i : '<br/>第'+ i
						})
						this.uploadDialog.message = this.$message({
						 	type:errorMsg.length > 1 ? 'error' : 'success',
				          	showClose: true,
				          	message: message,
				          	duration:0,
				          	dangerouslyUseHTMLString:true,
				          	customClass:'upload-message',
				          	onClose:function(){
				          		self.configUpload.fileName = '';
				          	}
					    });
					} else {
						this.$message({ message: "成功导入"+ res.data +'条数据', type: 'success' });
						this.uploadDialog.show = false;
						this.configPerson.params.pageNum = 1;
						this.getList();
					}
				}else {
					this.$message({ message: res.message, type: 'error' });
				}
				
	       },
			onError(err, file, fileList) {
	            this.$message.error(err.message);
	            this.uploadDialog.loading.close();
	        },
			beforeupload(file) {
				const self = this;
				var index = file.name.lastIndexOf('.'), format = file.name.substring(index+1),flag = true;
				if(['xlsx','xls'].indexOf(format)==-1) {
					self.$message.error('导入文件只能是 xls或者xlsx格式!');
					self.configUpload.fileName = '';
					flag = false;
				}
				if(flag) {
		        	if(file.size > 5242880) {
		        		this.$message({ type: 'error', message: '文件大小不能超过5M!' });
		        		return false;
		        	} else {
		        		this.uploadDialog.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						});
		        		return true;
		        	}
		        } else {
		        	return flag;
		        }
			},
			handleChange(file, fileList) {
				this.configUpload.fileName = file.name;
			},
			// 手动上传
			submitUpload() {
				if(!this.configUpload.fileName) {				
					this.$message.error('请选择上传的文件');
					return;
				}
				this.$refs.upload.submit();
			},	        
			// 关闭弹窗
			closeDialog(){
				this.uploadDialog.show = false;
				if(this.uploadDialog.message) {
					this.uploadDialog.message.close();
				}	
				this.getList();
			},
			// 关闭提示信息弹窗
        	closeMessage(){
        		if(this.uploadDialog.message) {
					this.uploadDialog.message.close();
				}
        	},
			selectOnFocus(e) {
                e.target.blur();
			}
		},
		computed: {
			token() {
				return this.$store.state.user.info ? this.$store.state.user.info.token : ''
			},
			userId() {
				return this.$store.state.user.info ? this.$store.state.user.info.id : ''
			}
		}
	}
</script>

<style lang="less">

</style>