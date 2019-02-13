<template>
    <div class="itsm-tabs-main quick-access-page">	
        <div class="tabs-main">
            <ies-scrollbar class="ies-scrollbar">
                <div>
                    <div class="tabs-panel-wrap query-area" v-for="item in module" :key="item.topResourceName" v-if="module.length > 0">
                        <div class="panel-header">{{item.topResourceName}}</div>
                        <div class="panel-body main">
                            <div class="content left" v-for="child in item.children" :key="child.resourceName" >
                                <div class="icon left">
                                    <span :class="['shortcut',child.imageUrl]" @click="toModule(child.moduleDefaultUrl)"></span>
                                </div>
                                <div class="title left">{{child.resourceName}}</div>
                                <div class="state no" v-if="child.isShow == false" @click.stop="toHome(child,true)"></div>
                                <div class="state" v-if="child.isShow" @click.stop="toHome(child,false)"></div>
                            </div>
                        </div>
                    </div>
                    
					<div class="tabs-panel-wrap query-area" v-if="module.length < 1">
						<div class="panel-header"></div>
                        <div class="panel-body main" style="padding: 20px;">
                           	暂无数据
                        </div>
					</div>
                </div>
            </ies-scrollbar>
        </div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			module: [],
			length: 0
		};
	},
	mounted() {
		this.$nextTick(function() {
			this.queryModule();
		});
	},
	methods: {
		queryModule() {
			this.$axios.post('/itsm/system/dailymanagement/quickaccessmanagement/queryModule',{
				userId: this.$store.state.user.info.id
			}).then( (res) => {
				if(res.status == 200) {
					if(res.data != null) {
						this.change(res.data);
					} 
				}
			});
		},
		change(all) {
			var name = [];
			var result = [];
			var length = 0;
			for(var i=0;i<all.length;i++) {
				var title = all[i].topResourceName;
				if(all[i].isShow) {
					length = length + 1;
				}
				if(name.indexOf(title) == -1) {
					name.push(title);
					result.push({
						topResourceName: title,
						children: [
							all[i]
						]
					});
				} else {
					for(var j=0;j<result.length;j++) {
						if(result[j].topResourceName == title) {
							result[j].children.push(all[i]);
						}
					}
				}
			}
			this.module = result;
			this.length = length;
		},
		// 设置到首页
		toHome(item,flag) {
			if(flag) {
				if(this.length < 6) {
					this.queryInterface(item,flag);
				} else {
					this.$message({ type: 'warning', message: '最多设置6个模块到首页!' });
				}
			} else {
				this.queryInterface(item,flag);
			}
		},
		// 请求接口
		queryInterface(item,flag) {
			var param = {
				permissionId: item.id,
				userId: this.$store.state.user.info.id,
				isShow: flag
			}
			this.$axios.post('/itsm/system/dailymanagement/quickaccessmanagement/saveIndexModule',param).then( (res) => {
				if(res.status == 200) {
					this.queryModule();
					if(flag) {
						this.$message({ type: 'success', message: '已添加到首页的快捷访问' });
					} else {
						this.$message({ type: 'success', message: '已取消首页的快捷访问' });
					}
				} else {
					this.$message({ type: 'error', message: '设置失败' });
				}
			});
		},
		// 跳转到对应路由
		toModule(item) {
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( item );
		}
	}
}
</script>

<style lang="less">
	.quick-access-page .shortcut {
		cursor: pointer;
	}
</style>