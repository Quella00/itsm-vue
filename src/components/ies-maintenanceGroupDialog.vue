<!--选择运维组弹窗（单选）-->
<template>
    <el-dialog title="选择运维组" :visible="value" custom-class="select-person" @close="maintenanceGroupChoose()" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 80px;">
					<el-form :inline="true" :model="selectMaintenanceGroupDialog.selectMaintenanceGroupForm">
						<el-form-item label="名称：">
							<el-input placeholder="请输入名称" v-model="selectMaintenanceGroupDialog.groupName"></el-input>
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
					<el-table :data="selectMaintenanceGroupDialog.tableData" :row-class-name="tableRowClassName" stripe style="width: 100%;" :max-height="tableHeight">
						<el-table-column width="55" align="center">
							<template slot-scope="scope">
								<template v-if="scope.row.disabled">
									<el-radio v-model="selectMaintenanceGroupDialog.radio" disabled :label="JSON.stringify(scope.row)">111</el-radio>
								</template>
								<template v-else>
									<el-radio v-model="selectMaintenanceGroupDialog.radio" :label="JSON.stringify(scope.row)">111</el-radio>
								</template>
							</template>
						</el-table-column>
						<!--<el-table-column label="工号" prop="userCode" width="180" show-overflow-tooltip></el-table-column>-->
						<el-table-column label="编号" prop="groupCode" show-overflow-tooltip></el-table-column>
						<el-table-column label="名称" prop="groupName" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="selectMaintenanceGroupDialog.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
						:page-size="selectMaintenanceGroupDialog.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="selectMaintenanceGroupDialog.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="normal" @click="maintenanceGroupChoose">取&nbsp;消</el-button>
			<el-button type="normal" @click="maintenanceGroupChoose('confirm')">确定</el-button>
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
				selectMaintenanceGroupDialog: {
					show: true,
					radio: "",
					url:'',
					tableData: [],
					groupName: '',
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                  	},
                  	searchConditions:{
						groupName: ''
					},
				}
            };
        },
		mounted() {
        	this.$nextTick(function () {
        		console.log( this.defaultSelect );
				this.init();
        	});
    	},
        methods: {
        	init() {
        		this.getTableData();
        	},
        	getTableData(){
				const self = this;
        		if(self.defaultSelect.type && self.defaultSelect.type == 'addKpi'){  //查询所有人员，包括禁用的
        			//self.selectMaintenanceGroupDialog.url = 'http://192.168.3.22:9900/itsm/performance/manager/queryExistenceOperation';
        			self.selectMaintenanceGroupDialog.url = '/itsm/system/permission/operationGroup/query';
        		}else{
        			self.selectMaintenanceGroupDialog.url = '/itsm/system/permission/operationGroup/query';   
        		}
				//self.selectMaintenanceGroupDialog.url = 'http://192.168.3.22:9900/itsm/performance/manager/queryExistenceOperation';
				
        		var params = {
        			groupName: self.selectMaintenanceGroupDialog.searchConditions.groupName,
        			pageNum: self.selectMaintenanceGroupDialog.pagination.currentPage,
        			pageSize: self.selectMaintenanceGroupDialog.pagination.pageSize
        		}
        		self.$axios.post(self.selectMaintenanceGroupDialog.url,params).then( (res) => {
					if(res.status == 200) {
						self.selectMaintenanceGroupDialog.tableData = res.data.list;
						self.selectMaintenanceGroupDialog.pagination.total = res.data.total;
						self.selectMaintenanceGroupDialog.radio = '';
						self.$nextTick(function () {
							self.defaultSelect.selectId && self.selectMaintenanceGroupDialog.tableData.forEach(function(val, index) {								
								if (val.groupCode == self.defaultSelect.selectId) {
	                       			self.selectMaintenanceGroupDialog.radio = JSON.stringify(val);
	                       	  	}
							});
			        	});
			        	
						if(self.defaultSelect.type && self.defaultSelect.type == 'addKpi'){
							self.getAddedMaintenanceGroup();
						}
			        	
					}
				});
        	},
        	
        	getAddedMaintenanceGroup(){
        		const self = this;
        		self.$axios.post('/itsm/performance/manager/queryExistenceOperation').then( (res) => {
					if(res.status == 200) {
						var addedIds = res.data.map((item)=>{
							return item.operationId
						});
						//console.log( addedIds );
						self.selectMaintenanceGroupDialog.tableData.forEach(function(val, index) {
							if( addedIds.indexOf(val.id) >= 0 ){
								self.$set(val, 'disabled', true);
							}else{
								self.$set(val, 'disabled', false);
							}
						});
						//console.log(self.selectMaintenanceGroupDialog.tableData);
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
            	this.selectMaintenanceGroupDialog.pagination.pageSize = val;
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.selectMaintenanceGroupDialog.pagination.currentPage = val;
				this.getTableData();
			},
			// 查询
			search() {
				this.selectMaintenanceGroupDialog.searchConditions.groupName = this.selectMaintenanceGroupDialog.groupName;
				this.selectMaintenanceGroupDialog.pagination.currentPage = 1;
				this.getTableData();
			},
            // 关闭或者点击保存
            maintenanceGroupChoose(type) {
            	if(type == 'confirm') {
            		this.selectMaintenanceGroupDialog.radio && this.$emit('selectMaintenanceGroupHandler',this.selectMaintenanceGroupDialog.radio);
            	}
            	this.$emit('input', false);
            	this.selectMaintenanceGroupDialog.radio = "";
            	this.selectMaintenanceGroupDialog.groupName = "";
            	this.selectMaintenanceGroupDialog.searchConditions.groupName = "";
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