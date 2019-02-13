<template>
	<div class="itsm-tabs-main uc-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area">
                <div class="panel-header">
                    查询条件
                </div>
                <div class="panel-body search-content" style="min-height: 105px;">
                    <el-form :inline="true" :model="configForm.ruleForm" class="search-conditions" label-width="110px">
                        <el-form-item label="合同名称：">
                            <el-input type="text" v-model="configForm.ruleForm.name" placeholder="请输入合同名称" ></el-input>
                        </el-form-item>
                        <el-form-item label="供应商：">
                            <el-input type="text" v-model="configForm.ruleForm.supplier" placeholder="请输入供应商" ></el-input>
                        </el-form-item>
                        <el-form-item label="服务方式：">
                            <el-select v-model="configForm.ruleForm.serviceMode" placeholder="请选择服务方式" >
                                <el-option v-for="item in configServiceMode.data" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <div class="fl">
                        <el-button type="normal" icon="el-icon-my-delete" @click="handleDelete">删除</el-button>
                        <el-button type="normal" icon="el-icon-my-download" @click="handleDownload">下载模板</el-button>
                        <el-button type="normal" icon="el-icon-my-import" @click="openImportDialog">导入</el-button>
                    </div>

                    <div class="fr">
                        <el-button type="normal" icon="el-icon-my-search" @click="queryUcTable">查询</el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <el-table :data="configTable.data" @selection-change="handleSelectionChange" stripe>
                        <el-table-column type="selection" align="center" width="55"></el-table-column>

                        <el-table-column prop="name" show-overflow-tooltip label="支撑合同名称"></el-table-column>

                        <el-table-column prop="supplier" show-overflow-tooltip label="供应商"></el-table-column>

                        <el-table-column prop="serviceTime" label="服务时间"></el-table-column>

                        <el-table-column prop="serviceMode" label="服务方式"></el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="openUcSave(scope.row)"></i> 
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="configTable.currentPage" :page-sizes="[10, 20, 30, 40]" :page-size="configTable.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
                </div>
            </div>

            <!-- 导入弹窗 -->
            <el-dialog :visible.sync="configImportDialog.show" :close-on-click-modal='false' custom-class="import-dialog-style" @close="saveImportDialog">
                <span slot="title" style="color:#666666;">导入</span>
                
                <div class="content">
                    <el-upload ref="upload" class="upload-demo import-upload" :headers="{Token:token}" :before-upload="beforeUpload" :on-change="onChange" :on-error="onError" :on-success="onSuccess" :show-file-list='false' :action="'/api/itsm/servicelevel/uc/importUcByExcel'" :auto-upload="false">
                        上传文件：
                        <el-input style="width: 200px;" placeholder="文件大小限制为10M" v-model='configImportDialog.fileName' ></el-input>
                        <el-button type="normal" style="height:27px; line-height: 27px; margin-left: 5px;">选择文件</el-button>
                    </el-upload>
                </div>
                    
                <div slot="footer">
                    <el-button type="normal" @click="saveImportDialog('confirm')">确&nbsp;定</el-button>
                </div>
            </el-dialog>
	    </div>
    </div>
</template>

