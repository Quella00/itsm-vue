<template>
    <div>
        <!-- 新增编辑弹框 -->
        <el-dialog :visible="true" :close-on-click-modal='false' custom-class="toAssertDialog"  @close="submitHandler" v-drag>
            <span slot="title" style="color:#666666;">{{'备件转资产'}}</span>

            <el-form label-width="165px" :rules="rules" ref="spareToAssert" :model="params">
                <el-form-item label="备件出库单号：" prop="warehouseOutNumber">
                    <el-input type="text" placeholder="请输入内容" :disabled="type=='readonly'" class="resetWidth" v-model="params.warehouseOutNumber"></el-input>
                </el-form-item>
                <el-form-item label="说明：" prop="remark">
                    <el-input type="textarea" :rows="6" placeholder="请输入内容" v-model="params.remark">
                    </el-input>
                </el-form-item>
                <el-form-item label="交付人：" prop="deliverName">
                    <el-input readonly v-model="params.deliverName" class="resetWidth" @focus="selectOnFocus"></el-input>
                    <i class="el-icon-my-more" @click="openDeliverDialog"></i>
                </el-form-item>
                <el-form-item label="出库区域：" prop="areaName">
                    <el-input readonly v-model="params.areaName" class="resetWidth" @focus="selectOnFocus"></el-input>
                    <i class="el-icon-my-more" @click="openAreaDialog"></i>
                </el-form-item>
                <el-form-item label="出库建筑：" prop="building">
                    <el-select v-model="params.building" class="resetWidth" @focus="selectOnFocus">
                        <el-option v-for="item in buildingData" :label="item.buildingName" :value="item.buildingId" :key="item.buildingId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出库机房：" prop="machineRoom">
                    <el-select v-model="params.machineRoom" class="resetWidth" @focus="selectOnFocus">
                        <el-option v-for="item in machineRoomData" :label="item.machineRoomName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" size="normal" @click="submitHandler('confirm')">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 区域弹窗 -->
        <iesAreaDialog v-model="areaDialog.show" v-if="areaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='areaDialog.selectId' ></iesAreaDialog>
        <!-- 选择交付人弹窗 -->
        <iesPersonRadioDialog v-model="delivererDialog.show" v-if="delivererDialog.show" :defaultSelect="delivererDialog.defaultSelect" @selectPersonRadioHandler="deliverChooseHandler"></iesPersonRadioDialog>
    </div>
    
</template>

<script>
    export default {
        props: ['value', 'id'],
        data() {
            let validator = this.$ies.validator;
            return {
                type: 'writable',
                areaDialog: {
                    show:false,
                    selectId: ''
                },
                delivererDialog: {
                    show: false,
                    defaultSelect: {
                        id: '',
                        type: ''
                    }
                },
                buildingData: [],
                machineRoomData: [],
                params: {
                    warehouseOutNumber: '',
                    remark: '',
                    deliver: '',
                    deliverName: '',
                    area: '',
                    areaName: '',
                    building: '',
                    machineRoom: ''
                },
                rules: {
                    warehouseOutNumber: [
                        { required: true, message: '请输入备件出库单号', trigger: 'change' },
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } }
                    ],
                    deliverName: [
                        { required: true, message: '请选择交付人', trigger: 'change' },
                    ],
                    remark:[
                    { validator: validator.space, trigger: 'blur', options: { max: 200 } }
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
                // 获取init数据
                self.getInitData();
            },
            /*
            * 获取init数据
            **/ 
            getInitData() {
                this.$axios.post('/itsm/device/apply/query4asset', {id:this.id}).then((res) => {
                    if(res.data.status == "出库"){
                        this.type = 'readonly';
                        this.params.warehouseOutNumber = res.data.warehouseOutNumber;
                    }else{
                        this.type = 'writable';
                    }
                });
            },
            /*
            * 提交
            **/
            submitHandler(type) {
                if (type == 'confirm') {
                    this.$refs['spareToAssert'].validate((valid) => {
                        if (valid) {
                            let params = {
                                id: this.id,
                                warehouseOutNumber: this.params.warehouseOutNumber,
                                remark: this.params.remark,
                                deliver: this.params.deliver,
                                area: this.params.area,
                                building: this.params.building,
                                machineRoom: this.params.machineRoom
                            }
                            this.$axios.post('/itsm/device/apply/asset', params).then((res) => {
                                if(res.status == 200){
                                    this.$emit('input', false);
                                    this.$emit('callback');
                                }else{
                                    this.$message.error(res.message);
                                }
                            });
                        }
                    })
                } else {
                    this.$emit('input', '');
                }
            },
            /*
            * 区域弹框
            **/ 
            openAreaDialog() {
                this.areaDialog.selectId = this.params.area;
                this.areaDialog.show = true;
            },
            areaChooseHandler(node) {
                if(node){
                    this.params.area = node.id;
                    this.params.areaName = node.areaName;
                } else {
                    this.params.area = '';
                    this.params.areaName = '';
                }
            },
            /*
            * 交接人弹框
            **/ 
            openDeliverDialog() {
                this.delivererDialog.defaultSelect.id = this.params.deliver;
                this.delivererDialog.show = true;
            },
            deliverChooseHandler(node) {
                if (node) {
                    node = JSON.parse(node);
                    this.params.deliver = node.id;
                    this.params.deliverName = node.loginName;
                } else {
                    this.params.deliver = '';
                    this.params.deliverName = '';
                }
            },
            /*
            *重置建筑
            ********/
            resetBuilding() {
                this.params.building = '';
                this.params.buildingName = '';
                this.buildingData = [];
            },

            /*
            *重置机房
            ********/
            resetMachineRoom() {
                this.params.machineRoom = '';
                this.params.machineRoomName = '';
                this.machineRoomData = [];
            },

            selectOnFocus(e) {
                e.target.blur();
            },
        },
        watch: {
            'params.area'(v) {
                this.resetBuilding();
                if(v){
                    this.$axios.post('/itsm/system/config/building/queryBuildingByAreaId?areaId='+v).then((res) => {
                        if (res.status==200){
                            this.buildingData = res.data;
                        }
                    });
                }
            },
            'params.building'(v) {
                this.resetMachineRoom();
                if(v){
                    this.$axios.post('/itsm/system/config/machineRoom/queryMachineRoomByBuildingId?buildingId='+v).then((res) => {
                        this.machineRoomData = res;
                    });
                }
            }
        }
    }

</script>