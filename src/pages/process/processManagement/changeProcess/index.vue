<template>
	<process></process>
</template>

<script>
import process from '../index.vue'
	
export default {
	name: 'changeProcess',
	components:{
		process
	},
	data() {
		return {
			
		}
	},
	watch: {
		// 制作流程提交后刷新页面
		'$store.state.process.pageChangeProcessFlag'() {
			console.log('changeProcess列表页刷新了');
			this.$children[0].configProcess.table.params.pageNum = 1;
			this.$children[0].init();
		}
	}
}
</script>

<style lang="less">
</style>