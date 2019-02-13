<template>
	<div class="itsm-tabs-main sla-save-page">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<!-- SLA 关联设备 -->
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							SLA关联设备 <i class="el-icon-my-collapse"></i>
						</div>

						<div class="panel-body">
							<el-form :inline="true" :model="configDevice.form.ruleForm" :rules="configDevice.form.rules" ref="ruleForm" class="search-conditions">
								<el-form-item label="名称：" prop="name">
									<el-input type="text" v-model="configDevice.form.ruleForm.name" placeholder="请输入名称" auto-complete="off" ></el-input>
								</el-form-item>

								<el-form-item label="状态：" prop="state">
									<el-select v-model="configDevice.form.ruleForm.state" placeholder="请选择合同类型">
										<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configDevice.stateDropDownData"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="设备分类：" prop="type">
									<el-select v-model="configDevice.form.ruleForm.type" placeholder="请选择设备分类" >
										<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configDevice.typeDropDownData"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="编码：" prop="code">
									<el-input type="text" v-model="configDevice.form.ruleForm.code" placeholder="请输入编码" auto-complete="off" class="reset-width" ></el-input>
								</el-form-item>

								<el-form-item>
									<el-button type="primary" size="mini" icon="el-icon-my-guanlian" @click="opendeviceContextDialog">关联设备</el-button>
								</el-form-item>
							</el-form>
						</div>

						<div class="tabs-panel-wrap border" style=" margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fl">
									<el-button type="normal" icon="el-icon-my-delete" @click="deviceDelete">删除</el-button>
								</div>

								<div class="fr">
									<el-button type="normal" icon="el-icon-my-search">查询</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table :data="configDevice.table.data" @selection-change="deviceSelectionChange" max-height="296" stripe style="width: 100%;">
									<el-table-column type="selection" width="55"></el-table-column>

									<el-table-column prop="code" label="资产编码"></el-table-column>

									<el-table-column prop="name" label="资产名称"></el-table-column>

									<el-table-column prop="type" label="分类"></el-table-column>

									<el-table-column label="操作" width="300">
										<template slot-scope="scope">
											<i class="el-icon-my-delete reset-style" @click="deviceDelete"></i> <!-- @click="handleClick(scope.row)" -->
										</template>
									</el-table-column>
								</el-table>
							</div>

							<div class="panel-footer">
								<el-pagination small @size-change="deviceSizeChange" @current-change="deviceSizeChange" :current-page="configDevice.table.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="10"></el-pagination>
							</div>
						</div>
					</div>

					<!-- SLA 关联服务 -->
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							SLA关联服务 <i class="el-icon-my-collapse"></i>
						</div>

						<div class="panel-body">
							<el-form :inline="true" :model="configService.form.ruleForm" :rules="configService.form.rules" ref="ruleForm" class="search-conditions">
								<el-form-item label="服务类型：" prop="type">
									<el-select v-model="configService.form.ruleForm.type" placeholder="请选择服务类型">
										<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configService.typeDropDownData"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="资产名称：" prop="name">
									<el-input type="text" v-model="configService.form.ruleForm.name" placeholder="请输入资产名称" auto-complete="off"></el-input>
								</el-form-item>

								<el-form-item label="资产编码：" prop="code">
									<el-input type="text" v-model="configService.form.ruleForm.code" placeholder="请输入资产" auto-complete="off"></el-input>
								</el-form-item>

								<el-form-item>
									<el-button type="primary" size="mini" icon="el-icon-my-guanlian" @click="opendeviceContextDialog">关联服务</el-button>
								</el-form-item>
							</el-form>
						</div>

						<div class="tabs-panel-wrap border" style=" margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fl">
									<el-button type="normal" icon="el-icon-my-delete" @click="serviceDelete">删除</el-button>
								</div>

								<div class="fr">
									<el-button type="normal" icon="el-icon-my-search">查询</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table :data="configService.table.data" @selection-change="serviceSelectionChange" max-height="296" stripe style="width: 100%;">
									<el-table-column type="selection" width="55"></el-table-column>

									<el-table-column prop="code" label="资产编码"></el-table-column>

									<el-table-column prop="type" label="服务类型"></el-table-column>

									<el-table-column prop="name" label="资产名称"></el-table-column>

									<el-table-column prop="organize" label="组织"></el-table-column>

									<el-table-column label="操作" width="300">
										<template slot-scope="scope">
											<i class="el-icon-my-delete reset-style" @click="serviceDelete"></i> <!-- @click="handleClick(scope.row)" -->
										</template>
									</el-table-column>
								</el-table>
							</div>

							<div class="panel-footer">
								<el-pagination small @size-change="serviceSizeChange" @current-change="serviceSizeChange" :current-page="configService.table.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="10"></el-pagination>
							</div>
						</div>
					</div>

					<!-- SLA 关联业务 -->
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							SLA关联业务 <i class="el-icon-my-collapse"></i>
						</div>

						<div class="panel-body">
							<el-form :inline="true" :model="configBusiness.form.ruleForm" :rules="configBusiness.form.rules" ref="ruleForm" class="search-conditions">
                                <el-form-item label="资产名称：" prop="name">
									<el-input type="text" v-model="configBusiness.form.ruleForm.name" placeholder="请输入资产名称" auto-complete="off"></el-input>
								</el-form-item>

								<el-form-item label="资产编码：" prop="code">
									<el-input type="text" v-model="configBusiness.form.ruleForm.code" placeholder="请输入资产编码" auto-complete="off" ></el-input>
								</el-form-item>

								<el-form-item label="使用人：" prop="user">
                                    <el-input placeholder="请选择使用人" v-model="configBusiness.form.ruleForm.user" auto-complete="off"  readonly></el-input>
                                    <i class="el-icon-my-more" @click="openUserDialog"></i>
                                </el-form-item>

								<el-form-item label="业务分类：" prop="type">
									<el-select v-model="configBusiness.form.ruleForm.type" placeholder="请选择业务分类" >
										<el-option :label="item.label" :value="item.value" :key="item.value" v-for="item in configBusiness.typeDropDownData"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item>
									<el-button type="primary" size="mini" icon="el-icon-my-guanlian" @click="opendeviceContextDialog">关联业务</el-button>
								</el-form-item>
							</el-form>
						</div>

						<div class="tabs-panel-wrap border" style=" margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fl">
									<el-button type="normal" icon="el-icon-my-delete" @click="businessDelete">删除</el-button>
								</div>

								<div class="fr">
									<el-button type="normal" icon="el-icon-my-search">查询</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table :data="configBusiness.table.data" @selection-change="businessSelectionChange" max-height="296" stripe style="width: 100%;">
									<el-table-column type="selection" width="55"></el-table-column>

									<el-table-column prop="code" label="资产编码"></el-table-column>

									<el-table-column prop="name" label="资产名称"></el-table-column>

									<el-table-column label="操作" width="300">
										<template slot-scope="scope">
											<i class="el-icon-my-delete reset-style" @click="businessDelete"></i> <!-- @click="handleClick(scope.row)" -->
										</template>
									</el-table-column>
								</el-table>
							</div>

							<div class="panel-footer">
								<el-pagination small @size-change="serviceSizeChange" @current-change="serviceSizeChange" :current-page="configBusiness.table.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="10"></el-pagination>
							</div>
						</div>
					</div>

                    <div class="submit">
					    <el-button type="primary"  @click="submit">&nbsp;保&nbsp;存&nbsp;</el-button>
					</div>
				</div>
			</ies-scrollbar>

			<!-- 关联设备弹窗 -->
            <el-dialog :visible.sync="configDeviceContextDialog.show" title="搜索关联设备" custom-class="device-context-dialog-style">
                <div class="tabs-panel-wrap border">
                    <div class="panel-body">
                        <el-table :data="configDeviceContextDialog.data" @selection-change="deviceContextSelectionChange" max-height="152" stripe style="width: 100%;">
                            <el-table-column type="selection" width="55"></el-table-column>

                            <el-table-column prop="code" label="编号" width="180"></el-table-column>

                            <el-table-column prop="name" label="配置项名称"></el-table-column>

                            <el-table-column prop="type" label="分类"></el-table-column>

							<el-table-column prop="state" label="状态"></el-table-column>
                        </el-table>
                    </div>

                    <div class="panel-footer">
                        <el-pagination small @size-change="deviceContextSizeChange" @current-change="deviceContextCurrentChange" :current-page="configDeviceContextDialog.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="10"></el-pagination>
                    </div>
                </div>
                
                <div slot="footer">
                    <el-button type="primary"  @click="deviceContextSubmitForm">导&nbsp;入</el-button>
                </div>
            </el-dialog>

			<!-- 选择使用人弹窗 -->
            <el-dialog :visible.sync="configBusiness.userDialog.show" custom-class="user-dialog-style">
                <span slot="title" style="color:#666666;">请选择人员</span>             

                <div class="tabs-panel-wrap border query-area">
                    <div class="panel-header">
                        查询条件
                    </div>
                    
                    <div class="panel-body main">
                        <div class="fl">
                            登录ID：
                            <el-input placeholder="请输入登录ID" class="reset-width" ></el-input>
                        </div>

                        <div class="fl ml50">
                            用户名：
                            <el-input placeholder="请输入用户名" class="reset-width" ></el-input>
                        </div>
                    </div>
                </div>

                <div class="tabs-panel-wrap border">
                    <div class="panel-header">
                        <div class="right">
                            <el-button type="primary" icon="el-icon-search" size="mini">查询</el-button>
                        </div>
                    </div>
                    
                    <div class="panel-body main">
                        <el-table :data="configBusiness.userDialog.data" max-height="200" stripe>
                            <el-table-column width="55">
                                <template slot-scope="scope">
                                    <el-radio v-model="configBusiness.userDialog.selected" :label="scope.row.id">&nbsp;</el-radio>
                                </template>
                            </el-table-column>

                            <el-table-column prop="code" label="工号" width="180"></el-table-column>

                            <el-table-column prop="id" label="登录ID"></el-table-column>

                            <el-table-column prop="name" label="用户名"></el-table-column>
                        </el-table>
                    </div>

                    <div class="panel-footer footer">
                        <el-pagination small @size-change="userSizeChange" @current-change="userCurrentChange" :current-page="configBusiness.userDialog.currentPage" :page-sizes="[2, 4, 6, 8]" :page-size="2" layout="total, sizes, prev, pager, next, jumper" :total="10"></el-pagination>
                    </div>
                </div>
                
                <div slot="footer">
                    <el-button type="primary" @click="userSubmitForm">保&nbsp;存</el-button>
                </div>
            </el-dialog>
		</div>
	</div>
