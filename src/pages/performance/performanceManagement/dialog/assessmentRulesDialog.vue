<!--选择人员弹窗（单选）-->
<template>
	<div>
		<el-dialog :title="dialogTitle" :visible="value" custom-class="assessment-rules-dialog" @close="closeKpiRulesDialog" :close-on-click-modal='false' v-drag>
			<div class="assessment-rules-body">
				<div class="rules-header clearfix">
					KPI因子
					<div class="fr">
						<!--运维组-->
						<template v-if="kpiType == 1">
							<el-form :inline="true" ref="ruleForm" >
								<el-form-item label="运维组：" prop="organizationName" style="margin-right:0;">
									<el-input v-model="configSynthesisData.form.data.organizationName" placeholder="请选择运维组" auto-complete="off" readonly="readonly" :disabled="!!kpiId"></el-input>
									<i class="el-icon-my-more" @click="openMaintenanceGroupDialog" v-if="!kpiId"></i>
								</el-form-item>
							</el-form>
						</template>
						<!--角色-->
						<template v-else-if="kpiType == 2">
							<el-form :inline="true" ref="ruleForm" >
								<el-form-item label="角色：" prop="roleName" style="margin-right:0;">
									<el-input v-model="configSynthesisData.form.data.roleName" placeholder="请选择角色" auto-complete="off" readonly="readonly" :disabled="!!kpiId"></el-input>
									<i class="el-icon-my-more" @click="selectPersonRadioShow" v-if="!kpiId"></i>
								</el-form-item>
							</el-form>
						</template>
					</div>
				</div>
				<div class="rules-content clearfix">
					<div class="fl">
						<dl class="rules-box">
							<dt style="padding: 10px 0;">工作量
								<div class="fr" style="color:#606266;">处理工单数</div>
							</dt>
						</dl>
						<dl class="rules-box">
							<dt>{{configSynthesisData.rulesData3.groupName}}</dt>
							<dd v-for="item in configSynthesisData.rulesData3.kpi">
								<el-checkbox v-model="item.selectStatus" :checked="item.selectStatus ? true : false" true-label="1" false-label="0" @change="kpiCount">{{ item.factorName }}</el-checkbox>
								<div class="fr">
									<span>权值：</span>
									<el-input v-model="item.instanceScope" maxlength="3" placeholder="请输入内容" class="inp-width" @change="kpiCount"></el-input>
									<span>(1~100)</span>
								</div>
							</dd>
						</dl>
					</div>
					<div class="fr">
						<dl class="rules-box">
							<dt>{{configSynthesisData.rulesData2.groupName}}</dt>
							<dd v-for="item in configSynthesisData.rulesData2.kpi">
								<!--<el-checkbox v-model="item.selectStatus? true : false">{{ item.factorName }}</el-checkbox>-->
								<el-checkbox v-model="item.selectStatus" :checked="item.selectStatus ? true : false" true-label="1" false-label="0" @change="kpiCount">{{ item.factorName }}</el-checkbox>
								<div class="fr">
									<span>权值：</span>
									<el-input v-model="item.instanceScope" maxlength="3" placeholder="请输入内容" class="inp-width" @change="kpiCount"></el-input>
									<span>(1~100)</span>
								</div>
							</dd>
						</dl>
						<dl class="rules-box">
							<dt>{{configSynthesisData.rulesData4.groupName}}</dt>
							<dd v-for="item in configSynthesisData.rulesData4.kpi">
								<!--<el-checkbox v-model="item.selectStatus? true : false">{{ item.factorName }}</el-checkbox>-->
								<el-checkbox v-model="item.selectStatus" :checked="item.selectStatus ? true : false" true-label="1" false-label="0" @change="kpiCount">{{ item.factorName }}</el-checkbox>
								<div class="fr">
									<span>权值：</span>
									<el-input v-model="item.instanceScope" maxlength="3" placeholder="请输入内容" class="inp-width" @change="kpiCount"></el-input>
									<span>(1~100)</span>
								</div>
							</dd>
						</dl>
					</div>
				</div>
				<div class="rules-result">
					当前总分：<span class="total" :class="{warning: kpiTotal > 100}">{{ kpiTotal }}</span>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button size="normal" @click="closeKpiRulesDialog">取&nbsp;消</el-button>
				<el-button type="normal" @click="submitKpiRulesData">确定</el-button>
			</div>
		</el-dialog>
		
		<!-- 选择运维组弹窗 -->
		<ies-maintenanceGroupDialog v-model="configMaintenanceGroupDialog.show" v-if="configMaintenanceGroupDialog.show" @selectMaintenanceGroupHandler="closeMaintenanceGroupHandler" :defaultSelect='configMaintenanceGroupDialog.data'></ies-maintenanceGroupDialog>
	
		<!--选择角色弹窗-->
		<ies-roleRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-roleRadioDialog>

	</div>
	
