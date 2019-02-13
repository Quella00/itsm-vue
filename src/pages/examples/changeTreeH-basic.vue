<template>

	<div class="itsm-tabs-main">

		<div class="tabs-left border">
			<ies-scrollbar class="ies-scrollbar">
				<div v-changeTreeH>
					<el-tree :props="configCategoryTree.defaultProps" :render-content="$ies.tree.renderContent" lazy :load="getCategoryTree"></el-tree>
				</div>
			</ies-scrollbar>
		</div>

		<div class="tabs-right">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板1</div>
					</div>

					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板2</div>
					</div>

					<div class="tabs-panel-wrap border">
						<div style="height:100px; background-color:#fff; ">面板3</div>
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
                configCategoryTree:{
                    selsetId:'',
                    defaultProps: {
                        label: 'label',
                        isLeaf: 'leaf',
                        children: 'children'
                    },
                }
			};
		},
		mounted() {

		},
		methods: {
            //获取分类树
            getCategoryTree(node,resolve){
                if (node.level === 0) {
                    return resolve([{ label: '分类树' }]);
                }
                setTimeout(() => {
                    const data = [{
                        label: 'node-1',
                        leaf: false,
                    }, {
                        label: 'node-2',
                        leaf: true
                    }];

                    resolve(data);
                }, 500);
            }
            
		}
	}
</script>

<style lang="less">

</style>