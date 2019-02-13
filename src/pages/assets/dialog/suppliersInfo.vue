<!-- 供应商信息弹窗 -->
<template>
	<el-dialog title="添加供应商" :visible="true" :close-on-click-modal='false' @close="suppliersInfoOperation" width="850px" v-drag>
		<div>
			<div style="padding:10px 10px 10px">
				<div class="tabs-panel-wrap border">
					<div class="panel-header">
						供应商管理
					</div>
					<div class="panel-body" style="min-height:80px; padding-top: 20px;">
						<el-form :inline="true" :model="formData" label-width="125px" ref="suppliersForm" :rules="firstRules">
							<el-form-item label="供应商名称：" prop="name">
								<el-input v-model="formData.name" placeholder="请输入供应商名称"></el-input>
							</el-form-item>
							<el-form-item label="供应商类型：" prop="type">
								<el-select v-model="formData.type" @focus="selectOnFocus">
									<el-option label="生产厂商" value="生产厂商"></el-option>
									<el-option label="代理厂商" value="代理厂商"></el-option>
									<el-option label="运维服务提供商" value="运维服务提供商"></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="联系人：" prop="contacts">
								<el-input v-model="formData.contacts" placeholder="请输入联系人"></el-input>
							</el-form-item>
							<el-form-item label="联系人电话：" prop="phone">
								<el-input v-model="formData.phone" placeholder="请输入联系人电话"></el-input>
							</el-form-item>
							<el-form-item label="联系人邮箱：" prop="email">
								<el-input v-model="formData.email" placeholder="请输入联系人邮箱"></el-input>
							</el-form-item>
						</el-form>
					</div>
				</div>
				<div class="tabs-panel-wrap border">
					<div class="panel-header">
						<div class="panel-header-left">
							<el-button type="normal" icon="el-icon-my-delete" @click="deleteSuppliers">删除</el-button>
						</div>
						<div class="panel-header-right">
							<el-button type="normal" icon="el-icon-my-add" @click="add">添加</el-button>
						</div>
					</div>
					<div class="panel-body supplier-table">
						<el-table :data="data" stripe :fit="true" height="280" ref="multipleTable" style="width: 100%;height: 100%;" @selection-change="suppliersSelection">
							<el-table-column prop="check" label="" align="center" type="selection" :selectable="selectable"></el-table-column>
							<el-table-column label="供应商名称" prop="name" show-overflow-tooltip></el-table-column>
							<el-table-column label="供应商类型" prop="type" show-overflow-tooltip></el-table-column>
							<el-table-column label="主联系人" prop="contacts" show-overflow-tooltip></el-table-column>
						</el-table>
					</div>
					<div class="panel-footer" style="position: inherit;">
						<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" 
							:page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</div>
				</div>
			</div>
		</div>
		<div slot="footer">
			<el-button type="normal" @click="suppliersInfoOperation('save')">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: [ 'assetId' ],
		data() {
			let validator = this.$ies.validator;
			return {
				data: [],					// 表格数据
				selected: [],				// 全部选中的id
				unabledId: [],				// 不能勾选的id
				pageNum: 1,
				pageSize: 10,
				total: 0,
				formData: {
					name: "",				// 供应商名称
					type: "",				// 供应商类型
					contacts: "",			// 联系人
					phone: "",				// 联系人电话
					email: ""				// 联系人邮箱
				},
				firstRules: {
					name: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入供应商名称', trigger: 'blur' },
					],
					type: [
						{ required: true, message: '请选择供应商类型', trigger: 'change' }
					],
					contacts: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入联系人', trigger: 'blur' },
					],
					phone: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入联系人电话', trigger: 'blur' },
						{ validator: validator.mobile, trigger: 'blur' }
					],
					email: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入联系人邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
					],
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.query();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			query() {
				const self = this;
				var param = {
					pageSize: this.pageSize,
					pageNum: this.pageNum,
					assetId: this.assetId
				}
				this.unabledId = [];
				this.$axios.post('/assets/supplier/query',param).then( (res) => {
					if(res.status == 200) {
						this.data = res.data.list;
						this.total = res.data.total;
						
						var i = 0;
						setTimeout(function() {
							var data = res.data.list;
							data.forEach(row => {
								if(row.correlate) {
									self.unabledId.push(row.id);
									i = i + 1;
									self.$refs.multipleTable.toggleRowSelection(row);
								}
							});
							if(i == res.data.list.length) {
								$(".supplier-table thead .el-checkbox").addClass("is-disabled is-checked");
								$(".supplier-table thead .el-checkbox__input").addClass("is-disabled is-checked is-focus");
							}
						},100);
					}
				});
			},
			// 添加
			add() {
				this.$refs['suppliersForm'].validate((valid) => {
					if(valid) {
            			this.$axios.post('/assets/supplier/add',this.formData).then( (res) => {
							if(res.status == 200) {
								this.formData.name = "";
								this.formData.type = "";
								this.formData.contacts = "";
								this.formData.phone = "";
								this.formData.email = "";
								this.$refs['suppliersForm'].resetFields();
								this.query();
								$(".supplier-table thead .el-checkbox").removeClass("is-disabled is-checked");
								$(".supplier-table thead .el-checkbox__input").removeClass("is-disabled is-checked is-focus");
							}
						});
          			}
				});
			},
			// 表格选中数据
			suppliersSelection(v) {
				this.selected = v.map(v => v.id);
				
			},
			selectable(row,index) {
				return row.correlate ? false : true;
			},
			// 回调
			suppliersInfoOperation(type) {
				if(type == 'save') {
					var arr = [];
					for(var i = 0; i < this.selected.length; i++) {
						if(this.unabledId.toString().indexOf(this.selected[i]) < 0) {
							arr.push(this.selected[i]);
						}
					}
					if(arr.length < 1) {
						this.$emit('suppliersInfoHandler',false);
						this.$emit('input', false);
					} else {
						var param = {
							assetId: this.assetId,
							supplierIdList: arr.toString()
						}
						this.$axios.post('/assets/supplier/relationship/add',param).then( (res) => {
							if(res.status == 200) {
								this.$emit('suppliersInfoHandler',true);
								this.$emit('input', false);
							}
						});
					}
				} else {
					this.$emit('suppliersInfoHandler',false);
					this.$emit('input', false);
				}
			},
			handleSizeChange(v) {
				this.pageSize = v;
				this.query();
			},
			handleCurrentChange(v) {
				this.pageNum = v;
				this.query();
			},
			// 删除供应商
			deleteSuppliers() {
				const self = this;

				var arr = this.selected.filter(item => {
					return this.unabledId.toString().indexOf(item) < 0
              	});

				if(arr.length < 1) {
					this.$message({ message: '请至少选择一条未和资产关联的数据！', type: 'warning' });
					return;
				}
				
				self.$confirm('确定删除数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
					
					self.$axios.post("/assets/supplier/batchDelete", {idList: arr.toString()} ).then( (res) => {
						if(res.status == 200 && res.data) {
							self.query();
							self.$message({ type: 'success', message: '删除成功!' });
						} else {
							self.$message({ type: 'warning', message: '删除失败' });
						}
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消操作' });
				});
			}
		}
	}
</script>