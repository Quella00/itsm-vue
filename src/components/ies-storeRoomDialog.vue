<!--选择库房弹窗（单选）-->
<template>
<div>
    <el-dialog title="选择库房" :visible="value" custom-class="table-dialog" @close="chooseHandler" :close-on-click-modal='false' v-drag>
        <div class="table-dialog-content store-room-dialog">
            <div class="tabs-panel-wrap border">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body">
                    <el-form :inline="true" label-width="82px" :model="message">
                        <el-form-item label="名称：" >
                            <el-input placeholder="请输入库房名称" v-model="message.storeRoomName" ></el-input>
                        </el-form-item>
                        <el-form-item label="库房类型：">
                            <el-select @focus="bulrFocus" placeholder="请选择库房类型" v-model="message.storeRoomType" >
                                <el-option key="" value="" label="全部"></el-option>
                                <el-option v-for="item in storeRoomTypeOptions" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属区域：">
                            <el-input @focus="bulrFocus" placeholder="请选择所属区域" v-model="message.areaName"  readonly></el-input>
                            <i class="el-icon-my-more" @click="openAreaDialog"></i>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="tabs-panel-wrap border" v-autoHeight="tableHeight">
                <div class="panel-header">
                    <div class="panel-header-right">
                        <el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
                    </div>
                </div>
                <div class="panel-body">
                    <el-table :data="data" stripe :max-height="tableHeight">
                        <el-table-column width="55" align="center">
                            <template slot-scope="scope">
                                <el-radio v-model="selection" :label="JSON.stringify(scope.row)"></el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column label="名称" prop="storeRoomName" show-overflow-tooltip align="center" ></el-table-column>
                    </el-table>
                </div>
                <div class="panel-footer" style="text-align: right;">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
                        :page-sizes="[10, 20, 30, 40]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button size="normal" @click="chooseHandler">取&nbsp;消</el-button>
            <el-button type="normal" @click="chooseHandler('confirm')">确定</el-button>
        </div>
    </el-dialog>
    <!-- 所属区域弹窗 -->
    <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='configAreaDialog.selectId' ></iesAreaDialog>
</div>
</template>

<script>
    export default {
        props: ['defaultSelect', 'value'],
        data() {
            return {
                tableHeight: '',
                configAreaDialog: {
                    show:false,
                    selectId:''
                },
                storeRoomTypeOptions: [
                    { value: 1, label: '通用库房' },
                    { value: 2, label: '专用库房' },
                    { value: 3, label: '中转库房' }
                ],
                data:[],
                selection:[],
                message:{
                    storeRoomName: '',
                    storeRoomType: '',
                    areaId: '',
                    areaName:''
                },
                query:{
                    storeRoomName: '',
                    storeRoomType: '',
                    areaId: '',
                    areaName:''
                },
                pagination: {
                    total: 0,
                    pageSize: 10,
                    currentPage: 1
                }
            };
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            });
        },
        methods: {
            init() {
                this.getTableData();
            },
            
            bulrFocus(e) {
                e.target.blur();
            },
            getTableData(params) {
                const self = this;
                params = params ||  {
                    storeRoomName: self.query.storeRoomName,
                    storeRoomType: self.query.storeRoomType,
                    areaId: self.query.areaId,
                    pageNum: self.pagination.currentPage,
                    pageSize: self.pagination.pageSize
                }
                this.$axios.post('/itsm/system/config/storeRoom/queryStoreRoomPage', params).then((res) => {
                    if (res.status == 200) {
                        if (res.data) {
                            this.data = res.data.list;
                            this.pagination.total = res.data.total;
                            self.defaultSelect && self.data.forEach(function(val, index){
                                val.id == self.defaultSelect && (self.selection=JSON.stringify(val));
                            })
                        } else {
                            this.data = [];
                            this.pagination.total = 0;
                        }
                    } else {
                        this.$message(res.message);
                    }
                });
            },
            /****************************区域弹框*********************************/ 
            openAreaDialog() {
                this.configAreaDialog.show = true;
                this.configAreaDialog.selectId = this.message.selectId;
            },
            areaChooseHandler(node) {
                if(node){
                    this.message.areaId = node.id;
                    this.message.areaName = node.areaName;
                } else {
                    this.message.areaId = '';
                    this.message.areaName = '';
                }
            },
            handleSizeChange(val) {
                this.pagination.pageSize = val;
                this.getTableData();
            },
            handleCurrentChange(val) {
                this.pagination.currentPage = val;
                this.getTableData();
            },
            // 查询
            search() {
                this.pagination.currentPage = 1;
                this.query = this.$ies.deepCopy(this.message);
                this.getTableData();
            },
            // 关闭或者点击保存
            chooseHandler(type) {
                if (type == 'confirm') {
                    this.selection && this.$emit('storeChooseHandler', JSON.parse(this.selection));
                }
                this.$emit('input', false);
            }
        }, 
    }

</script>