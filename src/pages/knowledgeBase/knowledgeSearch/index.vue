<!--知识检索-->
<template>
	<div class="itsm-tabs-main knowledge-search">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form :inline="true" :model="knowledgeSearch.searchForm" ref="searchForm" class="search-conditions" label-width="110px">
						<el-form-item label="知识检索：" prop="knowledgeSearch">
							<el-input placeholder="请输入标题、摘要、关键字、附件名" v-model="knowledgeSearch.searchForm.knowledgeSearch" style="width:400px;"></el-input>
						</el-form-item>
						<el-form-item label="知识分类：" prop="knowledgeClassification">
							<el-input placeholder="请选择知识分类" v-model="knowledgeSearch.searchForm.knowledgeClassification" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectKnowledgeClassification"></i>
						</el-form-item>
						<el-form-item label="知识来源：" prop="source">
							<el-select v-model="knowledgeSearch.searchForm.knowledgeSource" @focus="selectOnFocus" placeholder="请选择知识来源">
								<el-option v-for="item in knowledgeSearch.knowledgeSource" :key="item.value"  :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="作者：" prop="authorName">
							<el-input placeholder="请选择作者" v-model="knowledgeSearch.searchForm.authorName" readonly @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="selectAuthorOpen"></i>
						</el-form-item>
						<el-form-item label="创建时间 ：" class="time"  prop="createTime">					
							<el-date-picker  v-model="knowledgeSearch.searchForm.createTime"  type="datetimerange"  range-separator="至"  start-placeholder="开始日期"  end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
						</el-form-item>	
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchCondition">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="knowledgeSearch.tableData"  ref="sortTable" stripe style="width: 100%"  @sort-change="sortChange">
						<el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
						<el-table-column label="知识来源" prop="knowledgeSource" show-overflow-tooltip></el-table-column>
						<el-table-column label="关键字" prop="keyword" show-overflow-tooltip></el-table-column>
						<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip sortable="custom"></el-table-column>
						<el-table-column label="作者" prop="authorName" show-overflow-tooltip></el-table-column>
						<el-table-column label="浏览次数" prop="views" show-overflow-tooltip sortable="custom"></el-table-column>
						<el-table-column label="评分" prop="score" show-overflow-tooltip sortable="custom"></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-view" title="查看" @click="openKnowledgeDetail(scope.row.id)"></i> 
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="knowledgeSearch.pagination.currentPage" :page-size="knowledgeSearch.pagination.pageSize"  layout="total, sizes, prev, pager, next, jumper" :total="knowledgeSearch.pagination.total"></el-pagination>
				</div>
			</div>
		</div>
		<!--选择人员弹窗(搜索时候单选的)-->
		<ies-personRadioDialog v-model="selectPersonRadioDialog.show" v-if="selectPersonRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect='selectPersonRadioDialog.data'></ies-personRadioDialog>			
		<!-- 选择知识分类弹窗 -->
		<ies-knowledgeClassificationDialog v-model="selectKnowledgeClassificationDialog.show" v-if="selectKnowledgeClassificationDialog.show" @knowledgeChooseHandler="knowledgeClassificationChooseHandler" :defaultSelect='selectKnowledgeClassificationDialog.defaultSelectId'></ies-knowledgeClassificationDialog>	 
	</div>
</template>

