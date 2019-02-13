<template>
	<div class="itsm-tabs-main ola-edit-page">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div>
					<!-- 基本信息 -->
                    <div class="tabs-panel-wrap border basic">
                        <div class="panel-header">
							基本信息 <!--<i class="el-icon-my-collapse"></i>-->
                        </div>
                        
                        <div class="panel-body body">
                            <el-form :inline="true" :model="configOlaDetail.data.baseInfo" ref="ruleForm" label-width="110px" class="resetForm" >
                                <el-form-item label="OLA名称：">
                                    <el-input type="text" v-model="configOlaDetail.data.baseInfo.name" class="reset-width" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="对应SLA：">
                                    <el-select v-model="configOlaDetail.data.baseInfo.serviceLevelName" class="reset-width" disabled></el-select>
                                </el-form-item>
                                <el-form-item label="关联支持合同：">
                                    <el-select v-model="configOlaDetail.data.baseInfo.ucName" class="reset-width" disabled></el-select>
                                </el-form-item>
                                <el-form-item label="级别：">
                                    <el-select v-model="configOlaDetail.data.baseInfo.ucServiceLevelName" class="reset-width" disabled></el-select>
                                </el-form-item>
                            </el-form>

                            <el-table :data="configOlaDetail.data.serviceInfo.data" border style="width:65%; margin-left:110px;">
                                <el-table-column prop="kpi" label="等级\KPI" align="center"></el-table-column>
                                <el-table-column prop="sla" label="SLA定义" align="center"></el-table-column>
                                <el-table-column prop="service" label="运维服务能力" align="center"></el-table-column>
                            </el-table>
                        </div>
                    </div>

					<!-- OLA关联资产 -->
					<div class="tabs-panel-wrap border">
						<div class="panel-header">
							OLA关联资产 <!--<i class="el-icon-my-collapse"></i>-->
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
								<div class="fr">
									<el-button type="normal" icon="el-icon-my-reset" @click="resetQueryForm">重置</el-button>
									<el-button type="normal" icon="el-icon-my-search" @click="queryAssetInfoData">查询</el-button>
								</div>
							</div>
							
							<div class="panel-body">
								<el-table ref="assetTable" :data="configAssetInfo.table.data" stripe style="width: 100%;">
									<el-table-column prop="assetCode" label="资产编码" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetName" label="资产名称" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetClassification" label="分类" show-overflow-tooltip></el-table-column>
									<el-table-column prop="assetArea" label="区域" show-overflow-tooltip></el-table-column>
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
		
	</div>
</template>

