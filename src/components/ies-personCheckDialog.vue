<!--选择人员弹窗（可以多选，数据回显）-->
<template>
	<el-dialog title="选择多人" :visible="true" custom-class="select-person" @close="personChoose()" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="height: 80px;">
					<el-form :inline="true" :model="selectPersonDialog.selectPersonForm" label-width='110px'>
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
					selectedAll: [],         // 二维数组,第一个数组存当前页的id，第二个数组存当前页外的id
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
        		this.selectPersonDialog.selectedAll[0] = this.defaultSelect.selected;
        		this.getTableData('init');
        	},
        	//获取表格数据
        	getTableData(v){
        		v !== 'init' && this.mergeCheckedData();
        		
        		this.params = {
        			userName:this.selectPersonDialog.searchConditions.userName,
        			loginName:this.selectPersonDialog.searchConditions.loginName,
        			pageNum: this.selectPersonDialog.pagination.currentPage,
        			pageSize: this.selectPersonDialog.pagination.pageSize
        		}
        		switch(this.defaultSelect.type) {
					case 'maintenance':   			// 运维组管理编辑相关人员
						this.url = "/itsm/system/permission/operationGroup/queryUserByOrganizationId";
						this.params['groupId'] = this.defaultSelect.groupId;              //运维组id
        				this.params['organizationId'] = this.defaultSelect.organizationId;//组织id
					  break;
					case 'maintenancePersonnel':	// 运维组下所有人员
						this.url = "/itsm/system/sso/user/queryUserByOperationGroup";
						break;
					case 'createKnowledge':	// 创建知识时候查询 启用、在职人员
						this.url = "/itsm/system/sso/user/queryUserPageByCondition";
						this.params['accountStatus'] = 0;
						this.params['availableStatus'] = 0;
						break;
					case 'knowledgeAudit':	// 知识审核时候，所有人员(人员管理中人员)
						this.url = "/itsm/system/sso/user/queryAddUserByStatusAndUnAvailable";
						break;
					default:  					
						this.url = "/itsm/system/sso/user/querySystemUser";
				} 
        		this.$axios.post(this.url,this.params).then( (res) => {
					if(res.status == 200 && res.data) {
						this.selectPersonDialog.tableData = res.data.list;
						this.selectPersonDialog.pagination.total = res.data.total;
						this.selectPersonDialog.selectedAll[1] = [];
						this.selectPersonDialog.selectedAll[2] = [];
						this.selectPersonDialog.selectedAll[0].forEach( item1 => {
							var flag = true;
							this.selectPersonDialog.tableData.forEach( item2 => {
								if(item1.id == item2.id) {
									flag = false;
									this.selectPersonDialog.selectedAll[1].push(item2);
									this.$nextTick( ()=>{
										this.$refs.multipleTable.toggleRowSelection(item2);
									});
								}
							});
							flag && this.selectPersonDialog.selectedAll[2].push(item1);
						});
					}
				});
        	},
        	// 合并数据
        	mergeCheckedData(){
				this.selectPersonDialog.selectedAll[0] = this.selectPersonDialog.selectedAll[1].concat(this.selectPersonDialog.selectedAll[2]);
				return this.selectPersonDialog.selectedAll[0];
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
            		if(this.defaultSelect.type == "rolePerson" || 'createKnowledge') {
            			this.$emit('selectPersonCheckboxHandler',this.mergeCheckedData());
            			this.$emit('input', false);
            		} else {
            			if(this.mergeCheckedData().length > 10) {
            				this.$message({ message: "最多只能选择10条数据", type: 'error' });
            			} else {
            				this.$emit('selectPersonCheckboxHandler',this.mergeCheckedData());
            				this.$emit('input', false);
            			}
            		}
            	} else {
            		this.$emit('input', false);
            	}
            },
            handleSelectionChange(v) {
				this.selectPersonDialog.selectedAll[1] = v;
			},
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch: {

        }
    }
</script>
