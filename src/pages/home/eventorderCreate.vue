<!--事件工单快速登记-->
<template>
    <div class="panel-content border">
		<div class="panel-header">
			事件工单快速登记
			<div class="fr">
				<span class="el-icon-my-refresh" @click="refreshEventOrder"></span>
			</div>
		</div>
		<div class="panel-body" style="height:305px;">
			<el-form ref="form" :model="form" :rules="rules" label-width="100px" style="padding:20px 20px 0 0;" class="create-event-order">
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="关联资产：" prop="assetName">
							<el-input auto-complete="off" v-model="form.assetName" placeholder="请选择关联资产" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="chooseAsset()"></i>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="流程：" prop="process">
							<el-select v-model="form.process" placeholder="请选择流程" style="width:100%;" @focus="selectOnFocus">
								<el-option v-for="item in processOptions" :key="item.id" :value="item.id" :label="item.processName"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>

				<el-form-item label="主题：" prop="topic">
					<el-input v-model="form.topic" placeholder="请输入主题"></el-input>
				</el-form-item>

				<el-form-item label="描述：" prop="desc">
					<el-input type="textarea" :rows="6" resize="none" v-model="form.desc" placeholder="请输入描述"></el-input>
				</el-form-item>
				<el-row :gutter="10">
					<el-col :span="12">
						<el-form-item label="优先级：" prop="priority">
						   <el-select v-model="form.priority" placeholder="请选择优先级" @focus="selectOnFocus">
								<el-option key="一级" value="一级">一级</el-option>
								<el-option key="二级" value="二级">二级</el-option>
								<el-option key="三级" value="三级">三级</el-option>
								<el-option key="四级" value="四级">四级</el-option>
								<el-option key="五级" value="五级">五级</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="指派至：" prop="assignedUser" style="margin-bottom:10px;">
						   <el-select v-model="form.assignedUser" placeholder="请选择指派至" style="width:100%;" @focus="selectOnFocus">
								<el-option v-for="item in assignedUser" :key="item.id" :value="item.id" :label="item.userName"></el-option>
							</el-select>
						</el-form-item>
					</el-col>												
				</el-row>											
				<el-form-item style="text-align:right">
					<el-button type="primary" size="normal" @click="submitForm()">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
		<!--关联资产弹窗-->
		<!--<ies-relationAssetDialog v-model="relationAssetDialog.show" v-if="relationAssetDialog.show" @relationAssetChooseHandler="relationAssetChooseHandler" :defaultSelect='relationAssetDialog.defaultSelectId'></ies-relationAssetDialog>-->
	</div>
</template>

