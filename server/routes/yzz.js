var express = require('express');
var router = express.Router();
var Mock = require('mockjs')

router.get('/yzz/showData/', function(req, res, next) {
	let ret = {
		status: 200,
		message: '请求成功22',
		data: Mock.mock({
			id: Mock.Random.guid(),
			name: Mock.Random.cname(),
		})
	}
	res.send(ret);
});

router.get('/yzz/removeData/', function(req, res, next) {
	let ret, params = req.query;
	if(params.name == 'admin') {
		ret = {
			status: 200,
			message: '删除失败',
			data: Mock.mock({
				name: params.name
			})
		}
	} else {
		ret = {
			status: 200,
			message: '删除成功',
			data: Mock.mock({
				id: Mock.Random.guid(),
				name: params.name
			})
		}
	}
	res.send(ret);
});

router.post('/yzz/addData/', function(req, res, next) {
	let ret, params = req.body;
	if(params.name == 'admin') {
		ret = {
			status: 200,
			message: '添加失败',
			data: Mock.mock({
				name: params.name
			})
		}
	} else {
		ret = {
			status: 200,
			message: '添加成功',
			data: Mock.mock({
				id: Mock.Random.guid(),
				name: params.name
			})
		}
	}
	res.send(ret);
});

router.post('/yzz/addData2/', function(req, res, next) {
	let ret, params = req.body;
	if(params.name == 'admin') {
		ret = {
			status: 200,
			message: '添加失败',
			data: Mock.mock({
				name: params.name
			})
		}
	} else {
		ret = {
			status: 200,
			message: '添加成功',
			data: Mock.mock({
				id: Mock.Random.guid(),
				name: params.name
			})
		}
	}
	res.send(ret);
});


// 工单综合报表列表数据
router.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryWorkOrdeReportForm', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '提交成功',
		data: Mock.mock({
			total: 20,
			'list|10': [
				{
					'id': /\d{5}/,
					'workOrderCode': /\d{10}/,
					'workOrderType|1': ['事件','问题'],
					'priority|1': ['一级','二级','三级'],
					'createUserName': '@cname',
					//createUserId:"创建人Id",
					'createTime':'@DATE',
					'workOrderCloseTime': '@DATE',
					'associatedAssetName': '@cword(3, 5)',
					//assetId:"资产Id",
					'itsmName': '@cname',
					//"number|1-100": 100
					'responseTime': /\d{2,3}s/,
					'resolutionTime': /\d{2,3}s/,
					'evaluation|1': ['非常满意','满意','一般','不满意', '非常不满意'],
					//workOrderTheme:"工单主题",
					//workOrderId:"工单Id",
					
//					id:"主键",
//					workOrderCode:"工单编号",
//					workOrderType:"工单类型",
//					priority:"优先级",
//					createUserName:"创建人",
//					createUserId:"创建人Id",
//					createTime:"创建时间",
//					workOrderCloseTime:"工单关闭时间",
//					associatedAssetName:"关联资产名",
//					assetId:"资产Id",
//					itsmName:"运维工程师",
//					responseTime:"响应时间",
//					resolutionTime:"解决时间",
//					evaluation:"评价结果",
//					workOrderTheme:"工单主题",
//					workOrderId:"工单Id",
//					//createUserOrganizationId:"发起人组织id",
//					//createUserOrganizationName:"发起组织名",
//					//createUserOperationId:"发起人所在运维组id",
//					//createUserOperationName:"发起运维组名",
//					//classificationId:"资产分类Id",
//					//recoveryTime:"恢复时间",
//					//overTimeStatus:"超时状态",
//					//workOrderStatus:"工单状态"
				}
			]
		})
	};
	res.send(ret);
});


// 组织工单报表图表数据
router.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryOrganizatio', function(req, res, next) {
	let ret, params = req.body;
	ret = Mock.mock({
		status: 200,
		message: '查询成功',
		data: {
			xAxisData: ['03月01日','03月02日','03月03日','03月04日','03月05日','03月06日','03月07日'],
			'yAxisData|15': [
				{
					name: '@cword(3, 8)',
					data: [120, 132, 101, 134, 90, 230, 210]
				}
			]
		}

	});
	res.send(ret);
});


// 知识报表列表数据
router.post('/yzz/itsm/performance/manager/workOrdeReportForm/queryKnowledge', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({
			total: 20,
			'list|10': [
				{
					'userName': '@cname',
					'createrCount|10-50': 100,
					'scoreOrder1|10-50': 100,
					'scoreOrder2|10-50': 100,
					'scoreOrder3|10-50': 100,
					'scoreOrder4|10-50': 100,
					'scoreOrder5|10-50': 100
				}
			]
		})
	};
	res.send(ret);
});

// 考核算法管理查询（运维组和角色）
router.post('/yzz/itsm/performance/manager/queryKpiList', function(req, res, next) {
	let ret, params = req.body;
	
	if(params.kpiType == 1){
		ret = {
			status: 200,
			message: '查询成功',
			data: Mock.mock({
				total: 20,
				'list|10': [
					{
						'kpiType': 1,  //1代表运维组 2代表角色
						'id': /\d{5}/,
						'operationCode': /\d{5}/,
						'organizationName': '@cword(3, 5)',
						'roleid': /\d{5}/,
						'operationId': /\d{5}/,
						'evaluation': '0.6*解决工单数X0.5*满意度X1.1*事件reopen率',
					}
				]
			})
		};
	}else{
		ret = {
			status: 200,
			message: '查询成功',
			data: Mock.mock({
				total: 5,
				'list|5': [
					{
						'kpiType': 1,  //1代表运维组 2代表角色
						'id': /\d{5}/,
						'operationCode': /\d{5}/,
						'organizationName': '@cword(3, 5)',
						'roleid': /\d{5}/,
						'operationId': /\d{5}/,
						'evaluation': '0.6*解决工单数X0.5*满意度X1.1*事件reopen率',
					}
				]
			})
		};
	}
	res.send(ret);
});

