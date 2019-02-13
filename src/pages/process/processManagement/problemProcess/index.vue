<template>
	<process></process>
</template>

<script>
import process from '../index.vue'
	
export default {
	name: 'problemProcess',
	components:{
		process
	},
	data() {
		return {
			
		}
	},
	watch: {
		// 制作流程提交后刷新页面
		'$store.state.process.pageProblemProcessFlag'() {
			console.log('problemProcess列表页刷新了');
			this.$children[0].configProcess.table.params.pageNum = 1;
			this.$children[0].init();
		}
	}
}
</script>

<style lang="less">
</style>