<!--知识审核-->
<template>
	<div class="itsm-tabs-main knowledge-audit">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form :inline="true" :model="knowledgeAudit.searchForm" ref="searchForm" class="search-conditions" label-width="110px">
						<el-form-item label="标题：" prop="title">
							<el-input placeholder="请输入标题" v-model="knowledgeAudit.searchForm.title"></el-input>							
						</el-form-item>
						<el-form-item label="知识分类：" prop="classification">
							<el-input placeholder="请选择知识分类" v-model="knowledgeAudit.searchForm.classification" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectKnowledgeClassification"></i>
						</el-form-item>
						<el-form-item label="审核来源：" prop="operation">
							<el-select v-model="knowledgeAudit.searchForm.operation" @focus="selectOnFocus">
								<el-option v-for="item in knowledgeAudit.operation" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-batch" @click="batch">批量审核</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchCondition">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="knowledgeAudit.tableData" @selection-change="handleSelectionChange" stripe style="width: 100%">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
						<el-table-column label="审核来源" prop="operation" show-overflow-tooltip></el-table-column>
						<el-table-column label="关键字" prop="keyword" show-overflow-tooltip></el-table-column>
						<el-table-column label="申请时间" prop="applyTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="申请人" prop="applyUser" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="editKnowledge(scope.row.id)"></i>&nbsp;
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="knowledgeAudit.pagination.currentPage" :page-size="knowledgeAudit.pagination.pageSize"  layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 40]" :total="knowledgeAudit.pagination.total"></el-pagination>
				</div>
			</div>
		</div>
		<!-- 批量审核弹窗 -->
		<el-dialog title="批量审核" :visible.sync="auditDialog.show" width="450px" :close-on-click-modal='false' v-drag>
			<div class="audit-remark">
				<el-form label-width="90px" :model="auditDialog.remarkForm" :rules="auditDialog.remarkRules" ref="remarkForm">
					<el-form-item label="审核：" prop="status">
						<el-select v-model="auditDialog.remarkForm.status" @focus="selectOnFocus">
							<el-option label="审核通过" value="2"></el-option>
							<el-option label="审核不通过" value="3"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="备注：" prop="auditOpinion" style="width: 400px;">
						<el-input type="textarea" v-model="auditDialog.remarkForm.auditOpinion" placeholder="请输入备注" resize="none"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer">
				<el-button type="normal" @click="audit">保存</el-button>
			</div>
		</el-dialog>
		<!-- 选择知识分类弹窗 -->
		<ies-knowledgeClassificationDialog v-model="selectKnowledgeClassificationDialog.show" v-if="selectKnowledgeClassificationDialog.show" @knowledgeChooseHandler="knowledgeClassificationChooseHandler" :defaultSelect='selectKnowledgeClassificationDialog.defaultSelectId'></ies-knowledgeClassificationDialog>	 
	</div>
</template>

