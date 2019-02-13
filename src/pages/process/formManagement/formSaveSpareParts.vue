<template>
	<form-save></form-save>
</template>

<script>
import formSave from './formSave'
	
export default {
	components:{
		formSave
	},
	watch: {
		'$store.state.process.formVersion.spareParts'(v) {
			const self = this;

            self.$children[0].$refs['infoForm'].resetFields();
			self.$children[0].$refs['workOrderForm'].resetFields();
            self.$children[0].init();
		}
	}
}
</script>

<style lang="less">
</style>