<template>
    <div>
        <el-form :inline="true" :model="tableConfig.message" class="search-conditions mt20 p10" label-width="82px">
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
        </el-form>
        <div class="tabs-panel-wrap border mb15" >
            <div class="panel-header" style="line-height:43px;">
                <span class="fl" v-if="type=='edit'">
                        <el-button type="primary" icon="el-icon-my-delete" size="normal"@click="deleteHandler"  >删除</el-button>
                </span>
                <span class="fr">
                    <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                    <el-button type="primary" icon="el-icon-my-add" size="normal" @click="spareAddHandler" v-if="type=='edit'" >添加返库设备</el-button>
                    <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                </span>
            </div>
            <div class="panel-body">
                <el-table :data="tableConfig.data" max-height="270" cell-class-name="resetCell" @selection-change="selectionChangeHandler" header-cell-class-name="resetHeaderCell">
                    <el-table-column type=selection ></el-table-column>
                    <el-table-column label="资产编码" show-overflow-tooltip prop="code"></el-table-column>
                    <el-table-column label="备件名称" show-overflow-tooltip prop="name"></el-table-column>
                    <el-table-column label="分类" show-overflow-tooltip prop="classificationName"></el-table-column>
                    <el-table-column label="操作" show-overflow-tooltip prop="operation" v-if="type=='edit'">
                        <template slot-scope="scope">
                            <i class="el-icon-my-delete" title="删除" @click="deleteHandler(scope.row.id)"></i>
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
        <!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog>
        <!-- 添加返库备件弹窗 -->
        <spareDialog v-model="spareDialog.show" v-if="spareDialog.show" :query="tableConfig.message" @callback="saveSpareDialog" :defaultSelect="tableConfig.cacheData" ></spareDialog>
    </div>
    
</template>

<script>
    import spareDialog from './spareDialog.vue'
    export default {
        props:['type', 'data'],
        components:{ 
            spareDialog 
        },
        data() {
            const validator = this.$ies.validator;

            return {
                // 库房弹窗配置
                assetDialog: {
                    show: false,
                    selectId: ''
                },
                // 备件弹框配置
                spareDialog: {
                    show: false,
                },
                // 表格配置
                tableConfig: {
                    message: {
                        code:'',
                        name:'',
                        classification:'',
                        classificationName:''
                    },
                    query: {
                        code:'',
                        name:'',
                        classification:'',
                        classificationName:''
                    },
                    data: [],
                    cacheData: [],
                    selection: [],
                    pagination: {
                        total: 0,
                        pageSize: 10,
                        currentPage: 1
                    }
                }
            };
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                if(this.type == 'show'){
                    this.tableConfig.cacheData = this.data.list;
                    this.tableConfig.pagination.total = this.data.total;
                }
            },
            getTableFun(params) {
                params = params || {
                    warehouseInId: this.$route.query.id,
                    code: this.tableConfig.query.code,
                    name: this.tableConfig.query.name,
                    classification: this.tableConfig.query.classification,
                    pageNum: this.tableConfig.pagination.currentPage,
                    pageSize: this.tableConfig.pagination.pageSize
                }
                this.$axios.post('/itsm/device/in/correlate/query', params).then((res) => {
                    if (res.status==200){
                        this.tableConfig.data = res.data.list;
                        this.tableConfig.pagination.total = res.data.total;
                    } else {
                        this.$message.error(res.message);
                    }
                });
            },
            queryHandler() {
                this.tableConfig.query = this.$ies.deepCopy(this.tableConfig.message);
                this.tableConfig.pagination.currentPage = 1;
                if(this.type == 'show'){
                    this.getTableFun();
                }else {
                    this.tableConfig.data = this.searchFun().slice((this.tableConfig.pagination.currentPage-1)*this.tableConfig.pagination.pageSize,this.tableConfig.pagination.currentPage*this.tableConfig.pagination.pageSize);
                }
            },
            /*
            *前端搜索函数
            **/ 
            searchFun (params) {
                params = params || {
                    code:this.tableConfig.query.code,
                    name:this.tableConfig.query.name,
                    classification:this.tableConfig.query.classification
                }
                let result = this.tableConfig.cacheData;
                params.code && (result = result.filter(v =>{return  v.code.indexOf(params.code) != -1}));
                params.name && (result = result.filter(v =>{return v.code.indexOf(params.name) != -1}))
                params.classification && (result = result.filter(v =>{return v.classification == params.classification}))
                return result;
            },
            deleteHandler(v) {
                let ids = void(0);
                typeof v == "string"?ids = [v]:ids = this.tableConfig.selection;
                this.tableConfig.cacheData = this.tableConfig.cacheData.filter((val)=>{
                    return ids.indexOf(val.id) == -1;
                })
            },
            resetHandler() {
                this.tableConfig.message = {
                    code:'',
                    name:'',
                    classification:'',
                    classificationName:''
                }
            },
            // 添加返库备件
            spareAddHandler() {
                this.spareDialog.show = true;
            },
            saveSpareDialog(v){
                this.tableConfig.data = v;
                this.tableConfig.cacheData = v;
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
            //currentChange事件
            currentChangeHandler(v) {
                this.tableConfig.pagination.currentPage = v;
                this.getTableFun()
            },
            //selectionChange事件
            selectionChangeHandler(v) {
                this.tableConfig.selection = v.map( v=> v.id);
            },
            selectOnFocus(e) {
                e.target.blur();
            },
        },
        watch:{
            "tableConfig.cacheData":{
                handler(newVal,oldVal) {
                    this.tableConfig.data = newVal;
                },
                deep: true
            }
        }
    }
</script>
