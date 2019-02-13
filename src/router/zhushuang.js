import layout from '@/pages/layout.vue'

//用户管理 -> 运维组管理
import maintenanceGroup from '@/pages/system/userManage/maintenanceGroup.vue'
//用户管理 -> 组织管理
import organization from '@/pages/system/userManage/organization.vue'
//用户管理 -> 技能管理
import skill from '@/pages/system/userManage/skill.vue'
//用户管理 -> 角色管理
import role from '@/pages/system/userManage/role.vue'
//用户管理 -> 人员管理
import person from '@/pages/system/userManage/person.vue'


//服务台 ->故障管理
import malfunctionManage from '@/pages/serviceDesk/malfunctionManage/index.vue'
//服务台 ->故障管理 ->创建工单
import createMalfunctionOrder from '@/pages/serviceDesk/malfunctionManage/createOrder.vue'
//服务台 ->故障管理 ->填写表单信息
import fillMalfunctionForm from '@/pages/serviceDesk/malfunctionManage/fillForm.vue'

//服务台 ->创建工单-》创建事件工单
import createEventOrder from '@/pages/serviceDesk/createOrder/event/createEventOrder.vue'
//服务台 ->创建工单-》填写事件工单
import fillEventForm from '@/pages/serviceDesk/createOrder/event/fillEventForm.vue'
//服务台 ->创建工单-》创建问题工单
import createQuestionOrder from '@/pages/serviceDesk/createOrder/question/createQuestionOrder.vue'
//服务台 ->创建工单-》填写问题工单
import fillQuestionForm from '@/pages/serviceDesk/createOrder/question/fillQuestionForm.vue'
//服务台 ->创建工单-》创建变更工单
import createChangeOrder from '@/pages/serviceDesk/createOrder/change/createChangeOrder.vue'
//服务台 ->创建工单-》填写变更工单
import fillChangeForm from '@/pages/serviceDesk/createOrder/change/fillChangeForm.vue'
//服务台 ->创建工单-》创建发布工单
import createPublishOrder from '@/pages/serviceDesk/createOrder/publish/createPublishOrder.vue'
//服务台 ->创建工单-》填写发布工单
import fillPublishForm from '@/pages/serviceDesk/createOrder/publish/fillPublishForm.vue'
//服务台 ->创建工单-》创建备件工单
import createSpareOrder from '@/pages/serviceDesk/createOrder/spare/createSpareOrder.vue'
//服务台 ->创建工单-》填写备件工单
import fillSpareForm from '@/pages/serviceDesk/createOrder/spare/fillSpareForm.vue'

//服务台 ->待回访工单
import returnVisitOrder from '@/pages/serviceDesk/returnVisit/index.vue'
//服务台 ->待回访工单详情
import returnVisitOrderDetail from '@/pages/serviceDesk/returnVisit/orderDetail.vue'

//服务台 ->投诉管理
import complainManage from '@/pages/serviceDesk/complainManage/index.vue'
//服务台 ->投诉管理详情
import editComplain from '@/pages/serviceDesk/complainManage/editComplain.vue'


//知识库 ->待转化知识
import transformKnowledge from '@/pages/knowledgeBase/transformKnowledge/index.vue'
//知识库 ->待转化知识 ->工单转知识
import orderToKnowledge from '@/pages/knowledgeBase/transformKnowledge/orderToKnowledge.vue'

//知识库 ->知识管理
import knowledgeManage from '@/pages/knowledgeBase/knowledgeManage/index.vue'
//知识库 ->新增知识
import knowledgeAdd from '@/pages/knowledgeBase/knowledgeManage/knowledgeAdd.vue'
//知识库 ->编辑知识
import knowledgeEdit from '@/pages/knowledgeBase/knowledgeManage/knowledgeEdit.vue'


//知识库 ->知识审核
import knowledgeAudit from '@/pages/knowledgeBase/knowledgeAudit/index.vue'
//知识库 ->知识审核详情
import knowledgeAuditDetail from '@/pages/knowledgeBase/knowledgeAudit/knowledgeAuditDetail.vue'


