<template>
    <!-- 关闭工单弹窗 -->
    <el-dialog :visible="true" :close-on-click-modal='false' custom-class="orderBackDialog" @close="closeHandler" v-drag>
        <span slot="title" style="color:#666666;">转回工单</span>

        <el-form label-width="165px" :rules="rules" ref="orderBackId" :model="params">
            <el-form-item label="上一节点：" prop="noticeCreator" >
                {{params.preNodeName}}
            </el-form-item>
            <el-form-item label="角色类型：" prop="sendType">
                {{params.preNodeRoleName}}
            </el-form-item>
            <el-form-item label="人员姓名：" prop="assigns">
                {{params.preNodeUserName}}
            </el-form-item>
            <el-form-item label="抄送方式：" prop="notifyNextMethod">
                <el-checkbox-group v-model="params.notifyNextMethod">
                    <el-checkbox label="email">邮件</el-checkbox>
                    <el-checkbox label="sms">短信</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否通知工单创建人：" prop="needNotifyCreater" >
                <el-radio-group  v-model="params.needNotifyCreater" >
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="抄送方式：" prop="notifyCreaterMethod">
                <el-checkbox-group :disabled="params.needNotifyCreater=='0'" v-model="params.notifyCreaterMethod">
                    <el-checkbox label="email">邮件</el-checkbox>
                    <el-checkbox label="sms">短信</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="转回意见：" class="back-textarea" prop="content">
                <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="params.content">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="normal" @click="closeHandler('confirm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props:['value','data'],
        data() {
            return {
                params: {
                    workOrderId: '',
                    workOrderCode: '',
                    processInstanceId: '',
                    currentNodeId: '',
                    currentUserId: '',
                    nextNodeId: '',
                    nextUserId: '',
                    preNodeName: '',
                    preNodeRoleName: '',        
                    preNodeUserName: '',
                    notifyNextMethod: ['email','sms'],
                    needNotifyCreater: 1,
                    notifyCreaterMethod: ['email','sms'],
                    content: ''
                },
                rules:{
                    notifyNextMethod:[
                        { required: true, message: '请选择抄送方式', trigger: 'change' },
                    ],
                    needNotifyCreater:[
                        { required: true, message: '请选择是否通知工单创建人', trigger: 'change' },
                    ],
                    notifyCreaterMethod:[
                        { required: true, message: '请选择抄送方式', trigger: 'change' },
                    ],
                    content:[
                        { required: true, message: '请输入转回意见', trigger: 'change' },
                        { min: 0, max:200, message: '长度为200个字符', trigger: 'change' }
                    ],
                }
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
            })
        },
        methods: {
            init() {
                const self = this;
                // 获取指派信息
                if (this.data) {
                    var result = this.data;
                    for (var k in this.params) {
                        if(result[k]){
                            this.params[k] = result[k];
                        }
                    }
                }
            },
            // 所属区域弹窗确定按钮方法
            closeHandler(type) {
                if (type == 'confirm') {
                    this.$refs['orderBackId'].validate((valid) => {
                        if(valid){
                            var notifyNextMethod = (this.params.notifyNextMethod.indexOf('email') != -1 ? '1' : '0') + (this.params.notifyNextMethod.indexOf('sms') != -1 ? '1' : '0');
                            var notifyCreaterMethod = (this.params.notifyCreaterMethod.indexOf('email') != -1 ? '1' : '0') + (this.params.notifyCreaterMethod.indexOf('sms') != -1 ? '1' : '0');
                            var params = {
                                workOrderId: this.params.workOrderId,
                                workOrderCode: this.params.workOrderCode,
                                processInstanceId: this.params.processInstanceId,
                                currentNodeId: this.params.currentNodeId,
                                currentUserId: this.params.currentUserId,
                                nextNodeId: this.params.nextNodeId,
                                nextUserId: this.params.nextUserId,
                                notifyNextMethod: notifyNextMethod + "0000",
                                needNotifyCreater: this.params.needNotifyCreater,
                                notifyCreaterMethod: notifyCreaterMethod + "0000",
                                content: this.params.content
                            }
                            this.$axios.post('/itsm/process/manager/node/action/reject', params).then((res) => {
                                if (res.status == 200) {
                                    this.$emit('input', '');
                                    this.$emit('operaHandler');
                                }
                            });
                        }
                    })
                    
                } else {
                    this.$emit('input', '');
                }
            },
        },
        watch: {
            'data': {
                handler() {
                    this.init();
                },
                deep: true
            },
            'params.needNotifyCreater'(v){
                if(v==0){
                    this.params.notifyCreaterMethod = [''];
                }else{
                    this.params.notifyCreaterMethod = ['email','sms'];
                }
            }
        }
    }
</script>

