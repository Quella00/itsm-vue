<!-- 编辑资产 -->
<template>
	<div class="itsm-tabs-main add-edit-asset">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:changeScrollbarH}">
				<div class="add-edit-asset-container">

					<div>
						<asset-top ref="assetTop" @callback="getTopData"></asset-top>
					</div>

					<div>
						<asset-bottom ref="assetBottom" :topData="topData"></asset-bottom>
					</div>

					<div class="btn-index">
						<el-button type="normal" @click="saveAudit(true)">提交审核</el-button>
						<el-button type="normal" @click="saveAudit(false)">保存</el-button>
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
		<!--关联资产-->
		<associated-asset v-model="associatedAsset.show" v-if="associatedAsset.show" @associatedAssetHandler="dialogHandle" :assetInfo="associatedAsset.assetInfo"></associated-asset>
		<!--接口信息-->
		<interfaces-info v-model="interfacesInfo.show" v-if="interfacesInfo.show" @interfacesInfoHandler="dialogHandle" :assetInfo="interfacesInfo.assetInfo"></interfaces-info>
		<!--合同信息-->
		<contract-info v-model="contractInfo.show" v-if="contractInfo.show" @contractInfoHandler="dialogHandle" :assetId="assetId"></contract-info>
		<!--供应商信息-->
		<suppliers-info v-model="suppliersInfo.show" v-if="suppliersInfo.show" @suppliersInfoHandler="dialogHandle" :assetId="assetId"></suppliers-info>
	</div>
</template>

