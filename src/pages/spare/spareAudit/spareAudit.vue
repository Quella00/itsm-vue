<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">

            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="tableConfig.message" class="search-conditions" label-width="110px">
                        <el-form-item label="备件名称：">
                            <el-input v-model="tableConfig.message.name" placeholder="请输入备件名称"></el-input>
                        </el-form-item>
                        <el-form-item label="资产分类：">
                            <el-input v-model="tableConfig.message.classificationName" placeholder="请选择资产分类" @focus="selectOnFocus" readonly></el-input>
                            <i class="el-icon-my-more" @click="openAssetDialog"></i>
                        </el-form-item>
                        <el-form-item label="来源：">
                            <el-select v-model="tableConfig.message.operation" placeholder="来源" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="新增" value="新增"></el-option>
                                <el-option label="报废" value="报废"></el-option>
                                <el-option label="编辑" value="编辑"></el-option>
                                <el-option label="转资产" value="转资产"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人：">
                            <el-input v-model="tableConfig.message.userName" placeholder="请选择申请人" @focus="selectOnFocus" readonly></el-input>
                            <i class="el-icon-my-more" @click="openUserDialog"></i>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <span class="fl">
                        <el-button type="primary"  icon="el-icon-my-batch" size="normal" @click="batchAuditHandler">批量审核</el-button>
                    </span>
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="tableConfig.data" @selection-change="selectionChange" cell-class-name="resetCell" header-cell-class-name="resetHeaderCell">
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column label="资产编码" show-overflow-tooltip prop="code"></el-table-column>
                        <el-table-column label="备件名称" show-overflow-tooltip prop="name"></el-table-column>
                        <el-table-column label="资产分类" show-overflow-tooltip prop="classificationName"></el-table-column>
                        <el-table-column label="来源" show-overflow-tooltip prop="operation"></el-table-column>
                        <el-table-column label="申请时间" show-overflow-tooltip prop="updateTime" width="200px" ></el-table-column>
                        <el-table-column label="申请人" show-overflow-tooltip prop="createUserName"></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip prop="operate"  width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit ml5" title="编辑" @click="auditHandler(scope.row.id)"></i>
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
        <!-- 选择负责人弹窗 -->
        <iesPersonRadioDialog v-model="userDialog.show" v-if="userDialog.show" :defaultSelect="userDialog.defaultSelect" @selectPersonRadioHandler="saveUserDialog"></iesPersonRadioDialog>
        <!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog>
        <!-- 批量审核弹窗 -->
        <el-dialog title="批量审核" :visible.sync="auditDialog.show" width="450px" :close-on-click-modal='false' @close="batchAuditReset" v-drag>
            <div class="audit-remark">
                <el-form label-width="90px" :model="auditDialog.params" :rules="auditDialog.rules" ref="remarkForm">
                    <el-form-item label="审核：" prop="audit">
                        <el-select v-model="auditDialog.params.audit" @focus="selectOnFocus">
                            <el-option label="审核通过" value="true"></el-option>
                            <el-option label="审核不通过" value="false"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark" style="width: 400px;">
                        <el-input type="textarea" v-model="auditDialog.params.remark" placeholder="请输入备注"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer">
                <el-button type="normal" @click="batchAuditSave">保存</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        data() {
            const validator = this.$ies.validator;

            return {
                // 资产分类弹框配置
                assetDialog: {
                    show: false,
                    selectId: ''
                },
                // 申请人配置
                userDialog: {
                    show: false,
                    defaultSelect:{
                        id: ''
                    }
                },
                auditDialog: {
                    show:false,
                    params:{
                        audit: 'true',
                        remark: ''
                    },
                    rules: {
						remark: [
							{ validator: validator.space, trigger: 'blur', options: {max:200} },
						]
					}
                },
                // 表格配置
                tableConfig: {
                    message: {
                        name: "",
                        classification: "",
                        classificationName: "",
                        user:"",
                        userName:"",
                        operation:"",
                    },
                    query: {
                        name: "",
                        classification: "",
                        classificationName: "",
                        user:"",
                        userName:"",
                        operation:"",
                    },
                    data: [],
                    selection: [],
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
            /*
            *获取表格
            **/
            getTableFun(params) {
                //查询参数
                params = params || {
                    needApprove: 1,
                    name: this.tableConfig.query.name,
                    classification: this.tableConfig.query.classification,
                    user: this.tableConfig.query.user,
                    operation: this.tableConfig.query.operation,
                    pageNum: this.tableConfig.pagination.currentPage,
                    pageSize: this.tableConfig.pagination.pageSize
                }
                this.$axios.post('/itsm/device/query', params).then((res) => {
                    if(res.status == 200) {
                        this.tableConfig.data = res.data ? res.data.list : [];
                        this.tableConfig.pagination.total = res.data ? res.data.total : 0;
                    }else{
                        this.$message.error(res.message);
                    }
                });
            },
            /*
            *审核
            **/
            auditHandler(v) {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/spareAuditDetail?id='+v);
            },
            /*
            *批量审核
            **/ 
            batchAuditHandler() {
                if(this.tableConfig.selection.length == 0){
                    this.$message.warning('请勾选要审核的备件!');
                    return;
                }
                this.auditDialog.show = true;
            },
            batchAuditReset() {
                this.auditDialog.params = {
                    audit:'true',
                    remark:''
                }
            },
            batchAuditSave() {
                this.$refs['remarkForm'].validate((valid) => {
                    if(valid) {
                        var param = {
                            idList: this.tableConfig.selection.toString(),
                            approved: this.auditDialog.params.audit,
                            remark: this.auditDialog.params.remark
                        }
                        this.$axios.post('/itsm/device/batchAudit',param).then( (res) => {
                            if(res.status == 200 && res.data) {
                                this.$message({ type: 'success', message: '审核成功' });
                                this.auditDialog.show = false;
                                this.getTableFun();
                            } else {
                                this.$message({ type: 'error', message: '审核失败' });
                            }
                        });
                    }
                });
            },
            /*
            *查询
            **/
            queryHandler() {
                this.tableConfig.query = this.$ies.deepCopy(this.tableConfig.message);
                this.tableConfig.pagination.currentPage = 1;
                this.getTableFun();
            },
            /*
            *重置
            **/
            resetHandler() {
                this.tableConfig.message = {
                    name: "",
                    classification: "",
                    classificationName: "",
                    user:"",
                    userName:"",
                    operation:"",
                };
            },
            /*
            * 资产分类选择
            **/ 
            openAssetDialog() {
                this.assetDialog.selectId = this.tableConfig.message.classification;
                this.assetDialog.show = true;
            },
            assetChooseHandler(node) {
                if (node) {
                    this.tableConfig.message.classification = node.id;
                    this.tableConfig.message.classificationName = node.categoryName;
                } else {
                    this.tableConfig.message.classification = '';
                    this.tableConfig.message.classificationName = '';
                }
            },
            // 选择人弹框
            openUserDialog() {
                this.userDialog.show = true;
                this.userDialog.defaultSelect.id= this.tableConfig.message.user;
            },
            saveUserDialog(v) {
                v = JSON.parse(v);
                if (v) {
                    this.tableConfig.message.user = v.id;
                    this.tableConfig.message.userName = v.userName;
                } else {
                    this.tableConfig.message.user = '';
                    this.tableConfig.message.userName = '';
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
            selectionChange(v){
                this.tableConfig.selection = v.map(v => v.id);
            }
        }
    }

</script>