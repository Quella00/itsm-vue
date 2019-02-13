<template>
	<el-dialog title="搜索备件" :visible="value" custom-class="select-person" @close="importHandler" :close-on-click-modal='false' v-drag>
		<div class="select-person-content">
			<div class="tabs-panel-wrap border" v-autoHeight="tableH">
				<div class="panel-header">
				</div>
				<div class="panel-body">
					<el-table :data="tableData" stripe style="width: 100%;"  @select="handleSelect" @select-all="handleSelectAll" ref="spaceTable"
					 :max-height="tableH">
						<el-table-column width="55" align="center" type="selection"></el-table-column>
						<el-table-column label="资产编码" prop="code" width="180" show-overflow-tooltip></el-table-column>
						<el-table-column label="备件名称" prop="name" show-overflow-tooltip></el-table-column>
						<el-table-column label="分类" prop="classificationName" show-overflow-tooltip></el-table-column>
						<el-table-column label="状态" prop="maintenanceStatus" show-overflow-tooltip></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagination.currentPage"
					 :page-sizes="[10, 20, 30, 40]" :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
					 :total="pagination.total">
					</el-pagination>
				</div>
			</div>
		</div>
		<div slot="footer" class="dialog-footer">
			<el-button size="normal" @click="importHandler('confirm')">导&nbsp;入</el-button>
		</div>
	</el-dialog>
</template>

<script>
	export default {
		props: ['defaultSelect', 'value', 'query'],
		data() {
			return {
				tableH: '',
				selection: [],
				tableData: [],
				loginName: '',
				userName: '',
				url: '',
				params: {},
				pagination: {
					total: 0,
					pageSize: 10,
					currentPage: 1
				}
			}
		},
		mounted() {
			this.$nextTick(function () {
				this.init();
			});
		},
		methods: {
			init() {
				this.$nextTick(function(){
					this.selection = this.selection.concat(this.defaultSelect);
					this.getTableData();
				})
			},
			//获取表格数据
			getTableData(params) {
				const self = this;
				params = params || {
					code: this.query.code,
					name: this.query.name,
					deviceStatus: '库存',
					classification: this.query.classification,
					pageNum: this.pagination.currentPage,
					pageSize: this.pagination.pageSize
				}
				this.$axios.post('/itsm/device/apply/query', params).then((res) => {
					if (res.status == 200) {
						this.tableData = res.data.list;
						this.pagination.total = res.data.total;
						this.tableData.forEach((v)=>{
							this.selection.forEach((val,key)=>{
								if(val.id == v.id){
									this.$nextTick( ()=>{
										this.$refs.spaceTable.toggleRowSelection(v, true);
									});
								}
							})
						})
					}
				});
			},
			handleSizeChange(val) {
				this.pagination.pageSize = val;
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.pagination.currentPage = val;
				this.getTableData();
			},
			// 关闭或者点击保存
			importHandler(type) {
				if (type == 'confirm') {
					this.$emit('callback', this.selection);
				}
				this.$emit('input', false);
			},
			handleSelect(selection, row) {
				let flag = true;
				this.selection = this.selection.filter((v)=>{
					if(v.id == row.id) flag = false;
					return v.id != row.id
				});
				if(flag) this.selection.push(row);
			},
			handleSelectAll(selection) {
				let self = this,selectionIds = self.selection.map(v => v.id),tabledataIds = self.tableData.map(v=> v.id);
				if(selection.length==0){
					self.selection = self.selection.filter((v)=>{
						return tabledataIds.indexOf(v.id) == -1
					})
				} else {
					selection.forEach((item,index)=>{
						if(selectionIds.indexOf(item.id)==-1){
							self.selection.push(item);
						}
					})
				}
				
			}
		},
		filters: {

		},
		computed: {

		},
		watch: {

		}
	}

</script>