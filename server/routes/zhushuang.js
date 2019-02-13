var express = require('express');
var router = express.Router();
var Mock = require('mockjs')
/**************************待转化知识***************************/
// 带转化知识 列表
router.post('/zs/itsm/knowledgeBase/transform/query', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '添加成功',
		data: Mock.mock({
			'list|1-10': [{
				'id|+1':0, //属性值自动加 1，初始值为 0
				'assetCode|+1':121110, //属性值自动加 1，初始值为 0
				'orderCode|+1':100121444000, //属性值自动加 1，初始值为 0
		        closeTime:()=>Mock.Random.datetime(),
		        orderTopic:()=>Mock.Random.csentence(),
		        'type|1': ['事件','问题','变更','发布','备件'], // 从属性值 [{}, {} ...] 中随机选取 1 个元素，作为最终值。
		        'sla|1-100':100, //生成一个大于等于 1、小于等于 100 的整数，属性值 100 只用来确定类型。
		    }],
			total:200,
			pageNum:1
		})
	}
	res.send(ret);
});

// 创建工单转知识
router.post('/zs/itsm/knowledgeBase/transform/save', function(req, res, next) {
	let ret, params = req.body;
	if(params.wordOrderId && params.assetCode){
		ret = {
			status: 200,
			message: '创建成功',
			data: Mock.mock({
				
			})
		}
	}
	res.send(ret);
});

// 提交工单转知识
router.post('/zs/itsm/knowledgeBase/transform/submit', function(req, res, next) {
	let ret, params = req.body;
	if(params.wordOrderId && params.assetCode){
		ret = {
			status: 200,
			message: '创建成功',
			data: Mock.mock({
				
			})
		}
	}
	res.send(ret);
});
/**************************知识管理***************************/
// 知识管理 列表
router.post('/zs/itsm/knowledgeBase/knowledgeManager/queryAll', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '添加成功',
		data: Mock.mock({
			'list|1-10': [{
				'id|+1':0, //属性值自动加 1，初始值为 0
		        createTime:()=>Mock.Random.datetime(),
		        title:()=>Mock.Random.ctitle(),
		        keyword:()=>Mock.Random.cword(1,7),
		        authorName: ()=>Mock.Random.cname(),
		        'knowledgeSource|1': ['手动输入','导入','工单转知识'],
		        'operation|1': ['审核通过','审核未通过','未提交审核'], 
		    }],
			total:200,
			pageNum:1
		})
	}
	res.send(ret);
});

// 创建知识
router.post('/zs/itsm/knowledgeBase/knowledgeManager/save', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '保存成功',
		data: Mock.mock({
			
		})
	}
	res.send(ret);
});

// 提交知识
router.post('/zs/itsm/knowledgeBase/knowledgeManager/submitAudit', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '已提交审核',
		data: Mock.mock({
			
		})
	}
	res.send(ret);
});

// 查看知识
router.post('/zs/itsm/knowledgeBase/knowledgeManager/queryById', function(req, res, next) {
	let ret, params = req.body;
	if(params.id){
		ret = { 
				message:"查询成功。",
				status:200,
				data:{
						id:"12",
					    title:"这是个标题",
					    abstract:"这是个摘要",
					    keyword:"这是个关键字",
					    authorId:"W9GY58U43r339WER5i57,85G1jtlH2N4UAlqVSDx9,6y3KgSUM3F7R9wtvsQx5,xyr5P07231l1GN891897,81I3P7QzhKp7Bdb9qU6J,101P31t1U2piL0055GT9,11431Zb03S913Fz38K82,yS5q8Qyc27",
					    authorName:'654654,adminm,hhhhhhhhhhhhh,sxgcs,fgld,bmld,ywzg,xcgcs',
					    classificationId:"420",
					    knowledgeClassification:'业务1',
					    knowledgeDetails:"详情" ,
					    emergencyPlan:"应急方案",
					    solution:"解决方案",
					    assetId:"da302cf9d1144d9ea9c650271283e36c",
					    assetName:'10222',
					    originalFilename:"源文件名",
					    fileId:"源文件id",
					    ucAttachment:[
					    	{fileId:"0eec67408e7e4e9f9d00e2a4bddc097e",fileName:"人员管理基本信息 (11).xls"},
					    	{fileId:"cb94e528a3cc424295407de6e573d666",fileName:"区域管理.jpg"},
					    ]
					}
				}
	}
	res.send(ret);
});

// 编辑知识
router.post('/zs/itsm/knowledgeBase/knowledgeManager/update', function(req, res, next) {
	let ret, params = req.body;
		ret = {
			status: 200,
			message: '修改已保存',
			data: Mock.mock({
				
			})
		}
		res.send(ret);
});

// 提交编辑知识
router.post('/zs/itsm/knowledgeBase/knowledgeManager/updateAudit', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '修改已提交审核',
		data: Mock.mock({
			
		})
	}
	res.send(ret);
});


/**************************知识审核***************************/
// 列表查询
router.post('/zs/itsm/knowledgeBase/audit/queryAll', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({
			'list|1-10': [{
				'id|+1':0, //属性值自动加 1，初始值为 0
		        apply_time:()=>Mock.Random.datetime(),
		        title:()=>Mock.Random.ctitle(),
		        keyword:()=>Mock.Random.cword(1,7),
		        apply_user: ()=>Mock.Random.cname(),
		        'operation|1': ['新增','编辑','删除'], 
		    }],
			total:200,
			pageNum:1
		})
	}
	res.send(ret);
});

