<template>
    <div class="itsm-tabs-main storage-room-page">

        <div class="tabs-main">
            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="configStorageTable.message" class="search-conditions" label-width="110px">
                        <el-form-item label="库房名称：">
                            <el-input placeholder="请输入库房名称" v-model="configStorageTable.message.storeRoomName"></el-input>
                        </el-form-item>
                        <el-form-item label="库房类型：">
                            <el-select @focus="bulrFocus" placeholder="请选择库房类型" v-model="configStorageTable.message.storeRoomType" >
                                <el-option key="" value="" label="全部"></el-option>
                                <el-option v-for="item in storeRoomTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属区域：">
                            <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="configStorageTable.message.areaName" readonly></el-input>
                            <i class="el-icon-my-more" @click="openAreaDialog('query')"></i>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border table-area" v-autoHeight>
                <div class="panel-header">
                    <div class="fl">
                        <el-button type="primary" icon="el-icon-my-delete" size="normal" @click="deleteStorageHandler">删除</el-button>
                    </div>
                    <div class="fr">
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetTable">重置</el-button>
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryStorageTable">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="openAddEditDialog('add')">新增</el-button>
                    </div>
                </div>

                <div class="panel-body main">
                    <el-table :data="configStorageTable.data" @selection-change="handleSelectionChange" stripe>
                        <el-table-column type="selection" width="55" align="center"></el-table-column>

                        <el-table-column prop="storeRoomName" show-overflow-tooltip label="库房名称" width="180"></el-table-column>

                        <el-table-column prop="storeRoomType" show-overflow-tooltip label="库房类型">
                            <template slot-scope="scope">
                                {{scope.row.storeRoomType==1?'通用库房':scope.row.storeRoomType==2?'专用库房':'中转库房'}}
                            </template>
                        </el-table-column>

                        <el-table-column prop="areaName" show-overflow-tooltip label="所属区域"></el-table-column>

                        <el-table-column prop="buildingName" show-overflow-tooltip label="所属建筑"></el-table-column>

                        <el-table-column label="操作"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openAddEditDialog('edit',scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer footer">
                    <el-pagination @size-change="sizeChange" @current-change="currentChange" :page-sizes="[10, 20, 30, 40]" :current-page="configStorageTable.pagination.currentPage"
                        :page-size="configStorageTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="configStorageTable.pagination.total"></el-pagination>
                </div>
            </div>

            <!-- 所属区域弹窗 -->
            <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='configAreaDialog.selectId'></iesAreaDialog>

            <!-- 选择人员弹窗 -->
            <iesPersonCheckDialog v-model="configUserDialog.show" v-if="configUserDialog.show" :defaultSelect="configUserDialog.defaultSelect" @selectPersonCheckboxHandler="saveUserDialog"></iesPersonCheckDialog>

            <!-- 新增和编辑弹窗 -->
            <el-dialog :visible.sync="addAndEditForm.show" :close-on-click-modal='false' custom-class="add-edit-dialog-style" @close="reset" v-drag>
                <span slot="title" style="color:#666666;">{{addAndEditForm.title}}</span>

                <div class="content">
                    <el-form :model="addAndEditForm.params" :rules="addAndEditForm.rules" :inline="true" ref="addAndEditFormId" label-width="120px"
                        class="demo-ruleForm">
                        <el-form-item label="库房名称" prop="storeRoomName">
                            <el-input type="text" v-model="addAndEditForm.params.storeRoomName" placeholder="请输入库房名称" auto-complete="off" 
                                class="reset-style"></el-input>
                        </el-form-item>

                        <el-form-item label="库房编号" prop="storeRoomNumber">
                            <el-input type="text" :disabled="addAndEditForm.type=='edit'" v-model="addAndEditForm.params.storeRoomNumber" placeholder="请输入库房编号" auto-complete="off" class="reset-style"></el-input>
                        </el-form-item>

                        <el-form-item label="库房类型" prop="storeRoomType">
                            <el-select @focus="bulrFocus" v-model="addAndEditForm.params.storeRoomType" placeholder="请选择库房类型"  class="reset-style">
                                <el-option v-for="item in storeRoomTypeOptions" :label="item.label" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="所属区域" prop="areaName">
                            <el-input @focus="bulrFocus" v-model="addAndEditForm.params.areaName" placeholder="请选择所属区域"  class="reset-style" readonly></el-input>
                            <i class="el-icon-my-more" @click="openAreaDialog('edit')"></i>
                        </el-form-item>

                        <el-form-item label="所属建筑" prop="buildingId">
                            <el-select @focus="bulrFocus" v-model="addAndEditForm.params.buildingId" placeholder="请选择所属建筑"  class="reset-style">
                                <el-option v-for="item in addAndEditForm.params.buildingOptions" :label="item.buildingName" :value="item.buildingId" :key="item.buildingId"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="楼层" prop="floor">
                            <el-input type="text" v-model="addAndEditForm.params.floor" placeholder="请输入楼层" auto-complete="off" class="reset-style"></el-input>
                        </el-form-item>

                        <el-form-item label="房间号" prop="roomNumber">
                            <el-input type="text" v-model="addAndEditForm.params.roomNumber" placeholder="请输入房间号" auto-complete="off" class="reset-style"></el-input>
                        </el-form-item>

                        <el-form-item label="库房管理员" class="user" prop="userNameList">
                            <el-input @focus="bulrFocus" placeholder="请选择库房管理员" v-model="addAndEditForm.params.userNameList" auto-complete="off" class="reset-style" 
                                readonly style="width: 100%;"></el-input>
                            <i class="el-icon-my-more" @click="openUserDialog(addAndEditForm.params.user)"></i>
                        </el-form-item>
                    </el-form>
                </div>

                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" size="normal" @click="saveAddAndEdit">保&nbsp;存</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'storageRoom',
        data() {
            const self = this;
            let validator = this.$ies.validator;
            return {
                //库房类型配置
                storeRoomTypeOptions: [
                    { value: 1, label: '通用库房' },
                    { value: 2, label: '专用库房' },
                    { value: 3, label: '中转库房' }
                ],
                //库房表格配置
                configStorageTable: {
                    message: {
                        storeRoomName: '',
                        storeRoomType: '',
                        areaId: '',
                        areaName: ''
                    },
                    query: {
                        storeRoomName: '',
                        storeRoomType: '',
                        areaId: '',
                        areaName: ''
                    },
                    data: [],
                    selection: "",
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                },
                // 所属区域弹窗配置
                configAreaDialog: {
                    show: false,     // 弹窗的显示/隐藏
                    type: "",   // 区域类型
                    selectId: '',    // 选中的区域 id
                },
                // 选择人员弹框配置
                configUserDialog: {
                    show: false,     // 弹窗的显示/隐藏
                    defaultSelect: {
                        selected:[]
                    }
                },
                // 新增和编辑弹窗配置
                addAndEditForm: {
                    title: '',
                    type: '',
                    show: false,    // 弹窗的显示/隐藏
                    params: {       // 数据列表字段
                        id: '',
                        storeRoomName: '',
                        storeRoomNumber: '',
                        storeRoomType: '',
                        areaId: '',
                        areaName: '',
                        buildingId: '',
                        buildingOptions: '',
                        floor: '',
                        roomNumber: '',
                        user:'',
                        userIdList: '',
                        userNameList: ''
                    },
                    rules: {       // 数据列表字段的验证规则
                        storeRoomName: [
                            { required: true, message: '请输入库房名称', trigger: 'blur' },
                            { validator: validator.name, trigger: 'blur' },
                        ],
                        storeRoomNumber: [
                            { required: true, message: '请输入库房编号', trigger: 'blur' },
                            { validator: validator.number, trigger: 'blur' },
                        ],
                        storeRoomType: [
                            { required: true, type: 'number', message: '请选择库房类型', trigger: 'change' }
                        ],
                        areaName: [
                            { required: true,  message: '请选择所属区域', trigger: 'change' }
                        ],
                        buildingId: [
                            { required: true, type: 'number', message: '请选择所属建筑', trigger: 'change' }
                        ],
                        floor: [
                            { validator: validator.space, options: { min: 0, max: 6 }, trigger: 'blur' },
                            { validator: validator.floorAndRoomNumber, trigger: 'blur' }
                        ],
                        roomNumber: [
                            { validator: validator.space, options: { min: 0, max: 6 }, trigger: 'blur' },
                            { validator: validator.floorAndRoomNumber, trigger: 'blur' }
                        ],
                        userNameList: [
                            { required: true, message: '请选择库房管理员', trigger: 'change' }
                        ]
                    }
                },
            };
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            })
        },
        methods: {
            init() {
                const self = this;

                self.getStorageTable();
            },
            bulrFocus(e) {
                e.target.blur();
            },
            getStorageTable(params) {
                params = params || {
                    storeRoomName: this.configStorageTable.query.storeRoomName,
                    storeRoomType: this.configStorageTable.query.storeRoomType,
                    areaId: this.configStorageTable.query.areaId,
                    pageNum: this.configStorageTable.pagination.currentPage,
                    pageSize: this.configStorageTable.pagination.pageSize
                };
                this.$axios.post('/itsm/system/config/storeRoom/queryStoreRoomPage', params).then((res) => {
                    if (res.status == 200) {
                        if (res.data) {
                            this.configStorageTable.data = res.data.list;
                            this.configStorageTable.pagination.total = res.data.total;
                        } else {
                            this.configStorageTable.data = [];
                            this.configStorageTable.pagination.total = 0;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            queryStorageTable() {
                this.configStorageTable.pagination.currentPage = 1;
                this.configStorageTable.query = this.$ies.deepCopy(this.configStorageTable.message);

                this.getStorageTable();
            },

            // pageSize 改变时会触发
            sizeChange(v) {
                this.configStorageTable.pagination.pageSize = v;
                this.getStorageTable();
            },
            // currentPage 改变时会触发
            currentChange(v) {
                this.configStorageTable.pagination.currentPage = v;
                this.getStorageTable();
            },

            /********************所属区域弹窗*********************/
            // 打开所属区域弹窗
            openAreaDialog(v) {
                this.configAreaDialog.type = v;

                if (v == 'query') {
                    this.configAreaDialog.selectId = this.configStorageTable.message.areaId;
                } else {
                    this.configAreaDialog.selectId = this.addAndEditForm.params.areaId;
                }

                this.configAreaDialog.show = true;
            },
            areaChooseHandler(node) {
                if (this.configAreaDialog.type == 'query') {
                    this.configStorageTable.message.areaId = node.id;
                    this.configStorageTable.message.areaName = node.areaName;
                } else {
                    this.addAndEditForm.params.areaId = node.id;
                    this.addAndEditForm.params.areaName = node.areaName;
                    this.getBuildingByAreaId(node.id);
                }
            },
            //获取所属建筑
            getBuildingByAreaId(id,building) {
                this.$axios.post('/itsm/system/config/building/queryBuildingByAreaId?areaId=' + id).then((res) => {
                    if (res.status == 200) {
                        if(this.configAreaDialog.type == 'query'){
                            this.configStorageTable.message.buildingName = building||'';
                            this.configStorageTable.message.buildingOptions = res.data;
                        }else{
                            this.addAndEditForm.params.buildingId = building||'';
                            this.addAndEditForm.params.buildingOptions = res.data;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },

            /********************选择人员弹窗*********************/
            // 打开选择库房管理员弹窗
            openUserDialog(v) {
                this.configUserDialog.show = true;
                this.configUserDialog.defaultSelect.selected = v || [];
            },
            // 保存选择库房管理员弹窗
            saveUserDialog(v) {
                
                var names = v.map(v => v.userName), ids = v.map(v => v.id);
                this.addAndEditForm.params.user = v;
                this.addAndEditForm.params.userIdList = ids.join(',');
                this.addAndEditForm.params.userNameList = names.join('、');
                this.configUserDialog.show = false;
            },

            /********************新增或编辑弹窗*********************/
            // 打开新增或编辑弹窗
            openAddEditDialog(v, row) {
                this.addAndEditForm.type = v;
                this.configAreaDialog.type = v;
                // 判断是新增还是编辑
                this.addAndEditForm.title = v == 'add' ? '新增库房' : '编辑库房';
                if (v == 'edit') {
                    this.addAndEditForm.params.id = row.id,
                    this.addAndEditForm.params.storeRoomName = row.storeRoomName,
                    this.addAndEditForm.params.storeRoomNumber = row.storeRoomNumber,
                    this.addAndEditForm.params.storeRoomType = row.storeRoomType,
                    this.addAndEditForm.params.areaId = row.areaId||'',
                    this.addAndEditForm.params.areaName = row.areaName||'',
                    this.addAndEditForm.params.floor = row.floor,
                    this.addAndEditForm.params.roomNumber = row.roomNumber
                    if(row.buildingName){
                        this.getBuildingByAreaId(row.areaId,row.buildingId);
                    }else{
                        this.getBuildingByAreaId(row.areaId);
                    }
                    
                    this.$axios.post('/itsm/system/config/storeRoom/queryStoreRoomUserDetails',{id: row.id}).then((res) => {
                        if (res.status == 200) {
                            let v = res.data;
                            var names = v.map(v => v.userName), ids = v.map(v => v.id);
                            this.addAndEditForm.params.user = v;
                            this.addAndEditForm.params.userIdList = ids.join(',');
                            this.addAndEditForm.params.userNameList = names.join('、');
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }

                this.addAndEditForm.show = true;
            },
            //保存编辑新增弹框
            saveAddAndEdit() {
                //判断验证是否通过
                this.$refs['addAndEditFormId'].validate((valid) => {
                    if (valid) {
                        //判断是新增还是编辑进行保存
                        this.addAndEditForm.type == 'add' ? this.storageAddHandler() : this.storageEditHandler();
                    }
                })
            },
            /***********新增库房**********/
            storageAddHandler() {
                var params = {
                    storeRoomName: this.addAndEditForm.params.storeRoomName,
                    storeRoomNumber: this.addAndEditForm.params.storeRoomNumber,
                    storeRoomType: this.addAndEditForm.params.storeRoomType,
                    areaId: this.addAndEditForm.params.areaId,
                    buildingId: this.addAndEditForm.params.buildingId,
                    floor: this.addAndEditForm.params.floor,
                    roomNumber: this.addAndEditForm.params.roomNumber,
                    userIdList: this.addAndEditForm.params.userIdList
                }
                this.$axios.post('/itsm/system/config/storeRoom/saveStoreRoom', params).then((res) => {
                    if (res.status == 200) {
                        //关闭弹框
                        this.addAndEditForm.show = false;
                        this.$message.success(res.message);
                        this.refushHandler(1);
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            /***********删除库房**********/
            deleteStorageHandler() {
                const self = this;

                if (!self.configStorageTable.selection.length) {
                    self.$message.warning('请选择要删除的库房');
                    return;
                }

                self.$confirm('是否删除选中库房?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.get('/itsm/system/config/storeRoom/deleteStoreRoom', { params: { ids: this.configStorageTable.selection } }).then((res) => {
                        if (res.status == 200) {
                            this.$message.success(res.message)
                            this.refushHandler(1);
                        } else {
                            this.$message.error(res.message);
                        }
                    })
                }).catch(() => {
                    self.$message.info('已取消删除');
                });
            },
            /***********编辑库房************/
            storageEditHandler() {
                var params = {
                    id: this.addAndEditForm.params.id,
                    storeRoomName: this.addAndEditForm.params.storeRoomName,
                    storeRoomNumber: this.addAndEditForm.params.storeRoomNumber,
                    storeRoomType: this.addAndEditForm.params.storeRoomType,
                    areaId: this.addAndEditForm.params.areaId,
                    buildingId: this.addAndEditForm.params.buildingId,
                    floor: this.addAndEditForm.params.floor,
                    roomNumber: this.addAndEditForm.params.roomNumber,
                    userIdList: this.addAndEditForm.params.userIdList
                }
                this.$axios.post('/itsm/system/config/storeRoom/updateStoreRoom', params).then((res) => {
                    if (res.status == 200) {
                        //关闭弹框
                        this.addAndEditForm.show = false;
                        this.$message.success(res.message);
                        this.refushHandler();
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            // 重置查询
            resetTable(){
                this.configStorageTable.message = {
                    storeRoomName: '',
                    storeRoomType: '',
                    areaId: '',
                    areaName: ''
                };
                this.configStorageTable.query = {
                    storeRoomName: '',
                    storeRoomType: '',
                    areaId: '',
                    areaName: ''
                };
            },
            // refushHandler刷新函数
            refushHandler(pageNum) {
                //重置查询条件
                this.resetTable();
                //重置pagination
                if(pageNum){
                    this.configStorageTable.pagination.currentPage = pageNum;
                }
                //重新请求分类表格数据
                this.getStorageTable();
            },

            // 重置新增或编辑表单
            reset() {
                this.$refs['addAndEditFormId'].resetFields();
                this.addAndEditForm.params = {       // 手动清空
                    id: '',
                    storeRoomName: '',
                    storeRoomNumber: '',
                    storeRoomType: '',
                    areaId: '',
                    areaName: '',
                    buildingId: '',
                    buildingOptions: '',
                    floor: '',
                    roomNumber: '',
                    userIdList: '',
                    userNameList: ''
                }
            },
            // selected选中
            handleSelectionChange(v) {
                const self = this;

                self.configStorageTable.selection = v.map(v => v.id);
            },

        }
    }

</script>

<style lang="less">
    .storage-room-page {
        .query-area {
            .main {
                height: 110px;
                overflow: hidden;
                color: #7e7e7e;
                padding-top: 35px;
                .reset-form {
                    .el-form-item {
                        margin: 0 110px 0 10px;
                    }
                }
            }
        }
        .table-area {
        }
        .area-dialog-style {
            width: 470px;
            height: 380px;
            .content {
                height: 280px;
                padding: 20px;
            }
        }
        .add-edit-dialog-style {
            width: 767px;
            height: 415px;
            .reset-style {
                width: 200px;
                height: 32px;
                line-height: 27px;
            }
            .content {
                height: 315px;
                padding-top: 30px;
            }
            .user {
                .el-form-item__content {
                    width: 535px;
                }
            }
        }
    }
</style>