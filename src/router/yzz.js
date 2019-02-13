import layout from '@/pages/layout.vue'

// 首页------------------------------

// 个人中心
import personalInfo from '@/pages/userCenter/personalInfo.vue'
import modifyPassword from '@/pages/userCenter/modifyPassword.vue'

// 服务等级管理------------------------------

// 服务等级管理 -> SLA管理
import sla from '@/pages/serviceGrade/sla'
import slaAssetSave from '@/pages/serviceGrade/slaAssetSave'

// 服务等级管理 -> 后台协议管理（OLA）
import ola from '@/pages/serviceGrade/ola'
import olaSave from '@/pages/serviceGrade/olaSave'
import olaEdit from '@/pages/serviceGrade/olaEdit'

// 流程管理------------------------------

// 事件流程管理
import eventProcess from '@/pages/process/processManagement/eventProcess/index.vue'
import addEventBaseInfo from '@/pages/process/processManagement/eventProcess/addBaseInfo.vue'
import makeEventProcess from '@/pages/process/processManagement/eventProcess/makeProcess.vue'
import editEventProcess from '@/pages/process/processManagement/eventProcess/editProcess.vue'

// 问题流程管理
import problemProcess from '@/pages/process/processManagement/problemProcess/index.vue'
import addProblemBaseInfo from '@/pages/process/processManagement/problemProcess/addBaseInfo.vue'
import makeProblemProcess from '@/pages/process/processManagement/problemProcess/makeProcess.vue'
import editProblemProcess from '@/pages/process/processManagement/problemProcess/editProcess.vue'

// 变更流程管理
import changeProcess from '@/pages/process/processManagement/changeProcess/index.vue'
import addChangeBaseInfo from '@/pages/process/processManagement/changeProcess/addBaseInfo.vue'
import makeChangeProcess from '@/pages/process/processManagement/changeProcess/makeProcess.vue'
import editChangeProcess from '@/pages/process/processManagement/changeProcess/editProcess.vue'

// 发布流程管理
import releaseProcess from '@/pages/process/processManagement/releaseProcess/index.vue'
import addReleaseBaseInfo from '@/pages/process/processManagement/releaseProcess/addBaseInfo.vue'
import makeReleaseProcess from '@/pages/process/processManagement/releaseProcess/makeProcess.vue'
import editReleaseProcess from '@/pages/process/processManagement/releaseProcess/editProcess.vue'

// 备件流程管理
import spareProcess from '@/pages/process/processManagement/spareProcess/index.vue'
import addSpareBaseInfo from '@/pages/process/processManagement/spareProcess/addBaseInfo.vue'
import makeSpareProcess from '@/pages/process/processManagement/spareProcess/makeProcess.vue'
import editSpareProcess from '@/pages/process/processManagement/spareProcess/editProcess.vue'


// 绩效管理------------------------------

// 报表统计
import synthesisReport from '@/pages/performance/report/synthesis.vue'
import organizationReport from '@/pages/performance/report/organization.vue'
import assetsReport from '@/pages/performance/report/assets.vue'
import maintenanceGroupReport from '@/pages/performance/report/maintenanceGroup.vue'
import responseReport from '@/pages/performance/report/response.vue'
import handleReport from '@/pages/performance/report/handle.vue'
import satisfactionReport from '@/pages/performance/report/satisfaction.vue'
import knowledgeReport from '@/pages/performance/report/knowledge.vue'

// 绩效
import assessmentPerformance from '@/pages/performance/performanceManagement/assessment.vue'
import maintenanceGroupPerformance from '@/pages/performance/performanceManagement/maintenanceGroup.vue'
import personnelPerformance from '@/pages/performance/performanceManagement/personnel.vue'