//知识库 ->知识检索
import knowledgeSearch from '@/pages/knowledgeBase/knowledgeSearch/index.vue'
//知识库 ->知识详情
import knowledgeDetail from '@/pages/knowledgeBase/knowledgeSearch/knowledgeDetail.vue'


//开发人员选项 ->知识分类管理
import knowledgeClassificationManage from '@/pages/system/developerOptions/knowledgeClassificationManage.vue'


//demo
//import demoVue from '@/pages/zhushuang/demo.vue'
////table
//import demoTable1 from '@/pages/zhushuang/table1.vue'
//import demoTable2 from '@/pages/zhushuang/table2.vue'
////sort
//import sort from '@/pages/zhushuang/sort.vue'


const zhushuang = {
	path: '/',
	component: layout,
	children: [

/*********************************用户管理******************************************/
//		用户管理 -> 运维组管理
		{
			name:'运维组管理',
		    path: '/system/userManage/maintenanceGroup',
		    component: maintenanceGroup,
		    componentName: 'maintenanceGroup'
		},
		//用户管理 -> 组织管理
		{
			name:'组织管理',
		    path: '/system/userManage/organization',
		    component: organization,
		    componentName: 'organization'
		},
		//用户管理 -> 技能管理
		{
			name:'技能管理',
		    path: '/system/userManage/skill',
		    component: skill,
		    componentName: 'skill'
		},
		//用户管理 -> 角色管理
		{
			name:'角色管理',
		    path: '/system/userManage/role',
		    component: role,
		    componentName: 'role'
		},
		//用户管理 -> 人员管理
		{
			name:'人员管理',
		    path: '/system/userManage/person',
		    component: person,
		    componentName: 'person'
		},
/*********************************服务台******************************************/
		//服务台 ->故障管理
		{
			name:'故障管理',
		    path: '/serviceDesk/malfunctionManage',
		    component: malfunctionManage,
		    componentName: 'malfunctionManage'
		},
		//服务台 ->故障管理 ->创建工单
		{
			name:'创建工单',
		    path: '/serviceDesk/malfunctionManage/createOrder',
		    component: createMalfunctionOrder,
		    componentName: 'createMalfunctionOrder'
		},
		//服务台 ->故障管理 ->填写表单信息
		{
			name:'填写表单信息',
		    path: '/serviceDesk/malfunctionManage/fillForm',
		    component: fillMalfunctionForm,
		    componentName: 'fillMalfunctionForm'
		},
/*********************************************************************/
		//服务台 ->创建工单 ->创建事件工单
		{
			name:'创建事件工单',
		    path: '/serviceDesk/createOrder/event/createEventOrder',
		    component: createEventOrder,
		    componentName: 'createEventOrder'
		},
		//服务台 ->创建工单 ->填写事件表单信息
		{
			name:'填写事件表单',
		    path: '/serviceDesk/createOrder/event/fillEventForm',
		    component: fillEventForm,
		    componentName: 'fillEventForm'
		},
/***************************************/
		//服务台 ->创建工单 ->创建问题工单
		{
			name:'创建问题工单',
		    path: '/serviceDesk/createOrder/question/createQuestionOrder',
		    component: createQuestionOrder,
		    componentName: 'createQuestionOrder'
		},
		//服务台 ->创建工单 ->填写问题表单信息
		{
			name:'填写问题表单',
		    path: '/serviceDesk/createOrder/question/fillQuestionForm',
		    component: fillQuestionForm,
		    componentName: 'fillQuestionForm'
		},
/***************************************/
		//服务台 ->创建工单 ->创建变更工单
		{
			name:'创建变更工单',
		    path: '/serviceDesk/createOrder/change/createChangeOrder',
		    component: createChangeOrder,
		    componentName: 'createChangeOrder'
		},
		//服务台 ->创建工单 ->填写变更表单信息
		{
			name:'填写变更表单',
		    path: '/serviceDesk/createOrder/change/fillChangeForm',
		    component: fillChangeForm,
		    componentName: 'fillChangeForm'
		},
/***************************************/
		//服务台 ->创建工单 ->创建发布工单
		{
			name:'创建发布工单',
		    path: '/serviceDesk/createOrder/publish/createPublishOrder',
		    component: createPublishOrder,
		    componentName: 'createPublishOrder'
		},
		//服务台 ->创建工单 ->填写发布表单信息
		{
			name:'填写发布表单',
		    path: '/serviceDesk/createOrder/publish/fillPublishForm',
		    component: fillPublishForm,
		    componentName: 'fillPublishForm'
		},
/***************************************/
		//服务台 ->创建工单 ->创建备件工单
		{
			name:'创建备件工单',
		    path: '/serviceDesk/createOrder/spare/createSpareOrder',
		    component: createSpareOrder,
		    componentName: 'createSpareOrder'
		},
		//服务台 ->创建工单 ->填写备件表单信息
		{
			name:'填写备件表单',
		    path: '/serviceDesk/createOrder/spare/fillSpareForm',
		    component: fillSpareForm,
		    componentName: 'fillSpareForm'
		},
/***************************************************************************/	
		//服务台 ->待回访工单
		{
			name:'待回访工单',
		    path: '/serviceDesk/returnVisit/index',
		    component: returnVisitOrder,
		    componentName: 'returnVisitOrder'
		},
		//服务台 ->创建工单 ->填写备件表单信息
		{
			name:'待回访工单详情',
		    path: '/serviceDesk/returnVisit/orderDetail',
		    component: returnVisitOrderDetail,
		    componentName: 'returnVisitOrderDetail'
		},
/***************************************************************************/	
		//服务台 ->投诉管理
		{
			name:'投诉管理',
		    path: '/serviceDesk/complainManage/index',
		    component: complainManage,
		    componentName: 'complainManage'
		},
		//服务台 ->编辑投诉
		{
			name:'投诉详情',
		    path: '/serviceDesk/complainManage/editComplain',
		    component: editComplain,
		    componentName: 'editComplain'
		},
/********************************知识库*******************************************/
		{
			name:'待转化知识',
			path:'/transformKnowledge',
			component:transformKnowledge,
			componentName: 'transformKnowledge'   
		},
		{
			name:'工单转知识',
			path:'/orderToKnowledge',
			component:orderToKnowledge,
			componentName: 'orderToKnowledge'
		},
		{
			name:'知识管理',
			path:'/knowledgeManage',
			component:knowledgeManage,
			componentName: 'knowledgeManage'
		},
		{
			name:'新增知识',
			path:'/knowledgeManage/knowledgeAdd',
			component:knowledgeAdd,
			componentName: 'knowledgeAdd'
		},
		{
			name:'编辑知识',
			path:'/knowledgeManage/knowledgeEdit',
			component:knowledgeEdit,
			componentName: 'knowledgeEdit'
		},
		{
			name:'知识审核',
			path:'/knowledgeAudit',
			component:knowledgeAudit,
			componentName: 'knowledgeAudit'
		},
		{
			name:'知识审核详情',
			path:'/knowledgeAudit/knowledgeAuditDetail',
			component:knowledgeAuditDetail,
			componentName: 'knowledgeAuditDetail'
		},
		{
			name:'知识检索',
			path:'/knowledgeSearch',
			component:knowledgeSearch,
			componentName: 'knowledgeSearch' 
		},
		{
			name:'知识详情',
			path:'/knowledgeSearch/knowledgeDetail',
			component:knowledgeDetail,
			componentName: 'knowledgeDetail' 
		},
		{
			name:'知识分类管理',
			path:'/developer/knowledgeClassificationManage',
			component:knowledgeClassificationManage,
			componentName: 'knowledgeClassificationManage' 
		},
/********************************自己写的demo*******************************************/			
//		{
//			name:'demo',
//			path:'/zhushuang/demo',
//			component:demoVue,
//			componentName: 'demoVue'
//		},
//		{
//			name:'table1',
//			path:'/zhushuang/table1',
//			component:demoTable1,
//			componentName: 'demoTable1'
//		},
//		{
//			name:'table2',
//			path:'/zhushuang/table2',
//			component:demoTable2,
//			componentName: 'demoTable2'
//		},
//		{
//			name:'sort',
//			path:'/zhushuang/sort',
//			component:sort,
//			componentName: 'sort'
//		},
	]
}

export default zhushuang;
