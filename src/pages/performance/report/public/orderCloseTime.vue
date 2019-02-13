<template>
	<el-form-item label="工单关闭时间：" prop="closeTime" style="width:100%;">
		<div class="selection-time">
			<span v-for="item in closeTimeTagData" :class="['item-time', {actived: configSynthesisData.form.data.closeTimeTag == item.value}]" @click="selectTimeTag(item.value)">{{item.name}}</span>
			<el-date-picker v-model="configSynthesisData.form.data.closeTime" type="daterange" :editable='false' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
            class="date-picker" v-show="configSynthesisData.form.data.closeTimeShow" style="float:left;"></el-date-picker>
		</div>
	</el-form-item>
</template>

<script>
export default {
	props: ['configSynthesisData'],
	data() {
		return {
			// 工单关闭时间选择标签数据源
			closeTimeTagData: [
				{ value:7, name: '最近7天' },
				{ value:30, name: '最近30天' },
				{ value:90, name: '最近90天' },
				{ value:0, name: '指定日期' }
			]
		}
	},
	methods:{
		// 工单关闭时间标签选择
		selectTimeTag( v ){
			this.configSynthesisData.form.data.closeTimeShow = (v == 0 ? true : false);
			this.configSynthesisData.form.data.closeTimeTag = v;
		}
	}
};
</script>

<style>
</style>