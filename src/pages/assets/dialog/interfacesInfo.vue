<!-- 接口信息弹窗 -->
<template>
	<div>
		<el-dialog :title="title" :visible="true" width="780px" custom-class="interfaces-info-dialog" :close-on-click-modal='false' @close="interfacesInfoOperation" v-drag>
			<el-form :model="firstDialog.formData" :rules="firstDialog.rules" ref="firstForm" label-width="150px" :inline="true" style="padding: 30px 0px 20px;">
				<el-form-item label="接口名称：" prop="interfaceName">
					<el-input type="text" v-model="firstDialog.formData.interfaceName" placeholder="请输入接口名称"></el-input>
				</el-form-item>
				<el-form-item label="接口别名：" prop="interfaceAliases">
					<el-input type="text" v-model="firstDialog.formData.interfaceAliases" placeholder="请输入接口别名"></el-input>
				</el-form-item>
				<el-form-item label="接口类型：" prop="interfaceType">
					<el-select v-model="firstDialog.formData.interfaceType" @focus="selectOnFocus">
						<el-option label="路由" value="路由"></el-option>
						<el-option label="交换" value="交换"></el-option>
						<el-option label="VLAN" value="VLAN"></el-option>
						<el-option label="SAN普通光纤" value="SAN普通光纤"></el-option>
						<el-option label="SAN铜缆" value="SAN铜缆"></el-option>
						<el-option label="SAN长波光纤" value="SAN长波光纤"></el-option>
						<el-option label="SCSI" value="SCSI"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="Trunk：">
					<el-radio v-model="firstDialog.formData.interfaceTurnk" label="true">是</el-radio>
					<el-radio v-model="firstDialog.formData.interfaceTurnk" label="false">否</el-radio>
				</el-form-item>
				<el-form-item label="接口索引：" prop="interfaceIndex">
					<el-input type="text" v-model="firstDialog.formData.interfaceIndex" placeholder="请输入接口索引"></el-input>
				</el-form-item>
				<el-form-item label="接口带宽：" prop="interfaceBandwidth">
					<el-input type="text" v-model="firstDialog.formData.interfaceBandwidth" placeholder="请输入接口带宽"></el-input>
				</el-form-item>
				<el-form-item label="mac地址：" prop="interfaceMac">
					<el-input type="text" v-model="firstDialog.formData.interfaceMac" placeholder="请输入mac地址"></el-input>
				</el-form-item>
				<el-form-item label="子网掩码：" prop="interfaceSubnetMask">
					<el-input type="text" v-model="firstDialog.formData.interfaceSubnetMask" placeholder="请输入子网掩码"></el-input>
				</el-form-item>
				<el-form-item label="对端设备：">
					<el-input type="text" v-model="firstDialog.formData.interfaceEndToEndDeviceName" readonly placeholder="请选择对端设备" @focus="selectOnFocus"></el-input>
					<i class="el-icon-my-more" @click="configuration.show = true"></i>
				</el-form-item>
				<el-form-item label="对端接口：" prop="interfaceEndToEndPort">
					<el-input type="text" v-model="firstDialog.formData.interfaceEndToEndPort" placeholder="请输入对端接口"></el-input>
				</el-form-item>
				<el-form-item label="描述：" style="display: block;" class="describe" prop="interfaceDescribe">
					<el-input type="textarea" v-model="firstDialog.formData.interfaceDescribe" placeholder="请输入描述" resize="none"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<el-button type="normal" @click="interfacesInfoOperation('save')">保存</el-button>
			</div>
		</el-dialog>
		<configuration-item v-if="configuration.show" v-model="configuration.show" @assetConfigurationHandler="assetConfigurationHandler" :defaultSelect="firstDialog.formData.interfaceEndToEndDeviceId">
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
				title: "",
				configuration: {
					show: false
				},
				firstDialog: {
					formData: {
						interfaceName: "",					// 接口名称
						interfaceAliases: "",				// 接口别名
						interfaceType: "", 					// 接口类型
						interfaceTurnk: "true",				// Trunk
						interfaceIndex: "",					// 接口索引
						interfaceBandwidth: "",				// 接口带宽
						interfaceMac: "",					// MAC地址
						interfaceSubnetMask: "",			// 子网掩码
						interfaceEndToEndDeviceName: "",	// 对端设备
						interfaceEndToEndDeviceId: "",		// 对端设备ID
						interfaceEndToEndPort: "",			// 对端接口
						interfaceDescribe: "",				// 描述
					},
					rules: {
						interfaceName: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入接口名称', trigger: 'blur' }
						],
						interfaceAliases: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
						],
						interfaceType: [
							{ required: true, message: '请选择接口类型', trigger: 'change' }
						],
						interfaceIndex: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入接口索引', trigger: 'blur' }
						],
						interfaceBandwidth: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
						],
						interfaceMac: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
						],
						interfaceSubnetMask: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
						],
						interfaceEndToEndPort: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
						],
						interfaceDescribe: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				if(this.assetInfo.type == "edit") {
					this.title = "编辑接口信息";
					this.queryDefault();
				} else {
					this.title = "新增接口信息";
					this.$refs['firstForm'].resetFields();
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
					interfaceId: this.assetInfo.id
				}
				this.$axios.post('/assets/interface/detail',param).then( (res) => {
					if(res.status == 200) {
						if(res.data.interfaceTurnk) {
							res.data['interfaceTurnk'] = "true";
						} else {
							res.data['interfaceTurnk'] = "false";
						}
						this.firstDialog.formData = res.data;
					}
				});
			},
			interfacesInfoOperation(type) {
				if(type == 'save') {
					this.$refs['firstForm'].validate((valid) => {
						if(valid) {
							if(this.assetInfo.type == 'add') {
								// 新增
								var param = {};
								for(var item in this.firstDialog.formData) {
									if(this.firstDialog.formData[item] != "" && this.firstDialog.formData[item] != undefined) {
										param[item] = this.firstDialog.formData[item];
									}
								}
								delete param.interfaceEndToEndDeviceName;
								param['assetId'] = this.assetInfo.assetId;
								this.$axios.post('/assets/interface/add',param).then( (res) => {
									if(res.status == 200) {
										if(res.data || res.data == 'true') {
											this.$message({ type: 'success', message: '新增成功!' });
										}
									} else {
										this.$message({ type: 'error', message: '新增失败' });
									}
								});
							} else {
								// 编辑
								var param = this.firstDialog.formData;
								delete param.interfaceEndToEndDeviceName;
								param['assetId'] = this.assetInfo.assetId;
								param['id'] = this.assetInfo.id;
								this.$axios.post('/assets/interface/update',param).then( (res) => {
									if(res.status == 200 && res.data) {
										this.$message({ type: 'success', message: '修改成功!' });
									} else {
										this.$message({ type: 'error', message: '修改失败' });
									}
								});
							}
							this.$emit('interfacesInfoHandler',true);
							this.$emit('input', false);
						} else {
//							console.log('error submit!!');
							return false;
						}
					});
				} else {
					this.$emit('interfacesInfoHandler',false);
					this.$emit('input', false);
				}
			},
			assetConfigurationHandler(data) {
				if(data != "") {
					this.firstDialog.formData.interfaceEndToEndDeviceName = JSON.parse(data).name;
					this.firstDialog.formData.interfaceEndToEndDeviceId = JSON.parse(data).id;
				}
			}
		}
	}
</script>