<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">

            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="tableConfig.message" class="search-conditions" label-width="110px">
                        <el-form-item label="出 库 单：">
                            <el-input v-model="tableConfig.message.warehouseOutNumber" placeholder="请输入出库单"></el-input>
                        </el-form-item>
                        <el-form-item label="备件名称：">
                            <el-input v-model="tableConfig.message.name" placeholder="请输入备件名称"></el-input>
                        </el-form-item>
                        <el-form-item label="所属库房：">
                            <el-input v-model="tableConfig.message.storeRoomName" placeholder="请选择所属库房" @focus="selectOnFocus" readonly></el-input>
                            <i class="el-icon-my-more" @click="openStoreDialog"></i>
                        </el-form-item>
                        <el-form-item label="出库时间：">
                            <el-date-picker type="daterange" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                v-model="tableConfig.message.stockoutTime" class="date-picker"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="出库类型：">
                            <el-select v-model="tableConfig.message.warehouseOutType" placeholder="请选择入库类型" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="领用" value="领用"></el-option>
                                <el-option label="送修" value="送修"></el-option>
                                <el-option label="调拨" value="调拨"></el-option>
                                <el-option label="借用" value="借用"></el-option>
                                <el-option label="报废" value="报废"></el-option>
                                <el-option label="转资产" value="转资产"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                        <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="spareAddHandler">新增</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="tableConfig.data" cell-class-name="resetCell" header-cell-class-name="resetHeaderCell">
                        <el-table-column label="出库单" show-overflow-tooltip prop="warehouseOutNumber"></el-table-column>
                        <el-table-column label="出库时间" show-overflow-tooltip prop="createTime"></el-table-column>
                        <el-table-column label="出库类型" show-overflow-tooltip prop="warehouseOutType"></el-table-column>
                        <el-table-column label="操作人" show-overflow-tooltip prop="createUserName"></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip prop="operation"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit ml5" title="编辑" @click="editHandler(scope.row.id)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer" style="text-align: right;">
                    <!--面板底部-->
                    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page="tableConfig.pagination.currentPage"
                        :page-sizes="[10, 20, 30, 40]" :page-size="tableConfig.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="tableConfig.pagination.total"></el-pagination>
                </div>
            </div>
        </div>
        <!-- 库房选择弹窗 -->
        <iesStoreRoomDialog v-model="storeDialog.show" v-if="storeDialog.show" @storeChooseHandler="storeChooseHandler" :defaultSelect='storeDialog.selectId'></iesStoreRoomDialog>
    </div>

</template>

<script>
    export default {
        data() {
            const validator = this.$ies.validator;

            return {
                // 库房弹窗配置
                storeDialog: {
                    show: false,
                    selectId: ''
                },
                // 表格配置
                tableConfig: {
                    message: {
                        warehouseOutNumber: '',
                        name: '',
                        storeRoomId: '',
                        storeRoomName: '',
                        stockoutTime: [],
                        warehouseOutType: ''
                    },
                    query: {
                        warehouseOutNumber: '',
                        name: '',
                        storeRoomId: '',
                        storeRoomName: '',
                        stockoutTime: [],
                        warehouseOutType: ''
                    },
                    data: [],
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                },
            };
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            })
        },
        activated() {
            this.$nextTick(function () {
                this.init();
            });
        },
        methods: {
            init() {
                const self = this;
                self.getTableFun();
            },
            selectOnFocus(e) {
                e.target.blur();
            },
            //获取表格
            getTableFun(params) {
                //查询参数
                params = params || {
                    warehouseOutNumber: this.tableConfig.query.warehouseOutNumber,
                    name: this.tableConfig.query.name,
                    storeRoomId: this.tableConfig.query.storeRoomId,
                    beginTime: this.tableConfig.query.stockoutTime?this.tableConfig.query.stockoutTime[0]:'',
                    endTime: this.tableConfig.query.stockoutTime?this.tableConfig.query.stockoutTime[1]:'',
                    warehouseOutType: this.tableConfig.query.warehouseOutType,
                    pageSize: this.tableConfig.pagination.pageSize,
                    pageNum: this.tableConfig.pagination.currentPage
                }
                this.$axios.post('/itsm/device/out/query', params).then((res) => {
                    if (res.status==200){
                        this.tableConfig.data = res.data.list;
                        this.tableConfig.pagination.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            // 查询
            queryHandler() {
                this.tableConfig.query = this.$ies.deepCopy(this.tableConfig.message);
                this.tableConfig.pagination.currentPage = 1;
                this.getTableFun();
            },
            // 重置
            resetHandler() {
                this.tableConfig.message = {
                    warehouseOutNumber: '',
                    name: '',
                    storeRoomId: '',
                    storeRoomName: '',
                    stockoutTime: [],
                    warehouseOutType: ''
                };
            },
            // 新增
            spareAddHandler() {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/stockoutCreate');
            },
            // 编辑
            editHandler(v) {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/stockoutDetail?id='+v);
            },
            // 库房选择
            openStoreDialog() {
                this.storeDialog.selectId = this.tableConfig.message.storeRoomId;
                this.storeDialog.show = true;
            },
            storeChooseHandler(node) {
                if (node) {
                    this.tableConfig.message.storeRoomId = node.id;
                    this.tableConfig.message.storeRoomName = node.storeRoomName;
                } else {
                    this.tableConfig.message.storeRoomId = '';
                    this.tableConfig.message.storeRoomName = '';
                }
            },
            //sizeChange事件
            sizeChangeHandler(v) {
                this.tableConfig.pagination.pageSize = v;
                this.getTableFun()
            },
            //currentChange是将
            currentChangeHandler(v) {
                this.tableConfig.pagination.currentPage = v;
                this.getTableFun()
            },
        }
    }
</script>