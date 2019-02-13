<!-- 资产关系 -->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div class="tabs-panel-wrap border">
					<div class="panel-body">
						<el-table :data="configRelationTable.data" style="width:100%;" stripe>
							<el-table-column prop="relationshipPairCode" label="关系对代码" align="center" show-overflow-tooltip min-width="20%"></el-table-column>
							<el-table-column prop="relationshipCode" label="关系代码" align="center" show-overflow-tooltip min-width="20%"></el-table-column>
							<el-table-column prop="relationshipName" label="关系名称" align="center" show-overflow-tooltip min-width="20%"></el-table-column>
							<el-table-column prop="remark" label="备注" align="center" show-overflow-tooltip min-width="40%"></el-table-column>
						</el-table>
					</div>
				</div>
			</ies-scrollbar>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'assetRelation',
		data() {
			return {
				configRelationTable: {
					data: []
				}
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				this.queryData();
			});
		},
		methods: {
			queryData() {
				this.$axios.post('/assets/relationship/query').then( (res) => {
					this.configRelationTable.data = res.data;
				});
			}
		}
	}
</script>