<template>
	<div class="itsm-tabs-main">	
        <div class="tabs-main">
        	<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
        	<div>
        	
	            <div class="tabs-panel-wrap border query-area">
	                <div class="panel-header">查询条件</div>
	                <div class="panel-body search-content">
	                    <el-form :inline="true" :model="configSynthesisData.form.data" ref="kpiForm" label-width="130px" class="search-conditions reset-form">
							<el-form-item label="运维组：" prop="operationName">
								<el-input v-model="configSynthesisData.form.data.operationName" placeholder="请选择运维组" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="openMaintenanceGroupDialog"></i>
							</el-form-item>
							
							<el-form-item label="统计周期：" prop="startTimeValue"> 
	                            <el-select v-model="configSynthesisData.form.data.startTimeValue" placeholder="请选择" focus="selectOnFocus">
									<el-option v-for="item in configSynthesisData.startTimeDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
								</el-select>
								<span>&nbsp;-&nbsp;</span>
								<el-select v-model="configSynthesisData.form.data.endTimeValue" placeholder="请选择" focus="selectOnFocus">
									<el-option v-for="item in configSynthesisData.endTimeDropDownData" :key="item.value" :label="item.label" :value="item.value" ></el-option>
								</el-select>
	                       </el-form-item>
	                    </el-form>
	                </div>
	            </div>
	
	            <div class="tabs-panel-wrap border">
	                <div class="panel-header">
	                    <div class="fl">
	                        <el-button type="normal" icon="el-icon-my-export" @click="exportFile('Excel')">导出Excel</el-button>
	                        <!--<el-button type="normal" icon="el-icon-my-export" @click="exportFile('PDF')">导出PDF</el-button>-->
	                    </div>
	                    <div class="fr">
	                    	<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
	                        <el-button type="normal" icon="el-icon-my-search" @click="queryKpiTableData">查询</el-button>
	                    </div>
	                </div>
	
	                <div class="panel-body">
	                	
	                    <el-table :data="configSynthesisData.table.data" :span-method="arraySpanMethod" border style="width:100%;" class="simple-table" >
	                    	<el-table-column label="运维工作绩效统计" class-name="table-column-group">
	                    		<el-table-column :label="'统计时间：' + configSynthesisData.table.startTime +'至'+ configSynthesisData.table.endTime" class-name="table-column-group">
			                        <el-table-column prop="operation" label="运维组"></el-table-column>
			                        <el-table-column prop="userName" label="人员"></el-table-column>
			                        <el-table-column prop="performance" label="工作绩效"></el-table-column>
			                        <el-table-column prop="operationPerformance" label="运维组绩效"></el-table-column>
		                        </el-table-column>
	                    	</el-table-column>
	                    </el-table>
	
	                </div>
					<div class="panel-footer">
						<el-pagination @size-change="changeKpiSize" @current-change="changeKpiCurrent" :current-page="configSynthesisData.table.params.pageNum" :page-size="configSynthesisData.table.params.pageSize" :page-sizes="configSynthesisData.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSynthesisData.table.total"></el-pagination>
					</div>
	            </div>
	    
	    	</div>
        	</ies-scrollbar>
        </div>
	    
		<!-- 选择运维组弹窗 -->
		<ies-maintenanceGroupDialog v-model="configMaintenanceGroupDialog.show" v-if="configMaintenanceGroupDialog.show" @selectMaintenanceGroupHandler="closeMaintenanceGroupHandler" :defaultSelect='configMaintenanceGroupDialog.data'></ies-maintenanceGroupDialog>
	    
    </div>
</template>

