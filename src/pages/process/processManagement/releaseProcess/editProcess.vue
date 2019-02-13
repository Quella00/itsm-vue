<template>
	<edit-process></edit-process>
</template>

<script>
import editProcess from '../editProcess.vue'
	
export default {
	name: 'editReleaseProcess',
	components:{
		editProcess
	},
	data() {
		return {
			
		}
	},
	watch: {
	    // 制作流程提交后，刷新页面
		'$store.state.process.pageEditReleaseProcessFlag'() {
			console.log('editReleaseProcess列表页刷新了');
			this.$children[0].init();
		},
		
		$route(){
			if(this.$route.path == '/process/processManagement/releaseProcess/editReleaseProcess'){
				if(this.$route.query.id !== this.$children[0].editProcessConfig.table.params.processTemplateId) {
					this.$children[0].editProcessConfig.table.params.processTemplateId = this.$route.query.id;
					this.$children[0].init();
					console.log('editReleaseProcess刷新了---');
				}
			}
		}
	}
}
</script>

<style lang="less">
</style>