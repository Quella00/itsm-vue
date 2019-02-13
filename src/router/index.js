import Vue from 'vue'
import Router from 'vue-router'

// 登录
import Login from '@/pages/login'

// 关于系统
import AboutSystem from '@/pages/aboutSystem.vue'

// 重新注册
import registAgain from '@/pages/registAgain.vue'

// 布局
import layout from '@/pages/layout.vue'

// 首页
import home from '@/pages/home.vue'

// 个人
import yzz from './yzz.js'
import zhusiyuan from './zhusiyuan.js'
import xohu from './xohu.js'
import zhushuang from './zhushuang.js'
import zhoujie from './zhoujie.js'

// 案例
import examples from './examples.js'

Vue.use(Router)

var router = new Router({
	routes: [
		{
			path: '/login',
			component: Login
		},
		{
			path: '/aboutSystem',
			component: AboutSystem
		},
		{
			path: '/registAgain',
			component: registAgain
		},
		{
			path: '/',
			component: layout,
			children: [
				// 首页
				{
					name: '首页',
					path: '/',
					component: home,
					componentName: 'home'
				}
			]
		},
		yzz,
		zhusiyuan,
		xohu,
		zhushuang,
		zhoujie,
		examples
	].map(v => {
		let router = obj => {
			if(obj.children && obj.children.length) {
				obj.children.forEach(vs => {
					vs.componentName && !vs.component.name && (vs.component.name = vs.componentName);
					router(obj.children);
				});
			}else {
				obj.componentName && !obj.component.name && (obj.component.name = obj.componentName);
			}
		}
		router(v);
		
		return v;
	}),
	scrollBehavior: (to, from, savedPosition) => {
		if(savedPosition) {
			let ret = {};
            const getRouter = arr => {
				arr.forEach(v => {
					if(v.path == from.path) {
						ret.componentName = v.componentName;
					}else {
						if(v.children && v.children.length ) {
							getRouter(v.children);
						}
					}
				})
			}

			getRouter(this.a.options.routes);	
			const layout = ies.broadcast(this.a.app, 'layout'), index = layout.keepname.indexOf(ret.componentName);
			index && layout.keepname.splice(index, 1);
		}
	}
});

router.beforeEach((to, from, next) => {
	this.a.app.$store.commit('updateUser');
	if(to.path == '/aboutSystem' || to.path == '/registAgain'){
		next();
	}else if( to.path !== '/login' && (!this.a.app.$store.state.user.info || !this.a.app.$store.state.user.info.id) ) {
		//vm.$message.error('请先授权登录');
		next({
			path: '/login'
		});
		return;
	}
	next();
});

// IE11
if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
	window.addEventListener('hashchange', evt => {
	  const hasPath = window.location.hash.slice(1);
	  router.app.$router.push({ path: hasPath });
	}, false)
}

export default router;