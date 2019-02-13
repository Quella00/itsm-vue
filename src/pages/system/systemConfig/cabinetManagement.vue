<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">
            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="configCabinetTable.message" class="search-conditions" label-width="110px">
                        <el-form-item label="机柜名称：">
                            <el-input placeholder="请输入机柜名称" v-model="configCabinetTable.message.cabinetName"></el-input>
                        </el-form-item>
                        <el-form-item label="所属机房：">
                            <el-input placeholder="请输入机房名称" v-model="configCabinetTable.message.machineRoomName"></el-input>
                        </el-form-item>
                        <el-form-item label="机柜编号：">
                            <el-input placeholder="请输入机柜编号" v-model="configCabinetTable.message.cabinetNumber"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <el-button type="primary" icon="el-icon-my-delete" size="normal" @click="deleteCabinetHandler">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetTable">重置</el-button>
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryCabinetTable">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="openAddEditDialog('add')">新增</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="configCabinetTable.data" @selection-change="selectionChange" stripe>
                        <el-table-column type="selection" width="55" align="center"></el-table-column>

                        <el-table-column prop="cabinetName" show-overflow-tooltip label="机柜名称"></el-table-column>

                        <el-table-column prop="machineRoomName" show-overflow-tooltip label="所属机房">
                            <template slot-scope="scope">
                                {{scope.row.machineRoomStatus==0?scope.row.machineRoomName:''}}
                            </template>
                        </el-table-column>

                        <el-table-column prop="cabinetNumber" show-overflow-tooltip label="机柜编号"></el-table-column>

                        <el-table-column prop="cabinetType" show-overflow-tooltip label="型号" ></el-table-column>

                        <el-table-column prop="cabinetLength" show-overflow-tooltip label="长度(mm)" ></el-table-column>

                        <el-table-column prop="cabinetWidth" show-overflow-tooltip label="宽度(mm)" ></el-table-column>

                        <el-table-column prop="cabinetHeight" show-overflow-tooltip label="高度(mm)" ></el-table-column>

                        <el-table-column prop="uCount" show-overflow-tooltip label="U位数(U)" ></el-table-column>

                        <el-table-column prop="rowLocation" show-overflow-tooltip label="行位置(行)" ></el-table-column>

                        <el-table-column prop="columnLocation" show-overflow-tooltip label="列位置(列)" ></el-table-column>

                        <el-table-column label="操作"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddEditDialog('edit',scope.row)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer" style="text-align: right;">
                    <!--面板底部-->
                    <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page.sync="configCabinetTable.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
                        :page-size="configCabinetTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total.sync="configCabinetTable.pagination.total"></el-pagination>
                </div>
            </div>

        </div>
        <!-- 所属机柜弹框 -->
        <iesMachineDialog v-model="configMachineDialog.visible" v-if="configMachineDialog.visible" :defaultSelect="configMachineDialog.defaultSelect" @machineChooseHandler="machineChooseHandler" ></iesMachineDialog>
        <!-- 新增and编辑弹框 -->
        <el-dialog :visible.sync="addAndEditForm.visible" :close-on-click-modal='false' custom-class="cabinetDialogStyle" @close="reset('addAndEditFormId')" v-drag>
            <span slot="title" style="color:#666666;">{{addAndEditForm.title}}</span>

            <el-form :model="addAndEditForm.params" :rules="addAndEditForm.rules" :inline="true" ref="addAndEditFormId" label-width="120px"
 class="demo-ruleForm">
                <el-form-item label="机柜名称" show-overflow-tooltip prop="cabinetName">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetName" placeholder="请输入机柜名称" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>
                <el-form-item label="所属机房"  prop="machineRoomName">
                    <el-input @focus="bulrFocus" placeholder="请选择所属机房" v-model="addAndEditForm.params.machineRoomName" auto-complete="off" class="resetStyle" readonly></el-input>
                    <i class="el-icon-my-more"  @click="openMachineDialog()" ></i>
                </el-form-item>

                <el-form-item label="机柜编号"  prop="cabinetNumber" >
                    <el-input type="text" :disabled="addAndEditForm.type=='edit'" v-model="addAndEditForm.params.cabinetNumber" placeholder="请输入机柜编号" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="型号"  prop="cabinetType">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetType" placeholder="请输入型号" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="长度(mm)"  prop="cabinetLength">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetLength" placeholder="请输入长度(mm)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="宽度(mm)"  prop="cabinetWidth">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetWidth" placeholder="请输入宽度(mm)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="高度(mm)" prop="cabinetHeight">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetHeight" placeholder="请输入高度(mm)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="U位数(U)" prop="uCount">
                    <el-input type="text" v-model="addAndEditForm.params.uCount" placeholder="请输入U位数(U)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="行位置(行)" prop="rowLocation">
                    <el-input type="text" v-model="addAndEditForm.params.rowLocation" placeholder="请输入机柜行(行)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="列位置(列)" prop="columnLocation">
                    <el-input type="text" v-model="addAndEditForm.params.columnLocation" placeholder="请输入机柜列(列)" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer" style="width:100%; position:absolute; bottom:15px; right:15px;">
                <el-button type="primary" size='normal' @click="saveAddAndEdit">保&nbsp;存</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        name: 'cabinetManagement',
        data() {
            const self = this;
            let validator = this.$ies.validator;
            return {
                // 机柜表格配置
                configCabinetTable: {
                    selection:[],
                    message: {
                        cabinetName: '',
                        machineRoomName: '',
                        cabinetNumber: ''
                    },
                    query: {
                        cabinetName: '',
                        machineRoomName: '',
                        cabinetNumber: ''
                    },
                    data: [],
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
                        cabinetName:'',
                        machineRoomId:'',
                        machineRoomName:'',
                        cabinetNumber:'',
                        cabinetType:'',
                        cabinetLength:'',
                        cabinetWidth:'',
                        cabinetHeight:'',
                        uCount:'',
                        rowLocation:'',
                        columnLocation:''
                    },
                    rules:{
                        cabinetName: [
                            { required: true, message: '请输入机柜名称', trigger: 'blur' },
                            { validator: validator.name, trigger: 'blur' }
                        ],
                        machineRoomName: [
                            { required: true, message: '请选择所属机房', trigger: 'change' },
                        ],
                        cabinetNumber: [
                            { required: true, message: '请输入机柜编号', trigger: 'blur' },
                            { validator: validator.number, trigger: 'blur' },
                        ],
                        cabinetType: [
                            { validator: validator.space, options:{min:1, max:32},  trigger: 'blur' },
                            { validator: validator.type, trigger: 'blur' },
                        ],
                        cabinetLength: [
                            { validator: validator.space, options:{min:0, max:4}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' },
                        ],
                        cabinetWidth: [
                            { validator: validator.space, options:{min:0, max:4}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' },
                        ],
                        cabinetHeight: [
                            { validator: validator.space, options:{min:0, max:4}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' },
                        ],
                        uCount: [
                            { validator: validator.space, options:{min:0, max:2}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' }
                        ],
                        rowLocation: [
                            { validator: validator.space, options:{min:0, max:3}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' }
                        ],
                        columnLocation: [
                            { validator: validator.space, options:{min:0, max:3}, trigger: 'blur' },
                            { validator: validator.num, trigger: 'blur' }
                        ]
                    }
                },
                configMachineDialog:{
                    visible:false,
                    type:'',
                    selectRow:'',
                    defaultSelect:''
                }
            };
        },
        mounted() {
            this.$nextTick(function(){
                this.init();
            })
        },
        methods: {
            init() {
                const self = this;

                self.getCabinetTable();
            },
            bulrFocus(e) {
                e.target.blur();
            },
            //获取分类表格
            getCabinetTable() {
                //表格内容
                var params = {
                    cabinetName: this.configCabinetTable.query.cabinetName,
                    machineRoomName: this.configCabinetTable.query.machineRoomName,
                    cabinetNumber: this.configCabinetTable.query.cabinetNumber,
                    pageNum: this.configCabinetTable.pagination.currentPage,
                    pageSize: this.configCabinetTable.pagination.pageSize
                }
                this.getCabinetTableData(params);
            },
            //请求表格数据
            getCabinetTableData(params){
                this.$axios.post('/itsm/system/config/cabinet/queryCabinet', params).then((res) => {
                    if (res.status==200){
                        if(res.data){
                            this.configCabinetTable.data = res.data.list;
                            this.configCabinetTable.pagination.total = res.data.total;
                        } else {
                            this.configCabinetTable.data = [];
                            this.configCabinetTable.pagination.total = 0;
                            this.configCabinetTable.pagination.currentPage = 1;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            queryCabinetTable(){
                this.configCabinetTable.pagination.currentPage = 1;

                this.configCabinetTable.query = this.$ies.deepCopy(this.configCabinetTable.message);

                this.getCabinetTable();
            },
            // 重置查询
            // 重新刷新数据
            resetTable(){
                this.configCabinetTable.message = {
                    cabinetName: '',
                    machineRoomName: '',
                    cabinetNumber: ''
                };
                this.configCabinetTable.query = {
                    cabinetName: '',
                    machineRoomName: '',
                    cabinetNumber: ''
                };
            },
            refushHandler(pageNum){
                // 重置查询条件
                this.resetTable();
                //重置pagination
                if(pageNum){
                    this.configCabinetTable.pagination.currentPage = pageNum;
                }
                
                //重新请求分类表格数据
                var params = {
                    cabinetName: this.configCabinetTable.query.cabinetName,
                    machineRoomName: this.configCabinetTable.query.machineRoomName,
                    cabinetNumber: this.configCabinetTable.query.cabinetNumber,
                    pageNum: this.configCabinetTable.pagination.currentPage,
                    pageSize: this.configCabinetTable.pagination.pageSize
                }
                this.getCabinetTableData(params);
            },

            /******************所属机柜弹框************************/
            // 打开所属区域弹窗
            openMachineDialog() {

                this.configMachineDialog.defaultSelect = this.addAndEditForm.params.machineRoomId;

                this.configMachineDialog.visible = true;
            },
            machineChooseHandler(row) {
                this.configMachineDialog.selectRow = row;
                
                this.addAndEditForm.params.machineRoomId = row.id,this.addAndEditForm.params.machineRoomName = row.machineRoomName;
            },

            /****************新增或编辑弹窗******************/
            //打开新增编辑弹窗
            openAddEditDialog(type,row) {
                this.addAndEditForm.type = type;
                this.addAndEditForm.visible = true;

                // 判断是新增还是编辑
                this.addAndEditForm.title = type=='add'?'新增机柜':'编辑机柜';
                if(type=='edit'){
                    this.addAndEditForm.params = {
                        id:row.id,
                        cabinetName:row.cabinetName,
                        machineRoomId:row.machineRoomStatus==0?row.machineRoomId:'',
                        machineRoomName:row.machineRoomStatus==0?row.machineRoomName:'',
                        cabinetNumber:row.cabinetNumber,
                        cabinetType:row.cabinetType,
                        cabinetLength:row.cabinetLength,
                        cabinetWidth:row.cabinetWidth,
                        cabinetHeight:row.cabinetHeight,
                        uCount:row.uCount,
                        rowLocation:row.rowLocation,
                        columnLocation:row.columnLocation
                    }
                    
                }
                this.addAndEditForm.visible = true;
            },
            //保存编辑新增弹框
            saveAddAndEdit() {
                //判断验证是否通过
                this.$refs['addAndEditFormId'].validate((valid) => {
                    if(valid){
                        //判断是新增还是编辑进行保存
                        this.addAndEditForm.type == 'add'?this.cabinetAddHandler():this.cabinetEditHandler();
                    }
                })
            },

            /***********新增机柜**********/
            cabinetAddHandler(){
                var params = {
                    cabinetName: this.addAndEditForm.params.cabinetName,
                    machineRoomId: this.addAndEditForm.params.machineRoomId,
                    cabinetNumber: this.addAndEditForm.params.cabinetNumber,
                    cabinetType: this.addAndEditForm.params.cabinetType,
                    cabinetLength: this.addAndEditForm.params.cabinetLength,
                    cabinetWidth: this.addAndEditForm.params.cabinetWidth,
                    cabinetHeight: this.addAndEditForm.params.cabinetHeight,
                    uCount: this.addAndEditForm.params.uCount,
                    rowLocation: this.addAndEditForm.params.rowLocation,
                    columnLocation: this.addAndEditForm.params.columnLocation,
                }
                this.$axios.post('/itsm/system/config/cabinet/saveCabinet', params).then((res) => {
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
            deleteCabinetHandler() {
                var self = this;
                if (this.configCabinetTable.selection.length == 0) {
                    this.$message.warning('请选择要删除的机柜')
                } else {
                    this.$confirm('是否删除选中机柜?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.deleteHandler();
                    }).catch(() => {
                        this.$message.info('已取消删除');          
                    });
                }
            },
            //删除实体
            deleteHandler(){
                this.$axios.get('/itsm/system/config/cabinet/deleteCabinet', {params:{ids:this.configCabinetTable.selection}}).then((res) => {
                    if (res.status==200){
                        this.$message.success(res.message);
                        this.refushHandler(1);
                    } else {
                        this.$message.error(res.message);
                    }
                })
            },

            /***********编辑机柜**********/
            cabinetEditHandler(){
                var params = {
                    id: this.addAndEditForm.params.id,
                    cabinetName: this.addAndEditForm.params.cabinetName,
                    machineRoomId: this.addAndEditForm.params.machineRoomId,
                    cabinetType: this.addAndEditForm.params.cabinetType,
                    cabinetLength: this.addAndEditForm.params.cabinetLength,
                    cabinetWidth: this.addAndEditForm.params.cabinetWidth,
                    cabinetHeight: this.addAndEditForm.params.cabinetHeight,
                    uCount: this.addAndEditForm.params.uCount,
                    rowLocation: this.addAndEditForm.params.rowLocation,
                    columnLocation: this.addAndEditForm.params.columnLocation,
                }
                this.$axios.post('/itsm/system/config/cabinet/updateCabinet', params).then((res) => {
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
            

            // pageSize 改变时会触发
            sizeChange(v) {
                var params = {
                    cabinetName: this.configCabinetTable.query.cabinetName,
                    machineRoomName: this.configCabinetTable.query.machineRoomName,
                    cabinetNumber: this.configCabinetTable.query.cabinetNumber,
                    pageNum: this.configCabinetTable.pagination.currentPage,
                    pageSize: v
                }
                this.getCabinetTableData(params);
            },
            // currentPage 改变时会触发
            currentChange(v) {
                var params = {
                    cabinetName: this.configCabinetTable.query.cabinetName,
                    machineRoomName: this.configCabinetTable.query.machineRoomName,
                    cabinetNumber: this.configCabinetTable.query.cabinetNumber,
                    pageNum: v,
                    pageSize: this.configCabinetTable.pagination.pageSize
                }
                this.getCabinetTableData(params);
            },



            selectionChange(v) {
                const self = this;

                self.configCabinetTable.selection = v.map(v => v.id);
            },
            
            // 重置新增或编辑表单
            reset(ref){
                this.$refs[ref].resetFields();
                //手动清空数据
                this.addAndEditForm.params={
                    id:'',
                    cabinetName:'',
                    machineRoomId:'',
                    machineRoomName:'',
                    cabinetNumber:'',
                    cabinetType:'',
                    cabinetLength:'',
                    cabinetWidth:'',
                    cabinetHeight:'',
                    uCount:'',
                    rowLocation:'',
                    columnLocation:''
                }
            },
        }
    }

</script>

<style>
    .cabinetDialogStyle { width: 767px; height: 406px; }
    .cabinetDialogStyle .el-dialog__body{ height: 308px;padding-top: 35px; }
    .cabinetDialogStyle .resetStyle { width: 200px; height: 32px; line-height: 27px; }
    .cabinetDialogStyle .user .el-form-item__content { width: 535px; }
</style>