</template>

<script>
export default {     
    props:['defaultSelect','value'],
	data() {
        return {
        	kpiType: '',
        	kpiId: '',
        	kpiTemplateId: '10d3dd1c7e414ff8a429d0aadf604678',
        	kpiTotal: '',
        	dialogTitle: '',
        	
			// 运维组绩效报表数据
			configSynthesisData: {
				form: {
					data: {
						organizationName: '',        // 运维组名称
						organizationId: '',          // 运维组id
						organizationCode: '',        // 运维组code
						
						roleName: '',                // 角色name
						roleId: '',                  // 角色id
					}
				},
				
				params: {},
				
//				rulesData1: {
//					groupName: '',
//					kpi: [
//						{
//							factorName: ''
//						}
//					]
//				},

				rulesData2: [],
				rulesData3: [],
				rulesData4: []
			},
			
			// 选择运维组弹窗配置
			configMaintenanceGroupDialog: {
				show:false,
				data: {
					type: 'addKpi',
					selectId: ''
				}
			},
			
			// 选择角色弹窗（单选）
			selectPersonRadioDialog:{
				show:false,
				data:{
					//type:'search',
					type:'addKpi',
					id:''
				}
			},
			
        };
    },
	mounted() {
		
		this.kpiType = this.defaultSelect.kpiType;
		this.kpiId = this.defaultSelect.id;
		
		//console.log( this.kpiType );
		
    	this.$nextTick(function () {
			this.init();
    	});
	},
    methods: {
    	init() {
			if(this.kpiType === 1){
				this.dialogTitle = this.kpiId ? '编辑运维组绩效考核' : '新增运维组绩效考核'
			} else if(this.kpiType === 2){
				this.dialogTitle = this.kpiId ? '编辑角色绩效考核' : '新增角色绩效考核'
			};
    		
    		if(this.kpiId){
    			this.getKpiRuleDetail();
    		}else{
    			this.getKpiRuleTemplatesData();
    		};
    	},
    	
    	// 获取新增的模板数据
    	getKpiRuleTemplatesData(){
      		//this.$axios.post('/yzz/itsm/performance/manager/factor/templates', {id:this.kpiTemplateId}).then((res) => {
			this.$axios.post('/itsm/performance/manager/templates', {id:this.kpiTemplateId}).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					
					this.configSynthesisData.params = res.data;
					
					res.data.list.forEach((item)=>{
//						if(item.pageOrder == 1){
//							this.configSynthesisData.rulesData1.groupName = item.groupName;
//							this.configSynthesisData.rulesData1.kpi[0].factorName = item.kpi[0].factorName;
//						}
						if(item.pageOrder == 1){
							this.configSynthesisData.rulesData2 = item;
						}
						if(item.pageOrder == 2){
							this.configSynthesisData.rulesData3 = item;
						}
						if(item.pageOrder == 3){
							this.configSynthesisData.rulesData4 = item;
						}
					});
					this.kpiCount();
					
					
				}else{
					//this.configSynthesisData.rulesData1 = '';
					this.configSynthesisData.rulesData2 = '';
					this.configSynthesisData.rulesData3 = '';
					this.configSynthesisData.rulesData4 = '';
				}
			});
    	},
    	
    	// 获取kpi详细信息
    	getKpiRuleDetail(){
    		//this.$axios.post('/yzz/itsm/performance/manager/detail', {id:this.kpiId}).then((res) => {
			this.$axios.post('/itsm/performance/manager/detail', {id:this.kpiId}).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					
					this.configSynthesisData.params = res.data;
					
					res.data.list.forEach((item)=>{
//						if(item.pageOrder == 1){
//							this.configSynthesisData.rulesData1.groupName = item.groupName;
//							this.configSynthesisData.rulesData1.kpi[0].factorName = item.kpi[0].factorName;
//						}
						if(item.pageOrder == 1){
							this.configSynthesisData.rulesData2 = item;
						}
						if(item.pageOrder == 2){
							this.configSynthesisData.rulesData3 = item;
						}
						if(item.pageOrder == 3){
							this.configSynthesisData.rulesData4 = item;
						}

					});
					
					this.configSynthesisData.form.data.organizationName = res.data.operationName;
					this.configSynthesisData.form.data.roleName = res.data.roleName;
					
					this.kpiCount();
				}else{
					//this.configSynthesisData.rulesData1 = '';
					this.configSynthesisData.rulesData2 = '';
					this.configSynthesisData.rulesData3 = '';
					this.configSynthesisData.rulesData4 = '';
				}
			});
    	},
    	
    	// kpi计算
    	kpiCount(){
    		var kpiTotal = 0;
    		
    		this.configSynthesisData.rulesData2.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
//  				if( Number(item.instanceScope) <= 0 ){
//  					this.$message.warning('权值必须为(1~100)');
//  				};
    				kpiTotal += Number(item.instanceScope);
    			}
    		});
    		this.configSynthesisData.rulesData3.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
