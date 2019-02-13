<template>
	<div class="itsm-tabs-main personalInfo">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="tabs-panel-wrap border">
					<div style="padding:30px 30px 10px 0">
						<el-form ref="ruleForm" :rules="rules" :model="form" label-width="100px" style="width:330px; margin:0 auto;">
							
							<el-form-item style="text-align:center;">
								<div class="user-photo">
									<img width="100%" :src="upload.dialogImageUrl" alt="头像" />
								</div>
								<el-upload ref="upload" :action="upload.importUrl" :headers="{Token:token}"
									:file-list="upload.fileList" 
									:show-file-list="false" 
									:data="{'createUserId':id}" 
									:multiple="false"
									:before-upload="beforeAvatarUpload"
									:on-change="handleChange"
									:on-success="handleSuccess">
									<el-button type="primary" size="normal" style="display: inline;">更换头像</el-button>
								</el-upload>
								<el-button type="primary" size="normal" @click="changeDefault">恢复默认头像</el-button>
							</el-form-item>
							
							<el-form-item label="姓名：" prop="userName">
								<el-input v-model="form.userName" placeholder="请输入姓名"></el-input>
							</el-form-item>
							<el-form-item label="登录ID：" prop="loginName">
								<el-input v-model="form.loginName" :disabled="true"></el-input>
							</el-form-item>
							<el-form-item label="性别：" prop="sex" required>
								<el-radio v-model="form.sex" label="0">男</el-radio>
								<el-radio v-model="form.sex" label="1">女</el-radio>
							</el-form-item>
							<el-form-item label="手机：" prop="mobile">
								<el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
							</el-form-item>
							<el-form-item label="微信：" prop="wechat">
								<el-input v-model="form.wechat" placeholder="请输入微信"></el-input>
							</el-form-item>
							<el-form-item label="联系电话：" prop="phone">
								<el-input v-model="form.phone" placeholder="请输入联系电话"></el-input>
							</el-form-item>
							<el-form-item label="邮箱：" prop="email">
								<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
							</el-form-item>
							<el-form-item label="钉钉：" prop="dingTalk">
								<el-input v-model="form.dingTalk" placeholder="请输入钉钉"></el-input>
							</el-form-item>
							<el-form-item label="描述：" prop="description">
								<el-input type="textarea" :rows="6" resize="none" v-model="form.description" placeholder="请输入描述"></el-input>
							</el-form-item>
		
							<el-form-item>
								<el-button type="primary" size="normal" @click="submitForm('ruleForm')">保&nbsp;存</el-button>
								<el-button type="primary" size="cancel" @click="cancel">取&nbsp;消</el-button>
							</el-form-item>
						</el-form>
					</div>
			    </div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'personalInfo',
		data() {
			let validator = this.$ies.validator;
			// 验证手机号
			var checkPhone = (rule, value, callback) => {
				var check = /^1[3|4|5|7|8]\d{9}$/;
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
						return callback(new Error('手机号格式不正确'));
					} else {
						return callback();
					}
				} else {
					return callback();
				}
			};
			return {
				token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
				id: "",
				form: {
					userName: "",		// 姓名
					loginName: "",		// 登录ID
					sex: "",			// 性别
					mobile: "",			// 手机
					wechat: "",			// 微信
					phone: "",			// 联系电话
					email: "",			// 邮箱
					dingTalk: "",		// 钉钉
					description: "",	// 描述
				},
				rules: {
					userName: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					loginName: [
						{ required: true, message: '请输入登录ID', trigger: 'blur' }
					],
					sex: [
						{ required: true, message: '请选择性别', trigger: 'change' }
					],
					mobile:[
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: checkPhone, trigger: 'blur' }
					],
					wechat: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} }
					],
					phone: [
						{ validator: validator.space, trigger: 'blur', options: {max:20} }
					],
					email: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
					],
					dingTalk: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} }
					],
					description: [
						{ validator: validator.space, trigger: 'blur', options: {max:200} }
					]
				},
				upload: {
					importUrl: `api/zuul/files/uploadFileReturnIdAndNameAndPath`,
//					importUrl: 'http://192.168.3.32:9100/zuul/uploadFileReturnIdAndNameAndPath',
					fileList: [],
					dialogImageUrl: '/static/img/user/defaultPhoto.png',
				},
			}
		},
		deactivated(){
//			console.log('personalInfo-deactivated事件');
		},
		mounted() {
			this.$nextTick(function() {
				if(this.$store.state.user.info != null) {
					this.detail();
				}
			});
		},
		methods: {
			detail() {
				this.id = this.$store.state.user.info.id;
				this.$axios.post('/itsm/system/sso/index/userInfoDetail',{id:this.id}).then( (res) => {
					if(res.status == 200) {
						this.form.userName = res.data.userName;
						this.form.loginName = res.data.loginName;
						this.form.sex = res.data.sex.toString();
						this.form.phone = res.data.phone;
						this.form.wechat = res.data.wechat;
						this.form.mobile = res.data.mobile;
						this.form.email = res.data.email;
						this.form.dingTalk = res.data.dingTalk;
						this.form.description = res.data.description;
						this.upload.dialogImageUrl = res.data.imagePath;
					}
				});
			},
			// 保存
			submitForm() {
				this.$refs['ruleForm'].validate((valid) => {
					if(valid) {
						var param = this.form;
						param['id'] = this.id;
						this.$axios.post('/itsm/system/sso/index/updatePersonalInfo',param).then( (res) => {
							if(res.status == 200) {
								this.$store.commit('changeUserInfo', this.form);
								this.$message({ type: 'success', message: res.message });
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage("/userCenter/personalInfo");
							} else {
								this.$message({ type: 'error', message: res.message });
							}
						});
					} else {
						return false;
					}
				});
			},
			// 取消
			cancel() {
				this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage("/userCenter/personalInfo");
			},
			// 恢复默认头像
			changeDefault() {
				this.$axios.post('/itsm/system/sso/index/defaultPicture',{id:this.id}).then( (res) => {
					if(res.status == 200) {
						this.upload.dialogImageUrl = res.data;
						this.$message({ type: 'success', message: '更改默认头像成功！' });
						this.$store.commit('changeUserImagePath', res.data);
					} 
				});
			},
			beforeAvatarUpload(file) {
				// image/png  image/jpeg
        		const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        		const isLt50M = file.size / 1024 / 1024 < 50;

		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG,JPEG,PNG 格式!');
		        }
		        if (!isLt50M) {
		          this.$message.error('上传头像图片大小不能超过 50MB!');
		        }
		        return isJPG && isLt50M;
      		},
			handleChange(file, fileList) {
				// image/png  image/jpeg
        		const isJPG = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png';
        		const isLt50M = file.size / 1024 / 1024 < 50;
        		
		        if (!isJPG) {
		          this.$message.error('上传头像图片只能是 JPG,JPEG,PNG 格式!');
		        }
		        if (!isLt50M) {
		          this.$message.error('上传头像图片大小不能超过 50MB!');
		        }
		        if(isJPG && isLt50M) {
		        	this.upload.dialogImageUrl = file.url;
		        }
		        return isJPG && isLt50M;
      		},
      		handleSuccess(response, file, fileList) {
				if(response.status == 200) {
					this.$store.commit('changeUserImagePath', response.data.path);
					this.savePath(response.data.path);
					this.$message({ type: 'success', message: '更改头像成功！' });
				} else {
					this.$message({ type: 'error', message: '更改头像失败' });
				}
      		},
      		savePath(imagePath) {
      			this.$axios.post('/itsm/system/sso/index/saveUploadPicturePath',{imagePath:imagePath}).then( (res) => {
					if(res.status == 200) {
						
					} else {
						console.log("error");
					}
				});
      		}
		}
	};
</script>

<style lang="less" scoped>
	.personalInfo .user-photo{
		margin-bottom: 25px;
		img{
			display:block; margin:0 auto; width:166px; height:166px; border-radius:100%;
		}
		& + div {
			display: inline;
		}
	}
</style>