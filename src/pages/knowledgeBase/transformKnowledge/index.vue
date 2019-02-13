<!--待转化知识-->
<template>
	<div class="itsm-tabs-main transformKnowledge">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form :inline="true" :model="transformKnowledge.searchForm" ref="searchForm" class="search-conditions" label-width="110px">
						<el-form-item label="创建人：" prop="creator">
							<el-input placeholder="请选择创建人" v-model="transformKnowledge.searchForm.creator" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectCreatorOpen"></i>
						</el-form-item>
						<el-form-item label="处理人：" prop="handler">
							<el-input placeholder="请选择处理人" v-model="transformKnowledge.searchForm.handler" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectHandlerOpen"></i>
						</el-form-item>
						<el-form-item label="工单主题：" prop="theme">
							<el-input placeholder="请输入工单主题" v-model="transformKnowledge.searchForm.theme"></el-input>
						</el-form-item>
						<el-form-item label="类型：" prop="workOrderType">
							<el-select v-model="transformKnowledge.searchForm.workOrderType" @focus="selectOnFocus">
								<el-option v-for="item in workOrderType" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-ignore" @click="ignore">忽略</el-button>
					</div>

					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchCondition">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="transformKnowledge.tableData" @selection-change="handleSelectionChange" stripe style="width: 100%">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column label="工单编号" prop="code" show-overflow-tooltip>
							<template slot-scope="scope">
								<a href="javascript:;" @click="openOrderDetail(scope.row)">{{scope.row.code}}</a>
							</template>
						</el-table-column>
						<el-table-column label="工单主题" prop="theme" show-overflow-tooltip></el-table-column>
						<el-table-column label="类型" prop="type" show-overflow-tooltip>
							<template slot-scope="scope">
                                <span v-if="scope.row.type == 1">事件</span>
                                <span v-if="scope.row.type == 2">问题</span>
                                <span v-if="scope.row.type == 3">变更</span>
                                <span v-if="scope.row.type == 4">发布</span>
                                <span v-if="scope.row.type == 5">备件</span>
                            </template>
						</el-table-column>
						<el-table-column label="SLA状态" prop="slaStatus" show-overflow-tooltip></el-table-column>
						<el-table-column label="关闭时间" prop="closeTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-toKnowledge" @click="toKnowledge(scope.row.id)" title="转知识"></i>&nbsp;
								<i class="el-icon-my-ignore" @click="ignoreOrder(scope.row.id)" title="忽略"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="transformKnowledge.pagination.currentPage" :page-size="transformKnowledge.pagination.pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="transformKnowledge.pagination.total"></el-pagination>
				</div>
			</div>
		</div>
		<!--选择人员弹窗(搜索时候单选的)-->
		<ies-personRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-personRadioDialog>			
	</div>
</template>

