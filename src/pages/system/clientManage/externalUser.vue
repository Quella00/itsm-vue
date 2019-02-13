<!--外部用户-->
<template>
	<div class="itsm-tabs-main external-user">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 100px;">
					<el-form label-width="130px" style="margin-top: 24px;" class="external-user-query">
						<el-form-item label="姓名：">
							<el-input placeholder="请输入姓名" v-model="configTable.name"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-export" @click="exportData">导出</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="configTable" :data="configTable.data" @selection-change="handleSelectionChange" stripe style="width: 100%;">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column show-overflow-tooltip prop="name" label="姓名"></el-table-column>
						<el-table-column show-overflow-tooltip prop="customerName" label="客户名称"></el-table-column>
						<el-table-column show-overflow-tooltip prop="mobile" label="移动电话"></el-table-column>
						<el-table-column show-overflow-tooltip prop="fixedTelephone" label="座机"></el-table-column>
						<el-table-column show-overflow-tooltip prop="email" label="邮箱"></el-table-column>
						<el-table-column show-overflow-tooltip prop="remark" label="备注"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createTime" label="创建时间"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" style="cursor: pointer;" @click="openDialog(scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="configTable.pageNum" 
						:page-sizes="[10, 20, 30, 40]" :page-size="configTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total">
					</el-pagination>
				</div>
			</div>

			<!-- 编辑弹窗 -->
			<el-dialog title="客户修改" :visible.sync="configAddEditDialog.show" custom-class="add-edit-dialog" :close-on-click-modal='false' v-drag>
				<el-form :model="configAddEditDialog.ruleForm" :rules="configAddEditDialog.rules" ref="ruleForm" label-width="130px" class="demo-ruleForm" :inline="true">
					<el-form-item label="姓名：" prop="name">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.name" placeholder="请输入姓名" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="客户单位：" prop="customerUnit">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.customerUnit" placeholder="请输入客户单位" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="联系电话：" prop="mobile">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.mobile" placeholder="请输入联系电话" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="客户名称：" prop="customerName">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.customerName" placeholder="请输入客户名称" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="电子邮箱：" prop="email">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.email" placeholder="请输入电子邮件" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="座机：" prop="fixedTelephone">
						<el-input type="text" v-model="configAddEditDialog.ruleForm.fixedTelephone" placeholder="请输入座机" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark">
						<el-input type="textarea" v-model="configAddEditDialog.ruleForm.remark" placeholder="请输入备注" auto-complete="off" class="reset-style"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer">
					<el-button type="normal" @click="submitForm">保存</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'externalUser',
		data() {
			let validator = this.$ies.validator;
			return {
				token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
				// 数据列表配置
				configTable: {
					name: '',				// 查询条件,姓名
					pageNum: 1,
					pageSize: 10,
					total: 0,
					selected: [],
					data: []
				},
				searchConditions: {
					externalUserName: ''
				},
				// 编辑弹窗配置
				configAddEditDialog: {
					show: false,
					id: '',
					ruleForm: {
						name: '',			// 姓名
						customerUnit: '',	// 客户单位
						mobile: '',			// 联系电话
						customerName: '',	// 客户名称
						email: '',			// 电子邮件
						fixedTelephone: '',	// 座机
						remark: ''			// 备注
					},
					rules: {
						name: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入姓名', trigger: 'blur' }
						],
						customerUnit: [
							{ validator: validator.space, trigger: 'blur', options: {max:40} }
						],
						mobile: [
							{ validator: validator.space, trigger: 'blur' },
							{ required: true, message: '请输入联系电话', trigger: 'blur' },
							{ validator: validator.mobile, trigger: 'blur' }
						],
						customerName: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} }
						],
						email: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入电子邮件', trigger: 'blur' },
							{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
						],
						fixedTelephone: [
							{ validator: validator.space, trigger: 'blur', options: {max:20} },
							{ validator: validator.phone, trigger: 'blur' }
						],
						remark: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
				}
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				this.query();
			});
		},
		methods: {
			query() {
				var param = {
					pageNum: this.configTable.pageNum,
					pageSize: this.configTable.pageSize,
					externalUserName: this.searchConditions.externalUserName
				}
				this.$axios.post('/itsm/system/sso/external/query',param).then( (res) => {
					if(res.status == 200) {
						this.configTable.data = res.data.list;
						this.configTable.total = res.data.total;
					}
				});
			},
			// 查询
			search() {
				this.configTable.pageNum = 1;
				this.searchConditions.externalUserName = this.configTable.name;
				this.query();
			},
			// pageSize 改变时会触发
			handleSizeChange(v) {
				this.configTable.pageSize = v;
				this.query();
			},
			// currentPage 改变时会触发
			handleCurrentChange(v) {
				this.configTable.pageNum = v;
				this.query();
			},
			handleSelectionChange(v) {
				this.configTable.selected = v.map(v => v.id);
			},
			// 导出
			exportData() {
				if(this.configTable.selected.length <= 0) {
					this.$message({ message: '至少选择一条数据', type: 'warning'});
					return;
				}
				window.open(`api/itsm/system/sso/external/export?idList=${this.configTable.selected.join()}&Token=${this.token}`);
			},
			// 打开编辑弹窗
			openDialog(v) {
				this.configAddEditDialog.show = true;
				this.configAddEditDialog.id = v;
				this.$axios.post('/itsm/system/sso/external/detail',{id:v}).then( (res) => {
					if(res.status == 200) {
						this.$refs['ruleForm'].resetFields();
						this.configAddEditDialog.ruleForm.name = res.data.name;
						this.configAddEditDialog.ruleForm.customerUnit = res.data.customerUnit;
						this.configAddEditDialog.ruleForm.mobile = res.data.mobile;
						this.configAddEditDialog.ruleForm.customerName = res.data.customerName;
						this.configAddEditDialog.ruleForm.email = res.data.email;
						this.configAddEditDialog.ruleForm.fixedTelephone = res.data.fixedTelephone;
						this.configAddEditDialog.ruleForm.remark = res.data.remark;
					}
				});
			},
			// 保存
			submitForm() {
				this.$refs['ruleForm'].validate(valid => {
					if(valid) {
						var param = this.configAddEditDialog.ruleForm;
						param['id'] = this.configAddEditDialog.id;
						this.$axios.post('/itsm/system/sso/external/update',param).then( (res) => {
							if(res.status == 200 && res.data) {
								this.$message({ message: '修改成功', type: 'success' });
								this.configAddEditDialog.show = false;
								this.query();
							} else {
								this.$message({ message: '修改失败', type: 'error' });
							}
						});
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.external-user {
		.external-user-query {
			.el-form-item {
				height: 40px;
			}
			.el-input__inner {
				height: 25px; width: 200px;
			}
		}
		.add-edit-dialog {
			width: 750px; height: 450px;
			.reset-style {
				width: 200px; height: 32px; line-height: 27px;
			}
			.el-form--inline {
				height: 350px; padding-top: 35px;
			}
			.el-textarea__inner, .el-textarea{
				width: 545px; height: 113px;
			}
			.el-textarea__inner {
				resize: none;
			}
		}
	}
</style>