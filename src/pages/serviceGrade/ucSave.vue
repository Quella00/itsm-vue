<template>
    <div class="itsm-tabs-main uc-save-page">	
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar">
                <div>
                    <div class="tabs-panel-wrap border basic">
                        <div class="panel-header">
                            基本信息
                        </div>
                        
                        <div class="panel-body body">
                            <el-form :inline="true" :model="configForm.baseInfo" :rules="configForm.rules" ref="baseInfo" class="resetForm">
                                <el-form-item label="支撑合同名称：" prop="name">
                                    <el-input type="text" :disabled="true" v-model="configForm.baseInfo.name" placeholder="请输入支撑合同名称" class="reset-width"></el-input>
                                </el-form-item>

                                <el-form-item label="合同编码：" prop="code">
                                    <el-input type="text" :disabled="true" v-model="configForm.baseInfo.code" placeholder="请输入合同编码" class="reset-width"></el-input>
                                </el-form-item>

                                <el-form-item label="合同类型：" prop="type">
                                    <el-select :disabled="true"  v-model="configForm.baseInfo.type" placeholder="请选择合同类型" class="reset-width">
                                        <el-option label="硬件合同" value="硬件合同" key="1"></el-option>
                                        <el-option label="软件合同" value="软件合同" key="2"></el-option>
                                        <el-option label="服务合同" value="服务合同" key="3"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="供应商：" prop="supplier">
                                    <el-input type="text" :disabled="true" v-model="configForm.baseInfo.supplier" placeholder="请输入供应商" class="reset-width"></el-input>
                                </el-form-item>

                                <el-form-item label="负责人：" prop="superintendentName">
                                    <el-input placeholder="请选择负责人" v-model="configForm.baseInfo.superintendentName" class="reset-width" readonly></el-input>
                                    <i class="el-icon-my-more" @click="openSuperDialog(configForm.baseInfo.superintendent)"></i>
                                </el-form-item>

                                <el-form-item label="服务时间：" prop="serviceTime">
                                    <el-select :disabled="true" v-model="configForm.baseInfo.serviceTime" placeholder="请选择服务时间" class="reset-width">
                                        <el-option label="7*24" value="7*24" key="1"></el-option>
                                        <el-option label="5*8" value="5*8" key="2"></el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="合同金额：" prop="money">
                                    <el-input type="text"  :disabled="true" v-model="configForm.baseInfo.money" placeholder="请输入合同金额" class="reset-width"></el-input>
                                </el-form-item>

                                <el-form-item label="签署日期：" prop="signTime">
                                    <el-date-picker type="date" :disabled="true" placeholder="请选择日期" v-model="configForm.baseInfo.signTime" class="reset-width"></el-date-picker>
                                </el-form-item>

                                <el-form-item label="服务有效期：" prop="validityStartTime">
                                    <el-date-picker type="date" :disabled="true" placeholder="请选择日期" v-model="configForm.baseInfo.validityStartTime" class="reset-width"></el-date-picker>
                                    至 <el-date-picker type="date" :disabled="true" placeholder="请选择日期" v-model="configForm.baseInfo.validityEndTime" class="reset-width"></el-date-picker>
                                </el-form-item>

                                <el-form-item label="关联人员：" prop="associatedUserName">
                                    <el-input @focus="bulrFocus" placeholder="请选择关联人员" v-model="configForm.baseInfo.associatedUserName" readonly style="width: 900px;"></el-input>
                                    <i class="el-icon-my-more" @click="openUserDialog"></i>
                                </el-form-item>
                            </el-form>

                            <el-table class="simple-table" :data="configForm.slaInfo" border style=" width: 85.5%; margin: 10px 0 0 150px;">
                                <el-table-column prop="serviceLevelName" label="等级\KPI" align="center"></el-table-column>

                                <el-table-column prop="responseTime" label="工单响应时间（分钟）" align="center"></el-table-column>

                                <el-table-column prop="recoveryTime" label="工单恢复时间（分钟）" align="center"></el-table-column>

                                <el-table-column prop="resolutionTime" label="服务解决时间（分钟）" align="center"></el-table-column>

                                <el-table-column prop="serviceability" label="可用性（%）" align="center"></el-table-column>

                                <el-table-column prop="stableRunningTime" label="稳定运行时间（分钟）" align="center"></el-table-column>
                            </el-table>
                        </div>
                    </div>

                    <div class="tabs-panel-wrap border">
                        <div class="panel-header">
                            附件上传
                        </div>

                        <div class="panel-body">
                            <div class="content">
                                <el-upload ref="upload" class="upload-demo" :action="'/api/zuul/files/uploadFileReturnIdAndNameAndPath'" :limit="3" list-type="picture" :headers="{Token:token}" :data="{'createUserId':'admin'}"
                                :on-change="handleChange" :before-upload="beforeUpload" :on-success="handleSuccess" :on-error="handlerError"  :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileArr">
                                    上传文件：
                                    <el-input style="width: 200px;" placeholder="最多上传三个附件" v-model="fileName" readonly></el-input> 
                                    <el-button type="normal" slot="trigger" style="height:27px; line-height: 27px; margin-left: 5px;">选择文件(30M)</el-button>
                                </el-upload>
                            </div>
                        </div>
                    </div>

                    <div style=" width: 80px; margin: 25px auto;">
                        <el-button @click="saveUcHandler" type="primary" size="medium">保&nbsp;存</el-button>
					</div>
                </div>
            </ies-scrollbar>

            <!-- 选择关联人员弹窗 -->
            <iesPersonCheckDialog v-model="configUserDialog.show" v-if="configUserDialog.show" :defaultSelect="configUserDialog.defaultSelect" @selectPersonCheckboxHandler="saveUserDialog"></iesPersonCheckDialog>

            <!-- 选择负责人弹窗 -->
            <iesPersonRadioDialog v-model="configSuperDialog.show" v-if="configSuperDialog.show" :defaultSelect="configSuperDialog.defaultSelect" @selectPersonRadioHandler="saveSuperDialog"></iesPersonRadioDialog>
            
        </div>
    </div>
