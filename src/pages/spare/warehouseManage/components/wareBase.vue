<template>
    <div>
        <el-form label-width="135px" :model="params" ref="baseForm" :rules="rules" :inline="true" style="margin-top: 20px;">
            <el-form-item label="入库类型：" prop="warehouseInType">
                <span class="el-span" v-if="type=='show'">{{params.warehouseInType}}</span>
                <el-select v-model="params.warehouseInType" v-else @focus="selectOnFocus">
                    <el-option label="维护" value="维护"></el-option>
                    <el-option label="送修" value="送修"></el-option>
                    <el-option label="归还" value="归还"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="所属库房：" prop="storeRoom">
                <span class="el-span" v-if="type=='show'">{{params.storeRoomName}}</span>
                <template v-else>
                    <el-input readonly v-model="params.storeRoomName" @focus="selectOnFocus"></el-input>
                    <i class="el-icon-my-more"  @click="openStoreDialog"></i>
                </template>
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
            <el-form-item label="入库单：" prop="warehouseInNumber">
                <span class="el-span" v-if="type=='show'">{{params.warehouseInNumber}}</span>
                <el-input v-else v-model="params.warehouseInNumber" ></el-input>
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
                params: {
                    warehouseInType: '',
                    storeRoom: '',
                    storeRoomName: '',
                    createUserName: '',
                    deliver: '',
                    deliverName: '',
                    warehouseInNumber: '',
                    remark: ''
                },
                rules: {
                    warehouseInType: [
                        { required: true, message: '请选择库房类型', trigger: 'change' }
                    ],
                    storeRoom: [
                        { required: true, message: '请选择所属库房', trigger: 'change' }
                    ],
                    deliver: [
                        { required: true, message: '请选择交付人', trigger: 'change' }
                    ],
                    warehouseInNumber: [
                        { required: true, message: '请输入入库单', trigger: 'change' },
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
                if (this.type == 'show') {
                    self.params = Object.assign({},self.params, self.data);
                }else{
                    self.params.createUserName = self.$store.state.user.info.userName;
                }
                
            },
            /******************库房管理弹框********************/ 
            openStoreDialog() {
                this.storeDialog.selectId = this.params.storeRoom;
                this.storeDialog.show = true;
            },
            storeChooseHandler(node) {
                if (node) {
                    this.params.storeRoom = node.id;
                    this.params.storeRoomName = node.storeRoomName;
                } else {
                    this.params.storeRoom = '';
                    this.params.storeRoomName = '';
                }
            },
            /*******************交接人弹框*********************/ 
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
            selectOnFocus(e) {
                e.target.blur();
            },
        }
    }

</script>