<template>
	<edit-process></edit-process>
</template>

<script>
import editProcess from '../editProcess.vue'
	
export default {
	name: 'editProblemProcess',
	components:{
		editProcess
	},
	data() {
		return {
			
		}
	},
	watch: {
	    // 制作流程提交后，刷新页面
		'$store.state.process.pageEditProblemProcessFlag'() {
			console.log('editProblemProcess列表页刷新了');
			this.$children[0].init();
		},
		
	    $route(){
			if(this.$route.path == '/process/processManagement/problemProcess/editProblemProcess'){
				if(this.$route.query.id !== this.$children[0].editProcessConfig.table.params.processTemplateId) {
					this.$children[0].editProcessConfig.table.params.processTemplateId = this.$route.query.id;
					this.$children[0].init();
					console.log('editProblemProcess刷新了---');
				}
			}
		}
	}
}
</script>

<style lang="less">
</style>