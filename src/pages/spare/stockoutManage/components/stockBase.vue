<template>
        <div>
            <el-form label-width="135px" :model="params" ref="baseForm" :rules="rules" :inline="true" style="margin-top: 20px;">
                <el-form-item label="出库类型：" prop="warehouseOutType">
                    <span class="el-span" v-if="type=='show'">{{params.warehouseOutType}}</span>
                    <el-select v-model="params.warehouseOutType" v-else @focus="selectOnFocus">
                        <el-option label="领用" value="领用"></el-option>
                        <el-option label="送修" value="送修"></el-option>
                        <el-option label="调拨" value="调拨"></el-option>
                        <el-option label="借用" value="借用"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作人："  prop="createUserName">
                    <span class="el-span">{{params.createUserName}}</span>
                </el-form-item>
                <el-form-item label="交付人："  prop="deliver">
                    <span class="el-span" v-if="type=='show'">{{params.deliverName}}</span>
                    <template v-else>
                        <el-input readonly v-model="params.deliverName" @focus="selectOnFocus"></el-input>
                        <i class="el-icon-my-more" @click="openDeliverDialog"></i>
                    </template>
                </el-form-item>
                <el-form-item label="出库单：" prop="warehouseOutNumber">
                    <span class="el-span" v-if="type=='show'||type=='edit'">{{params.warehouseOutNumber}}</span>
                    <el-input v-model="params.warehouseOutNumber" v-else></el-input>
                </el-form-item>
                <el-form-item label="出库区域：" prop="areaName">
                    <span class="el-span" v-if="type=='show'">{{params.areaName}}</span>
                    <template v-else>
                        <el-input readonly v-model="params.areaName" @focus="selectOnFocus"></el-input>
                        <i class="el-icon-my-more"  @click="openAreaDialog"></i>
                    </template>
                </el-form-item>
                <el-form-item label="出库建筑：" prop="building">
                    <span class="el-span" v-if="type=='show'">{{params.buildingName}}</span>
                    <el-select v-model="params.building" v-else @focus="selectOnFocus"  placeholder="请先选择出库区域">
                        <el-option v-for="item in buildingData" :label="item.buildingName" :value="item.buildingId" :key="item.buildingId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="出库机房：" prop="machineRoom">
                    <span class="el-span" v-if="type=='show'">{{params.machineRoomName}}</span>
                    <el-select v-model="params.machineRoom" v-else @focus="selectOnFocus" placeholder="请先选择出库建筑">
                        <el-option v-for="item in machineRoomData" :label="item.machineRoomName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注：" prop="remark" class="basicInfoRemark" style="display: block;">
                    <span class="el-span el-text" v-if="type=='show'">{{params.remark}}</span>
                    <el-input type="textarea" v-model="params.remark" v-else></el-input>
                </el-form-item>
            </el-form>
            <!-- 库房选择弹窗 -->
            <iesStoreRoomDialog v-model="storeDialog.show" v-if="storeDialog.show" @storeChooseHandler="storeChooseHandler" :defaultSelect='storeDialog.selectId'></iesStoreRoomDialog>
            <!-- 选择交付人弹窗 -->
            <iesPersonRadioDialog v-model="delivererDialog.show" v-if="delivererDialog.show" :defaultSelect="delivererDialog.defaultSelect" @selectPersonRadioHandler="deliverChooseHandler"></iesPersonRadioDialog>
            <!-- 区域弹窗 -->
            <iesAreaDialog v-model="areaDialog.show" v-if="areaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='areaDialog.selectId' ></iesAreaDialog>
        </div>
    
    </template>
    
    <script>
        export default {
            props: ['type', 'data'],
            data() {
                const validator = this.$ies.validator;
    
                return {
                    // 库房弹窗配置
                    storeDialog: {
                        show: false,
                        selectId: ''
                    },
                    delivererDialog: {
                        show: false,
                        defaultSelect: {
                            id:'',
                            type:''
                        }
                    },
                    areaDialog: {
                        show:false,
                        selectId: ''
                    },
                    buildingData: [],
                    machineRoomData: [],
                    params: {
                        warehouseOutType: '',
                        storeRoom: '',
                        storeRoomName: '',
                        deliver: '',
                        deliverName: '',
                        warehouseOutNumber: '',
                        createUserName: '',
                        area: '',
                        areaName: '',
                        building: '',
                        buildingName: '',
                        machineRoom: '',
                        machineRoomName: '',
                        remark: ''
                    },
                    rules: {
                        warehouseOutType: [
                            { required: true, message: '请选择库房类型', trigger: 'change' }
                        ],
                        storeRoom: [
                            { required: true, message: '请选择所属库房', trigger: 'change' }
                        ],
                        deliver: [
                            { required: true, message: '请选择交接人', trigger: 'change' }
                        ],
                        warehouseOutNumber: [
                            { required: true, message: '请输入出库单', trigger: 'change' },
                            { validator: validator.space, trigger: 'blur', options: { max: 20 } }
                        ],
                        remark: [
                            { validator: validator.space, trigger: 'blur', options: { max: 200 } }
                        ]
                    }
                };
            },
            mounted() {
                this.init();
            },
            methods: {
                init() {
                    const self = this;
                    // 文本域设置宽度
                    var parentWidth = $(".basicInfoRemark").parent().width();
                    var myselfWidth = parentWidth - 275;
                    var oldWidth = $(".basicInfoRemark .el-form-item__content").width();
                    $(".basicInfoRemark .el-form-item__content").width(myselfWidth);
                    if (self.data) {
                        self.params = Object.assign(self.params, self.data);
                        console.log(self.data)
                        console.log(self.params)
                    } else {
                        self.params.createUserName = self.$store.state.user.info.userName;
                    }
                },
                /*
                *库房管理弹框
                ************/ 
                openStoreDialog() {
                    this.storeDialog.selectId = this.params.storeRoom;
                    this.storeDialog.show = true;
                },
                storeChooseHandler(node) {
                    if (node) {
                        this.storeDialog.selectId = node.id;
                        this.params.storeRoom = node.id;
                        this.params.storeRoomName = node.storeRoomName;
                    } else {
                        this.storeDialog.selectId = '';
                        this.params.storeRoom = '';
                        this.params.storeRoomName = '';
                    }
                },
                /*
                *交接人弹框
                **********/ 
                openDeliverDialog() {
                    this.delivererDialog.defaultSelect.id = this.params.delivererId;
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
                *区域弹框
                ********/ 
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
                *重置建筑
                ********/
                resetBuilding(){
                    this.params.building = '';
                    this.params.buildingName = '';
                    this.buildingData = [];
                },

                /*
                *重置机房
                ********/
                resetMachineRoom(){
                    this.params.machineRoom = '';
                    this.params.machineRoomName = '';
                    this.machineRoomData = [];
                },

                selectOnFocus(e) {
                    e.target.blur();
                }
            },
            watch: {
                'params.area'(v) {
                    if(this.type=='show'){
                        return false;
                    } 
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
                    if(this.type=='show'){
                        return false;
                    } 
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