<!--邮件发送配置-->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="system-communication-content">
					<el-form label-width="200px" :model="ruleForm" :rules="rules" ref="ruleForm" class="email-form">

						<el-form-item label="配置类型：" prop="type">
							<el-checkbox-group v-model="ruleForm.type">
								<el-checkbox label="smtp">SMTP</el-checkbox>
							</el-checkbox-group>
						</el-form-item>

						<el-form-item label="主机地址：" prop="host">
							<el-input v-model="ruleForm.host" placeholder="请输入主机地址"></el-input>
						</el-form-item>

						<el-form-item label="SSL/TLS：" style="display: inline-block;">
							<el-switch v-model="ruleForm.useSsl" :width=55></el-switch>
						</el-form-item>
						
						<el-form-item label="端口：" class="port" style="display: inline-block;margin-left: 84px;" prop="port">
							<el-input v-model="ruleForm.port" placeholder="请输入端口"></el-input>
						</el-form-item>

						<el-form-item label="邮箱账号：" prop="mailFrom">
							<el-input v-model="ruleForm.mailFrom" style="display: inline;" placeholder="请输入邮箱账号"></el-input>
							<span class="tips">邮箱账号指用户用于对外收邮件的账号如：demo@demoservice.com</span>
						</el-form-item>

						<el-form-item label="登录账号：" prop="personal">
							<el-input v-model="ruleForm.personal" style="display: inline;" placeholder="请输入登录账号"></el-input>
							<span class="tips">指登录邮箱时使用的用户名</span>
						</el-form-item>

						<el-form-item label="登录密码：" prop="password">
							<el-input type="password" v-model="ruleForm.password" placeholder="请输入登录密码"></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="normal" icon="el-icon-my-test" @click="openDialog">测试</el-button>
						</el-form-item>

						<el-form-item label="定时天(周天)：" prop="timingDay" class="timing-day">
							<el-checkbox-group v-model="ruleForm.timingDay">
								<el-checkbox v-for="item in timingDayList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>

						<el-form-item label="定时小时(24小时)：" required class="timing-hour" prop="endHour">
							<el-select v-model="ruleForm.startHour" @focus="selectOnFocus">
								<el-option v-for="item in timingHour" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							时&nbsp;&nbsp;
							<el-select v-model="ruleForm.startMinute" @focus="selectOnFocus">
								<el-option v-for="item in timingMinute" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							分 &nbsp;&nbsp;&nbsp;&nbsp;至&nbsp;&nbsp;&nbsp;&nbsp;
							<el-select v-model="ruleForm.endHour" @focus="selectOnFocus">
								<el-option v-for="item in timingHour" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							时&nbsp;&nbsp;
							<el-select v-model="ruleForm.endMinute" @focus="selectOnFocus">
								<el-option v-for="item in timingMinute" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							分
						</el-form-item>

						<el-form-item>
							<el-button type="normal" icon="el-icon-my-save" @click="save('ruleForm')">保存</el-button>
							<el-button type="normal" icon="el-icon-my-reset" @click="empty">重置</el-button>
						</el-form-item>

					</el-form>
				</div>
			</ies-scrollbar>
			
			<el-dialog title="邮件测试" :visible.sync="dialogVisible" :close-on-click-modal='false' @close="closeDialog" custom-class="system-communication-dialog" v-drag>
				<el-form :model="dialogForm" :rules="dialogRules" ref="dialogForm" :inline="true" label-width="113px">
					<el-form-item label="邮箱地址：" prop="emailAddress" class="address">
						<el-input v-model="dialogForm.emailAddress" placeholder="请输入邮箱地址"></el-input>
					</el-form-item>
					<el-form-item label="邮件内容：" prop="emailContent" class="content">
						<el-input type="textarea" v-model="dialogForm.emailContent" placeholder="请输入邮件内容" resize="none"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer">
					<el-button type="normal" @click="dialogSave">发送</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'emailSendingConfig',
		data() {
			let validator = this.$ies.validator;
			// 验证主机地址(ip)
			var checkHost = (rule, value, callback) => {
				var check = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
				if(!check.test(value)) {
					return callback(new Error('主机地址格式不正确,请重新输入'));
				} else {
					return callback();
				}
			};
			// 验证结束时间大于开始时间
			var checkTime = (rule, value, callback) => {
				if(this.ruleForm.startHour == this.ruleForm.endHour) {
					if(this.ruleForm.startMinute > this.ruleForm.endMinute) {
						return callback(new Error('结束时间应大于开始时间,请重新选择'));
					} else {
						return callback();
					}
				} else if(this.ruleForm.startHour > this.ruleForm.endHour) {
					return callback(new Error('结束时间应大于开始时间,请重新选择'));
				} else {
					return callback();
				}
			};
			return {
				ruleForm: {
					type: ["smtp"],					// 配置类型
					host: "",						// 主机地址
					useSsl: true,					// SSL/TLS
					port: "",						// 端口
					mailFrom: "",					// 邮箱账号
					personal: "",					// 登录账号
					password: "",					// 登录密码
					timingDay: [1, 2, 3, 4, 5, 6, 7],
					startHour: '00',
					startMinute: '00',
					endHour: 23,
					endMinute: 59
				},
				rules: {
					type: [
						{ type: 'array', required: true, message: '请勾选配置类型', trigger: 'change' }
					],
					host: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入主机地址', trigger: 'blur' },
//						{ validator: checkHost, trigger: 'blur' }
					],
					port: [ 
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入端口', trigger: 'blur' },
						{ validator: validator.num, trigger: 'blur' }
					],
					mailFrom: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入邮箱账号', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
					],
					personal: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入登录账号', trigger: 'blur' }
					],
					password: [
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
						{ required: true, message: '请输入登录密码', trigger: 'blur' }
					],
					timingDay: [
						{ type: 'array', required: true, message: '请至少选择一天', trigger: 'change' }
					],
					endHour: [
						{ validator: checkTime, trigger: 'change' }
					]
				},
				// 定时周天
				timingDayList: [
					{ name: "周一", id: 1 }, 
					{ name: "周二", id: 2 }, 
					{ name: "周三", id: 3 }, 
					{ name: "周四", id: 4 }, 
					{ name: "周五", id: 5 }, 
					{ name: "周六", id: 6 }, 
					{ name: "周日", id: 7 }
				],
				// 弹出框
				dialogVisible: false,
				dialogForm: {
					emailAddress: "",
					emailContent: ""
				},
				dialogRules: {
					emailAddress: [
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入邮箱地址', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
					],
					emailContent: [
						{ validator: validator.space, trigger: 'blur', options: {max:500} },
						{ required: true, message: '请输入邮箱内容', trigger: 'blur' }
					]
				}
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				this.queryData();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 页面请求数据
			queryData() {
				this.$axios.post('/email/query',{ }).then( (res) => {
					this.ruleForm.type = res.data.type == "smtp" ? ["smtp"] : [];
					this.ruleForm.host = res.data.host;
					this.ruleForm.useSsl = res.data.useSsl;
					this.ruleForm.port = res.data.port;
					this.ruleForm.mailFrom = res.data.mailFrom;
					this.ruleForm.personal = res.data.personal;
					this.ruleForm.password = res.data.password;
					this.ruleForm.startHour = res.data.beginTime ? res.data.beginTime.substring(0,res.data.beginTime.indexOf(':')) : '00';
					this.ruleForm.startMinute = res.data.beginTime ? res.data.beginTime.substring(res.data.beginTime.indexOf(':')+1) : '00';
					this.ruleForm.endHour = res.data.endTime ? res.data.endTime.substring(0,res.data.endTime.indexOf(':')) : '23';
					this.ruleForm.endMinute = res.data.endTime ? res.data.endTime.substring(res.data.endTime.indexOf(':')+1) : '59';
					this.ruleForm.timingDay = [];
					var week = res.data.week;
					for(var i=0;i<week.length;i++) {
						if(week[i]) {
							this.ruleForm.timingDay.push(i+1);
						} 
					}
				});
			},
			// 打开测试弹窗
			openDialog() {
				var flag = true;
				this.$refs['ruleForm'].validateField('type',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				this.$refs['ruleForm'].validateField('host',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				this.$refs['ruleForm'].validateField('mailFrom',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				this.$refs['ruleForm'].validateField('personal',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				this.$refs['ruleForm'].validateField('password',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				this.$refs['ruleForm'].validateField('port',(valid) => {
					if(valid) {
						flag = false;
					}
				});
				if(flag) {
					this.dialogVisible = true;
				}
			},
			// 弹出框保存
			dialogSave() {
				this.$refs['dialogForm'].validate((valid) => {
					if(valid) {
						var config = {
							host: this.ruleForm.host,
							mailFrom: this.ruleForm.mailFrom,
							password: this.ruleForm.password,
							personal: this.ruleForm.personal,
							port: this.ruleForm.port,
							useSsl: this.ruleForm.useSsl,
							content: this.dialogForm.emailContent,
							to: this.dialogForm.emailAddress
						}
						this.$axios.post('/email/smtp',config ).then( (res) => {
							if(res != undefined) {
								if(res.status == 200) {
									this.dialogVisible = false;
									this.$message({ message: '发送成功', type: 'success' });
								}else {
									this.$message({ message: '邮箱服务器配置错误', type: 'warning' });
								}
							} else {
								this.$message({ message: '邮件服务器配置错误', type: 'error' });
							}
						});
					}
				});
			},
			// 保存
			save() {
				this.$refs['ruleForm'].validate((valid) => {
					if(valid) {
						var week = [];
						for(var i = 1; i < 8; i++) {
							if(this.ruleForm.timingDay.indexOf(i) < 0) {
								week.push(false);
							}else {
								week.push(true);
							}
						}
						var config = {
							host: this.ruleForm.host,
							mailFrom: this.ruleForm.mailFrom,
							password: this.ruleForm.password,
							personal: this.ruleForm.personal,
							port: this.ruleForm.port,
							useSsl: this.ruleForm.useSsl,
							beginTime: this.ruleForm.startHour + ':' + this.ruleForm.startMinute,
							endTime: this.ruleForm.endHour + ':' + this.ruleForm.endMinute,
							week: week
						}
						this.$axios.post('/email/save',config ).then( (res) => {
							if(res != undefined) {
								if(res.status == 200) {
									this.$message({ message: '保存成功', type: 'success' });
								}else {
									this.$message({ message: '邮箱服务器配置错误', type: 'warning' });
								}
							}else {
								this.$message({ message: '邮箱服务器配置错误', type: 'warning' });
							}
						});
					} else {
						return false;
					}
				});
			},
			// 重置
			empty() {
				this.ruleForm.useSsl = true;
				this.ruleForm.startHour = '00';
				this.ruleForm.startMinute = '00';
				this.ruleForm.endHour = 23;
				this.ruleForm.endMinute = 59;
				this.$refs.ruleForm.resetFields();
			},
			closeDialog() {
				this.$refs.dialogForm.resetFields();
			}
		},
		computed: {
			timingHour() {
				var hourList = [];
				for(var i = 0; i < 24; i++) {
					if(i < 10) {
						hourList.push({ 'name':'0'+i, 'id':'0'+i });
					}else {
						hourList.push({ 'name':i, 'id':i });
					}
				}
				return hourList;
			},
			timingMinute() {
				var minuteList = [];
				for(var i = 0; i < 60; i++) {
					if(i < 10) {
						minuteList.push({ 'name':'0'+i, 'id':'0'+i });
					}else {
						minuteList.push({ 'name':i, 'id':i });
					}
				}
				return minuteList;
			}
		}
	}
</script>