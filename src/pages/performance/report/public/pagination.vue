<template>
	<el-pagination @size-change="changeSize" @current-change="changeCurrent" :current-page="configSynthesisData.table.params.pageNum" :page-size="configSynthesisData.table.params.pageSize" :page-sizes="configSynthesisData.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configSynthesisData.table.total"></el-pagination>
</template>

<script>
export default {
	props: ['configSynthesisData'],
	data() {
		return {
		}
	},
	mounted() {
	},
	methods: {
        // pageSize 改变时会触发
        changeSize( v ) {
        	this.$parent.$parent.scrollbarH ++; 
        	
        	this.configSynthesisData.table.params.pageSize = v;
            this.$parent.$parent.$refs.table.getSynthesisData();
        },
        
        // currentPage 改变时会触发
        changeCurrent( v ) {
        	this.$parent.$parent.scrollbarH ++;
        	
            this.configSynthesisData.table.params.pageNum = v;
            this.$parent.$parent.$refs.table.getSynthesisData();
        }
	}
}
</script>

<style lang="less">
</style>