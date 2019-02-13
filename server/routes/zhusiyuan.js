var express = require('express');
var router = express.Router();
var Mock = require('mockjs')

router.post('/zsy/workOrder/orderQuery', function(req, res, next) {
	let ret = {
        status: 200,
        flag:true,
		message: '请求成功',
		data: {
			list: Mock.mock({
                "list|10": [
                    {
                        "number": 'SJXX20170909202015',
                        "theme": '打印机故障',
                        "type": '事件',
                        "createrId": 0,
                        "createrName": "超级管理员",
                        "priorityLevel": 0,
                        "status": "处理中",
                        "slAstatus": "超时未响应",  
                        "createTime": '1017-12-27 09:22',                      
                    }
                ]
            }).list,
			total: 100,
		}
	}
	res.send(ret);
});


module.exports = router;