<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">
            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="configBuildTable.message" class="search-conditions" label-width="110px">
                        <el-form-item label="建筑名称：">
                                <el-input placeholder="请输入建筑名称" v-model="configBuildTable.message.buildingName" ></el-input>
                        </el-form-item>
                        <el-form-item label="所属区域：">
                            <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="configBuildTable.message.areaName"  readonly> </el-input>
                            <i class="el-icon-my-more" @click="openAreaDialog('query')"></i>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <el-button type="primary" icon="el-icon-my-delete" size="normal" @click="deleteBuildHandler">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetTable">重置</el-button>
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryBuildTable">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="openAddEditDialog('add')">新增</el-button>
                    </span>   
                </div>
                <div class="panel-body">
                    <el-table :data="configBuildTable.data" @selection-change="handleSelectionChange" stripe>
                        <el-table-column type="selection" width="55"  align="center"></el-table-column>

                        <el-table-column prop="buildingName" show-overflow-tooltip label="建筑名称"> </el-table-column>

                        <el-table-column prop="areaName" show-overflow-tooltip label="所属区域"> </el-table-column>

                        <el-table-column label="操作" width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddEditDialog('edit',scope.row)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer" style="text-align: right;">
                    <!--面板底部-->
                    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="configBuildTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="configBuildTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configBuildTable.pagination.total"></el-pagination>                    
                </div>

            </div>

        </div>
        <!-- 所属区域弹窗 -->
        <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='configAreaDialog.selectId' ></iesAreaDialog>

        <!-- 新增和编辑弹窗 -->
        <el-dialog :visible.sync="addAndEditForm.visible" :close-on-click-modal='false' custom-class="buildDialogStyle" @close="reset('addAndEditFormId')" v-drag>
            <span slot="title" style="color:#666666;">{{addAndEditForm.title}}</span>

            <el-form :model="addAndEditForm.params" :rules="addAndEditForm.rules" :inline="true" ref="addAndEditFormId" label-width="120px"
                 class="demo-ruleForm">
                <el-form-item label="建筑名称" prop="buildingName">
                    <el-input type="text" v-model="addAndEditForm.params.buildingName" placeholder="请输入建筑名称" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="所属区域" prop="areaName" >
                    <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="addAndEditForm.params.areaName" auto-complete="off" class="resetStyle" readonly></el-input>
                    <i v-if="addAndEditForm.type=='edit'" class="el-icon-my-more" @click="openAreaDialog('edit')" ></i>
                    <i v-else class="el-icon-my-more" @click="openAreaDialog('add')" ></i>
                </el-form-item>

                <el-form-item label="建筑地址" prop="buildingAddress">
                    <el-input type="textarea" :rows="5" v-model="addAndEditForm.params.buildingAddress" placeholder="请输入建筑地址" auto-complete="off"
                    ></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer" style="width:100%; position:absolute; bottom:15px; right:15px;">
                    <el-button type="primary" size="normal"  @click="saveAddAndEdit">保&nbsp;存</el-button>
                </span>
        </el-dialog>
    </div>

</template>

