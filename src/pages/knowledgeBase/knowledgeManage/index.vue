<!--知识管理-->
<template>
	<div class="itsm-tabs-main knowledgeManage">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 105px;">
					<el-form :inline="true" :model="knowledgeManage.searchForm" ref="searchForm" class="search-conditions" label-width="110px">
						<el-form-item label="标题：" prop="title">
							<el-input placeholder="请输入标题" v-model="knowledgeManage.searchForm.title"></el-input>
						</el-form-item>
						<el-form-item label="关键字：" prop="keyword">
							<el-input placeholder="请输入关键字" v-model="knowledgeManage.searchForm.keyword"></el-input>
						</el-form-item>
						<el-form-item label="知识来源：" prop="source">
							<el-select v-model="knowledgeManage.searchForm.knowledgeSource" @focus="selectOnFocus" placeholder="请选择知识来源">
								<el-option v-for="item in knowledgeManage.knowledgeSource" :key="item.value"  :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="知识状态：" prop="state">
							<el-select v-model="knowledgeManage.searchForm.status" @focus="selectOnFocus">
								<el-option v-for="item in knowledgeManage.status" :key="item.value"  :value="item.value" :label="item.label"></el-option>
							</el-select>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteKnowledge">删除</el-button>
						<el-button type="normal" icon="el-icon-my-import" @click="openUploadDialog">知识导入</el-button>
						<el-button type="normal" icon="el-icon-my-download" @click="downTemplate" style="width:135px;">下载导入模板</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="resetSearchCondition">重置</el-button>
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="addKnowledge">新增</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="knowledgeManage.tableData" @selection-change="handleSelectionChange" stripe style="width: 100%">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
						<el-table-column label="知识来源" prop="knowledgeSource" show-overflow-tooltip></el-table-column>
						<el-table-column label="关键字" prop="keyword" show-overflow-tooltip></el-table-column>
						<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
						<el-table-column label="作者" prop="authorName" show-overflow-tooltip></el-table-column>
						<el-table-column label="知识状态" prop="status" show-overflow-tooltip>
							<template slot-scope="scope">
								<span>{{ scope.row.status == 1 ? '未提交审核' : scope.row.status == 2 ? '审核通过' : '审核未通过' }}</span>							
							</template>
						</el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="editKnowledge(scope.row.id)" title="编辑"></i>&nbsp;								
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="knowledgeManage.pagination.currentPage" :page-size="knowledgeManage.pagination.pageSize" :page-sizes="[10, 20, 30, 40]" layout="total, sizes, prev, pager, next, jumper" :total="knowledgeManage.pagination.total"></el-pagination>
				</div>
			</div>
		</div>
		<!-- 导入弹窗 -->
		<el-dialog title="导入" :visible="uploadDialog.show" width="414px" custom-class="upload" :close-on-click-modal="false" @close="closeDialog" v-drag>
			<div class="upload-content">
				<div class="upload-container">
					<div class="input-box">
						<span>上传文件：</span>
						<el-input style="display: inline-block;" name="file" v-model="configUpload.fileName" placeholder="请选择上传的文件" readonly></el-input>
					</div>
					<el-upload ref="upload" :headers='{Token: token}' action="/api/itsm/knowledgeBase/knowledgeManager/importKnowledge" :on-change="handleChange" :on-success="onSuccess" :on-error="onError" :before-upload="beforeupload" :show-file-list="false" :auto-upload="false" :multiple="false" class="upload-btn">
						<el-button slot="trigger" type="normal" @click="closeMessage">选取文件</el-button>
					</el-upload>
				</div>
			</div>
			<div slot="footer">
				<el-button type="normal" @click="submitUpload">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
    export default {
    	name:'knowledgeManage',
    	components:{ 
		
		},        
        props:{
    		
    	},
    	data() {
            return {
            	knowledgeManage:{
            		searchForm:{
            			title:'',
            			keyword:'',
            			knowledgeSource:'',
            			status:'',
            		},
            		searchConditions:{
            			title:'',
            			keyword:'',
            			knowledgeSource:'',
            			status:'',
            		},
            		pagination: {
	                    total: 0,
	                    pageSize: 10,
	                    currentPage: 1
	                },
		            knowledgeSource:[
	            		{value:'',label:'全部'},
	            		{value:'手动输入',label:'手动输入'},
	            		{value:'导入',label:'导入'},
	            		{value:'工单转知识',label:'工单转知识'}        		
	            	],
	            	status:[
	            		{ value: '', label: '全部' }, 
						{ value: '2', label: '审核通过' }, 
						{ value: '3', label: '审核未通过' },
						{ value: '1', label: '未提交审核' }
	            	],	
	                tableData:[],
	                selected:[],
            	},            	 	
            	// 导入弹窗
				uploadDialog: {
					show: false,
					loading: null,
					fileList: [],
					loding: null
				},
				// 导入
				configUpload: {
					fileName: ''
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
        	// 关闭提示信息弹窗
        	closeMessage(){
        		if(this.message){
        			this.message.close();
        		}
        	},
            // 获取表格数据
            getTableData(){
            	var params = {
					title:this.knowledgeManage.searchConditions.title,
					keyword:this.knowledgeManage.searchConditions.keyword,
					knowledgeSource:this.knowledgeManage.searchConditions.knowledgeSource,
					status:this.knowledgeManage.searchConditions.status,
					pageNum:this.knowledgeManage.pagination.currentPage,
					pageSize :this.knowledgeManage.pagination.pageSize
				}
				this.$axios.post('/itsm/knowledgeBase/knowledgeManager/queryAll',params).then((res) => {
                    if(res.status==200){
                        this.knowledgeManage.tableData = res.data.list;
                        this.knowledgeManage.pagination.total = res.data.total;
                    }else{
                        this.$message.error(res.message);
                    }
                });		
            },
            // sizeChange事件
			handleSizeChange(size) {
				this.knowledgeManage.pagination.pageSize = size;
                this.getTableData();
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				this.knowledgeManage.pagination.currentPage = currentPage;
                this.getTableData();
			},
			// 选择表格数据
			handleSelectionChange(v) {
				this.knowledgeManage.selected = v.map(v => v.id);
			},
			// 点击查询
			search() {
				this.knowledgeManage.searchConditions.title = this.knowledgeManage.searchForm.title;
				this.knowledgeManage.searchConditions.keyword = this.knowledgeManage.searchForm.keyword;
				this.knowledgeManage.searchConditions.knowledgeSource = this.knowledgeManage.searchForm.knowledgeSource;
				this.knowledgeManage.searchConditions.status = this.knowledgeManage.searchForm.status;
				this.knowledgeManage.pagination.currentPage = 1;
				this.getTableData();
			},
			// 重置
			resetSearchCondition() {
				this.knowledgeManage.searchConditions = this.knowledgeManage.searchForm = this.$options.data.call(this).knowledgeManage.searchForm;
			},
			// 新增
			addKnowledge(){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeManage/knowledgeAdd');
			},
			// 删除
			deleteKnowledge(){
				const self = this;
				if (self.knowledgeManage.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/itsm/knowledgeBase/knowledgeManager/deleteAudit',{ids:self.knowledgeManage.selected.toString()}).then((res) => {
	                    if (res.status == 200) {
	                       self.$message({type: 'success',message:res.message});
	                       self.getTableData();
	                    } else {
	                       self.$message({type: 'error',message:res.message}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
				});
			},
			// 编辑知识
			editKnowledge(id){
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeManage/knowledgeEdit?id='+ id);
			},
			// 下载导入模板
			downTemplate() {
				window.open('/api/itsm/knowledgeBase/fileManager/downlodeTemplate?Token='+this.token);
			},
			// 导入弹窗
			openUploadDialog() {
				this.configUpload.fileName = '';
				this.uploadDialog.show = true;
			},
			// 手动上传文件
			submitUpload() {
				if(!this.configUpload.fileName) {				
					this.$message.error('请选择上传的文件');
					return;
				}
				this.$refs.upload.submit();
			},
			// 
	        onError(res, file, fileList) {
	        	this.$message.error(res.message);
	        },
	        onSuccess(res, file, fileList) {
	        	const self = this;
	        	this.$nextTick(() => {
					this.uploadDialog.loading.close();
				});
				if(res.status == 200){					
					this.$message.success("成功导入" + res.data.count + '条数据');
					this.configUpload.fileName = '';
					this.uploadDialog.show = false;
					this.knowledgeManage.pagination.currentPage = 1;
					this.getTableData();
				}else if(res.status == 400){
					var message = '';
					var narr = [];
		            for(var i in res.data){
		            	if(i != 'result'){
		            		var n = i.slice(6);narr.push(n);
		            	}
		            }	
//		            var newarr = narr.sort((a,b) => a-b);
//		            console.log(newarr);
		            narr.forEach(item =>{
		            	for(var i in res.data){
			            	if(i != 'result' && i == 'result'+item){
			            		 message += '<br/>第'+ i.slice(6) +'行导入数据不规范:';
			            		 for(var j in res.data[i]){
			            		 	message += res.data[i][j]+';';
			            		 }
			            	}
			            }	
		            })
					this.message = this.$message({
					 	type:'error',
			          	showClose: true,
			          	message: message,
			          	duration:0,
			          	dangerouslyUseHTMLString:true,
			          	customClass:'upload-message',
			          	onClose:function(){
			          		self.configUpload.fileName = '';
			          	}
				    });
				}else{
					this.$message.error(res.message);
				}
	        },
			handleChange(file, fileList) {
				this.configUpload.fileName = file.name;
			},
			beforeupload(file) {
				const self = this;
				var index = file.name.lastIndexOf('.'), format = file.name.substring(index+1),flag = true;
				if(['xlsx','xls'].indexOf(format)==-1) {
					self.$message.error('导入文件只能是 xls或者xlsx格式!');
					self.configUpload.fileName = '';
					flag = false;
				}				
		        if(flag) {
		        	if(file.size > 5242880) {
		        		this.$message({ type: 'error', message: '文件大小不能超过5M!' });
		        		return false;
		        	} else {
		        		this.uploadDialog.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						});
		        		return true;
		        	}
		        } else {
		        	return flag;
		        }
			},
			// 关闭弹窗
			closeDialog(){
				this.uploadDialog.show = false;
				if(this.message) {
					this.message.close();
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
        	token() {
				return this.$store.state.user.info ? this.$store.state.user.info.token : ''
			}
        },
        watch:{
        	// 新增后刷新页面
			'$store.state.knowledge.knowledgePageFlag'(curVal, oldVal) {
				if(curVal !== oldVal) {
					this.knowledgeManage.pagination.currentPage = 1;
					this.getTableData();
				}
			}
        }
    }

</script>

<style lang="less">
	.knowledgeManage{
		.search-conditions{
			padding-top:25px;
		}
	}
	
	
</style>