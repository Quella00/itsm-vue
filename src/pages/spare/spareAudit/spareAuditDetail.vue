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
                                <el-form label-width="135px" :model="basicInfoForm" ref="basicInfoForm" :inline="true" style="margin-top: 20px;">
                                    <el-form-item label="资产编码：">
                                        <el-input v-model="basicInfoForm.code" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="备件名称：">
                                        <el-input v-model="basicInfoForm.name" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="资产分类：">
                                        <el-input readonly v-model="basicInfoForm.classificationName" :disabled="true" @focus="selectOnFocus"></el-input>
                                        <i class="el-icon-my-more"></i>
                                    </el-form-item>
                                    <el-form-item label="厂商：">
                                        <el-input v-model="basicInfoForm.manufacturer" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="型号：">
                                        <el-input v-model="basicInfoForm.model" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="序列号：">
                                        <el-input v-model="basicInfoForm.serialNo" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="条形码：">
                                        <el-input v-model="basicInfoForm.barCode" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="管理IP：">
                                        <el-input v-model="basicInfoForm.managementIp" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="所属单位：">
                                        <el-input v-model="basicInfoForm.subordinateUnit" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="承载业务：">
                                        <el-input v-model="basicInfoForm.carryingBusiness" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="所属库房：">
                                        <el-input readonly v-model="basicInfoForm.storeRoomName" :disabled="true" @focus="selectOnFocus"></el-input>
                                        <i class="el-icon-my-more"></i>
                                    </el-form-item>
                                    <el-form-item label="入库单：" v-if="basicInfoForm.operation=='新增'||basicInfoForm.operation=='编辑'">
                                            <span style="width:234px;display:inline-block">{{basicInfoForm.warehouseInNumber}}</span>
                                    </el-form-item>
                                    <el-form-item label="出库单：" v-if="basicInfoForm.operation=='报废'||basicInfoForm.operation=='转资产'">
                                        <span style="width:234px;display:inline-block">{{basicInfoForm.warehouseOutNumber}}</span>
                                </el-form-item>
                                    <el-form-item label="来源：">
                                        <span style="width:234px;display:inline-block">{{basicInfoForm.operation}}</span>
                                    </el-form-item>
                                    <el-form-item label="备注：" id="basicInfoRemark" style="display: block;">
                                        <el-input type="textarea" v-model="basicInfoForm.remark" :disabled="true"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="2">
                                <template slot="title">
                                    维保信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="maintenanceInfoForm" ref="maintenanceInfoForm" :inline="true"
                                    style="margin-top: 20px;" class="demo-form-inline">
                                    <el-form-item label="维保状态 :">
                                        <el-select :disabled="true"  v-model="maintenanceInfoForm.maintenanceStatus" @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="在保中" value="在保中"></el-option>
                                            <el-option label="已过保" value="已过保"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="维保日期：" class="date">
                                        <el-date-picker v-model="maintenanceInfoForm.maintenanceDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="使用年限(年)：">
                                        <el-input v-model="maintenanceInfoForm.lifeSpan" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="折扣率(%)：">
                                        <el-input v-model="maintenanceInfoForm.depreciationRate" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="生命周期(月)：">
                                        <el-input v-model="maintenanceInfoForm.lifeCycle" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="保修期(月)：">
                                        <el-input v-model="maintenanceInfoForm.warranty" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="可用性：">
                                        <el-select :disabled="true" v-model="maintenanceInfoForm.availability" @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="已检可用" value="已检可用"></el-option>
                                            <el-option label="已检不可用" value="已检不可用"></el-option>
                                            <el-option label="未检新品" value="未检新品"></el-option>
                                            <el-option label="未检坏件" value="未检坏件"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="可用性检查日期：" class="date">
                                        <el-date-picker v-model="maintenanceInfoForm.dateOfAvailabilityCheck" type="date" :editable="false" value-format="yyyy-MM-dd"
                                        :disabled="true"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="3">
                                <template slot="title">
                                    扩展属性<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="extendedAttributeForm" ref="extendedAttributeForm" :inline="true"
                                    style="margin-top: 20px;">
                                    <el-form-item label="接口数量(个)：">
                                        <el-input v-model="extendedAttributeForm.interfaceNumber" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="管理接口：">
                                        <el-input v-model="extendedAttributeForm.managementInterface" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="CPU型号：">
                                        <el-input v-model="extendedAttributeForm.cpuModel" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="可用接口数量(个)：">
                                        <el-input v-model="extendedAttributeForm.availableInterfaceNumber" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="额定功率(W)：">
                                        <el-input v-model="extendedAttributeForm.ratedPower" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="内存大小(G)：">
                                        <el-input v-model="extendedAttributeForm.memorySize" :disabled="true"></el-input>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>

                            <el-collapse-item name="4">
                                <template slot="title">
                                    财务信息<i class="el-icon-my-contraction"></i>
                                </template>
                                <el-form label-width="135px" :model="financeInfoForm" ref="financeInfoForm" :inline="true" style="margin-top: 20px;">
                                    <el-form-item label="采购单号：">
                                        <el-input v-model="financeInfoForm.purchaseOrderNo" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购价(元)：">
                                        <el-input v-model="financeInfoForm.purchasePrice" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="设备权属：">
                                        <el-input v-model="financeInfoForm.equipmentOwnership" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购日期：" class="date">
                                        <el-date-picker v-model="financeInfoForm.purchaseDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="到货日期：" class="date">
                                        <el-date-picker v-model="financeInfoForm.arrivalDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="财务编号：">
                                        <el-input v-model="financeInfoForm.financialNumber" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="采购合同号：">
                                        <el-input v-model="financeInfoForm.purchaseContractNo" :disabled="true"></el-input>
                                    </el-form-item>
                                    <el-form-item label="产权类型：">
                                        <el-select :disabled="true" v-model="financeInfoForm.propertyType"  @focus="selectOnFocus">
                                            <el-option label="请选择" value=""></el-option>
                                            <el-option label="购买" value="购买"></el-option>
                                            <el-option label="租借" value="租借"></el-option>
                                            <el-option label="合股" value="合股"></el-option>
                                            <el-option label="受赠" value="受赠"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="启用日期：" class="date">
                                        <el-date-picker v-model="financeInfoForm.enableDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="停止日期：" class="date">
                                        <el-date-picker v-model="financeInfoForm.disableDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="报废日期：" class="date">
                                        <el-date-picker v-model="financeInfoForm.scrapDate" type="date" :editable="false" value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                    </div>

                    <div class="tabs-panel-wrap border" style="margin-top: 10px;">
                        <div class="panel-header">
                            审核备注
                        </div>
                        <div class="panel-body">
                            <el-form label-width="130px" :model="remarkForm" :rules="remarkRules" ref="remarkForm" style="margin-top: 20px;">
                                <el-form-item label="审核：" prop="audit">
                                    <el-select v-model="remarkForm.audit" @focus="selectOnFocus">
                                        <el-option label="审核通过" value="true"></el-option>
                                        <el-option label="审核不通过" value="false"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="备注：" prop="remark" style="width: 500px;">
                                    <el-input type="textarea" v-model="remarkForm.remark" placeholder="请输入备注"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="normal" @click="batchAuditSave">确 认</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                    </div>
                </div>
            </ies-scrollbar>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'spareAuditDetail',
        data() {
            let validator = this.$ies.validator;
            return {
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
                    storeRoomId: "",            // 所属库房~ID
                    storeRoomName: "",          // 所属库房~Name
                    operation: "",              // 来源
                    warehouseInNumber: "",      // 入库单
                    warehouseOutNumber: "",     // 出库单
                    remark: "" 					// 备注
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
                // 扩展属性
                extendedAttributeForm: {
                    interfaceNumber: "", 			// 接口数量(个)
                    managementInterface: "", 		// 管理接口
                    cpuModel: "", 					// CPU型号
                    availableInterfaceNumber: "", 	// 可用接口数量(个)
                    ratedPower: "", 				// 额定功率
                    memorySize: "" 					// 内存大小
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
                remarkForm: {
					audit: "true", 	// 审核
					remark: "" 		// 备注
				},
				remarkRules: {
					remark: [
						{ validator: validator.space, trigger: 'blur', options: {max:200} },
					]
				},
            }
        },
        mounted() {
            this.$nextTick(function () {
                this.init();
                $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                    e.target.blur();
                });
            });
        },
        activated() {
            this.$nextTick(function () {
                console.log(111111);
                this.init();
                $('.el-date-editor--date .el-input__inner').on('focus', function (e) {
                    e.target.blur();
                });
            });
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
                // 获取初始数据
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
            /*
            * 审核
            **/
            batchAuditSave() {
                this.$refs['remarkForm'].validate((valid) => {
                    if(valid) {
                        var param = {
                            idList: this.id,
                            approved: this.remarkForm.audit,
                            remark: this.remarkForm.remark
                        }
                        this.$axios.post('/itsm/device/batchAudit',param).then( (res) => {
                            if(res.status == 200 && res.data) {
                                this.$message({ type: 'success', message: '审核成功' });
                                this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/spare/spareAuditDetail');
                                this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/spare/spareAudit');
                            } else {
                                this.$message({ type: 'error', message: '审核失败' });
                            }
                        });
                    }
                });
            },
        }
    }
</script>