<script>
export default {
    name: 'buildingManagement',
	data() {
        const validator = this.$ies.validator;
		return {
            // 所属区域弹窗配置
            configAreaDialog: {
                show: false,     // 弹窗的显示/隐藏
                type: 'query',
                selectId: '',  // 选中的区域节点id    
            },
            //建筑表格配置
            configBuildTable: {
                message: {
                    buildingName: '',
                    areaId:'',
                    areaName: '',
                },
                query: {
                    buildingName: '',
                    areaId:'',
                    areaName: '',
                },
                data: [],
                selected:[],
                pagination: {
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                }
            },
            // 新增和编辑弹窗配置
            addAndEditForm:{
                title:'',
                visible:false,
                params:{
                    id:'',
                    buildingName:'',
                    areaId:'',
                    areaName:'',
                    buildingAddress:''
                },
                rules:{
                    buildingName: [
                        { required: true, message: '请输入建筑名称', trigger: 'blur' },
                        { validator:validator.name, trigger: 'blur' }
                    ],
                    areaName: [
                        { required: true, message: '请输入所属区域', trigger: 'change' },
                    ],
                    buildingAddress: [
                        { min: 0, max: 200, message: '长度在 0 到 200 个字符', trigger: 'blur' }
                    ]
                }
            },
		};
    },
    mounted(){
        this.$nextTick(function(){
            this.init();
        })
    },
	methods: {
		init() {
            const self = this;
            self.getBuildTable();
        },
        bulrFocus(e) {
            e.target.blur();
        },
        //获取建筑表格
        getBuildTable(params) {
            //查询参数
            params = params || {
                buildingName: this.configBuildTable.query.buildingName,
                areaId: this.configBuildTable.query.areaId,
                pageNum: this.configBuildTable.pagination.currentPage,
                pageSize: this.configBuildTable.pagination.pageSize
            }
            this.$axios.post('/itsm/system/config/building/queryBuildingPage', params).then((res) => {
                if (res.status==200){
                    if(res.data){
                        this.configBuildTable.data = res.data.list;
                        this.configBuildTable.pagination.total = res.data.total;
                    }else{
                        this.configBuildTable.data = [];
                        this.configBuildTable.pagination.total = 0;
                    }
                } else {
                    this.$message(res.message);
                }
            });
        },
        //查询请求
        queryBuildTable(){
            this.configBuildTable.pagination.currentPage = 1;
            this.configBuildTable.query = this.$ies.deepCopy(this.configBuildTable.message);
            this.getBuildTable();     
        },
        // 重置函数
        resetTable(){
            this.configBuildTable.message = {
                buildingName: '',
                areaId:'',
                areaName: '',
            };
            this.configBuildTable.query = {
                buildingName: '',
                areaId:'',
                areaName: '',
            };
        },
        //重新刷新数据
        refushHandler(pageNum){
            //重置查询条件
            this.resetTable();
            this.configAreaDialog.selectId = '';
            //重置pagination
            if(pageNum){
                this.configBuildTable.pagination.currentPage = pageNum;
            }
            
            //重新请求分类表格数据
            // var params = {
            //     buildingName: this.configBuildTable.query.buildingName,
            //     areaId: this.configBuildTable.query.areaId,
            //     pageNum: this.configBuildTable.pagination.currentPage,
            //     pageSize: this.configBuildTable.pagination.pageSize
            // }
            this.getBuildTable();
        },

        handleSelectionChange(v) {
            const self = this;

            self.configBuildTable.selected = v.map(v => v.id);
        },
        //sizeChange事件
        sizeChange(size) {
            this.configBuildTable.pagination.pageSize = size;
            this.getBuildTable()
        },
        //currentChange是将
        currentChange(currentPage) {
            this.configBuildTable.pagination.currentPage = currentPage;
            this.getBuildTable()
        },  
        /******************所属区域弹框************************/
        // 打开所属区域弹窗
        openAreaDialog(v) {
            this.configAreaDialog.type = v;
            if(v=='query'){
                this.configAreaDialog.selectId = this.configBuildTable.message.areaId;
            } else {
                this.configAreaDialog.selectId = this.addAndEditForm.params.areaId;
            }
            this.configAreaDialog.show = true;
        },
        areaChooseHandler(node) {
            if (this.configAreaDialog.type=='query') {
                this.configBuildTable.message.areaId = node.id;
                this.configBuildTable.message.areaName = node.areaName;
            } else {
                this.addAndEditForm.params.areaId = node.id;
                this.addAndEditForm.params.areaName = node.areaName;
            }
        },

        /****************新增或编辑弹窗******************/
        //打开新增编辑弹窗
        openAddEditDialog(type,row) {
            this.addAndEditForm.type = type;

            // 判断是新增还是编辑
            this.addAndEditForm.title = type=='add'?'新增建筑':'编辑建筑';
            if(type=='edit'){
                this.addAndEditForm.params.id = row.id;
                this.addAndEditForm.params.buildingName = row.buildingName;
                this.addAndEditForm.params.areaName = row.areaName||'';
                this.addAndEditForm.params.areaId = row.areaId||'';
                this.addAndEditForm.params.buildingAddress = row.buildingAddress;
            }
            this.addAndEditForm.visible = true;
        },
        //保存编辑新增弹框
        saveAddAndEdit() {
            //判断验证是否通过
            this.$refs['addAndEditFormId'].validate((valid) => {
                if(valid){
                    //判断是新增还是编辑进行保存
                    this.addAndEditForm.type == 'add'?this.buildAddHandler():this.buildEditHandler();
                }
            })
        },
        
        /***********新增建筑**********/
        buildAddHandler(){
            var params = {
                buildingName: this.addAndEditForm.params.buildingName,
                areaId: this.addAndEditForm.params.areaId,
                buildingAddress: this.addAndEditForm.params.buildingAddress
            }
            this.$axios.post('/itsm/system/config/building/saveBuilding', params).then((res) => {
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
        /***********删除建筑**********/
        deleteBuildHandler() {
            var self = this;
            if (this.configBuildTable.selected.length == 0) {
                this.$message.warning('请选择要删除的建筑')
            } else {
                this.$confirm('是否删除选中建筑?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get('/itsm/system/config/building/deleteBuilding', {params:{ids:this.configBuildTable.selected}}).then((res) => {
                        if (res.status==200){
                            this.$message({
                                message:res.message,
                                type:'success'
                            })
                            this.refushHandler(1);
                        } else {
                            this.$message({
                                message:res.message,
                                type:'error'
                            });
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');          
                });
            }
        },

        /***********编辑建筑**********/
        buildEditHandler(){
            var params = {
                id: this.addAndEditForm.params.id,
                buildingName: this.addAndEditForm.params.buildingName,
                areaId: this.addAndEditForm.params.areaId,
                buildingAddress: this.addAndEditForm.params.buildingAddress
            }
            this.$axios.post('/itsm/system/config/building/updateBuilding', params).then((res) => {
                if (res.status==200){
                    //关闭弹框
                    this.addAndEditForm.visible = false;
                    this.$message.success(res.message);
                    this.refushHandler();
                } else {
                    this.$message.error(res.message);
                }
            });
        },

        
        // 重置新增或编辑表单
        reset(ref){
            this.$refs[ref].resetFields();
            //手动清空数据
            this.addAndEditForm.params={
                id:'',
                buildingName:'',
                areaId:'',
                areaName:'',
                buildingAddress:''
            }
        },


        // 打开选择库房管理员弹窗
        openUserDialog() {
            this.configUserDialog.show = true;
        }
	},
}
</script>
