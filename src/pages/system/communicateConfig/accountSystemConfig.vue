<!--LDAP-->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="system-communication-content">
					<el-form label-width="200px" :model="ruleForm" :rules="rules" ref="ruleForm">

						<el-form-item label="LDAP/AD同步：">
							<el-checkbox label="open" v-model="ruleForm.ldap">打开</el-checkbox>
						</el-form-item>

						<el-form-item label="配置类型：">
							<el-checkbox label="SMTP" v-model="ruleForm.configurationType">SMTP</el-checkbox>
						</el-form-item>

						<el-form-item label="主机地址：" prop="hostAddress">
							<el-input v-model="ruleForm.hostAddress" placeholder="请输入主机地址"></el-input>
						</el-form-item>

						<el-form-item label="访问端口：" prop="accessPort">
							<el-input v-model="ruleForm.accessPort" placeholder="请输入访问端口"></el-input>
						</el-form-item>

						<el-form-item label="登录账号：" prop="loginAccount">
							<el-input v-model="ruleForm.loginAccount" style="display: inline;" placeholder="请输入登录账号"></el-input>
							<span class="tips">AD格式: user@domain.com 其他:userDN*</span>
						</el-form-item>

						<el-form-item label="登录密码：" prop="loginPwd">
							<el-input type="password" v-model="ruleForm.loginPwd" placeholder="请输入登录密码"></el-input>
						</el-form-item>

						<el-form-item label="LDAP/AD基准点：" prop="benchmark">
							<el-input v-model="ruleForm.benchmark" placeholder="请输入LDAP/AD基准点"></el-input>
						</el-form-item>

						<el-form-item>
							<el-button type="normal" icon="el-icon-my-test" @click="test">测试</el-button>
						</el-form-item>

						<el-form-item label="LDAP/AD用户根节点：" style="margin-top: 50px;">
							<el-input style="display: inline;" v-model="ruleForm.rootNode" placeholder="请输入LDAP/AD用户根节点"></el-input>
							<span class="tips">同步时的起始(根)节点名称</span>
						</el-form-item>

						<el-form-item label="属性列表：">
							<el-select v-model="ruleForm.property" @focus="selectOnFocus">
								<el-option v-for="item in propertyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
							</el-select>
							<el-button type="normal" icon="el-icon-my-add" style="display: inline; width: 95px;" @click="addPropertyVisible = true">添加属性</el-button>
							<span class="tips">属性列表中的"Object.dn","ObjectClass.person","ObjectClass.org"必须配置映射，否则无法从服务器上获取数据！</span>
						</el-form-item>

						<el-form-item label="属性映射：">
							<el-input style="display: inline;" v-model="ruleForm.attributeMapping" placeholder="请输入属性映射"></el-input>
						</el-form-item>

						<el-form-item label="生效映射：">
							<el-input type="textarea" v-model="ruleForm.effectMapping" placeholder="请输入生效映射"></el-input>
							<el-button type="normal" icon="el-icon-my-delete">删除</el-button>
						</el-form-item>

						<el-form-item label="定时天(周天)：" prop="timingDay">
							<el-checkbox-group v-model="ruleForm.timingDay">
								<el-checkbox v-for="item in timingDayList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>

						<el-form-item label="定时小时(24小时)：" required class="timing-hour">
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
			
			<el-dialog title="添加属性" :visible.sync="addPropertyVisible" custom-class="system-communication-dialog" v-drag>
				<el-tree :data="data3" show-checkbox node-key="id" :default-expand-all="true"></el-tree>
				<div slot="footer">
					<el-button type="normal" @click="saveProperty">保存</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'accountSystemConfig',
		data() {
			let validator = this.$ies.validator;
			// 验证ip
			var checkIp = (rule, value, callback) => {
				var check = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
				if(!check.test(value)) {
					return callback(new Error('主机地址格式不正确,请重新输入'));
				} else {
					return callback();
				}
			};
			return {
				ruleForm: {
					ldap: ["open"],
					configurationType: ['SMTP'],
					hostAddress: "",
					accessPort: "",
					loginAccount: "",
					loginPwd: "",
					benchmark: "",
					ssl: true,
					port: "",
					emailAccount: "",
					rootNode: "",
					property: "UserInfotbenan.sreaN",
					attributeMapping: "",
					effectMapping: "",
					timingDay: [1, 2, 3, 4, 5, 6, 7],
					startHour: 0,
					startMinute: 0,
					endHour: 0,
					endMinute: 0
				},
				rules: {
					hostAddress: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入主机地址', trigger: 'blur' },
						{ validator: checkIp, trigger: 'blur' }
					],
					accessPort: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入访问端口', trigger: 'blur' },
						{ validator: validator.num, trigger: 'blur' }
					],
					loginAccount: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入登录账号', trigger: 'blur' }
					],
					loginPwd: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入登录密码', trigger: 'blur' }
					],
					benchmark: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入LDAP/AD基准点', trigger: 'blur' }
					],
					timingDay: [
						{ type: 'array', required: true, message: '请至少选择一天', trigger: 'change' }
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
				// 属性列表
				propertyList: [{
					name: "UserInfotbenan.sreaN",
					id: 1
				}, {
					name: "UserInfotbenan.sreaN",
					id: 2
				}, {
					name: "UserInfotbenan.sreaN",
					id: 3
				}],
				// 添加属性 弹出框
				addPropertyVisible: false,
				// 添加属性 弹出框 的数据
				data3: [{
					id: 1,
					label: '全选/全取消',
					children: [{
						id: 1 - 1,
						label: 'userName'
					}, {
						id: 1 - 2,
						label: 'userCode'
					}, {
						id: 1 - 3,
						label: 'loginName'
					}, {
						id: 1 - 4,
						label: 'organise'
					}, {
						id: 1 - 5,
						label: 'code'
					}, {
						id: 1 - 6,
						label: 'name'
					}]
				}]
			}
		},
		mounted() {
			this.$nextTick(()=>{
				this.query();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			query() {
				this.$axios.post('/itsm/system/communication/ldap/queryLdapInfo').then( (res) => {
					if(res.status == 200) {
						this.ruleForm.loginAccount = res.data.userName;
						this.ruleForm.loginPwd = res.data.password;
						this.ruleForm.benchmark = res.data.domain;
						this.ruleForm.hostAddress = res.data.url.substring(7, res.data.url.lastIndexOf(':'));
						this.ruleForm.accessPort = res.data.url.substring(res.data.url.lastIndexOf(':') + 1, res.data.url.length - 1);
					}
				});
			},
			// 测试
			test() {
				this.$refs["ruleForm"].validate((valid) => {
					if(valid) {
						this.$axios.post('/itsm/system/communication/ldap/authenricateLdap').then( (res) => {
							if(res.status == 200) {
								this.$message({ message: res.message, type: 'success' });
							} else {
								this.$message({ message: res.message, type: 'error' });
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 保存
			save(formName) {
//				this.$refs[formName].validate((valid) => {
//					if(valid) {
//						this.$message({
//							message: '保存成功',
//							type: 'success'
//						});
//					} else {
//						console.log('error submit!!');
//						return false;
//					}
//				});
			},
			// 重置
			empty() {
				//this.$message({ message: '保存成功', type: 'success' });
				this.$refs.ruleForm.resetFields();
			},
			// 保存添加属性
			saveProperty() {
				this.addPropertyVisible = false;
			},
			closeDialog() {
				//this.$refs.dialogForm.resetFields();
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