//  				if( Number(item.instanceScope) <= 0 ){
//  					this.$message.warning('权值必须为(1~100)');
//  				};
    				kpiTotal += Number(item.instanceScope);
    			}
    		});
    		this.configSynthesisData.rulesData4.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
//  				if( Number(item.instanceScope) <= 0 ){
//  					this.$message.warning('权值必须为(1~100)');
//  				};
    				kpiTotal += Number(item.instanceScope);
    			}
    		});
    		
    		this.kpiTotal = kpiTotal;
//  		if(this.kpiTotal > 100){
//  			this.$message.warning('绩效考核总分必须等于100');
//  		}
    	},
        
        // 保存kpi规则数据
        submitKpiRulesData(){
        	
        	var flag = false;
    		this.configSynthesisData.rulesData2.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
    				if( Number(item.instanceScope) <= 0 ){
    					flag = true;
    				};
    			}
    		});
    		this.configSynthesisData.rulesData3.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
    				if( Number(item.instanceScope) <= 0 ){
    					flag = true;
    				};
    			}
    		});
    		this.configSynthesisData.rulesData4.kpi.forEach((item)=>{
    			if(item.selectStatus == 1) {
    				if( Number(item.instanceScope) <= 0 ){
    					flag = true;
    				};
    			}
    		});
    		
    		if( flag ){
    			this.$message.warning('权值必须为(1~100)');
    			return;
    		}
    		
        	if(this.kpiTotal !== 100){
        		this.$message.warning('绩效考核总分必须等于100');
        		return;
        	};
        	
    		if(this.kpiId){
    			this.updateKpiRulesData();
    		}else{
    			if( this.kpiType === 1 && !this.configSynthesisData.form.data.organizationId ){
	        		this.$message.warning('没有选择运维组！');
	        		return;
    			}else if(this.kpiType === 2 && !this.configSynthesisData.form.data.roleId ){
	        		this.$message.warning('没有选择角色');
	        		return;
    			}
    			this.addKpiRulesData();
    		};

        },
        
        // 新增kpi规则数据
        addKpiRulesData(){
        	
        	var listTemp = this.configSynthesisData.params.list.map( (item)=>{
        		item.kpi = item.kpi.map( (items)=>{
        			if( items.selectStatus != 1 ){
        				items.instanceScope = 0;
        			}
        			return items
        		});
        		return item
        	});
        	
        	var params = {
        		templatesId: this.configSynthesisData.params.id, //模板id
        		kpiType: this.kpiType,   //1代表运维组 2代表角色
//      		operationName: this.configSynthesisData.form.data.organizationName, // 运维组code
//      		operationCode: this.configSynthesisData.form.data.organizationCode, // 运维组name
//      		operationId: this.configSynthesisData.form.data.organizationId, // 运维组Id
        		groupCalculationFormulasType: this.configSynthesisData.params.groupCalculationFormulasType, // 组的计算方式, 1表示+ 2是除  3是* 4是除
        		//list: this.configSynthesisData.params.list,
        		list: listTemp
        	};
        	if( this.kpiType === 1){
        		params.operationId = this.configSynthesisData.form.data.organizationId; // 运维组code
        		params.operationName = this.configSynthesisData.form.data.organizationName; // 运维组code
        		params.operationCode = this.configSynthesisData.form.data.organizationCode; // 运维组code
        	}else if(this.kpiType === 2){
        		params.roleId = this.configSynthesisData.form.data.roleId;         // 角色id
        		params.roleName = this.configSynthesisData.form.data.roleName;     // 角色name
        	};
			console.log(typeof params.roleId);
        	params = JSON.stringify(params);
        	//this.configSynthesisData.params.list = JSON.stringify(this.configSynthesisData.params.list);
        	
			//this.$axios.post('/yzz/itsm/performance/manager/save', this.configSynthesisData.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/save', { performanceStr: params }).then((res) => {
				if(res.status == 200) {
					this.closeKpiRulesDialog();
					this.$message.success( res.message );
					this.$emit('selectKpiRuleHandler', this.kpiType);
				}else{
					this.$message.error( res.message );
					return;
				}
			});
        },
        
        // 更新kpi规则数据
        updateKpiRulesData(){
        	
        	var listTemp = this.configSynthesisData.params.list.map( (item)=>{
        		item.kpi = item.kpi.map( (items)=>{
        			if( items.selectStatus != 1 ){
        				items.instanceScope = 0;
        			}
        			return items
        		});
        		return item
        	});
        	
        	var params = {
        		id: this.kpiId,
        		createUserId: this.configSynthesisData.params.createUserId,
        		//updateUserId: vm.$store.state.user.info.userId,
        		
        		templatesId: this.configSynthesisData.params.templatesId, //模板id
        		kpiType: this.kpiType,   //1代表运维组 2代表角色
        		groupCalculationFormulasType: this.configSynthesisData.params.groupCalculationFormulasType, // 组的计算方式, 1表示+ 2是除  3是* 4是除
        		list: listTemp
        	};
        	if( this.kpiType === 1){
        		params.operationId = this.configSynthesisData.params.operationId; // 运维组code
        		params.operationName = this.configSynthesisData.params.operationName; // 运维组code
        		params.operationCode = this.configSynthesisData.params.operationCode; // 运维组code
        	}else if(this.kpiType === 2){
        		params.roleId = this.configSynthesisData.params.roleId;         // 角色id
        		params.roleName = this.configSynthesisData.params.roleName;     // 角色name
        	};
			console.log(typeof params.roleId);
        	params = JSON.stringify(params);
        	
        	
        	//this.configSynthesisData.params.list = JSON.stringify(this.configSynthesisData.params.list);
        	//this.$axios.post('/yzz/itsm/performance/manager/update', this.configSynthesisData.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/update', {performanceManagePageStr: params}).then((res) => {
				if(res.status == 200) {
					this.closeKpiRulesDialog();
					this.$message.success( res.message );
					this.$emit('selectKpiRuleHandler', this.kpiType, this.kpiId);
				}else{
					this.$message.error( res.message );
					return;
				}
			});
        },
        
        // 关闭kpi规则弹窗
        closeKpiRulesDialog(){
        	this.$emit('input', false);
        },
        
        // 显示选择运维组弹窗
        openMaintenanceGroupDialog(){
        	this.configMaintenanceGroupDialog.show = true;
        },
		// 关闭选择运维组弹窗回调
		closeMaintenanceGroupHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.organizationName = data.groupName;
			this.configSynthesisData.form.data.organizationCode = data.groupCode;
			this.configSynthesisData.form.data.organizationId = data.id;
			this.configMaintenanceGroupDialog.data.selectId = data.groupCode;
		},
		
		// 显示选择角色弹窗(单选)
		selectPersonRadioShow() {
			this.selectPersonRadioDialog.show = true;
//			this.selectPersonRadioDialog.data = {
//			 	type:'search',
//			 	id:this.maintenanceGroup.searchForm.userId
//			}
		},
		// 关闭选择角色弹窗(单选)回调
		selectPersonRadioHandler(data) {
			if (data) {
				data = JSON.parse(data);
				console.log( data );
				this.configSynthesisData.form.data.roleName = data.roleName;
				this.configSynthesisData.form.data.roleId = data.id;
				console.log(typeof data.id);
				this.selectPersonRadioDialog.data.id = data.id;
				
//				this.maintenanceGroup.searchForm.userName = data.userName;
//              this.maintenanceGroup.searchForm.userId = data.id;
//	            this.selectPersonRadioDialog.data.id = data.id;
			}
		},
		
		
		
		
        
    },
    filters: {
    	
    },
    computed: {

    },
    watch: {
    	'configSynthesisData.rulesData2.kpi': {
    		handler: function(curVal){
    			curVal.forEach((item)=>{
				    this.$nextTick(() => {
				      	item.instanceScope = parseInt(item.instanceScope.toString().replace(/[^0-9]/g, '')) || 0;
				    });
    			});
    		},
    		deep: true
    	},
    	'configSynthesisData.rulesData3.kpi': {
    		handler: function(curVal){
    			curVal.forEach((item)=>{
				    this.$nextTick(() => {
				      	item.instanceScope = parseInt(item.instanceScope.toString().replace(/[^0-9]/g, '')) || 0;
				    });
    			});
    		},
    		deep: true
    	},
    	'configSynthesisData.rulesData4.kpi': {
    		handler: function(curVal){
    			curVal.forEach((item)=>{
				    this.$nextTick(() => {
				      	item.instanceScope = parseInt(item.instanceScope.toString().replace(/[^0-9]/g, '')) || 0;
				    });
    			});
    		},
    		deep: true
    	},
    }
}
</script>

<style lang="less">
.assessment-rules-dialog{
	width: 1000px;
	.assessment-rules-body {
		padding: 10px 30px;
		.rules-header{
			margin-top:10px;
		}
		.rules-box{
			width:440px; margin-bottom:20px; padding:20px 10px; border:1px solid #e4e4e4; background-color:#fafafa;
			dt{
				color:#7e7e7e;
			}
			dd{
				margin:20px 0 20px 20px;
			}
			.inp-width{
				width:50%; margin:0 5px;
			}
			.fr{
				width:250px;
			}
		}
		.rules-result{
			margin:20px 0; font-size:20px; font-weight:bold; text-align: center;
			.total{
				font-size: 30px; color:#57a9fd; vertical-align:middle;
			}
			.warning{
				color:#ff0000;
			}
		}
	}

}
</style>