<!--投诉管理-->
<template>
	<div class="itsm-tabs-main complain-manage">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form label-width="110px" :model="complainManage.ruleForm" :rules="complainManage.rules" ref="ruleForm" :inline="true" class="search-conditions">
						<el-form-item label="被投诉人："  prop="complainedName">
							<el-input placeholder="请选择被投诉人" readonly v-model="complainManage.ruleForm.complainedName" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="chooseComplainer()"></i>
						</el-form-item>
						<el-form-item label="投诉回访：" prop="returnVisit">
						    <el-select v-model="complainManage.ruleForm.returnVisitStatus" placeholder="请选择投诉回访" @focus="selectOnFocus">
								<el-option v-for="item in complainManage.returnVisitStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>	
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">					
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="reset">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="complainManageTable" :data="complainManage.tableData"  :fit="true" stripe  style="width: 100%;">
						<el-table-column prop="complainUserName" label="投诉人" show-overflow-tooltip></el-table-column>
						<el-table-column prop="respondentUserName" label="被投诉人" show-overflow-tooltip></el-table-column>
						<el-table-column prop="returnVisitStatus" label="投诉回访" show-overflow-tooltip :formatter="changeStatus"></el-table-column>
						<el-table-column prop="customerSatisfaction" label="评价结果" show-overflow-tooltip></el-table-column>
						<el-table-column prop="complainTime" label="投诉时间" show-overflow-tooltip></el-table-column>
						<el-table-column  label="操作">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openEditDialog(scope.row.id)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="complainManage.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
						:page-size="complainManage.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="complainManage.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<!--选择人员弹窗(搜索时候单选的)-->
		<ies-personRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-personRadioDialog>	
	</div>
</template>

<script>
	export default {
		name:'complainManage',
		data() {
			return {
				complainManage:{
					//查询条件
					ruleForm:{	
						complained:'',
						returnVisit:'',
						respondentUserId:'',
						returnVisitStatus:'',
						complainedName:''
					},
					searchCondition:{
						complained:'',
						returnVisit:'',
						respondentUserId:'',
						returnVisitStatus:''
					},
					returnVisitStatus:[
						{ label: '全部', value: '' },
						{ label: '已回访', value: '1' },
						{ label: '未回访', value: '0' },
					],
					rules: {},
					tableData:[],
					pagination: {		   //分页
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				},
				//选择人员弹窗（单选）
				selectPersonRadioDialog:{
					show:false,
					data:""
				},
			};
		},
		activated () {
	        this.$nextTick(this.init);
	    },
		mounted() {
			this.$nextTick( ()=>{
				this.init();
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
					pageNum:this.complainManage.pagination.currentPage,
					pageSize:this.complainManage.pagination.pageSize,
					respondentUserId:this.complainManage.searchCondition.respondentUserId,
					returnVisitStatus:this.complainManage.searchCondition.returnVisitStatus
				}
//				for(var key in params){
//					if(params[key] == ''){
//						delete params[key]
//					}
//				}
				this.$axios.post('/itsm/process/manager/complain/query',params).then( (res) => {
					if(res.status == 200) {
						this.complainManage.tableData = res.data.list;
						this.complainManage.pagination.total = res.data.total;
					}
				});
			},
			//sizeChange事件
			handleSizeChange(pageSize){
				this.complainManage.pagination.pageSize = pageSize;
				this.getTableData();
			},
			//currentChange事件
			handleCurrentChange(currentPage){
				this.complainManage.pagination.currentPage = currentPage;
				this.getTableData();
			},			
			//搜索
			search(){
				this.complainManage.pagination.currentPage = 1;
				this.complainManage.searchCondition.respondentUserId = this.complainManage.ruleForm.respondentUserId;
				this.complainManage.searchCondition.returnVisitStatus = this.complainManage.ruleForm.returnVisitStatus;
				this.getTableData();
			},
			//打开编辑投诉弹窗
			openEditDialog(id){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceDesk/complainManage/editComplain?id=' + id);				
			},
			//打开被投诉人弹窗
			chooseComplainer(){
				this.selectPersonRadioDialog.data = {
					id:this.complainManage.ruleForm.respondentUserId,
					type:'search'
				}
				this.selectPersonRadioDialog.show = true;
			},
			//关闭选择人员弹窗回调
			selectPersonRadioHandler(data){
				var data = JSON.parse(data);
				this.complainManage.ruleForm.respondentUserId = data.id;
				this.complainManage.ruleForm.complainedName = data.userName;
			},
			//转换状态
			changeStatus(row, column, cellValue){
				switch(row.returnVisitStatus){
                    case 0:
						return '未回访'	
					break;
					case 1:
						return '已回访'	
					break;					
				}
			},
			reset(){
				this.$refs['ruleForm'].resetFields();
				this.complainManage.ruleForm.returnVisitStatus = '';
				this.complainManage.ruleForm.respondentUserId = '';
				this.complainManage.searchCondition.returnVisitStatus = '';
				this.complainManage.searchCondition.respondentUserId = '';
			}
		}
	}
</script>

<style lang="less">
	.complain-manage{
		.tabs-main .el-table a{color:#57a9fd;}
		.tabs-main .search-conditions{margin-top:25px;}
		.search-conditions .el-form-item{margin-right:50px;}
	}	
</style>