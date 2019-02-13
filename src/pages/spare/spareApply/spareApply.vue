<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">

            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="tableConfig.message" class="search-conditions" label-width="110px">
                        <el-form-item label="资产编码：">
                            <el-input v-model="tableConfig.message.code" placeholder="请输入资产编码"></el-input>
                        </el-form-item>
                        <el-form-item label="备件名称：">
                            <el-input v-model="tableConfig.message.name" placeholder="请输入备件名称"></el-input>
                        </el-form-item>
                        <el-form-item label="资产分类：">
                            <el-input v-model="tableConfig.message.classificationName" placeholder="请选择资产分类" @focus="selectOnFocus" readonly></el-input>
                            <i class="el-icon-my-more" @click="openAssetDialog"></i>
                        </el-form-item>
                        <el-form-item label="备件状态：">
                            <el-select v-model="tableConfig.message.deviceStatus" placeholder="请选择备件状态" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="出库" value="出库"></el-option>
                                <el-option label="库存" value="库存"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属库房：">
                            <el-input v-model="tableConfig.message.storeRoomName" placeholder="请选择所属库房"></el-input>
                            <i class="el-icon-my-more" @click="openStoreDialog"></i>
                        </el-form-item>
                        <el-form-item label="维保状态：">
                            <el-select v-model="tableConfig.message.maintenanceStatus" placeholder="请选择维保状态" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="在保中" value="在保中"></el-option>
                                <el-option label="已过保" value="已过保"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="可用性：">
                            <el-select v-model="tableConfig.message.availability" placeholder="请选择可用性" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="已检可用" value="已检可用"></el-option>
                                <el-option label="已检不可用" value="已检不可用"></el-option>
                                <el-option label="未检新品" value="未检新品"></el-option>
                                <el-option label="未检坏件" value="未检坏件"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <span class="fl">
                            <el-button type="normal" icon="el-icon-my-QRCode" style="width:115px;" @click="downlondQCode">生成二维码</el-button>
                        </span>
                    <span class="fr">
                            <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                            <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                        </span>
                </div>
                <div class="panel-body">
                    <el-table :data="tableConfig.data" cell-class-name="resetCell" header-cell-class-name="resetHeaderCell">
                        <el-table-column type="selection" width="55" align="center" ></el-table-column>
                        <el-table-column label="资产编码" show-overflow-tooltip prop="code">
                            <template slot-scope="scope">
                                <el-button @click="rowClickHandler(scope.row)" type="text">{{scope.row.code}}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="备件名称" show-overflow-tooltip prop="name"></el-table-column>
                        <el-table-column label="资产分类" show-overflow-tooltip prop="classificationName"></el-table-column>
                        <el-table-column label="备件状态" show-overflow-tooltip prop="deviceStatus"></el-table-column>
                        <el-table-column label="所属库房" show-overflow-tooltip prop="storeRoomName"></el-table-column>
                        <el-table-column label="维保状态" show-overflow-tooltip prop="maintenanceStatus"></el-table-column>
                        <el-table-column label="新建时间" show-overflow-tooltip prop="createTime"></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip prop="operation"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-refresh ml5" :class="{'enable-color':scope.row.needApprove}" title="转资产" @click.stop="toAssertHandler(scope.row.id,scope.row.needApprove)"></i>
                                <i class="el-icon-my-delete ml5" :class="{'enable-color':scope.row.needApprove}" title="报废" @click.stop="scarpHandler(scope.row.id,scope.row.needApprove)"></i>
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
        <!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog>
        <!-- 库房选择弹窗 -->
        <iesStoreRoomDialog v-model="storeDialog.show" v-if="storeDialog.show" @storeChooseHandler="storeChooseHandler" :defaultSelect='storeDialog.selectId'></iesStoreRoomDialog>
        <!-- 废弃弹窗 -->
        <iesSpareScrap v-model="scrapDialog.show" v-if="scrapDialog.show" :id="scrapDialog.id" @callback="getTableFun"></iesSpareScrap>
        <!-- 转资产弹窗 -->
        <iesToAsset  v-model="toAssertDialog.show" v-if="toAssertDialog.show" :id="toAssertDialog.id" @callback="getTableFun"></iesToAsset>
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
                // 资产弹框配置
                assetDialog: {
                    show: false,
                    selectId: ''
                },
                // 废弃弹框配置
                scrapDialog: {
                    show: false,
                    id: ''
                },
                // 转资产弹框配置
                toAssertDialog: {
                    show: false,
                    id: ''
                },
                // 表格配置
                tableConfig: {
                    message: {
                        code: '',
                        name: '',
                        deviceStatus: '',
                        classification: '',
                        classificationName: '',
                        storeRoomId: '',
                        storeRoomName: '',
                        maintenanceStatus: '',
                        availability: ''
                    },
                    query: {
                        code: '',
                        name: '',
                        deviceStatus: '',
                        classification: '',
                        classificationName: '',
                        storeRoomId: '',
                        storeRoomName: '',
                        maintenanceStatus: '',
                        availability: ''
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
                    code: this.tableConfig.query.code,
                    name: this.tableConfig.query.name,
                    classification: this.tableConfig.query.classification,
                    deviceStatus: this.tableConfig.query.deviceStatus,
                    storeRoomId: this.tableConfig.query.storeRoomId,
                    maintenanceStatus: this.tableConfig.query.maintenanceStatus,
                    availability: this.tableConfig.query.availability,
                    pageSize: this.tableConfig.pagination.pageSize,
                    pageNum: this.tableConfig.pagination.currentPage
                }
                this.$axios.post('/itsm/device/apply/query', params).then((res) => {
                    if (res.status==200){
                        this.tableConfig.data = res.data.list;
                        this.tableConfig.pagination.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            // 生成二维码 
            downlondQCode() {
                this.$message.warning("请连接专用二维码打印机进行打印");
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
                    code: '',
                    name: '',
                    classification: '',
                    classificationName: '',
                    storeRoomId: '',
                    storeRoomName: '',
                    maintenanceStatus: '',
                    availability: ''
                };
            },
            /*
            * 查看备件
            **/
            rowClickHandler(row) {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/spare/spareApplyDetail?id=${row.id}`);
            },
            // 转资产
            toAssertHandler(v,needApprove) {
                if(needApprove) return;
                this.toAssertDialog.id = v;
                this.toAssertDialog.show = true;
            },
            // 报废
            scarpHandler(v,needApprove) {
                if(needApprove) return;
                this.scrapDialog.id = v;
                this.scrapDialog.show = true;
            },
            // 库房选择
            openStoreDialog() {
                this.storeDialog.selectId = this.tableConfig.message.storeRoomId;
                this.storeDialog.show = true;
            },
            storeChooseHandler(node) {
                if (node) {
                    this.storeDialog.selectId = node.id;
                    this.tableConfig.message.storeRoomId = node.id;
                    this.tableConfig.message.storeRoomName = node.storeRoomName;
                } else {
                    this.storeDialog.selectId = '';
                    this.tableConfig.message.storeRoomId = '';
                    this.tableConfig.message.storeRoomName = '';
                }
            },
            // 资产分类选择
            openAssetDialog() {
                this.assetDialog.selectId = this.tableConfig.message.classification;
                this.assetDialog.show = true;
            },
            assetChooseHandler(node) {
                if (node) {
                    this.assetDialog.selectId = node.id;
                    this.tableConfig.message.classification = node.id;
                    this.tableConfig.message.classificationName = node.categoryName;
                } else {
                    this.assetDialog.selectId = '';
                    this.tableConfig.message.classification = '';
                    this.tableConfig.message.classificationName = '';
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