</template>

<script>
export default {
	data () {
		return {

			// 关联弹窗配置
            configDeviceContextDialog: {
                show: false,    // 弹窗的显示/隐藏
                selected: '',   // 选中的用户 id
                currentPage: 1, // 当前页码
                data: [         // 数据源
                    {
						id: '1',
                        code: '1234567',
						name: 'L6000R',
						type: '主机设备',
						state: '使用中'
                    }, 
                    {
						id: '2',
                        code: '7654321',
						name: 'L6000R',
						type: '主机设备',
						state: '使用中'
					}
                ]
            },

			// SLA 关联设备配置
            configDevice:{
				// 搜索表单
				form: {
                    ruleForm: {     // 数据列表字段
						name: '',
						state: '',
						type: '',
						code: ''
					},
					rules: {    // 数据列表字段的验证规则
						// name: [
						// 	{ required: true, message: '请输入支撑合同名称', trigger: 'blur' }
						// ]
					}
				},
				// 状态下拉数据
				stateDropDownData: [    // 数据源
					{ value: '1', label: '待清理' },
					{ value: '2', label: '借出' },
					{ value: '3', label: '测试中' },
					{ value: '4', label: '使用中' },
					{ value: '5', label: '维护中' },
					{ value: '6', label: '报废' },
					{ value: '7', label: '丢失' },
					{ value: '8', label: '闲置' },
					{ value: '9', label: '停用' }
				],
				// 设备分类下拉数据
				typeDropDownData: [    // 数据源
					{ value: '1', label: '基础环境' },
					{ value: '2', label: '硬件' },
					{ value: '3', label: '安全设备' }
				],
				table: {
					selected: [],   // 选中的 id 集合
                    currentPage: 1, // 当前页码
					data: [
						{
							id: '1',
							code: '123456789',
							name: 'L6000R',
							type: '主机设备1'
						},
						{
							id: '2',
							code: '123456789',
							name: 'L6000R',
							type: '主机设备2'
						}
					]
				}
			},

			// SLA 关联服务配置
            configService:{
				// 搜索表单
				form: {
                    ruleForm: {     // 数据列表字段
						name: '',
						state: '',
						type: '',
						code: ''
					},
					rules: {    // 数据列表字段的验证规则
						// name: [
						// 	{ required: true, message: '请输入支撑合同名称', trigger: 'blur' }
						// ]
					}
				},
				// 服务类型下拉数据
				typeDropDownData: [    // 数据源
					{ value: '1', label: '外包服务' },
					{ value: '2', label: '运维服务' },
					{ value: '3', label: '专业服务' },
					{ value: '4', label: '咨询服务' },
					{ value: '5', label: '培训服务' },
					{ value: '6', label: '系统测试服务' }
				],
				table: {
					selected: [],   // 选中的 id 集合
                    currentPage: 1, // 当前页码
					data: [
						{
							id: '1',
							code: '123456789',
							name: 'L6000R',
							type: '主机设备1',
							organize: ''
						},
						{
							id: '1',
							code: '123456789',
							name: 'L6000R',
							type: '主机设备2',
							organize: ''
						}
					]
				}
			},

			// SLA 关联业务配置
            configBusiness:{
				// 搜索表单
				form: {
                    ruleForm: {     // 数据列表字段
						name: '',
						code: '',
						user: '',
						type: ''
					},
					rules: {    // 数据列表字段的验证规则
						// name: [
						// 	{ required: true, message: '请输入支撑合同名称', trigger: 'blur' }
						// ]
					}
				},
				// 业务分类下拉数据
				typeDropDownData: [    // 数据源
					{ value: '1', label: '软件' }
				],
				// 使用人弹窗配置
				userDialog: {
					show: false,    // 弹窗的显示/隐藏
					selected: '',   // 选中的用户 id
					currentPage: 1, // 当前页码
					data: [         // 数据源
						{
							code: '11111',
							id: '1234567',
							name: '用户名 1'
						}, 
						{
							code: '22222',
							id: '7654321',
							name: '用户名 2'
						},
						{
							code: '3333',
							id: '88888',
							name: '用户名 3'
						}
					]
				},
				table: {
					selected: [],   // 选中的 id 集合
                    currentPage: 1, // 当前页码
					data: [
						{
							id: '1',
							code: '7711111',
							name: 'L6000R'
						},
						{
							id: '1',
							code: '8811111',
							name: 'L6000R'
						}
					]
				}
			}
		};
	},
	methods: {
		/* 关联设备弹窗 */
        // selection 改变时会触发
		deviceContextSelectionChange(v) {
            const self = this;

            self.configDeviceContextDialog.selected = v.map(v => v.id);
        },
        // pageSize 改变时会触发
        deviceContextSizeChange(v) {
            console.log(`每页 ${v} 条`);
        },
        // currentPage 改变时会触发
        deviceContextCurrentChange(v) {
            console.log(`当前页: ${v}`);
		},
		opendeviceContextDialog() {
            this.configDeviceContextDialog.show = true;
		},
		deviceContextSubmitForm() {
			const self = this;
			
			if(!self.configDeviceContextDialog.selected.length){
				self.$message({
                    type: 'error',
                    message: '请选中需导入的信息'
                });
                return;
			}

            self.$message({ message: '添加成功', type: 'success' });
            self.configDeviceContextDialog.show = false;
        },

		/* SLA 关联设备 */
		// selection 改变时会触发
		deviceSelectionChange(v) {
            const self = this;

            self.configDevice.table.selected = v.map(v => v.id);
        },
        // pageSize 改变时会触发
        deviceSizeChange(v) {
            console.log(`每页 ${v} 条`);
        },
        // currentPage 改变时会触发
        deviceCurrentChange(v) {
            console.log(`当前页: ${v}`);
		},
		deviceDelete() {
            const self = this;

            if(!self.configDevice.table.selected.length){
                self.$message({
                    type: 'error',
                    message: '请选中需删除的信息'
                });
                return;
            }

            self.$confirm('请确认是否要删除该信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
		},
		
		/* SLA 关联服务 */
		// selection 改变时会触发
		serviceSelectionChange(v) {
            const self = this;

            self.configService.table.selected = v.map(v => v.id);
        },
        // pageSize 改变时会触发
        serviceSizeChange(v) {
            console.log(`每页 ${v} 条`);
        },
        // currentPage 改变时会触发
        serviceCurrentChange(v) {
            console.log(`当前页: ${v}`);
		},
		serviceDelete() {
            const self = this;

            if(!self.configService.table.selected.length){
                self.$message({
                    type: 'error',
                    message: '请选中需删除的信息'
                });
                return;
            }

            self.$confirm('请确认是否要删除该信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
		},

		/* SLA 关联业务 */
		// selection 改变时会触发
		businessSelectionChange(v) {
            const self = this;

            self.configBusiness.table.selected = v.map(v => v.id);
        },
        // pageSize 改变时会触发
        businessSizeChange(v) {
            console.log(`每页 ${v} 条`);
        },
        // currentPage 改变时会触发
        businessCurrentChange(v) {
            console.log(`当前页: ${v}`);
		},
		businessDelete() {
            const self = this;

            if(!self.configBusiness.table.selected.length){
                self.$message({
                    type: 'error',
                    message: '请选中需删除的信息'
                });
                return;
            }

            self.$confirm('请确认是否要删除该信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                self.$message({
                    type: 'success',
                    message: '删除成功!'
                });
            }).catch(() => {
                self.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
		},

        // 保存
		submit() {
			const self = this;

			self.$message({ message: '成功', type: 'success' });
			self.$router.go(-1);
		},

		// 打开选择库房管理员弹窗
        openUserDialog() {
            this.configBusiness.userDialog.show = true;
		},
        // pageSize 改变时会触发
        userSizeChange(v) {
            console.log(`每页 ${v} 条`);
        },
        // currentPage 改变时会触发
        userCurrentChange(v) {
            console.log(`当前页: ${v}`);
		},
		userSubmitForm() {
            const self = this;

            self.$message({ message: '添加成功', type: 'success' });
            self.configBusiness.userDialog.show = false;
        }
	}
}
</script>

<style lang="less">
	.sla-save-page {
		height: 100%;
		.el-icon-my-collapse { 
			font-size: 12px; color: #a1a1a1; 
		}
		.search-conditions {
			padding: 15px 0px 0px 40px;
			.el-form-item {
				margin-right: 70px;
				.el-input__inner{ 
					width: 202px; 
				}
			}
		}
		.reset-style { 
			cursor: pointer; 
		}
		.el-table__body-wrapper { 
			overflow-x: hidden; 
		}
		.device-context-dialog-style {
			width: 720px; height: 350px;
			.el-dialog__body { 
				height: 250px; padding: 10px 0 10px 10px; 
			}
		}
		.user-dialog-style { 
			width: 720px; height: 570px;
			.query-area {
				.main { 
					height: 80px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding-top: 25px;
				    .content { 
						float: left; width: 280px; margin-right: 35px; 
					}
				}
				.reset-width { 
					width: 200px; 
				}
			}
			.el-dialog__body { 
				height: 470px; padding: 10px 0 10px 10px; 
			}
			.footer {  
				padding-top: 10px;
			}
		}
		.submit {
			width: 70px; margin: 20px auto;
		}
	}
</style>