const yzz = {
	path: '/',
	component: layout,
	children: [
		// 首页------------------------------
		
		// 首页 -> 个人中心
		{
			name: '个人信息',
			path: '/userCenter/personalInfo',
			component: personalInfo,
			componentName: 'personalInfo'
		},
		
		{
			name: '修改密码',
			path: '/userCenter/modifyPassword',
			component: modifyPassword,
			componentName: 'modifyPassword'
		},

		// 服务等级管理------------------------------
		
		// 服务等级管理 -> SLA管理
		{
			name: 'SLA管理',
			path: '/serviceGrade/sla',
			component: sla,
			componentName: 'sla'
		},
		{
			name: '关联资产',
			path: '/serviceGrade/slaAssetSave',
			component: slaAssetSave,
			componentName: 'slaAssetSave'
		},
		
		// 服务等级管理 -> 后台协议管理（OLA）
		{
			name: 'OLA管理',
			path: '/serviceGrade/ola',
			component: ola,
			componentName: 'ola'
		},
		{
			name: '查看OLA',
			path: '/serviceGrade/olaEdit',
			component: olaEdit,
			componentName: 'olaEdit'
		},
		{
			name: '新增OLA',
			path: '/serviceGrade/olaSave',
			component: olaSave,
			componentName: 'olaSave'
		},
		
		// 流程管理------------------------------
		
		// 流程管理 -> 事件流程管理
		{
			name: '事件流程管理',
			path: '/process/processManagement/eventProcess',
			component: eventProcess,
			componentName: 'eventProcess'
		},
		{
			name: '新增事件流程',
			path: '/process/processManagement/eventProcess/addEventBaseInfo',
			component: addEventBaseInfo,
			componentName: 'addEventBaseInfo'
		},
		{
			name: '制作事件流程',
			path: '/process/processManagement/eventProcess/makeEventProcess',
			component: makeEventProcess,
			componentName: 'makeEventProcess'
		},
		{
			name: '编辑事件流程',
			path: '/process/processManagement/eventProcess/editEventProcess',
			component: editEventProcess,
			componentName: 'editEventProcess'
		},
		
		// 流程管理 -> 问题流程管理
		{
			name: '问题流程管理',
			path: '/process/processManagement/problemProcess',
			component: problemProcess,
			componentName: 'problemProcess'
		},
		{
			name: '新增问题流程',
			path: '/process/processManagement/problemProcess/addProblemBaseInfo',
			component: addProblemBaseInfo,
			componentName: 'addProblemBaseInfo'
		},
		{
			name: '制作问题流程',
			path: '/process/processManagement/problemProcess/makeProblemProcess',
			component: makeProblemProcess,
			componentName: 'makeProblemProcess'
		},
		{
			name: '编辑问题流程',
			path: '/process/processManagement/problemProcess/editProblemProcess',
			component: editProblemProcess,
			componentName: 'editProblemProcess'
		},
		
		// 流程管理 -> 变更流程管理
		{
			name: '变更流程管理',
			path: '/process/processManagement/changeProcess',
			component: changeProcess,
			componentName: 'changeProcess'
		},
		{
			name: '新增变更流程',
			path: '/process/processManagement/changeProcess/addChangeBaseInfo',
			component: addChangeBaseInfo,
			componentName: 'addChangeBaseInfo'
		},
		{
			name: '制作变更流程',
			path: '/process/processManagement/changeProcess/makeChangeProcess',
			component: makeChangeProcess,
			componentName: 'makeChangeProcess'
		},
		{
			name: '编辑变更流程',
			path: '/process/processManagement/changeProcess/editChangeProcess',
			component: editChangeProcess,
			componentName: 'editChangeProcess'
		},
		
		// 流程管理 -> 发布流程管理
		{
			name: '发布流程管理',
			path: '/process/processManagement/releaseProcess',
			component: releaseProcess,
			componentName: 'releaseProcess'
		},
		{
			name: '新增发布流程',
			path: '/process/processManagement/releaseProcess/addReleaseBaseInfo',
			component: addReleaseBaseInfo,
			componentName: 'addReleaseBaseInfo'
		},
		{
			name: '制作发布流程',
			path: '/process/processManagement/releaseProcess/makeReleaseProcess',
			component: makeReleaseProcess,
			componentName: 'makeReleaseProcess'
		},
		{
			name: '编辑发布流程',
			path: '/process/processManagement/releaseProcess/editReleaseProcess',
			component: editReleaseProcess,
			componentName: 'editReleaseProcess'
		},
		
		// 流程管理 -> 备件流程管理
		{
			name: '备件流程管理',
			path: '/process/processManagement/spareProcess',
			component: spareProcess,
			componentName: 'spareProcess'
		},
		{
			name: '新增备件流程',
			path: '/process/processManagement/spareProcess/addSpareBaseInfo',
			component: addSpareBaseInfo,
			componentName: 'addSpareBaseInfo'
		},
		{
			name: '制作备件流程',
			path: '/process/processManagement/spareProcess/makeSpareProcess',
			component: makeSpareProcess,
			componentName: 'makeSpareProcess'
		},
		{
			name: '编辑备件流程',
			path: '/process/processManagement/spareProcess/editSpareProcess',
			component: editSpareProcess,
			componentName: 'editSpareProcess'
		},
		
		// 绩效管理------------------------------
		// 绩效管理 -> 报表统计
		{
			name: '工单综合报表',
			path: '/performance/report/synthesis',
			component: synthesisReport,
			componentName: 'synthesisReport'
		},
		{
			name: '组织工单报表',
			path: '/performance/report/organization',
			component: organizationReport,
			componentName: 'organizationReport'
		},
		{
			name: '资产工单报表',
			path: '/performance/report/assets',
			component: assetsReport,
			componentName: 'assetsReport'
		},
		
		{
			name: '运维组工单报表',
			path: '/performance/report/maintenanceGroup',
			component: maintenanceGroupReport,
			componentName: 'maintenanceGroupReport'
		},
		{
			name: '响应工单报表',
			path: '/performance/report/response',
			component: responseReport,
			componentName: 'responseReport'
		},
		{
			name: '处理工单报表',
			path: '/performance/report/handle',
			component: handleReport,
			componentName: 'handleReport'
		},
		{
			name: '满意度报表',
			path: '/performance/report/satisfaction',
			component: satisfactionReport,
			componentName: 'satisfactionReport'
		},
		{
			name: '知识报表',
			path: '/performance/report/knowledge',
			component: knowledgeReport,
			componentName: 'knowledgeReport'
		},
		
		// 绩效管理 -> 报表统计
		{
			name: '考核算法管理',
			path: '/performance/performanceManagement/assessment',
			component: assessmentPerformance,
			componentName: 'assessmentPerformance'
		},
		{
			name: '运维组绩效报表',
			path: '/performance/performanceManagement/maintenanceGroup',
			component: maintenanceGroupPerformance,
			componentName: 'maintenanceGroupPerformance'
		},
		{
			name: '人员绩效报表',
			path: '/performance/performanceManagement/personnel',
			component: personnelPerformance,
			componentName: 'personnelPerformance'
		}

	]
}

export default yzz;