<script>
export default {
	data () {
		return {
            token: this.$store.state.user.info?this.$store.state.user.info.token : '',
            configForm: {
                ruleForm: {     // 数据列表字段
                    name: '',
					supplier: '',
                    serviceMode: ''
                },
                query: {
                    name: '',
					supplier: '',
                    serviceMode: ''
                }
			},
            // 导入弹窗配置
            configImportDialog: {
                show: false,
                fileName: ''
            },
            // 查询条件 -> 服务方式下拉配置
            configServiceMode: {
                data: [    // 数据源
                    { value: '', label: '全部' },
                    { value: '远程', label: '远程' },
                    { value: '现场', label: '现场' }
                ]
            },
            // 数据列表配置
            configTable: {
                selected: [],   // 选中的 id 集合
                currentPage: 1, // 当前页码
                total: 0,       // 数据总数
                pageSize: 10,   // 每页数据
                data: []        // 数据源
            }
		};
	},
    mounted() {
        this.$nextTick(function(){
            this.init();
        })
    },
	methods: {
        init(){
            const self = this;

            self.getUcTable();
        },
        getUcTable(params) {
            params = params || {
                name: this.configForm.query.name,
                supplier: this.configForm.query.supplier,
                serviceMode: this.configForm.query.serviceMode,
                pageNum: this.configTable.currentPage,
                pageSize: this.configTable.pageSize,
            }
            this.$axios.post('/itsm/servicelevel/uc/queryUc',params).then((res) => {
                if(res.status==200){
                    if(res.data){
                        this.configTable.data = res.data.list;
                        this.configTable.total = res.data.total;
                    }else{
                        this.configTable.data = [];
                    } 
                }else{
                    this.$message(res.message);
                }
            });
        },
        queryUcTable() {
            this.configForm.query = this.$ies.deepCopy(this.configForm.ruleForm);

            this.configTable.currentPage = 1;

            this.getUcTable();
        },
        
        // pageSize 改变时会触发
        handleSizeChange(v) {
            var params = {
                name: this.configForm.query.name,
                supplier: this.configForm.query.supplier,
                serviceMode: this.configForm.query.serviceMode,
                pageNum: this.configTable.currentPage,
                pageSize: v
            }
            this.getUcTable(params);
        },
        // currentPage 改变时会触发
        handleCurrentChange(v) {
            var params = {
                name: this.configForm.query.name,
                supplier: this.configForm.query.supplier,
                serviceMode: this.configForm.query.serviceMode,
                pageNum: v,
                pageSize: this.configTable.pageSize
            }
            this.getUcTable(params);
        },
        openUcSave(v) {
            const self = this;
            this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/serviceGrade/ucSave?ucId=' + v.id);
        },
        /*****************删除数据********************/
        handleDelete() {
            const self = this;

            if(!self.configTable.selected.length){
                self.$message.warning('请选中需删除的信息');
                return;
            }

            self.$confirm('请确认是否要删除该信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$axios.post('/itsm/servicelevel/uc/deleteUc?deleteUcIdList='+this.configTable.selected.join(',')).then((res) => {
                    if(res.status==200){
                        this.$message.success(res.message);
                        document.getElementById("fileData")
                        this.refurbishHandler(1);
                    }else{
                        this.$message.error(res.message);
                    }
                });
            }).catch(() => {
                self.$message.info('已取消删除');          
            });
        },
        /*****************下载模板********************/
        handleDownload() {
            window.open("/api/itsm/servicelevel/uc/downloadTemplate?Token="+this.token);
        },
        /*****************导入数据********************/
        openImportDialog() {
            this.configImportDialog.show = true;
        },
        saveImportDialog(v) {
            $('.import-upload .el-upload__input').val('');
            if(v){
                this.$refs.upload.submit();
            }else{
                this.configImportDialog.fileName = '';
                this.configImportDialog.show = false;
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
            this.configImportDialog.fileName = file.name;
        },
        // onError
        onError(err, file, fileList){
            this.$message.error("文件上传失败");
        },
        // onSuccess
        onSuccess(success, file, fileList){
            if(success.status==200){
                this.$message.success(success.message);
                this.configImportDialog.fileName = '';
                this.configImportDialog.show = false;
            }else{
                this.$message.error(success.message);
            }
            this.refurbishHandler(1);
        },
        handleSelectionChange(v) {
            const self = this;

            self.configTable.selected = v.map(v => v.id);
        },

        /**********刷新函数*************/
        resetHandler() {
            this.configForm.ruleForm = {     
                name: '',
                supplier: '',
                serviceMode: ''
            },
            this.configForm.query = {
                name: '',
                supplier: '',
                serviceMode: ''
            }
        },
        refurbishHandler(page){
            this.resetHandler()
            if(page){
                this.configTable.currentPage = page;
            }
            this.getUcTable();
        }
	}
}
</script>

<style lang="less">
    .uc-page {
        .query-area {
            .main {
                height: 110px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding: 35px 0 0 50px;
                .reset-form {
                    .el-form-item {
                        margin: 0 100px 0 60px;
                    }
                }
            }
        }
    }
</style>