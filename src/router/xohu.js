import Layout from '@/pages/layout.vue'

// 系统通知
import noticeAllDialog from '@/pages/userCenter/noticeAllDialog'

// 系统管理 -> 在线人员管理 
import OnlineStaff from '@/pages/system/onlineStaff'
// 系统管理 -> 日常管理 -> 公告管理 
import Notice from '@/pages/system/daily/notice'
import NoticeSave from '@/pages/system/daily/noticeSave'
// 系统管理 -> 日常管理 -> 快捷访问管理 
import QuickAccess from '@/pages/system/daily/quickAccess'

// 服务等级管理 -> 支撑合同管理（UC）
import Uc from '@/pages/serviceGrade/uc'
import UcSave from '@/pages/serviceGrade/ucSave'

// 流程管理 -> 表单管理
import field from '@/pages/process/formManagement/field'
import form from '@/pages/process/formManagement/form'
import formVersion from '@/pages/process/formManagement/formVersion'
import formSaveEvent from '@/pages/process/formManagement/formSaveEvent'
import formSaveProblem from '@/pages/process/formManagement/formSaveProblem'
import formSaveChange from '@/pages/process/formManagement/formSaveChange'
import formSaveRelease from '@/pages/process/formManagement/formSaveRelease'
import formSaveSpareParts from '@/pages/process/formManagement/formSaveSpareParts'

// 权限
import jurisdictionList from '@/pages/system/jurisdiction/list'

// 工单管理 -> 综合查询
import orderSeo from '@/pages/workOrder/orderSeo'

const xohu = {
	path: '/',
	component: Layout,
	children: [
		// 系统通知
		{
			name: '系统通知',
			path: '/userCenter/noticeAll',
			component: noticeAllDialog,
			componentName: 'xohu-noticeAll'
		},
		// 系统管理 -> 在线人员管理 
		{
			name: '在线人员管理',
			path: '/system/online-staff',
			component: OnlineStaff,
			componentName: 'xohu-OnlineStaff'
		},
		// 系统管理 -> 日常管理 -> 公告管理 
		{
			name: '公告管理',
			path: '/system/notice',
			component: Notice,
			componentName: 'xohu-Notice'
		},
		{
			name: '公告管理-新增/编辑',
			path: '/system/noticeSave',
			component: NoticeSave,
			componentName: 'xohu-NoticeSave'
		},
		// 系统管理 -> 日常管理 -> 快捷访问管理 
		{
			name: '快捷访问管理',
			path: '/system/quick-access',
			component: QuickAccess,
			componentName: 'xohu-QuickAccess'
		},

		// 支撑合同管理（UC）
		{
			name: 'UC管理',
			path: '/serviceGrade/uc',
			component: Uc,
			componentName: 'xohu-Uc'
		},
		{
			name: 'UC管理-新增/编辑',
			path: '/serviceGrade/ucSave',
			component: UcSave,
			componentName: 'xohu-UcSave'
		},

		// 流程管理 -> 表单管理 -> 表单字段管理
		{
			name: '表单字段管理',
			path: '/process/formManagement/field',
			component: field,
			componentName: 'xohu-field'
		},
		// 流程管理 -> 表单管理 -> 表单管理
		{
			name: '表单管理',
			path: '/process/formManagement/form',
			component: form,
			componentName: 'xohu-form'
		},
		{
			name: '表单版本',
			path: '/process/formManagement/formVersion',
			component: formVersion,
			componentName: 'xohu-formVersion'
		},
		{
			name: '事件表单编辑',
			path: '/process/formManagement/formSaveEvent',
			component: formSaveEvent,
			componentName: 'xohu-formSaveEvent'
		},
		{
			name: '问题表单编辑',
			path: '/process/formManagement/formSaveProblem',
			component: formSaveProblem,
			componentName: 'xohu-formSaveProblem'
		},
		{
			name: '变更表单编辑',
			path: '/process/formManagement/formSaveChange',
			component: formSaveChange,
			componentName: 'xohu-formSaveChange'
		},
		{
			name: '发布表单编辑',
			path: '/process/formManagement/formSaveRelease',
			component: formSaveRelease,
			componentName: 'xohu-formSaveRelease'
		},
		{
			name: '备件表单编辑',
			path: '/process/formManagement/formSaveSpareParts',
			component: formSaveSpareParts,
			componentName: 'xohu-formSaveSpareParts'
		},
        // 系统管理 -> 权限列表
		{
			name: '权限列表',
			path: '/system/jurisdiction/list',
			component: jurisdictionList,
			componentName: 'xohu-jurisdictionList'
		},
		// 工单管理 -> 综合查询
		{
			name: '工单综合查询',path: '/workOrder/orderSeo',
			component: orderSeo,
			componentName: 'xohu-orderSeo'
		}, 
	]
}

export default xohu;