<script>
    export default {
    	name:'transformKnowledge',
    	components:{ 

		},        
        props:{
    		
    	},
    	data() {
            return {
            	transformKnowledge:{
            		searchForm:{
            			creator:'',
            			createUserId:'',
	            		handler:'',
	            		handlerId:'',
	            		theme:'',
	            		workOrderType:''
            		},
            		searchConditions:{
            			creator:'',
            			createUserId:'',
	            		handler:'',
	            		handlerId:'',
	            		theme:'',
	            		workOrderType:''
            		},
            		pagination: {
	                    total: 0,
	                    pageSize: 10,
	                    currentPage: 1
	                },
	                tableData:[],
	                selected:[]
            	},            	
            	workOrderType:[
            		{value:'',label:'全部'},
                    {value:'1',label:'事件'},
                    {value:'2',label:'问题'},
                    {value:'3',label:'变更'},
                    {value:'4',label:'发布'},
                    {value:'5',label:'备件'},
            	],
            	// 选择人员弹窗（单选）
				selectPersonRadioDialog:{
					show:false,
					data:{
						type:'search',
						id:''
					},
					type:''  // 点击是是选择创建人还是处理人 0 ： 创建人  1：处理人
				},
				// 创建工单转知识弹窗
				orderToKnowledge:{
					show:false,
				}
            }
        },
        activated () {
	        this.$nextTick(this.init);
	    },
		mounted() {
        	this.$nextTick(function () {
				this.init();
        	});
    	},
        methods: {
        	// 初始化
        	init(){
        		this.getTableData();
        	},        	
            // 获取表格数据
            getTableData(){
            	var params = {
					createUserId:this.transformKnowledge.searchConditions.createUserId,
					handlerId:this.transformKnowledge.searchConditions.handlerId,
					theme:this.transformKnowledge.searchConditions.theme,
					workOrderType:this.transformKnowledge.searchConditions.workOrderType,
					pageNum:this.transformKnowledge.pagination.currentPage,
					pageSize :this.transformKnowledge.pagination.pageSize
				}
				this.$axios.post('/work/order/knowledge/query',params).then((res) => {
                    if(res.status == 200 && res.data.list){
                        this.transformKnowledge.tableData = res.data.list;
                        this.transformKnowledge.pagination.total = res.data.total;
                    }else{
                    	this.transformKnowledge.tableData = [];
                    	this.transformKnowledge.pagination.total = 0;
//                      this.$message(res.message);
                    }
                });		
            },
            // sizeChange事件
			handleSizeChange(size) {
				this.transformKnowledge.pagination.pageSize = size;
                this.getTableData();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.transformKnowledge.pagination.currentPage = currentPage;
                this.getTableData();
			},
			// 选择表格数据
			handleSelectionChange(v) {
				this.transformKnowledge.selected = v.map(v => v.id);
			},
			// 点击忽略忽略按钮
            ignore(){
            	const self = this;
				if (self.transformKnowledge.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定忽略选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/work/order/knowledge/ignore',{idList:self.transformKnowledge.selected.toString()}).then((res) => {
	                    if (res.status==200) {
	                       self.$message({type: 'success',message:'忽略成功'});
	                       self.getTableData();
	                    } else {
	                       self.$message({type: 'error',message:'忽略失败'}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消忽略'});
				});
            },
			// 点击查询
			search() {
				this.transformKnowledge.searchConditions.createUserId = this.transformKnowledge.searchForm.createUserId;
				this.transformKnowledge.searchConditions.handlerId = this.transformKnowledge.searchForm.handlerId;
				this.transformKnowledge.searchConditions.theme = this.transformKnowledge.searchForm.theme;
				this.transformKnowledge.searchConditions.workOrderType = this.transformKnowledge.searchForm.workOrderType;
				this.transformKnowledge.pagination.currentPage = 1;
				this.getTableData();
			},
			// 重置
			resetSearchCondition() {
				this.transformKnowledge.searchConditions = this.transformKnowledge.searchForm = this.$options.data.call(this).transformKnowledge.searchForm;
				console.log(this.transformKnowledge);
			},
			// 点击表格中忽略图标
			ignoreOrder(id){
				const self = this;
				self.$confirm('是否确定忽略此工单?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/work/order/knowledge/ignore',{idList:id}).then((res) => {
	                    if (res.status==200) {
	                       self.$message({type: 'success',message:'忽略成功'});
	                       self.getTableData();
	                    } else {
	                       self.$message({type: 'error',message:'忽略失败'}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消忽略'});
				});
			},
			// 工单转知识
			toKnowledge(id,assetCode){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/orderToKnowledge?id=${id}`);
			},
			// 打开工单详情
			openOrderDetail(row){
				const self = this;
                const workOrderType = (row.type == 1 && 'event') || (row.type == 2 && 'question') || (row.type == 3 && 'change') || (row.type == 4 && 'publish') || (row.type == 5 && 'spare');
                self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/workOrder/orderDatail/${workOrderType}?orderId=${row.id}&instanceId=${row.processInstanceId}`);
			},
			// 选择创建人弹窗
			selectCreatorOpen() {
				this.selectPersonRadioDialog.show = true;
				this.selectPersonRadioDialog.type = 0;
				this.selectPersonRadioDialog.data = {
				 	type:'search',
				 	id:this.transformKnowledge.searchForm.createUserId
				}
			},
			// 关闭选择人员弹窗回调
			selectPersonRadioHandler(data) {
				if (data) {
					var data = JSON.parse(data);
					if(this.selectPersonRadioDialog.type == 0){
						this.transformKnowledge.searchForm.creator = data.userName;
	                	this.transformKnowledge.searchForm.createUserId = data.id;
					} else {
						this.transformKnowledge.searchForm.handler = data.userName;
	                	this.transformKnowledge.searchForm.handlerId = data.id;
					}
				}
			},
			// 打开选择处理人弹窗
			selectHandlerOpen(){
				this.selectPersonRadioDialog.show = true;
				this.selectPersonRadioDialog.type = 1;
				this.selectPersonRadioDialog.data = {
				 	type:'search',
				 	id:this.transformKnowledge.searchForm.handlerId
				}
			},			
            // 解决ie9不能修改的内容都能获取焦点
			selectOnFocus(e) {
		        e.target.blur();
		    },
            
        },
        filters:{
        	
        },
        computed:{
        	
        },
        watch:{
        	
        }
    }

</script>

<style lang="less">
	.transformKnowledge{
		.search-conditions{
			padding-top:25px;
		}
		.el-table a{
			color:#57a9fd;
		}
	}
</style>