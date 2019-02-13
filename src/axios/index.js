import promise from 'es6-promise'
promise.polyfill();

import axios from 'axios'
import qs from 'qs'

const baseURL = 'http://192.168.2.22';
//const baseURL = 'http://192.168.2.226:8762';
//const baseURL = 'http://192.168.2.110:8008';
const mockBaseURL = 'http://localhost:3000';
const socketURL = 'ws://127.0.0.1:9909';

//const baseURL = 'http://192.168.6.204:8762';
//const mockBaseURL = 'http://localhost:3000';
//const socketURL = 'ws://192.168.6.204:9909';


function checkUrl(url) {
	if( !(/^http:/.test(url)) ) {
		if( /^((\/yzz\/)|(\/zsy\/)|(\/xohu\/)|(\/zs\/)|(\/zj\/))/.test(url) ) {
			//url = mockBaseURL + url;
		} else {

			// 徐东个人电脑(临时)
//			if( url.indexOf('/itsm/performance/') != -1 ){
//				url = 'http://192.168.3.22:9900' + url;
//				return url;
//			}

			// 徐东个人电脑(临时)
			if( url.indexOf('/xd/') != -1 ){
				url = url.replace('/xd/', 'http://192.168.3.22:9900/');
				//url = url.replace('/xd/', 'http://192.168.3.22:8762/');
				return url;
			};

			if( url.indexOf('/xd2/') != -1 ){
				url = url.replace('/xd2/', 'http://192.168.3.22:9900/');
				//url = url.replace('/xd/', 'http://192.168.3.22:8762/');
				return url;
			};



			if( url.indexOf('/uploadApi') <= -1 && url.indexOf('/licenseApi') <= -1 && url.indexOf('/api/') <= -1){
				url = '/api' + url;
			}
		}
	}
	return url;
}
function checkStatus(res) {
	if(res && res.status === 200) {
		return res;
	};
	return {
		status: -404,
		msg: '请求出错了！'
	}
}
function checkCode(res) {
	if(res.status === -404) {
		vm.$message(res.msg);
		return;
	};

	if(res.data.status === 401 || res.data.status === 503) {
		vm.$message(res.data.message);
		//return;
	};

	// 未登录
	if(res.data.status === 403) {
		vm.$router.replace({ path: '/login' });
		vm.$store.commit('changeUser', null);
		vm.$message(res.data.message);
		return;
	};

	// 强制下线
	if(res.data.status === 411) {
		vm.$router.replace({ path: '/login' });
		vm.$store.commit('changeUser', null);
		vm.$message(res.data.message);
		return;
	};
	return res.data
}

const loadingOptions= {
	lock: true,
	text: 'Loading',
	spinner: 'el-icon-loading',
	background: 'rgba(255, 255, 255, 0.5)'
}
var loadNum = 0;
var loading = null;
export default {
	baseURL: baseURL,
	mockBaseURL: mockBaseURL,
	socketURL: socketURL,
	post: function(url, data, options) {

		//let loading;
		if( !options || options.loading !== false ) {

			if(!loading){
				loading = vm.$loading( loadingOptions );
			}

			loadNum ++;
			//console.log('请求开始：' + loadNum );
		};

		if(!(data instanceof Array)) {
			if(!options || options.json !== true) {
				data = qs.stringify(data);
			}
		};

		if( url.indexOf('?') > -1 ) {
			url = checkUrl(url)+'&timestamp=' + new Date().getTime();;
		}else{
			url = checkUrl(url)+'?timestamp=' + new Date().getTime();;
		};

		return axios({
			url: url,
			data: data,
			method: 'post',
			headers:{
				'Token': vm.$store.state.user.info ? vm.$store.state.user.info.token : ''
			},
			// baseURL: baseURL,
			timeout: 100000,
		}).then(function(res) {
			return checkStatus(res);
		}).then(function(res) {



			setTimeout(() => {
			  loadNum --;
			  //console.log('请求结束：' + loadNum );
			  if(loadNum <= 0){
			  	loading && loading.close();
			  	loading = null;
			  }
	          //loading && loading.close();
	        }, 500);
			return checkCode(res)
		}).catch(function (error) {

		  loadNum --;
		  if(loadNum <= 0){
		  	loading && loading.close();
		  	loading = null;
		  }

			//loading && loading.close();
	        vm.$message.error('接口出错');
			console.log(error);
		});

	},
	get: function(url, data, options) {
		let loading;
		if( !options || options.loading !== false ) {
			loading = vm.$loading( loadingOptions );
		}
		data = (data && data.params) || {};

		if( url.indexOf('?') > -1 ) {
			url = checkUrl(url)+'&timestamp=' + new Date().getTime();;
		}else{
			url = checkUrl(url)+'?timestamp=' + new Date().getTime();;
		};

		return axios({
			url: url,
			params: data,
			method: 'get',
			baseURL: baseURL,
			headers:{
				'Token': vm.$store.state.user.info ? vm.$store.state.user.info.token : ''
			},
			timeout: 100000
		}).then(function(res) {
			return checkStatus(res);
		}).then(function(res) {
			setTimeout(() => {
	          loading && loading.close();
	        }, 500);
			return checkCode(res)
		}).catch(function (error) {
			loading && loading.close();
	        vm.$message.error('接口出错');
			console.log(error);
		});
	}
}
