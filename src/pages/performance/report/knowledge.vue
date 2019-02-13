<template>
	<div class="itsm-tabs-main">	
        <div class="tabs-main">
        	
        	<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
        	<div>
        	
	            <div class="tabs-panel-wrap border query-area">
	                <div class="panel-header">查询条件</div>
	                <div class="panel-body search-content">
	                    <el-form :inline="true" :model="configSynthesisData.form.data" ref="reportForm" label-width="130px" class="search-conditions reset-form">
							<el-form-item label="查询周期：">
	                            <el-date-picker v-model="configSynthesisData.form.data.closeTime" type="daterange" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
		                                class="date-picker"></el-date-picker>
	                        </el-form-item>
	                        
							<!--<el-form-item label="资产分类：" prop="classification">
								<el-input v-model="configSynthesisData.form.data.classification" placeholder="请选择资产分类" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openAssetClassificationDialog"></i>
							</el-form-item>-->
							<el-form-item label="作者：" prop="createUserName">
								<el-input v-model="configSynthesisData.form.data.createUserName" placeholder="请选择作者" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openPersonRadioDialog"></i>
							</el-form-item>
	                    </el-form>
	                </div>
	            </div>
	
	            <div class="tabs-panel-wrap border">
	                <div class="panel-header">
	                    <div class="fl">
	                        <el-button type="normal" icon="el-icon-my-export" @click="exportExcel">导出Excel</el-button>
	                        <el-button type="normal" icon="el-icon-my-export" @click="exportPDF">导出PDF</el-button>
	                    </div>
	                    <div class="fr">
	                    	<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
	                        <el-button type="normal" icon="el-icon-my-search" @click="querySynthesisData">查询</el-button>
	                    </div>
	                </div>
	
	                <div class="panel-body">
	                    <el-table :data="configSynthesisData.table.data" border style="width:100%;" class="simple-table">
	                        <el-table-column prop="createUserName" label="人员"></el-table-column>
	                        <el-table-column prop="createrCount" label="创建总数"></el-table-column>
	                        <el-table-column prop="scoreOrder1" label="4.X~5分"></el-table-column>
	                        <el-table-column prop="scoreOrder2" label="3.X~4分"></el-table-column>
	                        <el-table-column prop="scoreOrder3" label="2.X~3分"></el-table-column>
	                        <el-table-column prop="scoreOrder4" label="小于等于2分"></el-table-column>
	                        <el-table-column prop="scoreOrder5" label="未评分"></el-table-column>
	                    </el-table>
	
	                </div>
					<div class="panel-footer">
						<el-pagination @size-change="changeSize" @current-change="changeCurrent" :current-page="configSynthesisData.table.params.pageNum" :page-size="configSynthesisData.table.params.pageSize" :page-sizes="configSynthesisData.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSynthesisData.table.total"></el-pagination>
					</div>
	            </div>
		    
	    	</div>
        	</ies-scrollbar>
        
        </div>
	    
    <!-- 选择资产分类弹窗 -->
    <!--<ies-assetDialog v-model="configAssetDialog.show" v-if="configAssetDialog.show" @assetChooseHandler="closeAssetClassificationDialogHandler" :defaultSelect='configAssetDialog.selectId' :type='configAssetDialog.type'></ies-assetDialog>-->
	    
	<!-- 选择发起人弹窗(搜索时候单选的) -->
	<ies-personRadioDialog v-model="configPersonRadioDialog.show" v-if="configPersonRadioDialog.show" @selectPersonRadioHandler="closePersonRadioHandler" :defaultSelect='configPersonRadioDialog.data'></ies-personRadioDialog>
	    
    </div>
</template>

<script>
import publicTable from './public/table.vue'
import publicPagination from './public/pagination.vue'
	
export default {
	components: {
		publicTable
	},
	data() {
		return {
			// 知识报表数据
			configSynthesisData: {
				form: {
					data: {
//						classification: '',        // 资产分类name
//						classificationId: '',            // 资产分类id
						
						createUserName: '',       // 创建人name
						createUserId: '',           // 创建人id
						
						closeTime: '',            // 工单关闭时间
						
//						closeTimeShow: true,        // 工单关闭时间显示隐藏
//						closeTimeTag: 0         
					}
				},
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
//						classificationId: '',   	    // 资产分类id
						createUserId: '',                 // 创建人id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						
//						priorityOrder: '',        		// 优先级0升序1倒叙
//						createTimeOrder: '',      		// 发起时间0升序1倒叙
//						closeTimeOrder: '',       		// 关闭时间0升序1倒叙
//						responseTimeOrder: '',    		// 响应时间0升序1倒叙
//						resolutionTimeOrder: '',  		// 解决时间0升序1倒叙
//						evaluationOrder: '',      		// 满意度0升序1降序
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					
					data: []
				}
				
			},
			
			// 资产分类弹窗配置
			configAssetDialog: {
				show: false,       // 弹窗的显示/隐藏
				selectId: '',      // 选中的区域节点id
				type: 'search'     // 搜索时，禁用分类也显示
			},
			
			// 选择人员弹窗（单选）配置
			configPersonRadioDialog: {
				show:false,
				data:{
					type: 'search',
					id: ''
				}
			},
			
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		})
	},
	methods: {
		init(){
			this.getAssetsData();
		},
		
		// 获取组织工单报表图表数据
		getAssetsData(){
			
			this.configSynthesisData.table.params.userId = this.$store.state.user.info.userId;
			
			//this.$axios.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryKnowledge', this.configSynthesisData.table.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/workOrdeReportForm/queryKnowledge', this.configSynthesisData.table.params).then((res) => {
				if(res.status == 200 && res.data) {
					this.configSynthesisData.table.data = res.data.list;
					
					this.configSynthesisData.table.data.forEach((item)=>{
						item.createrCount = item.scoreOrder1 + item.scoreOrder2 + item.scoreOrder3 + item.scoreOrder4 +item.scoreOrder5;
					});
					
					this.configSynthesisData.table.total = res.data.total;
				}else{
					this.configSynthesisData.table.data = [];
					this.configSynthesisData.table.total = 0;
				}
			});
		},
        
		// 显示选择资产分类弹窗