// 批量审核
router.post('/zs/itsm/knowledgeBase/audit/batchAudit', function(req, res, next) {
	let ret, params = req.body;
	if(params.knowledgeId && params.status){
		ret = {
			status: 200,
			message: '审核通过',
			data: Mock.mock({
				
			})
		}
	}
	
	res.send(ret);
});

// 获取待审核知识详情
router.post('/zs/itsm/knowledgeBase/audit/queryById', function(req, res, next) {
	let ret, params = req.body;
	if(params.id){
		ret = {
			status:200,
			message:"查询成功",
			data:{
				id:"1",
				assetCode:"资产编码资产编码资产编码资产编码",
				remark:"摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要",
				title:"主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题",
				authorId:"W9GY58U43r339WER5i57,n69156Z07T170B0161m1,85G1jtlH2N4UAlqVSDx9,81o7597F3D13Y5UA7z16,6y3KgSUM3F7R9wtvsQx5,xyr5P07231l1GN891897,81I3P7QzhKp7Bdb9qU6J,101P31t1U2piL0055GT9,11431Zb03S913Fz38K82,yS5q8Qyc279A1569FNZ0",
				classificationId:"知识分类id",
				categoryName:"资产分类名称",
				manufacturer:"厂商",
				solution:"解决方案",
				emergencyPlan:"应急方案",
				authorName:"作者名称",
				assetsName:"资产名称",
				model:"资产",
				knowledgeDetails:"知识详fdf的年货呢经济结构更改和就返回百分点巴巴爸爸办公积金给你你都大V不不不不不不不过各过各的  分分       分分分好好好好情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情",
				keyword:"关键字,关键字,关键字,关键字",
				classificationName:'知识分类名称知识分类名称'
			}
		}
	}
	res.send(ret);
});

// 单条知识审核
router.post('/zs/itsm/knowledgeBase/audit/auditById', function(req, res, next) {
	let ret, params = req.body;
	if(params.id){
		ret = {
			status: 200,
			message: '审核通过',
			data: Mock.mock({
				
			})
		}
	}
	res.send(ret);
});
/**************************知识检索***************************/
// 列表查询
router.post('/zs/itsm/knowledgeBase/search/querySortAll', function(req, res, next) {
	let ret, params = req.body;
	ret = {
		status: 200,
		message: '查询成功',
		data: Mock.mock({
			'list|1-10': [{
				'id|+1':0, //属性值自动加 1，初始值为 0
		        createTime:()=>Mock.Random.datetime(),
		        title:()=>Mock.Random.ctitle(),
		        keyword:()=>Mock.Random.cword(1,7),
		        authorName: ()=>Mock.Random.cname(),
		        'knowledgeSource|1': ['手动输入','导入','工单转知识'],
		        'score|0-5': 1,
		        'views|10-100': 1,
		    }],
			total:200,
			pageNum:1
		})
	}
	res.send(ret);
});

// 查询知识详情
router.post('/zs/itsm/knowledgeBase/search/queryById', function(req, res, next) {
	let ret, params = req.body;
	if(params.id){
		ret = {
			status:200,
			message:"查询成功",
			data:{
				id:"1",
				assetCode:"资产编码资产编码资产编码资产编码",
				remark:"摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要摘要",
				title:"主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题主题",
				score:2,
				authorId:"W9GY58U43r339WER5i57,n69156Z07T170B0161m1,85G1jtlH2N4UAlqVSDx9,81o7597F3D13Y5UA7z16,6y3KgSUM3F7R9wtvsQx5,xyr5P07231l1GN891897,81I3P7QzhKp7Bdb9qU6J,101P31t1U2piL0055GT9,11431Zb03S913Fz38K82,yS5q8Qyc279A1569FNZ0",
				classificationId:"知识分类id",
				categoryName:"资产分类名称",
				manufacturer:"厂商",
				solution:"解决方案",
				emergencyPlan:"应急方案",
				authorName:"作者名称",
				assetsName:"资产名称",
				model:"资产型号",
				knowledgeDetails:"知识详fdf的年货呢经济结构更改和就返回百分点巴巴爸爸办公积金给你你都大V不不不不不不不过各过各的  分分       分分分好好好好情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情知识详情",
				keyword:"关键字,关键字,关键字,关键字",
				classificationName:'知识分类名称知识分类名称',
				fileList:[
					{id:"0eec67408e7e4e9f9d00e2a4bddc097e",fileName:"人员管理基本信息 (11).xls"},
					{id:"cb94e528a3cc424295407de6e573d666",fileName:"区域管理.jpg"},
				]
			}
		}
	}
	res.send(ret);
});
// 提交知识评分
router.post('/zs/itsm/knowledgeBase/search/knowledgeMark', function(req, res, next) {
	let ret, params = req.body;
	if(params.id && params.score){
		ret = {
			status: 200,
			message: '提交成功',
			data: Mock.mock({
				
			})
		}
	}
	res.send(ret);
});

module.exports = router;