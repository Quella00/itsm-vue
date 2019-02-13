import iesUpload from '@/components/ies-upload.vue'
import iesCheckedAll from '@/components/ies-checkedAll.vue'
import iesAreaDialog from '@/components/ies-areaDialog.vue'
import iesAssetDialog from '@/components/ies-assetClassificationDialog.vue'
import iesMachineDialog from '@/components/ies-machineDialog.vue'
import iesStoreRoomDialog from '@/components/ies-storeRoomDialog.vue'
import iesOrganizationDialog from '@/components/ies-organizationDialog.vue'
import iesOrganizationCheckDialog from '@/components/ies-organizationCheckDialog.vue'

import iesMaintenanceGroupDialog from '@/components/ies-maintenanceGroupDialog.vue'

import iesPersonRadioDialog from '@/components/ies-personRadioDialog.vue'
import iesPersonCheckboxDialog from '@/components/ies-personCheckboxDialog.vue'
import iesPersonCheckDialog from '@/components/ies-personCheckDialog.vue'
import iesAssociatedAssetDialog from '@/components/ies-associatedAssetDialog.vue'
import iesProgressSteps from '@/components/ies-progressSteps.vue'
import iesProcessSteps from '@/components/ies-processSteps.vue'
import iesRelationAssetDialog from '@/components/ies-relationAssetDialog.vue'
import iesBusinessClassificationDialog from '@/components/ies-businessClassificationDialog.vue'
import iesTechnologyClassificationDialog from '@/components/ies-technologyClassificationDialog.vue'
import iesKnowledgeClassificationDialog from '@/components/ies-knowledgeClassificationDialog.vue'
import iesFieldAddDialog from '@/components/ies-fieldAddDialog.vue'
// 备件管理--->入库详情部分 ^(*￣(oo)￣)^
import wareBase from '@/pages/spare/warehouseManage/components/wareBase.vue'
import wareTable from '@/pages/spare/warehouseManage/components/wareTable.vue'
// 备件管理--->出库详情部分 ^(*￣(oo)￣)^
import stockBase from '@/pages/spare/stockoutManage/components/stockBase.vue'
import stockTable from '@/pages/spare/stockoutManage/components/stockTable.vue'
// 备件管理--->备件报废/转资产 ^(*￣(oo)￣)^
import iesSpareScrap from '@/components/ies-spareScrap.vue'
import iesToAsset from '@/components/ies-toAsset.vue'
// 工单操作部分
import iesOrderCloseDialog from '@/components/ies-orderCloseDialog.vue'
import iesOrderHandupDialog from '@/components/ies-orderHandupDialog.vue'
import iesOrderAssignDialog from '@/components/ies-orderAssignDialog.vue'
import iesOrderBackDialog from '@/components/ies-orderBackDialog.vue'
import iesOrderComplainDialog from '@/components/ies-orderComplainDialog.vue'
import iesOrderRelateDialog from '@/components/ies-orderRelateDialog.vue'
import iesOrderConfirmDialog from '@/components/ies-orderConfirmDialog.vue'
// 工单列表
import orderTable from '@/pages/workOrder/orderManage/orderTable.vue'
// formInfoComponent
import formInfoComponent from '@/components/orderDetail/formInfoComponent.vue'
import contentAddDialog from '@/components/orderDetail/contentAddDialog.vue'


// 二维码打印预览
import iesQrcodeViewDialog from '@/components/ies-qrcodeViewDialog.vue'

import VueScrollbar from 'vue2-scrollbar'
import '../less/vue2-scrollbar.less'

//服务台创建工单
import createOrder from '@/components/createOrder.vue'
//服务台填写表单
import fillForm from '@/components/fillForm.vue'

//公告/通知详情
import noticeDetail from '@/components/noticeDetail.vue'

// 角色选择
import iesRoleRadioDialog from '@/components/ies-roleRadioDialog.vue'