<script>
    export default {
    	name: 'knowledgeAudit',
    	components:{ 
		
		},        
        props:{
    		
    	},
    	data() {
    		let validator = this.$ies.validator;
            return {           	
            	knowledgeAudit:{
            		searchForm:{
            			title:'',
            			classification:'',
            			classificationId:'',
            			operation:'',
            		},
            		searchConditions:{
            			title:'',
            			classification:'',
            			classificationId:'',
            			operation:'',
            		},
            		pagination: {
	                    total: 0,
	                    pageSize: 10,
	                    currentPage: 1
	                },
	                tableData:[],
	                selected:[],
	                operation:[
	            		{label:'全部',value:''},
	            		{label:'新增',value:'新增'},
	            		{label:'编辑',value:'编辑'},
	            		{label:'删除',value:'删除'}
	            	],
            	}, 
            	// 批量审核弹窗
				auditDialog: {
					show: false,
					remarkForm: {
						status: "2", 	// 审核
						auditOpinion: "" // 备注
					},
					remarkRules: {
						auditOpinion: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
				},
				// 选择知识分类弹窗
				selectKnowledgeClassificationDialog:{
					show:false,
					data:{}
				},
            }
        },
        activated() {
        	this.$nextTick(function () {
				this.init();
        	});
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
					title:this.knowledgeAudit.searchConditions.title,
					classificationId:this.knowledgeAudit.searchConditions.classificationId,
					operation:this.knowledgeAudit.searchConditions.operation,
					pageNum:this.knowledgeAudit.pagination.currentPage,
					pageSize:this.knowledgeAudit.pagination.pageSize
				}
				this.$axios.post('/itsm/knowledgeBase/audit/queryAll',params).then((res) => {
                    if(res.status==200){
                        this.knowledgeAudit.tableData = res.data.list;
                        this.knowledgeAudit.pagination.total = res.data.total;
                    }else{
                        this.$message(res.message);
                    }
                });		
            },
            // sizeChange事件
			handleSizeChange(size) {
				this.knowledgeAudit.pagination.pageSize = size;
                this.getTableData();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.knowledgeAudit.pagination.currentPage = currentPage;
                this.getTableData();
			},
			// 选择表格数据
			handleSelectionChange(v) {
				this.knowledgeAudit.selected = v.map(v => v.id);
			},
			// 点击批量审核按钮
            batch(){
				if (this.knowledgeAudit.selected.length == 0) {
					this.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				this.auditDialog.remarkForm.status = "2";
				this.auditDialog.remarkForm.auditOpinion = "";
				this.auditDialog.show = true;
            },
            // 审核
			audit() {
				this.$refs['remarkForm'].validate((valid) => {
					if(valid) {
						var param = {
							ids: this.knowledgeAudit.selected.toString(),
							status: this.auditDialog.remarkForm.status,
							auditOpinion: this.auditDialog.remarkForm.auditOpinion
						}
						this.$axios.post('/itsm/knowledgeBase/audit/batchAudit',param).then( (res) => {
			        		if(res.status == 200 && res.data) {
								this.$message({ type: 'success', message: '审核成功' });
								this.knowledgeAudit.selected.length = 0;
								this.auditDialog.show = false;
								this.getTableData();
			        		} else {
			        			this.$message({ type: 'error', message: '审核失败' });
			        		}
						});
					}
				});
			},
			// 点击查询
			search() {
				this.knowledgeAudit.searchConditions.title = this.knowledgeAudit.searchForm.title;
				this.knowledgeAudit.searchConditions.classificationId = this.knowledgeAudit.searchForm.classificationId;
				this.knowledgeAudit.searchConditions.operation = this.knowledgeAudit.searchForm.operation;
				this.knowledgeAudit.pagination.currentPage = 1;
				this.getTableData();
			},
			// 重置
			resetSearchCondition() {
				this.knowledgeAudit.searchForm = this.$options.data.call(this).knowledgeAudit.searchForm;
				this.knowledgeAudit.searchConditions = this.$options.data.call(this).knowledgeAudit.searchConditions;
				this.selectKnowledgeClassificationDialog.defaultSelectId = '';
				console.log(this.knowledgeAudit);
			},			
			// 选择知识分类
        	selectKnowledgeClassification(){
        		this.selectKnowledgeClassificationDialog.show = true;
        	},
        	// 知识分类弹窗关闭回调
        	knowledgeClassificationChooseHandler(data){
        		this.knowledgeAudit.searchForm.classification = data.classificationName;
        		this.knowledgeAudit.searchForm.classificationId = data.id;
        		this.selectKnowledgeClassificationDialog.defaultSelectId = data.id;
        	},
        	// 查看知识详情
        	editKnowledge(id){
        		this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeAudit/knowledgeAuditDetail?id='+ id);
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
	.knowledge-audit{
		.search-conditions{
			padding-top:25px;
		}
		.audit-remark {
			padding-top: 50px; height: 250px;
			.el-textarea__inner {
				height: 100px;
			}
		}
	}
</style>