<template>
	<div class="panel-content border">
		<div class="panel-header">
			我的工作台
			<div class="fr">
				<span class="el-icon-my-refresh" @click="myWork"></span>
			</div>
		</div>
		<div class="panel-body" style="height:224px;">
			<ul class="shortcut-list clearfix">
				<li v-for="item in work" :key="item.id" v-if="work != null">
					<span :class="['shortcut',item.imageUrl]" @click="toModule(item.moduleDefaultUrl)"></span>
					<p>{{item.resourceName}}</p>
				</li>
				<span v-if="work == null">暂无数据</span>
			</ul>
		</div>
		<div class="panel-footer">
			<el-button type="primary" size="normal" @click="moreQuick">更多快捷方式 >></el-button>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			work: [],			// 我的工作台
		}
	},
	mounted() {
		this.$nextTick(()=>{
			this.init();
		});
	},
	methods: {
		init() {
			this.myWork();
		},
		// 我的工作台
		myWork() {
			this.$axios.post('/itsm/system/dailymanagement/quickaccessmanagement/queryIndexModule', {
				userId: this.$store.state.user.info.id
			} ).then( (res) => {
				if(res.status == 200) {
					this.work = res.data;
				}
			});
		},
		// 更多快捷方式
		moreQuick() {
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/system/quick-access" );
		},
		// 跳转到对应路由
		toModule(item) {
			this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( item );
		},
	}
}
</script>

<style>
</style>