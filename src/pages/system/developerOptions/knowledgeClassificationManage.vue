<!--开发人员选项--知识分类管理-->
<template>
	<div class="itsm-tabs-main knowledge-classification-manage">
		<div class="tabs-left border" style="background: #fff;">
			<ies-scrollbar class="ies-scrollbar">
				<div v-changeTreeH="'changeTreeH'">
					<el-tree ref="knowledgeClassificationTree" :data='knowledgeClassificationTree.data' :props="knowledgeClassificationTree.defaultProps" node-key="id" :expand-on-click-node="false"  :render-content="renderContent" 
						@current-change="getKnowledgeClassificationInfo" highlight-current @node-expand="nodeExpand" @node-collapse="nodeCollapse" :default-expanded-keys="knowledgeClassificationTree.defaultExpanded"></el-tree>
				</div>
			</ies-scrollbar>
		</div>
		<div class="tabs-right">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					当前分类信息
				</div>
				<div class="panel-body knowledgeClassification-info" style="height: 115px; padding: 35px 40px;">
					<el-row>
						<el-tooltip class="item" effect="dark" :content="knowledgeClassification.message.parentName" placement="bottom-start">
							<el-col :span="6">上级分类：{{knowledgeClassification.message.parentName}}</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" :content="knowledgeClassification.message.classificationName" placement="bottom-start">
							<el-col :span="6">名称：{{knowledgeClassification.message.classificationName}}</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" :content="knowledgeClassification.message.classificationDetails" placement="bottom-start">
							<el-col :span="12">详情：{{knowledgeClassification.message.classificationDetails}}
							&nbsp;&nbsp;&nbsp;&nbsp;
							<!--知识分类id:{{knowledgeClassification.message.id}}-->
							</el-col>
						</el-tooltip>		
					</el-row>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteKnowledgeClassification">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddEditKnowledgeClassificationDialog('add')">新增</el-button>
					</div>
				</div>
				<div class="panel-body tableWrap">
					<el-table :data="knowledgeClassification.tableData" stripe  style="width: 100%;" @selection-change="handleSelectionChange">
						<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
						<el-table-column label="名称" prop="classificationName" show-overflow-tooltip></el-table-column>
						<el-table-column label="详情" prop="classificationDetails" show-overflow-tooltip></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openAddEditKnowledgeClassificationDialog('edit',scope.row)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="knowledgeClassification.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="knowledgeClassification.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="knowledgeClassification.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		
		<!--新增知识分类弹窗-->
		<el-dialog :title="addEditKnowledgeClassificationDialog.title" width="414px" :close-on-click-modal='false' :visible.sync="addEditKnowledgeClassificationDialog.show" class="add-edit-knowledgeClassification" @close="closeAddEditKnowledgeClassificationDialog" v-drag>
			<div class="add-edit-knowledgeClassification-content">
				<el-form ref="addEditKnowledgeClassificationForm" :model="addEditKnowledgeClassificationDialog.form" :rules="addEditKnowledgeClassificationDialog.rules" label-width="80px">
					<el-form-item label="名称：" prop="classificationName">
						<el-input v-model="addEditKnowledgeClassificationDialog.form.classificationName" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="详情：" prop="classificationDetails">
						<el-input type="textarea" v-model="addEditKnowledgeClassificationDialog.form.classificationDetails" placeholder="请输入描述"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="normal" @click="saveAddEditKnowledgeClassification">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name:'knowledgeClassificationManage',
		components: {

		},
		props: {

		},
		data() {
			let validator = this.$ies.validator;
			return {
				// 树结构
				knowledgeClassificationTree: {
					data:[],
                    defaultExpanded:[],
                    selectData:null,
                    defaultProps: {
                        label: 'classificationName',
                        isLeaf: function(data, node) {
							return data.isParent == 1 ? false : true;
						},
						children:'childList'
                    },
                    selectNode:'',
                },
                // 表格
				knowledgeClassification: {
					message:{
						id:'',
						parentName: '',
						classificationName: '',
						classificationDetails: '',
					},				
					tableData:[],
					selected:[],
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				},
				// 新建/编辑知识分类弹窗
				addEditKnowledgeClassificationDialog: {
					show: false,
					title: '新增知识分类',
					type:'',
					form: {
						id:'',
						classificationName: '',
						classificationDetails: ''
					},
					rules: {
						classificationName: [{ validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入名称',trigger: 'blur'}],
						classificationDetails:[{ validator:validator.space,trigger: 'blur',options:{max:200}},{required: true,message: '请输入详情',trigger: 'blur'}]
					}
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
			});
		},
		methods: {
			init() {
				this.getKnowledgeClassificationTree();
			},
			// 获取分类树
			getKnowledgeClassificationTree(node,resolve){
				this.$nextTick(function(){
                    this.$axios.post('/itsm/knowledgeBase/classificationManager/queryMenuTree').then((res) => {
                        if(res.status == 200){
                            this.knowledgeClassificationTree.data = res.data;
                            if(!this.knowledgeClassificationTree.selectData){
                                this.getKnowledgeClassificationInfo(res.data[0]);
                            }
                            this.$nextTick(function() {
								this.$refs.knowledgeClassificationTree.setCurrentKey(this.knowledgeClassificationTree.selectData.id);
								this.knowledgeClassificationTree.defaultExpanded.push(this.knowledgeClassificationTree.selectData.id);
							});
                        }else{
                            this.$message(res.message);
                        }
                    });					
                })
			},
			// node-expand 节点被展开时触发的事件
            nodeExpand(data,node,component) {
               this.knowledgeClassificationTree.defaultExpanded.push(data.id);
            },
            // node-collapse 节点被关闭时触发的事件
            nodeCollapse(data,node,component) {
                var index = this.knowledgeClassificationTree.defaultExpanded.indexOf(data.id);
	            this.knowledgeClassificationTree.defaultExpanded.splice(index,1);
            },
			// 点击节点获取基本信息
			getKnowledgeClassificationInfo(data,node,component){
				console.log(node); // node中包括data
				console.log(data);
				// 缓存node
				this.knowledgeClassificationTree.selectNode = node;
				// 缓存选中data
                this.knowledgeClassificationTree.selectData = data;
                
                this.knowledgeClassification.message.id = data.id;
                this.knowledgeClassification.message.parentName = data.parentName;
                this.knowledgeClassification.message.classificationName = data.classificationName;
                this.knowledgeClassification.message.classificationDetails = data.classificationDetails;
                // 表格内容
                var params = {
                    parentId: data.id,
                    pageNum: 1,
                    pageSize: this.knowledgeClassification.pagination.pageSize
                }
                this.getknowledgeClassificationData(params);
			},
			// 获取表格数据
			getknowledgeClassificationData(data){
				this.$axios.post('/itsm/knowledgeBase/classificationManager/queryByParentId', data).then((res) => {
                    if (res.status==200){
                        this.knowledgeClassification.tableData = res.data.list;
                        this.knowledgeClassification.pagination.total = res.data.total;
                    } else {
                        this.$message(res.message);
                    }
                });
			},
			// sizeChange事件
			handleSizeChange(size) {
				var params = {
                    parentId: this.knowledgeClassification.message.id,
                    pageNum: 1,
                    pageSize: size
                }
                this.getknowledgeClassificationData(params)
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				var params = {
                    parentId: this.knowledgeClassification.message.id,
                    pageNum: currentPage,
                    pageSize: this.knowledgeClassification.pagination.pageSize
                }
                this.getknowledgeClassificationData(params)
			},
			/********************新增、编辑知识分类************************/
			// 打开新增/编辑知识分类弹窗
			openAddEditKnowledgeClassificationDialog(type,row) {
				if (this.knowledgeClassificationTree.selectNode && this.knowledgeClassificationTree.selectNode.level >= 5) {
                    this.$message.warning("树结构最多存在五级");
                    return false;
                }
				this.addEditKnowledgeClassificationDialog.type = type;
				this.addEditKnowledgeClassificationDialog.title = type == 'add' ? '新增知识分类' : '编辑知识分类'
				this.addEditKnowledgeClassificationDialog.show = true;
				if(type == 'edit'){
					this.addEditKnowledgeClassificationDialog.form.id = row.id;
					this.addEditKnowledgeClassificationDialog.form.classificationName = row.classificationName;
					this.addEditKnowledgeClassificationDialog.form.classificationDetails = row.classificationDetails;
				}
			},
			// 点击新增/编辑弹窗的保存按钮
			saveAddEditKnowledgeClassification(){				
				this.$refs['addEditKnowledgeClassificationForm'].validate((valid) => {
					if(valid){
						//新增
						this.addEditKnowledgeClassificationDialog.type == 'add' ? this.addKnowledgeClassification() : this.editKnowledgeClassification();												
					}
				})
			},
			// 新增知识分类
			addKnowledgeClassification(){
				var params = {
					parentId:this.knowledgeClassification.message.id,
					classificationName:this.addEditKnowledgeClassificationDialog.form.classificationName,
					classificationDetails:this.addEditKnowledgeClassificationDialog.form.classificationDetails
				}
		
				this.$axios.post('/itsm/knowledgeBase/classificationManager/save', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditKnowledgeClassificationDialog.show = false;
                       //刷新树和表格数据
                       this.refreshData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
            	});
			},
			// 编辑知识分类
			editKnowledgeClassification(){
				var params = {
					id:this.addEditKnowledgeClassificationDialog.form.id,
					classificationName:this.addEditKnowledgeClassificationDialog.form.classificationName,
					classificationDetails:this.addEditKnowledgeClassificationDialog.form.classificationDetails
				}
				this.$axios.post('/itsm/knowledgeBase/classificationManager/update', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditKnowledgeClassificationDialog.show = false;
                       //刷新树和表格数据
                       this.refreshData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    } 
            	});
			},
			// 关闭新增、编辑弹窗
			closeAddEditKnowledgeClassificationDialog(){				
				this.reset('addEditKnowledgeClassificationForm');
				this.addEditKnowledgeClassificationDialog.form.id = '';
				this.addEditKnowledgeClassificationDialog.form.classificationName = '';
				this.addEditKnowledgeClassificationDialog.form.classificationDetails = '';
			},
			// 重置表单
			reset(ref) {
				this.$refs[ref].resetFields();
			},
			/********************************************/
			// 刷新树和表格数据
			refreshData(){
				this.getKnowledgeClassificationTree();
				this.knowledgeClassification.pagination.currentPage = 1;
                //重新请求表格数据
                var params = {
                    parentId: this.knowledgeClassification.message.id,
                    pageNum: this.knowledgeClassification.pagination.currentPage,
                    pageSize: this.knowledgeClassification.pagination.pageSize
                }
                this.getknowledgeClassificationData(params);
			},			
			// 点击删除
			deleteKnowledgeClassification() {
				const self = this;
				if(self.knowledgeClassification.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.post('/itsm/knowledgeBase/classificationManager/delete',{ids:self.knowledgeClassification.selected.toString(),parentId:this.knowledgeClassification.message.id}).then((res) => {
	                    if(res.status==200){
	                       self.$message({type: 'success',message:res.message});
	                       self.refreshData();
	                    }else{
	                       self.$message({type: 'error',message:res.message}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消删除'});
				});
			},	
			// 渲染树结构数据
			renderContent(h, { node, data, store }) {
				console.log(node);
				if(node.label.length >= 6){
	                return h('span',
	                	[
		                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: node.childNodes.length > 0 ? 'el-icon-my-file' : 'el-icon-my-text'}),
		                    h('el-tooltip',{ attrs: {content: node.label, placement: "bottom-start", 'popper-class':'my-tooltip'} },
		                    [
		                    	h('span', node.label)
		                    ])
	                    ]
	                );
            	}else{
	                return h('span',
	                [
	                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: node.childNodes.length > 0 ? 'el-icon-my-file' : 'el-icon-my-text'}),
	                    h('span', node.label)
	                ]);
            	}
			},							
			// table中的多选
			handleSelectionChange(v) {
				this.knowledgeClassification.selected = v.map(v => v.id);
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

<style lang="less">
	
</style>