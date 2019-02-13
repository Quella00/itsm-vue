<template>
    <div class="itsm-tabs-main">

        <div class="tabs-left border">
            <ies-scrollbar class="ies-scrollbar">
                <div class="category" v-changeTreeH>
                    <el-tree ref='categoryTree' :data="configCategoryTree.data" :props="configCategoryTree.defaultProps" :renderContent='renderContent' node-key="id" :default-expanded-keys="configCategoryTree.defaultExpanded" 
                    :expand-on-click-node="false"  highlight-current @node-click="getCategoryTable" @node-expand="nodeExpand" @node-collapse="nodeCollapse"></el-tree>
                </div>
            </ies-scrollbar>
        </div>

        <div class="tabs-right">

            <div class="tabs-panel-wrap border">
                <div class="message-headr">
                    <span>当前分类信息</span>
                </div>
                <div class="message-content">
                    <el-tooltip class="item" effect="dark" :content="configCategoryTable.message.categoryParent" placement="bottom-start">
                        <el-col :span="6" class="message-item ellipsis">上级分类：{{configCategoryTable.message.categoryParent}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configCategoryTable.message.categoryCode" placement="bottom-start">
                        <el-col :span="6" class="message-item">编号：{{configCategoryTable.message.categoryCode}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configCategoryTable.message.categoryName" placement="bottom-start">
                        <el-col :span="6" class="message-item ellipsis">名称：{{configCategoryTable.message.categoryName}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configCategoryTable.message.categoryState==0?'启用':'禁用'" placement="bottom-start">
                        <el-col :span="6" class="message-item">状态：{{configCategoryTable.message.categoryState==0?'启用':'禁用'}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configCategoryTable.message.categoryDesc" placement="bottom-start">
                        <el-col :span="24" class="message-item ellipsis">描述：{{configCategoryTable.message.categoryDesc}}</el-col>
                    </el-tooltip>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <el-button type="primary" @click="deleteCategoryHandler" icon="el-icon-my-delete" size="normal">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" @click="openAddAndEdit('add')" icon="el-icon-my-circleAdd" size="normal" >新增</el-button>
                        <el-button type="primary" @click="updateOpenFlag(1)" icon="el-icon-my-disable" size="normal" >禁用</el-button>
                        <el-button type="primary" @click="updateOpenFlag(0)" icon="el-icon-my-able" size="normal" >启用</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="configCategoryTable.data"  @selection-change="selectionChange" stripe>
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column prop="codeNumber" show-overflow-tooltip label="编号">
                        </el-table-column>
                        <el-table-column prop="categoryName" show-overflow-tooltip label="名称">
                        </el-table-column>
                        <el-table-column prop="openFlag" label="启用状态" width="150">
                            <template slot-scope="scope">
                                {{scope.row.openFlag==0?'启用':'禁用'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" show-overflow-tooltip label="描述">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddAndEdit('edit',scope.row)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer">
                    <el-pagination class="fr" :current-page="configCategoryTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="configCategoryTable.pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="configCategoryTable.pagination.total" @size-change="sizeChange" @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 新增编辑弹框 -->
        <el-dialog :title="addAndEditForm.title" :close-on-click-modal='false' custom-class="categoryDialogStyle" :visible.sync="addAndEditForm.visible" @close="reset('addAndEditFormId')" width="415px" v-drag>
            <el-form label-width="120px" :rules="addAndEditForm.rules" ref="addAndEditFormId" :model="addAndEditForm.params">
                <el-form-item label="编号:" prop="codeNumber">
                    <el-input style="width:200px" placeholder="请输入分类编号" :disabled="addAndEditForm.type=='edit'" v-model="addAndEditForm.params.codeNumber"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="categoryName" style="margin-bottom:34px;">
                    <el-input style="width:200px" placeholder="请输入分类名称" v-model="addAndEditForm.params.categoryName"></el-input>
                </el-form-item>
                <el-form-item label="图标:" prop="imageId">
                    <div class="icon-shwo"> <i :class="addAndEditForm.params.imageId"></i> </div>
                    <el-select :disabled="addAndEditForm.type=='edit'" v-model="addAndEditForm.params.imageId"  placeholder="请选择分类图标" class="icon-select">
                        <el-option style="width:140px;" key="" value="" label="请选择图标"></el-option>
                        <el-option style="width:140px;" v-for="item in addAndEditForm.iconArray" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="描述:" prop="description">
                    <el-input style="width:200px" type="textarea" :rows="6" placeholder="请输入内容" v-model="addAndEditForm.params.description">
                    </el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="normal" @click="saveAddAndEdit">保 存</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: 'categoryManagement',
        data() {
            let validator = this.$ies.validator;
            return {
                //分类树配置
                configCategoryTree: {
                    data:[],
                    defaultExpanded:[1],
                    selectData:null,
                    selectNode:null,
                    defaultProps: {
                        label: 'categoryName',
                        children: 'children'
                    },
                },
                //分类表格配置
                configCategoryTable: {
                    message: {
                        categoryParent: '',
                        categoryId: '',
                        categoryCode: '',
                        categoryName: '',
                        categoryState: '',
                        categoryDesc: '',
                    },
                    data: [],
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                },
                //dialog触发
                addAndEditForm: {
                    title: '',
                    type: '',
                    visible: false,
                    params: {
                        id: '',
                        parentId: '',
                        codeNumber: '',
                        categoryName: '',
                        imageId: 'el-icon-my-file',
                        description: ''
                    },
                    rules: {
                        codeNumber: [
                            { required: true, message: '请输入分类编号', trigger: 'blur' },
                            { validator: validator.number, trigger: 'blur' },
                        ],
                        categoryName: [
                            { required: true, message: '请输入分类名称', trigger: 'blur' },
                            { validator: validator.name, trigger: 'blur' }
                        ],
                        description: [
                            { min: 0, max:200, message: '长度为200个字符', trigger: 'blur' }
                        ]
                    },
                    iconArray: ["el-icon-my-file","el-icon-my-text"],
                },
                tipDialog: {
                    tipVisible: false,
                    content: ''
                },
                selection: [],
            };
        },
        mounted() {
            const self = this;
           
            this.$nextTick(function () {
                self.init();
            })
        },
        methods: {
            //初始化函数
            init() {
                this.getCategoryTree();
            },
            //获取分类树
            getCategoryTree() {
                this.$axios.post('/itsm/system/config/category/queryAll').then((res) => {
                    if(res.status==200){
                        this.configCategoryTree.data = res.data.top;
                        if(!this.configCategoryTree.selectData){
                            this.getCategoryTable(res.data.top[0]);
                        }
                        this.$nextTick(function(){
                            this.$refs.categoryTree.setCurrentKey(this.configCategoryTree.selectData.id);
                            this.configCategoryTree.defaultExpanded.push(this.configCategoryTree.selectData.id);
                        })
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            //node-expand
            nodeExpand(data,node,component) {
                this.configCategoryTree.defaultExpanded.push(data.id);
            },
            //node-collapse
            nodeCollapse(data,node,component) {
                var index = this.configCategoryTree.defaultExpanded.indexOf(data.id);
                this.configCategoryTree.defaultExpanded.splice(index,1);
            },
            //获取分类表格
            getCategoryTable(data,node) {
                //缓存选中data
                this.configCategoryTree.selectData = data;
                this.configCategoryTree.selectNode = node;
                this.configCategoryTable.pagination.currentPage = 1;
                //表格头部信息
                this.configCategoryTable.message.categoryParent = node&&node.parent?node.parent.data.categoryName:'';
                this.configCategoryTable.message.categoryId = data.id||0;
                this.configCategoryTable.message.categoryCode = data.codeNumber;
                this.configCategoryTable.message.categoryName = data.categoryName;
                this.configCategoryTable.message.categoryState = data.openFlag;
                this.configCategoryTable.message.categoryDesc = data.description;
                //表格内容
                var params = {
                    parentId: data.id,
                    pageNum: this.configCategoryTable.pagination.currentPage,
                    pageSize: this.configCategoryTable.pagination.pageSize
                }
                this.getCategoryTableData(params);
            },
            //请求表格数据
            getCategoryTableData(params){
                params = params || {
                    parentId: this.configCategoryTable.message.categoryId,
                    pageNum: this.configCategoryTable.pagination.currentPage,
                    pageSize: this.configCategoryTable.pagination.pageSize
                }
                this.$axios.post('/itsm/system/config/category/queryCategory', params).then((res) => {
                    if (res.status==200){
                        if(res.data){
                            this.configCategoryTable.data = res.data.list;
                            this.configCategoryTable.pagination.total = res.data.total;
                        }else{
                            this.configCategoryTable.data = [];
                            this.configCategoryTable.pagination.total = 0;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },

            //重新刷新数据
            refushHandler(pageNum){
                //重新请求分类树数据
                this.getCategoryTree();
                //重置pagination
                if(pageNum){
                    this.configCategoryTable.pagination.currentPage = pageNum;
                }
                //重新请求分类表格数据
                // var params = {
                //     parentId: this.configCategoryTable.message.categoryId,
                //     pageNum: this.configCategoryTable.pagination.currentPage,
                //     pageSize: this.configCategoryTable.pagination.pageSize
                // }
                this.getCategoryTableData();
            },
            //sizeChange事件
            sizeChange(size) {
                this.configCategoryTable.pagination.pageSize = size;
                this.getCategoryTableData()
            },
            //currentChange是将
            currentChange(currentPage) {
                this.configCategoryTable.pagination.currentPage = currentPage;
                this.getCategoryTableData()
            },
            //打开编辑新增弹框
            openAddAndEdit(type,row) {
                // 判断是否可修改
                if(this.configCategoryTable.message.categoryName=='分类树'){
                    this.$message.warning("分类树子类不允许操作");
                    return false;
                }
                if(this.configCategoryTree.selectNode&&this.configCategoryTree.selectNode.level==5){
                    this.$message.warning("树结构最多存在五级");
                    return false;
                }
                if(this.configCategoryTree.selectData.openFlag==1){
                    this.$message.warning("父节点已被禁用，禁止操作");
                    return false;
                }
                this.addAndEditForm.type = type;
                this.addAndEditForm.params.parentId = this.configCategoryTable.message.categoryId;
                
                // 判断是新增还是编辑
                this.addAndEditForm.title = type=='add'?'新增分类':'编辑分类';
                if(type=='edit'){
                    this.addAndEditForm.params.id = row.id;
                    this.addAndEditForm.params.codeNumber = row.codeNumber;
                    this.addAndEditForm.params.categoryName = row.categoryName;
                    this.addAndEditForm.params.imageId = row.imageId;
                    this.addAndEditForm.params.description = row.description;
                }
                this.addAndEditForm.visible = true;
            },
            //保存编辑新增弹框
            saveAddAndEdit() {
                this.$refs['addAndEditFormId'].validate((valid) => {
                    if(valid){
                        //判断是新增还是编辑进行保存
                        this.addAndEditForm.type == 'add'?this.categoryAddHandler():this.categoryEditHandler();
                    }
                })
            },
            createStateFilter(queryString) {
                return (state) => {
                    return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },

            /***********新增分类**********/
            categoryAddHandler(){
                var params = {
                    parentId: this.addAndEditForm.params.parentId,
                    codeNumber: this.addAndEditForm.params.codeNumber,
                    categoryName: this.addAndEditForm.params.categoryName,
                    imageId: this.addAndEditForm.params.imageId,
                    description: this.addAndEditForm.params.description
                }
                this.$axios.post('/itsm/system/config/category/saveCategory', params).then((res) => {
                    if (res.status==200){
                        //关闭弹框
                        this.addAndEditForm.visible = false;
                        this.$message.success(res.message);
                        var height = $('.category').height()+26;
                        $('.category').height(height+'px');
                        this.refushHandler(1);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },

            /***********删除分类**********/
            deleteCategoryHandler() {
                if(this.configCategoryTree.selectData.openFlag==1){
                    this.$message.warning("父节点已被禁用，禁止操作");
                    return false;
                }
                if (this.selection.length == 0) {
                    this.$message.warning('请选择要删除的分类')
                } else {
                    if(this.configCategoryTable.message.categoryName=='分类树'){
                        this.$message.warning("分类树子类不允许操作");
                        return false;
                    }
                    this.$confirm('是否删除选中分类?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios.post('/itsm/system/config/category/deleteCategory',{parentId: this.configCategoryTable.message.categoryId,categoryIdList:this.selection.join(',')}).then((res) => {
                            if (res.status==200){
                                this.$message.success(res.message)
                                this.refushHandler(1);
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    }).catch(() => {
                        this.$message.info('已取消删除');          
                    });
                }
            },

            /***********编辑分类**********/
            categoryEditHandler(){
                var params = {
                    id: this.addAndEditForm.params.id,
                    categoryName: this.addAndEditForm.params.categoryName,
                    description: this.addAndEditForm.params.description
                }
                this.$axios.post('/itsm/system/config/category/updateCategory', params).then((res) => {
                    if (res.status==200){
                        //关闭弹框
                        this.addAndEditForm.visible = false;
                        this.$message.success(res.message)
                        this.refushHandler();
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },

            /***********启用禁用**********/
            updateOpenFlag(flag) {
                if(this.selection.length==0){
                    this.$message.warning('请选择所操作分类')
                    return;
                }
                if(this.configCategoryTable.message.categoryName=='分类树'){
                    this.$message.warning("分类树子类不允许操作");
                    return false;
                }
                if(this.configCategoryTree.selectData.openFlag==1){
                    this.$message.warning("父节点已被禁用，禁止操作");
                    return false;
                }
                this.$confirm(flag==0?'确定启用所选分类及对应所有子分类？':'确定禁用所选分类及对应所有子分类？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    var params = {
                        categoryIdList:this.selection.join(','),
                        openFlag:flag
                    }
                    this.$axios.post('/itsm/system/config/category/updateCategoryOpenFlag', params).then((res) => {
                        if (res.status==200){
                            this.$message.success(res.message)
                            this.refushHandler();
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info(flag==0?'已取消启用':'已取消禁用');          
                });
            },
            reset(ref){
                this.$refs[ref].resetFields();
                //手动清空
                this.addAndEditForm.params= {
                    id: '',
                    parentId: '',
                    codeNumber: '',
                    categoryName: '',
                    imageId: 'el-icon-my-file',
                    description: ''
                }
            },
            selectionChange(v) {
                this.selection = v.map(v => v.id);;
            },
            renderContent(h, { node, data, store }) {
            	if(node.label.length >= 6){
	                return h('span',
	                	[
		                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: data.imageId}),
		                    h('el-tooltip',{ attrs: {content: node.label, placement: "bottom-start", 'popper-class':'my-tooltip'} },
		                    [
		                    	h('span', node.label)
		                    ])
	                    ]
	                );
            	}else{
	                return h('span',
	                [
	                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: data.imageId}),
	                    h('span', node.label)
	                ]);
            	}
            },
        },
    }

</script>

<style scoped>
    .el-tree>.el-tree-node {padding-left: 15px;padding-top: 25px;}
</style>