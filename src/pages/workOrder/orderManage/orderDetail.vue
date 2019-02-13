<template>
    <div class="itsm-tabs-main">
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
                <div class='order-detail'>
                    <div class="tabs-panel-wrap border query-area mb15">
                        <div class="panel-body main clearfix" style="padding: 20px 10px;">
                            <el-tooltip class="item" effect="dark" offset="0" :content="workOrderBase.workOrderCode||'暂无数据'" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">工单编号：</label>{{workOrderBase.workOrderCode||''}}</div>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" :content="workOrderTypeName||'暂无数据'" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">工单类型：</label>{{workOrderTypeName||''}}</div>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" :content="workOrderBase.processStatus||'暂无数据'" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">当前流程状态：</label>{{workOrderBase.processStatus||''}}</div>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" :content="workOrderBase.workOrderStatus && workOrderBase.workOrderStatus == 5 ? ((workOrderBase.workOrderCloseInformation==1&&' 已完成需求')||' 未完成需求') :''" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">工单关闭信息：</label>{{workOrderBase.workOrderStatus && workOrderBase.workOrderStatus == 5 ? ((workOrderBase.workOrderCloseInformation==1&&' 已完成需求')||' 未完成需求') :''}}</div>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" :content="workOrderBase.workOrderTheme||'暂无数据'" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">工单标题：</label>{{workOrderBase.workOrderTheme||''}}</div>
                            </el-tooltip>

                            <el-tooltip class="item" effect="dark" :content="workOrderBase.acceptorName||'暂无数据'" placement="bottom">
                                <div class="order-item ellipsis"><label class="w120">受理人：</label>{{workOrderBase.acceptorName||''}}</div>
                            </el-tooltip>
                        </div>
                    </div>

                    <div v-if='workOrderBase.workOrderStatus!=5&&this.$store.state.user.info&&workOrderBase.acceptorId==this.$store.state.user.info.id' class="operate-compoent tabs-panel-wrap border mb15">
                        <div class="panel-header">
                            操作
                        </div>
                        <div class="panel-body main" style="padding:35px;text-align: center;">
                            <el-button v-if="orderOperateConfig.data.rejectWorkOrder==1&&(workOrderBase.workOrderStatus==2||workOrderBase.workOrderStatus==4)" type="primary" @click="openOrderOperate('orderBack')">转回</el-button>
                            <el-button v-if="orderOperateConfig.data.acceptWorkOrder==1&&workOrderBase.workOrderStatus==0" type="primary" @click="openOrderOperate('orderAccept')">受理</el-button>
                            <el-button v-if="orderOperateConfig.data.closeWorkOrder==1&&(workOrderBase.workOrderStatus==1||workOrderBase.workOrderStatus==2)" type="primary" @click="openOrderOperate('orderClose')">关闭</el-button>
                            <el-button v-if="orderOperateConfig.data.hangUpWorkOrder==1&&(workOrderBase.workOrderStatus==1||workOrderBase.workOrderStatus==2)" type="primary" @click="openOrderOperate('orderHandup')">挂起</el-button>
                            <el-button v-if="orderOperateConfig.data.appointWorkOrder==1&&(workOrderBase.workOrderStatus==1||workOrderBase.workOrderStatus==2)" type="primary" @click="openOrderOperate('orderAssign')">指派</el-button>
                            <el-button v-if="orderOperateConfig.data.startupWorkOrder==1&&workOrderBase.workOrderStatus==3" type="primary" @click="openOrderOperate('orderStart')">启动</el-button>
                            <el-button v-if="orderOperateConfig.data.confirmCloseWorkOrder==1&&workOrderBase.workOrderStatus==4" type="primary" @click="openOrderOperate('orderSure')">确定</el-button>
                        </div>
                    </div>
                    <!-- 进度条 -->
                    <iesProgressSteps :data="orderProgressCondig" :config="['complain']"  @complainHandler="openOrderOperate"></iesProgressSteps>

                    <div class="el-my-tab">
                        <el-tabs v-model="currentTab" @tab-click="tabClickHandler" type="card">
                            <el-tab-pane name="formInfo">
                                <p class="tabs-item" slot="label" >
                                    <span>表单信息</span>
                                </p>
                                <formInfoComponent :data="orderTabsConfig.formInfo" :readonly="workOrderBase.workOrderStatus!=0&&workOrderBase.workOrderStatus!=5&&this.$store.state.user.info&&workOrderBase.acceptorId==this.$store.state.user.info.id" @operaHandler="getOrderDetail" ></formInfoComponent>
                            </el-tab-pane>
                            <el-tab-pane name="relateOrder">
                                <p class="tabs-item" slot="label">
                                    <span>关联工单</span>
                                </p>
                                <div class="tabs-panel-wrap border basic" style="margin-right:0px;">
                                    <div class="panel-header">
                                        关联工单
                                        <span v-if='workOrderBase.workOrderStatus!=5&&this.$store.state.user.info&&workOrderBase.acceptorId==this.$store.state.user.info.id' class="fr">
                                            <el-button type="primary" size="normal" @click='turnProblemHandler'>
                                                <i class="el-icon-my-toQuestion"></i> 转问题</el-button>
                                            <el-button type="primary" size="normal" @click='turnChangeHandler'>
                                                <i class="el-icon-my-toChange f12"></i> 转变更</el-button>
                                            <el-button type="primary" size="normal" @click='relateNeworderHandler'>
                                                <i class="el-icon-my-guanlian1 f12"></i> 关联新工单</el-button>
                                            <el-button type="primary" size="normal" @click='openOrderOperate("orderRelate")'>
                                                <i class="el-icon-my-guanlian1 f12"></i> 关联现有工单</el-button>
                                        </span>
                                    </div>
                                    <div class="panel-body body">
                                        <el-table :data="orderTabsConfig.relateOrder.data" ref="relateOrderTable" empty-text="暂无数据" >
                                            <el-table-column prop="code" label="工单编号" align="center" show-overflow-tooltip></el-table-column>

                                            <el-table-column prop="theme" label="工单主题" align="center" show-overflow-tooltip></el-table-column>

                                            <el-table-column prop="type" label="类型" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    {{(scope.row.type==1&&'事件'||scope.row.type==2&&'问题'||scope.row.type==3&&'变更'||scope.row.type==4&&'发布'||scope.row.type==5&&'备件')}}
                                                </template>
                                            </el-table-column>

                                            <el-table-column prop="workOrderStatus" label="状态" align="center" show-overflow-tooltip>
                                                <template slot-scope="scope">
                                                    {{ (scope.row.workOrderStatus==0&&'未受理'||scope.row.workOrderStatus==1&&'已受理'||scope.row.workOrderStatus==2&&'处理中'||scope.row.workOrderStatus==3&&'已挂起'||scope.row.workOrderStatus==4&&'申请关闭'||scope.row.workOrderStatus==5&&'已关闭') }}
                                                </template>
                                            </el-table-column>

                                            <el-table-column prop="createTime" label="创建时间" align="center" show-overflow-tooltip></el-table-column>

                                            <el-table-column v-if='workOrderBase.workOrderStatus!=5&&this.$store.state.user.info&&workOrderBase.acceptorId==this.$store.state.user.info.id' label="操作" align="center">
                                                <template slot-scope="scope">
                                                    <i  class="el-icon-my-delete" @click="relateOrderDel(scope.row.relationshipId)" ></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </div>
                                    <div class="panel-footer" style="text-align: right;">
                                        <!--面板底部-->
                                        <el-pagination @current-change="currentChangeHandler" :current-page.sync="orderTabsConfig.relateOrder.pageNum" :page-size="10" 
                                            layout="total, prev, pager, next, jumper" :total="orderTabsConfig.relateOrder.total"></el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane name="slaInfo">
                                <p class="tabs-item" slot="label">
                                    <span>SLA信息</span>
                                </p>
                                <div class="tabs-panel-wrap border" style="margin-right:0">
                                	 <div class="panel-header">SLA信息</div>
                                    <el-table class="simple-table" :data="orderTabsConfig.slaInfo" ref="slaInfoTable" border style=" width: 85.5%; margin: 30px 0 30px 30px;">
                                        <el-table-column prop="kpiName" label="KPI" align="center"></el-table-column>

                                        <el-table-column prop="kpiQuota" label="KPI指标" align="center"></el-table-column>

                                        <el-table-column prop="kpiValue" label="当前值" align="center"></el-table-column>
                                    </el-table>
                                </div>
                            </el-tab-pane>
                            <el-tab-pane name="relateKnowledge">
                                <p class="tabs-item" slot="label" >
                                    <span>关联知识</span>
                                </p>
                                <div class="tabs-panel-wrap border basic" style="margin-right:0px;">
                                    <div class="panel-header">
                                        推荐知识
                                    </div>
                                    <div class="panel-body body">
                                        <el-table :data="orderTabsConfig.relateKnowledgeInfo.data" ref="relateKnowledgeTable" empty-text="暂无数据" >
                                            <el-table-column prop="title" label="知识主题" align="center" show-overflow-tooltip>
                                            	 <template slot-scope="scope">
                                                   	<a href="javascript:;" @click="openKnowledgeDetail(scope.row.id)" style="color:#57a9fd">{{scope.row.title}}</a>
                                                </template>
                                            </el-table-column>
                                            <el-table-column prop="classificationName" label="知识类型" align="center" show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="keyword" label="知识关键字" align="center" show-overflow-tooltip></el-table-column>
											<el-table-column prop="manufacturer" label="关联品牌" align="center" show-overflow-tooltip></el-table-column>
                                            <el-table-column prop="categoryName" label="关联资产分类" align="center" show-overflow-tooltip></el-table-column>
                                        </el-table>
                                    </div>
                                    <div class="panel-footer" style="text-align: right;">
                                        <!--面板底部-->
                                        <el-pagination @current-change="relateKnowledgeCurrentChange" :current-page.sync="orderTabsConfig.relateKnowledgeInfo.pageNum" :page-size="10" 
                                            layout="total, prev, pager, next, jumper" :total="orderTabsConfig.relateKnowledgeInfo.total"></el-pagination>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </div>
            </ies-scrollbar>
        </div>

        <!-- 工单关闭弹框 -->
        <iesOrderCloseDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderClose'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderCloseDialog>
        <!-- 工单挂起弹框 -->
        <iesOrderHandupDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderHandup'||orderOperateConfig.operateDialog=='orderStart'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderHandupDialog>
        <!-- 工单指派弹框 -->
        <iesOrderAssignDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderAssign'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderAssignDialog>
        <!-- 工单转回弹框 -->
        <iesOrderBackDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderBack'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderBackDialog>
        <!-- 工单投诉弹框 -->
        <iesOrderComplainDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderComplain'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderComplainDialog>
        <!-- 关联现有工单 -->
        <iesOrderRelateDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderRelate'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail"   ></iesOrderRelateDialog>
        <!-- 工单关闭弹框 -->
        <iesOrderConfirmDialog v-model="orderOperateConfig.operateDialog" v-if="orderOperateConfig.operateDialog=='orderSure'" 
        :data="orderOperateConfig.defaultData" @operaHandler="getOrderDetail" ></iesOrderConfirmDialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                currentTab: 'formInfo',
                workOrderId: '',
                processInstanceId: '',
                workOrderType: '',
                confirmCloseNodeId: '',
                // 当前、下级、上级节点与操作人
                preNodeId: "",
                preUserId: "",
                preUserName: "",
                currentNodeId: "",
                currentUserId: "",
                nextNodeId: "",
                nextUserId: "",
                workOrderBase: {
                    workOrderCode:"",
                    workOrderType:"",
                    workOrderTheme:"",
                    acceptorName:"",
                    processStatus:"",
                    workOrderCloseInformation:"0",
                },
                orderOperateConfig: {
                    visible: true,
                    operateDialog: '',
                    data: '',
                    defaultData: {},
                },
                orderProgressCondig: [],
                orderTabsConfig: {
                    formInfo: {},
                    relateOrder: {
                        data:[],
                        total: 0,
                        pageNum:1,
                    },
                    slaInfo: [],
                    relateKnowledgeInfo:{
                    	data:[],
                        total: 0,
                        pageNum:1,
                    }
                },
                orderSubject:'',// 工单主题
                assetCode:'', // 资产编码
            }
        },
        mounted() {
            this.$nextTick(function(){
                this.init();
            })
        },
        methods: {
            init(){
                const self = this;
                var str = this.$route.path, index = str.lastIndexOf('/');
                this.workOrderType = str.substr(index + 1);
                this.workOrderId = this.$route.query.orderId;
                this.processInstanceId = this.$route.query.instanceId;
                this.getOrderDetail();
            },
            getOrderDetail() {
                this.$axios.post('/work/order/detail?id='+this.$route.query.orderId).then((res) => {
                    if(res.status==200){
                        this.workOrderBase = res.data.workOrderBase;
                        this.orderTabsConfig.formInfo = {
                            workOrderId:res.data.workOrderBase.workOrderId,
                            applyInfo:res.data.applicant,
                            assetInfo:res.data.asset,
                            customFieldInfo: res.data.customFieldList,
                            externalUsersInfo: res.data.externalUser
                        }
                        this.assetCode = res.data.asset.code;
                        this.orderSubject = this.workOrderBase.workOrderTheme;
                    }else{
                        this.$message.error('工单详情获取失败！');
                    }
                });
                this.getCurrentNodeId();
                this.getNextNodeId();
                this.getProcessData();
                this.getRelateOrder();
            },
            tabClickHandler(v) {
                const self = this;
                if(v.$el.id=='pane-relateOrder'){
                    this.getRelateOrder();
                    self.$refs.relateOrderTable.doLayout();
                }else if(v.$el.id=='pane-slaInfo'){
                    this.getSlaInfo();
                    self.$refs.slaInfoTable.doLayout();
                } else if(v.$el.id =='pane-relateKnowledge'){
                	self.getRelateKnowledgeInfo();
                	self.$refs.relateKnowledgeTable.doLayout();
                }
            },
            // 获取关联知识数据
            getRelateKnowledgeInfo(){
            	var params = {
            		orderSubject:this.orderSubject,
            		assetCode:this.assetCode,
            		pageNum: this.orderTabsConfig.relateKnowledgeInfo.pageNum,
                    pageSize: '10'
            	}
            	this.$axios.post('/itsm/knowledgeBase/recommend/query',params).then((res) => {
                    if(res.status == 200){
                        this.orderTabsConfig.relateKnowledgeInfo.data = res.data.list;
                        this.orderTabsConfig.relateKnowledgeInfo.total = res.data.total;
                    }
                });
            },
            // 关联知识currentPage改变事件
            relateKnowledgeCurrentChange(v){
            	this.orderTabsConfig.relateKnowledgeInfo.pageNum = v;
            	this.getRelateKnowledgeInfo();
            },
            // 获取SLA数据
            getSlaInfo(){
                this.$axios.get('/itsm/process/manager/sla/querySLAByinstanceId?instanceId='+this.processInstanceId).then((res) => {
                    if(res.status==200){
                        this.orderTabsConfig.slaInfo = res.data;
                    }
                });
            },
            // 获取进度状态数据
            getProcessData(){
                this.$axios.post('/itsm/process/manager/log/query?processInstanceId='+this.$route.query.instanceId+'&workOrderId='+this.$route.query.orderId).then((res) => {
                    if(res.status==200){
                        this.orderProgressCondig = res.data
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            // 获取关联工单数据
            getRelateOrder(params) {
                params = params || {
                    id: this.workOrderId,
                    pageNum: this.orderTabsConfig.relateOrder.pageNum,
                    pageSize: '10'
                }
                this.$axios.post('/work/order/correlate',params).then((res) => {
                    if(res.status==200){
                        this.orderTabsConfig.relateOrder.data = res.data.list || [];
                        this.orderTabsConfig.relateOrder.total = res.data.total || 0;
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            currentChangeHandler(v) {
                var params = {
                    id: this.workOrderId,
                    pageNum: v,
                    pageSize: '10'
                }
                this.getRelateOrder(params);
            },
            // 删除关联
            relateOrderDel(v) {
                this.$axios.post(`/work/order/correlate/delete?id=${v}`).then((res) => {
                    if(res.status==200){
                        var params = {
                            id: this.workOrderId,
                            pageNum: '1',
                            pageSize: '10'
                        }
                        this.getRelateOrder(params);
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            // 获取当前节点ID
            getCurrentNodeId(callback){
                this.$axios.post('/itsm/process/manager/instance/queryInstanceById?instanceId='+this.$route.query.instanceId).then((res) => {
                    this.currentNodeId = res.data.currentNodeId;
                    this.currentUserId = res.data.currentNodeUserId;
                    this.preNodeId = res.data.preNodeId;
                    this.preUserId = res.data.preNodeUserId;
                    this.preUserName = res.data.preNodeUserName;
                    this.confirmCloseNodeId = res.data.confirmCloseNodeId;
                    if(res.status==200){
                        var self = this;
                        this.getNodeInfo(this.currentNodeId,function(v){
                            self.orderOperateConfig.data = v;
                        });
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            // 获取下一个节点ID
            getNextNodeId(callback) {
                this.$axios.post('/itsm/process/manager/instance/queryNextNodeIdByInstanceId?instanceId=' + this.$route.query.instanceId).then((res) => {
                    if (res.status == 200) {
                        this.nextNodeId = res.data;
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            // 根据节点ID获取节点信息
            getNodeInfo(nodeId,callback) {
                this.$axios.post('/itsm/process/manager/instance/queryProcessNodePropertyByInstanceId?instanceId='+this.$route.query.instanceId+'&nodeId='+nodeId).then((res) => {
                    if(res.status==200){
                        if(callback){
                            callback(res.data)
                        }
                    }else{
                        this.$message(res.message);
                    }
                });
            },
            // 打开工单操作弹窗
            openOrderOperate(v,v2) {
                const self = this;
                switch (v){
                    // 受理工单事件
                    case 'orderAccept':
                        var params = {
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                            nextNodeId: self.currentNodeId,
                            nextUserId: self.currentUserId
                        }
                        this.$axios.post('/itsm/process/manager/node/action/accept', params).then((res) => {
                            if(res.status==200){
                                this.$message.success(res.message);
                                this.getOrderDetail();
                            }else{
                                this.$message(res.message);
                            }
                        });
                        break;
                    // 回转工单事件
                    case 'orderBack':
                        var params = {
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                        }
                        this.$axios.post('/itsm/process/manager/log/queryRejectNodeId', {
                            workOrderId: self.workOrderId,
                            currentUserId: self.currentUserId,
                            currentNodeId: self.currentNodeId,
                            processInstanceId: self.processInstanceId
                        }).then((res) => {
                            if(res.status==200){
                                if(res.data){
                                    var result = {
                                        nextNodeId: res.data.preNodeId,
                                        nextUserId: res.data.preNodeUserId,
                                        preNodeName: res.data.preNodeName,
                                        preNodeRoleName: res.data.preNodeRoleName,
                                        preNodeUserName: res.data.preNodeUserName,
                                    }
                                    self.orderOperateConfig.defaultData = $.extend({}, result, params);
                                    self.orderOperateConfig.operateDialog = v;
                                }else{
                                    this.$message(res.message);
                                }
                                
                            }else{
                                this.$message(res.message);
                            }
                        });
                        break;
                    // 关闭工单事件
                    case 'orderClose':
                        var result = self.orderOperateConfig.data,params={
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                            nextNodeId: self.confirmCloseNodeId,
                        }
                        self.orderOperateConfig.defaultData = $.extend({},result,self.$route.query,params);
                        self.orderOperateConfig.operateDialog = v;
                        break;
                    // 挂起工单事件
                    case 'orderHandup':
                        var result = self.orderOperateConfig.data,params = {
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                            nextNodeId: self.currentNodeId,
                            nextUserId: self.currentUserId
                        }
                        self.orderOperateConfig.defaultData = $.extend({},result,params);
                        self.orderOperateConfig.operateDialog = v;
                        break;
                    // 指派工单事件
                    case 'orderAssign':
                        var params = {
                            workOrderCode: self.workOrderBase.workOrderCode,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                        }
                        this.getNodeInfo(this.nextNodeId,function(result){
                            self.orderOperateConfig.defaultData = $.extend({},result,self.$route.query,params);
                            self.orderOperateConfig.operateDialog = v;
                        });
                        break;
                    // 启动工单事件
                    case 'orderStart':
                        var result = self.orderOperateConfig.data, params = {
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                            nextNodeId: self.currentNodeId,
                            nextUserId: self.currentUserId
                        }
                        self.orderOperateConfig.defaultData = $.extend({},result,params);
                        self.orderOperateConfig.operateDialog = v;
                        break;
                    // 确定工单事件
                    case 'orderSure':
                        var params = {
                            workOrderId: self.workOrderId,
                            workOrderCode: self.workOrderBase.workOrderCode,
                            processInstanceId: self.processInstanceId,
                            currentNodeId: self.currentNodeId,
                            currentUserId: self.currentUserId,
                        }
                        self.orderOperateConfig.defaultData = $.extend({},params);
                        self.orderOperateConfig.operateDialog = v;
                        // this.$axios.post('/itsm/process/manager/node/action/confirmClose', params).then((res) => {
                        //     if(res.status==200){
                        //         this.$message.success(res.message);
                        //     }else{
                        //         this.$message(res.message);
                        //     }
                        // });
                        break;
                    // 投诉工单事件
                    case 'orderComplain':
                        var params = {
                            workOrderId: self.workOrderId,
                            workOrderName: self.workOrderBase.workOrderTheme,
                            processInstanceId: self.processInstanceId,
                            complainNodeId: self.currentNodeId,
                            complainUserId: self.$store.state.user.info.userId
                        }
                        self.orderOperateConfig.defaultData = $.extend({},v2,params)
                        self.orderOperateConfig.operateDialog = v;
                        break;
                    // 关联已有工单
                    case 'orderRelate':
                        self.orderOperateConfig.defaultData.sourceWorkOrderId = self.workOrderId;
                        self.orderOperateConfig.operateDialog = v;
                        break;
                }
                // this.orderOperateConfig.operateDialog = v;
            },
            // 转问题
            turnProblemHandler() {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/question/createQuestionOrder?sourceWorkOrderId=${this.workOrderId}`);
            },
            // 转变更
            turnChangeHandler() {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/change/createChangeOrder?sourceWorkOrderId=${this.workOrderId}`);
            },
            // 关联新工单
            relateNeworderHandler() {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/serviceDesk/createOrder/event/createEventOrder?sourceWorkOrderId=${this.workOrderId}`);
            },
            // 点击关联知识的知识主题
            openKnowledgeDetail(id){
            	this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/knowledgeSearch/knowledgeDetail?id='+ id);
            }
        },
        watch:{
            $route(){
                if(this.$route.path == '/workOrder/orderDatail/'+this.workOrderType){
                    if(this.$route.query.orderId !== this.workOrderId) {
                        Object.assign(this.$data, this.$options.data());
                        this.init();
                    }
                }
            },
        },
        computed:{
            workOrderTypeName(){
                var t = this.workOrderBase.workOrderType;
                return (t==1&&'事件'||t==2&&'问题'||t==3&&'变更'||t==4&&'发布'||t==5&&'备件')
            }
        }
    }

</script>
<style lang="less">
	.order-detail{
		.el-my-tab{
			border:none;
			.el-tabs__content{
				background:#efefef;
			}
			.el-tabs__header{
				border:1px solid #e4e4e4;padding-left: 20px;background: #fff;
			}
		}
		
	}
	#pane-relateKnowledge{
		.el-table__header{
			width:100% !important;
		}
		.el-table__empty-block{
			width:100% !important;
		}
		.el-table__body{
			width:100% !important;
		}
	}
</style>