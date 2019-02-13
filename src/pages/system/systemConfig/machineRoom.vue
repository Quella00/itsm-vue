<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">
            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="configMachineTable.message" class="search-conditions" label-width="110px">
                        <el-form-item label="机房名称：">
                            <el-input placeholder="请输入机房名称" v-model="configMachineTable.message.machineRoomName"></el-input>
                        </el-form-item>
                        <el-form-item label="所属区域：">
                            <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="configMachineTable.message.areaName" readonly></el-input>
                            <i class="el-icon-my-more" @click="openAreaDialog('query')" ></i>
                        </el-form-item>
                        <el-form-item label="所属建筑：">
                            <el-select @focus="bulrFocus" v-model="configMachineTable.message.buildingId" placeholder="请选择建筑" >
                                <el-option v-for="item in configMachineTable.message.buildingOptions" :key="item.buildingId" :value="item.buildingId" :label="item.buildingName"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="楼层号：">
                            <el-input placeholder="请输入楼层号" v-model="configMachineTable.message.floor" ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <el-button type="primary" icon="el-icon-my-delete" size="normal" @click="deleteMachineHandler">删除</el-button>
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetMachineTable">重置</el-button>
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryMachineTable">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="openAddEditDialog('add')">新增</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="configMachineTable.data" @selection-change="selectionChange" stripe>
                        <el-table-column type="selection" width="55" align="center"></el-table-column>

                        <el-table-column prop="machineRoomName" show-overflow-tooltip label="机房名称" ></el-table-column>

                        <el-table-column prop="areaName" show-overflow-tooltip label="所属区域"></el-table-column>

                        <el-table-column prop="buildingName" show-overflow-tooltip label="所属建筑"></el-table-column>

                        <el-table-column prop="floor" show-overflow-tooltip  label="楼层" ></el-table-column>

                        <el-table-column prop="roomNumber" show-overflow-tooltip label="房间号" ></el-table-column>

                        <el-table-column prop="cabinetRowCount" show-overflow-tooltip label="机柜行" ></el-table-column>

                        <el-table-column prop="cabinetColumnCount" show-overflow-tooltip label="机柜列" ></el-table-column>

                        <el-table-column label="操作"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddEditDialog('edit',scope.row)"> </i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer" style="text-align: right;">
                    <el-pagination :page-sizes="[10, 20, 30, 40]" :page-size="configMachineTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configMachineTable.pagination.total"
                        @size-change="sizeChange" @current-change="currentChange" :current-page="configMachineTable.pagination.currentPage"></el-pagination>
                </div>
            </div>
        </div>

        <!-- 所属区域弹窗 -->
        <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='configAreaDialog.selectId' ></iesAreaDialog>

        <!-- 新增和编辑弹窗 -->
        <el-dialog :visible.sync="addAndEditForm.visible" :close-on-click-modal='false' custom-class="machineDialogStyle" @close="reset('addAndEditFormId')" v-drag>
            <span slot="title" style="color:#666666;">{{addAndEditForm.title}}</span>

            <el-form :model="addAndEditForm.params" :rules="addAndEditForm.rules" :inline="true" ref="addAndEditFormId" label-width="120px" class="demo-ruleForm">
                <el-form-item label="机房名称" prop="machineRoomName">
                    <el-input type="text" v-model="addAndEditForm.params.machineRoomName" placeholder="请输入机房名称" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="所属区域" prop="areaName">
                    <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="addAndEditForm.params.areaName" auto-complete="off" class="resetStyle" readonly></el-input>
                    <i class="el-icon-my-more" v-if="addAndEditForm.type=='edit'" @click="openAreaDialog('edit')"></i>
                    <i class="el-icon-my-more" v-else  @click="openAreaDialog('add')"></i>
                </el-form-item>

                <el-form-item label="所属建筑" prop="buildingId">
                    <el-select @focus="bulrFocus" v-model="addAndEditForm.params.buildingId" placeholder="请选择所属建筑" class="resetStyle">
                        <el-option v-for="item in addAndEditForm.params.buildingOptions" :key="item.buildingId" :value="item.buildingId" :label="item.buildingName"></el-option>
                    </el-select>
                </el-form-item> 

                <el-form-item label="楼层" prop="floor">
                    <el-input type="text" v-model="addAndEditForm.params.floor" placeholder="请输入楼层" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="房间号" prop="roomNumber">
                    <el-input type="text" v-model="addAndEditForm.params.roomNumber" placeholder="请输入房间号" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="机柜行" prop="cabinetRowCount">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetRowCount" placeholder="请输入机柜行" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>

                <el-form-item label="机柜列" prop="cabinetColumnCount">
                    <el-input type="text" v-model="addAndEditForm.params.cabinetColumnCount" placeholder="请输入机柜列" auto-complete="off" class="resetStyle"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer" style="width:100%; position:absolute; bottom:15px; right:15px;">
                <el-button type="primary" size="normal" @click="saveAddAndEdit">保&nbsp;存</el-button>
            </span>
        </el-dialog>

    </div>

