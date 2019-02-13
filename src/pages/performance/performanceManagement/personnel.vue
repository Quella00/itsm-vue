<template>
	<div class="itsm-tabs-main">	
        <div class="tabs-main">
        	
        	<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
        	<div>
        	
	            <div class="tabs-panel-wrap border query-area">
	                <div class="panel-header">查询条件</div>
	                <div class="panel-body search-content">
	                    <el-form :inline="true" :model="configSynthesisData.form.data" ref="kpiForm" label-width="130px" class="search-conditions reset-form">
							<el-form-item label="人员：" prop="userName">
								<el-input v-model="configSynthesisData.form.data.userName" placeholder="请选择人员" auto-complete="off"></el-input>
								<i class="el-icon-my-more" @click="openPersonRadioDialog"></i>
							</el-form-item>
							
							<!--<el-form-item label="角色：" prop="roleName">
								<el-input v-model="configSynthesisData.form.data.roleName" placeholder="请选择角色" auto-complete="off" readonly="readonly"></el-input>
								<i class="el-icon-my-more" @click="selectPersonRadioShow"></i>
							</el-form-item>-->
							
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
		                    	<!--<el-button type="normal" icon="el-icon-my-reset" @click="test">测试</el-button>-->
		                    	<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
		                        <el-button type="normal" icon="el-icon-my-search" @click="queryKpiTableData">查询</el-button>
		                    </div>
	                </div>
	
	                <div class="panel-body">
	                	
	                    <el-table :data="configSynthesisData.table.data" :span-method="arraySpanMethod" border style="width:100%;" class="simple-table" >
	                    	<el-table-column label="人员工作绩效统计" class-name="table-column-group">
	                    		<el-table-column :label="'统计时间：' + configSynthesisData.table.startTime +'至'+ configSynthesisData.table.endTime" class-name="table-column-group">
	                    			<el-table-column prop="userName" label="人员"></el-table-column>
	                    			<el-table-column prop="roleName" label="角色"></el-table-column>
	                    			<el-table-column prop="organizationName" label="组织"></el-table-column>
			                        <el-table-column prop="operationName" label="运维组"></el-table-column>
			                        <el-table-column prop="performance" label="工作绩效"></el-table-column>
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
        
		<!--选择角色弹窗-->
		<!--<ies-roleRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-roleRadioDialog>-->
	    
		<!-- 选择人员弹窗 -->
		<ies-personRadioDialog v-model="configPersonRadioDialog.show" v-if="configPersonRadioDialog.show" @selectPersonRadioHandler="closePersonRadioHandler" :defaultSelect='configPersonRadioDialog.data'></ies-personRadioDialog>

	    
    </div>
</template>

<script>
export default {
	data() {
		return {
			// 人员绩效报表数据
			configSynthesisData: {
				form: {
					data: {
						userName: '',        // 用户name
						userId: '',      	 // 用户id
						
//						roleName: '',        // 角色name
//						roleId: '',          // 角色Id
						
//						startTimeLabel: '',
//						startTime: '',      //开始时间
//						
//						endTimeLabel: '',
//						endTime: '',        // 结束时间
						
						startTimeValue: '',
						startTime: '',
						
						endTimeValue: '',
						endTime: '',
					}
				},
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						userName: '',                   // 用户名
						userId: '',   					// 用户id
						//roleId: '',                     // 角色id
						startTime: '',           		// 开始时间
						endTime: '',              		// 结束时间
						
	                    pageNum: 1,                  	// 当前页
						pageSize: 10                 	// 每页数量
					},
					
					startTime: '',
					endTime: '',
					data: []
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
				]
				
				
			},
			
			// 选择角色弹窗（单选）
//			selectPersonRadioDialog:{
//				show:false,
//				data:{
//					type:'search',
//					id:''
//				}
//			},

			// 选择人员弹窗（单选）
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
		

		
//		test(){
//			this.$axios.post('/itsm/performance/manager/userReportForm/feginTest').then((res) => {
//				
//			});
//		},
		
		// 获取table数据
		getKpiTableData(){
			//this.$axios.post('/yzz/itsm/performance/manager/userReportForm/queryUserReportList', this.configSynthesisData.table.params).then((res) => {
			this.$axios.post('/itsm/performance/manager/userReportForm/queryUserReportList', this.configSynthesisData.table.params).then((res) => {
				if(res.status == 200 && res.data.list && res.data.list.length) {
					this.configSynthesisData.table.total = res.data.total;
					this.configSynthesisData.table.startTime = res.message.split(',')[0];
					this.configSynthesisData.table.endTime = res.message.split(',')[1];
					this.configSynthesisData.table.data = [];

					res.data.list.forEach((item1)=>{
						if(item1.role.length == 0){
							this.configSynthesisData.table.data.push({
								userName: item1.userName,
								userId: item1.userId,
								roleName: '--',
								performance: '--',
								organizationName: item1.organizationName,
								operationName: item1.operationName,
							})
							return;
						};
						item1.role.forEach((item2)=>{
							this.configSynthesisData.table.data.push({
								userName: item1.userName,
								userId: item1.userId,
								roleName: item2.roleName,
								performance: item2.performance,
								organizationName: item1.organizationName,
								operationName: item1.operationName,
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
					if( this.configSynthesisData.table.data[i].userId == this.configSynthesisData.table.data[j].userId){
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
			if(column.label === '人员' || column.label === '组织' || column.label === '运维组'){
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
		
		// 重置查询表单数据
		resetQueryForm(){
			this.$refs['kpiForm'].resetFields();
			this.configSynthesisData.form.data.startTimeValue = '';
			this.configSynthesisData.form.data.endTimeValue = '';
			this.configSynthesisData.form.data.userId = '';
			
			this.configPersonRadioDialog.data.id = '';
			//this.configSynthesisData.form.data.roleId = '';
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
			window.location.href = '/api/itsm/performance/manager/userReportForm/export' + params;
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
//			console.log( params );
//			//window.location.href = '';
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
		
		
		// 显示选择人员弹窗(单选)
		openPersonRadioDialog() {
			this.configPersonRadioDialog.show = true;
		},
		// 关闭选择人员弹窗(单选)回调
		closePersonRadioHandler(data) {
			data = JSON.parse(data);
			this.configSynthesisData.form.data.userName = data.userName;
			this.configSynthesisData.form.data.userId = data.id;
			this.configPersonRadioDialog.data.id = data.id;
		},

		
//		// 选择角色弹窗(单选)
//		selectPersonRadioShow() {
//			this.selectPersonRadioDialog.show = true;
////			this.selectPersonRadioDialog.data = {
////			 	type:'search',
////			 	id:this.maintenanceGroup.searchForm.userId
////			}
//		},
//		// 关闭选择角色弹窗(单选)回调
//		selectPersonRadioHandler(data) {
//			if (data) {
//				var data = JSON.parse(data);
//				this.configSynthesisData.form.data.roleName = data.roleName;
//				this.configSynthesisData.form.data.roleId = data.id;
//				this.selectPersonRadioDialog.data.id = data.id;
//			}
//		},
		
		
		
	}
}
</script>

<style lang="less">

</style>