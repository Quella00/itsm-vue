<!--用户管理--组织管理-->
<template>
	<div class="itsm-tabs-main organization">
		<div class="tabs-left border" style="background: #fff;">
			<ies-scrollbar class="ies-scrollbar">
				<div v-changeTreeH="'changeTreeH'">
					<el-tree ref="organizationTree" :data='organizationTree.data' :props="organizationTree.defaultProps" node-key="id" :expand-on-click-node="false"  :render-content="renderContent" 
						@current-change="getOrganizationInfo" highlight-current @node-expand="nodeExpand" @node-collapse="nodeCollapse" :default-expanded-keys="organizationTree.defaultExpanded"></el-tree>
				</div>
			</ies-scrollbar>
		</div>
		<div class="tabs-right">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					当前组织部门信息
				</div>
				<div class="panel-body organization-info" style="height: 153px; padding: 35px 40px;">
					<el-row>
						<el-tooltip class="item" effect="dark" :content="organizationTable.message.number" placement="bottom-start">
							<el-col :span="6">组织编号：{{organizationTable.message.number}}</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" :content="organizationTable.message.name" placement="bottom-start">
							<el-col :span="18">组织名称：{{organizationTable.message.name}}</el-col>
						</el-tooltip>
						<el-tooltip class="item" effect="dark" :content="organizationTable.message.desc" placement="bottom-start">
							<el-col :span="24">描述：{{organizationTable.message.desc}}
							<!--&nbsp;&nbsp;&nbsp;&nbsp;组织id:{{organizationTable.message.id}}-->
							</el-col>
						</el-tooltip>		
					</el-row>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteOrganization">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="openAddEditOrganizationDialog('add')">新增</el-button>
						<el-button type="normal" icon="el-icon-my-disable" @click="updateOrganization(1)">禁用</el-button>
						<el-button type="normal" icon="el-icon-my-able" @click="updateOrganization(0)">启用</el-button>
					</div>
				</div>
				<div class="panel-body tableWrap">
					<el-table :data="organizationTable.tableData" stripe  style="width: 100%;" @selection-change="handleSelectionChange">
						<el-table-column prop="check" label="" type="selection" align="center">
							<el-checkbox></el-checkbox>
						</el-table-column>
						<el-table-column label="组织编号" prop="organizationCode" show-overflow-tooltip></el-table-column>
						<el-table-column label="组织名称" prop="organizationName" show-overflow-tooltip></el-table-column>
						<el-table-column label="描述" prop="description" show-overflow-tooltip></el-table-column>
						<el-table-column label="状态" prop="openFlag" show-overflow-tooltip>
							 <template slot-scope="scope">
                                {{scope.row.openFlag == 1 ? '禁用' : '启用'}}
                            </template>
						</el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" @click="openAddEditOrganizationDialog('edit',scope.row)"></i>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="organizationTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="organizationTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="organizationTable.pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		
		<!--新增组织弹窗-->
		<el-dialog :title="addEditOrganizationDialog.title" width="414px" :close-on-click-modal='false' :visible.sync="addEditOrganizationDialog.show" class="add-edit-organization" @close="closeAddEditOrganizationDialog" v-drag>
			<div class="add-edit-organization-content">
				<el-form ref="addEditOrganizationForm" :model="addEditOrganizationDialog.form" :rules="addEditOrganizationDialog.rules" label-width="80px">
					<el-form-item label="编号：" prop="number">
						<el-input v-model="addEditOrganizationDialog.form.number" placeholder="请输入编号" :disabled="addEditOrganizationDialog.type=='edit'"></el-input>
					</el-form-item>
					<el-form-item label="名称：" prop="name">
						<el-input v-model="addEditOrganizationDialog.form.name" placeholder="请输入名称"></el-input>
					</el-form-item>
					<el-form-item label="描述：" prop="desc">
						<el-input type="textarea" v-model="addEditOrganizationDialog.form.desc" placeholder="请输入描述"></el-input>
					</el-form-item>
				</el-form>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button type="normal" @click="saveAddEditOrganization">保存</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name:'organization',
		components: {

		},
		props: {

		},
		data() {
			let validator = this.$ies.validator;
			return {
				// 树结构
				organizationTree: {
					data:[],
                    defaultExpanded:[],
                    selectData:null,
                    defaultProps: {
                        label: 'organizationName',
                        isLeaf: 'parentFlag'
                    },
                    selectNode:'',
                },
                // 表格
				organizationTable: {
					message:{
						id:'',
						number: '',
						name: '',
						desc: '',
					},				
					tableData:[],
					selected:[],
					pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
				},
				// 新建/编辑组织弹窗
				addEditOrganizationDialog: {
					show: false,
					title: '新增组织',
					type:'',
					form: {
						id:'',
						number: '',
						name: '',
						desc: ''
					},
					rules: {
						number: [{ validator:validator.space,trigger: 'blur',options:{max:6}},{required: true,message: '请输入编号',trigger: 'blur'},{ validator: validator.number, trigger: 'blur' }],
						name: [{ validator:validator.space,trigger: 'blur',options:{max:32}},{required: true,message: '请输入名称',trigger: 'blur'}],
						desc:[{ validator:validator.space,trigger: 'blur',options:{max:200}},{required: true,message: '请输入描述',trigger: 'blur'}]
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
				this.getOrganizationTree();
			},
			// 获取分类树
			getOrganizationTree(node,resolve){
				this.$nextTick(function(){
                    this.$axios.post('/itsm/system/permission/organization/queryAll').then((res) => {
                        if(res.status == 200){
                            this.organizationTree.data = res.data.top;
                            if(!this.organizationTree.selectData){
                                this.getOrganizationInfo(res.data.top[0]);
                            }
                            this.$nextTick(function() {
								this.$refs.organizationTree.setCurrentKey(this.organizationTree.selectData.id);
								this.organizationTree.defaultExpanded.push(this.organizationTree.selectData.id);
							});
                        }else{
                            this.$message(res.message);
                        }
                    });					
                })
			},
			// node-expand
            nodeExpand(data,node,component) {
                this.organizationTree.defaultExpanded.push(data.id);
            },
            // node-collapse
            nodeCollapse(data,node,component) {
                var index = this.organizationTree.defaultExpanded.indexOf(data.id);
                this.organizationTree.defaultExpanded.splice(index,1);
            },
			// 点击节点获取基本信息
			getOrganizationInfo(data,node,component){
//				console.log(node);
				// 缓存node
				this.organizationTree.selectNode = node;
				this.organizationTree.openFlag = data.openFlag;
				// 缓存选中data
                this.organizationTree.selectData = data;
                this.organizationTable.pagination.currentPage = 1;
                this.organizationTable.message.id = data.id;
                this.organizationTable.message.number = data.organizationCode;
                this.organizationTable.message.name = data.organizationName;
                this.organizationTable.message.desc = data.description;
                // 表格内容
                var params = {
                    parentId: data.id,
                    pageNum: this.organizationTable.pagination.currentPage,
                    pageSize: this.organizationTable.pagination.pageSize
                }
                this.getOrganizationTableData(params);
			},
			// 获取表格数据
			getOrganizationTableData(data){
				this.$axios.post('/itsm/system/permission/organization/queryOrganizationByPage', data).then((res) => {
                    if (res.status==200){
                        this.organizationTable.tableData = res.data.list;
                        this.organizationTable.pagination.total = res.data.total;
                    } else {
                        this.$message(res.message);
                    }
                });
			},
			// sizeChange事件
			handleSizeChange(size) {
				var params = {
                    parentId: this.organizationTable.message.id,
                    pageNum: 1,
                    pageSize: size
                }
                this.getOrganizationTableData(params)
			},
			// currentChange事件
			handleCurrentChange(currentPage) {
				var params = {
                    parentId: this.organizationTable.message.id,
                    pageNum: currentPage,
                    pageSize: this.organizationTable.pagination.pageSize
                }
                this.getOrganizationTableData(params)
			},
			/********************新增、编辑组织************************/
			// 打开新增/编辑组织弹窗
			openAddEditOrganizationDialog(type,row) {
				if(this.organizationTree.selectData.openFlag == 1){ //父节点禁用
					this.$message({type: 'warning',message: '父组织已禁用，不能操作子组织'});
					return;
				}
				if (this.organizationTree.selectNode && this.organizationTree.selectNode.level == 5) {
                    this.$message.warning("树结构最多存在五级");
                    return false;
                }
				this.addEditOrganizationDialog.type = type;
				this.addEditOrganizationDialog.title = type == 'add' ? '新增组织' : '编辑组织'
				this.addEditOrganizationDialog.show = true;
				if(type == 'edit'){
					this.addEditOrganizationDialog.form.id = row.id;
					this.addEditOrganizationDialog.form.number = row.organizationCode;
					this.addEditOrganizationDialog.form.name = row.organizationName;
					this.addEditOrganizationDialog.form.desc = row.description;
				}
			},
			// 点击新增/编辑弹窗的保存按钮
			saveAddEditOrganization(){				
				this.$refs['addEditOrganizationForm'].validate((valid) => {
					if(valid){
						//新增
						this.addEditOrganizationDialog.type == 'add' ? this.addOrganization() : this.editOrganization();												
					}
				})
			},
			// 新增组织
			addOrganization(){
				var params = {
					parentId:this.organizationTable.message.id,
					organizationCode:this.addEditOrganizationDialog.form.number,
					organizationName:this.addEditOrganizationDialog.form.name,
					description:this.addEditOrganizationDialog.form.desc
				}
		
				this.$axios.post('/itsm/system/permission/organization/addOrganization', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditOrganizationDialog.show = false;
                       //刷新树和表格数据
                       this.refreshData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    }
            	});
			},
			// 编辑组织
			editOrganization(){
				var params = {
					id:this.addEditOrganizationDialog.form.id,
					organizationCode:this.addEditOrganizationDialog.form.number,
					organizationName:this.addEditOrganizationDialog.form.name,
					description:this.addEditOrganizationDialog.form.desc
				}
				this.$axios.post('/itsm/system/permission/organization/updateOrganization', params).then((res) => {
                    if (res.status == 200){
                       this.$message({message:res.message,type:'success'});
                       this.addEditOrganizationDialog.show = false;
                       //刷新树和表格数据
                       this.refreshData();
                    } else {
                        this.$message({message:res.message,type:'error'});
                    } 
            	});
			},
			// 关闭新增、编辑弹窗
			closeAddEditOrganizationDialog(){				
				this.reset('addEditOrganizationForm');
				this.addEditOrganizationDialog.form.id = '';
				this.addEditOrganizationDialog.form.number = '';
				this.addEditOrganizationDialog.form.name = '';
				this.addEditOrganizationDialog.form.desc = '';
			},
			// 重置表单
			reset(ref) {
				this.$refs[ref].resetFields();
			},
			/********************************************/
			// 刷新树和表格数据
			refreshData(){
				this.getOrganizationTree();
				this.organizationTable.pagination.currentPage = 1;
                //重新请求表格数据
                var params = {
                    parentId: this.organizationTable.message.id,
                    pageNum: this.organizationTable.pagination.currentPage,
                    pageSize: this.organizationTable.pagination.pageSize
                }
                this.getOrganizationTableData(params);
			},			
			// 点击删除
			deleteOrganization() {
				const self = this;
				if(self.organizationTree.selectData.openFlag == 1){ //父节点禁用
					self.$message({type: 'warning',message: '父组织已禁用，不能操作子组织'});
					return;
				}
				if(self.organizationTable.selected.length == 0) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}
				self.$confirm('是否确定删除选中的数据?', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.get('/itsm/system/permission/organization/deleteOrganization',{params:{ids:self.organizationTable.selected,parentId:this.organizationTable.message.id}}).then((res) => {
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
			// 点击启用/禁用
			updateOrganization(openFlag) {
				const self = this;
				if(self.organizationTree.selectData.openFlag == 1){ //父节点禁用
					self.$message({type: 'warning',message: '父组织已禁用，不能操作子组织'});
					return;
				}
				if(!self.organizationTable.selected.length) {
					self.$message({type: 'warning',message: '至少选择一条数据'});
					return;
				}				
				var confirmMessage = openFlag == 0 ? '启用' : '禁用';
				self.$confirm('是否确定'+ confirmMessage +'选中的数据？', '提示', {confirmButtonText: '确定',cancelButtonText: '取消',type: 'warning'}).then(() => {
					self.$axios.get('/itsm/system/permission/organization/updateOpenFlagOrganization',{params:{ids:self.organizationTable.selected,openFlag:openFlag}}).then((res) => {
	                    if(res.status==200){
	                       self.$message({type: 'success',message:res.message});
	                       self.refreshData();
	                    }else{
	                       self.$message({type: 'error',message:res.message}); 
	                    }
	                });
				}).catch(() => {
					self.$message({type: 'info',message: '已取消'+ confirmMessage});
				});
			},			
			// 渲染树结构数据
			renderContent(h, { node, data, store }) {
//				return h('span', [
//					h('i', {
//						style: {
//							color: '#ff9a32',
//							'margin-right': '5px'
//						},
//						class: node.childNodes.length > 0 ? 'el-icon-my-file' : 'el-icon-my-text'
//					}),
//					h('span', node.label)
//				]);

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
				this.organizationTable.selected = v.map(v => v.id);
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