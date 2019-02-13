<template>
	<div class="sidebar">
		<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar, changeH:changeScrollbarH}">

			<el-menu @open="openSidebar" :unique-opened="true">

				<!--判断是否有数据-->
				<template v-if="sidebarData && sidebarData.length">
					<template v-for="oneLevelMenus in sidebarData">
						<!--显示一级菜单-->
						<!--<el-submenu :index="oneLevelMenus.id.toString()" class="ies-sidebar-submenu" v-if="oneLevelMenus.resourceName !== '知识库' && oneLevelMenus.resourceName !== '绩效管理'">-->
						<el-submenu :index="oneLevelMenus.id.toString()" class="ies-sidebar-submenu">
							<template slot="title">
								<template v-if="oneLevelMenus.resourceName == '系统管理'">
									<i class="el-icon-my-system"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '资产管理'">
									<i class="el-icon-my-assets"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '服务等级管理'">
									<i class="el-icon-my-service"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '流程管理'">
									<i class="el-icon-my-flow"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '服务台'">
									<i class="el-icon-my-serviceCounter"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '工单管理'">
									<i class="el-icon-my-order"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '备件管理'">
									<i class="el-icon-my-spare"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '知识库'">
									<i class="el-icon-my-knowledgeBase"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '绩效管理'">
									<i class="el-icon-my-performance"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '开发管理'">
									<i class="el-icon-my-toQuestion"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '开发人员选项'">
									<i class="el-icon-my-developer"></i>
								</template>
								<template v-else-if="oneLevelMenus.resourceName == '报表管理'">
									<i class="el-icon-my-reportManagement"></i>
								</template>
								{{ oneLevelMenus.resourceName }}
							</template>
							<!--判断是否有二级菜单-->
							<template v-if="oneLevelMenus.children && oneLevelMenus.children.length">
								<!--显示二级菜单-->
								<template v-for="(twoLevelMenus, index2) in oneLevelMenus.children">
									
									<!--判断二级菜单下是否有三级菜单-->
									<template v-if="twoLevelMenus.parentFlag">
										<el-submenu :index="twoLevelMenus.id.toString()">
											<template slot="title">{{ twoLevelMenus.resourceName }}
											</template>
											
											<!--判断是否有三级菜单-->
											<template v-if="twoLevelMenus.children && twoLevelMenus.children.length">
												<!--显示三级菜单-->
												<template v-for="(threeLevelMenus, index3) in twoLevelMenus.children">
													
													<el-menu-item :index="threeLevelMenus.resourceUrl" @click="openPage( threeLevelMenus.resourceUrl )">
														{{ threeLevelMenus.resourceName }}
													</el-menu-item>
													
												</template>
											</template>
										</el-submenu>
									</template>
									<template v-else>
										<el-menu-item :index="twoLevelMenus.resourceUrl" @click="openPage( twoLevelMenus.resourceUrl )">
											{{ twoLevelMenus.resourceName }}
										</el-menu-item>
									</template>
								</template>
								
							</template>
						</el-submenu>
					</template>
				</template>
			</el-menu>
		</ies-scrollbar>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				changeScrollbarH: 0,
				
				sidebarData: []  // 左侧菜单导航数据结构
			};
		},
		mounted() {
			this.$nextTick(() => {
				setTimeout(this.init, 1000);
			});
		},
		methods: {
			init() {
				this.getSidebarData();
			},

			// 获取侧边栏导航数据
			getSidebarData(callback) {		
				const params = {
					parentId: 0,
					usability: 1
				};
				this.$axios.post('/itsm/system/permission/resource/queryResourceByParentId', params).then((res) => {
					if (res.status == 200) {
						this.sidebarData = res.data;
						if(callback){
							callback();
						}
					}
				});
			},

			// 点击展开菜单时的事件
			openSidebar(key, keyPath) {
				const self = this;
				pushArray(this.sidebarData, key);
				
				this.changeScrollbarH ++;
				
				function pushArray(arr, key) {
					for( var i = 0; i < arr.length; i++) {
						if( arr[i].id == key ) {
							if( !(arr[i].children && arr[i].children.length) ) {
								
								const params = {
									parentId: key
								};
								self.$axios.post('/itsm/system/permission/resource/queryResourceByParentId', params).then((res) => {
									if(res.status == 200) {
										self.$set(arr[i], 'children', []);
										arr[i].children = arr[i].children.concat( res.data );
									}
								});
								
							}
							return true;
						} else {
							if( arr[i].children && arr[i].children.length ) {
								pushArray(arr[i].children, key)
							}
						}
					}
				}
			},

			// 打开页面
			openPage( path, query ) {
				const ret = {};
				
				// 支持query参数传值
				let fullPath = path;
				if(query){
					var params = '', i = 0;
					query = JSON.parse(query);
					for(var key in query) {
						i ++;
						if(i == 1) {
							params += '?'+ key + '=' + query[key];
						} else {
							params += '&'+ key + '=' + query[key];
						}
					}
					fullPath = fullPath + params;
				}
				
				// 支持路由？传参
				if( /\?+/.test(path) ) {
					path = path.split('?')[0];
				}
				
				getObject( this.$router.options.routes, path);
				if (ret.path) {
					this.$router.push({
						path: fullPath
					});
					this.$parent.$refs.tabsnav.openPage(ret);
				} else {
					this.$message.error('打开失败，请确认打开的地址是否正确！');
				};
				
				function getObject(arr, path) {
					for( var i = 0; i < arr.length; i++) {
						if( arr[i].path == path) {
							ret.path = fullPath;
							ret.name = arr[i].name || 'tabs标题';
							ret.componentName = arr[i].componentName;
						} else {
							if( arr[i].children && arr[i].children.length ) {
								getObject(arr[i].children, path);
							}
						}
					}
				}
			}
			
		}
	}
</script>

<style lang="less">

</style>