</template>

<script>
export default {
	data () {
		return {
            token: this.$store.state.user.info?this.$store.state.user.info.token : '',
            createUserId: this.$store.state.user.info?this.$store.state.user.info.token : '',
            // 服务时间下拉配置
            configServiceTime: {
                data: [    // 数据源
                    { value: '7*24', label: '7*24' },
                    { value: '5*8', label: '5*8' }
                ]
            },
            configForm: {
                baseInfo: {     // 数据列表字段
                    id: '',
                    name: '',
                    code: '',
                    type: '',
                    supplier: '',
                    superintendent: '',
                    areaName: '',
                    serviceTime: '',
                    money: '',
                    signDate: '',
                    validityStartTime: '',
                    validityEndTime: '',
                    associatedUser: [],
                    associatedUserId: [],
                    associatedUserName: ''
                },
                slaInfo: [],
                ucAttachment: [],
                rules: {    // 数据列表字段的验证规则
                    name: [
                        { required: true, message: '请输入支撑合同名称', trigger: 'change' }
                    ],
                    code: [
                        { required: true, message: '请输入合同编号', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择合同类型', trigger: 'change' }
                    ],
                    supplier: [
                        { required: true, message: '请输入供应商', trigger: 'change' }
                    ],
                    superintendentName: [
                        { required: true, message: '请选择负责人', trigger: 'change' }
                    ],
                    serviceTime: [
                        { required: true, message: '请选择服务时间', trigger: 'change' }
                    ],
                    money: [
                        { required: true, message: '请输入合同金额', trigger: 'change' }
                    ],
                    signDate: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    validityStartTime: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    validityEndTime: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    associatedUserName: [
                        { required: true, message: '请选择关联人员', trigger: 'change' }
                    ]
				}
            },
            fileName: '',
            fileArr: [],
            fileList: [],
            // 选择负责人弹窗配置
            configUserDialog: {
                show: false,    // 弹窗的显示/隐藏
                defaultSelect: {// 选中的用户 id
                    selected:[]
                },   
            },
            configSuperDialog: {
                show: false,
                defaultSelect:{
                    id: ''
                }
                
            },
		};
    },
    mounted() {
        const self = this;
        this.$nextTick(function(){
            self.init();
        })
    },
    activated() {
        const self = this;
        this.$nextTick(function(){
            self.init();
        })
    },
	methods: {
        init(){
            const self = this;
            $(".el-upload-list__item .el-icon-close-tip").remove();
            //获取详细数据
            self.getUcDetail();
        },
        bulrFocus(e) {
            e.target.blur();
        },
        getUcDetail(id){
            id = id || this.$route.query.ucId;
            this.$axios.post('/itsm/servicelevel/uc/queryUcDetail?ucId='+id).then((res) => {
                if(res.status==200){
                    this.configForm.baseInfo = res.data.ucBaseInfo;
                    this.$nextTick(function(){
                        this.$refs['baseInfo'].clearValidate();
                    })
                    this.configForm.slaInfo = res.data.ucSlaInfo;
                    this.configForm.ucAttachment = res.data.ucAttachment||[];
                    this.fileArr =  this.configForm.ucAttachment.map(v=>{
                        var index = v.fileName.lastIndexOf('.');
                        let format = v.fileName.substring(index+1);
                        if(['png','gif','jpg'].indexOf(format)!=-1){//图片
                            var url = 'jpg';
                        } else if (['doc','docx'].indexOf(format)!=-1) {//word
                            var url = 'word';
                        } else if (['rar','zip','pdf'].indexOf(format)!=-1) {//压缩包
                            var url = 'zip';
                        } else if (['ppt','pptx'].indexOf(format)!=-1) {//ppt
                            var url = 'ppt';
                        } else if (['xlsx','xls'].indexOf(format)!=-1) {//excel
                            var url = 'excel';
                        } else if (format == 'txt'){//txt
                            var url = 'txt';
                        } else if (format == 'pdf'){//pdf
                            var url = 'pdf';
                        }
                        
                        return {
                            id:v.fileId,
                            name:v.fileName,
                            url:'/static/img/upload/'+url+'.png'
                        }
                    })
                    this.fileList = this.$ies.deepCopy(this.fileArr);
                    var associatedUser = res.data.ucBaseInfo.associatedUser||[];
                    this.configForm.baseInfo.associatedUser = associatedUser;
                    this.configForm.baseInfo.associatedUserName = associatedUser.map(v => v.userName).join('、');
                    this.configForm.baseInfo.associatedUserId = associatedUser.map(v => v.id);
                    
                }else{
                    this.$message.error(res.message);
                }
            });
        },
        usersubmitForm() {
            const self = this;

            self.$message({ message: '添加成功', type: 'success' });
            self.configUserDialog.show = false;
        },
        // 重置新增或编辑表单
        resetForm() {
            this.$refs['baseInfo'].resetFields();
        },
        /**************负责人员选择弹窗****************/
        // 打开人员选择弹窗
        openSuperDialog(v) {
            this.configSuperDialog.show = true;
            
            this.configSuperDialog.defaultSelect.id = v;
        },
        // 保存人员选择
        saveSuperDialog(row) {
            row = JSON.parse(row);
            this.configForm.baseInfo.superintendent = row.id;
            this.configForm.baseInfo.superintendentName = row.userName;
        },

        /**************关联人员选择弹窗****************/
        // 打开人员选择弹窗
        openUserDialog() {
            this.configUserDialog.show = true;

            this.configUserDialog.defaultSelect.selected = this.configForm.baseInfo.associatedUser;
        },
        // 保存人员选择
        saveUserDialog(rows) {
            this.configForm.baseInfo.associatedUser = rows;
            this.configForm.baseInfo.associatedUserName = rows.map(v => v.userName).join('、');
            this.configForm.baseInfo.associatedUserId = rows.map(v => v.id);
        },

        /**************上传附件****************/
        beforeUpload(file){
            // var flag = true;
            // if(file.size >31457280){
            //     this.$message.error('附件超过30M无法上传');
            //     flag = false;
            // }
            // return flag;
        },
        handleRemove(file, fileArr) {
            this.fileList = fileArr.map(v=>{
                return {
                    id:v.response?v.response.data.id:v.id,
                    name:v.name,
                    url:v.url
                }
            });
        },
        downLoadFile (options) {
            var config = $.extend(true, { method: 'post' }, options);
            var $iframe = $('<iframe id="down-file-iframe" />');
            var $form = $('<form targrt="down-file-iframe" action="/api/itsm/servicelevel/uc/downloadUcAttachment"  method="' + config.method + '" />');
            for (var key in config.data) {
                $form.append('<input type="hidden" name="' + key + '" value="' + config.data[key] + '" />');
            }
            $iframe.append($form);
            $(document.body).append($iframe);
            $form[0].submit();
            $iframe.remove();
        },
        handlePreview(file) {
            if(file.id){
                this.downLoadFile({
                    data:{
                        fileId:file.id,
                        Token: this.token
                    }
                });
            }else{
                this.$message.error('附件未保存无法下载');
            }
        },
        handleSuccess(response, file, fileArr){
            $(".el-upload-list__item .el-icon-close-tip").remove();
            this.fileList = fileArr.map(v=>{
                return {
                    id:v.response?v.response.data.id:v.id,
                    name:v.name,
                    url:v.url
                }
            });
        },
        handlerError() {
            this.$message.error('上传失败');
        },
        handleChange(file, fileList){
            var index = file.name.lastIndexOf('.');
            var fileFormat = ['txt','doc','docx','xlsx','xls','ppt','pptx','png','gif','jpg','rar','zip','pdf'],format = file.name.substring(index+1);
            if(fileFormat.indexOf(format)!=-1){
                this.fileName = file.status == 'fail'?"":file.name;
                if(['png','gif','jpg'].indexOf(format)!=-1){//图片
                    // var url = 'jpg';
                } else if (['doc','docx'].indexOf(format)!=-1) {//word
                    file.url = '/static/img/upload/word.png';
                } else if (['rar','zip','pdf'].indexOf(format)!=-1) {//压缩包
                    file.url = '/static/img/upload/zip.png';
                } else if (['ppt','pptx'].indexOf(format)!=-1) {//ppt
                    file.url = '/static/img/upload/ppt.png';
                } else if (['xlsx','xls'].indexOf(format)!=-1) {//excel
                    file.url = '/static/img/upload/excel.png';
                } else if (format == 'txt'){//txt
                    file.url = '/static/img/upload/txt.png';
                } else if (format == 'pdf'){//pdf
                    file.url = '/static/img/upload/pdf.png';
                }
                
            }else{
                fileList.pop()
                this.$message.error('文件格式错误');
            }
        },
        handleUpload(){
            this.$refs.upload.submit();
        },
        saveUcHandler() {
            const self = this;
			self.$refs['baseInfo'].validate(valid => {
                if (valid) {
                    var fileIds = self.fileList.map(v=>v.id);
                    var params = {
                        ucId : self.$route.query.ucId,
                        superintendent : self.configForm.baseInfo.superintendent,
                        associatedUserList : self.configForm.baseInfo.associatedUserId.join(','),
                        fileIdList : fileIds.join(',')
                    }
                    self.$axios.post('/itsm/servicelevel/uc/saveUc',params).then((res) => {
                        if(res.status==200){
                            self.$ies.dispatch(self, 'layout').$refs.tabsnav.closePage(self.$ies.dispatch(self, 'layout').$refs.tabsnav.currentPage);
                            self.$message.success('修改成功');
                        }else{
                            self.$message.error(res.message);
                        }
                    });
                    
                }
            });	
		}
    },
    watch:{
	    $route(){
			if(this.$route.path == '/serviceGrade/ucSave'){
				if(this.$route.query.ucId !== this.configForm.baseInfo.id) {
                    Object.assign(this.$data, this.$options.data());
					this.init();
				}
			}
        },
        
	}
}
</script>

<style>
    .el-input__icon.el-icon-date{
        line-height: 20px;
    }
</style>
