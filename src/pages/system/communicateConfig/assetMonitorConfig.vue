<!--资产监控配置-->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="asset-monitor">
					<div class="asset-monitor-container clearfix">
						<template v-for="(item,index) in assetMonotorData">
							<div class="system-communication-asset">
								<el-form label-width="195px" :model="item" :rules="rules" :ref="'ruleForm'+index" :class="'ruleForm'+index">
									<el-form-item label="IP地址：" prop="ip">
										<el-input v-model="item.ip" placeholder="请输入IP地址"></el-input>
									</el-form-item>		
									<el-form-item label="端口：" prop="port">
										<el-input v-model="item.port" placeholder="请输入端口"></el-input>
									</el-form-item>
									<el-form-item>
										<el-button type="normal" icon="el-icon-my-test" @click="test(item,index)">测试</el-button>
										<el-button type="normal" icon="el-icon-my-save" @click="save(item,index)">保存</el-button>
									</el-form-item>
								</el-form>
								<i class="el-icon-my-tabDeleteAll" @click="deleteModule(index)"></i>
							</div>						
						</template>
						<div class="system-communication-asset">
							<span class="add-icon" @click="addModule"></span>
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'assetMonitorConfig',
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
				assetMonotorData:[],
				rules: {
					ip: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入IP地址', trigger: 'blur' },
						{ validator: checkIp, trigger: 'blur' }
					],
					port: [
						{ validator: validator.space, trigger: 'blur' },
						{ required: true, message: '请输入端口', trigger: 'blur' },
						{ validator: validator.num, trigger: 'blur' }
					],
				}
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				this.query();
				this.assetMonotorData = [{"createTime":null,"updateTime":null,"createUser":null,"updateUser":null,"status":null,"id":0,"port":"8890","ip":"192.168.2.228"},
										{"createTime":null,"updateTime":null,"createUser":null,"updateUser":null,"status":null,"id":1,"port":"8891","ip":"192.168.2.258"},
										{"createTime":null,"updateTime":null,"createUser":null,"updateUser":null,"status":null,"id":2,"port":"8892","ip":"192.168.2.258"}
										];
			});
		},
		methods: {
			query() {
//				this.$axios.post('/itsm/system/communication/configuration/queryAssetConfiguration').then( (res) => {
//					if(res.status == 200) {
//						this.assetMonotorData = res.data;
//					}
//				});
			},
			// 保存
			save(item,index) {
				this.$refs["ruleForm"+index][0].validate((valid) => {
				
				});
				
			},
			// 测试
			test(item,index) {
				this.$refs["ruleForm"+index][0].validate((valid) => {
					
						
				});
			},
			// 新增模块
			addModule(){
				this.assetMonotorData.push({"createTime":null,"updateTime":null,"createUser":null,"updateUser":null,"status":null,"id":'',"port":"","ip":""})
			},
			// 删除模块
			deleteModule(index){
				const self = this;
				self.$confirm('请确认是否删除该配置?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					if(self.assetMonotorData.length <= 1){
						self.$message({ message:'请至少保留一个配置', type: 'warning' });
						return;
					}
//					self.assetMonotorData.forEach((v,i) => {self.$refs["ruleForm"+i][0].resetFields();})
					self.assetMonotorData.splice(index,1);

					setTimeout(function(){
						self.assetMonotorData.forEach((v,i) => {
							self.$refs["ruleForm"+i][0].validate((valid) => {
								
							});
						})
					},100);
					
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
				});
			}
		}
	}
</script>

<style lang="less">
	
	
</style>