<script>
export default {
	data() {
		return {
			// 运维组绩效报表数据
			configSynthesisData: {
				form: {
					data: {
						//organizationName: '',        // 运维组名称
						//organizationId: '',          // 运维组id
						
						operationName: '',              // 运维组name
						operationId: '',                // 运维组id
						
						startTimeValue: '',
						startTime: '',
						
						endTimeValue: '',
						endTime: '',
					}
				},
				
				// 统计周期开始时间下拉数据源
				startTimeDropDownData: [
					{ value:'', label: '请选择' },
//					{ value:'2015', label: '2015' },
//					{ value:'2016', label: '2016' },
//					{ value:'2017', label: '2017' },
//					{ value:'2018', label: '2018' }
				],
				
				// 统计周期结束时间下拉数据源
				endTimeDropDownData: [
					{ value:'', label: '请选择' },
					{ value:'01', label: '一月' },
					{ value:'02', label: '二月' },
					{ value:'03', label: '三月' },
					{ value:'04', label: '四月' },
					{ value:'05', label: '五月' },
					{ value:'06', label: '六月' },
					{ value:'07', label: '七月' },
					{ value:'08', label: '八月' },
					{ value:'09', label: '九月' },
					{ value:'10', label: '十月' },
					{ value:'11', label: '十一月' },
					{ value:'12', label: '十二月' },
					{ value:'01,03', label: '第一季度' },
					{ value:'04,06', label: '第二季度' },
					{ value:'07,09', label: '第三季度' },
					{ value:'10,12', label: '第四季度' },
					{ value:'01,06', label: '上半年' },
					{ value:'07,12', label: '下半年' },
					{ value:'01,12', label: '全年' },
				],
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						operationName: '',              // 运维组name
						operationId: '',                // 运维组id
						
//						organizationName: '',           // 运维组name
//						organizationId: '',   			// 运维组id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						exportType: '',                 // 1导出excel 2导出PDF
						//cycleTime: '',                  // 周期时间
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					
					// excel下载参数
					excelParams: {
						operationName: '',              // 运维组name
						operationId: '',                // 运维组id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						exportType: 1,                 // 1导出excel 2导出PDF
					},
					
					// pdf下载参数
					pdfParams: {
						operationName: '',              // 运维组name
						operationId: '',                // 运维组id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						exportType: 2,                 // 1导出excel 2导出PDF
					},
					
					
					startTime: '',
					endTime: '',
					data: []
				}
			},
			
			// 选择运维组弹窗配置
			configMaintenanceGroupDialog: {
				show:false,
				data: {
					type: 'search',
					selectId: ''
				}
			},
			
			
//			// 选择运维组弹窗配置
//			configMaintenanceGroupDialog: {
//				show:false,
//				data: {
//					type: 'addKpi',
//					selectId: ''
//				}
//			},
			
		}
	},
	mounted() {
		// 初始化统计周期的年份
		var year = new Date().getFullYear();
		for(var i = 2017; i <= year; i++){
			this.configSynthesisData.startTimeDropDownData.push({
				value: i, 
				label: i
			});
		};
		
		this.$nextTick(()=>{
			this.init();
		})
	},
	methods: {
		init(){
			this.getKpiTableData();
		},
		
		// 获取table数据
		getKpiTableData(){
			//this.$axios.post('/yzz/itsm/performance/manager/operationReportForm/queryOperationReportFormList', this.configSynthesisData.table.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/operationReportForm/queryOperationReportFormList', this.configSynthesisData.table.params).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					this.configSynthesisData.table.total = res.data.total;
					this.configSynthesisData.table.startTime = res.message.split(',')[0];
					this.configSynthesisData.table.endTime = res.message.split(',')[1];
					this.configSynthesisData.table.data = [];

					res.data.list.forEach((item1)=>{
						if(item1.userInfo.length == 0){
							this.configSynthesisData.table.data.push({
								operation: item1.operation,
								userName: '--',
								performance: '--',
								operationPerformance: item1.operationPerformance
							});
							return;
						};
						item1.userInfo.forEach((item2)=>{
							this.configSynthesisData.table.data.push({
								operation: item1.operation,
								userName: item2.userName,
								performance: item2.performance,
								operationPerformance: item1.operationPerformance
							})
						});
					});
					
					this.formatData();
				}else{
					this.configSynthesisData.table.data = [];
					this.configSynthesisData.table.total = 0;
					this.configSynthesisData.table.startTime = '';
					this.configSynthesisData.table.endTime = '';
				}
			});
		},
		
		// 数据格式化处理
		formatData(){
			for(var i = 0; i < this.configSynthesisData.table.data.length; i++){
				for(var j = i + 1; j < this.configSynthesisData.table.data.length; j++){
					if( this.configSynthesisData.table.data[i].operation == this.configSynthesisData.table.data[j].operation){
						//console.log( 'j = ' + j );
						this.configSynthesisData.table.data[j].span = [0, 0];
					}else{
						//console.log( i, j );
						this.configSynthesisData.table.data[i].span = [j - i, 1];
						i = j - 1;
						break;
					}
					if( (j + 1) >= this.configSynthesisData.table.data.length){
						this.configSynthesisData.table.data[i].span = [j - i + 1, 1];
						//console.log( JSON.stringify( this.configSynthesisData.table.data ));
						return;
					}
				}
			}
			
		},
		
		// 合并单元格
		arraySpanMethod( {row, column, rowIndex, columnIndex} ){
			if(column.label === '运维组' || column.label === '运维组绩效'){
				return row.span;
			}
		},
		
		// 查询table数据
		queryKpiTableData(){
			
			// 统计周期
			var startTime = this.configSynthesisData.form.data.startTimeValue;
			var endTime = this.configSynthesisData.form.data.endTimeValue;
			
			if( (!startTime && endTime) || (startTime && !endTime) ){
				this.$message.info('开始时间和结束时间至少有一项没有选择！');
				return;
			};
			
			if( startTime && endTime ){
				endTime = endTime.split(',');
	
				if( endTime.length == 1){
					this.configSynthesisData.form.data.startTime = startTime + '-' + endTime + '-0' + new Date(startTime, endTime[0], 1).getDate();
					this.configSynthesisData.form.data.endTime = startTime + '-' + endTime + '-' + new Date(startTime, endTime[0], 0).getDate();
				}else{
					this.configSynthesisData.form.data.startTime = startTime + '-' + endTime[0] + '-0' + new Date(startTime, endTime[0], 1).getDate();
					this.configSynthesisData.form.data.endTime = startTime + '-' + endTime[1] + '-' + new Date(startTime, endTime[1], 0).getDate();
				};	
			};
			
			this.configSynthesisData.table.params.pageNum = 1;
			this.$ies.syncValue(this.configSynthesisData.table.params, this.configSynthesisData.form.data);
			this.configSynthesisData.form.data.startTime = '';
			this.configSynthesisData.form.data.endTime = '';
			
			this.getKpiTableData();
		},
		
		// 统计周期
