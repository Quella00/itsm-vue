<template>
    
        <div class="itsm-tabs-main order-seo">
    
            <div class="tabs-main">
    
                <div class="tabs-panel-wrap border">
                    <div class="message-headr">
                        <span>查询条件</span>
                    </div>
                    
                    <div class="content">
                        <el-form :inline="true" ref="searchForm" class="search-conditions" label-width="110px">
                            <el-form-item label="创建人：">
                                <el-input placeholder="请选择工单创建人" v-model="tableConfig.message.creatorName" readonly></el-input>
                                <i class="el-icon-my-more" @click="openPersonRadio('creator')"></i>
                            </el-form-item>

                            <el-form-item label="处理人：">
                                <el-input placeholder="请选择工单处理人" v-model="tableConfig.message.handlerName" readonly></el-input>
                                <i class="el-icon-my-more" @click="openPersonRadio('processor')"></i>
                            </el-form-item>

                            <el-form-item label="工单主题：">
                                <el-input placeholder="请输入工单主题" v-model="tableConfig.message.theme"></el-input>
                            </el-form-item>

                            <el-form-item label="类型：">
                                <el-select placeholder="请选择工单类型" v-model="tableConfig.message.workOrderType" @focus="selectOnFocus">
                                    <el-option v-for="item in workOrderTypes" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="状态：">
                                <el-select placeholder="请选择工单状态" v-model="tableConfig.message.workOrderStatus" @focus="selectOnFocus">
                                    <el-option v-for="item in workOrderStatus" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
    
                <div class="tabs-panel-wrap border" v-autoHeight>
    
                    <div class="panel-header">
                        <el-button type="primary" icon="el-icon-my-export" size="normal" @click="exportHandler">导出</el-button>
                        <el-button type="primary" icon="el-icon-my-delete" size="normal" @click="deleteHandler">删除</el-button>
                        <span class="fr">
                            <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                            <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                        </span>   
                    </div>
                    <div class="panel-body">
                        <el-table :data="tableConfig.data" @selection-change="selectionChangeHandler" stripe >
                            <el-table-column type="selection" width="55"  align="center"></el-table-column>
    
                            <el-table-column prop="code" show-overflow-tooltip label="工单编号">
                                <template slot-scope="scope">
                                    <i style="color:#409EFF;cursor:pointer;" @click="openOrderDatail(scope.row)">{{scope.row.code}}</i>
                                </template>
                            </el-table-column>
                            
                            <el-table-column prop="theme" show-overflow-tooltip label="工单主题"> </el-table-column>

                            <el-table-column prop="type" show-overflow-tooltip label="类型">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.type == 1">事件</span>
                                    <span v-if="scope.row.type == 2">问题</span>
                                    <span v-if="scope.row.type == 3">变更</span>
                                    <span v-if="scope.row.type == 4">发布</span>
                                    <span v-if="scope.row.type == 5">备件</span>
                                </template>
                            </el-table-column>
                            
                            <el-table-column prop="createUserName" show-overflow-tooltip label="创建人"> </el-table-column>
                            
                            <el-table-column prop="priority" show-overflow-tooltip label="优先级"> </el-table-column>

                            <el-table-column prop="status" show-overflow-tooltip label="状态">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.workOrderStatus == 0">未受理</span>
                                    <span v-if="scope.row.workOrderStatus == 1">已受理</span>
                                    <span v-if="scope.row.workOrderStatus == 2">处理中</span>
                                    <span v-if="scope.row.workOrderStatus == 3">已挂起</span>
                                    <span v-if="scope.row.workOrderStatus == 4">申请关闭</span>
                                    <span v-if="scope.row.workOrderStatus == 5">已关闭</span>
                                </template>
                            </el-table-column>

                            <el-table-column prop="slaStatus" show-overflow-tooltip label="SLA状态"> </el-table-column>

                            <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"> </el-table-column>

                            <el-table-column prop="status" show-overflow-tooltip label="下载">
                                <template slot-scope="scope">
                                    <i class="el-icon-my-download" type="normal" @click="downloadHandler(scope.row.id)"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="panel-footer" style="text-align: right;">
                        <!--面板底部-->
                        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page.sync="tableConfig.pagination.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="tableConfig.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="tableConfig.pagination.total"></el-pagination>                    
                    </div>
                </div>
    
            </div>
            <!-- 选择人员弹窗 -->
            <iesPersonRadioDialog v-model="personRadioConfig.visible"  v-if="personRadioConfig.visible" :defaultSelect="personRadioConfig.defaultSelect" @selectPersonRadioHandler="savePersonRadio"></iesPersonRadioDialog>
        </div>
    
    </template>
    
    <script>
    export default {
        data() {
            const validator = this.$ies.validator;
            return {
                // 人员弹窗配置
                personRadioConfig: {
                    visible: false,
                    type: '',
                    defaultSelect:{
                        type:'search',
                        id: ''
                    }
                },
                
                // 工单类型
                workOrderTypes: [
                    {value:'',label:'全部'},
                    {value:'1',label:'事件'},
                    {value:'2',label:'问题'},
                    {value:'3',label:'变更'},
                    {value:'4',label:'发布'},
                    {value:'5',label:'备件'},
                ],
                // 工单状态
                workOrderStatus: [ 
                    { value: '', label: '全部' },
                    { value: 0, label: '未受理' },
                    { value: 1, label: '已受理' },
                    { value: 2, label: '处理中' },
                    { value: 3, label: '已挂起' },
                    { value: 4, label: '申请关闭' },
                    { value: 5, label: '已关闭' }
                ],

                // 表格配置
                tableConfig: {
                    message: {
                        createUserId: '',
                        creatorName: '',
                        handlerId:'',
                        handlerName: '',
                        theme: '',
                        workOrderType: '',
                        workOrderStatus: ''
                    },
                    query: {
                        createUserId: '',
                        creatorName: '',
                        handlerId:'',
                        handlerName: '',
                        theme: '',
                        workOrderType: '',
                        workOrderStatus: ''
                    },
                    data: [],
                    selected:[],
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                },
                
            };
        },
        mounted(){
            this.$nextTick(this.init)
        },
        methods: {
            init() {
                this.getTableFun();
            },
            // 获取建筑表格
            getTableFun(params) {
                const self = this;

                // 查询参数
                params = params || {
                    createUserId: self.tableConfig.query.createUserId,
                    handlerId: self.tableConfig.query.handlerId,
                    theme: self.tableConfig.query.theme,
                    workOrderType: self.tableConfig.query.workOrderType,
                    workOrderStatus: self.tableConfig.query.workOrderStatus,
                    pageSize: self.tableConfig.pagination.pageSize,
                    pageNum: self.tableConfig.pagination.currentPage
                }

                self.$axios.post('/work/order/query', params).then(res => {
                    if (res.status == 200){
                        if(res.data){
                            self.tableConfig.data = res.data.list;
                            self.tableConfig.pagination.total = res.data.total;
                        }else{
                            self.tableConfig.data = [];
                            self.tableConfig.pagination.total = 0;
                            self.tableConfig.pagination.currentPage = 1;
                        }
                    } else {
                        self.$message(res.message);
                    }
                });
            },
            openPersonRadio(v){
                const self = this;

                self.personRadioConfig.type = v;
                self.personRadioConfig.visible = true;
                self.personRadioConfig.defaultSelect.id = v == 'creator' ? self.tableConfig.message.createUserId : self.tableConfig.message.handlerId;
            },
            savePersonRadio(v){
                const self = this;

                var user = JSON.parse(v);
                if(self.personRadioConfig.type == 'creator'){
                    self.tableConfig.message.createUserId = user.id;
                    self.tableConfig.message.creatorName = user.userName;
                } else {
                    self.tableConfig.message.handlerId = user.id;
                    self.tableConfig.message.handlerName = user.userName;
                }
            },
            // 导出
            exportHandler(){
                var self = this;

                if (!self.tableConfig.selected.length) {
                    self.$message.warning('请选择要导出的工单');
                    return;
                }

                window.open(`/api/work/order/export?idList=${self.tableConfig.selected.join()}&Token=${self.token}`);
            },
            // 删除
            deleteHandler(){
                var self = this;

                const vArray = self.tableConfig.data.filter(v => self.tableConfig.selected.includes(v.id));

                if(vArray.some(v => v.workOrderStatus != 5)){
                    self.$message.warning('只有已关闭的工单才能删除');
                    return;
                }

                if (self.tableConfig.selected.length) {
                    self.$confirm('是否删除选中工单?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        self.$axios.post('/work/order/batchDelete', { idList: self.tableConfig.selected.join() }).then(res => {
                            if (res.status == 200){
                                self.getTableFun();
                                self.$message.success('删除成功')
                            } else {
                                self.$message.error('删除失败');
                            }
                        });
                    }).catch(() => {
                        self.$message.info('已取消删除');          
                    });
                } else {
                    self.$message.warning('请选择要删除的工单');
                }
            },
            // 重置
            resetHandler() {
                const self = this;

                self.tableConfig.query = self.tableConfig.message = self.$options.data.call(self).tableConfig.message;
                
                /*
                self.tableConfig.message = {
                    createUserId: '',
                    creatorName: '',
                    handlerId:'',
                    handlerName: '',
                    theme: '',
                    workOrderType: '',
                    workOrderStatus: ''
                };
                self.tableConfig.query = {
                    createUserId: '',
                    creatorName: '',
                    handlerId:'',
                    handlerName: '',
                    theme: '',
                    workOrderType: '',
                    workOrderStatus: ''
                };
                */
            },
            // 查询
            queryHandler(){
                const self = this;

                Object.assign(self.tableConfig.query, self.tableConfig.message);
                self.tableConfig.pagination.currentPage = 1;
                self.getTableFun();     
            },
            // 下载
            downloadHandler(id){
                const self = this;

                // if (!self.tableConfig.selected.length) {
                //     self.$message.warning('请选择要下载的工单');
                //     return;
                // }

                window.open(`/api/work/order/download?id=${id}&Token=${self.token}`);
            },
            //重新刷新数据
            refushHandler(){
                const self = this;

                //重置查询条件
                self.resetHandler();
                //重置pagination
                self.tableConfig.pagination.currentPage = 1;
                //重新请求分类表格数据
                self.getTableFun();
            },
            openOrderDatail(row){
                const self = this;
                
                const workOrderType = (row.type == 1 && 'event') || (row.type == 2 && 'question') || (row.type == 3 && 'change') || (row.type == 4 && 'publish') || (row.type == 5 && 'spare');

                self.$ies.dispatch(self, 'layout').$refs.sidebar.openPage(`/workOrder/orderDatail/${workOrderType}?orderId=${row.id}&instanceId=${row.processInstanceId}`);
            },
            selectionChangeHandler(v) {
                const self = this;
    
                self.tableConfig.selected = v.map(v => v.id);
            },
            //sizeChange事件
            sizeChangeHandler(v) {
                const self = this;

                var params =  {
                    createUserId: self.tableConfig.query.createUserId,
                    handlerId: self.tableConfig.query.handlerId,
                    theme: self.tableConfig.query.theme,
                    workOrderType: self.tableConfig.query.workOrderType,
                    workOrderStatus: self.tableConfig.query.workOrderStatus,
                    pageSize: v,
                    pageNum: self.tableConfig.pagination.currentPage
                }
                
                self.getTableFun(params)
            },
            //currentChange是将
            currentChangeHandler(v) {
                const self = this;

                var params = {
                    createUserId: self.tableConfig.query.createUserId,
                    handlerId: self.tableConfig.query.handlerId,
                    theme: self.tableConfig.query.theme,
                    workOrderType: self.tableConfig.query.workOrderType,
                    workOrderStatus: self.tableConfig.query.workOrderStatus,
                    pageSize: self.tableConfig.pagination.pageSize,
                    pageNum: v
                }

                self.getTableFun(params)
            },
            selectOnFocus(e) {
                e.target.blur();
            }
        },
        computed: {
			token() {
				return this.$store.state.user.info ? this.$store.state.user.info.token : ''
			}
		}
    }
    </script>
    
    <style lang="less">
        .order-seo {
            .content {
                padding: 35px 40px 10px 40px;
                background-color: #ffffff;
                .el-form-item {
                    margin-right: 50px;
                    .el-input__inner{
                        width: 220px;
                    }
                }
            }
        }
    </style>


