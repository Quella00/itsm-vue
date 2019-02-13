<!--投诉详情-->
<template>
    <div class="itsm-tabs-main compalin-detail">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar"  ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="compalin-detail-container">
					<el-collapse v-model="activeNames" @change="handleChange">
						<el-collapse-item  name="1" class="complain-info">
							<template slot="title">
						                   投诉信息   <i class="el-icon-my-contraction"></i>
						    </template>
							<el-row>
								<el-tooltip class="item" effect="dark" :content="complain.complainUserName" placement="bottom-start">
									<el-col :span="8"><span class="info-title">投诉人：</span>{{complain.complainUserName}}</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.complainTime" placement="bottom-start">
									<el-col :span="16"><span class="info-title">投诉时间：</span>{{complain.complainTime}}</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.complainUserOrganization" placement="bottom-start">
									<el-col :span="8"><span class="info-title">投诉人所属组织：</span>{{complain.complainUserOrganization}}</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.workOrderName" placement="bottom-start">
									<el-col :span="16"><span class="info-title">投诉工单：</span>
										<span class="orderName" @click="openOrderDetail()">{{complain.workOrderName}}</span>
									</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.complainUserContactNumber" placement="bottom-start">
									<el-col :span="8"><span class="info-title">投诉人联系电话：</span>{{complain.complainUserContactNumber}}</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.complainUserEmail" placement="bottom-start">
									<el-col :span="16"><span class="info-title">投诉人邮箱：</span>{{complain.complainUserEmail}}</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.respondentUserName" placement="bottom-start">
									<el-col :span="24"><span class="info-title">被投诉人：</span>{{complain.respondentUserName}}
									</el-col>
								</el-tooltip>
								<el-tooltip class="item" effect="dark" :content="complain.complainContent" placement="bottom-start">
									<el-col :span="24"><span class="info-title">投诉内容：</span>{{complain.complainContent}}
									</el-col>
								</el-tooltip>
							</el-row>
						</el-collapse-item>
						<el-collapse-item  name="2" class="handling" >
							<template slot="title">
						                    处理信息   <i class="el-icon-my-contraction"></i>
						    </template>
							<el-form :model="handling.form"  ref="handlingForm" label-width="150px" :rules="handling.rules">								
								<el-form-item label="处理意见：" prop="suggestion">
								    <el-input type="textarea" v-model="handling.form.suggestion"></el-input>
								</el-form-item>								
							</el-form>
						</el-collapse-item>
						<el-collapse-item  name="3" class="appraise">
							<template slot="title">
						                    用户评价 <i class="el-icon-my-contraction"></i>
						    </template>
							<el-form :model="appraise.form"  ref="appraiseForm" label-width="150px" :rules="appraise.rules">
								<el-form-item label="评价结果：" prop="results" style="margin-bottom:30px;">
								   <el-select v-model="appraise.form.results" placeholder=" " @focus="selectOnFocus">
										<el-option v-for="item in appraise.results" :key="item.value" :value="item.value" :label="item.label"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="用户评价：" prop="userAppraise">
								    <el-input type="textarea" v-model="appraise.form.userAppraise"></el-input>
								</el-form-item>								
							</el-form>
						</el-collapse-item>
					</el-collapse>
					<div class="button-container">
						<el-button type="normal" @click="save">&nbsp;保&nbsp;存&nbsp;</el-button>
					</div>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
    export default {
    	name:'editComplain',
    	components:{ 

		},        
        props:{
    		
    	},
    	data() {
            return {
            	complainId:'',//投诉id
            	activeNames: ['1','2','3'],//折叠面板 
            	complain:{
            		complainUserName:'',    //投诉人
            		complainTime:'',  //投诉时间
            		complainUserOrganization:'',  //投诉人所属组织
            		workOrderName:'',   //投诉工单
            		workOrderId:'',       //工单id
            		complainUserContactNumber:'',         //投诉人联系电话
            		complainUserEmail:'',         //投诉人邮箱
            		respondentUserName:'',//被投诉人
            		complainContent:'',       //投诉内容
            	},
            	handling:{
            		form:{
            			suggestion:''
            		},
            		rules:{
            			suggestion:[{ validator: ies.validator.space, options: { max: 200 } }],
            		}
            	},
            	appraise:{
            		form:{
            			results:'',
            			userAppraise:''
            		},
            		rules:{
            			userAppraise:[{ validator: ies.validator.space, options: { max: 200 } }],
            		},
            		results:[
            			{value:'',label:'请选择'},
            			{value:'非常满意',label:'非常满意'},
            			{value:'满意',label:'满意'},
            			{value:'一般',label:'一般'},
            			{value:'不满意',label:'不满意'},
            			{value:'非常不满意',label:'非常不满意'}
            		]
            	}
            }
        },
		mounted() {
        	this.$nextTick(function () {
				this.init();
        	});
    	},
        methods: {
        	init(){
        		this.complainId = this.$route.query.id;
        		this.getComplainInfo();
        	},
        	//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
        	//获取投诉详情
        	getComplainInfo(){
        		this.$axios.post('/itsm/process/manager/complain/detail',{complainId:this.complainId}).then( (res) => {
					if(res.status == 200) {
						this.complain = res.data;
						this.handling.form.suggestion = res.data.handleContent;
						this.appraise.form.results = res.data.customerSatisfaction == null ? '' : res.data.customerSatisfaction;
						this.appraise.form.userAppraise = res.data.customerEvaluation;
//						console.log(this.appraise.form.results);
//						console.log(this.complain);
					}
				});
        	},
        	//打开工单详情
        	openOrderDetail(){
        		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( `/workOrder/orderDatail/event?orderId=${this.complain.workOrderId}&instanceId=${this.complain.processInstanceId}`);
        	},
        	//点击保存
            save(){
            	const self = this;
            	self.$refs['handlingForm'].validate((valid) => {
					self.$refs['appraiseForm'].validate((valid) => {
						if(valid){
							var params = {
			            		id:self.complainId,
			            		handleContent:self.handling.form.suggestion,
			            		customerSatisfaction:self.appraise.form.results,
			            		customerEvaluation:self.appraise.form.userAppraise
			            	}
			            	self.$axios.post('/itsm/process/manager/complain/update',params).then( (res) => {
								if(res.status == 200) {
									self.$message.success(res.message);
									self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$route.path);
									self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage( '/serviceDesk/complainManage/index');
								}else{
									self.$message.error(res.message);
								}
							});
						}
					})
				})
            },
            handleChange(){
            	
            }
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch:{
        	$route(){
				if(this.$route.path == '/serviceDesk/complainManage/editComplain'){
					if(this.$route.query.id !== this.complainId) {
						Object.assign(this.$data, this.$options.data());
						this.init();
					}
				}
		    }
        }
    }

</script>

<style lang="less">
.compalin-detail{
	.el-row{padding-left:58px;padding-top:25px;padding-bottom:25px;
		.el-col{overflow: hidden;text-overflow: ellipsis;white-space: nowrap;}
	}
	.el-tooltip{
		line-height:40px;
		.orderName{
			color:#57a9fd;cursor: pointer;
		}
		.info-title{
			display: inline-block;width:120px;text-align: right;
		}
	}
	.el-form{padding-top:40px;padding-bottom:20px;}
	.button-container{
		margin-top:25px;text-align: center;
		.el-button{
			/*width:90px;height:40px;*/
		}
	}
	.handling{
		.el-textarea__inner{
			width:648px;height:75px;
		}
	}
	.appraise{
		.el-input__inner{
			width:648px !important;
		}
		.el-textarea__inner{
			width:648px;height:75px;
		}
	}
}
</style>