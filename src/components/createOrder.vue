<!--创建工单-->
<template>
    <div>
		<div class="itsm-tabs-main create-order">
			<div class="tabs-main">				
				<div class="tabs-panel-wrap border">
					<div class="panel-body">
						<el-form ref="form" :model="form" :rules="rules" label-width="180px">
							<el-form-item label="关联资产：" style="display: inline-block;" prop="asset" class="asset">
								<el-input placeholder="请选择关联资产" readonly v-model="form.asset" @focus="selectOnFocus"></el-input>
								<i class="el-icon-my-more" @click="chooseAsset()"></i>
							</el-form-item>
							<el-form-item label="选择流程：" prop="flow" class="flow">
							    <el-select v-model="form.flow" placeholder="请选择流程" @focus="selectOnFocus">
									<el-option v-for="item in flow" :key="item.id" :value="item.id" :label="item.processName"></el-option>
								</el-select>
							</el-form-item>	
							<el-form-item label="是否关联外部用户申告：" prop="isRelated">
							   	<el-radio v-model="form.isRelated" label="0">是</el-radio>
								<el-radio v-model="form.isRelated" label="1">否</el-radio>
							</el-form-item>	
							<div class="container" :class="isDisabled ? '' :'hasBg' ">
								<el-form-item label="外部用户名称：" prop="userName">
								    <el-input v-model="form.userName" :disabled="isDisabled" placeholder="请输入外部用户名称"></el-input>
								</el-form-item>
								<el-form-item label="手机：" prop="phone">
								    <el-input v-model="form.phone" :disabled="isDisabled" placeholder="请输入手机号"></el-input>
								</el-form-item>
								<el-form-item label="邮箱：" prop="email">
								    <el-input v-model="form.email" :disabled="isDisabled" placeholder="请输入邮箱"></el-input>
								</el-form-item>
							</div>
							<el-form-item style="margin-top:24px;">
							   	<el-button type="normal" @click="nextStep">下一步</el-button>
							</el-form-item>
						</el-form>
					</div>
				</div>
			</div>
		</div>
		<!--关联资产弹窗-->
		<ies-relationAssetDialog v-model="relationAssetDialog.show" v-if="relationAssetDialog.show" @relationAssetChooseHandler="relationAssetChooseHandler" :defaultSelect='relationAssetDialog.defaultSelectId'></ies-relationAssetDialog>
    </div>
</template>