<script>
	import assetTop from './addEditAssetTop.vue'
	import assetBottom from './addEditAssetBottom.vue'
	import associatedAsset from '../dialog/associatedAsset.vue'
	import interfacesInfo from '../dialog/interfacesInfo.vue'
	import contractInfo from '../dialog/contractInfo.vue'
	import suppliersInfo from '../dialog/suppliersInfo.vue'

	export default {
		name: 'assetEdit',
		components: {
			assetTop, assetBottom, associatedAsset, interfacesInfo, contractInfo, suppliersInfo
		},
		data() {
			return {
				changeScrollbarH: 1,
				loading: null,
				assetId: '',			// 资产id
				topData: null,			// 表单数据
				submitAudit: false,		// 是否提交审核
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
					selectId: null
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
				// 关联资产
				associatedAsset: {
					show: false,
					assetInfo: null
				},
				// 接口信息
				interfacesInfo: {
					show: false,
					assetInfo: null
				},
				// 合同信息
				contractInfo: {
					show: false
				},
				// 供应商信息
				suppliersInfo: {
					show: false,
				}
			}
		},
		mounted() {
			this.$nextTick(function() {

			});
		},
		activated() {
			
		},
		methods: {
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
					case 'contract':
						// 合同信息
						this.assetId = this.$route.query.id;
						this.contractInfo.show = true;
						break;
					case 'supplier':
						// 供应商信息
						this.assetId = this.$route.query.id;
						this.suppliersInfo.show = true;
						break;
				}
			},
			assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.$refs.assetTop.basicInfoForm.classification = node.id;
	                this.$refs.assetTop.basicInfoForm.classificationName = node.categoryName;
	           }
	       	},
			areaChooseHandler(node) {
	            if(node) {
	                this.areaDialog.selectId = node.id;
	                this.$refs.assetTop.basicInfoForm.regionOfAffiliation = node.id;
	                this.$refs.assetTop.basicInfoForm.regionOfAffiliationName = node.areaName;
	                this.$refs.assetTop.queryBuilding(node.id);
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
	      				this.$refs.assetTop.basicInfoForm.owner = id; 
	      				this.$refs.assetTop.basicInfoForm.ownerName = name; 
	      				this.personRadioDialog.ownerId = id;
	      				break;
	      			case 'maintainer':					// 维护人
	      				this.$refs.assetTop.maintenanceInfoForm.maintainer = id;
	      				this.$refs.assetTop.maintenanceInfoForm.maintainerName = name;
	      				this.personRadioDialog.maintainerId = id;
	      				break;
	      			case 'firstResponsiblePerson':		// 第一责任人
	      				this.$refs.assetTop.extendedAttributeForm.firstResponsiblePerson = id;
	      				this.$refs.assetTop.extendedAttributeForm.firstResponsiblePersonName = name;
	      				this.personRadioDialog.firstResponsiblePersonId = id;
	      				break;
	      			case 'secondResponsiblePerson':		// 第二责任人
	      				this.$refs.assetTop.extendedAttributeForm.secondResponsiblePerson = id; 
	      				this.$refs.assetTop.extendedAttributeForm.secondResponsiblePersonName = name;
	      				this.personRadioDialog.secondResponsiblePersonId = id;
	      				break;
	      			case 'informationMaintenanceStaff':	// 信息维护人员
	      				this.$refs.assetTop.extendedAttributeForm.informationMaintenanceStaff = id; 
	      				this.$refs.assetTop.extendedAttributeForm.informationMaintenanceStaffName = name; 
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
	      			case 'maintenancePersonnel':		// 运维人员
	      				this.personCheckDialog.maintenancePersonnel = data;
	      				this.$refs.assetTop.basicInfoForm.maintenancePersonnel = id.toString();
	      				this.$refs.assetTop.basicInfoForm.maintenancePersonnelName = name.toString();
	      				break;
	      			case 'originalUser':				// 原使用者
	      				this.personCheckDialog.originalUser = data;
	      				this.$refs.assetTop.basicInfoForm.originalUser = id.toString();
	      				this.$refs.assetTop.basicInfoForm.originalUserName = name.toString();
	      				break;
	      			case 'user':						// 使用人
	      				this.personCheckDialog.user = data;
	      				this.$refs.assetTop.basicInfoForm.user = id.toString();
	      				this.$refs.assetTop.basicInfoForm.userName = name.toString();
	      				break;
	      		}
	     	},
	     	// 关联资产:新增、编辑
			openAssociatedAssetDialog(type,data) {
				this.associatedAsset.assetInfo = {
					type: type,
					editId: data,
					addId: this.$route.query.id,
					assetName: this.$store.state.asset.assetName
				}
				this.associatedAsset.show = true;
			},
	        // 接口信息:新增、编辑
	        openInterfacesInfoDialog(type,data) {
	        	this.interfacesInfo.assetInfo = {
					type: type,
					id: data,
					assetId: this.$route.query.id
				}
				this.interfacesInfo.show = true;
			},
	     	// tab页弹窗回调(刷新列表)
			dialogHandle(data) {
				if(data) {
					const self = this;
					setTimeout(function(){
						self.$refs.assetBottom.query();
					},500);
				}
			},
			// 表单数据返回
			getTopData(data) {
				this.topData = data;
			},
			// 保存此表单调用(将表单的参数传到tab页)
			validateTop() {
				this.$refs.assetTop.validate();
			},
			// 提交审核、保存
			saveAudit(data) {
				const self = this;
				
				// 验证表单
				this.$refs.assetTop.validate();
				if(this.topData == null) {
					self.$message({ type: 'warning', message: '表单输入有误，请检查' });
					return;
				}
				
				// 整改传入参数
				var param = this.topData;
				for(var item in param) {
					if(param[item] == "" || param[item] == null) {
						delete param[item];
					}
				}
				this.fieldName.forEach(function(item) {
					delete param[item];
				});
				param['assetId'] = this.$route.query.id;
				this.submitAudit = data;
				param['submitAudit'] = this.submitAudit;
				delete param.id;
				
				this.$axios.post('/assets/management/update',param).then( (res) => {
					if(res.status == 200) {
						// 更新资产名称
						this.$store.state.asset.assetName = param['name'];
						// tab页在关联资产的话，就刷新列表，更新资产名称
						if(this.$refs.assetBottom.currentPage == "associated") {
							this.$refs.assetBottom.query();
						}
						if(this.submitAudit) {
							self.$message({ type: 'success', message: '提交审核成功!' });
							this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
						} else {
							self.$message({ type: 'success', message: '保存成功!' });
							this.$ies.dispatch(this, 'layout').$refs.tabsnav.closePage(this.$route.fullPath);
						}
					} else if(res.status == 400) {
						self.$message({ type: 'warning', message: res.message[0].prompt });
					} else {
						if(this.submitAudit) {
							self.$message({ type: 'error', message: '提交审核失败' });
						} else {
							self.$message({ type: 'error', message: '保存失败' });
						}
					}
				});
			}
		}
	}
</script>