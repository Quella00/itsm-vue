<template>
	<div style="position:relative; width:100%; height:100%; min-width:1200px; ">

		<div class="itsm-container" id="itsm-container">
			<!--左侧边导航-->
			<itsm-sidebar ref="sidebar"></itsm-sidebar>
			
			<div class="main-content">
				<div class="tabs-header">
					<!--右侧分页标签导航-->
					<itsm-tabsnav ref="tabsnav"></itsm-tabsnav>
				</div>
				<div class="tabs-content">
					<div class="tabs-item">
						<transition name="fade" mode="out-in">
							<keep-alive :include="keepname">
								<router-view ref="tabsItem"></router-view>
							</keep-alive>
						</transition>
					</div>
				</div>
			</div>
		</div>
		<div class="itsm-navbar" id="itsm-navbar">
			<!--头部导航-->
			<itsm-header ref="header"></itsm-header>
		</div>
		
	</div>
</template>

<script>
import itsmHeader from './header.vue'
import itsmSidebar from './sidebar.vue'
import itsmTabsnav from './tabsnav.vue'
	
export default {
	name: 'layout',
	components: {
		itsmHeader, itsmSidebar, itsmTabsnav
	},
	data () {
		return {
			keepname: []         // 会被缓存的组件名称的存放数组
		};
	},
	mounted(){
		
		console.log( this );
		
	    this.$router.beforeEach((to, from, next) => {
			if(this.$refs.tabsnav) {
				this.$refs.tabsnav.lastPage = from.fullPath;
				console.log( to );
				this.$refs.tabsnav.currentPage = decodeURI(to.fullPath);
				// 解决tooltip显示残留bug
				$('body > .el-tooltip__popper').remove();
			}
			next();
		});
		
	},
	methods: {
		
	}
}
</script>

<style lang="less">
.itsm-navbar {
	position:absolute; top:0; left:0; width:100%; height:60px; background-color:#0d7fdf;
}

.itsm-container{
	position:relative; padding-top:60px; height:100%; overflow:hidden;
	.sidebar{
		position:absolute; top:60px; left:0; bottom:0; z-index:99; width:220px; background-color:#fff; border-right:1px solid #e4e4e4; overflow:hidden;
	}
	.main-content{
		position:relative; padding-left:220px; width:100%; height:100%;
		
		.tabs-header{
			position:absolute; top:0; left:0; right:0; height:39px; background:#f6f9fb; border-bottom:1px solid #e4e4e4;
		}
		.tabs-content{
			padding:15px; padding-top:55px; width:100%; height:100%;
			.tabs-item{
				width:100%; height:100%;position:relative;
			}
		}
	}
}
</style>
