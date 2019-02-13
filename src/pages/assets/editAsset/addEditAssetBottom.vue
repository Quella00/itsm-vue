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
							<!--关联资产-->
							<div class="panel-header" v-show="currentPage == 'associated'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('associated')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-button type="normal" icon="el-icon-my-add" @click="openAssociatedAssetDialog('add')">新增</el-button>
								</div>
							</div>
							<!--接口信息-->
							<div class="panel-header" v-show="currentPage == 'interface'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('interface')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-button type="normal" icon="el-icon-my-add" @click="openInterfacesInfoDialog('add')">添加</el-button>
								</div>
							</div>
							<!--关联工单、关联出库单、生命周期管理-->
							<div class="panel-header" v-show="currentPage == 'associatedWorkSheet' || currentPage == 'associatedOutboundList' || currentPage == 'record'">

							</div>
							<!--附件信息-->
							<div class="panel-header" v-show="currentPage == 'attachment'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('attachment')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-upload style='width: 100px;' :action="importUrl" :data="{'createUserId':assetId}" multiple :file-list="fileList" 
										:on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload" :show-file-list="false" :headers="{Token:token}">
  										<el-button type="normal" icon="el-icon-my-upload" style="width: 100px;">上传附件</el-button>
									</el-upload>
								</div>
							</div>
							<!--版本信息-->
							<div class="panel-header" v-show="currentPage == 'version'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('version')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-button type="normal" icon="el-icon-my-save" style="width: 115px;" @click="saveVersionInfo">保存此表单</el-button>
								</div>
							</div>
							<!--合同信息-->
							<div class="panel-header" v-show="currentPage == 'contract'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('contract')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-button type="normal" icon="el-icon-my-upload" style="width: 105px;" @click="openDialog('contract')">上传合同</el-button>
								</div>
							</div>
							<!--供应商信息-->
							<div class="panel-header" v-show="currentPage == 'supplier'">
								<div class="panel-header-left">
									<el-button type="normal" icon="el-icon-my-delete" @click="deleteData('supplier/relationship')">删除</el-button>
								</div>
								<div class="panel-header-right">
									<el-button type="normal" icon="el-icon-my-add" style="width: 115px;" @click="openDialog('supplier')">添加供应商</el-button>
								</div>
							</div>

							<div class="panel-body">
								<!--1关联资产-->
								<el-table v-show="currentPage == 'associated'" :data="tableData" @selection-change="dataSelection" ref="associatedTable" stripe style="width: 100%;">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
									<el-table-column label="源资产配置项" prop="sourceAssetName" show-overflow-tooltip></el-table-column>
									<el-table-column label="关系" prop="relationshipName" show-overflow-tooltip></el-table-column>
									<el-table-column label="目标资产配置项" prop="targetAssetName" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-edit" title="编辑" @click="openAssociatedAssetDialog('edit',scope.row.id)"></i>
										</template>
									</el-table-column>
								</el-table>
								<!--2关联工单-->
								<el-table v-show="currentPage == 'associatedWorkSheet'" :data="tableData" stripe style="width: 100%;">
									<el-table-column align="center" width="20"></el-table-column>
									<el-table-column label="工单编号" prop="code" show-overflow-tooltip></el-table-column>
									<el-table-column label="主题" prop="theme" show-overflow-tooltip></el-table-column>
									<el-table-column label="优先级" prop="priority" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建人" prop="createUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--3接口信息-->
								<el-table v-show="currentPage == 'interface'" ref="interfaceTable" :data="tableData" @selection-change="dataSelection" stripe style="width:100%;">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
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
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-edit" title="编辑" @click="openInterfacesInfoDialog('edit',scope.row.id)"></i>
										</template>
									</el-table-column>
								</el-table>
								<!--4关联出库单-->
								<el-table v-show="currentPage == 'associatedOutboundList'" :data="tableData" stripe style="width: 100%;">
									<el-table-column align="center" width="20"></el-table-column>
									<el-table-column label="出/入库单编号" prop="number" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库类型" prop="type" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作人" prop="people" show-overflow-tooltip></el-table-column>
									<el-table-column label="所属库房" prop="storeroom" show-overflow-tooltip></el-table-column>
									<el-table-column label="设备总数" prop="equipmentNumber" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库状态" prop="state" show-overflow-tooltip></el-table-column>
									<el-table-column label="出/入库时间" prop="time" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--5附件信息-->
								<el-table v-show="currentPage == 'attachment'" :data="tableData" stripe style="width: 100%;" ref="attachment" @selection-change="dataSelection">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
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
								<el-table v-show="currentPage == 'version'" ref="version" @selection-change="dataSelection" :data="tableData" stripe style="width: 100%;">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
									<el-table-column label="版本号" prop="version" show-overflow-tooltip></el-table-column>
									<el-table-column label="生成时间" prop="createTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作人" prop="createUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作" prop="operation">
										<template slot-scope="scope">
											<i class="el-icon-my-view" title="查看表单" @click="openVersion(scope.row.id)"></i> 
										</template>
									</el-table-column>
								</el-table>
								<!--7生命周期管理-->
								<el-table v-show="currentPage == 'record'" :data="tableData" stripe style="width: 100%;">
									<el-table-column align="center" width="20"></el-table-column>
									<el-table-column label="操作类型" prop="operation" show-overflow-tooltip></el-table-column>
									<el-table-column label="操作时间" prop="createTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核人" prop="auditUserName" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核结果" prop="auditResult" :formatter="statusChange" show-overflow-tooltip></el-table-column>
									<el-table-column label="审核时间" prop="auditTime" show-overflow-tooltip></el-table-column>
									<el-table-column label="备注" prop="auditOpinion" show-overflow-tooltip></el-table-column>
								</el-table>
								<!--8合同信息-->
								<el-table v-show="currentPage == 'contract'" :data="tableData" stripe style="width: 100%;" @selection-change="dataSelection" ref="contract">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
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
								<el-table v-show="currentPage == 'supplier'" :data="tableData" stripe style="width: 100%;" @selection-change="dataSelection" ref="supplier">
									<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
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
		props: [ 'topData'],
		data() {
			return {
				assetId: '',
				currentPage: 'associated',	// 当前所在tab页
				page: {
					pageNum: 1,
					pageSize: 10,
					assetId: ''
				},
				total: 0,
				fieldName: ['classificationName','regionOfAffiliationName','buildingName','machineRoomName','cabinetName',
						'maintenancePersonnelName','originalUserName','userName','ownerName','maintainerName','firstResponsiblePersonName',
						'secondResponsiblePersonName','informationMaintenanceStaffName',''],
				tableData: [],
				selected: [],
				// 附件信息上传——————————
				loding: null,
				fileList: [],
				importUrl: `api/zuul/files/uploadFileReturnIdAndNameAndPath`,
				token: this.$store.state.user.info ? this.$store.state.user.info.token : ''
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
				this.assetId = this.$route.query.id;
				this.page.assetId = this.$route.query.id;
				this.query();
			},
	        query() {
	        	if(this.currentPage == "associatedWorkSheet") {
	        		// 关联工单
        			this.$axios.post('/work/order/asset', this.page).then( (res) => {
						if(res.status == 200) {
							this.tableData = res.data.list;
							this.total = res.data.total;
						}
					});
	        	} else if(this.currentPage == "associatedOutboundList") {
	        		// 关联出库单
	        		this.tableData = [];
	        		this.total = 0;
	        	} else {
	        		var url = "";
	        		this.currentPage == "supplier" ? url="/assets/supplier/relationship/query" : url="/assets/"+this.currentPage+"/query";
	        		if(url != "") {
	        			var param = this.$ies.deepCopy(this.page);
	        			if(this.currentPage == "associated") {
	        				param['isApply'] = false;
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
			handleCurrentChange(v) {
				this.page.pageNum = v;
				this.changeHeight();
				console.log(this.$parent.$parent.changeH);
				this.query();
			},
			handleSizeChange(v) {
				this.page.pageSize = v;
				this.changeHeight();
				this.query();
			},
			// 表格选取数据
			dataSelection(v) {
				this.selected = v.map(v => v.id);
			},
			// 删除
			deleteData(delUrl, paramName) {
				const self = this;
				if(self.selected.length <= 0) {
					this.$message({ message: '请至少选择一条数据！', type: 'warning' });
					return;
				}
				self.$confirm('确定删除数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
					var url = "/assets/" + delUrl + "/batchDelete";
					var param = null;
					if(delUrl == "attachment") {
						param = { attachmentIdList: self.selected.toString() }
					} else if(delUrl == "version") {
						param = { versionIdList: self.selected.toString() }
					} else if(delUrl == "contract") {
						param = { contractRelIdList: self.selected.toString() }
					} else {
						param = { idList: self.selected.toString() }
					}
					self.$axios.post(url, param ).then( (res) => {
						if(res.status == 200 && res.data) {
							self.query();
							self.$message({ type: 'success', message: '删除成功!' });
							self.selected.length = 0;
						} else {
							self.$message({ type: 'warning', message: '删除失败' });
						}
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消操作' });
				});
			},
			// 关联资产:新增、编辑
			openAssociatedAssetDialog(type,data) {
				this.$parent.$parent.openAssociatedAssetDialog(type,data);
			},
	        // 接口信息:新增、编辑
	        openInterfacesInfoDialog(type,data) {
	        	this.$parent.$parent.openInterfacesInfoDialog(type,data);
			},
			// 合同信息、供应商信息弹窗
			openDialog(data) {
				this.$parent.$parent.openDialog(data);
			},
	        // 附件信息:上传
	        // 判断上传文件类型
			isFile(name) {
	        	var suffixArr = ".txt,.doc,.docx,.xlsx,.xls,.ppt,.pptx,.png,.gif,.jpg,.rar,.zip.pdf";
	        	return suffixArr.indexOf(name.substring(name.lastIndexOf('.')));
			},
	        handleSuccess(res, file, fileList) {
                this.$nextTick(() => {
					this.loading.close();
				});
				if(res.status == 200){
					this.$message({ type: 'success', message: '上传成功!' });
					this.savePath(res.data.id,res.data.name);
				}else{
					this.$message({ message: res.message, type: 'error' });
				}
	        },
	        savePath(id,name) {
      			this.$axios.post('/assets/attachment/upload',{
      				fileId: id,
      				fileName: name,
      				assetId: this.assetId
      			}).then( (res) => {
					if(res.status == 200) {
						this.query();
					} else {
						console.log("error");
					}
				});
      		},
	        handleError() {
	        	this.$message({ type: 'error', message: '上传失败!' });
	        },
	        beforeUpload(file) {
	        	if(file.size > 52428800) {
	        		this.$message({ type: 'warning', message: '文件大小不能超过50M!' });
	        		return false;
	        	} else {
	        		if(this.isFile(file.name) >= 0) {
	        			this.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						});
		        		return true;
		        	} else {
		        		this.$message({ type: 'warning', message: '上传文件格式错误' });
		        		return false;
		        	}
	        	}
	        },
	        // 版本信息:保存此表单
	        saveVersionInfo() {
	        	const self = this;
	        	// 验证表单部分
	        	this.$parent.$parent.validateTop();
	        	
	        	setTimeout(function(){
		        	if(self.topData == null) {
						self.$message({ type: 'warning', message: '表单输入有误，请检查' });
						return;
					}
		        	// 整改传入参数
		        	var param = self.topData;
					for(var item in param) {
						if(param[item] == "" || param[item] == null) {
							delete param[item];
						}
					}
					self.fieldName.forEach(function(item) {
						delete param[item];
					});
		        	param['assetId'] = self.assetId;
		        	// 请求接口
		        	self.$axios.post('/assets/version/generate', param).then( (res) => {
						if(res.status == 200) {
							self.$message({ type: 'success', message: '保存此表单成功' });
							self.query();
						} else {
							self.$message({ type: 'error', message: '保存此表单失败' });
						}
					});
				});	
	        },
	        // 版本信息:查看版本
	        openVersion(id) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/versionInfo?id="+id+"&type=version" );
	        },
	        // 生命周期管理:审核结果转换
	        statusChange(row, column, cellValue) {
				switch(cellValue) {
					case 2:
						return '审核未通过'; break;
					case 3:
						return '审核通过'; break;
				}
			},
	        // 合同下载、附件下载
	        fileDownload(url) {
	        	window.open(url);
	        }
		}
	}
</script>