</template>

<script>
export default {
    name: 'machineRoom',
	data() {
        const self = this;
        let validator = this.$ies.validator;
		return {
            //机房表格配置
            configMachineTable: {
                message: {
                    machineRoomName: '',
                    areaId:'',
                    areaName: '',
                    buildingId: '',
                    buildingOptions: [],
                    floor:''
                },
                query: {
                    machineRoomName: '',
                    areaId:'',
                    areaName: '',
                    buildingId: '',
                    buildingOptions: [],
                    floor:''
                },
                data: [],
                selected:[],
                pagination: {
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                }
            },
            // 所属区域弹窗配置
            configAreaDialog: {
                show: false,     // 弹窗的显示/隐藏
                type: '',
                selectId: '',    // 选中的区域节点id  
            },
            // 新增和编辑弹窗配置
            addAndEditForm:{
                title:'',
                visible:false,
                params:{
                    id:'',
                    machineRoomName:'',
                    buildingId:'',
                    buildingOptions:[],
                    areaId:'',
                    areaName:'',
                    floor:'',
                    roomNumber:'',
                    cabinetRowCount:'',
                    cabinetColumnCount:''
                },
                rules:{
                    machineRoomName: [
                        { required: true, message: '请输入机房名称', trigger: 'blur' },
                        { validator:validator.name, trigger: 'blur' }
                    ],
                    areaName: [
                        { required: true, message: '请选择所属区域', trigger: 'change' }
                    ],
                    buildingId: [
                        { required: true, type:'number', message: '请选择所属建筑', trigger: 'change' }
                    ],
                    floor: [
                        { validator: validator.space, options:{min:0, max:6}, trigger: 'blur' },
                        { validator: validator.floorAndRoomNumber, trigger: 'blur' }
                    ],
                    roomNumber: [
                        { validator: validator.space, options:{min:0, max:6}, trigger: 'blur' },
                        { validator: validator.floorAndRoomNumber, trigger: 'blur' }
                    ],
                    cabinetRowCount: [
                        { validator: validator.space, options:{min:1, max:2}, trigger: 'blur' },
                        { validator: validator.num, trigger: 'blur' }
                    ],
                    cabinetColumnCount: [
                        { validator: validator.space, options:{min:0, max:2}, trigger: 'blur' },
                        { validator: validator.num, trigger: 'blur' }
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

            self.getMachineTable();
        },
        bulrFocus(e) {
            e.target.blur();
        },
        selectionChange(v) {
            const self = this;

            self.configMachineTable.selected = v.map(v => v.id);
        },
        //获取分类表格
        getMachineTable(params) {
            //查询参数
            params = params || {
                machineRoomName: this.configMachineTable.query.machineRoomName,
                areaId: this.configMachineTable.query.areaId,
                buildingId: this.configMachineTable.query.buildingId,
                floor: this.configMachineTable.query.floor,
                pageNum: this.configMachineTable.pagination.currentPage,
                pageSize: this.configMachineTable.pagination.pageSize
            }
            this.$axios.post('/itsm/system/config/machineRoom/queryMachineRoomPage', params).then((res) => {
                if (res.status==200){
                    if(res.data){
                        this.configMachineTable.data = res.data.list;
                        this.configMachineTable.pagination.total = res.data.total;
                    }else{
                        this.configMachineTable.data = [];
                        this.configMachineTable.pagination.total = 0;
                    }
                } else {
                    this.$message(res.message);
                }
            });
        },
        queryMachineTable(){
            this.configMachineTable.pagination.currentPage = 1;
            this.configMachineTable.query = this.$ies.deepCopy(this.configMachineTable.message);

            this.getMachineTable();
        },
        resetMachineTable(){
            this.configMachineTable.message = {
                machineRoomName: '',
                areaName: '',
                areaId:'',
                buildingId: '',
                buildingOptions: [],
                floor:''
            };
            this.configMachineTable.query = {
                machineRoomName: '',
                areaName: '',
                areaId:'',
                buildingId: '',
                buildingOptions: [],
                floor:''
            };
        },
        //重新刷新数据
        refushHandler(pageNum){
            //重置查询条件
            this.configMachineTable.message = {
                machineRoomName: '',
                areaName: '',
                areaId:'',
                buildingId: '',
                buildingOptions: [],
                floor:''
            };
            this.configMachineTable.query = {
                machineRoomName: '',
                areaName: '',
                areaId:'',
                buildingId: '',
                buildingOptions: [],
                floor:''
            };
            this.configAreaDialog.selectId = null;
            //重置pagination
            if(pageNum){
                this.configMachineTable.pagination.currentPage = pageNum;
            }
            //重新请求分类表格数据
            // var params = {
            //     machineRoomName: this.configMachineTable.query.buildingName,
            //     areaId: this.configMachineTable.query.areaId,
            //     buildingId: this.configMachineTable.query.buildingId,
            //     floor: this.configMachineTable.query.floor,
            //     pageNum: this.configMachineTable.pagination.currentPage,
            //     pageSize: this.configMachineTable.pagination.pageSize
            // }
            this.getMachineTable();
        },


        /******************所属区域弹框************************/
        // 打开所属区域弹窗
        openAreaDialog(v) {
            this.configAreaDialog.type = v;
            
            if (this.configAreaDialog.type == 'query'){
                this.configAreaDialog.selectId = this.configMachineTable.message.areaId;
            } else {
                this.configAreaDialog.selectId = this.addAndEditForm.params.areaId;
            }

            this.configAreaDialog.show = true;
        },
        areaChooseHandler(node) {
            if (this.configAreaDialog.type == 'query'){
                this.configMachineTable.message.areaId = node.id;
                this.configMachineTable.message.areaName = node.areaName;
                this.getBuildingByAreaId(this.configMachineTable.message.areaId);
            } else {
                this.addAndEditForm.params.areaId = node.id;
                this.addAndEditForm.params.areaName = node.areaName;
                this.getBuildingByAreaId(this.addAndEditForm.params.areaId);
            }
        },
        //获取所属建筑
        getBuildingByAreaId(id,building){
            this.$axios.post('/itsm/system/config/building/queryBuildingByAreaId?areaId='+id).then((res) => {
                if (res.status==200){
                    if(this.configAreaDialog.type == 'query'){
                        this.configMachineTable.message.buildingId = building||'';
                        this.configMachineTable.message.buildingOptions = res.data;
                    }else{
                        this.addAndEditForm.params.buildingId = building||'';
                        this.addAndEditForm.params.buildingOptions = res.data;
                    }
                } else {
                    this.$message(res.message);
                }
            });
        },

        sizeChange(v) {
            this.configMachineTable.pagination.pageSize = v;
            this.getMachineTable();
        },
        currentChange(v) {
            this.configMachineTable.pagination.currentPage = v;
            this.getMachineTable();
        },
        
        
        /****************新增或编辑弹窗******************/
        //打开新增编辑弹窗
        openAddEditDialog(type,row) {
            this.addAndEditForm.type = type;

            // 判断是新增还是编辑
            this.addAndEditForm.title = type=='add'?'新增机房':'编辑机房';
            this.configAreaDialog.type = type;
            if(type=='edit'){
                this.addAndEditForm.params.id = row.id;
                this.addAndEditForm.params.machineRoomName = row.machineRoomName;
                this.addAndEditForm.params.buildingId = row.buildingId||'';
                this.addAndEditForm.params.areaId = row.areaId||'';
                this.addAndEditForm.params.areaName = row.areaName||'';
                if(row.buildingName){
                    this.getBuildingByAreaId(row.areaId,row.buildingId);
                }else{
                    this.getBuildingByAreaId(row.areaId);
                }
                this.addAndEditForm.params.floor = row.floor;
                this.addAndEditForm.params.roomNumber = row.roomNumber;
                this.addAndEditForm.params.cabinetRowCount = row.cabinetRowCount;
                this.addAndEditForm.params.cabinetColumnCount = row.cabinetColumnCount;
            }
            this.addAndEditForm.visible = true;
        },
        //保存编辑新增弹框
        saveAddAndEdit() {
            //判断验证是否通过
            this.$refs['addAndEditFormId'].validate((valid) => {
                if(valid){
                    //判断是新增还是编辑进行保存
                    this.addAndEditForm.type == 'add'?this.machineAddHandler():this.machineEditHandler();
                }
            })
        },

        /***********新增机房**********/
        machineAddHandler(){
            var params = {
                machineRoomName: this.addAndEditForm.params.machineRoomName,
                areaId: this.addAndEditForm.params.areaId,
                buildingId: this.addAndEditForm.params.buildingId,
                floor: this.addAndEditForm.params.floor,
                roomNumber: this.addAndEditForm.params.roomNumber,
                cabinetRowCount: this.addAndEditForm.params.cabinetRowCount,
                cabinetColumnCount : this.addAndEditForm.params.cabinetColumnCount
            }
            this.$axios.post('/itsm/system/config/machineRoom/saveMachineRoom', params).then((res) => {
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
        deleteMachineHandler() {
            var self = this;
            if (this.configMachineTable.selected.length == 0) {
                this.$message.warning('请选择要删除的机房');
            } else {
                this.$confirm('是否删除选中机房?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get('/itsm/system/config/machineRoom/deleteMachineRoom', {params:{ids:this.configMachineTable.selected}}).then((res) => {
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

        /***********编辑机房**********/
        machineEditHandler(){
            var params = {
                id: this.addAndEditForm.params.id,
                machineRoomName: this.addAndEditForm.params.machineRoomName,
                areaId: this.addAndEditForm.params.areaId,
                buildingId: this.addAndEditForm.params.buildingId,
                floor: this.addAndEditForm.params.floor,
                roomNumber: this.addAndEditForm.params.roomNumber,
                cabinetRowCount: this.addAndEditForm.params.cabinetRowCount,
                cabinetColumnCount : this.addAndEditForm.params.cabinetColumnCount
            }
            this.$axios.post('/itsm/system/config/machineRoom/updateMachineRoom', params).then((res) => {
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
        // 重置新增或编辑表单
        reset(ref){
            this.$refs[ref].resetFields();
            //手动清空数据
            this.addAndEditForm.params={
                id:'',
                machineRoomName:'',
                buildingId:'',
                buildingOptions:[],
                areaId:'',
                areaName:'',
                floor:'',
                roomNumber:'',
                cabinetRowCount:'',
                cabinetColumnCount:''
            }
        },
	},
}
</script>