<script>
    export default {
    	components:{ 

		},        
        props:{
    		
    	},
    	data() {
    		let validator = this.$ies.validator;  
            return {
		        processOptions: [],//流程下拉
		        assignedUser:[],//指派至人员下拉
		        
		        //workOrderFormCustomList:[],//基本表单数据
		        customInfoField: [],        // 基本信息
		        customWorkOrderField: [],   // 工单信息
		        
		        
//		        //关联资产弹窗
//          	relationAssetDialog:{
//          		show:false,
//          		defaultSelectId:''
//          	},
				form: {
					assetName:'',
					assetId:'',
					process: '',
					topic: '',
					desc:'',
					priority:'',//优先级
					assignedUser:''//指派至
				},
				rules: {
					assetName:[{required: true,message: '请选择关联资产',trigger: 'change'}],
					process: [{required: true,message: '请选择流程',trigger: 'change'}],
					priority: [{required: true,message: '请选择优先级',trigger: 'change'}],
					topic: [{validator:validator.space,trigger: 'blur',options:{max:50}},{required: true,message: '请输入主题',trigger: 'blur'}],
					desc: [{validator:validator.space,trigger: 'blur',options:{max:300}}],
					assignedUser:[{required: true,message: '请选择指派至',trigger: 'change'}]
				},
				processName:'',//流程名称
				formContentmanageId:'',//表单默认版本号
				versionId:'',//流程版本
            	currentNodeId:'',//当前节点id
            	nodeId:'',//下一个节点id            	
            	processNodeName:'',//当前节属性名
            	processNodeId:'', //当前节属性id
            	roleType:'',//角色类型
            }
        },
		mounted() {
        	this.$nextTick(function () {
				this.getEventOrderInfo();
				this.getFixedInfo();
        	});
    	},
        methods: {
        	//解决ie9不能修改的内容都能获取焦点
        	selectOnFocus(e) {
		        e.target.blur();
		    },
           //选择资产弹窗
            chooseAsset(){
//          	this.relationAssetDialog.show = true;
//				this.$parent.$parent.$parent.$parent.chooseAsset();
				this.$ies.dispatch(this, 'home').chooseAsset();
            },
            //关闭选择资产弹窗的回调
//          relationAssetChooseHandler(data){
//          	var data = JSON.parse(data);
//          	this.form.asset = data.name;
//          	this.relationAssetDialog.defaultSelectId = data.id;
//          },
            //获取流程下拉数据
			getEventOrderInfo(){
				//获取流程下拉数据
				this.$axios.post('/itsm/process/manager/templates/queryTemplatesList',{processType:1,pageNum:1,pageSize:100}).then((res) => {
					if(res.status == 200) {
						this.processOptions = res.data.list;
					}					
				});				
			},
			//获取事件表单版本号和基本表单字段
			getFixedInfo(){
				// 获取默认表单版本号
        		this.$axios.post('/ahies/autoform/manager/content/base/queryOpenForm',{formmanageId:1}).then((res) => {
					if(res.status == 200) {
						this.formContentmanageId = res.data;
						this.getFormInfo();
					}					
				});
				
				//获取基本表单字段
//				this.$axios.post('/ahies/autoform/manager/content/base/queryMessage',{formContentmanageId:6,formType:1}).then((res) => {
//					if(res.status == 200) {
//						this.workOrderFormCustomList = res.data;
//					}					
//				});
				
			},
			
			// 获取动态表单
			getFormInfo(){
        		// 获取基本信息表单
        		this.$axios.post('/ahies/autoform/manager/content/base/queryMessage',{formContentmanageId:this.formContentmanageId,formType:1}).then((res) => {
					if(res.status == 200) {
						if(res.data) {
							// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
							res.data.forEach(item => { this.$set(item, 'fieldValue', item.fieldType == 6 ? [] : '') });
							this.customInfoField = res.data;
						}else {
							this.customInfoField = [];
						}
					}
				});
				// 获取工单信息表单
				this.$axios.post('/ahies/autoform/manager/content/base/queryMessage',{formContentmanageId:this.formContentmanageId,formType:2}).then((res) => {
					if(res.status == 200) {
						if(res.data) {
							// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
							res.data.forEach(item => { this.$set(item, 'fieldValue', item.fieldType == 6 ? [] : '') });
							this.customWorkOrderField = res.data;
						}else {
							this.customWorkOrderField = [];
						}
				}
				});
			},
			
			//根据流程模版查询其下，启用的流程版本 需要传递一个值:templatesId
			getProcessVersion(){
				this.$axios.post('/itsm/process/manager/templates/queryTemplatesVersionByid',{templatesId:this.form.process}).then((res) => {
					if(res.status == 200) {
						this.versionId = res.data.id; //流程版本
						this.queryCurrentNodeIdByInstanceId();
					}					
				});
			},
			//根据流程实例ID或者流程版本ID查询当前节点ID 如果流程实例ID为空 就根据流程版本ID查询起始节点ID 需要传递可选参数2个中的至少一个  String versionId,String instanceId
        	queryCurrentNodeIdByInstanceId(){
        		this.$axios.post('/itsm/process/manager/instance/queryCurrentNodeIdByInstanceId',{versionId:this.versionId}).then((res) => {
					if(res.status == 200) {
						this.currentNodeId = res.data;
						this.queryNextNodeIdByInstanceId();
					}					
				});
        	},
        	//根据流程实例Id或者版本ID查询当前节点的下一个节点Id 需要一下参数versionId, instanceId,currentNodeId
        	queryNextNodeIdByInstanceId(){
        		this.$axios.post('/itsm/process/manager/instance/queryNextNodeIdByInstanceId',{versionId:this.versionId,currentNodeId:this.currentNodeId}).then((res) => {
					if(res.status == 200) {
						this.nodeId = res.data;
						this.queryProcessNodePropertyByInstanceId();
					}					
				});
        	},
        	//根据实例ID或者版本ID ，和节点id 查询当前节点属性需要参数 instanceId,  vesionId,nodeId
        	queryProcessNodePropertyByInstanceId(){
        		this.$axios.post('/itsm/process/manager/instance/queryProcessNodePropertyByInstanceId',{versionId:this.versionId,nodeId:this.nodeId}).then((res) => {
					if(res.status == 200) {
						this.roleType = res.data.processRoleName;
						this.processNodeName  = res.data.processNodeName;
						this.processNodeId = res.data.processNodeId;
						//获取角色对应的人员信息
						this.getRoleInfo(res.data.processRoleId);
					}					
				});
        	},
        	//获取角色对应的人员信息
        	getRoleInfo(id){
        		this.$axios.post('/itsm/system/permission/role/queryOrdinaryUserByRoleId',{roleId:id}).then((res) => {
					if(res.status == 200) {
						this.assignedUser = res.data;
					}					
				});
        	},
        	//快速创建工单
			submitForm(){
				const self = this;
				self.$refs['form'].validate((valid) => {
					if(valid){
						var params = {};
						
						self.customInfoField.forEach(item => { self.$set(item, 'baseTypeOrWorkOrder', 1)});
						self.customWorkOrderField.forEach(item => { self.$set(item, 'baseTypeOrWorkOrder', 2)});
						//自定义字段
						params.workOrderFormCustomList = self.customInfoField.concat(self.customWorkOrderField);
						params.workOrderFormCustomList.forEach(item => { self.$set(item, 'customFieldId',item.id)});
						params.workOrderFormCustomList.forEach(item => { self.$set(item, 'formContentManageId',this.formContentmanageId)});
						params.workOrderFormCustomList.forEach(item => { item.fieldValue = (item.fieldType == 9 || item.fieldType == 6) && item.fieldValue ? item.fieldValue.toString() : item.fieldValue });
						params.workOrderFormCustomList.forEach(item => { item.fieldName == 'theme' ? self.$set(item, 'fieldValue', self.form.topic) : item.fieldName == 'description' ? self.$set(item, 'fieldValue', self.form.desc) : item.fieldName == 'priority' ? self.$set(item, 'fieldValue', self.form.priority) : '' });
						
						//自定义字段
						//self.workOrderFormCustomList.forEach(item => { item.fieldName == 'priority' ? self.$set(item, 'baseTypeOrWorkOrder', 1) : self.$set(item, 'baseTypeOrWorkOrder', 2) });
						//self.workOrderFormCustomList.forEach(item => { self.$set(item, 'customFieldId',item.id)});
						//self.workOrderFormCustomList.forEach(item => { self.$set(item, 'formContentManageId',this.formContentmanageId)});
						//self.workOrderFormCustomList.forEach(item => { item.fieldName == 'theme' ? self.$set(item, 'fieldValue', self.form.topic) : item.fieldName == 'description' ? self.$set(item, 'fieldValue', self.form.desc) : self.$set(item, 'fieldValue', self.form.priority) });
						//params.workOrderFormCustomList = self.workOrderFormCustomList;
						
						//固定字段
						params.workOrderFormFixed = {
							associatedAsset:self.form.assetId,
							externalUser:'',
							type:1
						}
						//流程实例
						params.processInstance = {
							processName:self.processName,
							processTemplatesVersion:self.versionId,
							currentNodeId:self.processNodeId,
							currentNodeUserId:self.form.assignedUser,
							currentNodeName:self.processNodeName
						}
						//是否邮件通知
						params.emailNotice = 1;
						//是否短信通知
						params.smsNotice = 1;
						
//						console.log(params);
						self.$axios.post('/itsm/process/manager/workOrder/add',params,{json:true}).then((res) => {
							if(res.status == 200) {
								self.$alert('工单生成成功，工单编号为：'+ res.data, '', {
							        confirmButtonText: '确定',
							        callback: action => {
							           self.refreshEventOrder();
							           self.$ies.dispatch(this, 'home').$refs.operationability.getOperationAbilityData();
							        }
						  		});						
							} else {
								self.$message({ message:'工单生成失败', type: 'error' });
							}
						});
					}
				})
			},
			//刷新创建事件工单
			refreshEventOrder(){
		        this.assignedUser = [];//指派至人员下拉
				this.form = {
					assetName: '',
					assetId: '',
					process: '',
					topic: '',
					desc:'',
					priority:'',
					assignedUser:''//指派至
				};
				this.processName = '';        //流程名称
				this.versionId = '';          //流程版本
            	this.currentNodeId = '';      //当前节点id
            	this.nodeId = '';             //下一个节点id            	
            	this.processNodeName = '';    //当前节属性名
            	this.processNodeId = '';      //当前节属性id
            	this.roleType = '';           //角色类型
            	this.$refs['form'].resetFields();
            	this.$ies.dispatch(this, 'home').clearAsset();
            	this.getEventOrderInfo();
			} 
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch:{
        	'form.process':{
				handler(val,oldVal){
					this.form.assignedUser = '';
					if(val != ''){
						this.getProcessVersion();
					}
					this.processOptions.forEach(item => {
						if(item.id == this.form.process){
							this.processName = item.processName;
						}
					})
				},
				deep:true
			}
        }
    }

</script>

<style lang="less">
	
</style>