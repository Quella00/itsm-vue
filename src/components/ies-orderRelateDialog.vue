<!--关联资产（服务台创建工单时候用）-->
<template>
        <div>
            <el-dialog title="关联已有工单" :visible="true" width="1200px" custom-class="relation-asset" @close="closeHandler" :close-on-click-modal='false' v-drag>
                <div class="relation-asset-content" style="height:620px;padding:10px;">
                    <div class="tabs-panel-wrap border">
                        <div class="panel-header">
                            查询条件
                        </div>
                        <div class="panel-body search-content" style="height:150px;">
                            <el-form :inline="true" :model="searchForm"  class="search-conditions" label-width="150px" style="padding-top:20px;">
                                <el-form-item label="创建人：">
                                    <el-input placeholder="请选择工单创建人" v-model="searchForm.createUserName" readonly></el-input>
                                    <i class="el-icon-my-more" @click="openPersonRadio('creator')"></i>
                                </el-form-item>
                                <el-form-item label="处理人：">
                                    <el-input placeholder="请选择工单处理人" v-model="searchForm.handlerName" readonly></el-input>
                                    <i class="el-icon-my-more" @click="openPersonRadio('handler')"></i>
                                </el-form-item>
                                <el-form-item label="工单主题：">
                                        <el-input placeholder="请输入工单主题" v-model="searchForm.theme"></el-input>
                                </el-form-item>
                                <el-form-item label="创建时间：">
                                    <el-date-picker type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                        v-model="searchForm.createTime" class="date-picker" ></el-date-picker>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                    <div class="tabs-panel-wrap border" v-autoHeight>
                        <div class="panel-header">
                            <div class="panel-header-right">
                                <el-button type="normal" icon="el-icon-my-reset" @click="resetHandler()">重置</el-button>
                                <el-button type="normal" icon="el-icon-my-search" @click="queryHandler()">查询</el-button>
                            </div>
                        </div>
                        <div class="panel-body">
                            <el-table :data="tableConfig.data" stripe  @selection-change="handleSelectionChange" max-height="300">
                                <el-table-column type="selection" width="55"  align="center"></el-table-column>
                                <el-table-column label="工单编号" prop="code" width="180" show-overflow-tooltip></el-table-column>
                                <el-table-column label="工单主题" prop="theme" show-overflow-tooltip></el-table-column>
                                <el-table-column label="创建人" prop="createUserName" show-overflow-tooltip></el-table-column>
                                <el-table-column label="优先级" prop="priority" show-overflow-tooltip></el-table-column>
                                <el-table-column label="状态" prop="workOrderStatus" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        {{ (scope.row.workOrderStatus==0&&'未受理'||scope.row.workOrderStatus==1&&'已受理'||scope.row.workOrderStatus==2&&'处理中'||scope.row.workOrderStatus==3&&'已挂起'||scope.row.workOrderStatus==4&&'申请关闭'||scope.row.workOrderStatus==5&&'已关闭') }}
                                    </template>
                                </el-table-column>
                                <el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </div>
                        <div class="panel-footer" style="text-align: right;">
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 40]" 
                                :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button type="normal" @click="closeHandler('confirm')">关联</el-button>
                </div>
            </el-dialog>
             <!-- 选择人员弹窗 -->
            <iesPersonRadioDialog v-model="personRadioConfig.visible" v-if="personRadioConfig.visible" :defaultSelect="personRadioConfig.defaultSelect"
                @selectPersonRadioHandler="savePersonRadio"></iesPersonRadioDialog>
        </div>
    </template>
    
    <script>
        export default {     
            props:['value','data'],
            data() {
                return {
                    searchForm:{
                        createUserId: '',
                        createUserName: '',
                        handlerId: '',
                        handlerName:'',
                        theme: '',
                        createTime:[]
                    },
                    queryForm:{
                        createUserId: '',
                        createUserName: '',
                        handlerId: '',
                        handlerName:'',
                        theme: '',
                        createTime:[]
                    },
                    tableConfig:{
                        data:[],
                        selection: [],
                    },
                    pagination:{
                        pageSize:10,
                        currentPage:1,
                        total:0
                    },
                    personRadioConfig:{
                        type:'',
                        visible:false,
                        defaultSelect:{}
                    }
                }
            },
            mounted() {
                this.$nextTick(function () {
                    this.init();
                });
            },
            methods: {
                init(){
                    this.getTableData();
                },
                getTableData(params){
                    params = params || {
                        createUserId: this.queryForm.createUserId,
                        handlerId: this.queryForm.handlerId,
                        theme: this.queryForm.theme,
                        createTimeBegin: this.queryForm.createTime[0],
                        createTimeEnd: this.queryForm.createTime[1],
                        pageNum: this.pagination.currentPage,
                        pageSize: this.pagination.pageSize,
                    }
                    this.$axios.post('/work/order/query', params).then((res) => {
                        if (res.status == 200) {
                            if (res.data) {
                                this.tableConfig.data = res.data.list;
                                this.pagination.total = res.data.total;
                            } else {
                                this.tableConfig.data = [];
                                this.pagination.total = 0;
                                this.pagination.currentPage = 1;
                            }
                        } else {
                            this.$message(res.message);
                        }
                    });
                },
                queryHandler() {
                    this.pagination.currentPage = 1;

                    this.queryForm = this.$ies.deepCopy(this.searchForm);

                    this.getTableData();
                },
                resetHandler() {
                    this.searchForm = {
                        createUserId: '',
                        createUserName: '',
                        handlerId: '',
                        handlerName:'',
                        theme: '',
                        createTime:[]
                    }
                },
                handleSelectionChange(v){
                    const self = this;
                    self.tableConfig.selection = v.map(v => v.id);
                },
                handleCurrentChange(v){
                    this.pagination.currentPage = v;
                    this.getTableData();
                },
                handleSizeChange(v){
                    this.pagination.pageSize = v;
                    this.getTableData(); 
                },
                openPersonRadio(v) {
                    this.personRadioConfig.type = v;
                    this.personRadioConfig.visible = true;
                    if(v=='creator'){
                        this.personRadioConfig.defaultSelect.id = this.searchForm.createUserId;
                    }else{
                        this.personRadioConfig.defaultSelect.id = this.searchForm.handlerId;
                    }
                },
                savePersonRadio(v) {
                    var user = JSON.parse(v);
                    if (this.personRadioConfig.type == 'creator') {
                        this.searchForm.createUserId = user.id;
                        this.searchForm.createUserName = user.userName;
                    }else{
                        this.searchForm.handlerId = user.id;
                        this.searchForm.handlerName = user.userName;
                    }
                },
                //关闭弹窗
                closeHandler(type){
                    if(type == 'confirm'){
                        var params = {
                            sourceId: this.data.sourceWorkOrderId,
                            targetId: this.tableConfig.selection.join(',')
                        }
                        this.$axios.post('/work/order/correlate/add', params).then((res) => {
                            if (res.status == 200) {
                                this.$emit('operaHandler');
                                this.$emit('input', '');
                            } else {
                                this.$message.error('关联失败');
                            }
                        });
                    }else{
                        this.$emit('input', '');
                    }
                },
            },
            filters:{
                
            },
            computed:{
            },
            watch:{
                'searchForm.createTime':{
                    handler(v){
                        if(v==null){
                            this.searchForm.createTime = [];
                        }
                    },
                    deep:true
                }
            }
        }
    
    </script>
    
    <style lang="less">
        .relation-asset-content .el-radio__label{display: none;}
        .relation-asset-content .el-form-item{margin-bottom:30px;}
        .relation-asset-content .el-input__prefix{
            left: 173px;
            .el-input__icon{
                line-height: 100%
            }
        }
    </style>