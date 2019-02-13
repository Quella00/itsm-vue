<template>
	<div class="itsm-tabs-main ola-save-page">
		<div class="tabs-main">
			<ies-scrollbar class="ies-scrollbar" ref="scrollbar" v-changeScrollbarH="{scrollbar:this.$refs.scrollbar}">
				<div>
					<!-- 基本信息 -->
                    <div class="tabs-panel-wrap border basic">
                        <div class="panel-header">
							基本信息 <!--<i class="el-icon-my-collapse"></i>-->
                        </div>
                        
                        <div class="panel-body body">
                            <el-form :inline="true" :model="configBasicInfo.form.data" :rules="configBasicInfo.form.rules" ref="basicInfoForm" label-width="120px" class="resetForm" >
                                <el-form-item label="OLA名称：" prop="name">
                                    <el-input type="text" placeholder="请输入OLA名称" v-model="configBasicInfo.form.data.name" class="reset-width" :disabled="configAssetInfo.show"></el-input>
                                </el-form-item>
                                <el-form-item label="对应SLA：" prop="serviceLevelName">
                                    <el-select v-model="configBasicInfo.form.data.serviceLevelName" class="reset-width" :disabled="configAssetInfo.show" @focus="selectOnFocus">
                                    	<el-option :key="item.value" :value="item.value" v-for="item in configBasicInfo.form.serviceLevelNameDropDownData"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="关联支持合同：" prop="ucId">
                                    <el-select v-model="configBasicInfo.form.data.ucId" class="reset-width" :disabled="configAssetInfo.show" @focus="selectOnFocus">
                                    	<el-option :key="item.value" :label="item.label" :value="item.value.toString()" v-for="item in configBasicInfo.form.ucNameDropDownData"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="级别：" prop="ucServiceLevelId">
                                    <el-select v-model="configBasicInfo.form.data.ucServiceLevelId" class="reset-width" :disabled="configAssetInfo.show" no-data-text="请先选择关联支持合同" @focus="selectOnFocus">
                                    	<el-option :key="item.value" :label="item.label" :value="item.value.toString()" v-for="item in configBasicInfo.form.ucServiceLevelNameDropDownData"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>

                            <el-table :data="configBasicInfo.table.data" border style="width:65%; margin-left:120px;">
                                <el-table-column prop="kpi" label="等级\KPI" align="center"></el-table-column>
                                <el-table-column prop="sla" label="SLA定义" align="center"></el-table-column>
                                <!--<el-table-column prop="service" label="运维服务能力" align="center"></el-table-column>-->
                                <el-table-column label="运维服务能力" align="center">
                                	<template slot-scope="scope">
                                		
										<template v-if="scope.$index <= 2 && Number(scope.row.service) >= Number(scope.row.sla)">
											<span style="color:red; font-weight:bold;">{{scope.row.service}}</span>
										</template>
										<template v-else-if="scope.$index > 2 && Number(scope.row.service) <= Number(scope.row.sla)">
											<span style="color:red; font-weight:bold;">{{scope.row.service}}</span>
										</template>
										<template v-else>{{scope.row.service}}</template>
										
									</template>
                                </el-table-column>
                            </el-table>
                            
                            <div style="margin:20px 0 0 120px" v-if="!configAssetInfo.show">
                            	<el-button style="primary" size="normal" @click="saveBasicInfo">关联资产</el-button>
                            </div>
                            
                        </div>
                    </div>

					<!-- OLA关联资产 -->
					<div class="tabs-panel-wrap border" v-if="configAssetInfo.show">
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
								<div class="fl">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteOlaAsset()">删除</el-button>
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
											<i class="el-icon-my-delete resetStyle" @click="deleteOlaAsset(scope.row.id)"></i> <!-- @click="handleClick(scope.row)" -->
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
		<iesAssociatedAssetDialog v-model="configAssociatedAssetDialog.show" v-if="configAssociatedAssetDialog.show" @assetChooseHandler="chooseAssociatedAsset" :defaultConfigAssociatedAssetDialog='configAssociatedAssetDialog'></iesAssociatedAssetDialog>
		
	</div>
