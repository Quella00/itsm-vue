<template>

    <div class="itsm-tabs-main">

        <div class="tabs-main">

            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="tableConfig.message" class="search-conditions" label-width="110px">
                        <el-form-item v-if='workOrderType == "all"' label="类型：">
                            <el-select @focus="bulrFocus"  placeholder="请选择工单类型" v-model="tableConfig.message.type">
                                <el-option v-for="(v,k) in typeConfig" :key="k" :value="v.value" :label="v.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建人：">
                            <el-input @focus="bulrFocus" placeholder="请选择工单创建人" v-model="tableConfig.message.createUserName" readonly></el-input>
                            <i class="el-icon-my-more" @click="openPersonRadio('creator')"></i>
                        </el-form-item>
                        <el-form-item label="优先级：">
                            <el-select @focus="bulrFocus" placeholder="请选择工单优先级" v-model="tableConfig.message.priority">
                                <el-option v-for="item in priorityLevels" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="创建时间：">
                            <el-date-picker type="daterange" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                v-model="tableConfig.message.createTime" class="date-picker" ></el-date-picker>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <span class="fr">
                        <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                        <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                    </span>
                </div>
                <div class="panel-body">
                    <el-table :data="tableConfig.data" stripe>

                        <el-table-column prop="code" show-overflow-tooltip label="工单编号">
                            <template slot-scope="scope">
                                <i style="color:#409EFF;cursor:pointer;" @click="openOrderDatail(scope.row)">{{scope.row.code}}</i>
                            </template>
                        </el-table-column>

                        <el-table-column prop="theme" show-overflow-tooltip label="工单主题"> </el-table-column>

                        <el-table-column prop="type" show-overflow-tooltip label="类型">
                            <template slot-scope="scope">
                                {{(scope.row.type==1&&'事件'||scope.row.type==2&&'问题'||scope.row.type==3&&'变更'||scope.row.type==4&&'发布'||scope.row.type==5&&'备件')}}
                            </template>
                        </el-table-column>

                        <el-table-column prop="createUserName" show-overflow-tooltip label="创建人"> </el-table-column>

                        <el-table-column prop="priority" show-overflow-tooltip label="优先级"> </el-table-column>

                        <el-table-column prop="workOrderStatus" show-overflow-tooltip label="状态">
                            <template slot-scope="scope">
                                {{(scope.row.workOrderStatus==0&&'未受理'||scope.row.workOrderStatus==1&&'已受理'||scope.row.workOrderStatus==2&&'处理中'||scope.row.workOrderStatus==3&&'已挂起'||scope.row.workOrderStatus==4&&'申请关闭'||scope.row.workOrderStatus==5&&'已关闭')}}
                            </template>
                        </el-table-column>

                        <el-table-column prop="slaStatus" show-overflow-tooltip label="SLA状态"> </el-table-column>

                        <el-table-column prop="createTime" show-overflow-tooltip label="创建时间"> </el-table-column>
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
        <!-- 选择人员弹窗 -->
        <iesPersonRadioDialog v-model="personRadioConfig.visible" v-if="personRadioConfig.visible" :defaultSelect="personRadioConfig.defaultSelect"
            @selectPersonRadioHandler="savePersonRadio"></iesPersonRadioDialog>
    </div>

</template>

<script>
    export default {
        data() {
            const validator = this.$ies.validator;

            return {
                // 类型配置 
                workOrderType: "",
                typeConfig: {
                    'all': {name:'全部', value:''},
                    'event': { name: '事件', value: '1' },
                    'question': { name: '问题', value: '2' },
                    'change': { name: '变更', value: '3' },
                    'publish': { name: '发布', value: '4' },
                    'spare': { name: '备件', value: '5' }
                },
                // 人员弹窗配置
                personRadioConfig: {
                    type: '',
                    visible: false,
                    defaultSelect: {
                        type: 'search',
                        id: ''
                    }
                },
                // 工单优先级
                priorityLevels: [
                    { value: '', label: '全部' },
                    { value: '一级', label: '一级' },
                    { value: '二级', label: '二级' },
                    { value: '三级', label: '三级' },
                    { value: '四级', label: '四级' },
                    { value: '五级', label: '五级' },
                ],
                // 表格配置
                tableConfig: {
                    message: {
                        type: '',
                        createUserId: '',
                        createUserName: '',
                        priority: '',
                        createTime: '',
                    },
                    query: {
                        type: '',
                        createUserId: '',
                        createUserName: '',
                        priority: '',
                        createTime: '',
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
			this.$nextTick(function(){
                this.init();
            });
		},
        methods: {
            init() {
                const self = this;
                var str = this.$route.path, index = str.lastIndexOf('/');
                this.workOrderType = str.substr(index + 1);
                self.getTableFun();
            },
            bulrFocus(e) {
                e.target.blur();
            },
            //获取表格
            getTableFun(params) {
                //查询参数
                params = params || {
                    createUserId: this.tableConfig.query.createUserId,
                    workOrderType: this.workOrderType=='all'?this.tableConfig.query.type:this.typeConfig[this.workOrderType].value,
                    priority: this.tableConfig.query.priority,
                    createBeginTime: this.tableConfig.query.createTime[0],
                    createEndTime: this.tableConfig.query.createTime[1],
                    pageNum: this.tableConfig.pagination.currentPage,
                    pageSize: this.tableConfig.pagination.pageSize
                }
                this.$axios.post('/work/order/todo', params).then((res) => {
                    if (res.status == 200) {
                        if (res.data) {
                            this.tableConfig.data = res.data.list;
                            this.tableConfig.pagination.total = res.data.total;
                        } else {
                            this.tableConfig.data = [];
                            this.tableConfig.pagination.total = 0;
                            this.tableConfig.pagination.currentPage = 1;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            openPersonRadio(v) {
                this.personRadioConfig.type = v;
                this.personRadioConfig.visible = true;
                this.personRadioConfig.defaultSelect.id = this.tableConfig.message.createUserId;
            },
            savePersonRadio(v) {
                var user = JSON.parse(v);
                if (this.personRadioConfig.type == 'creator') {
                    this.tableConfig.message.createUserId = user.id;
                    this.tableConfig.message.createUserName = user.userName;
                }
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
                    creatorId: '',
                    creatorName: '',
                    priority: '',
                    createTime: ''
                };
                this.tableConfig.query = {
                    creatorId: '',
                    creatorName: '',
                    priority: '',
                    createTime: ''
                };
            },
            openOrderDatail(row, event, column) {
                var t = row.type;
                var workOrderType = (t==1&&'event'||t==2&&'question'||t==3&&'change'||t==4&&'publish'||t==5&&'spare');
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/workOrder/orderDatail/' + workOrderType + '?orderId=' + row.id + '&instanceId='+row.processInstanceId);
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
        },
        watch: {
            'tableConfig.message.createTime': {
                handler(v) {
                    if(v==null){
                        this.tableConfig.message.createTime = [];
                    }
                },
                deep: true
            }
        }
    }
</script>

<style>
    .rest-label {
        width: 70px;
        display: inline-block;
        text-align: end;
    }

    .message-item .el-input__prefix {
        right: 3px;
        left: auto;
    }

    .el-date-editor .el-range-separator {
        width: 10%;
    }
</style>