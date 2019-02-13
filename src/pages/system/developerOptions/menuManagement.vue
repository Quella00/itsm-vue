<template>
    <div class="itsm-tabs-main">

        <div class="tabs-left border">
            <ies-scrollbar class="ies-scrollbar">
                <div class="category" v-changeTreeH>
                    <el-tree ref='menuTree' :data="configMenuTree.data" :props="configMenuTree.defaultProps" :renderContent='renderContent' node-key="id" :default-expanded-keys="configMenuTree.defaultExpanded" 
                    :expand-on-click-node="false"  highlight-current @node-click="getMenuDetail" @node-expand="nodeExpand" @node-collapse="nodeCollapse"></el-tree>
                </div>
            </ies-scrollbar>
        </div>

        <div class="tabs-right">

            <div class="tabs-panel-wrap border">
                <div class="message-headr">
                    <span>当前分类信息</span>
                </div>
                <div class="message-content">
                    <el-tooltip class="item" effect="dark" :content="configMenuTable.message.categoryParent" placement="bottom-start">
                        <el-col :span="8" class="message-item ellipsis">上级分类：{{configMenuTable.message.menuParent}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configMenuTable.message.categoryCode" placement="bottom-start">
                        <el-col :span="8" class="message-item">名称：{{configMenuTable.message.menuName}}</el-col>
                    </el-tooltip>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <el-button type="primary" @click="deleteHandler" icon="el-icon-my-delete" size="normal">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" @click="openAddAndEdit('add')" icon="el-icon-my-circleAdd" size="normal" >新增</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="configMenuTable.data"  @selection-change="selectionChange" >
                        <el-table-column type="selection" width="55" align="center"> </el-table-column>
                        <el-table-column prop="resourceName" show-overflow-tooltip label="名称" width="150px"> </el-table-column>
                        <el-table-column prop="resourceType" label="TYPE" width="150">
                            <template slot-scope="scope">
                                {{scope.row.resourceType==1?'父级菜单':scope.row.resourceType==2?'功能页面':'页面按钮'}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="resourceUrl" show-overflow-tooltip label="菜单URL"> </el-table-column>
                        <el-table-column prop="permissionUrl" show-overflow-tooltip label="权限URL"> </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddAndEdit('edit',scope.row)"> </i>
                                <i class="el-icon-my-visible ml5" style="font-size:18px" v-if="scope.row.visible" @click="visibleHandler(scope.row)" > </i>
                                <i class="el-icon-my-invisible ml5" style="font-size:18px" v-else @click="visibleHandler(scope.row)"> </i>
                                <i class="el-icon-my-up ml5" @click="orderHandler(scope.row.id, 1)"> </i>
                                <i class="el-icon-my-down ml5" @click="orderHandler(scope.row.id, 2)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer">
                    <el-pagination class="fr" :current-page="configMenuTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="configMenuTable.pagination.pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="configMenuTable.pagination.total" @size-change="sizeChange" @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!-- 新增编辑弹框 -->
        <el-dialog :title="addAndEditForm.title" :close-on-click-modal='false' custom-class="menuDialogStyle" :visible.sync="addAndEditForm.visible" @close="reset('addAndEditFormId')" width="455px" v-drag>
            <el-form label-width="150px" :rules="addAndEditForm.rules" ref="addAndEditFormId" :model="addAndEditForm.params" class="mt15" >
                <el-form-item class="parent-menu" label="父菜单名称:">
                    {{configMenuTable.message.menuName}}
                </el-form-item>
                <el-form-item label="菜单名称:" prop="resourceName">
                    <el-input style="width:200px" placeholder="请输入分类名称"  v-model="addAndEditForm.params.resourceName"></el-input>
                </el-form-item>
                <el-form-item label="菜单链接:" prop="resourceUrl">
                    <el-input style="width:200px" placeholder="请输入分类名称" v-model="addAndEditForm.params.resourceUrl"></el-input>
                </el-form-item>
                <el-form-item label="权限URL:" prop="permissionUrl">
                    <el-input style="width:200px" placeholder="请输入分类名称" v-model="addAndEditForm.params.permissionUrl"></el-input>
                </el-form-item>
                <el-form-item label="菜单栏是否有子集:" prop="parentFlag">
                    <el-switch v-model="addAndEditForm.params.parentFlag"></el-switch>
                </el-form-item>
                <el-form-item label="菜单树是否有子集:" prop="menuTreeSubset">
                    <el-switch v-model="addAndEditForm.params.menuTreeSubset"></el-switch>
                </el-form-item>
                <el-form-item class="menu-type" label="菜单类型:" prop="resourceType">
                    <el-radio-group  v-model="addAndEditForm.params.resourceType">
                        <el-radio :label="1">父级菜单</el-radio>
                        <el-radio :label="2">功能页面</el-radio>
                        <el-radio :label="3">页面按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="menu-operate" label="权限标签:" v-if="addAndEditForm.params.resourceType=='3'" prop="operatingAuthorizationShow">
                    <el-checkbox-group v-model="addAndEditForm.operatingAuthorizationShow">
                        <el-checkbox label="1">查看</el-checkbox>
                        <el-checkbox label="2">新增</el-checkbox>
                        <el-checkbox label="3">更新</el-checkbox>
                        <el-checkbox label="4">删除</el-checkbox>
                    </el-checkbox-group>
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
        name: 'menuManagement',
        data() {
            let validator = this.$ies.validator;
            return {
                //分类树配置
                configMenuTree: {
                    data:[],
                    defaultExpanded:[0],
                    selectData:null,
                    defaultProps: {
                        label: 'resourceName',
                        children: 'children'
                    },
                },
                //分类表格配置
                configMenuTable: {
                    message: {
                        id:'0',
                        menuParent: '',
                        menuName: ''
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
                    operatingAuthorizationShow: [],
                    params: {
                        id: '',
                        parentFlag:true,
                        menuTreeSubset:true,
                        parentResourceId: '',
                        resourceName: '',
                        permissionUrl:'',
                        resourceUrl: '',
                        resourceType: '',
                        operatingAuthorization: '',
                    },
                    rules: {
                        resourceName: [
                            { required: true, message: '请输入菜单名称', trigger: 'blur' },
                            { validator: validator.space, options:{min:1, max:8}, trigger: 'blur' },
                        ],
                        resourceUrl: [
                            { validator: validator.space, trigger: 'blur' },
                        ],
                        permissionUrl: [
                            { validator: validator.space, trigger: 'blur' }
                        ],
                        resourceType: [
                            { required: true, message: '请选择菜单分类', trigger: 'blur' },
                            { validator: validator.name, trigger: 'blur' }
                        ],
                    }
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
                this.getMenuTree();
            },
            //获取菜单树
            getMenuTree() {
                this.$axios.post('/itsm/system/permission/resource/queryResourceByAll',{usability : 1}).then((res) => {
                    if(res.status==200){
                        let menuData = {
                            id: 0,
                            parentFlag:true,
                            resourceName:"菜单栏",
                            children:res.data.top
                        }
                        this.configMenuTree.data = [];
                        this.configMenuTree.data.push(menuData);
                        if(!this.configMenuTree.selectData){
                            this.configMenuTree.selectData = menuData;
                            this.getMenuDetail(menuData);
                        }
                        this.$nextTick(function(){
                            this.$refs.menuTree.setCurrentKey(this.configMenuTree.selectData.id);
                            this.configMenuTree.defaultExpanded.push(this.configMenuTree.selectData.id);
                        })
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            //node-expand
            nodeExpand(data,node,component) {
                this.configMenuTree.defaultExpanded.push(data.id);
            },
            //node-collapse
            nodeCollapse(data,node,component) {
                var index = this.configMenuTree.defaultExpanded.indexOf(data.id);
                this.configMenuTree.defaultExpanded.splice(index,1);
            },
            //获取分类表格
            getMenuDetail(data,node) {
                //缓存选中data
                this.configMenuTree.selectData = data;
                this.configMenuTable.pagination.currentPage = 1;
                //表格头部信息
                this.configMenuTable.message.id = data.id;
                this.configMenuTable.message.menuName = data.resourceName;
                this.configMenuTable.message.menuParent = node&&node.parent?node.parent.data.resourceName:'';
                //表格内容
                this.configMenuTable.pagination.currentPage = 1;
                this.getMenuTable();
            },
            //请求表格数据
            getMenuTable(params){
                params = params || {
                    id: this.configMenuTable.message.id,
                    pageNum: this.configMenuTable.pagination.currentPage,
                    pageSize: this.configMenuTable.pagination.pageSize
                }
                this.$axios.post('/itsm/system/permission/resource/queryResourceByPage', params).then((res) => {
                    if (res.status==200){
                        if(res.data){
                            this.configMenuTable.data = res.data.list;
                            this.configMenuTable.pagination.total = res.data.total;
                        }else{
                            this.configMenuTable.data = [];
                            this.configMenuTable.pagination.total = 0;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },

            //重新刷新数据
            refushHandler(pageNum){
                //重新请求分类树数据
                this.getMenuTree();
                //重新请求左侧slider
                this.$ies.dispatch(this, 'layout').$refs.sidebar.getSidebarData(()=>{
                    this.$nextTick(function(){
                        $(".ies-sidebar-submenu.is-opened").removeClass('is-opened');
                    })
                });
                //重置pagination
                if(pageNum){
                    this.configMenuTable.pagination.currentPage = pageNum;
                }

                this.getMenuTable();
            },
            //sizeChange事件
            sizeChange(size) {
                this.configMenuTable.pagination.pageSize = size;
                this.getMenuTable()
            },
            //currentChange是将
            currentChange(currentPage) {
                this.configMenuTable.pagination.currentPage = currentPage;
                this.getMenuTable()
            },
            //打开编辑新增弹框
            openAddAndEdit(type,row) {
                this.addAndEditForm.type = type;
                this.addAndEditForm.params.parentResourceId = this.configMenuTable.message.id;
                this.addAndEditForm.operatingAuthorizationShow = row&&row.operatingAuthorization?row.operatingAuthorization.split(','):[];
                // 判断是新增还是编辑
                this.addAndEditForm.title = type=='add'?'新增菜单':'编辑菜单';
                if(type=='edit'){
                    this.addAndEditForm.params.id = row.id;
                    this.addAndEditForm.params.parentFlag = row.parentFlag;
                    this.addAndEditForm.params.menuTreeSubset = row.menuTreeSubset;
                    this.addAndEditForm.params.resourceName = row.resourceName;
                    this.addAndEditForm.params.permissionUrl = row.permissionUrl;
                    this.addAndEditForm.params.resourceUrl = row.resourceUrl;
                    this.addAndEditForm.params.resourceType = row.resourceType;
                }
                this.addAndEditForm.visible = true;
            },
            
            /********保存编辑新增弹框********/
            saveAddAndEdit() {
                this.$refs['addAndEditFormId'].validate((valid) => {
                    if(valid){
                        //判断是新增还是编辑进行保存
                        this.addAndEditForm.params.operatingAuthorization = this.addAndEditForm.params.resourceType == 3? this.addAndEditForm.operatingAuthorizationShow.join(',') : '';
                        this.addAndEditForm.type == 'add'?this.menuAddHandler():this.menuEditHandler();
                    }
                })
            },

            /***********新增菜单**********/
            menuAddHandler(){
                this.$ies.formatObject(this.addAndEditForm.params,[])
                this.$axios.post('/itsm/system/permission/resource/addResource', this.addAndEditForm.params).then((res) => {
                    if (res.status==200){
                        //关闭弹框
                        this.addAndEditForm.visible = false;
                        this.$message.success(res.message);
                        this.refushHandler(1);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },

            /***********删除菜单**********/
            deleteHandler() {
                if (this.selection.length == 0) {
                    this.$message.warning('请选择要删除的菜单')
                } else {
                    this.$confirm('是否删除选中分类?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios.post('/itsm/system/permission/resource/batchDeleteChildResourceById',{ids: this.selection.join(','),status:-1}).then((res) => {
                            if (res.status==200){
                                this.$message.success(res.message)
                                this.refushHandler(1);
                            } else {
                                this.$message.error(res.message);
                            }
                        });
                    }).catch(() => {
                        this.$message.info('已取消操作');          
                    });
                }
            },
            /***********隐藏/显示**********/
            visibleHandler(row) {
                let word = row.visible?'隐藏':'显示',status = row.visible?0:1;
                this.$confirm('是否选'+word+'中菜单?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/itsm/system/permission/resource/batchDeleteChildResourceById',{ids: row.id,status:status}).then((res) => {
                        if (res.status==200){
                            this.$message.success(res.message)
                            this.refushHandler(1);
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消操作');          
                });
            },
            /***********编辑菜单**********/
            menuEditHandler(){
                this.$ies.formatObject(this.addAndEditForm.params,[])
                this.$axios.post('/itsm/system/permission/resource/updateResource',this.addAndEditForm.params).then((res) => {
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

            /*********调整菜单循序********/
            orderHandler(id,sort){
                this.$axios.post('/itsm/system/permission/resource/updateResourceBySort', {id:id,sortType:sort}).then((res) => {
                    if (res.status==200){
                        //关闭弹框
                        this.refushHandler();
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            reset(ref){
                this.$refs[ref].resetFields();
                //手动清空
                this.addAndEditForm.params= {
                    id: '',
                    parentFlag: true,
                    menuTreeSubset: true,
                    parentResourceId: '',
                    resourceName: '',
                    permissionUrl:'',
                    resourceUrl: '',
                    resourceType: '',
                    operatingAuthorization: '',
                }
            },
            selectionChange(v) {
                this.selection = v.map(v => v.id);
            },
            renderContent(h, { node, data, store }) {
                let icon = data.children&&data.children.length>0?'el-icon-my-file':'el-icon-my-text';
            	if(node.label.length >= 6){
	                return h('span',
	                	[
		                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: icon}),
		                    h('el-tooltip',{ attrs: {content: node.label, placement: "bottom-start", 'popper-class':'my-tooltip'} },
		                    [
		                    	h('span', node.label)
		                    ])
	                    ]
	                );
            	}else{
	                return h('span',
	                [
	                    h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: icon}),
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