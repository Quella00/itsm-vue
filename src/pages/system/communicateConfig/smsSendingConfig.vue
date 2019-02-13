<!--短信发送配置-->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="system-communication-content">
					<el-form label-width="200px" :model="ruleForm" :rules="rules" ref="ruleForm" class="sms-form">
						<el-form-item label="发送方式：" required class="form-item">
							<el-input v-model="ruleForm.sendType" :disabled="true"></el-input>
						</el-form-item>

						<el-form-item label-width="0px" class="form-item sms-short-input">
							<el-form-item label="串口号：" prop="comPort" style="display: inline-block;">
								<el-input v-model="ruleForm.comPort" placeholder="请输入串口号"></el-input>
							</el-form-item>
							<el-form-item label="波特率：" prop="baudRate" label-width="140px" style="display: inline-block;">
								<el-select v-model="ruleForm.baudRate" @focus="selectOnFocus">
									<el-option label="9600" value="9600"></el-option>
									<el-option label="19200" value="19200"></el-option>
									<el-option label="57600" value="57600"></el-option>
									<el-option label="115200" value="115200"></el-option>
								</el-select>
							</el-form-item>
						</el-form-item>

						<el-form-item label-width="0px" class="form-item sms-short-input">
							<el-form-item label="短信中心号码：" prop="sendSim" style="display: inline-block;">
								<el-input v-model="ruleForm.sendSim" placeholder="请输入短信中心号码"></el-input>
							</el-form-item>
							<el-form-item label="国家代码：" label-width="140px" style="display: inline-block;" required>
								<el-input v-model="ruleForm.countryCode" :disabled="true"></el-input>
							</el-form-item>
						</el-form-item>
						
						<el-form-item label-width="0px" class="form-item sms-short-input">
							<el-form-item label="制造商：" prop="manufacturer" style="display: inline-block;">
								<el-input v-model="ruleForm.manufacturer" placeholder="请输入制造商"></el-input>
							</el-form-item>
							<el-form-item label="设备名：" prop="model" label-width="140px" style="display: inline-block;">
								<el-input v-model="ruleForm.model" placeholder="请输入设备名"></el-input>
							</el-form-item>
						</el-form-item>
						
						<el-form-item label="测试手机号：" prop="phone" class="form-item sms-short-input">
							<el-input v-model="ruleForm.phone" placeholder="请输入测试手机号"></el-input>
						</el-form-item>

						<el-form-item label="定时天(周天)：" prop="timingDay" class="form-item">
							<el-checkbox-group v-model="ruleForm.timingDay">
								<el-checkbox v-for="item in timingDayList" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>

						<el-form-item label="定时小时(24小时)：" required class="form-item timing-hour" prop="endHour">
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
						
						<el-form-item class="form-item sms-btn">
							<el-button type="normal" icon="el-icon-my-save" @click="save('ruleForm')" class="email-btn">保存</el-button>
							<el-button type="normal" icon="el-icon-my-reset" @click="empty">重置</el-button>
						</el-form-item>
					</el-form>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'smsSendingConfig',
		data() {
			let validator = this.$ies.validator;
			// 验证结束时间大于等于开始时间
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
					sendType: "短信猫", 		// 发送方式
					comPort: "/dev/ttyUSB0",// 串口号
					baudRate: "9600", 		// 波特率
					sendSim: "", 			// 短信中心号码
					countryCode: "86",		// 国家代码
					manufacturer: "Siemens",// 制造商
					model: "短信猫",			// 设备名
					phone: "",				// 测试手机号
					timingDay: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
					startHour: '00',
					startMinute: '00',
					endHour: 23,
					endMinute: 59
				},
				rules: {
					comPort: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入串口号', trigger: 'blur' }
					],
					baudRate: [
						{ required: true, message: '请选择波特率', trigger: 'change' }
					],
					sendSim: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入短信中心号码', trigger: 'blur' },
						{ validator: validator.mobile, trigger: 'blur' }
					],
					manufacturer: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入制造商', trigger: 'blur' },
					],
					model: [
						{ validator: validator.space, trigger: 'blur', options:{max:32} },
						{ required: true, message: '请输入设备名', trigger: 'blur' },
					],
					phone: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入测试手机号', trigger: 'blur' },
						{ validator: validator.mobile, trigger: 'blur' }
					],
					timingDay: [
						{ type: 'array', required: true, message: '请至少选择一天', trigger: 'change' }
					],
					endHour: [
						{ validator: checkTime, trigger: 'change' }
					]
				},
				// 定时天
				timingDayList: [
					{ name: "周一", id: 'monday' }, 
					{ name: "周二", id: 'tuesday' }, 
					{ name: "周三", id: 'wednesday' }, 
					{ name: "周四", id: 'thursday' }, 
					{ name: "周五", id: 'friday' }, 
					{ name: "周六", id: 'saturday' }, 
					{ name: "周日", id: 'sunday' }
				]
			};
		},
		mounted() {
			this.$nextTick( ()=>{

			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			save() {
				this.$refs['ruleForm'].validate((valid) => {
					if(valid) {
						var startTime = this.ruleForm.startHour + ':' + this.ruleForm.startMinute;
						var endTime = this.ruleForm.endHour + ':' + this.ruleForm.endMinute;
						var param = {
							baudRate: this.ruleForm.baudRate,			// 波特率
							comPort: this.ruleForm.comPort,				// 串口号
							sendSim: this.ruleForm.sendSim,				// 短信中心号码
							manufacturer: this.ruleForm.manufacturer,	// 制造商
							model: this.ruleForm.model,					// 设备名
							phone: this.ruleForm.phone,					// 测试手机号
							startTime: startTime,
							endTime: endTime,
							week: this.ruleForm.timingDay.toString()
						}
						this.$axios.get('/ahies/sms/save' , {params:param} ).then( (res) => {
							console.log("请求成功")
							if(res.status == 200) {
								this.$message({ message: res.message, type: 'success' });
							} else {
								this.$message({ message: res.message, type: 'warning' });
							}
						});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 重置
			empty() {
				this.ruleForm.startHour = '00';
				this.ruleForm.startMinute = '00';
				this.ruleForm.endHour = 23;
				this.ruleForm.endMinute = 59;
				this.$refs.ruleForm.resetFields();
				this.ruleForm.comPort = "";
				this.ruleForm.manufacturer = "";
				this.ruleForm.model = "";
			}
		},
		computed: {
			timingHour() {
				var hourList = [];
				for(var i=0;i<24;i++) {
					if(i < 10) {
						hourList.push({ 'name':'0'+i, 'id':'0'+i });
					} else {
						hourList.push({ 'name':i, 'id':i });
					}
				}
				return hourList;
			},
			timingMinute() {
				var minuteList = [];
				for(var i=0;i<60;i++) {
					if(i < 10) {
						minuteList.push({ 'name':'0'+i, 'id':'0'+i });
					} else {
						minuteList.push({ 'name':i, 'id':i });
					}
				}
				return minuteList;
			}
		}
	}
</script>