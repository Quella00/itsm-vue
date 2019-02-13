<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			
			<div class="tabs-panel-wrap border">
				<ul class="examples">
					<!--整体布局-->
					<li>
						<router-link to="/examples/layoutBasic">整体布局(不分左右)</router-link>
					</li>
					<li>
						<router-link to="/examples/layoutLeftRight">整体布局(分左右)</router-link>
					</li>
					
					<!--autoHeight使用-->
					<li>
						<router-link to="/examples/autoHeightLeftRight">autoHeight使用(不带参数使用)--整体布局(分左右)</router-link>
					</li>
					<li>
						<router-link to="/examples/autoHeightBasic">autoHeight使用(带参数使用)--整体布局(不分左右)</router-link>
					</li>
					<li>
						<router-link to="/examples/autoHeightChangeH">autoHeight使用(带参数使用，解决其它高度变化，对自适应高度的影响)--整体布局(不分左右)</router-link>
					</li>
					
					<!--changeTreeH的使用-->
					<li>
						<router-link to="/examples/changeTreeH">changeTreeH使用--tree宽度超出产生横向滚动</router-link>
					</li>
					
					<!--三等分，宽度自动伸缩-->
					<li>
						<router-link to="/examples/layoutAutoWidth">表单三等分，宽度自动伸缩</router-link>
					</li>
					
					
					<!--<li>
						<router-link to="/examples/mockAxios">mock配合axios的使用</router-link>
					</li>-->
					<li>
						<router-link to="/examples/mockExpress">mock配合express的使用</router-link>
					</li>
					<li>
						<router-link to="/examples/temp">临时测试</router-link>
					</li>
					
					<li>
						<router-link to="/examples/sidebarAddData">左侧菜单-添加数据</router-link>
					</li>
					<li>
						<router-link to="/examples/sidebarEditData">左侧菜单-修改数据</router-link>
					</li>
				</ul>
			</div>

		</div>
	</div>
</template>

<script>
</script>

<style lang="less" scoped>
	.examples{
		padding:10px;
		li{
			line-height:24px;
			a:hover{
				color:#000;
			}
		}
	}
</style>