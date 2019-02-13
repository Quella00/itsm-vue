<!-- 合同信息弹窗 -->
<template>
	<div>
		<el-dialog title="新增合同" :visible="true" @close="contractInfoOperation" :close-on-click-modal='false' custom-class="contractInfo-dialog" v-drag>
			<el-form :model="firstDialog.data" label-width="145px" ref="firstForm" :rules="firstDialog.firstRules" class="contractInfo-form">
				<el-form-item label="合同编码：" prop="code">
					<el-input type="text" auto-complete="off" v-model="firstDialog.data.code" placeholder="请输入合同编码"></el-input>
				</el-form-item>
				<el-form-item label="合同名称：" prop="name">
					<el-input type="text" auto-complete="off" v-model="firstDialog.data.name" placeholder="请输入合同名称"></el-input>
				</el-form-item>
				<el-form-item label="合同类型：" prop="type">
					<el-input type="text" auto-complete="off" v-model="firstDialog.data.type" placeholder="请输入合同类型"></el-input>
				</el-form-item>
				<el-form-item label="负责人：" prop="personInChargeName">
					<el-input type="text" auto-complete="off" readonly v-model="firstDialog.data.personInChargeName" placeholder="请选择负责人" @focus="selectOnFocus"></el-input>
					<i class="el-icon-my-more" @click="secondDialog.show = true"></i>
				</el-form-item>
				<el-form-item label="合同状态：" prop="contractStatus">
					<el-select v-model="firstDialog.data.contractStatus" @focus="selectOnFocus">
						<el-option label="使用中" value="使用中"></el-option>
						<el-option label="已过期" value="已过期"></el-option>
					</el-select>
				</el-form-item>
				<el-upload class="upload-btn" ref="upload" :action="firstDialog.importUrl" :data="{'createUserId':firstDialog.data}" :auto-upload='false' :multiple="false" :limit="1"
					:show-file-list='false' :file-list="firstDialog.fileList" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload" :on-change="handleChange" :headers="{Token:token}">
					<el-button type="normal" icon="el-icon-my-upload" style="width: 100px;">上传附件</el-button>
				</el-upload>
				<div style="text-align: center;" class="ellipsis">
					<span v-if="fileName" :title="fileName">文件名称：{{fileName}}</span>
				</div>
			</el-form>
			<div slot="footer">
				<el-button type="normal" @click="contractInfoOperation('save')">保存</el-button>
			</div>
		</el-dialog>
		<ies-personRadioDialog v-model="secondDialog.show" v-if="secondDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect="secondDialog.selectData">
			
		</ies-personRadioDialog>
	</div>
</template>

<script>
	export default {
		props: [ 'assetId' ],
		data() {
			let validator = this.$ies.validator;
			return {
				token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
				firstDialog: {
					data: {
						code: "",				// 合同编码
						name: "",				// 合同名称
						type: "",				// 合同类型
						personInCharge: "",		// 负责人
						personInChargeName: "",	// 负责人~姓名
						contractStatus: "",		// 合同状态
					},
					firstRules: {
						code: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入合同编码', trigger: 'blur' }
						],
						name: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入合同名称', trigger: 'blur' }
						],
						type: [
							{ validator: validator.space, trigger: 'blur', options: {max:32} },
							{ required: true, message: '请输入合同类型', trigger: 'blur' }
						],
						personInChargeName: [
							{ required: true, message: '请选择负责人', trigger: 'change' }
						],
						contractStatus: [
							{ required: true, message: '请选择合同状态', trigger: 'change' }
						]
					},
					fileList: [],
					importUrl: `api/zuul/files/uploadFileReturnIdAndNameAndPath`,
					chooseFile: false,
				},
				secondDialog: {				// 二级弹窗  人员弹窗
					show: false,
					selectData: {
						id: ''
					}
				},
				loading: null,
				fileName: ""
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.firstDialog.data.personInCharge = "";
				this.$refs['firstForm'].resetFields();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 一级弹窗----------
			// 回调
			contractInfoOperation(type) {
				if(type == 'save') {
					var flag = false;
					this.$refs['firstForm'].validate((valid) => {
						if(valid) {
							if(this.firstDialog.chooseFile) {
								flag = true;
							} else {
								this.$message({ type: 'warning', message: '请上传文件' });
							}
						} else {
							return false;
						}
					});
					if(flag) {
						this.firstDialog.data['assetId'] = this.assetId;
						this.$refs.upload.submit();
						this.firstDialog.show = false;
					}
				} else {
					this.$emit('input',false);
					this.$emit('contractInfoHandler',false);
				}
			},
			// 上传附件
			isFile(name) {
	        	var suffixArr = ".txt,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.png,.gif,.jpg,.rar,.zip.pdf";
	        	return suffixArr.indexOf(name.substring(name.lastIndexOf('.')));
			},
			handleSuccess(response, file, fileList) {
				if(response) {
					this.$message({ type: 'success', message: '新增合同成功!' });
					this.savePath(response.data.id);
				} else {
					this.$message({ type: 'error', message: '新增合同失败!' });
				}
				this.loading.close();
				this.$emit('input',false);
				this.$emit('contractInfoHandler',true);
			},
			savePath(id) {
      			this.$axios.post('/assets/contract/add',{
      				fileId: id,
//    				contract: this.firstDialog.data,
      				assetId: this.assetId,
      				code: this.firstDialog.data.code,				// 合同编码
					name: this.firstDialog.data.name,				// 合同名称
					type: this.firstDialog.data.type,				// 合同类型
					personInCharge: this.firstDialog.data.personInCharge,		// 负责人
					personInChargeName: this.firstDialog.data.personInChargeName,	// 负责人~姓名
					contractStatus: this.firstDialog.data.contractStatus,		// 合同状态
      			}).then( (res) => {
					if(res.status == 200) {

					} 
				});
      		},
			handleError(err, file, fileList) {
				this.$message({ type: 'error', message: '新增合同失败' });
			},
			beforeUpload(file) {
				if(file.size > 52428800) {
	        		this.$message({ type: 'warning', message: '文件大小不能超过50M!' });
	        		return false;
	        	} else {
	        		if(this.isFile(file.name) >= 0) {
	        			this.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						});
		        		return true;
		        	} else {
		        		this.$message({ type: 'warning', message: '上传文件格式错误' });
		        		return false;
		        	}
	        	}
			},
			handleChange(file, fileList) {
				this.fileName = file.name;
				this.firstDialog.chooseFile = true;
			},
			// 人员弹窗----------
			selectPersonRadioHandler(data) {
	      		this.firstDialog.data.personInCharge = JSON.parse(data).id;
	      		this.firstDialog.data.personInChargeName = JSON.parse(data).userName;
	      		this.secondDialog.selectData.id = JSON.parse(data).id;
	      	}
		}
	}
</script>