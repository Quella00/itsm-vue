var express = require('express');
var router = express.Router();
var Mock = require('mockjs')

router.post('/xohu/login/', function(req, res, next) {
    const { loginName, password } = req.body;

    let ret;

    if(loginName != 'admin' || password != '123456'){
        ret = new enums({
            status: 1001,
            message: '用户名或密码错误'
        });
    }
 
	res.send(ret);
});

var enums = function(options) {
    if (typeof options !== "object") {
        options = {};
    }
    options = Object.assign({
        status: 200,
        message: '请求成功',
        data: []
    }, options);

    return options;
};

module.exports = router;