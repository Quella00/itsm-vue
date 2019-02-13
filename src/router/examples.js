import layout from '@/pages/layout.vue'

import example from '@/pages/examples/index.vue'

import layoutBasic from '@/pages/examples/layout-basic.vue'
import layoutLeftRight from '@/pages/examples/layout-left-right.vue'

import autoHeightLeftRight from '@/pages/examples/autoHeight-left-right.vue'
import autoHeightBasic from '@/pages/examples/autoHeight-basic.vue'
import autoHeightChangeH from '@/pages/examples/autoHeight-changeH.vue'

import changeTreeH from '@/pages/examples/changeTreeH-basic.vue'

import layoutAutoWidth from '@/pages/examples/layout-autowidth.vue'

import mockAxios from '@/pages/examples/mock-axios.vue'
import mockExpress from '@/pages/examples/mock-express.vue'

import sidebarAddData from '@/pages/examples/sidebar-addData.vue'
import sidebarEditData from '@/pages/examples/sidebar-editData.vue'

import temp from '@/pages/examples/temp.vue'

const examples = {
	path: '/',
	component: layout,
	children: [
		
		// examples
		{
			path: '/examples',
			component: example,
			name: '案例'
		},
		{
			path: '/examples/temp',
			component: temp,
			name: '临时'
		},
		
		// 整体布局
		{
			path: '/examples/layoutBasic',
			component: layoutBasic,
			name: '基本布局'
		},
		{
			path: '/examples/layoutLeftRight',
			component: layoutLeftRight,
			name: '左右布局'
		},
		
		// autoHeight使用
		{
			path: '/examples/autoHeightLeftRight',
			component: autoHeightLeftRight,
			name: '自动高度-左右布局'
		},
		{
			path: '/examples/autoHeightBasic',
			component: autoHeightBasic,
			name: '自动高度-基本布局'
		},
		{
			path: '/examples/autoHeightChangeH',
			component: autoHeightChangeH,
			name: '动态改变高度-基本布局'
		},
		
		//changeTreeH使用
		{
			path: '/examples/changeTreeH',
			component: changeTreeH,
			name: '树结构'
		},
		
		// 表单三等分，宽度自动伸缩
		{
			path: '/examples/layoutAutoWidth',
			component: layoutAutoWidth,
			name: '表单宽度自适应'
		},
		
		// mockjs使用
		{
			path: '/examples/mockAxios',
			component: mockAxios,
			name: 'mock的axios使用'
		},
		{
			path: '/examples/mockExpress',
			component: mockExpress,
			name: 'mock的express使用'
		},
		
		// 左侧菜单
		{
			path: '/examples/sidebarAddData',
			component: sidebarAddData,
			name: '左侧菜单-添加数据'
		},
		{
			path: '/examples/sidebarEditData',
			component: sidebarEditData,
			name: '左侧菜单-修改数据'
		}	
	]
}

export default examples;