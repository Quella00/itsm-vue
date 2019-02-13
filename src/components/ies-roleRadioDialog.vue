<!--选择人员弹窗（单选）-->
<template>
    <el-dialog title="添加角色" :visible="value" custom-class="select-person" @close="personChoose()" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 80px;">
					<el-form :inline="true" :model="selectPersonDialog.selectPersonForm">
						<el-form-item label="角色名称：">
							<el-input placeholder="请输入角色名称" v-model="selectPersonDialog.userName"></el-input>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight="tableHeight">
				<div class="panel-header">
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="selectPersonDialog.tableData" :row-class-name="tableRowClassName" stripe style="width: 100%;" :max-height="tableHeight">
						<el-table-column width="55" align="center">
							<template slot-scope="scope">
								<!--<el-radio v-model="selectPersonDialog.radio" :label="JSON.stringify(scope.row)"></el-radio>-->
								<template v-if="scope.row.disabled">
									<el-radio v-model="selectPersonDialog.radio" disabled :label="JSON.stringify(scope.row)"></el-radio>
								</template>
								<template v-else>
									<el-radio v-model="selectPersonDialog.radio" :label="JSON.stringify(scope.row)"></el-radio>
								</template>
							</template>

							
						</el-table-column>
						
						<el-table-column label="角色名称" prop="roleName" show-overflow-tooltip></el-table-column>
						<el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
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
            	tableHeight:'',
            	// 选择人员弹窗
				selectPersonDialog: {
					show: true,
					radio: "",
					url:'',
					tableData: [],
					loginName: '',
					userName: '',
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
            };
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
        	getTableData(){
				const self = this;

        		if(self.defaultSelect.type && self.defaultSelect.type == 'addKpi'){ // 查询角色，去除已添加kpi的角色
        			//self.selectPersonDialog.url = 'http://192.168.3.22:9900/itsm/performance/manager/queryExistenceRole';
        			self.selectPersonDialog.url = '/itsm/system/permission/role/queryRolePageInfoByName';
        		}else if(self.defaultSelect.type && self.defaultSelect.type == 'search'){
        			self.selectPersonDialog.url = '/itsm/performance/manager/workOrdeReportForm/queryRoleAll';  
        		};
        		
        		//self.selectPersonDialog.url = 'http://192.168.3.22:9900/itsm/performance/manager/queryExistenceRole';
        		var params = {
        			roleName:self.selectPersonDialog.searchConditions.userName,
        			//loginName:self.selectPersonDialog.searchConditions.loginName,
        			pageNum: self.selectPersonDialog.pagination.currentPage,
        			pageSize: self.selectPersonDialog.pagination.pageSize
        		};
        		
        		self.$axios.post(self.selectPersonDialog.url,params).then( (res) => {
					if(res.status == 200) {
						self.selectPersonDialog.tableData = res.data.list;
						self.selectPersonDialog.pagination.total = res.data.total;
						self.selectPersonDialog.radio = '';
						self.$nextTick(function () {
							self.defaultSelect && self.selectPersonDialog.tableData.forEach(function(val, index) {								
								if (val.id == self.defaultSelect.id) {
	                       			self.selectPersonDialog.radio = JSON.stringify(val);
	                       	  	}							
							});
			        	});
			        	
						if(self.defaultSelect.type && self.defaultSelect.type == 'addKpi'){
							self.getAddedRole();
        				}
			        	
					}
				});
				
				
//      		self.$axios.post('http://192.168.3.22:9900/itsm/performance/manager/queryExistenceRole').then( (res) => {
//					if(res.status == 200) {
//					}
//				});
				
				
				
				
        	},
        	
        	getAddedRole(){
        		const self = this;
        		self.$axios.post('/itsm/performance/manager/queryExistenceRole').then( (res) => {
					if(res.status == 200) {
						var addedIds = res.data.map((item)=>{
							return item.roleId
						});
						console.log( addedIds );
						self.selectPersonDialog.tableData.forEach(function(val, index) {
							if( addedIds.indexOf(val.id) >= 0 ){
								self.$set(val, 'disabled', true);
							}else{
								self.$set(val, 'disabled', false);
							}
						});
						console.log(self.selectPersonDialog.tableData);
					}
				});
				
        	},
        	
        	tableRowClassName({row, rowIndex}){
        		console.log( row.disabled );
		        if (row.disabled) {
		          return 'is-disabled';
		        } 
		        return '';
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
            personChoose(type) {
            	if(type == 'confirm') {
            		this.selectPersonDialog.radio && this.$emit('selectPersonRadioHandler',this.selectPersonDialog.radio);
            	}
            	this.$emit('input', false);
            	this.selectPersonDialog.radio = "";
            	this.selectPersonDialog.loginName = "";
            	this.selectPersonDialog.userName = "";
            	this.selectPersonDialog.searchConditions.loginName = "";
            	this.selectPersonDialog.searchConditions.userName = "";
            }
        },
        filters: {
        	
        },
        computed: {
        	
        },
        watch: {
        	
        }
    }
</script>
<style language="less">
	.select-person .is-disabled{
		color:#ccc; cursor:not-allowed;
	}
</style>