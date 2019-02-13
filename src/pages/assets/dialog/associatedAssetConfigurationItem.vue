<!-- 关联资产配置项弹窗 -->
<template>
	<div>
		<el-dialog width="60%" title="关联资产配置项" :visible="true" :close-on-click-modal='false' @close="configurationChoose" v-drag>
			<div>
				<div style="padding:10px 10px 10px">
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							查询条件
						</div>
						<div class="panel-body" style="min-height: 80px; padding-left: 30px; padding-top: 20px;">
							<el-form :inline="true" :model="configuration.formData" class="asset-query" :rules="configuration.rules" ref="ruleForm">
								<el-form-item label="名称：" prop="name">
									<el-input v-model="configuration.formData.name" placeholder="请输入名称"></el-input>
								</el-form-item>
								<el-form-item label="状态：" prop="assetStatus">
									<el-select v-model="configuration.formData.assetStatus" @focus="selectOnFocus">
										<el-option label="请选择" value=""></el-option>
										<el-option label="待清理" value="待清理"></el-option>
										<el-option label="借出" value="借出"></el-option>
										<el-option label="测试中" value="测试中"></el-option>
										<el-option label="使用中" value="使用中"></el-option>
										<el-option label="维护中" value="维护中"></el-option>
										<el-option label="报废" value="报废"></el-option>
										<el-option label="丢失" value="丢失"></el-option>
										<el-option label="闲置" value="闲置"></el-option>
										<el-option label="停用" value="停用"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="分类：" prop="classificationName">
									<el-input v-model="configuration.classificationName" readonly placeholder="请选择分类" @focus="selectOnFocus"></el-input>
									<i class="el-icon-my-more" @click="assetDialog.show = true"></i>
								</el-form-item>
								<el-form-item label="编号：" prop="code">
									<el-input v-model="configuration.formData.code" placeholder="请输入编号"></el-input>
								</el-form-item>
							</el-form>
						</div>
					</div>
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							<div class="panel-header-right">
								<el-button type="normal" icon="el-icon-my-search" @click="query">查询</el-button>
								<el-button type="normal" icon="el-icon-my-reset" @click="resetForm">重置</el-button>
							</div>
						</div>
						<div class="panel-body">
							<el-table :data="configuration.tableData" stripe :fit="true" height="300" style="width: 100%;height: 100%;">
								<el-table-column width="55" align="center">
									<template slot-scope="scope">
										<el-radio v-model="configuration.radio" :label="JSON.stringify(scope.row)">&nbsp;</el-radio>
									</template>
								</el-table-column>
								<el-table-column label="编号" prop="code" show-overflow-tooltip></el-table-column>
								<el-table-column label="名称" prop="name" show-overflow-tooltip></el-table-column>
								<el-table-column label="分类" prop="classificationName" show-overflow-tooltip></el-table-column>
								<el-table-column label="状态" prop="assetStatus" show-overflow-tooltip></el-table-column>
							</el-table>
						</div>
						<div class="panel-footer" style="position: inherit;">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="configuration.pageNum" :page-sizes="[10, 20, 30, 40]" 
								:page-size="configuration.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configuration.total">
							</el-pagination>
						</div>
					</div>
				</div>
			</div>
			<div slot="footer">
				<el-button type="normal" @click="configurationChoose('save')">确定</el-button>
			</div>
		</el-dialog>
		<!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId'></iesAssetDialog> 
	</div>
</template>

<script>
	export default {
		props: [ 'defaultSelect' ],
		data() {
			return {
				configuration: {
					isQuery: false,
					formData: {
						name: "", 				// 名称
						assetStatus: "", 		// 状态
						classification: "",		// 分类
						code: "" 				// 编码
					},
					classificationName: "",		// 分类~名称
					rules: {},
					pageNum: 1,
					pageSize: 10,
					total: 0,
					tableData: [],			
					radio: '',					// 勾选的数据
				},
				assetDialog: {
					show: false,
					selectId: ''
				},
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.queryTableData();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			queryTableData() {
				const self = this;
				var param = {
					pageNum: this.configuration.pageNum,
					pageSize: this.configuration.pageSize
				}
				if(this.isQuery) {
					for(var item in this.configuration.formData) {
						if(this.configuration.formData[item] != "" && this.configuration.formData[item] != null) {
							param[item] = this.configuration.formData[item];
						}
					}
				}
				this.$axios.post('/assets/apply/query',param).then( (res) => {
					if(res.status == 200) {
						this.configuration.tableData = res.data.list;
						this.configuration.total = res.data.total;
						
						this.$nextTick(function () {
							if(self.defaultSelect) {
								var data = res.data.list;
								data && data.forEach(function(item) {
									if(self.defaultSelect == item.id) {
										self.configuration.radio = JSON.stringify(item);
										return false;
									}
								});
							} else {
								self.configuration.radio = "";
							}
			        	});
					}
				});
			},
			handleCurrentChange(v) {
				this.configuration.pageNum = v;
				this.queryTableData();
			},
			handleSizeChange(v) {
				this.configuration.pageSize = v;
				this.queryTableData();
			},
			// 重置
			resetForm() {
				this.isQuery = false;
				this.configuration.formData.classification = "";
				this.configuration.classificationName = "";
				this.assetDialog.selectId = "";
				this.$refs['ruleForm'].resetFields();
			},
			// 查询
			query() {
				this.isQuery = true;
				this.queryTableData();
			},
			// 资产分类
	        assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.configuration.classificationName = node.categoryName;
	                this.configuration.formData.classification = node.id;
	           }
	        },
	        configurationChoose(type) {
	        	if(type == 'save') {
	        		this.$emit('assetConfigurationHandler', this.configuration.radio);
	        	}
	        	this.$emit('input', false);
	        }
		}
	}
</script>