<script>
    export default {
    	components:{ 

		},        
        props: ['type'],
    	data() {
    		let validator = this.$ies.validator;    		
            return {
				sourceWorkOrderId: '',
            	form:{
            		asset:'',       //关联资产
            		flow:'',        //选择流程
            		isRelated:'0',   //是否关联外部用户申告
            		userName:'',    //外部用户名称
            		phone:'',       //手机
            		email:'',        //邮件
            		processName:''
            	},
            	isDisabled:false,
            	flow:[],              //流程下拉
            	rules:{
            		asset:[{required: true,message: '请选择关联资产',trigger: 'change'}],
            		flow: [{required: true,message: '请选择流程',trigger: 'change'}],
            		isRelated: [{required: true,message: '请选择是否关联',trigger: 'blur'}],
            		userName: [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入外部用户名称',trigger: 'blur'}],
            		phone: [{validator:validator.space,trigger: 'blur'},{required: true,message: '请输入手机号',trigger: 'blur'},{ validator: validator.mobile, trigger: 'blur' }],
            		email: [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入邮箱',trigger: 'blur'},{type:'email', message: '请输入正确的邮箱地址',trigger: 'blur' }],
            	},
            	//关联资产弹窗
            	relationAssetDialog:{
            		show:false,
            		defaultSelectId:''
            	},
            	processType:'',  //工单类型
            	externalUser:'', //外部用户id
            	url:''  
            }
        },
		mounted() {
        	this.$nextTick(function () {
				this.sourceWorkOrderId = this.$route.query.sourceWorkOrderId;
        	});
    	},
    	activated() {
    		this.$nextTick(function () {
				this.processType = this.type;
				this.alarmId = this.$route.query.alarmId;
				this.getProcess();
        	});
			
		},
        methods: {
        	//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
        	//获取流程的下拉
        	getProcess(){
        		this.$axios.post('/itsm/process/manager/templates/queryTemplatesList',{processType:this.processType,pageNum:1,pageSize:100}).then((res) => {
					if(res.status == 200) {
						this.flow = res.data.list;
					}					
				});
        	},
        	//点击下一步
            nextStep(){
            	const self = this;
            	self.processType == 1 && (self.url = 'event/fillEventForm');
            	self.processType == 2 && (self.url = 'question/fillQuestionForm');
            	self.processType == 3 && (self.url = 'change/fillChangeForm');
            	self.processType == 4 && (self.url = 'publish/fillPublishForm');
            	self.processType == 5 && (self.url = 'spare/fillSpareForm');
				self.$refs['form'].validate((valid) => {
					if(valid){
						self.flow.forEach(item => { 
							if(item.id == this.form.flow){
								this.form.processName = item.processName;
							}
						});
						if(self.form.isRelated == '0') { //关联外部用户
							self.addExternalUser();
						} else {   //不关联外部用户
							this.changeRoute(false);
//							self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$route.fullPath);
//							self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${self.url}?associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}`);
						}
					}
                })
            },
            //关联外部用户
            addExternalUser(){
            	this.$axios.post('/itsm/system/sso/external/add',{name:this.form.userName,mobile:this.form.phone,email:this.form.email}).then((res) => {
					if(res.status == 200) {
						this.externalUser = res.data;
						this.changeRoute(true);
//						this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
//						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${this.url}?externalUser=${this.externalUser}&associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}`);
					}
				});
            },
            //路由跳转
            changeRoute(isExternalUser){
            	this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.path);
            	if(isExternalUser && this.alarmId){  //关联外部用户且关联故障
            		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${this.url}?sourceWorkOrderId=${this.sourceWorkOrderId}&externalUser=${this.externalUser}&associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}&alarmId=${this.alarmId}`);
            	}else if(isExternalUser && !this.alarmId){
            		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${this.url}?sourceWorkOrderId=${this.sourceWorkOrderId}&externalUser=${this.externalUser}&associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}`);
            	}else if(!isExternalUser && this.alarmId){
            		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${this.url}?sourceWorkOrderId=${this.sourceWorkOrderId}&associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}&alarmId=${this.alarmId}`);
            	}else{
            		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/${this.url}?sourceWorkOrderId=${this.sourceWorkOrderId}&associatedAsset=${this.relationAssetDialog.defaultSelectId}&processTemplatesVersion=${this.form.flow}&processName=${this.form.processName}`);
            	}
            },
            //选择资产弹窗
            chooseAsset(){
            	this.relationAssetDialog.show = true;
            },
            //关闭选择资产弹窗的回调
            relationAssetChooseHandler(data){
            	var data = JSON.parse(data);
            	this.form.asset = data.name;
            	this.relationAssetDialog.defaultSelectId = data.id;
            }
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch:{
        	'form.isRelated':{
        		handler(val,oldVal){
        			let validator = this.$ies.validator;
        			if(val == '1') {
        				this.isDisabled = true;
        				$(".create-order .el-form-item__error").hide();
        				$(".create-order .flow .el-form-item__error").show();
        				$(".create-order .asset .el-form-item__error").show();
        				this.rules.userName = [];
        				this.rules.phone = [];
        				this.rules.email = [];
        			} else {
        				this.isDisabled = false;
        				$(".create-order .el-form-item__error").show();
        				this.rules.userName = [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入外部用户名称',trigger: 'blur'}];
        				this.rules.phone = [{validator:validator.space,trigger: 'blur'},{required: true,message: '请输入手机号',trigger: 'blur'},{ validator:validator.mobile, trigger: 'blur' }];
        				this.rules.email = [{validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入邮箱',trigger: 'blur'},{type:'email', message: '请输入正确的邮箱地址',trigger: 'blur' }];
        			}        			
        		},
        		deep:true
        	}
        }
    }

</script>

<style lang="less">
	
</style>