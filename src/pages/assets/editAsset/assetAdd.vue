<!-- 新增资产 -->
<template>
	<div class="itsm-tabs-main add-edit-asset">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div class="add-edit-asset-container">
					<div>
						<el-collapse v-model="activeNames">
							<el-collapse-item name="1">
								<template slot="title">
									基础信息<i class="el-icon-my-contraction"></i>
								</template>
								<el-form label-width="135px" :model="basicInfoForm" :rules="basicInfoRules" ref="basicInfoForm" :inline="true" style="margin-top: 20px;">
									<el-form-item label="资产编码：" prop="code">
										<el-input v-model="basicInfoForm.code" placeholder="请输入资产编码"></el-input>
									</el-form-item>
									<el-form-item label="资产名称：" prop="name">
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
									<el-form-item label="资产状态：" prop="assetStatus">
										<el-select v-model="basicInfoForm.assetStatus" @focus="selectOnFocus">
											<el-option label="待清理" value="待清理"></el-option>
											<el-option label="借出" value="借出"></el-option>
											<el-option label="测试中" value="测试中"></el-option>
											<el-option label="使用中" value="使用中"></el-option>
											<el-option label="维护中" value="维护中"></el-option>
											<el-option label="报废" value="报废"></el-option>
											<el-option label="丢失" value="丢失"></el-option>
											<el-option label="闲置" value="闲置"></el-option>
											<el-option label="停用" value="停用"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="所属区域：" prop="regionOfAffiliationName">
										<el-input readonly v-model="basicInfoForm.regionOfAffiliationName" placeholder="请选择所属区域" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('area')"></i>
									</el-form-item>
									<el-form-item label="所属建筑：" prop="buildingName">
										<el-select v-model="basicInfoForm.buildingName" @change="buildingChange" @focus="selectOnFocus">
											<el-option v-for="item in buildingList" :label="item.buildingName" :value="item.buildingId" :key="item.buildingId"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="所属机房：" prop="machineRoomName">
										<el-select v-model="basicInfoForm.machineRoomName" @change="machineRoomChange" @focus="selectOnFocus">
											<el-option v-for="item in machineRoomList" :label="item.machineRoomName" :value="item.id" :key="item.id"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="所属机柜：" prop="cabinetName">
										<el-select v-model="basicInfoForm.cabinetName" @change="cabinetChange" @focus="selectOnFocus">
											<el-option v-for="item in cabinetList" :label="item.cabinetName" :value="item.id" :key="item.id"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="所属位置：" prop="subordinatePosition">
										<el-input v-model="basicInfoForm.subordinatePosition" placeholder="请输入所属位置"></el-input>
									</el-form-item>
									<el-form-item label="分布位置：" prop="distributionPosition">
										<el-input v-model="basicInfoForm.distributionPosition" placeholder="请输入分布位置"></el-input>
									</el-form-item>
									<el-form-item label="运维人员：" prop="maintenancePersonnelName">
										<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.maintenancePersonnelName" placement="top-start">
				      						<el-input readonly v-model="basicInfoForm.maintenancePersonnelName" placeholder="请选择运维人员" @focus="selectOnFocus"></el-input>
				    					</el-tooltip>
				    					<i class="el-icon-my-more" style="width: 21px;" @click="openDialog('check','maintenancePersonnel')"></i>
									</el-form-item>
									<el-form-item label="原使用者：" prop="originalUserName">
										<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.originalUserName" placement="top-start">
											<el-input readonly v-model="basicInfoForm.originalUserName" placeholder="请选择原使用者" @focus="selectOnFocus"></el-input>
										</el-tooltip>
										<i class="el-icon-my-more" style="width: 21px;" @click="openDialog('check','originalUser')"></i>
									</el-form-item>
									<el-form-item label="使用人：" prop="userName">
										<el-tooltip class="item" effect="dark" :content="basicInfoForm.userName" placement="top-start">
											<el-input readonly v-model="basicInfoForm.userName" placeholder="请选择使用人" @focus="selectOnFocus"></el-input>
										</el-tooltip>
										<i class="el-icon-my-more" style="width: 21px;" @click="openDialog('check','user')"></i>
									</el-form-item>
									<el-form-item label="拥有者：" prop="owner">
										<el-input readonly v-model="basicInfoForm.ownerName" placeholder="请选择拥有者" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('radio','owner')"></i>
									</el-form-item>
									<el-form-item label="备注：" prop="remark" id="basicInfoRemark" style="display: block;">
										<el-input type="textarea" v-model="basicInfoForm.remark" placeholder="请输入备注" class="basicinfo-remark-textarea"></el-input>
									</el-form-item>
								</el-form>
							</el-collapse-item>
			
							<el-collapse-item name="2">
								<template slot="title">
									维保信息<i class="el-icon-my-contraction"></i>
								</template>
								<el-form label-width="135px" :model="maintenanceInfoForm" :rules="maintenanceInfoRules" ref="maintenanceInfoForm" :inline="true" style="margin-top: 20px;" class="demo-form-inline">
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
									<el-form-item label="折旧率(%)：" prop="depreciationRate">
										<el-input v-model="maintenanceInfoForm.depreciationRate" placeholder="请输入折旧率"></el-input>
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
										<el-date-picker v-model="maintenanceInfoForm.dateOfAvailabilityCheck" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择可用性检查日期"></el-date-picker>
									</el-form-item>
									<el-form-item label="维护人：" prop="maintainerName">
										<el-input readonly v-model="maintenanceInfoForm.maintainerName" placeholder="请选择维护人" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('radio','maintainer')"></i>
									</el-form-item>
									<el-form-item label="维护人联系方式：" prop="maintainerContact">
										<el-input v-model="maintenanceInfoForm.maintainerContact" placeholder="请输入维护人联系方式"></el-input>
									</el-form-item>
								</el-form>
							</el-collapse-item>
			
							<el-collapse-item name="3">
								<template slot="title">
									扩展属性<i class="el-icon-my-contraction"></i>
								</template>
								<el-form label-width="135px" :model="extendedAttributeForm" :rules="extendedAttributeRules" ref="extendedAttributeForm" :inline="true" style="margin-top: 20px;">
									<el-form-item label="重要级别：" prop="equipmentLevel">
										<el-select v-model="extendedAttributeForm.equipmentLevel" @focus="selectOnFocus">
											<el-option label="请选择" value=""></el-option>
											<el-option label="一级" value="一级"></el-option>
											<el-option label="二级" value="二级"></el-option>
											<el-option label="三级" value="三级"></el-option>
											<el-option label="四级" value="四级"></el-option>
											<el-option label="五级" value="五级"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="第一责任人：" prop="firstResponsiblePersonName">
										<el-input readonly v-model="extendedAttributeForm.firstResponsiblePersonName" placeholder="请选择第一责任人" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('radio','firstResponsiblePerson')"></i>
									</el-form-item>
									<el-form-item label="第二责任人：" prop="secondResponsiblePersonName">
										<el-input readonly v-model="extendedAttributeForm.secondResponsiblePersonName" placeholder="请选择第二责任人" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('radio','secondResponsiblePerson')"></i>
									</el-form-item>
									<el-form-item label="设备OID：" prop="equipmentOid">
										<el-input v-model="extendedAttributeForm.equipmentOid" placeholder="请输入设备OID"></el-input>
									</el-form-item>
									<el-form-item label="信息维护人员：" prop="informationMaintenanceStaffName">
										<el-input readonly v-model="extendedAttributeForm.informationMaintenanceStaffName" placeholder="请选择信息维护人员" @focus="selectOnFocus"></el-input>
										<i class="el-icon-my-more" @click="openDialog('radio','informationMaintenanceStaff')"></i>
									</el-form-item>
									<el-form-item label="上线日期：" prop="commissioningDate" class="date">
										<el-date-picker v-model="extendedAttributeForm.commissioningDate" type="date" :editable="false" value-format="yyyy-MM-dd" placeholder="请选择上线日期"></el-date-picker>
									</el-form-item>
									<el-form-item label="软件版本：" prop="softwareVersion">
										<el-input v-model="extendedAttributeForm.softwareVersion" placeholder="请输入软件版本"></el-input>
									</el-form-item>
									<el-form-item label="SNMP写团体字：" prop="snmpWritingGroup">
										<el-input v-model="extendedAttributeForm.snmpWritingGroup" placeholder="请输入SNMP写团体字"></el-input>
									</el-form-item>
									<el-form-item label="SNMP读团体字：" prop="snmpReadGroup">
										<el-input v-model="extendedAttributeForm.snmpReadGroup" placeholder="请输入SNMP读团体字"></el-input>
									</el-form-item>
									<el-form-item label="MAC：" prop="mac">
										<el-input v-model="extendedAttributeForm.mac" placeholder="请输入MAC"></el-input>
									</el-form-item>
									<el-form-item label="配置文件名称：" prop="configFileName">
										<el-input v-model="extendedAttributeForm.configFileName" placeholder="请输入配置文件名称"></el-input>
									</el-form-item>
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
						<el-button type="normal" @click="save">保存</el-button>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		<!-- 资产分类弹窗 -->
		<iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog>
		<!-- 所属区域弹窗 -->
        <iesAreaDialog v-model="areaDialog.show" v-if="areaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='areaDialog.selectId'></iesAreaDialog>
		<!-- 选择人员(单选) -->
        <ies-personRadioDialog v-model="personRadioDialog.show" v-if="personRadioDialog.show" @selectPersonRadioHandler="selectPersonRadioHandler" :defaultSelect="personRadioDialog.selectData"></ies-personRadioDialog>
		<!-- 选择人员(多选) -->
		<ies-personCheckDialog v-model="personCheckDialog.show" v-if="personCheckDialog.show" @selectPersonCheckboxHandler="selectPersonCheckboxHandler" :defaultSelect="personCheckDialog.selectNode"></ies-personCheckDialog>
	</div>
