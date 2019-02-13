<template>
	<div class="itsm-tabs-main sla-save-page">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar">
				<div>
					<!-- SLA关联资产 -->
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							SLA关联资产 <!--<i class="el-icon-my-collapse"></i>-->
						</div>

						<div class="panel-body">
  
							<el-form :inline="true" :model="configAssetInfo.form.data" ref="assetForm" class="search-conditions">
								<el-form-item label="名称：" prop="assetName">
									<el-input type="text" v-model="configAssetInfo.form.data.assetName" placeholder="请输入名称"></el-input>
								</el-form-item>

								<el-form-item label="状态：" prop="assetStatus">
									<el-select v-model="configAssetInfo.form.data.assetStatus" placeholder="请选择资产状态" @focus="selectOnFocus">
										<el-option :value="item.value" :label="item.label" :key="item.value" v-for="item in configAssetInfo.stateDropDownData"></el-option>
									</el-select>
								</el-form-item>

								<el-form-item label="区域：" prop="assetArea">
									<el-input v-model="configAssetInfo.form.data.assetArea" placeholder="请选择区域" auto-complete="off" readonly="readonly"></el-input>
									<i class="el-icon-my-more" @click="openAreaDialog"></i>
								</el-form-item>

								<el-form-item label="分类：" prop="assetClassification">
									<el-input v-model="configAssetInfo.form.data.assetClassification" placeholder="请选择资产分类" auto-complete="off" readonly="readonly"></el-input>
									<i class="el-icon-my-more" @click="openAssetDialog"></i>
								</el-form-item>

								<el-form-item label="编码：" prop="assetCode">
									<el-input type="text" v-model="configAssetInfo.form.data.assetCode" placeholder="请输入编码" class="reset-width"></el-input>
								</el-form-item>
							</el-form>
						</div>

						<div class="tabs-panel-wrap border" style=" margin: 0 10px 10px 10px;">
							<div class="panel-header">
								<div class="fl">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteSlaAsset()">删除</el-button>
								</div>
								<div class="fr">
									<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
									<el-button type="normal" icon="el-icon-my-search" @click="queryAssetInfoData">查询</el-button>
									<el-button type="primary" size="normal" icon="el-icon-my-guanlian" @click="openAssetListDialog">关联资产</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table :data="configAssetInfo.table.data" @selection-change="changeAssetInfoselection" stripe style="width: 100%;">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetName" label="资产名称" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetClassification" label="分类" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetArea" label="区域" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作">
										<template slot-scope="scope">
											<i class="el-icon-my-delete resetStyle" @click="deleteSlaAsset(scope.row.id)"></i> <!-- @click="handleClick(scope.row)" -->
										</template>
									</el-table-column>
								</el-table>
							</div>

							<div class="panel-footer">
								<el-pagination @size-change="changeAssetInfoSize" @current-change="changeAssetInfoCurrent" :current-page="configAssetInfo.table.params.pageNum" :page-size="configAssetInfo.table.params.pageSize" :page-sizes="configAssetInfo.table.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configAssetInfo.table.total"></el-pagination>
							</div>
						</div>
					</div>
				</div>
			</ies-scrollbar>
		</div>
		
		<!-- 所属区域弹窗 -->
        <iesAreaDialog v-model="configAreaDialog.show" v-if="configAreaDialog.show" @areaChooseHandler="chooseAreaHandler" :defaultSelect='configAreaDialog.selectId' ></iesAreaDialog>

		<!-- 资产分类弹窗 -->
        <iesAssetDialog v-model="configAssetDialog.show" v-if="configAssetDialog.show" @assetChooseHandler="chooseAssetHandler" :defaultSelect='configAssetDialog.selectId' :type='configAssetDialog.type'></iesAssetDialog>
		
		<!--关联资产弹窗-->
		<iesAssociatedAssetDialog v-model="configAssociatedAssetDialog.show" v-if="configAssociatedAssetDialog.show" @assetChooseHandler="refreshAssetInfoData" :defaultConfigAssociatedAssetDialog='configAssociatedAssetDialog'></iesAssociatedAssetDialog>
		
	</div>
</template>

