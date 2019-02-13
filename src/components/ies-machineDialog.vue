<template>
    <!-- 所属机房弹窗 -->
    <el-dialog :visible="true" custom-class="user-dialog-style" @close="machineChoose" v-drag>
        <span slot="title" style="color:#666666;">选择机房</span>             

        <div class="tabs-panel-wrap border query-area">
            <div class="panel-header">
                查询条件
            </div>
            
            <div class="panel-body main">
                <div class="content">
                    名称：
                    <el-input placeholder="请输入机房名称" v-model="queryParam.machineRoomName" class="resetWidth" ></el-input>
                </div>
            </div>
        </div>


        <div class="tabs-panel-wrap border">
            <div class="panel-header">
                <div class="fr">
                    <el-button type="primary" icon="el-icon-my-search" size="normal" @click="getMachineTable()">查询</el-button>
                </div>
            </div>
            
            <div class="panel-body main">
                <el-table :data="configTable.data" stripe max-height="300">
                    <el-table-column width="80" align="center" label="操作" >
                        <template slot-scope="scope">
                            <el-radio v-model="configTable.selectId" :label="scope.row.id">&nbsp;</el-radio>
                        </template>
                    </el-table-column>

                    <el-table-column prop="machineRoomName" align="center" label="名称" ></el-table-column>
                </el-table>
            </div>

            <div class="panel-footer footer">
                <el-pagination  @size-change="sizeChange" @current-change="currentChange" layout="total, sizes, prev, pager, next, jumper"
                    :page-size="configTable.pagination.pageSize" :current-page="configTable.pagination.currentPage" :page-sizes="[2, 4, 6, 8]"  :total="configTable.pagination.total"></el-pagination>
            </div>
        </div>
        
        <div slot="footer">
            <el-button type="primary" size="normal" @click="machineChoose('confirm')">保&nbsp;存</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props:['defaultSelect','value'],
    data () {
        return {
            queryParam:{
                machineRoomName:''
            },
            configTable:{
                data:[],
                selectId:'',
                selectRow:'',
                pagination:{
                    total:0,
                    pageSize:4,
                    currentPage:1
                }
            }
        }
    },
    mounted(){
        if(this.defaultSelect){
            this.configTable.selectId = this.defaultSelect;
        }
        this.$nextTick(function(){
            this.getMachineTable();
        })
    },
    methods: {
        getMachineTable(params){
            params = params || {
                machineRoomName:this.queryParam.machineRoomName,
                pageNum:this.configTable.pagination.currentPage,
                pageSize:this.configTable.pagination.pageSize
            }
            
            this.$axios.post('/itsm/system/config/machineRoom/queryMachineRoom', params).then((res) => {
                if (res.status==200){
                    if(res.data){
                        this.configTable.data = res.data.list;
                        this.configTable.pagination.total = res.data.total;
                    } else {
                        this.configTable.data = [];
                        this.configTable.pagination.total = 0;
                    }
                    if(this.defaultSelect){
                        this.$nextTick(function(){
                            this.searchRow(this.configTable.selectId,this.configTable.data);
                        })
                    }
                } else {
                    this.$message(res.message);
                }
            });
        },
        //关闭保存事件
        machineChoose(type){
            this.searchRow(this.configTable.selectId,this.configTable.data);
            if(type=='confirm'){
                this.$emit('machineChooseHandler', this.configTable.selectRow)
            }
            this.$emit('input', false);
        },
        //遍历寻找选中Row
        searchRow(id,data){
            var self = this;
            data.forEach(function(item) {
                if (item.id == id) {
                    self.configTable.selectRow = item;
                    return; 
                }
            });
        },
        sizeChange(v){
            var params = {
                machineRoomName:this.queryParam.machineRoomName,
                pageNum:this.configTable.pagination.currentPage,
                pageSize:v
            }
            this.getMachineTable(params);
        },
        currentChange(v){
            var params = {
                machineRoomName:this.queryParam.machineRoomName,
                pageNum:v,
                pageSize:this.configTable.pagination.pageSize
            }
            this.getMachineTable(params);
        }
    }
}
</script>