<!--待回访工单详情-->
<template>
	<div class="itsm-tabs-main return-order-detail">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="order-detail-container fill-form">
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							回访评价
						</div>
						<div class="panel-body appraise">
							<el-form :model="appraise.ruleForm" :rules="appraise.rules" ref="appraiseRuleForm" label-width="150px">
								<el-form-item label="评价人员："  prop="evaluators" style="display: inline-block;">
								    <el-input v-model="appraise.ruleForm.evaluators" :disabled='!buttonShow'></el-input>
								</el-form-item>
								<el-form-item label="联系电话：" prop="contactNumber" style="display: inline-block;margin-left:92px;">
								    <el-input v-model="appraise.ruleForm.contactNumber" :disabled='!buttonShow'></el-input>
								</el-form-item>
								<el-form-item label="评价结果：" prop="evaluation">
									<el-radio-group v-model="appraise.ruleForm.evaluation" :disabled='!buttonShow'>
								        <el-radio label="5">非常满意</el-radio>
								        <el-radio label="4">满意</el-radio>
								        <el-radio label="3">一般</el-radio>
								        <el-radio label="2">不满意</el-radio>
								        <el-radio label="1">非常不满意</el-radio>
								    </el-radio-group>
								</el-form-item>
								<el-form-item label="评价意见：" prop="opinions">
								    <el-input type="textarea" v-model="appraise.ruleForm.opinions" :disabled='!buttonShow'></el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<el-collapse v-model="activeNames" @change="handleChange">
						<el-collapse-item  name="1" class="basic">
							<template slot="title">
						                     基本信息   <i class="el-icon-my-contraction"></i>
						    </template>
							<el-form label-width="150px" :model="basic" :rules="basic.rules" ref="basicRuleForm">								
								<el-form-item
									v-for="(item, index) in basic.data"
									:label="`${item.fieldNameChina}：`"
									:key="item.fieldNameChina"
									:prop="`data.${index}.fieldValue`"
									:rules="item | fieldType"
									:class="item | fieldClass"
								>
									<el-input v-model="item.fieldValue" v-if="item.fieldType == 3" :disabled="true" type="textarea" resize="none"></el-input>

									<el-date-picker v-model="item.fieldValue" v-else-if="item.fieldType == 8" type="datetime" :disabled="true" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>

                                    <template v-else-if="item.fieldType == 9">	
										 <el-date-picker  v-model="item.fieldValue.split(',')"  type="datetimerange"  range-separator="至"  value-format="yyyy-MM-dd HH:mm:ss" :disabled="true"></el-date-picker>
									</template>
									
									<el-input v-model="item.fieldValue" v-else :disabled="true"></el-input>
								</el-form-item>
							</el-form>
						</el-collapse-item>
						<el-collapse-item  name="2" class="sla">
							<template slot="title">
						        SLA信息   <i class="el-icon-my-contraction"></i>
						    </template>
							<el-table :data="sla.tableData" border style=" width:75%; margin:40px 0px 40px 60px;">
                                <el-table-column prop="kpiName" label="KPI" align="center"></el-table-column>
                                <el-table-column prop="kpiQuota" label="KPI指标" align="center"></el-table-column>
								<el-table-column prop="kpiValue" label="当前值" align="center"></el-table-column>
                            </el-table>
						</el-collapse-item>
						<iesProgressSteps :data="orderProgressCondig"></iesProgressSteps>
					</el-collapse>
					<div class="button-container">
						<el-button v-if='buttonShow' type="normal" @click="submit">&nbsp;提&nbsp;交&nbsp;</el-button>
					</div>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
    export default {
    	name:'returnVisitOrderDetail',
    	components:{ 

		},        
        props:{
    		
    	},
    	data() {
            return {   
            	orderId:'', //待回访工单id
            	processInstanceId:'',//实例id
            	activeNames: ['1','2','3'],//折叠面板 
            	buttonShow:true,
            	appraise:{            //评价
            		ruleForm:{
            			evaluators:'',
            			contactNumber:'',
            			evaluation:'5',
            			opinions:''
            		},
            		rules: {
						evaluators: [{ validator:ies.validator.space,options:{max:32}},{required: true,message:'请输入评价人员姓名'}],
						contactNumber: [{ validator:ies.validator.space},{required: true,message:'请输入联系电话'},{ validator: ies.validator.mobile}],
						evaluation: [{required: true,message: '请选择评价结果'}],
						opinions: [{ validator:ies.validator.space,options:{max:200}},{required: true,message:'请输入评价意见'}]
					}
            	},
            	basic:{            //基础信息
            		data:[]         			
            	},
            	sla:{    //SLA
            		tableData:[]
            	},
            	orderProgressCondig:[] //进度条
            }
       },        
		mounted() {
        	this.$nextTick(function () {
				this.init();
        	});
    	},
        methods: {
        	init(){
        		this.orderId = this.$route.query.id;
        		this.processInstanceId = this.$route.query.instanceId;
        		this.getOrderDetail();
        	},
        	getOrderDetail(){
        		//基本信息
        		this.$axios.post('/work/order/base',{id:this.orderId}).then( (res) => {
					if(res.status == 200) {
						this.basic.data = res.data;
					}
				});
				//工单详情
				this.$axios.post('/work/order/visit/detail',{id:this.orderId}).then( (res) => {
					if(res.status == 200) {
						if(res.data){							
							this.appraise.ruleForm.evaluators = res.data.evaluators;
							this.appraise.ruleForm.contactNumber = res.data.contactNumber;
							this.appraise.ruleForm.evaluation = res.data.evaluation;
							this.appraise.ruleForm.opinions = res.data.opinions;
							this.buttonShow = false;
						} else {
							this.$refs['appraiseRuleForm'].resetFields();
							this.buttonShow = true;
						}
					}else{
						this.$message(res.message);
					}
				});
				// 获取sla数据
                this.$axios.get('/itsm/process/manager/sla/querySLAByinstanceId?instanceId='+this.processInstanceId).then((res) => {
                    if(res.status==200){
	                    this.sla.tableData = res.data;
                    }else{
                        this.$message(res.message);
                    }
                });
	            // 获取进度状态数据	       
                this.$axios.post('/itsm/process/manager/log/query?processInstanceId='+this.processInstanceId+'&workOrderId='+this.orderId).then((res) => {
                    if(res.status==200){
                        this.orderProgressCondig = res.data
                    }else{
                        this.$message(res.message);
                    }
                });
        	},
            handleChange(){
            	
            },
            //提交
            submit(){
            	const self = this;
				self.$refs['appraiseRuleForm'].validate((valid) => {
					if(valid){						
						var params = {
							id:this.orderId,
							evaluators:this.appraise.ruleForm.evaluators,
							contactNumber:this.appraise.ruleForm.contactNumber,
							evaluation:this.appraise.ruleForm.evaluation,
							opinions:this.appraise.ruleForm.opinions
						}
						self.$axios.post('/work/order/visit/add',params).then( (res) => {
							if(res.status == 200) {
								self.$message.success('操作成功');
								self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$route.path);
								self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage( '/serviceDesk/returnVisit/index');
							}else{
								self.$message(res.message);
							}
						});
					}
				})
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
	        fieldType(v) {
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
        	$route(){
				if(this.$route.path == '/serviceDesk/returnVisit/orderDetail'){
					if(this.$route.query.id !== this.orderId) {
						Object.assign(this.$data, this.$options.data());
						this.init();
					}
				}
		    }
        }
    }

</script>

<style lang="less">
.return-order-detail{
	.el-collapse-item{margin-top:10px;}
	.appraise{
		.el-form{padding-top:20px;}
		.el-textarea__inner{width:650px;height:77px;}
		.el-input__inner{width:202px;}
	}
	.basic{
		.el-form{
			margin-top:30px;padding-bottom:20px;
		}		
	}
	.sla{
		.el-table th.is-leaf {
			border-bottom: 1px solid #e4e4e4;line-height: 40px;height: 40px;background: #ffffff;
			.cell{color:#7e7e7e;font-weight: normal;}
		}
	}
	.button-container{
		margin-top:25px;text-align: center;padding-bottom: 20px;
	}
}
	
</style>