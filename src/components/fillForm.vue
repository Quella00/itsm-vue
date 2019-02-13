<!--填写事件表单-->
<template>
	<div class="itsm-tabs-main fill-form">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar"  ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="fill-form-container">
					<el-collapse v-model="activeNames" @change="handleChange">
						<el-collapse-item  name="1" class="basic">
							<template slot="title">
						        基本信息<i class="el-icon-my-contraction"></i>
						    </template>
							<el-form label-width="150px" :model="configForm.params"  ref="basicRuleForm">								
								<el-form-item
									v-for="(item, index) in configForm.params.customInfoField"
									:label="`${item.fieldNameChina}：`"
									:key="item.fieldNameChina"
									:prop="`customInfoField.${index}.fieldValue`"
									:rules="item | fieldType(type)"
									:class="item | fieldClass"
								>
									<el-select v-model="item.fieldValue" v-if="item.fieldType == 5" :placeholder="`请选择${item.fieldNameChina}`" @focus="selectOnFocus">
										<el-option value="" label="请选择" v-if="!item.notNull"></el-option>
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>

									<el-select v-model="item.fieldValue" v-else-if="item.fieldType == 6" :placeholder="`请选择${item.fieldNameChina}`" multiple collapse-tags @focus="selectOnFocus">
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>

									<el-input v-model="item.fieldValue" v-else-if="item.fieldType == 3"  type="textarea" resize="none" :placeholder="`请输入${item.fieldNameChina}`"></el-input>
									
									<template v-else-if="item.fieldType == 7">
										<el-input  v-model="item.fieldValue" readonly :placeholder="`请选择${item.fieldNameChina}`" @focus="selectOnFocus"></el-input>

										<i class="el-icon-my-more" v-if="item.fieldCommon == 'businessClassification'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'technicalClassification'" @click="openTechnologyClass(item)"></i>

										<i class="el-icon-my-more" v-if="item.fieldCommon == 'yewu'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'jishu'" @click="openTechnologyClass(item)"></i>
									</template>

									<el-date-picker v-model="item.fieldValue" v-else-if="item.fieldType == 8" type="datetime" :editable="false" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="`请选择${item.fieldNameChina}`"></el-date-picker>

                                    <template v-else-if="item.fieldType == 9">										
										 <el-date-picker  v-model="item.fieldValue"  type="datetimerange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
									</template>
									
									<el-input v-model="item.fieldValue" v-else  :placeholder="`请输入${item.fieldNameChina}`"></el-input>
								</el-form-item>
							</el-form>
						</el-collapse-item>
						<el-collapse-item  name="2" class="order">
							<template slot="title">
						            工单信息<i class="el-icon-my-contraction"></i>
						    </template>
							<el-form :model="configForm.params"  ref="orderRuleForm" label-width="150px">								
								<el-form-item
									v-for="(item, index) in configForm.params.customWorkOrderField"
									:label="`${item.fieldNameChina}：`"
									:key="item.fieldNameChina"
									:prop="`customWorkOrderField.${index}.fieldValue`"
									:rules="item | fieldType"
									:class="item | fieldClass"
								>
									<el-select v-model="item.fieldValue" v-if="item.fieldType == 5" :placeholder="`请选择${item.fieldNameChina}`" @focus="selectOnFocus">
										<el-option value="" label="请选择" v-if="!item.notNull"></el-option>
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>

									<el-select v-model="item.fieldValue" v-else-if="item.fieldType == 6"  multiple collapse-tags :placeholder="`请选择${item.fieldNameChina}`" @focus="selectOnFocus">
										<el-option v-for="list in item.fieldCommon.split(',')" :key="list" :value="list"></el-option>
									</el-select>

									<el-input v-model="item.fieldValue" v-else-if="item.fieldType == 3" type="textarea" resize="none" :placeholder="`请输入${item.fieldNameChina}`"></el-input>
									
									<template v-else-if="item.fieldType == 7">
										<el-input v-model="item.value" readonly :placeholder="`请选择${item.fieldNameChina}`" @focus="selectOnFocus"></el-input>
										<!-- 系统字段 -->
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'businessClassification'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'technicalClassification'" @click="openTechnologyClass(item)"></i>
                                        
                                        <!-- 自定义字段 -->
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'yewu'"  @click="openBusinessClass(item)"></i>
										<i class="el-icon-my-more" v-if="item.fieldCommon == 'jishu'" @click="openTechnologyClass(item)"></i>
									</template>

									<el-date-picker v-model="item.fieldValue" v-else-if="item.fieldType == 8" type="datetime" :editable="false" :placeholder="`请选择${item.fieldNameChina}`" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>

									<template v-else-if="item.fieldType == 9">							
										<el-date-picker  v-model="item.fieldValue"  type="datetimerange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
									</template>

									<el-input v-model="item.fieldValue" v-else  :placeholder="`请输入${item.fieldNameChina}`"></el-input>

								</el-form-item>
							</el-form>
						</el-collapse-item>
					</el-collapse>
					<div class="tabs-panel-wrap border">
						<div class="panel-body bottom">
							<el-form :model="bottom.ruleForm" :rules="bottom.rules" ref="bottomRuleForm" label-width="150px">
								<el-form-item label="指派角色类型：">
								   {{bottom.ruleForm.roleType}}
								</el-form-item>
								<el-form-item label="指派至：" prop="assignedUser">
								   <el-select v-model="bottom.ruleForm.assignedUser" placeholder="请选择" @focus="selectOnFocus">
										<el-option v-for="item in bottom.assignedUser" :key="item.id" :value="item.id" :label="item.userName"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="抄送方式：" prop="sendType">
								    <el-checkbox-group v-model="bottom.ruleForm.sendType">
									    <el-checkbox v-for="item in bottom.sendType" :key="item.id" :label="item.id">{{item.name}}</el-checkbox>						     
								    </el-checkbox-group>
								</el-form-item>
								<el-form-item label=" " >
								   <el-button type="normal" @click="submit()">&nbsp;提&nbsp;交&nbsp;</el-button>
								</el-form-item>
							</el-form>
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		<ies-business-classification-dialog v-model="configForm.businessClassificationDialog" v-if="configForm.businessClassificationDialog" @businessChooseHandler="businessChooseHandler" :defaultSelect='businessClassificationSelectId'></ies-business-classification-dialog>
		<ies-technology-classification-dialog v-model="configForm.technologyClassificationDialog" v-if="configForm.technologyClassificationDialog" @technologyChooseHandler="technologyChooseHandler" :defaultSelect='technologyClassificationSelectId'></ies-technology-classification-dialog>
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
            	activeNames: ['1','2'],//折叠面板 
            	formContentmanageId:'', //当前默认的表单版本号
            	configForm:{            //基础信息
            		params:{           			
            			// 自定义字段
						customInfoField: [],
						// 自定义字段
						customWorkOrderField: [],
            		},
	            	// 业务分类弹窗
					businessClassificationDialog: false,
					// 业务分类选中的数据行
					businessClassificationSelect: '',
					// 技术分类弹窗
					technologyClassificationDialog: false,
					// 技术分类选中的数据行
					technologyClassificationSelect: '',	
            	},            	
            	bottom:{   //底部信息
            		ruleForm:{
            			roleType:'',
            			assignedUser:'',
            			sendType:[1,2]
            		},
            		assignedUser:[],
            		sendType:[
            			{name:'邮件',id:1},
            			{name:'短信',id:2}
            		],
            		rules:{
            			assignedUser:[{required: true,message:'请选择指派至',trigger: 'change'}],
            		}
            	},
            	versionId:'',//流程版本
            	currentNodeId:'',//当前节点id
            	nodeId:'',//下一个节点id
            	processNodeName:'',//当前节属性名
            	processNodeId:'', //当前节属性id
            	
            	businessClassificationSelectId:'',  //业务树回显id
            	technologyClassificationSelectId:'',//技术树回显id
            }
        },
		mounted() {
        	this.$nextTick(function () {
        		this.externalUser = this.$route.query.externalUser;
        		this.associatedAsset = this.$route.query.associatedAsset;
        		this.processName = this.$route.query.processName;
        		this.processTemplatesVersion = this.$route.query.processTemplatesVersion;
        		this.alarmId = this.$route.query.alarmId;
				this.init();
        	});
    	},
        methods: {
        	//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
        	init(){
        		// 获取默认表单版本号
        		this.$axios.post('/ahies/autoform/manager/content/base/queryOpenForm',{formmanageId:this.type}).then((res) => {
					if(res.status == 200) {
						this.formContentmanageId = res.data;
						this.getFormInfo();
					}					
				});
				//根据流程模版查询其下，启用的流程版本 需要传递一个值:templatesId
				this.$axios.post('/itsm/process/manager/templates/queryTemplatesVersionByid',{templatesId:this.processTemplatesVersion}).then((res) => {
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
						this.bottom.ruleForm.roleType = res.data.processRoleName;
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
						this.bottom.assignedUser = res.data;
					}					
				});
        	},
        	//获取动态表单
        	getFormInfo(){
        		// 获取基本信息表单
        		this.$axios.post('/ahies/autoform/manager/content/base/queryMessage',{formContentmanageId:this.formContentmanageId,formType:1}).then((res) => {
					if(res.status == 200) {
						if(res.data) {
							// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
							res.data.forEach(item => { this.$set(item, 'fieldValue', item.fieldType == 6 ? [] : '') });
							this.configForm.params.customInfoField = res.data;
						}else {
							this.configForm.params.customInfoField = [];
						}
					}
					this.$nextTick(function () {
						$('.el-range-input,.el-date-editor .el-input__inner').on('focus',function(e){
							 e.target.blur();
						})
					})
				});
				// 获取工单信息表单
				this.$axios.post('/ahies/autoform/manager/content/base/queryMessage',{formContentmanageId:this.formContentmanageId,formType:2}).then((res) => {
					if(res.status == 200) {
						if(res.data) {
							// 这里插入自定义字段的内容字段，为什么这么做是因为下拉复选列表的 v-model 要求值是数组的，不然会报错
							res.data.forEach(item => { this.$set(item, 'fieldValue', item.fieldType == 6 ? [] : '') });
							this.configForm.params.customWorkOrderField = res.data;
							//如果是从故障管理转工单,则获取此告警详情展示在描述中
							if(this.alarmId){
								this.getAlarmInfo();
							}
						}else {
							this.configForm.params.customWorkOrderField = [];
						}
					}
					this.$nextTick(function () {
						$('.el-range-input,.el-date-editor .el-input__inner').on('focus',function(e){
							 e.target.blur();
						})
					})
				});
        	},
        	//获取告警详情展示在描述中
        	getAlarmInfo(){
        		this.$axios.post('/itsm/qinzhi/alarmmanagement/queryAlarmDetails',{aid:this.alarmId}).then((res) => {
					if(res.status == 200) {
						var desc = res.data[0].alarmState + '     ' + res.data[0].content + '     ' + res.data[0].collectionTime;
						this.configForm.params.customWorkOrderField.forEach(item => { 
							if(item.id == 9){
								this.$set(item, 'fieldValue',desc);
							}
						})
					}					
				});
        	},
        	//提交表单
        	submit(){
        		var flag = true;
				this.$refs['basicRuleForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['orderRuleForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['bottomRuleForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				if(flag) {
					const self = this;
					var params = {};
					self.configForm.params.customInfoField.forEach(item => { self.$set(item, 'baseTypeOrWorkOrder', 1)});
					self.configForm.params.customWorkOrderField.forEach(item => { self.$set(item, 'baseTypeOrWorkOrder', 2)});
					
					//自定义字段
					params.workOrderFormCustomList = self.configForm.params.customInfoField.concat(self.configForm.params.customWorkOrderField);
					params.workOrderFormCustomList.forEach(item => { self.$set(item, 'customFieldId',item.id)});
					params.workOrderFormCustomList.forEach(item => { self.$set(item, 'formContentManageId',this.formContentmanageId)});
					params.workOrderFormCustomList.forEach(item => { item.fieldValue = (item.fieldType == 9 || item.fieldType == 6) && item.fieldValue ? item.fieldValue.toString() : item.fieldValue })
					
					//固定字段
					params.workOrderFormFixed = {
						associatedAsset:self.associatedAsset,
						externalUser:self.externalUser == undefined ? '' :self.externalUser,
						type:self.type
					}
					
					//流程实例
					params.processInstance = {
						processName:self.processName,
						processTemplatesVersion:self.versionId,
						currentNodeId:self.processNodeId,
						currentNodeUserId:self.bottom.ruleForm.assignedUser,
						currentNodeName:self.processNodeName
					}
					
					//是否邮件通知
					params.emailNotice = self.bottom.ruleForm.sendType.indexOf(1) > -1 ? 1 : 0;
					
					//是否短信通知
					params.smsNotice = self.bottom.ruleForm.sendType.indexOf(2) > -1 ? 1 : 0,
					
					//如果是故障告警信息转工单的
					params.troubleId = self.alarmId == undefined ? '' : self.alarmId;
					
					params.sourceWorkOrderId = this.$route.query.sourceWorkOrderId&&this.$route.query.sourceWorkOrderId!='undefined' ? this.$route.query.sourceWorkOrderId : '';

					self.$axios.post('/itsm/process/manager/workOrder/add',params,{json:true}).then((res) => {
						if(res.status == 200) {
							self.$alert('工单生成成功，工单编号为：'+ res.data, '', {
						        confirmButtonText: '确定',
						        callback: action => {
						           self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$route.path); 
						           if(self.alarmId){ //如果是从故障管理进入的，则创建工单以后要刷新故障管理页面
						           		self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/serviceDesk/malfunctionManage`);
						           }
						        }
					  		});						
						} else {
							self.$message({ message:'工单生成失败', type: 'error' });
						}
						//将表单值是字符串的数组类型再转回数组回显数据
						params.workOrderFormCustomList.forEach(item => { item.fieldValue = (item.fieldType == 9 || item.fieldType == 6) && item.fieldValue ? item.fieldValue.split(',') : item.fieldValue })
					});
				}else{
					this.$message({ type: 'warning', message: '表单输入有误，请检查' });
				}
        	},
        	// 业务分类
			openBusinessClass(item) {
				const self = this;
//	            console.log(item);
				self.configForm.businessClassificationDialog = true;
				self.configForm.businessClassificationSelect = item;
				self.businessClassificationSelectId = item.selectId;
			},
			businessChooseHandler(v) {
				const self = this;
	            //self.configForm.params.businessClass = v.categoryName;
				self.configForm.businessClassificationDialog = false;
				self.$set(self.configForm.businessClassificationSelect, 'fieldValue', v.categoryName);
				self.$set(self.configForm.businessClassificationSelect, 'selectId', v.id);
			},
			
			// 技术分类
			openTechnologyClass(item) {
				const self = this;
//				console.log(item);
				self.configForm.technologyClassificationDialog = true;
				self.configForm.technologyClassificationSelect = item;
				self.technologyClassificationSelectId = item.selectId;
			},
			technologyChooseHandler(v) {
				const self = this;
				self.configForm.technologyClassificationDialog = false;
				self.$set(self.configForm.technologyClassificationSelect, 'fieldValue', v.categoryName);
				self.$set(self.configForm.technologyClassificationSelect, 'selectId', v.id);
			},
        	//折叠面板
            handleChange(){
            	
            }
        },
        filters:{
	        fieldClass(v) {
	            return {
					'custom-field-class-small': v.fieldType == 1,                // 文本框(小)
					'custom-field-class-big': v.fieldType == 2,                  // 文本框(大)
					'custom-field-class-domain': v.fieldType == 3,               // 文本域
					'custom-field-class-number': v.fieldType == 4,               // 数值框
					'custom-field-class-dropDown-radio': v.fieldType == 5,       // 下拉单选列表
					'custom-field-class-dropDown-checkbox': v.fieldType == 6,    // 下拉复选列表	
					'custom-field-class-tree': v.fieldType == 7,                 // 树形文本框
					'custom-field-class-time': v.fieldType == 8,                 // 单个时间
					'custom-field-class-times': v.fieldType == 9                 // 计划开始结束时间
				}
			},
	        fieldType(v,t) {
				let rules = [];
				switch(v.fieldType){
					case 1:// 文本框(小)
						rules.push(
							{ validator: ies.validator.space, options: { max: 11 } }
						);
					break;

					case 2: // 文本框(大)
						rules.push(
							{ validator: ies.validator.space, options: { max: 50 } }
						);
					break;

					case 3:// 文本域
						rules.push(
							{ validator: ies.validator.space, options: { max: 300 } }
						);
					break;

					case 4:// 数值框
						rules.push(
							{ validator: ies.validator.space, options: { max: 11 } },
							{ validator: ies.validator.num }
						);
					break; 
				}
				if(t == 3 && v.systemField == 1 && v.fieldType == 9){
					rules.push({ validator: ies.validator.checkPlanTime});
				}
				if(v.notNull) {
					if(v.fieldType == 1 || v.fieldType == 2 || v.fieldType == 3 || v.fieldType == 4){
						rules.push({ required: true, message: `请输入${v.fieldNameChina}` });
					}else{
						rules.push({ required: true, message: `请选择${v.fieldNameChina}` });
					}
				}
				return rules;
			}
        },
        computed:{
        	
        },
        watch:{

        }
    }

</script>

<style lang="less">
	
</style>