// 获取新增考核算法模板数据
router.post('/yzz/itsm/performance/manager/factor/templates', function(req, res, next) {
	let ret, params = req.body;
	
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({

			templatesId: "模板id",
			kipType: "计算类型（1代表运维组 2代表角色）",
			roleId: "角色ID",
			operationId: "运维组Id",
			
			id: "主键id",
			kpiTemplatesName: "模板名", 
			
			'list': [
				{
					id:"组Id",
					groupName:"工作量", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder: 1, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"处理工单数", 
							factorType:2, 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"运维及时率", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:2, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"响应及时率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"处理及时率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"质量合格率", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:3, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"满意度", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"零投诉率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"事件reopen率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"回访率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"运维先进性", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:4, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"知识评分", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"知识创新性", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: '',  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				}
			]

		})
	};
	res.send(ret);
});

// 新增考核算法数据保存
router.post('/yzz/itsm/performance/manager/save', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '添加成功',
		data: ''
	};
	res.send(ret);
});


// 获取考核算法详细信息
router.post('/yzz/itsm/performance/manager/detail', function(req, res, next) {
	let ret, params = req.body;
	
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({

			templatesId: "模板id",
			kipType: "计算类型（1代表运维组 2代表角色）",
			roleId: "角色ID",
			operationId: "运维组Id",
			
			id: "主键id",
			kpiTemplatesName: "模板名", 
			
			'list': [
				{
					id:"组Id",
					groupName:"工作量", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder: 1, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"处理工单数", 
							factorType:2, 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"运维及时率", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:2, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"响应及时率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"处理及时率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"质量合格率", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:3, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"满意度", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"零投诉率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:1,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"事件reopen率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:1,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"回访率", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				},
				{
					id:"组Id",
					groupName:"运维先进性", 
					factorCalculationFormulasType:"计算公式类型(1是* 2是% 3是+ 4是-)", 
					pageOrder:4, 
					
					kpi:[
						{ 
							id:"因子ID",
							factorName:"知识评分", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						},
						{ 
							id:"因子ID",
							factorName:"知识创新性", 
							factorType:"1", 
							scope:"因子权值", 
							instanceScope: 20,  // 用户输入因子值
							factorService:"因子计算service类名",
							factorComment:"因子描述", 
							pageOrder:"因子页面排序",
							selectStatus:0,  // 0没有选中1选中
						}
					]
				}
			]

		})
	};

	res.send(ret);
});


// 修改考核算法详细信息
router.post('/yzz/itsm/performance/manager/update', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '修改成功',
		data: ''
	};
	res.send(ret);
});

// 删除考核算法列表数据
router.post('/yzz/itsm/performance/manager/del', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '修改成功',
		data: ''
	};
	res.send(ret);
});

// 获取运维组绩效报表数据
router.post('/yzz/itsm/performance/manager/operationReportForm/queryOperationReportFormList', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({
			
			startTime: "2018-01-20",
			endTime: "2018-04-20",
			total: 20,
			'list|10': [
				{
					'operation': '@cword(3, 5)',
					userInfo: [
						{ userName:'yixian', performance:7500 },
						{ userName:'wenti', performance:8600 }
					],
					'operationPerformance': /\d{3}/
				}
			]
		})
	};
	res.send(ret);
});

// 获取人员绩效报表数据
router.post('/yzz/itsm/performance/manager/userReportForm/queryUserReportList', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({
			
			startTime: "2018-01-20",
			endTime: "2018-04-20",
			total: 20,
			'list|10': [
				{
					'userName': '@cname()',
					'role': [
						{ roleName:'yixian', performance:7500 },
						{ roleName:'wenti', performance:8600 }
					],
					'organizationName': '@cword(3, 5)',
					'operationName': '@cword(3, 5)'
				}
			]
			
		})
	};
	res.send(ret);
});

module.exports = router;



// 获取人员绩效报表数据
router.post('/yzz/itsm/upload', function(req, res, next) {
	let ret, params = req.body;
//	ret = {
//		status: 200,
//		message: '查询成功',
//		data: Mock.mock({
//			
//			startTime: "2018-01-20",
//			endTime: "2018-04-20",
//			total: 20,
//			'list|10': [
//				{
//					'userName': '@cname()',
//					'role': [
//						{ roleName:'yixian', performance:7500 },
//						{ roleName:'wenti', performance:8600 }
//					],
//					'organizationName': '@cword(3, 5)',
//					'operationName': '@cword(3, 5)'
//				}
//			]
//			
//		})
//	};
	
	
	
ret = {
    "errno": 0,
    "data": [
        "https://oimageb2.ydstatic.com/image?id=8068410616472665149&product=adpublish&w=640&h=480&sc=0&rm=2&gsb=0&gsbd=60"
    ]
}
	
	
	
	res.send(ret);
});

module.exports = router;