<script>
export default {
	name: 'olaEdit',
	data () {
		return {

			// olaData数据
			configOlaDetail: {
				data: {
					baseInfo: {},
					serviceInfo: {
						kpiData: [
							'服务响应时间（分钟）',
							'服务恢复时间（分钟）',
							'服务解决时间（分钟）',
							'可用性（%）',
							'稳定运行时间（小时）'
						],
						slaData: [],
						serviceData: [],
						data: [],
					},
					assetInfo: {}
				},
				params: {
                    olaId: '',       // 当前页
				}
			},
			
			// SLA关联资产
			configAssetInfo: {
				form: {
					data: {
						assetName: '',                // 资产名称
						assetStatus: '',              // 资产状态
						assetArea: '',                // 资产区域
						assetAreaId: '',              // 资产区域id
						assetClassification: '',      // 资产分类
						assetClassificationId: '',    // 资产分类id
						assetCode: ''                 // 资产编码
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
						olaId:'',                    // OLA记录ID
						
						assetName: '',               // 资产名称
						assetStatus: '',             // 资产状态
						assetArea: '',               // 资产区域
						assetAreaId: '',             // 资产区域id
						assetClassification: '',     // 资产分类
						assetClassificationId: '',   // 资产分类id
						assetCode: '',               // 资产编码
						
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					data: []
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
				selectId: '',      // 选中的区域节点id
				type: 'search'     // 搜索时，禁用分类也显示
				
			},
		
		};
	},
	mounted() {
		this.$nextTick( ()=>{
			this.init();
		});
	},
	activated() {
		this.$refs.assetTable.doLayout();
	},
	methods: {
    	//解决ie9不能修改的内容都能获取焦点
    	selectOnFocus(e) {
	        e.target.blur();
	    },
		
		init() {
//			this.configOlaDetail.params.olaId = this.$route.params.id.replace('id:','');
//			this.configAssetInfo.table.params.olaId = this.$route.params.id.replace('id:','');
			
			this.configOlaDetail.params.olaId = this.$route.query.id;
			this.configAssetInfo.table.params.olaId = this.$route.query.id;
			this.getOlaDetailData();
		},
		
		// 获取ola数据的详细信息
		getOlaDetailData() {
			//console.log( this.configOlaDetail.params );
			this.$axios.post('/itsm/servicelevel/ola/queryOlaDetail', this.configOlaDetail.params).then((res) => {
				if(res.status == 200) {
					
					// 基本信息-input数据
					this.configOlaDetail.data.baseInfo = res.data.baseInfo;
					
					// 基本信息-table数据
					this.configOlaDetail.data.serviceInfo.slaData = [
						this.configOlaDetail.data.baseInfo.serviceLevelInfo.responseTime,
						this.configOlaDetail.data.baseInfo.serviceLevelInfo.recoveryTime,
						this.configOlaDetail.data.baseInfo.serviceLevelInfo.resolutionTime,
						this.configOlaDetail.data.baseInfo.serviceLevelInfo.serviceability,
						this.configOlaDetail.data.baseInfo.serviceLevelInfo.stableRunningTime,
					];
					this.configOlaDetail.data.serviceInfo.serviceData = [
						this.configOlaDetail.data.baseInfo.ucServiceLevelInfo.responseTime,
						this.configOlaDetail.data.baseInfo.ucServiceLevelInfo.recoveryTime,
						this.configOlaDetail.data.baseInfo.ucServiceLevelInfo.resolutionTime,
						this.configOlaDetail.data.baseInfo.ucServiceLevelInfo.serviceability,
						this.configOlaDetail.data.baseInfo.ucServiceLevelInfo.stableRunningTime,
					];
					
					this.configOlaDetail.data.serviceInfo.data = [];
					for(var i = 0; i < 5; i++){
						this.configOlaDetail.data.serviceInfo.data.push({
							'kpi': this.configOlaDetail.data.serviceInfo.kpiData[i],
							'sla': this.configOlaDetail.data.serviceInfo.slaData[i],
							'service': this.configOlaDetail.data.serviceInfo.serviceData[i]
						});
					}
					
					// OLA关联资产数据
					this.configAssetInfo.table.data = res.data.assetInfo.list;
					this.configAssetInfo.table.total = res.data.assetInfo.total;
				}
			});
		},
		
		// 获取OLA关联资产
		getAssetInfoData() {
			this.$axios.post('/itsm/servicelevel/ola/queryOlaAsset', this.configAssetInfo.table.params).then((res) => {
				if(res.status == 200) {
					this.configAssetInfo.table.data = res.data.list;
					this.configAssetInfo.table.total = res.data.total;
				}
			});
		},
		
		// 查询OLA关联资产
		queryAssetInfoData() {
			
			this.configAssetInfo.table.params.pageNum = 1;
			this.$ies.syncValue(this.configAssetInfo.table.params, this.configAssetInfo.form.data);
			this.getAssetInfoData();
		},
		
		resetQueryForm() {
			this.$refs['assetForm'].resetFields();
			this.configAssetInfo.form.data.assetAreaId = '';
			this.configAssetInfo.form.data.assetClassificationId = '';
			this.configAssetDialog.selectId = '';
			this.configAreaDialog.selectId = '';
		},
		
        // pageSize 改变时会触发
        changeAssetInfoSize(value) {
            this.configAssetInfo.table.params.pageSize = value;
            this.getAssetInfoData();
        },
        
		// currentPage 改变时会触发
		changeAssetInfoCurrent(value) {
			this.configAssetInfo.table.params.pageNum = value;
            this.getAssetInfoData();
		},
		
		// 打开所属区域弹窗
		openAreaDialog() {
            this.configAreaDialog.show = true;
		},
		// 获取所属区域弹窗选择的数据
		chooseAreaHandler(node) {
			this.configAssetInfo.form.data.assetArea = node.areaName;
			this.configAssetInfo.form.data.assetAreaId = node.id;
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
		},
		
//		refreshData(){
//			Object.assign(self.$data, self.$options.data());
//			this.init();
//		}
	},
	watch:{
	    $route(){
	    	console.log(this);
			if(this.$route.path == '/serviceGrade/olaEdit'){
				if(this.$route.query.id !== this.configOlaDetail.params.olaId) {
					Object.assign(this.$data, this.$options.data());
					this.init();
					//console.log('olaedit更新了数据');
				}
			}
	    }
	}
}
</script>

<style lang="less">
	.ola-edit-page {
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