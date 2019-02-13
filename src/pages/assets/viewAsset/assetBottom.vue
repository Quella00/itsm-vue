<!-- 查看资产tab部分 -->
<template>
	<div>
		<div class="tabs-panel-wrap border" style="margin-top: 10px;">
			<div class="add-maintenance-content">
				<div class="tabs-nav tabs-nav-asset">
					<el-tabs type="card" v-model="currentPage" @tab-click="query">
						<el-tab-pane label="关联资产" name="associated">
							<p class="tabs-item" slot="label">
								<span>关联资产</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="关联工单" name="associatedWorkSheet">
							<p class="tabs-item" slot="label">
								<span>关联工单</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="接口信息" name="interface">
							<p class="tabs-item" slot="label">
								<span>接口信息</span>
							</p>
						</el-tab-pane>
						<!--3.1再做，产品说先隐藏-->
						<!--<el-tab-pane label="关联出库单" name="associatedOutboundList">
							<p class="tabs-item" slot="label">
								<span>关联出库单</span>
							</p>
						</el-tab-pane>-->
						<el-tab-pane label="附件信息" name="attachment">
							<p class="tabs-item" slot="label">
								<span>附件信息</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="版本信息" name="version">
							<p class="tabs-item" slot="label">
								<span>版本信息</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="生命周期管理" name="record">
							<p class="tabs-item" slot="label">
								<span>生命周期管理</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="合同信息" name="contract">
							<p class="tabs-item" slot="label">
								<span>合同信息</span>
							</p>
						</el-tab-pane>
						<el-tab-pane label="供应商信息" name="supplier">
							<p class="tabs-item" slot="label">
								<span>供应商信息</span>
							</p>
						</el-tab-pane>
					</el-tabs>
				</div>
				
				<div class="dialog-tabs-content">
					<div class="asset-tab">
						<div class="tabs-panel-wrap border" style="margin-right: 0px;">
							<div class="panel-header"></div>

							<div class="panel-body">
								<!--1关联资产-->
								<el-table v-show="currentPage == 'associated'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="源资产配置项" prop="sourceAssetName" show-overflow-tooltip></el-table-column>
									<el-table-column label="关系" prop="relationshipName" show-overflow-tooltip></el-table-column>
									<el-table-column label="目标资产配置项" prop="targetAssetName" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--2关联工单-->
								<el-table v-show="currentPage == 'associatedWorkSheet'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="工单编号" prop="code" show-overflow-tooltip></el-table-column>
									<el-table-column label="主题" prop="theme" show-overflow-tooltip></el-table-column>
									<el-table-column label="优先级" prop="priority" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建人" prop="createUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--3接口信息-->
								<el-table v-show="currentPage == 'interface'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="接口别名" prop="interfaceAliases" show-overflow-tooltip></el-table-column>
									<el-table-column label="接口类型" prop="interfaceType" show-overflow-tooltip></el-table-column>
									<el-table-column label="Trunk" prop="interfaceTurnk" show-overflow-tooltip>
										<template slot-scope="scope">
			                                {{scope.row.interfaceTurnk == true ? '是' : '否'}}
			                            </template>
									</el-table-column>
									<el-table-column label="接口带宽" prop="interfaceBandwidth" show-overflow-tooltip></el-table-column>
									<el-table-column label="对端设备" prop="interfaceEndToEndDeviceName" show-overflow-tooltip></el-table-column>
									<el-table-column label="运维人员" prop="maintenancePersonnelName" show-overflow-tooltip></el-table-column>
									<el-table-column label="接口描述" prop="interfaceDescribe" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--4关联出库单-->
								<el-table v-show="currentPage == 'associatedOutboundList'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="出/入库单编号" prop="number" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库类型" prop="type" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作人" prop="people" show-overflow-tooltip></el-table-column>
									<el-table-column label="所属库房" prop="storeroom" show-overflow-tooltip></el-table-column>
									<el-table-column label="设备总数" prop="equipmentNumber" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库状态" prop="state" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库时间" prop="time" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--5附件信息-->
								<el-table v-show="currentPage == 'attachment'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="名称" prop="originalFileName" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建人" prop="createUser" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-download" title="下载" @click="fileDownload(scope.row.url)"></i>
										</template>
									</el-table-column>
								</el-table>
								<!--6版本信息-->
								<el-table v-show="currentPage == 'version'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="版本号" prop="version" show-overflow-tooltip></el-table-column>
									<el-table-column label="生成时间" prop="createTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作人" prop="createUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-view" title="查看版本" @click="openVersion(scope.row.id)"></i> 
										</template>
									</el-table-column>
								</el-table>
								<!--7生命周期管理-->
								<el-table v-show="currentPage == 'record'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="操作类型" prop="operation" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作时间" prop="createTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核人" prop="auditUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核结果" prop="auditResult" :formatter="statusChange" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核时间" prop="auditTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="备注" prop="auditOpinion" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--8合同信息-->
								<el-table v-show="currentPage == 'contract'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="合同编码" prop="code" show-overflow-tooltip></el-table-column>
									<el-table-column label="合同名称" prop="name" show-overflow-tooltip></el-table-column>
									<el-table-column label="合同类型" prop="type" show-overflow-tooltip></el-table-column>
									<el-table-column label="负责人" prop="personInChargeName" show-overflow-tooltip></el-table-column>
									<el-table-column label="合同状态" prop="contractStatus" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-download" title="下载合同" @click="fileDownload(scope.row.url)"></i>
										</template>
									</el-table-column>
								</el-table>
								<!--9供应商信息-->
								<el-table v-show="currentPage == 'supplier'" :data="tableData" stripe style="width: 100%;">
									<el-table-column width="20"></el-table-column>
									<el-table-column label="供应商名称" prop="name" show-overflow-tooltip></el-table-column>
									<el-table-column label="供应商类型" prop="type" show-overflow-tooltip></el-table-column>
									<el-table-column label="联系人" prop="contacts" show-overflow-tooltip></el-table-column>
									<el-table-column label="联系人电话" prop="phone" show-overflow-tooltip></el-table-column>
									<el-table-column label="联系人电子邮箱" prop="email" show-overflow-tooltip></el-table-column>
								</el-table>
							</div>
							<div class="panel-footer">
								<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page.pageNum" :page-sizes="[10, 20, 30, 40]" 
									:page-size="page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
								</el-pagination>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
				currentPage: 'associated',
				page: {
					assetId: "",
					pageNum: 1,
					pageSize: 10
				},
				total: 0,
				tableData: []
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.init();
			});
		},
		activated() {
			this.$nextTick(this.init);
		},
		methods: {
			changeHeight() {
				this.$parent.$parent.changeScrollbarH++;
			},
			init() {
				this.page.assetId = this.$route.query.id;
				this.query();
			},
			query() {
				if(this.currentPage == "associatedWorkSheet") {
	        		this.$axios.post('/work/order/asset', this.page).then( (res) => {
						if(res.status == 200) {
							this.tableData = res.data.list;
							this.total = res.data.total;
						}
					});
	        	} else if(this.currentPage == "associatedOutboundList") {
	        		this.tableData = [];
	        		this.total = 0;
	        	} else {
	        		var url = "";
	        		this.currentPage == "supplier" ? url="/assets/supplier/relationship/query" : url="/assets/"+this.currentPage+"/query";
					if(url != "") {
						var param = this.$ies.deepCopy(this.page);
						if( this.currentPage == "associated") {
							if(this.$route.query.type == 'apply') {
								param['isApply'] = true;
							} else {
								param['isApply'] = false;
							}
						}
						this.$axios.post(url, param).then( (res) => {
							if(res.status == 200) {
								this.tableData = res.data.list;
								this.total = res.data.total;
							}
						});
					}
	        	}
			},
	        // 查看版本信息
	        openVersion(id) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/versionInfo?id="+id+"&type=version" );
	        },
	        // 审核结果转换
	        statusChange(row, column, cellValue) {
				switch(cellValue) {
					case 2:
						return '审核未通过'; break;
					case 3:
						return '审核通过'; break;
				}
			},
			handleCurrentChange(val) {
				this.page.pageNum = val;
				this.changeHeight();
				this.query();
			},
			handleSizeChange(val) {
				this.page.pageSize = val;
				this.changeHeight();
				this.query();
			},
			// 合同下载、附件下载
	        fileDownload(url) {
	        	window.open(url);
	        }
		}
	}
</script>