//		openAssetClassificationDialog() {
//			this.$refs.table.openAssetClassificationDialog();
//		},
        
//		// 显示选择作者弹窗
//		openPersonRadioDialog() {
//			this.$refs.table.openPersonRadioDialog();
//		},
        
        // 查询table数据
        querySynthesisData(){
        	//this.$refs.table.querySynthesisData();
        	this.configSynthesisData.table.params.pageNum = 1;
        	if( this.configSynthesisData.form.data.closeTime ){
				this.configSynthesisData.table.params.startTime = this.configSynthesisData.form.data.closeTime[0];
				this.configSynthesisData.table.params.endTime = this.configSynthesisData.form.data.closeTime[1];
			
				//console.log( this.configSynthesisData.table.params.startTime );
				var lastYearToday = this.$ies.getLastYearToday( this.configSynthesisData.table.params.startTime );
				if( Date.parse(this.configSynthesisData.table.params.endTime) - Date.parse(lastYearToday) > 0 ){
					this.$message.info('查询周期最多不能超过一年！');
					return;
				};
        	}else{
				this.configSynthesisData.table.params.startTime = '';
				this.configSynthesisData.table.params.endTime = '';
        	};
        	this.$ies.syncValue(this.configSynthesisData.table.params, this.configSynthesisData.form.data);
        	//console.log( this.configSynthesisData.table.params );
        	
        	this.getAssetsData();
        },
        
//      // 获取下一年的今天的日期
//      getLastYearToday(date){
//      	var strYear = new Date(date).getFullYear() + 1;
//      	var strDay = new Date(date).getDate();
//      	var strMonth = new Date(date).getMonth() + 1;
//			if(strMonth < 10) {
//				strMonth = '0' + strMonth;
//			};
//			if(strDay < 10) {
//				strDay= '0' + strDay;
//			};
//			var datastr = strYear + '-' + strMonth + '-' + strDay;  
//			return datastr; 
//      },
        
        // 重置查询表单数据
        resetQueryForm(){
//      	this.configSynthesisData.form.data.classificationId = '';
			this.$refs['reportForm'].resetFields();
        	this.configSynthesisData.form.data.createUserId = '';
        	this.configSynthesisData.form.data.closeTime = '';
        },
        
        // 导出Excel
        exportExcel() {
        	//this.$refs.table.exportExcel();
        	
			var self = this;
			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
			var params = "?Token=" + token; 
			for(var key in this.configSynthesisData.table.params){
				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
			}
			
			//window.location.href = '/api/itsm/performance/manager/workOrdeReportForm/exportKnowledge' + params;
			//window.location.href = 'http://192.168.3.22:9900/itsm/performance/manager/workOrdeReportForm/exportKnowledge' + params;
			window.location.href = '/api/itsm/performance/manager/workOrdeReportForm/exportKnowledge' + params;
        },
        
        // 导出PDF
        exportPDF() {
        	//this.$refs.table.exportPDF();
        	
			var self = this;
			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
			var params = "?Token=" + token; 
			for(var key in this.configSynthesisData.table.params){
				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
			}

			//window.open('/api/itsm/performance/manager/workOrdeReportForm/exportKnowledgePdf' + params);
			//window.open('http://192.168.3.22:9900/itsm/performance/manager/workOrdeReportForm/exportKnowledgePdf' + params);
			window.open('/api/itsm/performance/manager/workOrdeReportForm/exportKnowledgePdf' + params);
        },
        
        // pageSize 改变时会触发
        changeSize( v ) {
        	this.configSynthesisData.table.params.pageSize = v;
        	this.getAssetsData();
            //this.$parent.$parent.$refs.table.getSynthesisData();
        },
        
        // currentPage 改变时会触发
        changeCurrent( v ) {
            this.configSynthesisData.table.params.pageNum = v;
            this.getAssetsData();
            //this.$parent.$parent.$refs.table.getSynthesisData();
        },
        
//		// 显示资产分类弹窗
//		openAssetClassificationDialog(){
//			this.configAssetDialog.show = true
//		},
//      // 资产分类弹窗关闭回调方法
//      closeAssetClassificationDialogHandler(node) {
//			this.configSynthesisData.form.data.classification = node.categoryName;
//			this.configSynthesisData.form.data.classificationId = node.id;
//			this.configAssetDialog.selectId = node.id;
//      },
        
		// 显示选择人员弹窗(单选)
		openPersonRadioDialog() {
			this.configPersonRadioDialog.show = true;
		},
		// 关闭选择人员弹窗(单选)回调
		closePersonRadioHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.createUserName = data.userName;
			this.configSynthesisData.form.data.createUserId = data.id;
			this.configPersonRadioDialog.data.id = data.id;
		},
        
        
        
	}
}
</script>

<style lang="less">

</style>