const iesComponents = {};
iesComponents.install = function (Vue) {
	//上传组件(自定义)
	Vue.component('iesUpload', iesUpload);

    //批量全选组件
    Vue.component('iesCheckedAll', iesCheckedAll);

    //滚动组件
    Vue.component('iesScrollbar', VueScrollbar);

    //区域选择弹框
    Vue.component('iesAreaDialog', iesAreaDialog);

    //所属机房选择弹框
    Vue.component('iesMachineDialog', iesMachineDialog);

    //所属库房选择弹窗
    Vue.component('iesStoreRoomDialog', iesStoreRoomDialog);

    //资产分类弹窗
    Vue.component('iesAssetDialog', iesAssetDialog);

    //组织选择弹窗
    Vue.component('iesOrganizationDialog', iesOrganizationDialog);

    //组织选择弹窗(多选)
    Vue.component('iesOrganizationCheckDialog', iesOrganizationCheckDialog);
    
    //运维组选择弹窗
    Vue.component('iesMaintenanceGroupDialog', iesMaintenanceGroupDialog);

    //人员选择弹窗（单选）
    Vue.component('iesPersonRadioDialog', iesPersonRadioDialog);

    //人员选择弹窗（多选）
    Vue.component('iesPersonCheckboxDialog', iesPersonCheckboxDialog);

    //人员选择弹窗（多选,返回人员对象对象数组）
    Vue.component('iesPersonCheckDialog', iesPersonCheckDialog);

    // 关联资产弹窗
    Vue.component('iesAssociatedAssetDialog', iesAssociatedAssetDialog)

    // 步骤条
    Vue.component('iesProgressSteps', iesProgressSteps)

    // 流程操作
    Vue.component('iesProcessSteps', iesProcessSteps)

    //关联资产弹窗（服务台中创建工单用）
    Vue.component('iesRelationAssetDialog', iesRelationAssetDialog)

    //业务分类弹窗
    Vue.component('iesBusinessClassificationDialog', iesBusinessClassificationDialog)

    //技术分类弹窗
    Vue.component('iesTechnologyClassificationDialog', iesTechnologyClassificationDialog)

    //知识分类弹窗
    Vue.component('iesKnowledgeClassificationDialog', iesKnowledgeClassificationDialog)
    
    //表单管理添加字段弹窗
    Vue.component('iesFieldAddDialog', iesFieldAddDialog)

    //工单确认
    Vue.component('iesOrderConfirmDialog', iesOrderConfirmDialog)

    //工单关闭
    Vue.component('iesOrderCloseDialog', iesOrderCloseDialog)

    //工单挂起
    Vue.component('iesOrderHandupDialog', iesOrderHandupDialog)

    //工单指派
    Vue.component('iesOrderAssignDialog', iesOrderAssignDialog)

    //工单指派
    Vue.component('iesOrderBackDialog', iesOrderBackDialog)

    //工单投诉
    Vue.component('iesOrderComplainDialog', iesOrderComplainDialog)

    //关联工单
    Vue.component('iesOrderRelateDialog', iesOrderRelateDialog)

    //申请信息
    Vue.component('formInfoComponent', formInfoComponent)
    Vue.component('contentAddDialog', contentAddDialog)

    //服务台创建工单
    Vue.component('createOrder', createOrder)

    //服务台填写表单
    Vue.component('fillForm', fillForm)

    //公告/通知详情
    Vue.component('iesNoticeDetail', noticeDetail)
    
    // 角色选择弹窗（单选）
    Vue.component('iesRoleRadioDialog', iesRoleRadioDialog)
    
    // 备件管理--->入库详情部分 ^(*￣(oo)￣)^
    Vue.component('wareBase', wareBase)
    Vue.component('wareTable', wareTable)

    // 备件管理--->入库详情部分 ^(*￣(oo)￣)^
    Vue.component('stockBase', stockBase)
    Vue.component('stockTable', stockTable)
    // 备件管理--->备件报废/转资产 ^(*￣(oo)￣)^
    Vue.component('iesSpareScrap', iesSpareScrap)
    Vue.component('iesToAsset', iesToAsset)
    
    // 生成二维码预览
    Vue.component('iesQrcodeViewDialog', iesQrcodeViewDialog);
    
}

export default iesComponents;