</template>

<script>
export default {
	name: 'olaSave',
	data () {
		return {

			// 基本信息
			configBasicInfo: {
				form: {
					data: {
						name: '',                 // OLA名称
						serviceLevelName: '',     // 对应SLA
						ucId:'',                  // 关联支持合同id
						ucName: '',               // 关联支持合同
						ucServiceLevelId: '',    // 级别id
						//ucServiceLevelName: ''    // 级别
					},
					rules: {
						name: [
							{ validator:this.$ies.validator.space, trigger:'blur, change', options:{max:32} },
				            { required: true, message: '请输入OLA名称', trigger: 'blur' },
						],
						serviceLevelName: [
				            { required: true, message: '请选择对应SLA', trigger: 'blur, change' }
						],
						ucId: [
				            { required: true, message: '请选择关联支持合同', trigger: 'blur, change' }
						],
						ucServiceLevelId: [
				            { required: true, message: '请选择级别', trigger: 'blur, change' }
						]
					},
					
					// 对应SLA下拉数据源
					serviceLevelNameDropDownData: [
						{ value: '一级' },
						{ value: '二级' },
						{ value: '三级' },
						{ value: '四级' },
						{ value: '五级' }
					],
					
					// 关联支持合同下拉数据源
					ucNameDropDownData: [],
					
					// 级别下拉数据源
					ucServiceLevelNameDropDownData: [],
				},
				table: {
					kpiData: [
						'服务响应时间（分钟）',
						'服务恢复时间（分钟）',
						'服务解决时间（分钟）',
						'可用性（%）',
						'稳定运行时间（小时）'
					],
					slaData: [
						'--', '--', '--', '--', '--', '--'
					],
					serviceData: [
						'--', '--', '--', '--', '--', '--'
					],
					data: [],
				},
				
				params: {
					name: '',
					serviceLevelName: '',
					ucId: '',
					ucSlaId: '',
					//olaAssetBeanList: ''
				}
			},
			
			// OLA关联资产
			configAssetInfo: {           
				show: false,                       // 默认隐藏关联资产
				form: {
					data: {
						assetName: '',                // 资产名称
						assetStatus: '',              // 资产状态
						assetArea: '',                // 资产区域
						areaId: '',              // 资产区域Id
						assetAreaId: '',              // 资产区域Id
						assetClassification: '',    // 资产分类
						assetClassificationId: '',    // 资产分类ID
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
						olaId: '',                   //OLA记录ID
						
						assetName: '',               // 资产名称
						assetStatus: '',             // 资产状态
						assetArea: '',               // 资产区域
						assetAreaId: '',             // 资产区域Id
						assetClassification: '',     // 资产分类
						assetClassificationId: '',   // 资产分类Id
						assetCode: '',               // 资产编码
						
	                    pageNum: 1,                  // 当前页
						pageSize: 10                 // 每页数量
					},
					
					data: []
				}
			},
			
			// 关联资产弹窗配置
			configAssociatedAssetDialog: {
				type: 'ola',
				show: false,
				olaId: '',
				selected: [],
				params: {
					serviceLevelName: '一级',      //服务等级名称

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
				selectId: null,    // 选中的区域节点node
				type: 'search'     // 搜索时，禁用分类也显示
			},
		
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
			this.getUcNameData();
			this.initBasicInfoTableData();
		},
		
		// 获取关联支持合同的数据源
		getUcNameData() {
			this.$axios.post('/itsm/servicelevel/uc/queryUcNonPageable').then((res) => {
				if(res.status == 200) {
					if(res.data.length) {
						this.configBasicInfo.form.ucNameDropDownData = res.data.map(function(item){
							return {
								value: item.id,
								label: item.name
							}
						});
					}
				}
			});
		},
		
		// 获取级别的下拉数据源
		getUcServiceLevelNameData() {
			var params = { ucId: this.configBasicInfo.form.data.ucId };
			this.$axios.post('/itsm/servicelevel/uc/queryUcSlaList', params).then((res) => {
				if(res.status == 200 && res.data.length) {
					this.configBasicInfo.form.ucServiceLevelNameDropDownData = res.data.map(function(item){
						return {
							//value: item.serviceLevel,
							value: item.id,
							label: item.serviceLevelName
						}
					});
				} else {
					this.configBasicInfo.form.ucServiceLevelNameDropDownData = [];
				}
			});
		},
		
		// 显示基本信息的表格数据
		initBasicInfoTableData() {
			this.configBasicInfo.table.data = [];
			for(var i = 0; i < 5; i++){
				this.configBasicInfo.table.data.push({
					'kpi': this.configBasicInfo.table.kpiData[i],
					'sla': this.configBasicInfo.table.slaData[i],
					'service': this.configBasicInfo.table.serviceData[i]
				});
			}
		},
		
		// 获取SLA定义数据
		getBasicInfoTableSlaData() {
			var params = { serviceLevelName: this.configBasicInfo.form.data.serviceLevelName };
			this.$axios.post('/itsm/servicelevel/sla/querySlaByName', params).then((res) => {
				if(res.status == 200) {
					this.configBasicInfo.table.slaData = [
						res.data.responseTime,
						res.data.recoveryTime,
						res.data.resolutionTime,
						res.data.serviceability,
						res.data.stableRunningTime,
					];
					this.initBasicInfoTableData();
				}
			});
		},
		
		// 根据级别的数据获取运维服务能力
		getBasicInfoTableServiceData() {
			if( this.configBasicInfo.form.data.ucServiceLevelId ){
				const params = { 
					ucId: this.configBasicInfo.form.data.ucId,
					//serviceLevel: this.configBasicInfo.form.data.ucServiceLevelId
					ucSlaId: this.configBasicInfo.form.data.ucServiceLevelId
				};
				this.$axios.post('/itsm/servicelevel/uc/queryUcSla', params).then((res) => {
					if(res.status == 200) {
						this.configBasicInfo.table.serviceData = [
							res.data.responseTime,
							res.data.recoveryTime,
							res.data.resolutionTime,
							res.data.serviceability,
							res.data.stableRunningTime,
						];
						this.initBasicInfoTableData();
					}
				});
			} else {
				this.configBasicInfo.table.serviceData = [
					'--', '--', '--', '--', '--', '--'
				];
				this.initBasicInfoTableData();
			}
		},
		
		// 保存基本信息
		saveBasicInfo() {
	        this.$refs['basicInfoForm'].validate((valid) => {
				if(valid) {
					// 运维服务能力
					var supportAble = this.configBasicInfo.table.data.every((item, index)=>{
						if(index <= 2) {
							return Number(item.service) < Number(item.sla);
						} else {
							return Number(item.service) > Number(item.sla);
						}
					});
					if(!supportAble){
						this.$message.error('您选择的运维服务能力不满足SLA需求标准，请调整运维服务能力等级！');
						return;
					};
					
					this.$ies.syncValue(this.configBasicInfo.params, this.configBasicInfo.form.data);
					this.configBasicInfo.params.ucSlaId = this.configBasicInfo.form.data.ucServiceLevelId;
					
					this.$axios.post('/itsm/servicelevel/ola/saveOla', this.configBasicInfo.params).then((res) => {
						if(res.status == 200) {
							this.configAssetInfo.show = true;
							this.configAssetInfo.table.params.olaId = res.data;
							this.configAssociatedAssetDialog.olaId = res.data;
							this.configAssociatedAssetDialog.params.serviceLevelName = this.configBasicInfo.params.serviceLevelName;
							this.getAssetInfoTableData();
							//this.getAssetIdListData();
							
							this.$store.state.ola.pageOlaFlag = !this.$store.state.ola.pageOlaFlag;
						} else {
							this.$message.error(res.message);
						}
					});
				}
	        });
		},
		
		
		
		// 获取OLA的关联资产
		getAssetInfoTableData(){
			this.$axios.post('/itsm/servicelevel/ola/queryOlaAsset', this.configAssetInfo.table.params).then((res) => {
				if(res.status == 200) {
					if(res.data.list.length) {
						this.configAssetInfo.table.total = res.data.total;
						this.configAssetInfo.table.data = res.data.list.map(function(item){
							return {
								id: item.id,
								assetCode: item.assetCode,
								assetName: item.assetName,
								assetClassification: item.assetClassification,
								assetStatus: item.assetStatus,
								assetArea: item.assetArea
							}
						});
					}else{
						this.configAssetInfo.table.total = res.data.total;
						this.configAssetInfo.table.data = [];
					}
				}
			});
		},
		
		// 获取OLA的关联资产的id列表
		getAssetIdListData() {
			this.$axios.post('/itsm/servicelevel/ola/queryOlaAssetIdList', {olaId: this.configAssetInfo.table.params.olaId}).then((res) => {
				if(res.status == 200) {
					this.configAssociatedAssetDialog.selected = res.data;
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
			this.$refs['assetForm'].resetFields();
			this.configAssetInfo.form.data.areaId = '';
			this.configAssetInfo.form.data.assetAreaId = '';
			this.configAssetInfo.form.data.assetClassificationId = '';
			this.configAssetDialog.selectId = '';
			this.configAreaDialog.selectId = '';
		},
		
		// 删除选中的OLA的关联资产
		deleteOlaAsset( v ) {
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
					olaId: this.configAssetInfo.table.params.olaId,
					olaAssetIdList: v || this.configAssetInfo.table.selected.join()
				}
				this.$axios.post('/itsm/servicelevel/ola/deleteOlaAsset', params).then((res) => {
					if(res.status == 200) {
						this.$message.success(res.message);
						this.getAssetInfoTableData();
						//this.getAssetIdListData();
					}
				});
			}).catch(() => {
				this.$message.info('已取消删除!');
			});
		},
		
		// 多选发生变化时触发
		changeAssetInfoselection( value ) {
			this.configAssetInfo.table.selected = value.map(v => v.id);
		},
		
		// 打开关联资产的弹窗
		openAssetListDialog() {
			this.$ies.syncValue(this.configAssociatedAssetDialog.params, this.configAssetInfo.form.data);
			this.$nextTick( ()=>{
				this.configAssociatedAssetDialog.show = true;
			});
		},
		
		// 保存ola关联数据后的页面刷新
		chooseAssociatedAsset( v ) {
			this.getAssetInfoTableData();
			//this.getAssetIdListData()
		},
		
		// 获取SLA关联资产
//		getAssetInfoData() {
//			this.$axios.post('/itsm/servicelevel/sla/querySlaAsset', this.configAssetInfo.table.params).then((res) => {
//				if(res.status == 200) {
//					this.configOlaTable.data = res.data;
//					this.configOlaTable.total = res.data.total;
//				}
//			});
//		},
		
//		// 查询SLA关联资产
//		queryAssetInfoData() {
//			this.$ies.syncValue(this.configAssetInfo.table.params, this.configAssetInfo.form.data);
//			this.getAssetInfoData();
//		},
		
        // pageSize 改变时会触发
        changeAssetInfoSize(value) {
            this.configAssetInfo.table.params.pageSize = value;
            this.getAssetInfoTableData();
        },
        
		// currentPage 改变时会触发
		changeAssetInfoCurrent(value) {
			this.configAssetInfo.table.params.pageNum = value;
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
		}
		
	},
	watch: {
		// 对应SLA监听
		'configBasicInfo.form.data.serviceLevelName': {
			handler: function(){
				this.getBasicInfoTableSlaData();
			},
			deep: true
		},
		
		// 关联支持合同id监听
		'configBasicInfo.form.data.ucId': {
			handler: function(){
				this.configBasicInfo.form.data.ucServiceLevelId = '',
				//this.configBasicInfo.form.data.ucServiceLevelName = '',
				this.configBasicInfo.form.ucServiceLevelNameDropDownData = [];
				this.getUcServiceLevelNameData();
			},
			deep: true
		},
		
		// 级别监听
		'configBasicInfo.form.data.ucServiceLevelId': {
			handler: function(){
				this.getBasicInfoTableServiceData();
			},
			deep: true
		},
	}
}
</script>

<style lang="less">
	.ola-save-page {
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