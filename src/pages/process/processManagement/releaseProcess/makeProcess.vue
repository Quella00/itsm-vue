<template>
	<make-process></make-process>
</template>

<script>
import makeProcess from '../makeProcess.vue'
	
export default {
	name: 'makeReleaseProcess',
	components:{
		makeProcess
	},
	data() {
		return {
			
		}
	},
	watch: {
	    $route(){
			if(this.$route.path == '/process/processManagement/releaseProcess/makeReleaseProcess'){
				if(this.$route.query.versionId !== this.$children[0].configQueryProcessNodesByTemplatesId.params.processTemplatesVersionId) {
        			this.$children[0].configQueryProcessNodesByTemplatesId.params.processTemplatesVersionId = this.$route.query.versionId;
        			this.$children[0].configQueryAllNodePropertyByVersionId.params.processNodeVersionId = this.$route.query.versionId;
        		
        			this.$children[0].configSaveProcessSteps.params.processTemplatesId = this.$route.query.templatesId;
        			this.$children[0].configSaveProcessSteps.params.processType = this.$route.query.processType;
					this.$children[0].configSaveProcessSteps.operationType = this.$route.query.operationType;
					
					this.$children[0].init();
					console.log('makeReleaseProcess刷新了---');
				}
			}
		}
	}
}
</script>

<style lang="less">
</style>