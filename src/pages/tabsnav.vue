<template>
	<div class="tabs-nav">

		<el-tabs v-model="currentPage" type="card" @tab-click="clickTabs">
			<el-tab-pane v-for="(item, index) in openedPageList" :key="item.path" :label="item.name" :name="item.path">
				<p class="tabs-item" slot="label">
					<span>{{ item.name }}&nbsp;</span>
					<template v-if="index == 0">
						<i class="el-icon-my-tabRefresh" @click.stop="refreshPage()"></i>
					</template>
					<template v-else>
						<i class="el-icon-my-tabDelete" @click.stop="closePage(item.path)"></i>
					</template>
				</p>
			</el-tab-pane>
		</el-tabs>
		<i class="el-icon-my-tabDeleteAll" @click="deleteTabsAll"></i>
	</div>
</template>

<script>
	export default {
		name: 'tabsnav',
		data() {
			return {
				lastPage: '',
				currentPage: '/',
				openedPageList: [{
					path: '/',
					name: '首页',
					componentName: 'home'
				}],
			};
		},
		mounted() {
			this.$nextTick(() => {
				this.init();
			});
		},
		methods: {
			init() {
				var self = this;
				// 通过sessionStorage临时保存数据
				if(sessionStorage.openedPageList && sessionStorage.openedPageList != '') {
					this.openedPageList = JSON.parse(sessionStorage.openedPageList);
				}
				if(sessionStorage.currentPage && sessionStorage.currentPage != '') {
					this.currentPage = sessionStorage.currentPage;
				}
				
				// 解决如果直接输入首页地址
				if(this.$route.path == '/') {
					this.currentPage = '/';
				}else{
					// 解决直接输入其它地址
					var isHaveURl;
					if( /\?+/.test(self.$route.fullPath) ){
						isHaveURl = this.openedPageList.some(function(item){
							return item.path.split('?')[0] == self.$route.fullPath.split('?')[0];
						});

					} else {
						isHaveURl = this.openedPageList.some(function(item){
							return item.path == self.$route.path;
						});
					}
					if(!isHaveURl){
						self.currentPage = self.$route.fullPath;
						self.$parent.$refs.sidebar.openPage( self.$route.fullPath );
					}
				};
			},
			
			// 打开页面操作
			openPage(item) {
				/*
				// path有？传参和无？传参的判断
				if( /\?+/.test(item.path) ){
					for(var i = 0; i < this.openedPageList.length; i++) {
						if(this.openedPageList[i].path.split('?')[0] == item.path.split('?')[0]) {
							this.openedPageList[i].path = item.path;
							return;
						}
					}
				} else {
					if(JSON.stringify(this.openedPageList).includes(JSON.stringify(item))) {
						return;
					}
				}
				this.openedPageList.push(item);
				*/
				let index = 0;
				this.openedPageList.forEach((v, i) => {
					v.path.split('?')[0] == item.path.split('?')[0] && (index = i);
				});
				index ? this.openedPageList.splice(index, 1, item) : this.openedPageList.push(item);
			},

			// tabs标签页点击切换
			clickTabs(tab) {
				this.$router.push({
					path: tab.name
				});
				
				let index = 0;
				const dt = this.openedPageList.filter((v, i) => {
					if(v.path.split('?')[0] == tab.name.split('?')[0]) {
						index = i;
						return true;
					};
				});
				index && this.openedPageList.splice(index, 1, dt[0]);
				//this.$emit('clickTabs');
			},

			// 刷新首页
			refreshPage() {
				this.$router.push({
					path: '/'
				});
				window.location.reload();
			},

			// tabs标签页关闭
			closePage(path) {
				var paramPath = path, pagelistPath;
				if( /\?+/.test(path) ) {
					paramPath = path.split('?')[0];
				};
				
				this.openedPageList = this.openedPageList.filter(function(v) {
					return v.path.split('?')[0] != paramPath;
				});

				if(this.currentPage.split('?')[0] == paramPath) {
					
					this.$parent.$refs.tabsItem.$destroy();
					for(var i = 0; i < this.openedPageList.length; i++) {
						if(this.openedPageList[i].path == this.lastPage) {
							this.$router.push({
								path: this.lastPage
							});
							return;
						}
					}
					this.$router.push({
						path: this.openedPageList[this.openedPageList.length - 1].path
					});
				};
			},

			// 删除全部tabs标签页（除首页）
			deleteTabsAll() {
				this.openedPageList = this.openedPageList.slice(0, 1);
				this.$router.push({
					path: this.openedPageList[0].path
				});
			}

		},
		watch: {
			// 打开的页面列表
			openedPageList: {
				handler: function(v){
					this.$parent.keepname = v.map((item)=>{
						return item.componentName
					});
					sessionStorage.openedPageList = JSON.stringify(v);
				},
				deep: true
			},
			// 当前页面路径
			currentPage(v) {
				sessionStorage.currentPage = v;
			}
		}
	}
</script>

<style lang="less">

</style>