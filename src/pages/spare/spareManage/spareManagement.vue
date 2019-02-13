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
                        <el-form-item label="审核状态：">
                            <el-select v-model="tableConfig.message.auditStatus" placeholder="请选择审核状态" @focus="selectOnFocus">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="审核通过" value="3"></el-option>
                                <el-option label="审核未通过" value="2"></el-option>
                                <el-option label="未提交审核" value="1"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属库房：">
                            <el-input v-model="tableConfig.message.storeRoomName" placeholder="请选择所属库房" @focus="selectOnFocus" readonly></el-input>
                            <i class="el-icon-my-more" @click="openStoreDialog"></i>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>

                <div class="panel-header">
                    <span class="fl">
                            <el-button type="primary"  icon="el-icon-my-import" size="normal" @click="importHandler">备件导入</el-button>
                            <el-button type="primary" icon="el-icon-my-download" size="normal" @click="downloadHandler">下载导入模板</el-button>
                            <el-button type="primary" icon="el-icon-my-export" size="normal" @click="exportHandler">导出</el-button>
                        </span>
                    <span class="fr">
                            <el-button type="primary" icon="el-icon-my-search" size="normal" @click="queryHandler">查询</el-button>
                            <el-button type="primary" icon="el-icon-my-reset" size="normal" @click="resetHandler">重置</el-button>
                            <el-button type="primary" icon="el-icon-my-circleAdd" size="normal" @click="spareAddHandler">新增</el-button>
                        </span>
                </div>
                <div class="panel-body">
                    <el-table :data="tableConfig.data" @selection-change="handleSelectionChange" >
                        <el-table-column type="selection" width="55" align="center"></el-table-column>
                        <el-table-column label="资产编码" show-overflow-tooltip prop="code"></el-table-column>
                        <el-table-column label="备件名称" show-overflow-tooltip prop="name"></el-table-column>
                        <el-table-column label="资产分类" show-overflow-tooltip prop="classificationName"></el-table-column>
                        <el-table-column label="审核状态" show-overflow-tooltip prop="auditStatus">
                            <template slot-scope="scope">
                                    {{scope.row.auditStatus==1?"未提交审核":scope.row.auditStatus==2?"审核未通过":"审核通过"}}
                            </template>
                        </el-table-column>
                        <el-table-column label="更新时间" show-overflow-tooltip prop="createTime"></el-table-column>
                        <el-table-column label="操作" show-overflow-tooltip prop="operation" width="150">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit ml5" title="编辑" @click="editHandler(scope.row.id)"></i>
                                <i class="el-icon-my-delete ml5" title="删除" @click="deleteHandler(scope.row.id)"></i>
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
        <!-- 导入弹窗 -->
        <el-dialog :visible.sync="importDialog.show" :close-on-click-modal='false' custom-class="import-dialog-style" @close="saveImportDialog" v-drag>
            <span slot="title" style="color:#666666;">导入</span>

            <div class="content">
                <el-upload ref="upload" class="upload-demo import-upload" :headers="{Token:token}" :before-upload="beforeUpload" :on-change="onChange"
                    :on-error="onError" :on-success="onSuccess" :show-file-list='false' :action="'/api/itsm/device/import'"
                    :auto-upload="false">
                    上传文件：
                    <el-input style="width: 200px;" readonly placeholder="文件大小限制为10M" v-model='importDialog.fileName'></el-input>
                    <el-button type="normal" style="height:27px; line-height: 27px; margin-left: 5px;">选择文件</el-button>
                </el-upload>
            </div>

            <div slot="footer">
                <el-button type="normal" @click="saveImportDialog('confirm')">确&nbsp;定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    export default {
        data() {
            const validator = this.$ies.validator;

            return {
                selection: [],
                token: this.$store.state.user.info?this.$store.state.user.info.token : '',
                // 资产分类弹框配置
                assetDialog: {
                    show: false,
                    selectId: ''
                },
                // 库房弹窗配置
                storeDialog: {
                    show: false,
                    selectId: ''
                },
                // 导入弹框
                importDialog: {
                    show:false,
                    fileName:''
                },
                // 表格配置
                tableConfig: {
                    message: {
                        code: '',
                        name: '',
                        classification: '',
                        classificationName: '',
                        auditStatus: '',
                        storeRoomId: '',
                        storeRoomName: ''
                    },
                    query: {
                        code: '',
                        name: '',
                        classification: '',
                        classificationName: '',
                        auditStatus: '',
                        storeRoomId: '',
                        storeRoomName: ''
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
                    needApprove: 0,
                    code: this.tableConfig.query.code,
                    name: this.tableConfig.query.name,
                    classification: this.tableConfig.query.classification,
                    auditStatus: this.tableConfig.query.auditStatus,
                    storeRoomId: this.tableConfig.query.storeRoomId,
                    pageNum: this.tableConfig.pagination.currentPage,
                    pageSize: this.tableConfig.pagination.pageSize,
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
            // 备件导入
            importHandler() {
                this.importDialog.show = true;
            },
            saveImportDialog(v) {
                $('.import-upload .el-upload__input').val('');
                if(v){
                    this.$refs.upload.submit();
                }else{
                    this.importDialog.fileName = '';
                    this.importDialog.show = false;
                }
            },
            // beforeUpload
            beforeUpload(file){
                var index = file.name.lastIndexOf('.'), format = file.name.substring(index+1),flag = true;
                if(file.size>10485760){
                    this.$message.error('文件大小超过10M限制!');
                    flag = false;
                }
                if(['xlsx','xls'].indexOf(format)==-1){
                    this.$message.error('请导入xls、xlsx格式文件!');
                    flag = false;
                }
                return flag;
            },
            // onChange
            onChange(file,fileList){
                this.importDialog.fileName = file.name;
            },
            // onError
            onError(err, file, fileList){
                this.$message.error("文件上传失败");
            },
            // onSuccess
            onSuccess(success, file, fileList){
                if(success.status==200){
                    if(success.message){
                        var message = `成功导入${success.data}条数据：`;
                        for(var k in success.message){
                            message = message+` <br/> ERROR IN 第${k}行：`
                            var arr = success.message[k].map((v)=>{
                                return v.replace(" ","列  ");
                            })
                            message = message + arr.join(',');
                        }
                        
                        this.$message({
                            message:message,
                            type: success.message ? "error" : 'success',
                            duration:5000,
                            dangerouslyUseHTMLString:true
                        });
                    }else{
                        this.$message.success('全部导入成功！');
                    }
                    this.importDialog.fileName = '';
                    this.importDialog.show = false;
                }else{
                    this.$message.error('导入失败！');
                }
                this.resetHandler();
                this.queryHandler();
            },
            // 下载导入模板
            downloadHandler() {
                window.open("/api/itsm/device/downloadTemplate?Token="+this.token);
            },
            // 导出
            exportHandler() {
                if(this.selection.length == 0) {
					this.$message.warning('请至少选择一条数据！');
					return;
				}
				window.open(`/api/itsm/device/export?idList=${this.selection.join()}&Token=${this.token}`);
            },
            // 删除
            deleteHandler(v) {
                this.$confirm('是否删除选中对象?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post('/itsm/device/delete', { id: v}).then((res) => {
                        if(res.status == 200) {
                            if(res.data){
                                this.getTableFun();
                                this.$message.success('备件删除成功');
                            }else{
                                this.$message.warning(res.message);
                            }
                        } else {
                            this.$message.error(res.message);
                        }
                    });
                }).catch(() => {
                    this.$message.info('已取消删除');          
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
                    code: '',
                    name: '',
                    classification: '',
                    classificationName: '',
                    auditStatus: '',
                    storeRoomId: '',
                    storeRoomName: ''
                };
            },
            // 新增
            spareAddHandler() {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/spareAdd');
            },
            // 编辑
            editHandler(id) {
                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage(`/spare/spareEdit?id=${id}`);
            },
            // 资产分类选择
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
            handleSelectionChange(v) {
                this.selection = v.map(v => v.id);
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