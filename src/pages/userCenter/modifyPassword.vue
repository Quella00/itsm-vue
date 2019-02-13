<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border" v-autoHeight>

				<el-form ref="form" :model="form" :rules="rules" label-width="110px" style="width:450px; margin:80px auto 0;">
					<el-form-item label="原密码：" prop="oldPwd">
						<el-input type="password" v-model="form.oldPwd" placeholder="请输入原密码"></el-input>
					</el-form-item>
					<el-form-item label="新密码：" prop="newPwd">
						<el-input type="password" v-model="form.newPwd" placeholder="请输入新密码"></el-input>
					</el-form-item>
					<el-form-item label="重复新密码：" prop="repeatPwd">
						<el-input type="password" v-model="form.repeatPwd" placeholder="请重复输入新密码"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="normal" @click="save">确&nbsp;定</el-button>
					</el-form-item>
				</el-form>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'modifyPassword',
		data() {
			let validator = this.$ies.validator;
			// 验证密码一致
			var checkRepeatPwd = (rule, value, callback) => {
				if(value != this.form.newPwd) {
					return callback(new Error('两次密码输入不一致，重新输入'));
				} else {
					return callback();
				}
			};
			// 密码只能是字母或数字
			var checkPwd = (rule, value, callback) => {
				var check = /^(\d|[a-zA-Z])+$/;
				if(!check.test(value)) {
					return callback(new Error('密码只能是字母或数字,请重新输入'));
				} else {
					return callback();
				}
			};
			return {
				form: {
					oldPwd: '',
					newPwd: '',
					repeatPwd: ''
				},
				rules: {
					oldPwd: [
						{ validator: validator.space, trigger: 'blur', options: {min:6,max:20} },
						{ required: true, message: '请输入原密码', trigger: 'blur' }
					],
					newPwd: [
						{ validator: validator.space, trigger: 'blur', options: {min:6,max:20} },
						{ required: true, message: '请输入新密码', trigger: 'blur' },
						{ validator: checkPwd, trigger: 'blur' }
					],
					repeatPwd: [
						{ validator: validator.space, trigger: 'blur', options: {min:6,max:20} },
						{ required: true, message: '请重复输入新密码', trigger: 'blur' },
						{ validator: checkRepeatPwd, trigger: 'blur' }
					]
				}
			}
		},
//		deactivated( v ){
//			console.log('mod事件');
//			if(v) {
//				this.$destroy();
//			}
//		},
		mounted() {
			this.$nextTick(function() {
				this.init();
			});
		},
		activated() {
			//this.$nextTick(this.init);
		},
		methods: {
			init() {
				this.$refs['form'].resetFields();
			},
			save() {
				this.$refs['form'].validate((valid) => {
					if(valid) {
						const key = CryptoJS.enc.Utf8.parse("abcdefgabcdefg12");
	                    const oldPassword = CryptoJS.AES.encrypt(this.form.oldPwd, key, {
	                        mode: CryptoJS.mode.ECB,
	                        padding: CryptoJS.pad.Pkcs7
	                    }).toString();
	                    const novelPassword = CryptoJS.AES.encrypt(this.form.repeatPwd, key, {
	                        mode: CryptoJS.mode.ECB,
	                        padding: CryptoJS.pad.Pkcs7
	                    }).toString();
						var param = {
							oldPassword: oldPassword,
							novelPassword: novelPassword,
//							id: this.$store.state.user.info.id
						}
						this.$axios.post('/itsm/system/sso/index/updatePassword',param).then( (res) => {
							if(res.status == 200) {
								this.$message({ message: res.message, type: 'success' });
								this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/userCenter/modifyPassword');         
							} else {
								this.$message({ message: res.message, type: 'error' });
							}
						});
					}
				});
			}
		}
	};
</script>

<style>

</style>