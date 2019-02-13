<template>
	<process></process>
</template>

<script>
import process from '../index.vue'
	
export default {
	name: 'spareProcess',
	components:{
		process
	},
	data() {
		return {
			
		}
	},
	watch: {
		// 制作流程提交后刷新页面
		'$store.state.process.pageSpareProcessFlag'() {
			console.log('spareProcess列表页刷新了');
			this.$children[0].configProcess.table.params.pageNum = 1;
			this.$children[0].init();
		}
	}
}
</script>

<style lang="less">
</style>