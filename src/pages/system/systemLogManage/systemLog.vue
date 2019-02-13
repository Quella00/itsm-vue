<!--系统日志-->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-export" @click="exportData">导出</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-refresh" @click="queryData">刷新</el-button>
					</div>
				</div>
				<ies-scrollbar class="ies-scrollbar">
					<div class="panel-body" >
						<div style="padding-left: 75px; padding-top: 30px; padding-bottom: 30px;">
							{{ log }}
						</div>
					</div>
				</ies-scrollbar>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'systemLog',
		data() {
			return {
				log: "",
				token: this.$store.state.user.info ? this.$store.state.user.info.token : ''
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				this.queryData();
			});
		},
		methods: {
			queryData() {
				this.$axios.post('/ahies/log/systemlog/querySystemLog').then( (res) => {
					this.log = res.data;
				});
			},
			// 导出
			exportData() {
				window.open(`api/ahies/log/systemlog/exportSystemLog?Token=${this.token}`);
			}
		}
	}
</script>