<script>
export default {
	name: 'slaAssetSave',
	data () {
		return {
			
			// OLA关联资产
			configAssetInfo: {
				form: {
					data: {
						assetName: '',                // 资产名称
						assetStatus: '',              // 资产状态
						assetArea: '',                // 资产区域
						areaId: '',                    // 资产区域Id
						//assetAreaId: '',              // 资产区域Id
						assetClassification: '',    // 资产分类
						assetClassificationId: '',    // 资产分类ID
						assetCode: ''                 // 资产编码
					},
					rules: {
						assetName: [
				            { required: true, message: '请输入活动名称', trigger: 'blur' },
				            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
						]
					}
				},
				
				// 状态下拉数据
				stateDropDownData: [    // 数据源
					{ label: '全部', value: '' },
					{ label: '待清理', value: '待清理' },
					{ label: '借出', value: '借出' },
					{ label: '测试中', value: '测试中' },
					{ label: '使用中', value: '使用中' },
					{ label: '维护中', value: '维护中' },
					{ label: '报废', value: '报废' },
					{ label: '丢失', value: '丢失' },
					{ label: '闲置', value: '闲置' },
					{ label: '停用', value: '停用' }
				],
				
				table: {
					selected: [],
					total: 0,
					pageSizes: [10, 20, 30, 40],
					
					params: {
						serviceLevelName: '',                   //服务等级名称
						
						assetName: '',               // 资产名称
						assetStatus: '',             // 资产状态
						//assetArea: '',               // 资产区域
						//assetClassification: '',     // 资产分类
						assetClassificationId: '', // 资产分类ID
						assetCode: '',               // 资产编码
						areaId: '',                    //资产归属区域ID
						
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					data: []
				}
			},
			
			// 关联资产弹窗配置
			configAssociatedAssetDialog: {
				type: 'sla',
				serviceLevelName: '',
				show: false,
				selected: [],
				params: {
					assetName: '',               // 资产名称
					assetStatus: '',             // 资产状态
					//assetArea: '',               // 资产区域
					areaId: '',               // 资产区域ID
					//assetClassification: '',     // 资产分类
					assetClassificationId: '', // 资产分类ID
					assetCode: '',               // 资产编码
				}
			},
			
            // 所属区域弹窗配置
            configAreaDialog: {
                show: false,     // 弹窗的显示/隐藏
                selectId: '',    // 选中的区域节点id  
            },
            
			// 资产分类弹窗配置
			configAssetDialog: {
				show: false,       // 弹窗的显示/隐藏
				selectId: '',      // 选中的区域节点node
				type: 'search'     // 搜索时，禁用分类也显示
			},
			
			serviceLevelName: ''  // 服务等级
		
		};
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	methods: {
    	//解决ie9不能修改的内容都能获取焦点
    	selectOnFocus(e) {
	        e.target.blur();
	    },
		
		init() {
			//this.serviceLevelName = this.$route.params.serviceLevelName.replace('serviceLevelName:','');
			this.serviceLevelName = this.$route.query.serviceLevelName;
			
//			console.log( this.$route );
//			console.log( this.$route.query.a );
//			console.log( this.$route.query.b );
			
			this.getAssetInfoTableData();
//			this.getSlaAssetIdList();
		},
		
		// 获取该服务等级下关联的资产信息ID
//		getSlaAssetIdList() {
//			this.$axios.post('/itsm/servicelevel/sla/querySlaAssetIdList', {serviceLevelName:this.serviceLevelName}).then((res) => {
//				if(res.status == 200) {
//					this.configAssociatedAssetDialog.selected = res.data;
//				}
//			});
//		},
		
		// 获取SLA的关联资产
		getAssetInfoTableData(){
			this.configAssetInfo.table.params.serviceLevelName = this.serviceLevelName;
			this.configAssociatedAssetDialog.serviceLevelName = this.serviceLevelName;
			
			this.$axios.post('/itsm/servicelevel/sla/querySlaAsset', this.configAssetInfo.table.params).then((res) => {
				if(res.status == 200) {
					if(res.data && res.data.list.length) {
						this.configAssetInfo.table.total = res.data.total;
						this.configAssetInfo.table.data = res.data.list.map(function(item){
							return {
								id: item.id,
								assetCode: item.code,
								assetName: item.name,
								assetClassification: item.classificationName,
								assetStatus: item.assetStatus,
								assetArea: item.regionOfAffiliationName
							}
						});
					}else{
						this.configAssetInfo.table.total = 0;
						this.configAssetInfo.table.data = [];
					}
				}
			});
		},
		
		// 查询OLA的关联资产
		queryAssetInfoData() {
			this.configAssetInfo.table.params.pageNum = 1;
			this.$ies.syncValue(this.configAssetInfo.table.params, this.configAssetInfo.form.data);
			this.getAssetInfoTableData();
		},
		
		// 重置查询表单
		resetQueryForm() {
			//console.log('重置');
			this.$refs['assetForm'].resetFields();
			this.configAssetInfo.form.data.areaId = '';
			this.configAssetInfo.form.data.assetClassificationId = '';
			this.configAssetDialog.selectId = '';
			this.configAreaDialog.selectId = '';
		},
		
		// 删除选中的OLA的关联资产
		deleteSlaAsset( v ) {
			if(!v && !this.configAssetInfo.table.selected.length){
				this.$message.warning('至少选择一条数据');
				return;
			}
			
			this.$confirm('请确认是否要删除该信息？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
				closeOnClickModal: false
			}).then( ()=>{
				var params = {
					serviceLevelName: this.serviceLevelName,
					deleteAssetIdList: v || this.configAssetInfo.table.selected.join()
				}
				this.$axios.post('/itsm/servicelevel/sla/deleteSlaAsset', params).then((res) => {
					if(res.status == 200) {
						this.$message.success(res.message);
						this.getAssetInfoTableData();
//						this.getSlaAssetIdList();
					}
				});
			}).catch(() => {
				this.$message.info('已取消删除!');
			});
			
			

		},
		
		// 多选发生变化时触发
		changeAssetInfoselection( value ) {
			console.log( value );
			this.configAssetInfo.table.selected = value.map(v => v.id);
		},
		
		// 打开关联资产的弹窗
		openAssetListDialog() {
			this.$ies.syncValue(this.configAssociatedAssetDialog.params, this.configAssetInfo.form.data);
			//console.log( this.configAssociatedAssetDialog.params );
			this.$nextTick( ()=>{
				this.configAssociatedAssetDialog.show = true;
			});
		},
		
		// 保存关联资产弹窗后的刷新页面数据
		refreshAssetInfoData( value ) {
			console.log( value );
			this.getAssetInfoTableData();
//			this.getSlaAssetIdList();
		},
		
        // pageSize 改变时会触发
        changeAssetInfoSize(value) {
            this.configAssetInfo.table.params.pageSize = value;
            //this.getAssetInfoData();
            this.getAssetInfoTableData();
        },
        
		// currentPage 改变时会触发
		changeAssetInfoCurrent(value) {
			this.configAssetInfo.table.params.pageNum = value;
            //this.getAssetInfoData();
            this.getAssetInfoTableData();
		},
		
		// 打开所属区域弹窗
		openAreaDialog() {
            this.configAreaDialog.show = true;
		},
		// 获取所属区域弹窗选择的数据
		chooseAreaHandler(node) {
			this.configAssetInfo.form.data.assetArea = node.areaName;
			this.configAssetInfo.form.data.areaId = node.id;
			this.configAreaDialog.selectId = node.id;
        },
		
		// 打开所属分类弹窗
		openAssetDialog() {
            this.configAssetDialog.show = true;
		},
		// 获取所属分类弹窗选择的数据
		chooseAssetHandler(node) {
			this.configAssetInfo.form.data.assetClassification = node.categoryName;
			this.configAssetInfo.form.data.assetClassificationId = node.id;
			this.configAssetDialog.selectId = node.id;
		}
	},
	watch:{
	    $route(){
			if(this.$route.path == '/serviceGrade/slaAssetSave'){
				if(this.$route.query.serviceLevelName !== this.serviceLevelName) {
					Object.assign(this.$data, this.$options.data());
					this.init();
					console.log('slaAssetSave更新了数据');
				}
			}
	    }
	}
}
</script>

<style lang="less">
	.sla-save-page {
		height: 100%;
		.el-icon-my-collapse { 
			font-size: 12px; color: #a1a1a1; 
		}
		.search-conditions {
			padding: 15px 0px 0px 40px;
			.el-form-item {
				margin-right: 70px;
				.el-input__inner{ 
					width: 202px; 
				}
			}
		}
		.basic {
			.el-select .el-input.is-disabled .el-input__inner{
				height:27px !important;
			}
            .el-table{
				td{ 
					height:40px; line-height: 40px; padding: 0; 
				}
				th.is-leaf{
					border-bottom:1px solid #e4e4e4; line-height: 40px; height: 40px; background:#ffffff;
					.cell{
						color:#666666; font-weight: 200; background:none;
					}
				}
			}
		}
		.body { 
			padding: 30px 0 40px 40px;
			.el-form-item { 
				margin-right: 40px; 
			}
		}
		.reset-style { 
			cursor: pointer; 
		}
		.el-table__body-wrapper { 
			overflow-x: hidden; 
		}
		.device-context-dialog-style {
			width: 720px; height: 350px;
			.el-dialog__body { 
				height: 250px; padding: 10px 0 10px 10px; 
			}
		}
		.user-dialog-style { 
			width: 720px; height: 570px;
			.query-area {
				.main { 
					height: 80px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding-top: 25px;
				    .content { 
						float: left; width: 280px; margin-right: 35px; 
					}
				}
				.reset-width { 
					width: 200px; 
				}
			}
			.el-dialog__body { 
				height: 470px; padding: 10px 0 10px 10px; 
			}
		}
		.submit {
			width: 70px; margin: 20px auto;
		}
	}
</style>