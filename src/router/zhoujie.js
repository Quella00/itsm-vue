import layout from '@/pages/layout.vue'

// 系统管理-----------------
// 通讯配置 -> 短信发送配置
import smsSendingConfig from '@/pages/system/communicateConfig/smsSendingConfig.vue'
// 通讯配置 -> 邮件发送配置
import emailSendingConfig from '@/pages/system/communicateConfig/emailSendingConfig.vue'
// 通讯配置 -> 账号系统同步配置
import accountSystemConfig from '@/pages/system/communicateConfig/accountSystemConfig.vue'
// 通讯配置 -> 资产监控配置
import assetMonitorConfig from '@/pages/system/communicateConfig/assetMonitorConfig.vue'

// 系统日志管理 -> 审计日志
import auditLog from '@/pages/system/systemLogManage/auditLog.vue'
// 系统日志管理 -> 系统日志
import systemLog from '@/pages/system/systemLogManage/systemLog.vue'

// 外部用户
import externalUser from '@/pages/system/clientManage/externalUser.vue'

// 公告管理
import noticeSave from '@/pages/system/daily/noticeSave.vue'
import noticeEdit from '@/pages/system/daily/noticeEdit.vue'

// 资产管理-----------------
// 资产管理 -> 资产关系
import assetRelation from '@/pages/assets/assetRelation.vue'
// 资产管理 -> 资产管理
import assetManagement from '@/pages/assets/assetManagement.vue'
// 资产管理 -> 资产审核
import assetAudit from '@/pages/assets/assetAudit.vue'
// 资产管理 -> 资产应用
import assetUtilization from '@/pages/assets/assetUtilization.vue'

// 资产管理 -> 新增资产
import assetAdd from '@/pages/assets/editAsset/assetAdd.vue'
// 资产管理 -> 编辑资产
import assetEdit from '@/pages/assets/editAsset/assetEdit.vue'

// 资产审核 -> 查看资产
import viewAudit from '@/pages/assets/viewAsset/viewAudit.vue'
// 资产应用 -> 查看资产
import viewApply from '@/pages/assets/viewAsset/viewApply.vue'
// 版本信息 -> 查看资产
import viewVersion from '@/pages/assets/viewAsset/viewVersion.vue'

const zhoujie = {
	path: '/',
	component: layout,
 	children: [
	
 		// 系统管理-----------------
 		// 通讯配置
		{
			name: '短信发送配置',
			path: '/system/communicateConfig/smsSendingConfig',
			component: smsSendingConfig,
			componentName: 'smsSendingConfig'
		},
		{
			name: '邮件发送配置',
			path: '/system/communicateConfig/emailSendingConfig',
			component: emailSendingConfig,
			componentName: 'emailSendingConfig'
		},
		{
  			name: '账户系统同步配置',
  			path: '/system/communicateConfig/accountSystemConfig',
  			component: accountSystemConfig,
  			componentName: 'accountSystemConfig'
  		},
  		{
  			name: '资产监控配置',
  			path: '/system/communicateConfig/assetMonitorConfig',
  			component: assetMonitorConfig,
  			componentName: 'assetMonitorConfig'
  		},
  		// 系统日志管理
  		{
  			name: '审计日志',
  			path: '/system/systemLogManage/auditLog',
  			component: auditLog,
  			componentName: 'auditLog'
  		},
  		{
  			name: '系统日志',
  			path: '/system/systemLogManage/systemLog',
  			component: systemLog,
  			componentName: 'systemLog'
  		},
  		// 外部用户
  		{
  			name: '外部用户',
  			path: '/system/externalUser',
  			component: externalUser,
  			componentName: 'externalUser'
  		},
   		// 公告
     	{
		 	name: '新增公告',
		 	path: '/system/noticeAdd',
		 	component: noticeSave,
		 	componentName: 'noticeSave'
		},
		{
		 	name: '编辑公告',
		 	path: '/system/noticeEdited',
		 	component: noticeEdit,
		 	componentName: 'noticeEdit'
		},
   		
     	// 资产管理-----------------
     	{
     		name: '资产关系',
		 	path: '/assetRelation',
		 	component: assetRelation,
		 	componentName: 'assetRelation'
		},
     	{
 		 	name: '资产管理',
 		 	path: '/assetManagement',
 		 	component: assetManagement,
 		 	componentName: 'assetManagement'
     	},
     	{
     		name: '资产审核',
		 	path: '/assetAudit',
		 	component: assetAudit,
		 	componentName: 'assetAudit'
		},
		{
		 	name: '资产应用',
		 	path: '/assetUtilization',
		 	component: assetUtilization,
		 	componentName: 'assetUtilization'
		},
		
		// ------------------------------------
     	{
 		 	name: '编辑资产',
 		 	path: '/editAsset',
 		 	component: assetEdit,
 		 	componentName: 'assetEdit'
     	},
     	{
 		 	name: '新增资产',
 		 	path: '/addAsset',
 		 	component: assetAdd,
 		 	componentName: 'assetAdd'
     	},
   		
     	// ------------------------------------
     	// 资产审核——查看资产
 		{
 		 	name: '资产审核信息',
 		 	path: '/assetAudit/viewAsset',
 		 	component: viewAudit,
 		 	componentName: 'viewAudit'
 		},
     	// 资产应用——查看资产
     	{
 		 	name: '查看资产',
 		 	path: '/assetUtilization/viewAsset',
 		 	component: viewApply,
 		 	componentName: 'viewApply'
     	},
     	// 版本信息
     	{
 		 	name: '查看版本',
 		 	path: '/versionInfo',
 		 	component: viewVersion,
 		 	componentName: 'viewVersion'
     	},
	 ]
}

export default zhoujie;