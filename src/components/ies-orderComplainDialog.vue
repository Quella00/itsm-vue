<template>
    <!-- 关闭工单弹窗 -->
    <el-dialog :visible="true" :close-on-click-modal='false' custom-class="orderComplainDialog" @close="closeHandler" v-drag>
        <span slot="title" style="color:#666666;">投诉</span>

        <el-form label-width="140px" :rules="rules" ref="orderCloseId" :model="params">
            <el-form-item label="被投诉人：" prop="respondentUserName" >
                {{params.respondentUserName}}
            </el-form-item>
            <el-form-item label="投诉内容：" prop="complainContent">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="params.complainContent">
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
                params:{
                    workOrderId: '',
                    processInstanceId: '',
                    workOrderName: '',
                    complainNodeId: '',
                    complainUserId: '',
                    respondentNodeId: '',
                    respondentUserId: '',
                    respondentUserName: '',
                    complainContent: ''
                },
                rules:{
                    complainContent:[
                        { required: true, message: '请输入投诉内容', trigger: 'change' },
                        { min: 0, max:200, message: '长度为200个字符', trigger: 'change' }
                    ]
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
                        if(k == 'respondentNodeId'){
                            this.params[k] = result.currentNodeId;
                        }else if(k == 'respondentUserId'){
                            this.params[k] = result.currentUserId;
                        } else if(k == 'respondentUserName'){
                            this.params[k] = result.currentUserName;
                        } else {
                            this.params[k] = result[k] || '';
                        }
                    }
                }

            },
            closeHandler(type) {
                if (type == 'confirm') {
                    //判断验证是否通过
                    this.$refs['orderCloseId'].validate((valid) => {
                        if(valid){
                            var params = {
                                workOrderId: this.params.workOrderId,
                                processInstanceId: this.params.processInstanceId,
                                workOrderName: this.params.workOrderName,
                                complainNodeId: this.params.complainNodeId,
                                complainUserId: this.params.complainUserId,
                                respondentNodeId: this.params.respondentNodeId,
                                respondentUserId: this.params.respondentUserId,
                                complainContent: this.params.complainContent
                            }
                            this.$axios.post('/itsm/process/manager/complain/save', params).then((res) => {
                                if (res.status == 200) {
                                    this.$emit('input', '');
                                    // this.$emit('operaHandler');
                                }
                            });
                        }
                    })
                    
                } else {
                    this.$emit('input', '');
                }
            },
        },
    }
</script>

