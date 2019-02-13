<!-- 资产应用  -->
<template>
	<div class="itsm-tabs-main">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 150px;">
					<el-form label-width="130px" :inline="true" style="margin-top: 15px;" :model="ruleForm" :rules="rules" ref="ruleForm">
						<el-form-item label="资产编码：" prop="code">
							<el-input v-model="ruleForm.code" class="resetWidth" placeholder="请输入资产编码"></el-input>
						</el-form-item>

						<el-form-item label="资产名称：" prop="name">
							<el-input v-model="ruleForm.name" class="resetWidth" placeholder="请输入资产名称"></el-input>
						</el-form-item>

						<el-form-item label="资产分类：" prop="classificationName">
							<el-input v-model="classificationName" class="resetWidth" readonly placeholder="请选择资产分类" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="assetDialog.show = true"></i>
						</el-form-item>

						<el-form-item label="资产状态：" prop="assetStatus">
							<el-select v-model="ruleForm.assetStatus" class="resetWidth" @focus="selectOnFocus">
								<el-option value="" label="请选择"></el-option>
								<el-option value="待清理" label="待清理"></el-option>
								<el-option value="借出" label="借出"></el-option>
								<el-option value="测试中" label="测试中"></el-option>
								<el-option value="使用中" label="使用中"></el-option>
								<el-option value="维护中" label="维护中"></el-option>
								<el-option value="报废" label="报废"></el-option>
								<el-option value="丢失" label="丢失"></el-option>
								<el-option value="闲置" label="闲置"></el-option>
								<el-option value="停用" label="停用"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="所属区域：" prop="regionOfAffiliationName">
							<el-input v-model="regionOfAffiliationName" class="resetWidth" readonly placeholder="请选择所属区域" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="areaDialog.show = true"></i>
						</el-form-item>
					</el-form>
				</div>
			</div>

			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-QRCode" style="width:115px;" @click="generate">生成二维码</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="resetForm">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table :data="applyTable.data" stripe style="width: 100%;" @selection-change="handleSelectionChange">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column show-overflow-tooltip prop="code" label="资产编码"></el-table-column>
						<el-table-column show-overflow-tooltip prop="name" label="资产名称"></el-table-column>
						<el-table-column show-overflow-tooltip prop="classificationName" label="资产分类"></el-table-column>
						<el-table-column show-overflow-tooltip prop="assetStatus" label="资产状态"></el-table-column>
						<el-table-column show-overflow-tooltip prop="regionOfAffiliationName" label="所属区域"></el-table-column>
						<el-table-column show-overflow-tooltip prop="userName" label="使用人"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createTime" label="新建时间"></el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-view" title="查看" @click="openAssetDetail(scope.row.id)"></i> 
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer" style="text-align: right;">
					<!--面板底部-->
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="applyTable.pagination.pageNum" :page-sizes="[10, 20, 30, 40]" 
						:page-size="applyTable.pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="applyTable.total">
					</el-pagination>
				</div>
			</div>
			<!-- 资产分类弹窗 -->
        	<iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId' type="search"></iesAssetDialog>
			<!-- 所属区域弹窗 -->
        	<iesAreaDialog v-model="areaDialog.show" v-if="areaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='areaDialog.selectId'></iesAreaDialog>
		
			<!--二维码打印预览弹窗-->
			<iesQrcodeViewDialog v-model="qrcodeDialog.show" v-if="qrcodeDialog.show" @qrcodeHandler="qrcodeHandler" :defaultSelect="qrcodeDialog.selectData"></iesQrcodeViewDialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'assetUtilization',
		data() {
			return {
				ruleForm: {
					code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					assetStatus: "", 			// 资产状态
					regionOfAffiliation: "", 	// 所属区域
				},
				searchConditions: {
					code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					assetStatus: "", 			// 资产状态
					regionOfAffiliation: "", 	// 所属区域
				},
				classificationName: "", 		// 资产分类~名字
				regionOfAffiliationName: "", 	// 所属区域~名字
				rules: { },
				// 资产表格配置
				applyTable: {
					data: [],
					selected: [],
					total: 0,
					pagination: {
						pageNum: 1,
						pageSize: 10
					}
				},
				// 资产分类弹窗
				assetDialog: {
					show: false,
					selectId: ''
				},
				// 所属区域弹窗
				areaDialog: {
					show: false,
					selectId: ''
				},
				// 二维码预览弹窗
				qrcodeDialog: {
					show: false,
					selectData: []
				}
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.query();
			});
		},
		activated() {
			this.$nextTick(this.query);
//			this.query();
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 资产分类
	        assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.ruleForm.classification = node.id;
	                this.classificationName = node.categoryName;
	          	} else {
	          		this.assetDialog.selectId = '';
	                this.ruleForm.classification = '';
	                this.classificationName = '';
	          	}
	        },
	        // 所属区域
			areaChooseHandler(node) {
	            if(node) {
	                this.areaDialog.selectId = node.id;
	                this.ruleForm.regionOfAffiliation = node.id;
	                this.regionOfAffiliationName = node.areaName;
	            } else {
	            	this.areaDialog.selectId = '';
	                this.ruleForm.regionOfAffiliation = '';
	                this.regionOfAffiliationName = '';
	            }
	        },
			query() {
				var param = {
	        		pageNum: this.applyTable.pagination.pageNum,
	        		pageSize: this.applyTable.pagination.pageSize,
	        		code: this.searchConditions.code,
	        		name: this.searchConditions.name,
	        		classification: this.searchConditions.classification,
	        		assetStatus: this.searchConditions.assetStatus,
	        		regionOfAffiliation: this.searchConditions.regionOfAffiliation,
	        	}
	        	this.$axios.post('/assets/apply/query',param).then( (res) => {
	        		if(res.status == 200) {
	        			if(res.data.list == null) {
	        				this.applyTable.data = [];
	        				this.applyTable.total = 0;
	        			} else {
	        				this.applyTable.data = res.data.list;
	        				this.applyTable.total = res.data.total;
	        			}
	        		}
				});
			},
			// 分页事件
			handleSizeChange(val) {
				this.applyTable.pagination.pageSize = val;
				this.query();
			},
			handleCurrentChange(val) {
				this.applyTable.pagination.pageNum = val;
				this.query();
			},
			// 表格选中数据
			handleSelectionChange(v) {
				//this.applyTable.selected = v.map(v => v.id);
				this.applyTable.selected = v;
			},
			// 点击一行 打开详情
			openAssetDetail(id) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( '/assetUtilization/viewAsset?id='+id+'&type=apply' );
			},
			// 重置
			resetForm() {
				this.ruleForm.regionOfAffiliation = "";
				this.regionOfAffiliationName = "";
				this.ruleForm.classification = "";
				this.classificationName = "";
				this.assetDialog.selectId = '';
				this.areaDialog.selectId = '';
				this.$refs['ruleForm'].resetFields();
			},
			// 查询
			search() {
				this.applyTable.pagination.pageNum = 1;
				this.searchConditions.code = this.ruleForm.code;
	        	this.searchConditions.name = this.ruleForm.name;
	        	this.searchConditions.classification = this.ruleForm.classification;
	        	this.searchConditions.assetStatus = this.ruleForm.assetStatus;
	        	this.searchConditions.regionOfAffiliation = this.ruleForm.regionOfAffiliation;
				this.query();
			},
			// 生成二维码
			generate() {
				this.qrcodeDialog.show = true;
				this.qrcodeDialog.selectData = this.applyTable.selected;
				//this.$message.warning("请连接专用二维码打印机进行打印");
			},
			
			qrcodeHandler(){
				
			}
		}
	}
</script>