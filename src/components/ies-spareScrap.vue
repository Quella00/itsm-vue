<template>
    <!-- 新增编辑弹框 -->
    <el-dialog :visible="true" :close-on-click-modal='false' custom-class="orderHandupDialog" @close="submitHandler" v-drag>
        <span slot="title" style="color:#666666;">{{'备件报废'}}</span>

        <el-form label-width="125px" :rules="rules" ref="spareScrap" :model="params" style="margin-top: 35px;">
            <el-form-item label="报废出库单号：" prop="warehouseOutNumber">
                <el-input type="text" :disabled="type=='readonly'" placeholder="请输入内容" class="resetWidth" v-model="params.warehouseOutNumber"></el-input>
            </el-form-item>
            <el-form-item label="说明：" prop="remark">
                <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="params.remark">
                </el-input>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="normal" @click="submitHandler('confirm')">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    export default {
        props: ['value', 'id'],
        data() {
            let validator = this.$ies.validator;
            return {
                type:'writable',
                params: {
                    warehouseOutNumber: '',
                    remark: ''
                },
                rules: {
                    warehouseOutNumber: [
                        { required: true, message: '请输入报废出库单号', trigger: 'change' },
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } }
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
                self.getInitData();
            },
            /*
            * 获取init数据
            **/ 
            getInitData() {
                this.$axios.post('/itsm/device/apply/query4scrap', {id:this.id}).then((res) => {
                    if (res.status==200){
                        if(res.data.status == "出库"){
                            this.type = 'readonly';
                            this.params.warehouseOutNumber = res.data.warehouseOutNumber;
                        }else{
                            this.type = 'writable';
                        }
                    }
                });
            },
            /*
            * 提交
            **/ 
            submitHandler(type) {
                if (type == 'confirm') {
                    this.$refs['spareScrap'].validate((valid) => {
                        if (valid) {
                            let params = {
                                id: this.id,
                                warehouseOutNumber: this.params.warehouseOutNumber,
                                remark: this.params.remark
                            }
                            this.$axios.post('/itsm/device/apply/scrap', params).then((res) => {
                                if (res.status==200){
                                    this.$emit('input', false);
                                    this.$emit('callback');
                                } else {
                                    this.$message.error("操作失败");
                                }
                            });
                        }
                    })
                } else {
                    this.$emit('input', '');
                }
            },
            selectOnFocus(e) {
                e.target.blur();
            },
        }
    }
</script>