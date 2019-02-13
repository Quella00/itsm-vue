<!-- 资产审核 -->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body">
					<el-form label-width="130px" :inline="true" style="margin-top: 15px;" :model="ruleForm" :rules="rules" ref="ruleForm">
						<el-form-item label="资产名称：" prop="name">
							<el-input v-model="ruleForm.name" class="resetWidth" placeholder="请输入资产名称"></el-input>
						</el-form-item>

						<el-form-item label="资产分类：" prop="classificationName">
							<el-input v-model="classificationName" class="resetWidth" readonly placeholder="请选择资产分类" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="assetDialog.show = true"></i>
						</el-form-item>

						<el-form-item label="来源：" prop="operation">
							<el-select v-model="ruleForm.operation" class="resetWidth" @focus="selectOnFocus">
								<el-option value="" label="请选择"></el-option>
								<el-option value="新增" label="新增"></el-option>
								<el-option value="编辑" label="编辑"></el-option>
								<el-option value="删除" label="删除"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="使用人：" prop="userName">
							<el-input v-model="userName" class="resetWidth" readonly placeholder="请选择使用人" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="personRadioDialog.show = true"></i>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-batch" style="width:100px;" @click="batchAudit">批量审核</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="resetForm">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="auditTable.data" stripe style="width: 100%;" @selection-change="handleSelectionChange" ref="auditTable">
						<el-table-column type="selection" width="55" align="center"></el-table-column>
						<el-table-column show-overflow-tooltip prop="code" label="资产编码"></el-table-column>
						<el-table-column show-overflow-tooltip prop="name" label="资产名称"></el-table-column>
						<el-table-column show-overflow-tooltip prop="classificationName" label="资产分类"></el-table-column>
						<el-table-column show-overflow-tooltip prop="operation" label="来源"></el-table-column>
						<el-table-column show-overflow-tooltip prop="updateTime" label="申请时间"></el-table-column>
						<el-table-column show-overflow-tooltip prop="updateUserName" label="申请人"></el-table-column>
						<el-table-column show-overflow-tooltip prop="userName" label="使用人"></el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
                                <i class="el-icon-my-edit" title="查看" @click="openAsset(scope.row.id)"></i> 
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<!--面板底部-->
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="auditTable.pagination.pageNum" :page-sizes="[10, 20, 30, 40]" 
						:page-size="auditTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="auditTable.total">
					</el-pagination>
				</div>
			</div>
			
			<!-- 选择人员(单选) -->
        	<ies-personRadioDialog v-model="personRadioDialog.show" v-if="personRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect="personRadioDialog.selectData"></ies-personRadioDialog>
			<!-- 资产分类弹窗 -->
        	<iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId' type="search"></iesAssetDialog>
			<!-- 批量审核弹窗 -->
			<el-dialog title="批量审核" :visible.sync="auditDialog.show" width="450px" :close-on-click-modal='false' v-drag>
				<div class="audit-remark">
					<el-form label-width="90px" :model="auditDialog.remarkForm" :rules="auditDialog.remarkRules" ref="remarkForm">
						<el-form-item label="审核：" prop="audit">
							<el-select v-model="auditDialog.remarkForm.audit" @focus="selectOnFocus">
								<el-option label="审核通过" value="true"></el-option>
								<el-option label="审核不通过" value="false"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注：" prop="remark" style="width: 400px;">
							<el-input type="textarea" v-model="auditDialog.remarkForm.remark" placeholder="请输入备注" resize="none"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div slot="footer">
					<el-button type="normal" @click="audit">保存</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'assetAudit',
		data() {
			let validator = this.$ies.validator;
			return {
				ruleForm: {
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					operation: "",				// 来源
					user: "", 					// 使用人
				},
				searchConditions: {
					name: '',
					classification: '',
					operation: '',
					user: ''
				},
				classificationName: "",			// 资产分类~名称
				userName: "",					// 使用人~名字
				rules: { },
				// 资产表格配置
				auditTable: {
					data: [],
					selected: [],
					total: 0,
					pagination: {
						pageNum: 1,
						pageSize: 10
					}
				},
				// 资产分类弹窗
				assetDialog: {
					show: false,
					selectId: ''
				},
				// 批量审核弹窗
				auditDialog: {
					show: false,
					remarkForm: {
						audit: "true", 	// 审核
						remark: "" 		// 备注
					},
					remarkRules: {
						remark: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
				},
				// 单选(选择人弹窗)
				personRadioDialog: {
					show: false,
					selectData: {
						type: 'search',
						id: ''
					}
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.query();
			});
		},
		activated() {
			this.$nextTick(this.query);
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 资产分类
	        assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.classificationName = node.categoryName;
	                this.ruleForm.classification = node.id;
	          	} else {
	          		this.assetDialog.selectId = '';
	                this.classificationName = '';
	                this.ruleForm.classification = '';
	          	}
	        },
	        // 选择人员(单选)
	      	selectPersonRadioHandler(data) {
	      		this.ruleForm.user = JSON.parse(data).id; 
	      		this.userName = JSON.parse(data).userName;
	      		this.personRadioDialog.selectData.id = JSON.parse(data).id;
	      	},
	        query() {
	        	var param = {
	        		auditStatus: 1,
	        		needApprove: 1,
	        		pageNum: this.auditTable.pagination.pageNum,
	        		pageSize: this.auditTable.pagination.pageSize,
	        		name: this.searchConditions.name,
	        		classification: this.searchConditions.classification,
					operation: this.searchConditions.operation,
					user: this.searchConditions.user
	        	}
	        	this.$axios.post('/assets/management/query',param).then( (res) => {
	        		if(res.status == 200) {
	        			if(res.data.list == null) {
	        				this.auditTable.data = [];
	        				this.auditTable.total = 0;
	        			} else {
	        				this.auditTable.data = res.data.list;
	        				this.auditTable.total = res.data.total;
	        			}
	        		}
				});
	        },
			// 分页事件
			handleSizeChange(val) {
				this.auditTable.pagination.pageSize = val;
				this.query();
			},
			handleCurrentChange(val) {
				this.auditTable.pagination.pageNum = val;
				this.query();
			},
			// 查看资产
			openAsset(id) {
//				this.$store.state.asset.auditId = id;
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/assetAudit/viewAsset?id='+id );
			},
			// 重置
			resetForm() {
				this.ruleForm.classification = "";
				this.classificationName = "";
				this.ruleForm.user = "";
				this.userName = "";
				this.assetDialog.selectId = '';
				this.personRadioDialog.selectData.id = '';
				this.$refs['ruleForm'].resetFields();
			},
			// 查询
			search() {
				this.auditTable.pagination.pageNum = 1;
				this.searchConditions.name = this.ruleForm.name;
				this.searchConditions.classification = this.ruleForm.classification;
				this.searchConditions.operation = this.ruleForm.operation;
				this.searchConditions.user = this.ruleForm.user;
				this.query();
			},
			// 表格选中数据
			handleSelectionChange(v) {
				this.auditTable.selected = v.map(v => v.id);
			},
			// 批量审核
			batchAudit() {
				const self = this;
				if(self.auditTable.selected.length <= 0) {
					this.$message({ message: '请至少选择一条数据！', type: 'warning' });
					return;
				}
				this.auditDialog.remarkForm.audit = "true";
				this.auditDialog.remarkForm.remark = "";
				this.auditDialog.show = true;
			},
			// 审核
			audit() {
				this.$refs['remarkForm'].validate((valid) => {
					if(valid) {
						var param = {
							idList: this.auditTable.selected.toString(),
							approved: this.auditDialog.remarkForm.audit,
							remark: this.auditDialog.remarkForm.remark
						}
						this.$axios.post('/assets/management/batchAudit',param).then( (res) => {
			        		if(res.status == 200 && res.data) {
								this.$message({ type: 'success', message: '审核成功' });
								this.auditTable.selected.length = 0;
								this.$refs.auditTable.clearSelection();
								this.auditDialog.show = false;
								this.query();
			        		} else {
			        			this.$message({ type: 'error', message: '审核失败' });
			        		}
						});
					}
				});
			}
		}
	}
</script>

<style lang="less">
	.audit-remark {
		padding-top: 50px; height: 250px;
		.el-textarea__inner {
			height: 100px;
		}
	}
</style>