<script>
    export default {
    	name:'knowledgeSearch',
    	components:{ 
		
		},        
        props:{
    		
    	},
    	data() {
            return {
            	knowledgeSearch:{
            		searchForm:{
            			knowledgeSearch:'', // 知识检索
            			knowledgeClassification:'',// 知识分类名称
            			classificationId:'', // 知识分类id
            			knowledgeSource :'',
            			authorName:'',// 作者名称
            			authorId:'',// 作者id
            			createTime:[]
            		},
            		searchConditions:{
            			knowledgeSearch:'',
            			classificationId:'',// 知识分类id
            			knowledgeSource:'',
            			authorId:'',
            			startTime:'',
            			endTime:'',
            			sort:''
            		},
            		pagination: {
	                    total: 0,
	                    pageSize: 10,
	                    currentPage: 1
	                },
	                tableData:[],
	                knowledgeSource:[
	            		{value:'',label:'全部'},
	            		{value:'手动输入',label:'手动输入'},
	            		{value:'导入',label:'导入'},
	            		{value:'工单转知识',label:'工单转知识'}        		
	            	],
            	},            	
            	// 选择人员弹窗（单选）
				selectPersonRadioDialog:{
					show:false,
					data:{
						type:'search',
						id:''
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
					knowledgeSearch:this.knowledgeSearch.searchConditions.knowledgeSearch,
					classificationId:this.knowledgeSearch.searchConditions.classificationId,
					knowledgeSource:this.knowledgeSearch.searchConditions.knowledgeSource,
					authorId:this.knowledgeSearch.searchConditions.authorId,
					startTime:this.knowledgeSearch.searchConditions.startTime,
					endTime:this.knowledgeSearch.searchConditions.endTime,
					pageNum:this.knowledgeSearch.pagination.currentPage,
					pageSize :this.knowledgeSearch.pagination.pageSize,
					sort:this.knowledgeSearch.searchConditions.sort
				}
//          	console.log(params);
				this.$axios.post('/itsm/knowledgeBase/search/querySortAll',params).then((res) => {
                    if(res.status==200){
                        this.knowledgeSearch.tableData = res.data.list;
                        this.knowledgeSearch.pagination.total = res.data.total;
                    }else{
                        this.$message(res.message);
                    }
                });		
            },
            // 排序
            sortChange({ column, prop, order }){
		    	console.log(prop,order); // ascending升序  descending降序
				if(prop == 'createTime' && order == 'descending'){ // 创建时间降序
					this.knowledgeSearch.searchConditions.sort = 1; 
				}else if(prop == 'createTime' && order == 'ascending'){// 创建时间升序
					this.knowledgeSearch.searchConditions.sort = 2; 
				}else if(prop == 'views' && order == 'descending'){// 访问量降序
					this.knowledgeSearch.searchConditions.sort = 3; 
				}else if(prop == 'views' && order == 'ascending'){// 访问量升序
					this.knowledgeSearch.searchConditions.sort = 4; 
				}else if(prop == 'score' && order == 'descending'){// 评分降序
					this.knowledgeSearch.searchConditions.sort = 5; 
				}else if(prop == 'score' && order == 'ascending'){// 评分升序
					this.knowledgeSearch.searchConditions.sort = 6; 
				}else{
					this.knowledgeSearch.searchConditions.sort = '';
				}
				this.getTableData();
		    },
            // sizeChange事件
			handleSizeChange(size) {
				this.knowledgeSearch.pagination.pageSize = size;
                this.getTableData();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.knowledgeSearch.pagination.currentPage = currentPage;
                this.getTableData();
			},		
			// 点击查询
			search() {
				this.knowledgeSearch.searchConditions.knowledgeSearch = this.knowledgeSearch.searchForm.knowledgeSearch;
				this.knowledgeSearch.searchConditions.classificationId = this.knowledgeSearch.searchForm.classificationId;
				this.knowledgeSearch.searchConditions.knowledgeSource = this.knowledgeSearch.searchForm.knowledgeSource;
				this.knowledgeSearch.searchConditions.authorId = this.knowledgeSearch.searchForm.authorId;
				this.knowledgeSearch.searchConditions.startTime = this.knowledgeSearch.searchForm.createTime && this.knowledgeSearch.searchForm.createTime.length > 0 ? this.knowledgeSearch.searchForm.createTime[0] : '';
				this.knowledgeSearch.searchConditions.endTime = this.knowledgeSearch.searchForm.createTime && this.knowledgeSearch.searchForm.createTime.length > 0 ? this.knowledgeSearch.searchForm.createTime[1] : '';
				this.knowledgeSearch.pagination.currentPage = 1;
				this.$refs.sortTable.clearSort();
				this.knowledgeSearch.searchConditions.sort = '';
				this.getTableData();
			},
			// 重置
			resetSearchCondition() {
				this.knowledgeSearch.searchForm = this.$options.data.call(this).knowledgeSearch.searchForm;
				this.knowledgeSearch.searchConditions = this.$options.data.call(this).knowledgeSearch.searchConditions;
				this.selectKnowledgeClassificationDialog.defaultSelectId = '';
				this.selectPersonRadioDialog.data.id = '';
				this.$refs.sortTable.clearSort();
				this.knowledgeSearch.searchConditions.sort = '';
			},
			// 选择知识分类
        	selectKnowledgeClassification(){
        		this.selectKnowledgeClassificationDialog.show = true;
        	},
        	// 知识分类弹窗关闭回调
        	knowledgeClassificationChooseHandler(data){
//      		console.log(data);
        		this.knowledgeSearch.searchForm.knowledgeClassification = data.classificationName;
        		this.knowledgeSearch.searchForm.classificationId = data.id;
        		this.selectKnowledgeClassificationDialog.defaultSelectId = data.id;
        	},
			// 选择创建人弹窗
			selectAuthorOpen() {
				this.selectPersonRadioDialog.show = true;			
			},
			// 关闭选择人员弹窗回调
			selectPersonRadioHandler(data) {
				if (data) {
					var data = JSON.parse(data);
					this.knowledgeSearch.searchForm.authorName = data.userName;
					this.knowledgeSearch.searchForm.authorId = data.id;
                	this.selectPersonRadioDialog.data.id = data.id;
				}
			},
			// 打开知识详情页面
			openKnowledgeDetail(id){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeSearch/knowledgeDetail?id='+ id);
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
	.knowledge-search{
		.search-conditions{
			padding-top:25px;
			.el-form-item__content{
				height:27px;
			}
		}
	}
</style>