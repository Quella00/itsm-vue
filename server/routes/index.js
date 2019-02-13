var express = require('express');
var router = express.Router();

//var Mock = require('mockjs')

/* GET home page. */
//router.get('/', function(req, res, next) {
//res.render('index', { title: 'Express wrwer' });
//});

var yzz = require('./yzz.js');
var zhusiyuan = require('./zhusiyuan.js');
var xohu = require('./xohu.js');
var zhushuang = require('./zhushuang.js');
var zhoujie = require('./zhoujie.js');

router.use(yzz); 
router.use(zhusiyuan); 
router.use(xohu); 
router.use(zhushuang); 
router.use(zhoujie); 

module.exports = router;