</template>

<script>
	export default {
		name: 'assetAdd',
		data() {
			let validator = this.$ies.validator;
			// 验证管理IP
			var checkManagementIp = (rule, value, callback) => {
				var check = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
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
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
						return callback(new Error('手机号格式不正确'));
					} else {
						return callback();
					}
				} else {
					return callback();
				}
			};
			// 折旧率(0到100的小数或整数,小数保留两位)
			var checkDepreciationRate = (rule, value, callback) => {
				var check = /^(((\d|[1-9]\d)(\.\d{1,2})?)|100|100.0|100.00)$/;
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
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
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
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
				if(value != "" && value != undefined) {
					if(!check.test(value)) {
						return callback(new Error("格式错误(最多为"+ rule.length.max +"位数字)"));
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
				if(!check.test(value)) {
					return callback(new Error("只能由-/()中文英文数字组成"));
				} else {
					return callback();
				}
			};
			return {
				activeNames: ['1','2','3','4'],
				// 基础信息
				basicInfoForm: {
					code: "", 					// 资产编码
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
					assetStatus: "", 			// 资产状态
					regionOfAffiliation: "", 	// 所属区域
					regionOfAffiliationName: "",// 所属区域~名字
					building: "", 				// 所属建筑
					buildingName: "", 			// 所属建筑~名字
					machineRoom: "", 			// 所属机房
					machineRoomName: "", 		// 所属机房~名字
					cabinet: "", 				// 所属机柜
					cabinetName: "", 			// 所属机柜~名字
					subordinatePosition: "", 	// 所属位置
					distributionPosition: "", 	// 分布位置
					maintenancePersonnel: "", 	// 运维人员
					maintenancePersonnelName: "",// 运维人员~名字
					originalUser: "", 			// 原使用者
					originalUserName: "", 		// 原使用者~名字
					user: "", 					// 使用人
					userName: "", 				// 使用人~名字
					owner: "", 					// 拥有者
					ownerName: "",				// 拥有者~名字
					remark: "" 					// 备注
				},
				basicInfoRules: {
					code: [						// 资产编码
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入资产编码', trigger: 'blur' },
						{ validator: checkCode, trigger: 'blur' }
					],
					name: [						// 资产名称
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
						{ required: true, message: '请输入资产名称', trigger: 'blur' }
					],
					manufacturer: [				// 厂商
						{ validator: validator.space, trigger: 'blur', options: {max:20} }
					],
					classificationName: [		// 资产分类
						{ required: true, message: '请选择资产分类', trigger: 'change' }
					],
					model: [					// 型号
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
						{ required: true, message: '请输入型号', trigger: 'blur' }
					],
					serialNo: [					// 序列号
						{ validator: validator.space, trigger: 'blur', options: {max:30} },
					],
					barCode: [					// 条形码
						{ validator: validator.space, trigger: 'blur', options: {max:30} },
					],
					managementIp: [				// 管理IP
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkManagementIp, trigger: 'blur' }
					],
					subordinateUnit: [			// 所属单位
						{ validator: validator.space, trigger: 'blur', options: {max:40} },
					],
					carryingBusiness: [			// 承载业务
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
					],
					assetStatus: [				// 资产状态
						{ required: true, message: '请选择资产状态', trigger: 'change' }
					],
					regionOfAffiliationName: [	// 所属区域
						{ required: true, message: '请选择所属区域', trigger: 'change' }
					],
					subordinatePosition: [		// 所属位置
						{ validator: validator.space, trigger: 'blur', options: {max:30} },
					],
					distributionPosition: [		// 分布位置
						{ validator: validator.space, trigger: 'blur', options: {max:10} },
					],
					maintenancePersonnelName: [	// 运维人员
						{ required: true, message: '请选择运维人员', trigger: 'change' }
					],
					userName: [					// 使用人
						{ required: true, message: '请选择使用人', trigger: 'change' }
					],
					remark: [					// 备注
						{ validator: validator.space, trigger: 'blur', options: {max:200} },
					]
				},
				// 维保信息
				maintenanceInfoForm: {
					maintenanceStatus: "", 			// 维保状态
					maintenanceDate: "", 			// 维保日期
					lifeSpan: "", 					// 使用年限(年)
					depreciationRate: "", 			// 折旧率(%)
					lifeCycle: "", 					// 生命周期(月)
					warranty: "", 					// 保修期(月)
					availability: "", 				// 可用性
					dateOfAvailabilityCheck: "", 	// 可用性检查日期
					maintainer: "",					// 维护人
					maintainerName: "",				// 维护人~名字
					maintainerContact: "" 			// 维护人联系方式
				},
				maintenanceInfoRules: { 
					lifeSpan: [					// 使用年限
						{ validator: validator.space, trigger: 'blur', options: {max:2} },
						{ validator: checkNumber, trigger: 'blur', length: {max:2} }
					],
					depreciationRate: [			// 折旧率
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkDepreciationRate, trigger: 'blur' }
					],
					lifeCycle: [				// 生命周期(最多4位数字)
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkNumber, trigger: 'blur', length: {max:4} }
					],
					warranty: [					// 保修期(月)(最多4位数字)
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkNumber, trigger: 'blur', length: {max:4} }
					],							
					maintainerContact: [		// 维护人联系方式(手机号)
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkPhone, trigger: 'blur' }
					]
				},
				// 扩展属性
				extendedAttributeForm: {
					equipmentLevel: "", 			// 设备级别
					firstResponsiblePerson: "", 	// 第一责任人
					firstResponsiblePersonName: "", // 第一责任人~名字
					secondResponsiblePerson: "", 	// 第二责任人
					secondResponsiblePersonName: "",// 第二责任人~名字
					equipmentOid: "", 				// 设备OID
					informationMaintenanceStaff: "",// 信息维护人员
					informationMaintenanceStaffName: "",// 信息维护人员~名字
					commissioningDate: "", 			// 上线日期
					softwareVersion: "", 			// 软件版本
					snmpWritingGroup: "", 			// SNMP写团体字
					snmpReadGroup: "", 				// SNMP读团体字
					mac: "", 						// MAC
					configFileName: "", 			// 配置文件名称
					interfaceNumber: "", 			// 接口数量(个)
					managementInterface: "", 		// 管理接口
					cpuModel: "", 					// CPU型号
					availableInterfaceNumber: "", 	// 可用接口数量(个)
					ratedPower: "", 				// 额定功率
					memorySize: "" 					// 内存大小
				},
				extendedAttributeRules: { 
					firstResponsiblePersonName: [
						{ required: true, message: '请选择第一责任人', trigger: 'change' }
					],
					equipmentOid: [				// 设备OID
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
					],
					softwareVersion: [			// 软件版本
						{ validator: validator.space, trigger: 'blur', options: {max:10} },
					],
					snmpWritingGroup: [			// SNMP写团体字
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
					],
					snmpReadGroup: [			// SNMP读团体字
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
					],
					mac: [						// MAC地址
						{ validator: validator.space, trigger: 'blur', options: {max:32} },
					],
					configFileName: [			// 配置文件名称
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
					],
					interfaceNumber: [			// 接口数量(个),最多3位数字
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkNumber, trigger: 'blur', length: {max:3} }
					],
					managementInterface: [		// 管理接口,最多3位数字
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkNumber, trigger: 'blur', length: {max:3} }
					],
					cpuModel: [					// CPU型号
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
					],
					availableInterfaceNumber: [	// 可用接口数量(个),验证为数字
						{ validator: validator.space, trigger: 'blur' },
						{ validator: checkNumber, trigger: 'blur', length: {max:3} }
					],
					ratedPower: [				// 额定功率,10位数字
						{ validator: validator.space, trigger: 'blur', options: {max:10} },
						{ validator: checkNumber, trigger: 'blur',length: {max:10} }
					],
					memorySize: [				// 内存大小,2位数字
						{ validator: validator.space, trigger: 'blur', options: {max:2} },
						{ validator: checkNumber, trigger: 'blur',length: {max:2} }
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
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
						{ validator: validator.numLetter, trigger: 'blur' },
					],
					purchasePrice: [				// 采购价(元)
						{ validator: validator.space, trigger: 'blur', options: {max:12} },
						{ validator: checkPurchasePrice, trigger: 'blur' }
					],
					equipmentOwnership: [			// 设备权属
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
					],
					financialNumber: [				// 财务编号
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
						{ validator: checkNumber, trigger: 'blur', length: {max:20} }
					],
					purchaseContractNo: [			// 采购合同号
						{ validator: validator.space, trigger: 'blur', options: {max:20} },
						{ validator: validator.numLetter, trigger: 'blur' },
					]
				},
				buildingList: [],					// 建筑下拉框
				machineRoomList: [],				// 机房下拉框
				cabinetList: [],					// 机柜下拉框
				
				fieldName: ['classificationName','regionOfAffiliationName','buildingName','machineRoomName','cabinetName',
						'maintenancePersonnelName','originalUserName','userName','ownerName','maintainerName','firstResponsiblePersonName',
						'secondResponsiblePersonName','informationMaintenanceStaffName',''],
				// --------------------------
				// 资产分类弹窗
				assetDialog: {
					show: false,
					selectId: ''
				},
				// 所属区域弹窗
				areaDialog: {
					show: false,
					selectId: ''
				},
				// 单选(选择人弹窗)
				personRadioDialog: {				
					name: "",
					show: false,
					selectData: {
						id: ''
					},
					ownerId: '',					// 拥有者id
					maintainerId: '',				// 维护人id
					firstResponsiblePersonId: '',	// 第一责任人id
					secondResponsiblePersonId: '',	// 第二责任人id
					informationMaintenanceStaff: '',// 信息维护人员id
				},
				// 多选(选择人弹窗)
				personCheckDialog: {				
					name: "",
					show: false,
					selectNode: null,
					maintenancePersonnel: [],		// 运维人员
					originalUser: [],				// 原使用者
					user: []						// 使用人
				},
			}
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
				$('.el-date-editor--date .el-input__inner').on('focus',function(e){
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
			},
	      	// 所属建筑change事件
	      	buildingChange(val) {
	      		this.basicInfoForm.building = val;
	      		this.queryMachineRoom(val);
	      	},
	      	// 所属机房change事件
	      	machineRoomChange(val) {
	      		this.basicInfoForm.machineRoom = val;
	      		this.queryCabinet(val);
	      	},
	      	// 所属机柜change事件
	      	cabinetChange(val) {
	      		this.basicInfoForm.cabinet = val;
	      	},
	      	// 获取建筑下拉框数据
	      	queryBuilding(id) {
	      		this.basicInfoForm.building = "";
	      		this.basicInfoForm.machineRoom = "";
	      		this.basicInfoForm.cabinet = "";
	      		this.basicInfoForm.buildingName = "";
	      		this.basicInfoForm.machineRoomName = "";
	      		this.basicInfoForm.cabinetName = "";
	      		this.machineRoomList = [];
	      		this.cabinetList = [];
	      		if(id != "") {
	      			this.queryBuildingList(id);
	      		} else {
	      			this.buildingList = [];
	      		}
	      	},
	      	queryBuildingList(id) {
	      		this.$axios.post('/itsm/system/config/building/queryBuildingByAreaId',{areaId:id}).then( (res) => {
					if(res.status == 200) {
						if(res.data.length > 0) {
							this.buildingList = res.data;
							this.buildingList.splice(0,0,{buildingName: "请选择", buildingId: ""});
						}
					} else {
						this.buildingList = [];
					}
				});
	      	},
	      	// 获取机房下拉框数据
	      	queryMachineRoom(id) {
	      		this.basicInfoForm.machineRoom = "";
	      		this.basicInfoForm.cabinet = "";
	      		this.basicInfoForm.machineRoomName = "";
	      		this.basicInfoForm.cabinetName = "";
	      		this.cabinetList = [];
	      		if(id != "") {
	      			this.queryMachineRoomList(id);
	      		} else {
	      			this.machineRoomList = [];
	      		}
	      	},
	      	queryMachineRoomList(id) {
	      		this.$axios.post('/itsm/system/config/machineRoom/queryMachineRoomByBuildingId',{buildingId:id}).then( (res) => {
					if(res.length > 0) {
						this.machineRoomList = res;
						this.machineRoomList.splice(0,0,{machineRoomName: "请选择", id: ""});
					}
				});
	      	},
	      	// 获取机柜下拉框数据
	      	queryCabinet(id) {
	      		this.basicInfoForm.cabinet = "";
	      		this.basicInfoForm.cabinetName = "";
	      		if(id != "") {
	      			this.queryCabinetList(id);
	      		} else {
	      			this.cabinetList = [];
	      		}
	      	},
	      	queryCabinetList(id) {
	      		this.$axios.post('/itsm/system/config/cabinet/queryCabinetByMachineRoomId',{machineRoomId:id}).then( (res) => {
					if(res.length > 0) {
						this.cabinetList = res;
						this.cabinetList.splice(0,0,{cabinetName: "请选择", id: ""});
					}
				});
	      	},
			// 打开弹窗
			openDialog(type,param) {
				switch(type) {
					case 'classification':
						// 资产分类
						this.assetDialog.show = true;
						break;
					case 'area':
						// 所属区域
						this.areaDialog.show = true;
						break;
					case 'radio':
						// 选择人员(单选)
						this.openRadioDialog(param);
						break;
					case 'check':
						// 选择多人(多选)
						this.openCheckDialog(param);
						break;
				}
			},
			assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.basicInfoForm.classification = node.id;
	                this.basicInfoForm.classificationName = node.categoryName;
	           	} else {
	           		this.assetDialog.selectId = '';
	                this.basicInfoForm.classification = '';
	                this.basicInfoForm.classificationName = '';
	           	}
	       	},
			areaChooseHandler(node) {
	            if(node) {
	                this.areaDialog.selectId = node.id;
	                this.basicInfoForm.regionOfAffiliation = node.id;
	                this.basicInfoForm.regionOfAffiliationName = node.areaName;
	                this.queryBuilding(node.id);
	            } else {
	            	this.areaDialog.selectId = '';
	                this.basicInfoForm.regionOfAffiliation = '';
	                this.basicInfoForm.regionOfAffiliationName = '';
	                this.queryBuilding('');
	            }
	      	},
	      	// 打开人员弹窗
	      	openRadioDialog(data) {
	      		this.personRadioDialog.name = data;
	      		switch(data) {
	      			case 'owner':						// 拥有者
	      				this.personRadioDialog.selectData.id = this.personRadioDialog.ownerId;
	      				break;
	      			case 'maintainer':					// 维护人
	      				this.personRadioDialog.selectData.id = this.personRadioDialog.maintainerId;
	      				break;
	      			case 'firstResponsiblePerson':		// 第一责任人
	      				this.personRadioDialog.selectData.id = this.personRadioDialog.firstResponsiblePersonId;
	      				break;
	      			case 'secondResponsiblePerson':		// 第二责任人
	      				this.personRadioDialog.selectData.id = this.personRadioDialog.secondResponsiblePersonId;
	      				break;
	      			case 'informationMaintenanceStaff':	// 信息维护人员
	      				this.personRadioDialog.selectData.id = this.personRadioDialog.informationMaintenanceStaffId;
	      				break;
	      		}
	      		this.personRadioDialog.show = true;
	      	},
	      	// 选择人员(单选)回调
	      	selectPersonRadioHandler(data) {
	      		var id = JSON.parse(data).id;
	      		var name = JSON.parse(data).userName;
	      		switch(this.personRadioDialog.name) {
	      			case 'owner':						// 拥有者
	      				this.basicInfoForm.owner = id; 
	      				this.basicInfoForm.ownerName = name; 
	      				this.personRadioDialog.ownerId = id;
	      				break;
	      			case 'maintainer':					// 维护人
	      				this.maintenanceInfoForm.maintainer = id;
	      				this.maintenanceInfoForm.maintainerName = name;
	      				this.personRadioDialog.maintainerId = id;
	      				break;
	      			case 'firstResponsiblePerson':		// 第一责任人
	      				this.extendedAttributeForm.firstResponsiblePerson = id;
	      				this.extendedAttributeForm.firstResponsiblePersonName = name;
	      				this.personRadioDialog.firstResponsiblePersonId = id;
	      				break;
	      			case 'secondResponsiblePerson':		// 第二责任人
	      				this.extendedAttributeForm.secondResponsiblePerson = id; 
	      				this.extendedAttributeForm.secondResponsiblePersonName = name;
	      				this.personRadioDialog.secondResponsiblePersonId = id;
	      				break;
	      			case 'informationMaintenanceStaff':	// 信息维护人员
	      				this.extendedAttributeForm.informationMaintenanceStaff = id; 
	      				this.extendedAttributeForm.informationMaintenanceStaffName = name; 
	      				this.personRadioDialog.informationMaintenanceStaffId = id;
	      				break;
	      		}
	      	},
	      	// 打开多人弹窗
	      	openCheckDialog(data) {
	      		this.personCheckDialog.name = data;
	      		switch(this.personCheckDialog.name) {
	      			case 'maintenancePersonnel':
	      				// 运维人员
	      				this.personCheckDialog.selectNode = {
		      				type: 'maintenancePersonnel',
		      				selected : this.personCheckDialog.maintenancePersonnel
		      			}
	      				break;
	      			case 'originalUser':
	      				// 原使用者
	      				this.personCheckDialog.selectNode = {
		      				type: '',
		      				selected : this.personCheckDialog.originalUser
		      			}
	      				break;
	      			case 'user':
	      				// 使用人
	      				this.personCheckDialog.selectNode = {
		      				type: '',
		      				selected : this.personCheckDialog.user
		      			}
	      				break;
	      		}
	      		this.personCheckDialog.show = true;
	      	},
	      	// 选择多人(多选)回调
	      	selectPersonCheckboxHandler(data) {
	      		var id = [], name = [];
	      		if(data.length > 0) {
		      		data.forEach(function(item) {
		                id.push(item.id);
		      			name.push(item.userName);
		           	});
	           	}
	      		switch(this.personCheckDialog.name) {
	      			case 'maintenancePersonnel':	// 运维人员
	      				this.personCheckDialog.maintenancePersonnel = data;
	      				if(data == []) {
	      					this.basicInfoForm.maintenancePersonnel = '';
	      					this.basicInfoForm.maintenancePersonnelName = '';
	      				} else {
	      					this.basicInfoForm.maintenancePersonnel = id.toString();
	      					this.basicInfoForm.maintenancePersonnelName = name.toString();
	      				}
	      				break;
	      			case 'originalUser':				// 原使用者
	      				this.personCheckDialog.originalUser = data;
	      				if(data.length == 0) {
	      					this.basicInfoForm.originalUser = '';
	      					this.basicInfoForm.originalUserName = '';
	      				} else {
	      					this.basicInfoForm.originalUser = id.toString();
	      					this.basicInfoForm.originalUserName = name.toString();
	      				}
	      				break;
	      			case 'user':						// 使用人
	      				this.personCheckDialog.user = data;
	      				if(data == []) {
	      					this.basicInfoForm.user = '';
	      					this.basicInfoForm.userName = '';
	      				} else {
	      					this.basicInfoForm.user = id.toString();
	      					this.basicInfoForm.userName = name.toString();
	      				}
	      				break;
	      		}
	     	},
			// 新增
			save() {
				var flag = true;
				this.$refs['basicInfoForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['maintenanceInfoForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['extendedAttributeForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				this.$refs['financeInfoForm'].validate((valid) => {
					if(!valid) {
						flag = false;	
					}
				});
				if(flag) {
					var param = $.extend({},this.basicInfoForm,this.maintenanceInfoForm,this.extendedAttributeForm,this.financeInfoForm);
					this.submitForm(param);
				} else {
					this.$message({ type: 'warning', message: '表单输入有误，请检查' });
				}
			},
			// 提交表单
			submitForm(param) {
				for(var item in param) {
					if(param[item] == "" || param[item] == null) {
						delete param[item];
					}
				}
				this.fieldName.forEach(function(item) {
					delete param[item];
				});
				
				this.$axios.post('/assets/management/add',param).then( (res) => {
					if(res.status == 200) {
						this.$message({ type: 'success', message: '新增资产成功!' });
						this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage('/addAsset');
						this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage('/editAsset?id='+res.data);
					} else if(res.status == 400) {
						this.$message({ type: 'error', message: res.message[0].prompt });
					} else {
						this.$message({ type: 'error', message: '新增资产失败' });
					}
				});
			}
		}
	}
</script>