<!-- 新增资产 -->
<template>
    <div class="itsm-tabs-main add-edit-spare">
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
                <div class="add-edit-spare-container">
                    <div>
                        <el-collapse v-model="activeNames">
                            <el-collapse-item name="1">
                                <template slot="title">
                                    基础信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="basicInfoForm" :rules="basicInfoRules" ref="basicInfoForm" :inline="true" style="margin-top: 20px;">
                                    <el-form-item label="资产编码：" prop="code">
                                        <span style="width:234px;display:inline-block">{{basicInfoForm.code}}</span>
                                    </el-form-item>
                                    <el-form-item label="备件名称：" prop="name">
                                        <el-input v-model="basicInfoForm.name" placeholder="请输入资产名称"></el-input>
                                    </el-form-item>
                                    <el-form-item label="资产分类：" prop="classificationName">
                                        <el-input readonly v-model="basicInfoForm.classificationName" placeholder="请选择资产分类" @focus="selectOnFocus"></el-input>
                                        <i class="el-icon-my-more" @click="openDialog('classification')"></i>
                                    </el-form-item>
                                    <el-form-item label="厂商：" prop="manufacturer">
                                        <el-input v-model="basicInfoForm.manufacturer" placeholder="请输入厂商"></el-input>
                                    </el-form-item>
                                    <el-form-item label="型号：" prop="model">
                                        <el-input v-model="basicInfoForm.model" placeholder="请输入型号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="序列号：" prop="serialNo">
                                        <el-input v-model="basicInfoForm.serialNo" placeholder="请输入序列号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="条形码：" prop="barCode">
                                        <el-input v-model="basicInfoForm.barCode" placeholder="请输入条形码"></el-input>
                                    </el-form-item>
                                    <el-form-item label="管理IP：" prop="managementIp">
                                        <el-input v-model="basicInfoForm.managementIp" placeholder="请输入管理IP"></el-input>
                                    </el-form-item>
                                    <el-form-item label="所属单位：" prop="subordinateUnit">
                                        <el-input v-model="basicInfoForm.subordinateUnit" placeholder="请输入所属单位"></el-input>
                                    </el-form-item>
                                    <el-form-item label="承载业务：" prop="carryingBusiness">
                                        <el-input v-model="basicInfoForm.carryingBusiness" placeholder="请输入承载业务"></el-input>
                                    </el-form-item>
                                    <el-form-item label="所属库房：" prop="storeRoomName">
                                        <el-input readonly v-model="basicInfoForm.storeRoomName" placeholder="请选择所属库房" @focus="selectOnFocus"></el-input>
                                        <i class="el-icon-my-more" @click="openDialog('store')"></i>
                                    </el-form-item>
                                    <el-form-item label="入库单：" prop="warehouseInNumber">
                                        <span style="width:234px;display:inline-block">{{basicInfoForm.warehouseInNumber}}</span>
                                    </el-form-item>
                                    <el-form-item label="入库类型：" prop="warehouseType">
                                        <span style="width:234px;display:inline-block">新增</span>
                                    </el-form-item>
                                    <el-form-item label="备注：" prop="remark" id="basicInfoRemark" style="display: block;">
                                        <el-input type="textarea" v-model="basicInfoForm.remark" placeholder="请输入备注"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="2">
                                <template slot="title">
                                    维保信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="maintenanceInfoForm" :rules="maintenanceInfoRules" ref="maintenanceInfoForm" :inline="true"
                                    style="margin-top: 20px;" class="demo-form-inline">
                                    <el-form-item label="维保状态 :" prop="maintenanceStatus">
                                        <el-select v-model="maintenanceInfoForm.maintenanceStatus" @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="在保中" value="在保中"></el-option>
                                            <el-option label="已过保" value="已过保"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="维保日期：" prop="maintenanceDate" class="date">
                                        <el-date-picker v-model="maintenanceInfoForm.maintenanceDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择维保日期"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="使用年限(年)：" prop="lifeSpan">
                                        <el-input v-model="maintenanceInfoForm.lifeSpan" placeholder="请输入使用年限"></el-input>
                                    </el-form-item>
                                    <el-form-item label="折扣率(%)：" prop="depreciationRate">
                                        <el-input v-model="maintenanceInfoForm.depreciationRate" placeholder="请输入折扣率"></el-input>
                                    </el-form-item>
                                    <el-form-item label="生命周期(月)：" prop="lifeCycle">
                                        <el-input v-model="maintenanceInfoForm.lifeCycle" placeholder="请输入生命周期"></el-input>
                                    </el-form-item>
                                    <el-form-item label="保修期(月)：" prop="warranty">
                                        <el-input v-model="maintenanceInfoForm.warranty" placeholder="请输入保修期"></el-input>
                                    </el-form-item>
                                    <el-form-item label="可用性：" prop="availability">
                                        <el-select v-model="maintenanceInfoForm.availability" @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="已检可用" value="已检可用"></el-option>
                                            <el-option label="已检不可用" value="已检不可用"></el-option>
                                            <el-option label="未检新品" value="未检新品"></el-option>
                                            <el-option label="未检坏件" value="未检坏件"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="可用性检查日期：" prop="dateOfAvailabilityCheck" class="date">
                                        <el-date-picker v-model="maintenanceInfoForm.dateOfAvailabilityCheck" type="date" :editable="false" value-format="yyyy-MM-dd"
                                            placeholder="请选择可用性检查日期"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="3">
                                <template slot="title">
                                    扩展属性<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="extendedAttributeForm" :rules="extendedAttributeRules" ref="extendedAttributeForm" :inline="true"
                                    style="margin-top: 20px;">
                                    <el-form-item label="接口数量(个)：" prop="interfaceNumber">
                                        <el-input v-model="extendedAttributeForm.interfaceNumber" placeholder="请输入接口数量"></el-input>
                                    </el-form-item>
                                    <el-form-item label="管理接口：" prop="managementInterface">
                                        <el-input v-model="extendedAttributeForm.managementInterface" placeholder="请输入管理接口"></el-input>
                                    </el-form-item>
                                    <el-form-item label="CPU型号：" prop="cpuModel">
                                        <el-input v-model="extendedAttributeForm.cpuModel" placeholder="请输入CPU型号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="可用接口数量(个)：" prop="availableInterfaceNumber">
                                        <el-input v-model="extendedAttributeForm.availableInterfaceNumber" placeholder="请输入可用接口数量"></el-input>
                                    </el-form-item>
                                    <el-form-item label="额定功率(W)：" prop="ratedPower">
                                        <el-input v-model="extendedAttributeForm.ratedPower" placeholder="请输入额定功率"></el-input>
                                    </el-form-item>
                                    <el-form-item label="内存大小(G)：" prop="memorySize">
                                        <el-input v-model="extendedAttributeForm.memorySize" placeholder="请输入内存大小"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="4">
                                <template slot="title">
                                    财务信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="financeInfoForm" :rules="financeInfoRules" ref="financeInfoForm" :inline="true" style="margin-top: 20px;">
                                    <el-form-item label="采购单号：" prop="purchaseOrderNo">
                                        <el-input v-model="financeInfoForm.purchaseOrderNo" placeholder="请输入采购单号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购价(元)：" prop="purchasePrice">
                                        <el-input v-model="financeInfoForm.purchasePrice" placeholder="请输入采购价"></el-input>
                                    </el-form-item>
                                    <el-form-item label="设备权属：" prop="equipmentOwnership">
                                        <el-input v-model="financeInfoForm.equipmentOwnership" placeholder="请输入设备权属"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购日期：" prop="purchaseDate" class="date">
                                        <el-date-picker v-model="financeInfoForm.purchaseDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择采购日期"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="到货日期：" prop="arrivalDate" class="date">
                                        <el-date-picker v-model="financeInfoForm.arrivalDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择到货日期"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="财务编号：" prop="financialNumber">
                                        <el-input v-model="financeInfoForm.financialNumber" placeholder="请输入财务编号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购合同号：" prop="purchaseContractNo">
                                        <el-input v-model="financeInfoForm.purchaseContractNo" placeholder="请输入采购合同号"></el-input>
                                    </el-form-item>
                                    <el-form-item label="产权类型：" prop="propertyType">
                                        <el-select v-model="financeInfoForm.propertyType" @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="购买" value="购买"></el-option>
                                            <el-option label="租借" value="租借"></el-option>
                                            <el-option label="合股" value="合股"></el-option>
                                            <el-option label="受赠" value="受赠"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="启用日期：" prop="enableDate" class="date">
                                        <el-date-picker v-model="financeInfoForm.enableDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择启用日期"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="停止日期：" prop="disableDate" class="date">
                                        <el-date-picker v-model="financeInfoForm.disableDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择停止日期"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报废日期：" prop="scrapDate" class="date">
                                        <el-date-picker v-model="financeInfoForm.scrapDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择报废日期"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                    </div>

                    <div class="btn-index">
                        <el-button type="normal" @click="submit('audit')" style="padding:0 16px;">提交审核</el-button>
                        
                        <el-button type="normal" @click="submit('save')"  style="padding:0 30px;">保存</el-button>
                    </div>
                </div>
            </ies-scrollbar>
        </div>
        <!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog>
        <!-- 库房选择弹窗 -->
        <iesStoreRoomDialog v-model="storeDialog.show" v-if="storeDialog.show" @storeChooseHandler="storeChooseHandler" :defaultSelect='storeDialog.selectId'></iesStoreRoomDialog>
    </div>
