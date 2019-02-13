<template>
	<edit-process></edit-process>
</template>

<script>
import editProcess from '../editProcess.vue'
	
export default {
	name: 'editChangeProcess',
	components:{
		editProcess
	},
	data() {
		return {
			
		}
	},
	watch: {
	    // 制作流程提交后，刷新页面
		'$store.state.process.pageEditChangeProcessFlag'() {
			console.log('editChangeProcess列表页刷新了');
			this.$children[0].init();
		},
		
	    $route(){
			if(this.$route.path == '/process/processManagement/changeProcess/editChangeProcess'){
				if(this.$route.query.id !== this.$children[0].editProcessConfig.table.params.processTemplateId) {
					this.$children[0].editProcessConfig.table.params.processTemplateId = this.$route.query.id;
					this.$children[0].init();
					console.log('editChangeProcess---');
				}
			}
		}
	}
}
</script>

<style lang="less">
</style>