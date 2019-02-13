<!-- 查看资产的表单部分 -->
<template>
	<div>
		<el-collapse v-model="activeNames">
			<el-collapse-item name="1" @change="changeHeight">
				<template slot="title">
					基础信息<i class="el-icon-my-contraction"></i>
				</template>
				<el-form label-width="135px" :model="basicInfoForm" :rules="basicInfoRules" ref="basicInfoForm" :inline="true" style="margin-top: 20px;">
					<el-form-item label="资产编码：" prop="code">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.code" placement="top-start">
							<el-input v-model="basicInfoForm.code" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="资产名称：" prop="name">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.name" placement="top-start">
							<el-input v-model="basicInfoForm.name" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="资产分类：" prop="classificationName">
						<el-input v-model="basicInfoForm.classificationName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="厂商：" prop="manufacturer">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.manufacturer" placement="top-start">
							<el-input v-model="basicInfoForm.manufacturer" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="型号：" prop="model">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.model" placement="top-start">
							<el-input v-model="basicInfoForm.model" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="序列号：" prop="serialNo">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.serialNo" placement="top-start">
							<el-input v-model="basicInfoForm.serialNo" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="条形码：" prop="barCode">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.barCode" placement="top-start">
							<el-input v-model="basicInfoForm.barCode" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="管理IP：" prop="managementIp">
						<el-input v-model="basicInfoForm.managementIp" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属单位：" prop="subordinateUnit">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.subordinateUnit" placement="top-start">
							<el-input v-model="basicInfoForm.subordinateUnit" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="承载业务：" prop="carryingBusiness">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.carryingBusiness" placement="top-start">
							<el-input v-model="basicInfoForm.carryingBusiness" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="资产状态：" prop="assetStatus">
						<el-input v-model="basicInfoForm.assetStatus" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属区域：" prop="regionOfAffiliationName">
						<el-input v-model="basicInfoForm.regionOfAffiliationName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属建筑：" prop="buildingName">
						<el-input v-model="basicInfoForm.buildingName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属机房：" prop="machineRoomName">
						<el-input v-model="basicInfoForm.machineRoomName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属机柜：" prop="cabinetName">
						<el-input v-model="basicInfoForm.cabinetName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="所属位置：" prop="subordinatePosition">
						<el-input v-model="basicInfoForm.subordinatePosition" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="分布位置：" prop="distributionPosition">
						<el-input v-model="basicInfoForm.distributionPosition" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="运维人员：" prop="maintenancePersonnelName">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.maintenancePersonnelName" placement="top-start">
							<el-input v-model="basicInfoForm.maintenancePersonnelName" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="原使用者：" prop="originalUserName">
						<el-tooltip class="item" effect="dark" :content="basicInfoForm.originalUserName" placement="top-start">
							<el-input v-model="basicInfoForm.originalUserName" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="使用人：" prop="userName">
						<el-tooltip class="item" effect="dark" :content="basicInfoForm.userName" placement="top-start">
							<el-input v-model="basicInfoForm.userName" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="拥有者：" prop="ownerName">
						<el-input v-model="basicInfoForm.ownerName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="备注：" prop="remark" id="basicInfoRemark" style="display: block;">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.remark" placement="top-start">
							<el-input type="textarea" v-model="basicInfoForm.remark" :disabled="true" class="basicinfo-remark-textarea"></el-input>
						</el-tooltip>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			
			<el-collapse-item name="2" @change="changeHeight">
				<template slot="title">
					维保信息<i class="el-icon-my-contraction"></i>
				</template>
				<el-form label-width="135px" :model="maintenanceInfoForm" :rules="maintenanceInfoRules" ref="maintenanceInfoForm" :inline="true" style="margin-top: 20px;">
					<el-form-item label="维保状态：" prop="maintenanceStatus">
						<el-input v-model="maintenanceInfoForm.maintenanceStatus" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="维保日期：" prop="maintenanceDate" class="date">
						<el-input v-model="maintenanceInfoForm.maintenanceDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="使用年限(年)：" prop="lifeSpan">
						<el-input v-model="maintenanceInfoForm.lifeSpan" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="折旧率(%)：" prop="depreciationRate">
						<el-input v-model="maintenanceInfoForm.depreciationRate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="生命周期(月)：" prop="lifeCycle">
						<el-input v-model="maintenanceInfoForm.lifeCycle" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="保修期(月)：" prop="warranty">
						<el-input v-model="maintenanceInfoForm.warranty" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="可用性：" prop="availability">
						<el-input v-model="maintenanceInfoForm.availability" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="可用性检查日期：" prop="dateOfAvailabilityCheck" class="date">
						<el-input v-model="maintenanceInfoForm.dateOfAvailabilityCheck" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="维护人：" prop="maintainerName">
						<el-input v-model="maintenanceInfoForm.maintainerName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="维护人联系方式：" prop="maintainerContact">
						<el-input v-model="maintenanceInfoForm.maintainerContact" :disabled="true"></el-input>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			
			<el-collapse-item name="3" @change="changeHeight">
				<template slot="title">
					扩展属性<i class="el-icon-my-contraction"></i>
				</template>
				<el-form label-width="135px" :model="extendedAttributeForm" :rules="extendedAttributeRules" ref="extendedAttributeForm" :inline="true" style="margin-top: 20px;">
					<el-form-item label="重要级别：" prop="equipmentLevel">
						<el-input v-model="maintenanceInfoForm.equipmentLevel" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="第一责任人：" prop="firstResponsiblePersonName">
						<el-input v-model="extendedAttributeForm.firstResponsiblePersonName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="第二责任人：" prop="secondResponsiblePersonName">
						<el-input v-model="extendedAttributeForm.secondResponsiblePersonName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="设备OID：" prop="equipmentOid">
						<el-input v-model="extendedAttributeForm.equipmentOid" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="信息维护人员：" prop="informationMaintenanceStaffName">
						<el-input v-model="extendedAttributeForm.informationMaintenanceStaffName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="上线日期：" prop="commissioningDate" class="date">
						<el-input v-model="extendedAttributeForm.commissioningDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="软件版本：" prop="softwareVersion">
						<el-input v-model="extendedAttributeForm.softwareVersion" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="SNMP写团体字：" prop="snmpWritingGroup">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.snmpWritingGroup" placement="top-start">
							<el-input v-model="extendedAttributeForm.snmpWritingGroup" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="SNMP读团体字：" prop="snmpReadGroup">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.snmpReadGroup" placement="top-start">
							<el-input v-model="extendedAttributeForm.snmpReadGroup" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="MAC：" prop="mac">
						<el-tooltip class="item" effect="dark" :content="this.basicInfoForm.mac" placement="top-start">
							<el-input v-model="extendedAttributeForm.mac" :disabled="true"></el-input>
						</el-tooltip>
					</el-form-item>
					<el-form-item label="配置文件名称：" prop="configFileName">
						<el-input v-model="extendedAttributeForm.configFileName" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="接口数量(个)：" prop="interfaceNumber">
						<el-input v-model="extendedAttributeForm.interfaceNumber" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="管理接口：" prop="managementInterface">
						<el-input v-model="extendedAttributeForm.managementInterface" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="CPU型号：" prop="cpuModel">
						<el-input v-model="extendedAttributeForm.cpuModel" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="可用接口数量(个)：" prop="availableInterfaceNumber">
						<el-input v-model="extendedAttributeForm.availableInterfaceNumber" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="额定功率(W)：" prop="ratedPower">
						<el-input v-model="extendedAttributeForm.ratedPower" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="内存大小(G)：" prop="memorySize">
						<el-input v-model="extendedAttributeForm.memorySize" :disabled="true"></el-input>
					</el-form-item>
				</el-form>
			</el-collapse-item>
			
			<el-collapse-item title="" name="4" @change="changeHeight">
				<template slot="title">
					财务信息<i class="el-icon-my-contraction"></i>
				</template>
				<el-form label-width="135px" :model="financeInfoForm" :rules="financeInfoRules" ref="financeInfoForm" :inline="true" style="margin-top: 20px;">
					<el-form-item label="采购单号：" prop="purchaseOrderNo">
						<el-input v-model="financeInfoForm.purchaseOrderNo" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="采购价(元)：" prop="purchasePrice">
						<el-input v-model="financeInfoForm.purchasePrice" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="设备权属：" prop="equipmentOwnership">
						<el-input v-model="financeInfoForm.equipmentOwnership" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="采购日期：" prop="purchaseDate" class="date">
						<el-input v-model="financeInfoForm.purchaseDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="到货日期：" prop="arrivalDate" class="date">
						<el-input v-model="financeInfoForm.arrivalDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="财务编号：" prop="financialNumber">
						<el-input v-model="financeInfoForm.financialNumber" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="采购合同号：" prop="purchaseContractNo">
						<el-input v-model="financeInfoForm.purchaseContractNo" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="产权类型：" prop="propertyType">
						<el-input v-model="financeInfoForm.propertyType" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="启用日期：" prop="enableDate" class="date">
						<el-input v-model="financeInfoForm.enableDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="停止日期：" prop="disableDate" class="date">
						<el-input v-model="financeInfoForm.disableDate" :disabled="true"></el-input>
					</el-form-item>
					<el-form-item label="报废日期：" prop="scrapDate" class="date">
						<el-input v-model="financeInfoForm.scrapDate" :disabled="true"></el-input>
					</el-form-item>
				</el-form>
			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				assetId: '',
				type: '',
				activeNames: ['1','2','3','4'],
				// ---基础信息---
				basicInfoForm: {
					code: "", 					// 资产编码
					name: "", 					// 资产名称
					classificationName: "", 	// 资产分类
					manufacturer: "", 			// 厂商
					model: "", 					// 型号
					serialNo: "", 				// 序列号
					barCode: "", 				// 条形码
					managementIp: "", 			// 管理IP
					subordinateUnit: "", 		// 所属单位
					carryingBusiness: "", 		// 承载业务
					assetStatus: "", 			// 资产状态
					regionOfAffiliationName: "", // 所属区域
					buildingName: "", 			// 所属建筑
					machineRoomName: "", 		// 所属机房
					cabinetName: "", 			// 所属机柜
					subordinatePosition: "", 	// 所属位置
					distributionPosition: "", 	// 分布位置
					maintenancePersonnelName: "",// 运维人员
					originalUserName: "", 		// 原使用者
					userName: "", 				// 使用人
					ownerName: "", 				// 拥有者
					remark: "" 					// 备注
				},
				basicInfoRules: { },
				// ---维保信息---
				maintenanceInfoForm: {
					maintenanceStatus: "", 			// 维保状态
					maintenanceDate: "", 			// 维保日期
					lifeSpan: "", 					// 使用年限(年)
					depreciationRate: "", 			// 折旧率(%)
					lifeCycle: "", 					// 生命周期
					warranty: "", 					// 保修期(月)
					availability: "", 				// 可用性
					dateOfAvailabilityCheck: "", 	// 可用性检查日期
					maintainerName: "",				// 维护人
					maintainerContact: "" 			// 维护人联系方式
				},
				maintenanceInfoRules: { },
				// ---扩展属性---
				extendedAttributeForm: {
					equipmentLevel: "", 			// 设备级别
					firstResponsiblePersonName: "", // 第一责任人
					secondResponsiblePersonName: "",// 第二责任人
					equipmentOid: "", 				// 设备OID
					informationMaintenanceStaffName: "",// 信息维护人员
					commissioningDate: "", 			// 上线日期
					softwareVersion: "", 			// 软件版本
					snmpWritingGroup: "", 			// SNMP写团体字
					snmpReadGroup: "", 				// SNMP读团体字
					mac: "", 						// MAC
					configFileName: "", 			// 配置文件名称
					interfaceNumber: "", 			// 接口数量
					managementInterface: "", 		// 管理接口
					cpuModel: "", 					// CPU型号
					availableInterfaceNumber: "", 	// 可用接口数量(个)
					ratedPower: "", 				// 额定功率
					memorySize: "" 					// 内存大小
				},
				extendedAttributeRules: { },
				// ---财务信息---
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
				financeInfoRules: { }
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
				this.change();
			});
		},
		activated() {
			this.$nextTick(this.change);
		},
		methods: {
			changeHeight() {
				this.$parent.$parent.changeScrollbarH++;
			},
			init() {
				// 文本域设置宽度
				var parentWidth = $("#basicInfoRemark").parent().width();
				var myselfWidth = parentWidth - 275;
				var oldWidth = $("#basicInfoRemark .el-form-item__content").width();
				$("#basicInfoRemark .el-form-item__content").width(myselfWidth);
			},
			change() {
				this.assetId = this.$route.query.id;
				this.type = this.$route.query.type;
				switch(this.type) {
					case 'version' :
						this.queryVersionInfo(); break;
					case 'apply':
						this.queryDetail('/assets/apply/detail'); break;
					default: 
						this.queryDetail('/assets/management/detail'); break;
				}
			},
			// 详情(全部数据)
	      	queryDetail(url) {
	      		this.$axios.post(url,{ assetId:this.assetId }).then( (res) => {
					if(res.status == 200) {
						this.basicInfoForm = res.data;
						this.maintenanceInfoForm = res.data;
						this.extendedAttributeForm = res.data;
						this.financeInfoForm = res.data;
					}
				});
	      	},
	      	// 版本信息详情
	      	queryVersionInfo() {
	      		this.$axios.post('/assets/version/detail',{versionId:this.assetId}).then( (res) => {
					if(res.status == 200) {
						this.basicInfoForm = res.data;
						this.maintenanceInfoForm = res.data;
						this.extendedAttributeForm = res.data;
						this.financeInfoForm = res.data;
					}
				});
	      	}
		}
	}
</script>