</template>

<script>
    export default {
        name: 'spareEdit',
        data() {
            let validator = this.$ies.validator;
            // 验证管理IP
            var checkManagementIp = (rule, value, callback) => {
                var check = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                if (value != "" && value != undefined) {
                    if (!check.test(value)) {
                        return callback(new Error('管理IP格式不正确'));
                    } else {
                        return callback();
                    }
                } else {
                    return callback();
                }
            };
            // 验证手机号
            var checkPhone = (rule, value, callback) => {
                var check = /^1[3|4|5|7|8]\d{9}$/;
                if (value != "" && value != undefined) {
                    if (!check.test(value)) {
                        return callback(new Error('手机号格式不正确'));
                    } else {
                        return callback();
                    }
                } else {
                    return callback();
                }
            };
            // 折扣率(0到100的小数或整数,小数保留两位)
            var checkDepreciationRate = (rule, value, callback) => {
                var check = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/;
                if (value != "" && value != undefined) {
                    if (!check.test(value)) {
                        return callback(new Error('为0~100内的整数或最多两位小数'));
                    } else {
                        return callback();
                    }
                } else {
                    return callback();
                }
            };
            // 验证采购价(一共12位，小数的话保留两位小数(两位小数的正实数))
            var checkPurchasePrice = (rule, value, callback) => {
                var check = /^[0-9]+(.[0-9]{1,2})?$/;
                if (value != "" && value != undefined) {
                    if (!check.test(value)) {
                        return callback(new Error("格式错误(为两位小数内的正实数)"));
                    } else {
                        return callback();
                    }
                } else {
                    return callback();
                }
            };
            // 验证为多少位数字
            var checkNumber = (rule, value, callback) => {
                var check = new RegExp("^\\d{1," + rule.length.max + "}$");
                if (value != "" && value != undefined) {
                    if (!check.test(value)) {
                        return callback(new Error("格式错误(最多为" + rule.length.max + "位数字)"));
                    } else {
                        return callback();
                    }
                } else {
                    return callback();
                }
            };
            // 验证资产编码
            var checkCode = (rule, value, callback) => {
                var check = /^[\u4e00-\u9fa5-/()（）a-zA-Z0-9]+$/;
                if (!check.test(value)) {
                    return callback(new Error("只能由-/()中文英文数字组成"));
                } else {
                    return callback();
                }
            };
            return {
                id: '',
                activeNames: ['1', '2', '3', '4'],
                // 基础信息
                basicInfoForm: {
                    code: "FF1123135156", 		// 资产编码
                    name: "", 					// 资产名称
                    classification: "", 		// 资产分类
                    classificationName: "", 	// 资产分类~名字
                    manufacturer: "", 			// 厂商
                    model: "", 					// 型号
                    serialNo: "", 				// 序列号
                    barCode: "", 				// 条形码
                    managementIp: "", 			// 管理IP
                    subordinateUnit: "", 		// 所属单位
                    carryingBusiness: "", 		// 承载业务
                    storeRoom: "",            // 所属库房~ID
                    storeRoomName: "",          // 所属库房~Name
                    warehouseInNumber: "", // 入库单
                    remark: "" 					// 备注
                },
                basicInfoRules: {
                    code: [						// 资产编码
                        { validator: validator.space, trigger: 'blur', options: { max: 32 } },
                        { required: true, message: '请输入资产编码', trigger: 'blur' },
                        { validator: checkCode, trigger: 'blur' }
                    ],
                    name: [						// 资产名称
                        { validator: validator.space, trigger: 'blur', options: { max: 32 } },
                        { required: true, message: '请输入资产名称', trigger: 'blur' }
                    ],
                    manufacturer: [				// 厂商
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } }
                    ],
                    classificationName: [		// 资产分类
                        { required: true, message: '请选择资产分类', trigger: 'change' }
                    ],
                    model: [					// 型号
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                        { required: true, message: '请输入型号', trigger: 'blur' }
                    ],
                    serialNo: [					// 序列号
                        { validator: validator.space, trigger: 'blur', options: { max: 30 } },
                    ],
                    barCode: [					// 条形码
                        { validator: validator.space, trigger: 'blur', options: { max: 30 } },
                    ],
                    managementIp: [				// 管理IP
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkManagementIp, trigger: 'blur' }
                    ],
                    subordinateUnit: [			// 所属单位
                        { validator: validator.space, trigger: 'blur', options: { max: 40 } },
                    ],
                    carryingBusiness: [			// 承载业务
                        { validator: validator.space, trigger: 'blur', options: { max: 32 } },
                    ],
                    storeRoomName: [
                        { required: true, message: '请选择所属库房', trigger: 'change' }
                    ],
                    warehouseInNumber: [
                        { required: true, message: '请输入入库单', trigger: 'change' },
                        { validator: validator.space, trigger: 'blur', options: { max: 32 } }
                    ],
                    remark: [					// 备注
                        { validator: validator.space, trigger: 'blur', options: { max: 200 } },
                    ]
                },
                // 维保信息
                maintenanceInfoForm: {
                    maintenanceStatus: "", 			// 维保状态
                    maintenanceDate: "", 			// 维保日期
                    lifeSpan: "", 					// 使用年限(年)
                    depreciationRate: "", 			// 折扣率(%)
                    lifeCycle: "", 					// 生命周期(月)
                    warranty: "", 					// 保修期(月)
                    availability: "", 				// 可用性
                    dateOfAvailabilityCheck: "", 	// 可用性检查日期
                },
                maintenanceInfoRules: {
                    lifeSpan: [					// 使用年限
                        { validator: validator.space, trigger: 'blur', options: { max: 2 } },
                        { validator: checkNumber, trigger: 'blur', length: { max: 2 } }
                    ],
                    depreciationRate: [			// 折扣率
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkDepreciationRate, trigger: 'blur' }
                    ],
                    lifeCycle: [				// 生命周期(最多4位数字)
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur', length: { max: 4 } }
                    ],
                    warranty: [					// 保修期(月)(最多4位数字)
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur', length: { max: 4 } }
                    ]
                },
                // 扩展属性
                extendedAttributeForm: {
                    interfaceNumber: "", 			// 接口数量(个)
                    managementInterface: "", 		// 管理接口
                    cpuModel: "", 					// CPU型号
                    availableInterfaceNumber: "", 	// 可用接口数量(个)
                    ratedPower: "", 				// 额定功率
                    memorySize: "" 					// 内存大小
                },
                extendedAttributeRules: {
                    interfaceNumber: [			// 接口数量(个),最多3位数字
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur', length: { max: 3 } }
                    ],
                    managementInterface: [		// 管理接口,最多3位数字
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur', length: { max: 3 } }
                    ],
                    cpuModel: [					// CPU型号
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                    ],
                    availableInterfaceNumber: [	// 可用接口数量(个),验证为数字
                        { validator: validator.space, trigger: 'blur' },
                        { validator: checkNumber, trigger: 'blur', length: { max: 3 } }
                    ],
                    ratedPower: [				// 额定功率,10位数字
                        { validator: validator.space, trigger: 'blur', options: { max: 10 } },
                        { validator: checkNumber, trigger: 'blur', length: { max: 10 } }
                    ],
                    memorySize: [				// 内存大小,2位数字
                        { validator: validator.space, trigger: 'blur', options: { max: 2 } },
                        { validator: checkNumber, trigger: 'blur', length: { max: 2 } }
                    ]
                },
                // 财务信息
                financeInfoForm: {
                    purchaseOrderNo: "", 			// 采购单号
                    purchasePrice: "", 				// 采购价(元)
                    equipmentOwnership: "", 		// 设备权属
                    purchaseDate: "", 				// 采购日期
                    arrivalDate: "", 				// 到货日期
                    financialNumber: "", 			// 财务编号
                    purchaseContractNo: "", 		// 采购合同号
                    propertyType: "", 				// 产权类型
                    enableDate: "", 				// 启用日期
                    disableDate: "", 				// 停止日期
                    scrapDate: "" 					// 报废日期
                },
                financeInfoRules: {
                    purchaseOrderNo: [				// 采购单号
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                        { validator: validator.numLetter, trigger: 'blur' },
                    ],
                    purchasePrice: [				// 采购价(元)
                        { validator: validator.space, trigger: 'blur', options: { max: 12 } },
                        { validator: checkPurchasePrice, trigger: 'blur' }
                    ],
                    equipmentOwnership: [			// 设备权属
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                    ],
                    financialNumber: [				// 财务编号
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                        { validator: checkNumber, trigger: 'blur', length: { max: 20 } }
                    ],
                    purchaseContractNo: [			// 采购合同号
                        { validator: validator.space, trigger: 'blur', options: { max: 20 } },
                        { validator: validator.numLetter, trigger: 'blur' },
                    ]
                },

                fieldName: ['classificationName', 'storeRoomName'],

                // 资产分类弹窗
                assetDialog: {
                    show: false,
                    selectId: ''
                },
                // 库房选择弹框
                storeDialog: {
                    show: false,
                    selectId: ''
                }
            }
        },
        activated() {
            if(this.id != this.$route.query.id){
                this.$nextTick(function () {
                    this.init();
                    $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                        e.target.blur();
                    });
                });
            }
        },
        mounted() {
            if(this.id != this.$route.query.id){
                this.$nextTick(function () {
                    this.init();
                    $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                        e.target.blur();
                    });
                });
            }
        },
        methods: {
            selectOnFocus(e) {
                e.target.blur();
            },
            init() {
                // 文本域设置宽度
                var parentWidth = $("#basicInfoRemark").parent().width();
                var myselfWidth = parentWidth - 275;
                var oldWidth = $("#basicInfoRemark .el-form-item__content").width();
                $("#basicInfoRemark .el-form-item__content").width(myselfWidth);
                // 获取初始化信息
                this.id = this.$route.query.id;
                this.$axios.post('/itsm/device/detail', {id: this.id}).then((res) => {
                    if (res.status == 200) {
                        this.$ies.initObject(this.basicInfoForm,res.data);
                        this.$ies.initObject(this.maintenanceInfoForm,res.data);
                        this.$ies.initObject(this.extendedAttributeForm,res.data);
                        this.$ies.initObject(this.financeInfoForm,res.data);
                    } else {
                        this.$message.error('获取初始化信息失败!')
                    }
                });
            },
            // 打开弹窗
            openDialog(type, param) {
                switch (type) {
                    case 'classification':
                        // 资产分类
                        this.assetDialog.selectId = this.basicInfoForm.classification;
                        this.assetDialog.show = true;
                        break;
                    case 'store':
                        // 所属区域
                        this.storeDialog.selectId = this.basicInfoForm.storeRoom;
                        this.storeDialog.show = true;
                        break;
                }
            },
            assetChooseHandler(node) {
                if (node) {
                    this.basicInfoForm.classification = node.id;
                    this.basicInfoForm.classificationName = node.categoryName;
                } else {
                    this.basicInfoForm.classification = '';
                    this.basicInfoForm.classificationName = '';
                }
            },
            storeChooseHandler(node) {
                if (node) {
                    this.basicInfoForm.storeRoom = node.id;
                    this.basicInfoForm.storeRoomName = node.storeRoomName;
                } else {
                    this.basicInfoForm.storeRoom = '';
                    this.basicInfoForm.storeRoomName = '';
                }
            },
            /*
            * 提交
            **/
            submit(type) {
                var flag = true;
                this.$refs['basicInfoForm'].validate((valid) => {
                    if (!valid) {
                        flag = false;
                    }
                });
                this.$refs['maintenanceInfoForm'].validate((valid) => {
                    if (!valid) {
                        flag = false;
                    }
                });
                this.$refs['extendedAttributeForm'].validate((valid) => {
                    if (!valid) {
                        flag = false;
                    }
                });
                this.$refs['financeInfoForm'].validate((valid) => {
                    if (!valid) {
                        flag = false;
                    }
                });
                if (flag) {
                    var param = $.extend({}, {id: this.id}, {submitAudit: type=='audit'?true:false}, this.basicInfoForm, this.maintenanceInfoForm, this.extendedAttributeForm, this.financeInfoForm);                  
                    this.submitForm(param);
                } else {
                    this.$message({ type: 'warning', message: '表单输入有误，请检查' });
                }
            },
            /*
            * 提交表单
            **/
            submitForm(param) {
                for (var item in param) {
                    if (param[item] == "" || param[item] == null) {
                        delete param[item];
                    }
                }
                this.fieldName.forEach(function (item) {
                    delete param[item];
                });
                this.$axios.post('/itsm/device/update', param).then((res) => {
                    if (res.status == 200) {
                        this.$message({ type: 'success', message: '编辑备件成功!' });
                        this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/spare/spareEdit');
                        this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/spareManagement');
                    } else if (res.status == 400) {
                        this.$message({ type: 'error', message: res.message[0].prompt });
                    } else {
                        this.$message({ type: 'error', message: '编辑备件失败' });
                    }
                });
            }
        }
    }
</script>