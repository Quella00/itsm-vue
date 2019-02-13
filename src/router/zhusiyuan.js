import layout from '@/pages/layout.vue'

//系统配置 -> 分类管理
import categoryManagement from '@/pages/system/systemConfig/categoryManagement.vue'
//系统配置 -> 区域管理
import areaManagement from '@/pages/system/systemConfig/areaManagement.vue'
//系统配置 -> 建筑管理
import buildingManagement from '@/pages/system/systemConfig/buildingManagement.vue'
//系统配置 -> 机房管理
import machineRoom from '@/pages/system/systemConfig/machineRoom.vue'
//系统配置 -> 机柜管理
import cabinetManagement from '@/pages/system/systemConfig/cabinetManagement.vue'
//系统配置 -> 库房管理
import storageRoom from '@/pages/system/systemConfig/storageRoom.vue'
//系统配置 -> 菜单管理
import menuManagement from '@/pages/system/developerOptions/menuManagement.vue'

// 工单管理 -> 综合查询
import orderTable from '@/pages/workOrder/orderSeo.vue'
import orderAllTable from '@/pages/workOrder/orderManage/orderTable.vue?type=0'
// 工单管理 -> 事件管理
import orderEventTable from '@/pages/workOrder/orderManage/orderTable.vue?type=1'
import orderEventDetail from '@/pages/workOrder/orderManage/orderDetail.vue?type=1'
// 工单管理 -> 问题管理
import orderProblemTable from '@/pages/workOrder/orderManage/orderTable.vue?type=2'
import orderProblemDatail from '@/pages/workOrder/orderManage/orderDetail.vue?type=2'
// 工单管理 -> 变更管理
import orderChangeTable from '@/pages/workOrder/orderManage/orderTable.vue?type=3'
import orderChangeDatail from '@/pages/workOrder/orderManage/orderDetail.vue?type=3'
import orderChangeCalendar from '@/pages/workOrder/orderManage/orderCalendar.vue?type=3'
// 工单管理 -> 发布管理
import orderPublishTable from '@/pages/workOrder/orderManage/orderTable.vue?type=4'
import orderPublishDatail from '@/pages/workOrder/orderManage/orderDetail.vue?type=4'
// 工单管理 -> 备件管理
import orderBackupTable from '@/pages/workOrder/orderManage/orderTable.vue?type=5'
import orderBackupDatail from '@/pages/workOrder/orderManage/orderDetail.vue?type=5'


// 备件管理-->备件管理
import spareManagement from '@/pages/spare/spareManage/spareManagement.vue'
// 备件管理-->新增备件 
import spareAdd from '@/pages/spare/spareManage/spareAdd.vue'
// 备件管理-->编辑备件 
import spareEdit from '@/pages/spare/spareManage/spareEdit.vue'
// 备件管理-->新增审核 
import spareAudit from '@/pages/spare/spareAudit/spareAudit.vue'
// 备件管理-->备件审核详情
import spareAuditDetail from '@/pages/spare/spareAudit/spareAuditDetail.vue'
// 备件管理-->入库管理
import warehouseManagement from '@/pages/spare/warehouseManage/warehouseManagement.vue'
// 备件管理-->查看入库单
import warehouseDetail from '@/pages/spare/warehouseManage/warehouseDetail.vue'
// 备件管理-->创建入库单
import warehouseCreate from '@/pages/spare/warehouseManage/warehouseCreate.vue'
// 备件管理-->出库管理
import stockoutManagement from '@/pages/spare/stockoutManage/stockoutManagement.vue'
// 备件管理-->查看出库单
import stockoutDetail from '@/pages/spare/stockoutManage/stockoutDetail.vue'
// 备件管理-->创建出库单
import stockoutCreate from '@/pages/spare/stockoutManage/stockoutCreate.vue'
// 备件管理-->备件应用
import spareApply from '@/pages/spare/spareApply/spareApply.vue'
// 备件管理-->查看备件
import spareApplyDetail from '@/pages/spare/spareApply/spareApplyDetail.vue'


// 开发管理 -> 公共词典
//import publicDictory from '@/pages/develop/poulicDictory.vue'

