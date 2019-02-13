<!--选择人员弹窗（可以多选）-->
<template>
	<el-dialog title="选择多人" :visible="value" custom-class="select-person" @close="personChoose()" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 80px;">
					<el-form :inline="true" :model="selectPersonDialog.selectPersonForm">
						<el-form-item label="登录ID：">
							<el-input placeholder="请输入登录ID" v-model="selectPersonDialog.loginName"></el-input>
						</el-form-item>
						<el-form-item label="用户名：">
							<el-input placeholder="请输入用户名" v-model="selectPersonDialog.userName"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight="tableH">
				<div class="panel-header">
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="selectPersonDialog.tableData" stripe style="width: 100%;" @selection-change="handleSelectionChange" ref="multipleTable" :max-height="tableH">
						<el-table-column width="55" align="center" type="selection"></el-table-column>
						<el-table-column label="工号" prop="userCode" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column label="登录ID" prop="loginName" show-overflow-tooltip></el-table-column>
						<el-table-column label="用户名" prop="userName" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="selectPersonDialog.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
						:page-size="selectPersonDialog.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="selectPersonDialog.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="normal" @click="personChoose">取&nbsp;消</el-button>
			<el-button type="normal" @click="personChoose('confirm')">确定</el-button>
		</div>
	</el-dialog>
</template>

<script>
    export default {
    	components:{ 

		},        
        props:['defaultSelect','value'],
    	data() {
            return {
            	tableH: '',
            	selectPersonDialog: {
					show: true,
					selected: [],
					tableData: [],
					loginName: '',
					userName: '',
					url:'',
					params:{},
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                   },
					searchConditions:{
						userName: '',
						loginName:''
					},
				}
            }
        },
		mounted() {
        	this.$nextTick(function () {
                this.init();
        	});
    	},
        methods: {
        	init() {        		        		
        		this.getTableData();
        	},
        	//获取表格数据
        	getTableData(){
        		this.params = {
        			userName:this.selectPersonDialog.searchConditions.userName,
        			loginName:this.selectPersonDialog.searchConditions.loginName,
        			pageNum: this.selectPersonDialog.pagination.currentPage,
        			pageSize: this.selectPersonDialog.pagination.pageSize
        		}
        		switch(this.defaultSelect.type){
					case 'maintenance':   			// 运维组管理编辑相关人员
						this.url = "/itsm/system/permission/operationGroup/queryUserByOrganizationId";
						this.params['groupId'] = this.defaultSelect.groupId;              //运维组id
        				this.params['organizationId'] = this.defaultSelect.organizationId;//组织id
					  break;
					case 'maintenancePersonnel':	// 运维组下所有人员
						this.url = "/itsm/system/sso/user/queryUserByOperationGroup";
						break;
					default:  					
						this.url = "/itsm/system/sso/user/querySystemUser";
				}  
        		this.$axios.post(this.url,this.params).then( (res) => {
					if(res.status == 200) {
						this.selectPersonDialog.tableData = res.data.list;
						this.selectPersonDialog.pagination.total = res.data.total;
					}
				});
        	},
            handleSizeChange(val) {
				this.selectPersonDialog.pagination.pageSize = val;
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.selectPersonDialog.pagination.currentPage = val;
				this.getTableData();
			},
			// 查询
			search() {
				this.selectPersonDialog.searchConditions.userName = this.selectPersonDialog.userName;   
				this.selectPersonDialog.searchConditions.loginName = this.selectPersonDialog.loginName;
				this.selectPersonDialog.pagination.currentPage = 1;
				this.getTableData();
			},
			// 关闭或者点击保存
            personChoose(type){
            	if(type == 'confirm' && this.selectPersonDialog.selected.length != 0) {
            		this.$emit('selectPersonCheckboxHandler',this.selectPersonDialog.selected);
            	}
            	this.$emit('input', false);
            	this.selectPersonDialog.selected = [];
            	this.selectPersonDialog.loginName = "";
            	this.selectPersonDialog.userName = "";
            	this.selectPersonDialog.searchConditions.loginName = "";
            	this.selectPersonDialog.searchConditions.userName = "";
            	this.selectPersonDialog.pagination.pageSize = 10;
            	this.selectPersonDialog.pagination.currentPage = 1;
            },
            handleSelectionChange(v) {
				this.selectPersonDialog.selected = v;
			},
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch: {
//      	value(v) {
//				v && this.$nextTick(function () {
//					this.init();					
//				});
//			}
        }
    }
</script>
