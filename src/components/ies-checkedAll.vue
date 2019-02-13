<template>
	<div>
		<el-checkbox v-model="checkedAll.isCheckedAll" @change="change()">全选</el-checkbox>
	</div>
	
</template>

<script>
export default {
	props: {
		checkedAll: {
			type: Object
		}
	},
	data() {
		return {
			//checked: this.checkedAll.isCheckedAll
		}
	},
	methods: {
		change() {
			const _this = this;
			
			this.checkedAll.checkeds = [];
			if( this.checkedAll.isCheckedAll ) {
				this.checkedAll.data.forEach(function(item) {
					_this.checkedAll.checkeds.push(item[_this.checkedAll.name]);
				});
			}
		}
	},
	watch: {
		'checkedAll.checkeds'() {
			if( this.checkedAll.checkeds.length == this.checkedAll.data.length ) {
				this.checkedAll.isCheckedAll = true;
			} else {
				this.checkedAll.isCheckedAll = false;
			}
		},
		'checkedAll.data'() {
			this.checkedAll.checkeds = [];
		}
	}
}
</script>

<style>
</style>