//		statisticalCycle(){
//			if(!this.configSynthesisData.form.data.startTimeValue || !this.configSynthesisData.form.data.endTime ){
//				this.$message.info('开始时间和结束时间都不能为空！');
//				return;
//			};
//			
//			var startTime = this.configSynthesisData.form.data.startTimeValue;
//			var endTime = this.configSynthesisData.form.data.endTimeValue.split(',');
//			//var startDay, endDay, cycleTime;
//			if( endTime.length == 1){
//				this.configSynthesisData.form.data.startTime = startTime + '-' + endTime + '-0' + new Date(startTime, endTime[0], 1).getDate();
//				this.configSynthesisData.form.data.endTime = startTime + '-' + endTime + '-' + new Date(startTime, endTime[0], 0).getDate();
//			}else{
//				this.configSynthesisData.form.data.startTime = startTime + '-' + endTime[0] + '-0' + new Date(startTime, endTime[0], 1).getDate();
//				this.configSynthesisData.form.data.endTime = startTime + '-' + endTime[1] + '-' + new Date(startTime, endTime[1], 0).getDate();
//			};
//
//		},
		
		// 重置查询表单数据
		resetQueryForm(){
			this.$refs['kpiForm'].resetFields();
			this.configSynthesisData.form.data.startTimeValue = '';
			this.configSynthesisData.form.data.endTimeValue = '';
			this.configSynthesisData.form.data.operationId = '';
			
			this.configMaintenanceGroupDialog.data.selectId = '';
		},
		
		
		// 导出Excel或PDF
		exportFile( v ){
			var self = this;
			
			if(v == 'Excel'){
				this.configSynthesisData.table.params.exportType = 1;
			}else if(v == 'PDF'){
				this.configSynthesisData.table.params.exportType = 2;
			};
			
			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
			var params = "?Token=" + token; 
			for(var key in this.configSynthesisData.table.params){
				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
			}
			//console.log( params );
			window.location.href = '/api/itsm/performance/manager/operationReportForm/export' + params;
			this.configSynthesisData.table.params.exportType = '';
		},
		
//		// 导出Excel
//		exportExcel(){
//			var self = this;
//			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
//			var params = "?Token=" + token; 
//			for(var key in this.configSynthesisData.table.params){
//				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
//			}
//			//console.log( params );
//			window.location.href = '/itsm/performance/manager/userReportForm/export' + params;
//		},
//		// 导出PDF
//		exportPDF(){
//			var self = this;
//			var token = this.$store.state.user.info ? this.$store.state.user.info.token : ''
//			var params = "?Token=" + token; 
//			for(var key in this.configSynthesisData.table.params){
//				params += '&' + key + '=' + this.configSynthesisData.table.params[key]
//			}
//			console.log( params );
//			//window.location.href = '';
//			window.location.href = '/itsm/performance/manager/userReportForm/export' + params;
//		},
		
        // pageSize 改变时会触发
        changeKpiSize( v ) {
        	this.configSynthesisData.table.params.pageSize = v;
            this.getKpiTableData();
        },
        
        // currentPage 改变时会触发
        changeKpiCurrent( v ) {
            this.configSynthesisData.table.params.pageNum = v;
            this.getKpiTableData();
        },
		
        // 显示选择运维组弹窗
        openMaintenanceGroupDialog(){
        	this.configMaintenanceGroupDialog.show = true;
        },
		// 关闭选择运维组弹窗回调
		closeMaintenanceGroupHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.operationName = data.groupName;
			this.configSynthesisData.form.data.operationId = data.id;
			this.configMaintenanceGroupDialog.data.selectId = data.groupCode;
		}
		
	}
}
</script>

<style lang="less">

</style>