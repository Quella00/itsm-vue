<template>
    <div class="itsm-tabs-main">

        <div class="tabs-left border">
            <ies-scrollbar class="ies-scrollbar">
                <div class="area" v-changeTreeH>
                    <el-tree ref="areaTree" :data='configAreaTree.data' :props="configAreaTree.defaultProps" :renderContent='renderContent' node-key="id" :default-expanded-keys="configAreaTree.defaultExpanded" 
                    :expand-on-click-node="false"  highlight-current @current-change="getAreaTable" @node-expand="nodeExpand" @node-collapse="nodeCollapse"></el-tree>
                </div>
            </ies-scrollbar>
        </div>

        <div class="tabs-right">

            <div class="tabs-panel-wrap border">
                <div class="message-headr">
                    <span>当前区域信息</span>
                </div>
                <div class="message-content">
                    <el-tooltip class="item" effect="dark" :content="configAreaTable.message.areaCode" placement="bottom-start">
                        <el-col :span="6" class="message-item ellipsis">编号：{{configAreaTable.message.areaCode}}</el-col>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" :content="configAreaTable.message.areaName" placement="bottom-start">
                        <el-col :span="6" class="message-item ellipsis">名称：{{configAreaTable.message.areaName}}</el-col>
                    </el-tooltip>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <el-button type="primary" @click="deleteAreaHandler" icon="el-icon-my-delete" size="normal">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" @click="openAddAndEdit('add')" icon="el-icon-my-circleAdd" size="normal" >新增</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="configAreaTable.data" @selection-change="selectionChange" stripe>
                        <el-table-column type="selection" width="55" align="center">
                        </el-table-column>
                        <el-table-column prop="codeNumber" show-overflow-tooltip label="编号">
                        </el-table-column>
                        <el-table-column prop="areaName" show-overflow-tooltip label="名称">
                        </el-table-column>
                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddAndEdit('edit',scope.row)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer">
                    <el-pagination class="fr" :current-page="configAreaTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="configAreaTable.pagination.pageSize" 
                    layout="total, sizes, prev, pager, next, jumper" :total="configAreaTable.pagination.total" @size-change="sizeChange" @current-change="currentChange">
                    </el-pagination>
                </div>
            </div>
        </div>

        <!-- 新增编辑弹框 -->
        <el-dialog :title="addAndEditForm.title" :close-on-click-modal='false' custom-class="areaDialogStyle" :visible.sync="addAndEditForm.visible" @close="reset('addAndEditFormId')" width="445px" v-drag>
            <el-form label-width="130px" :rules="addAndEditForm.rules" ref="addAndEditFormId" :model="addAndEditForm.params">
                <el-form-item label="编号:" prop="codeNumber" >
                    <el-input style="width:200px" placeholder="请输入区域编号" :disabled="addAndEditForm.type=='edit'" v-model="addAndEditForm.params.codeNumber"></el-input>
                </el-form-item>
                <el-form-item label="名称:" prop="areaName" >
                    <el-input style="width:200px" placeholder="请输入区域名称" v-model="addAndEditForm.params.areaName"></el-input>
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
        name: 'areaManagement',
        data() {
            let validator = this.$ies.validator;

            return {
                // 区域树配置
                configAreaTree: {
                    data:[],
                    defaultExpanded:[1],
                    selectData:null,
                    selectNode:null,
                    defaultProps: {
                        label: 'areaName',
                        children: 'children'
                    },
                },
                // 区域表格配置
                configAreaTable: {
                    message: {
                        areaParent: '',
                        areaId: '',
                        areaCode: '',
                        areaName: '',
                    },
                    data: [],
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                },
                // dialog触发
                addAndEditForm:{
                    title:'',
                    visible:false,
                    params:{
                        id:'',
                        parentId:'',
                        codeNumber:'',
                        areaName:''
                    },
                    rules:{
                        codeNumber: [
                            { required: true, message: '请输入区域编号', trigger: 'blur' },
                            { validator:validator.number, trigger: 'blur' }
                        ],
                        areaName: [
                            { required: true, message: '请输入区域名称', trigger: 'blur' },
                            { validator:validator.name, trigger: 'blur' }
                        ]
                    }
                },
                selection:[],
            };
        },
        mounted() {
            const self = this;
            this.$nextTick(function(){
                self.init();
            })
        },
        methods: {
            // 初始化函数
            init(){
                this.getAreaTree();
            },
            // 获取区域树
            getAreaTree(node,resolve) {
                this.$axios.post('/itsm/system/config/area/queryAll').then((res) => {
                    if(res.status==200){
                        this.configAreaTree.data = res.data.top;
                        if(!this.configAreaTree.selectData){
                            this.getAreaTable(res.data.top[0])
                        }
                        this.$nextTick(function(){
                            this.$refs.areaTree.setCurrentKey(this.configAreaTree.selectData.id);
                            this.configAreaTree.defaultExpanded.push(this.configAreaTree.selectData.id);
                        })
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            // node-expand
            nodeExpand(data,node,component) {
                this.configAreaTree.defaultExpanded.push(data.id);
            },
            // node-collapse
            nodeCollapse(data,node,component) {
                var index = this.configAreaTree.defaultExpanded.indexOf(data.id);
                this.configAreaTree.defaultExpanded.splice(index,1);
            },
            // 获取分类表格
            getAreaTable(data,node,component) {
                // 缓存选中data
                this.configAreaTree.selectData = data;
                this.configAreaTree.selectNode = node;
                this.configAreaTable.pagination.currentPage = 1;
                // 表格头部信息
                this.configAreaTable.message.areaParent = node&&node.parent?node.parent.data.areaName:'';
                this.configAreaTable.message.areaId = data.id||0;
                this.configAreaTable.message.areaCode = data.codeNumber;
                this.configAreaTable.message.areaName = data.areaName;
                // 表格内容
                var params = {
                    parentId: data.id,
                    pageNum: this.configAreaTable.pagination.currentPage,
                    pageSize: this.configAreaTable.pagination.pageSize
                }
                this.getAreaTableData(params);
            },
            // 请求表格数据
            getAreaTableData(params){
                params = params || {
                    parentId: this.configAreaTable.message.areaId,
                    pageNum: this.configAreaTable.pagination.currentPage,
                    pageSize: this.configAreaTable.pagination.pageSize
                }
                this.$axios.post('/itsm/system/config/area/queryArea', params).then((res) => {
                    if (res.status==200){
                        if(res.data){
                            this.configAreaTable.data = res.data.list;
                            this.configAreaTable.pagination.total = res.data.total;
                        }else{
                            this.configAreaTable.data = [];
                            this.configAreaTable.pagination.total = 0;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            // 重新刷新数据
            refushHandler(pageNum){
                // 重新请求分类树数据
                this.getAreaTree();
                // 重置pagination
                if(pageNum){
                    this.configAreaTable.pagination.currentPage = pageNum;
                }
                // 重新请求分类表格数据
                // var params = {
                //     parentId: this.configAreaTable.message.areaId,
                //     pageNum: this.configAreaTable.pagination.currentPage,
                //     pageSize: this.configAreaTable.pagination.pageSize
                // }
                this.getAreaTableData();
            },
            // sizeChange事件
            sizeChange(size) {
                this.configAreaTable.pagination.pageSize = size;
                this.getAreaTableData()
            },
            // currentChange是将
            currentChange(currentPage) {
                this.configAreaTable.pagination.currentPage = currentPage;
                this.getAreaTableData()
            },
            // 打开编辑新增弹框
            openAddAndEdit(type,row) {
                this.addAndEditForm.type = type;
                this.addAndEditForm.params.parentId = this.configAreaTable.message.areaId;
                console.log()
                if(this.configAreaTree.selectNode&&this.configAreaTree.selectNode.level==5){
                    this.$message.warning("树结构最多存在五级");
                    return false;
                }
                // 判断是新增还是编辑
                this.addAndEditForm.title = type=='add'?'新增区域':'编辑区域';
                if(type=='edit'){
                    this.addAndEditForm.params.id = row.id;
                    this.addAndEditForm.params.codeNumber = row.codeNumber;
                    this.addAndEditForm.params.areaName = row.areaName;
                }
                this.addAndEditForm.visible = true;
            },
            // 保存编辑新增弹框
            saveAddAndEdit() {
                // 判断验证是否通过
                this.$refs['addAndEditFormId'].validate((valid) => {
                    if(valid){
                        // 判断是新增还是编辑进行保存
                        this.addAndEditForm.type == 'add'?this.areaAddHandler():this.areaEditHandler();
                    }
                })
            },

            /***********新增区域**********/
            areaAddHandler(){
                var params = {
                    parentId: this.addAndEditForm.params.parentId,
                    codeNumber: this.addAndEditForm.params.codeNumber,
                    areaName: this.addAndEditForm.params.areaName
                }
                this.$axios.post('/itsm/system/config/area/saveArea', params).then((res) => {
                    if (res.status==200){
                        //关闭弹框
                        this.addAndEditForm.visible = false;
                        this.$message.success(res.message);
                        var height = $('.area').height()+26;
                        $('.area').height(height+'px');
                        this.refushHandler(1);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },

            /***********删除区域**********/
            deleteAreaHandler() {
                var self = this;
                if (this.selection.length == 0) {
                    this.$message.warning('请选择要删除的区域')
                } else {
                    this.$confirm('是否删除选中区域?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$axios.post('/itsm/system/config/area/deleteArea', {parentId: this.configAreaTable.message.categoryId,areaIdList:this.selection.join(',')}).then((res) => {
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
             areaEditHandler(){
                var params = {
                    id: this.addAndEditForm.params.id,
                    areaName: this.addAndEditForm.params.areaName
                }
                this.$axios.post('/itsm/system/config/area/updateArea', params).then((res) => {
                    if (res.status==200){
                        // 关闭弹框
                        this.addAndEditForm.visible = false;
                        this.$message.success(res.message)
                        this.refushHandler();
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            reset(ref){
                this.$refs[ref].resetFields();
                // 手动清空数据
                this.addAndEditForm.params={
                    id:'',
                    parentId:'',
                    codeNumber:'',
                    areaName:''
                }
            },
            selectionChange(v) {
                this.selection = v.map(v => v.id);
            },
//          renderContent(h, { node, data, store }) {
//              return h('span',
//              [
//                  h('i', { style: { color: '#ff9a32', 'margin-right': '5px' }, class: 'el-icon-my-file'}),
//                  h('span', node.label)
//              ]);
//          },
            renderContent(h, { node, data, store }) {
            	if(node.label.length >= 6){
	                return h('span',
	                	[
		                    h('el-tooltip',{ attrs: {content: node.label, placement: "bottom-start", 'popper-class':'my-tooltip'} },
		                    [
		                    	h('span', node.label)
		                    ])
	                    ]
	                );
            	}else{
	                return h('span',
	                [
	                    h('span', node.label)
	                ]);
            	}
            },
            
        }
    }

</script>