const zhusiyuan = {
	path: '/',
	component: layout,
	children: [
		{
			name: '分类管理',
			path: '/system/systemConfig/categoryManagement',
			component: categoryManagement,
			componentName: 'categoryManagement'
		}, 
		{
			name: '区域管理',
			path: '/system/systemConfig/areaManagement',
			component: areaManagement,
			componentName: 'areaManagement',
		}, 
		{
			name: '建筑管理',
			path: '/system/systemConfig/buildingManagement',
			component: buildingManagement,
			componentName: 'buildingManagement',
		}, 
		{
			name: '库房管理',
			path: '/system/systemConfig/storageRoom',
			component: storageRoom,
			componentName: 'storageRoom',
		},  
		{
			name: '机柜管理',
			path: '/system/systemConfig/cabinetManagement',
			component: cabinetManagement,
			componentName: 'cabinetManagement',
		},
		{
			name: '机房管理',
			path: '/system/systemConfig/machineRoom',
			component: machineRoom,
			componentName: 'machineRoom',
		},
		{
			name: '菜单管理',
			path: '/system/developerOptions/menuManagement',
			component: menuManagement,
			componentName: 'menuManagement',
		},
		/******************************工单管理******************************/ 
		// 工单管理-->综合查询
		{
			name: '待办工单',path: '/workOrder/orderTable/all',component: orderAllTable,componentName: 'orderAllTable'
		}, 

		// 工单管理-->事件管理
		{
			name: '待办事件',path: '/workOrder/orderTable/event',component: orderEventTable,componentName: 'orderEventTable'
		}, 
		{	
			name: '事件工单详情',path: '/workOrder/orderDatail/event',component: orderEventDetail,componentName: 'orderEventDetail'
		},
		// 工单管理-->问题管理
		{
			name: '待办问题',path: '/workOrder/orderTable/question',component: orderProblemTable,componentName: 'orderProblemTable'
		}, 
		{
			name: '问题工单详情',path: '/workOrder/orderDatail/question',component: orderProblemDatail,componentName: 'orderProblemDatail'
		},
		// 工单管理-->变更管理
		{
			name: '待办变更',path: '/workOrder/orderTable/change',component: orderChangeTable,componentName: 'orderChangeTable'
		}, 
		{
			name: '变更日历',path: '/workOrder/orderCalendar/change',component: orderChangeCalendar,componentName: 'orderChangeCalendar'
		},
		{
			name: '变更工单详情',path: '/workOrder/orderDatail/change',component: orderChangeDatail,componentName: 'orderChangeDatail'
		},
		// 工单管理-->发布管理 
		{
			name: '待办发布',path: '/workOrder/orderTable/publish',component: orderPublishTable,componentName: 'orderPublishTable'
		}, 
		{
			name: '发布工单详情',path: '/workOrder/orderDatail/publish',component: orderPublishDatail,componentName: 'orderPublishDatail'
		},
		// 工单管理-->备件管理 
		{
			name: '待办备件',path: '/workOrder/orderTable/spare',component: orderBackupTable,componentName: 'orderBackupTable'
		}, 
		{
			name: '备件工单详情',path: '/workOrder/orderDatail/spare',component: orderBackupDatail,componentName: 'orderBackupDatail'
		},

		// 开发管理
		// 工单管理-->综合查询
//		{
//			name: '公共字典',path: '/develop/public',component: publicDictory,componentName: 'publicDictory'
//		},

		/******************************备件管理******************************/ 
		// 备件管理-->备件管理
		{
			name: '备件管理',path: '/spare/spareManagement',component: spareManagement,componentName: 'spareManagement'
		},
		// 备件管理-->新增备件
		{
			name: '新增备件',path: '/spare/spareAdd',component: spareAdd,componentName: 'spareAdd'
		},
		// 备件管理-->编辑备件
		{
			name: '编辑备件',path: '/spare/spareEdit',component: spareEdit,componentName: 'spareEdit'
		},
		// 备件管理-->备件审核
		{
			name: '备件审核',path: '/spare/spareAudit',component: spareAudit,componentName: 'spareAudit'
		},
		// 备件管理-->备件审核详情
		{
			name: '备件审核详情',path: '/spare/spareAuditDetail',component: spareAuditDetail,componentName: 'spareAuditDetail'
		},
		// 备件管理-->入库管理
		{
			name: '入库管理',path: '/spare/warehouseManagement',component: warehouseManagement,componentName: 'warehouseManagement'
		},
		// 备件管理-->查看入库单
		{
			name: '查看入库单',path: '/spare/warehouseDetail',component: warehouseDetail,componentName: 'warehouseDetail'
		},
		// 备件管理-->创建入库单
		{
			name: '创建入库单',path: '/spare/warehouseCreate',component: warehouseCreate,componentName: 'warehouseCreate'
		},
		// 备件管理-->出库管理
		{
			name: '出库管理',path: '/spare/stockoutManagement',component: stockoutManagement,componentName: 'stockoutManagement'
		},
		// 备件管理-->查看出库单
		{
			name: '查看出库单',path: '/spare/stockoutDetail',component: stockoutDetail,componentName: 'stockoutDetail'
		},
		// 备件管理-->创建出库单
		{
			name: '创建出库单',path: '/spare/stockoutCreate',component: stockoutCreate,componentName: 'stockoutCreate'
		},
		// 备件管理-->备件应用
		{
			name: '备件应用',path: '/spare/spareApply',component: spareApply,componentName: 'spareApply'
		},
		// 备件管理-->查看备件
		{
			name: '查看备件',path: '/spare/spareApplyDetail',component: spareApplyDetail,componentName: 'spareApplyDetail'
		},
	]
}

export default zhusiyuan;