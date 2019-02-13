<!-- 关联资产弹窗 -->
<template>
	<div>
		<el-dialog :title="title" :visible="true" custom-class="associated-asset-dialog" :close-on-click-modal='false' @close="associatedAssetOperation" v-drag>
			<el-form :model="firstDialog.data" label-width="150px" :inline="true" class="asset-query" ref="firstForm" :rules="firstDialog.firstRules">
				<el-form-item label="源配置项：" required>
					<el-tooltip class="item" effect="dark" :content="this.assetInfo.assetName" placement="top-start">
						<el-input v-model="this.assetInfo.assetName" readonly class="source-configuration-item"></el-input>
					</el-tooltip>
				</el-form-item>
				
				<el-form-item label="关系：" class="relation" prop="relationshipName">
					<el-select v-model="firstDialog.data.relationshipName" @focus="selectOnFocus">
						<el-option v-for="item in firstDialog.relationList" :label="item.relationshipName" :value="item.relationshipName" :key="item.id"></el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="目标配置项：" class="target-configuration-item" prop="targetAssetName">
					<el-input type="text" auto-complete="off" readonly v-model="firstDialog.data.targetAssetName" placeholder="请选择目标配置项" @focus="selectOnFocus"></el-input>
					<el-button type="normal" icon="el-icon-my-add" @click="configuration.show = true">添加</el-button>
				</el-form-item>
				
				<el-form-item label="备注：" style="display: block;" prop="remark">
					<el-input type="textarea" auto-complete="off" v-model="firstDialog.data.remark" placeholder="请输入备注" resize="none"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="normal" @click="associatedAssetOperation('save')">保存</el-button>
			</div>
		</el-dialog>
		<configuration-item v-if="configuration.show" v-model="configuration.show" @assetConfigurationHandler="assetConfigurationHandler" :defaultSelect="firstDialog.data.targetAssetId">
		</configuration-item>
	</div>
</template>

<script>
	import configurationItem from './associatedAssetConfigurationItem.vue'
	
	export default {
		components: {
			configurationItem
		},
		props: [ 'assetInfo' ],
		data() {
			let validator = this.$ies.validator;
			return {
				title: "",						// 弹窗名称
				configuration: {
					show: false
				},
				firstDialog: {
					relationList: [],			// 关系下拉框
					data: {
						relationshipName: "",	// 关系
						targetAssetId: "",		// 目标配置项id
						targetAssetName: "",	// 目标配置项~名字
						remark: "",				// 备注
					},
					firstRules: {
						relationshipName: [
							{ required: true, message: '请选择关系', trigger: 'change' }
						],
						targetAssetName: [
							{ required: true, message: '请选择目标配置项', trigger: 'change' }
						],
						remark: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
				},
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.queryAssociatedAssetRelation();
				if(this.assetInfo.type == "edit") {
					this.queryDefault();
					this.title = "编辑关联配置";
				} else {
					this.$refs['firstForm'].resetFields();
					this.title = "新增关联配置";
				}
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 编辑
			queryDefault() {
				var param = {
					associatedId: this.assetInfo.editId
				}
				this.$axios.post('/assets/associated/detail',param).then( (res) => {
					if(res.status == 200) {
						this.firstDialog.data = res.data;
					}
				});
			},
			// 关联资产  关系下拉框
			queryAssociatedAssetRelation() {
				this.$axios.post('/assets/relationship/init').then( (res) => {
					if(res.status == 200) {
						this.firstDialog.relationList = res.data;
					}
				});
			},
			associatedAssetOperation(type) {
				if(type == 'save') {
					this.$refs['firstForm'].validate((valid) => {
						if(valid) {
							var param = this.firstDialog.data;
							delete param.targetAssetName;
							var url = "";
							if(this.assetInfo.type == "add") {
								param['sourceAssetId'] = this.assetInfo.addId;
								url = '/assets/associated/add';
							} else {
								param['id'] = this.assetInfo.editId;
								url = '/assets/associated/update';
							}
							this.$axios.post(url,param).then( (res) => {
								if(res.status == 200 && res.data) {
									if(this.assetInfo.type == "add") {
										this.$message({ type: 'success', message: '新增成功!' });
									} else {
										this.$message({ type: 'success', message: '修改成功!' });
									}
								}
							});
							this.$emit('associatedAssetHandler',true);
							this.$emit('input', false);
						} else {
//							console.log('error submit!!');
							return false;
						}
					});
				} else {
					this.$emit('associatedAssetHandler',false);
					this.$emit('input', false);
				}
			},
			assetConfigurationHandler(data) {
				if(data != "") {
					this.firstDialog.data.targetAssetName = JSON.parse(data).name;
					this.firstDialog.data.targetAssetId = JSON.parse(data).id;
				}
			}
		}
	}
</script>

<style lang="less">
	.source-configuration-item .el-input__inner {
		border: none; width: 80px; padding: 0;
	}
</style>