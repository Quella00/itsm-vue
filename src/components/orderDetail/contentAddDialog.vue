<template>
    <!-- 关闭工单弹窗 -->
    <el-dialog :visible="true" :close-on-click-modal='false' custom-class="contentAddDialog" @close="closeHandler">
        <span slot="title" style="color:#666666;">添加内容</span>

        <el-form label-width="158px" :rules="rules" ref="orderCloseId" :model="params">
            <el-form-item label="添加内容：" prop="content">
                <el-input type="textarea" :rows="9" placeholder="请输入内容" v-model="params.content">
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
        props: ['value', 'data'],
        data() {
            return {
                params: {
                    content:''
                },
                rules: {
                    content: [
                        { required: true, message: '请输入内容', trigger: 'change' },
                        { min: 0, max: 200, message: '长度为200个字符', trigger: 'change' }
                    ]
                }
            }
        },
        mounted() {
            console.log(this.$parent.data.workOrderId);
            this.$nextTick(function () {
                this.init();
            })
        },
        methods: {
            init() {
                const self = this;

            },
            closeHandler(type) {
                const self = this;
                if (type == 'confirm') {
                    //判断验证是否通过
                    this.$refs['orderCloseId'].validate((valid) => {
                        if (valid) {
                            var params = {
                                workOrderFormFixed: {
                                    id: self.$parent.data.workOrderId
                                },
                                workOrderFormCustomList: [
                                    {
                                        customFieldId: self.data.customFieldId,
                                        fieldValue: self.data.fieldValue?self.data.fieldValue+'↵'+self.params.content+'('+this.$store.state.user.info.userName+')':self.params.content+'('+this.$store.state.user.info.userName+')'
                                    }
                                ]
                            }
                            this.$axios.post('/itsm/process/manager/workOrder/update', params,{json:true}).then((res) => {
                                if (res.status == 200) {
                                    this.$emit('input', '');
                                    this.$emit('saveAddContent');
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