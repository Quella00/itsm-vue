<template>
	<edit-process></edit-process>
</template>

<script>
import editProcess from '../editProcess.vue'
	
export default {
	name: 'editEventProcess',
	components:{
		editProcess
	},
	data() {
		return {
			
		}
	},
	watch: {
	    // 制作流程提交后，刷新页面
		'$store.state.process.pageEditEventProcessFlag'() {
			console.log('editEventProcess列表页刷新了');
			this.$children[0].init();
		},
		
	    $route(){
			if(this.$route.path == '/process/processManagement/eventProcess/editEventProcess'){
				if(this.$route.query.id !== this.$children[0].editProcessConfig.table.params.processTemplateId) {
					this.$children[0].editProcessConfig.table.params.processTemplateId = this.$route.query.id;
					this.$children[0].init();
					console.log('editEventProcess刷新了---');
				}
			}
		}
	}
}
</script>

<style lang="less">
</style>