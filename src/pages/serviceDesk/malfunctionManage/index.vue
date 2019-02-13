<!--故障管理-->
<template>
	<div class="itsm-tabs-main malfunction-manage">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 150px;">
					<el-form label-width="110px" :model="malfunction.ruleForm" :rules="malfunction.rules" ref="ruleForm" :inline="true" class="search-conditions">
						<el-form-item label="告警内容 ：" prop="content">
							<el-input placeholder="请输入告警内容" v-model="malfunction.ruleForm.content"></el-input>
						</el-form-item>						
						<el-form-item label="状态 ：" prop="status">
							<el-select v-model="malfunction.ruleForm.status" placeholder="请选择状态" @focus="selectOnFocus">
								<el-option v-for="item in malfunction.status" :key="item.value" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>						
						<el-form-item label="告警级别 ：" prop="alarmState">
							<el-select v-model="malfunction.ruleForm.alarmState" placeholder="请选择告警级别" @focus="selectOnFocus">
								<el-option v-for="item in malfunction.alarmState" :key="item.value" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发生时间 ：" class="time"  prop="time">					
							<el-date-picker  v-model="malfunction.ruleForm.time"  type="datetimerange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
						</el-form-item>						
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-ignore" @click="ignore">忽略</el-button>
						<el-button type="normal" icon="el-icon-my-create" @click="createOrder">创建工单</el-button>						
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="reset">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="malfunctionTable" :data="malfunction.tableData"  :fit="true" stripe  style="width: 100%;">
						<el-table-column width="55" align="center">
							<template slot-scope="scope">
								<el-radio v-model="malfunction.radio" :label="scope.row"></el-radio>
							</template>
						</el-table-column>
						<el-table-column prop="alarmState" label="严重级别" show-overflow-tooltip></el-table-column>
						<el-table-column prop="content" label="告警内容" show-overflow-tooltip></el-table-column>
						<el-table-column prop="collectionTime" label="发生时间" show-overflow-tooltip></el-table-column>
						<el-table-column prop="status" label="状态" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="malfunction.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
						:page-size="malfunction.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="malfunction.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name:'malfunctionManage',
		data() {			
			return {
				malfunction:{
					//查询条件
					ruleForm:{
						content:'',    //告警内容
						status:'',           //状态
						alarmState:'',      //告警级别
						time:[]
					},
					searchCondition:{
						content:'',          //告警内容
						status:'',           //状态
						alarmState:'',      //告警级别
						startTime:'',      //开始时间
						endTime:'',        //结束时间
						time:[]
					},
					status:[
							{ value: '', label: '全部' },
							{ value: '0', label: '待处理' },
							{ value: '1', label: '处理中' },
							{ value: '-1', label: '已忽略' },
							{ value: '2', label: '已关闭' }
					],
					alarmState:[
						    { value: '', label: '全部' },	
						    { value: '一级（最高）', label: '一级（最高）' },	
						    { value: '二级（高）', label: '二级（高）' },	
						    { value: '三级（中）', label: '三级（中）' },	
						    { value: '四级（低）', label: '四级（低）' },	
						    { value: '五级（最低）', label: '五级（最低）' }
					],
					tableData:[],       //表格数据   
					radio:'',           //选中的id
					pagination: {		   //分页
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				}
			};
		},
		activated () {
	        this.$nextTick(this.init);
	    },
		mounted() {
			this.$nextTick( ()=>{
				this.init();
				$('.el-range-input').on('focus',function(e){
					 e.target.blur();
				})
			});
		},
		methods: {
			init(){
				this.getTableData();
			},
			//解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
			//获取表格数据
			getTableData(){
				var params = {
					content:this.malfunction.searchCondition.content,
					status:this.malfunction.searchCondition.status,
					alarmState:this.malfunction.searchCondition.alarmState,
					startTime:this.malfunction.searchCondition.startTime,
					endTime:this.malfunction.searchCondition.endTime,
					pageNum:this.malfunction.pagination.currentPage,
					pageSize :this.malfunction.pagination.pageSize
				}
				this.$axios.post('/itsm/qinzhi/alarmmanagement/queryAllAlarm',params).then( (res) => {
					if(res.status == 200) {
						this.malfunction.tableData = res.data.list;
						this.malfunction.pagination.total = res.data.total;
						this.malfunction.radio = "";
					}
				});
			},
			//sizeChange事件
			handleSizeChange(size){
				this.malfunction.pagination.pageSize = size;
				this.getTableData();
			},
			//currentChange事件
			handleCurrentChange(currentPage){
				this.malfunction.pagination.currentPage = currentPage;
				this.getTableData();
			},
			//创建工单
			createOrder(){
//				console.log(this.malfunction.radio);
				if(this.malfunction.radio == ''){
					this.$message.warning("请先选择一个告警信息");
					return;
				}else if(this.malfunction.radio.status != '0'){
					this.$message.warning("告警状态有误，不能创建工单");
					return;	
				}
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/serviceDesk/malfunctionManage/createOrder?alarmId='+this.malfunction.radio.aid);
			},
			//忽略
			ignore(){
				const self = this;
				if(self.malfunction.radio == ''){
					self.$message.warning("请先选择一个告警信息");
					return;
				}else if(self.malfunction.radio.status != '0'){
					self.$message.warning("告警状态有误，不能忽略告警信息");
					return;	
				}else{
					self.$confirm('是否确定忽略选中的告警信息?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
						self.$axios.post('/itsm/qinzhi/alarmmanagement/ignoreAlarm',{list:self.malfunction.radio.aid}).then( (res) => {
							if(res.status == 200) {
								self.$message.success('忽略成功');
								self.getTableData();
							} else {
								self.$message.error('忽略失败');
							}
						});
					}).catch(() => {
						self.$message.info('已取消忽略');
					});
				}
			},
			//搜索
			search(){	
				this.malfunction.pagination.currentPage = 1;
				this.malfunction.searchCondition.content = this.malfunction.ruleForm.content;
				this.malfunction.searchCondition.status = this.malfunction.ruleForm.status;
				this.malfunction.searchCondition.alarmState = this.malfunction.ruleForm.alarmState;
				this.malfunction.searchCondition.startTime = (this.malfunction.ruleForm.time && this.malfunction.ruleForm.time.length > 0) ? this.malfunction.ruleForm.time[0] : '';
				this.malfunction.searchCondition.endTime = (this.malfunction.ruleForm.time && this.malfunction.ruleForm.time.length > 0) ? this.malfunction.ruleForm.time[1] : '';
				this.getTableData();
			},
			//重置
			reset(){
				this.$refs['ruleForm'].resetFields();
				this.malfunction.ruleForm.time = '';
				this.malfunction.searchCondition = {
					content:'',    //告警内容
					status:'',           //状态
					alarmState:'',      //告警级别
					startTime:'',      //开始时间
					time:[]
				}
			},
			//转换状态
			changeStatus(row, column, cellValue){
				switch(row.status){
                    case -1:
						return '已忽略'	
					break;
					case 0:
						return '待处理'	
					break;
					case 1:
						return '处理中'	
					break;
					case 2:
						return '已关闭'	
					break;
				}
			}
		},
		watch:{
			
		},
		filter:{
			
		}
	}
</script>

<style lang="less">
	
</style>