<!-- 资产管理 -->
<template>
	<div class="itsm-tabs-main asset-index">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body" style="min-height: 150px;">
					<el-form label-width="130px" :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" style="margin-top: 15px;" class="asset-query">
						<el-form-item label="资产编码：" prop="code">
							<el-input v-model="ruleForm.code" placeholder="请输入资产编码"></el-input>
						</el-form-item>
						
						<el-form-item label="资产名称：" prop="name">
							<el-input v-model="ruleForm.name" placeholder="请输入资产名称"></el-input>
						</el-form-item>
						
						<el-form-item label="资产分类：" prop="classificationName">
							<el-input readonly v-model="classificationName" placeholder="请选择资产分类" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="assetDialog.show = true"></i>
						</el-form-item>
						
						<el-form-item label="审核状态：" prop="auditStatus">
							<el-select v-model="ruleForm.auditStatus" placeholder="请选择审核状态" @focus="selectOnFocus">
								<el-option label="请选择" value=""></el-option>
								<el-option label="审核通过" value="3"></el-option>
								<el-option label="审核未通过" value="2"></el-option>
								<el-option label="未提交审核" value="1"></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="所属区域：" prop="regionOfAffiliationName">
							<el-input readonly v-model="regionOfAffiliationName" placeholder="请选择所属区域" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="areaDialog.show = true"></i>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-import" @click="openUploadDialog">导入</el-button>
						<el-button type="normal" icon="el-icon-my-download" style="width:130px;" @click="downloadImportTemplate">下载导入模板</el-button>
						<el-button type="normal" icon="el-icon-my-export" @click="exportData">导出</el-button>
						<el-button type="normal" icon="el-icon-my-delete" @click="deleteData">删除</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-reset" @click="resetForm">重置</el-button>
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-circleAdd" @click="addAsset">新增</el-button>
					</div>
				</div>
				<div class="panel-body tableWrap">
					<el-table :data="assetTable.data" @selection-change="handleSelectionChange" stripe :fit="true" ref="assetTable" style="width: 100%;">
						<el-table-column prop="check" label="" type="selection" align="center"></el-table-column>
						<el-table-column label="资产编码" show-overflow-tooltip prop="code"></el-table-column>
						<el-table-column label="资产名称" show-overflow-tooltip prop="name"></el-table-column>
						<el-table-column label="资产分类" show-overflow-tooltip prop="classificationName"></el-table-column>
						<el-table-column label="审核状态" show-overflow-tooltip prop="auditStatus" :formatter="statusChange"></el-table-column>
						<el-table-column label="使用人" show-overflow-tooltip prop="userName"></el-table-column>
						<el-table-column label="新建时间" show-overflow-tooltip prop="createTime">{{assetTable.data.id}}</el-table-column>
						<el-table-column label="操作" prop="operation">
							<template slot-scope="scope">
								<i class="el-icon-my-edit" title="编辑" @click="editAsset(scope.row.id,scope.row.name)"></i> 
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="assetTable.page.pageNum" :page-sizes="[10, 20, 30, 40]" 
						:page-size="assetTable.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="assetTable.total">
					</el-pagination>
				</div>
			</div>

			<!-- 所属区域弹窗 -->
        	<iesAreaDialog v-model="areaDialog.show" v-if="areaDialog.show" @areaChooseHandler="areaChooseHandler" :defaultSelect='areaDialog.selectId'></iesAreaDialog>
			<!-- 资产分类弹窗 -->
        	<iesAssetDialog v-model="assetDialog.show" v-if="assetDialog.show" @assetChooseHandler="assetChooseHandler" :defaultSelect='assetDialog.selectId' type="search"></iesAssetDialog>
			<!-- 导入弹窗 -->
			<el-dialog title="导入" :visible="uploadDialog.show" custom-class="upload" :close-on-click-modal='false' @close="closeDialog" v-drag>
				<div class="upload-content">
					<div class="upload-container">
						<div class="input-box">
							<span>上传文件 :  </span>
							<el-input style="display: inline-block;" readonly v-model="uploadDialog.fileName" @focus="selectOnFocus" placeholder="请选择上传的文件"></el-input>
						</div>
						<el-upload ref="upload" :action="uploadDialog.importUrl" :file-list="uploadDialog.fileList" class="upload-btn" :auto-upload="false" multiple
							:show-file-list="false" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleError" :before-upload="beforeUpload" :headers="{Token:token}">
							<el-button type="normal" slot="trigger" @click="closeMessage">选取文件</el-button>
						</el-upload>
					</div>
				</div>
				<div slot="footer">
					<el-button type="normal" @click="submitUpload">保存</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'assetManagement',
		data() {
			return {
				ruleForm: {
					code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					auditStatus: "", 			// 审核状态
					regionOfAffiliation: "", 	// 所属区域
				},
				searchConditions: {
					code: "", 					// 资产编码
					name: "", 					// 资产名称
					classification: "", 		// 资产分类
					auditStatus: "", 			// 审核状态
					regionOfAffiliation: "", 	// 所属区域
				},
				classificationName: "", 		// 资产分类~名称
				regionOfAffiliationName: "", 	// 所属区域~名称
				rules: {},
				// 列表数据
				assetTable: {
					selected: [], 				// 选中的 id 集合
					data: [],					// 数据源
					total: 0,					// 总条数
					page: {
						pageNum: 1,
						pageSize: 10
					}
				},
				// 所属区域弹窗
				areaDialog: {
					show: false,
					selectId: ''
				},
				// 资产分类弹窗
				assetDialog: {
					show: false,
					selectId: ''
				},
				// 导入弹窗
				uploadDialog: {
					show: false,
					fileName: "",
					fileList: [],
					importUrl: `api/assets/management/import`,
					loading: null,
					message:'',// 导入错误信息提示
				},
				token: this.$store.state.user.info ? this.$store.state.user.info.token : '',
			};
		},
		mounted() {
			this.$nextTick(function() {
				this.queryData();
			});
		},
		activated() {
			this.$nextTick(this.queryData);
//			this.queryData();
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			queryData() {
				var param = {
					needApprove: 0,
					pageNum: this.assetTable.page.pageNum,
					pageSize: this.assetTable.page.pageSize,
					code: this.searchConditions.code,
					name: this.searchConditions.name,
					classification: this.searchConditions.classification,
					auditStatus: this.searchConditions.auditStatus,
					regionOfAffiliation: this.searchConditions.regionOfAffiliation,
				}
				this.$axios.post('/assets/management/query',param).then( (res) => {
					if(res.status == 200) {
						if(res.data.list == null) {
							this.assetTable.data = [];
							this.assetTable.total = 0;
						} else {
							this.assetTable.data = res.data.list;
							this.assetTable.total = res.data.total;
						}
					}
				});
			},
			// 审核状态转换
			statusChange(row, column, cellValue) {
				switch(cellValue) {
					case 1:
						return '未提交审核'; break;
					case 2:
						return '审核未通过'; break;
					case 3:
						return '审核通过'; break;
				}
			},
			handleSizeChange(val) {
				this.assetTable.page.pageSize = val;
				this.queryData();
			},
			handleCurrentChange(val) {
				this.assetTable.page.pageNum = val;
				this.queryData();
			},
			handleSelectionChange(v) {
				this.assetTable.selected = v.map(v => v.id);
			},
			// 重置查询条件
			resetForm() {
				this.areaDialog.selectId = '';
				this.assetDialog.selectId = '';
				this.ruleForm.classification = "";
				this.classificationName = "";
				this.ruleForm.regionOfAffiliation = "";
				this.regionOfAffiliationName = "";
				this.$refs['ruleForm'].resetFields();
			},
			// 查询
			search() {
				this.assetTable.page.pageNum = 1;
				this.searchConditions.code = this.ruleForm.code;
				this.searchConditions.name = this.ruleForm.name;
				this.searchConditions.classification = this.ruleForm.classification;
				this.searchConditions.auditStatus = this.ruleForm.auditStatus;
				this.searchConditions.regionOfAffiliation = this.ruleForm.regionOfAffiliation;
				this.queryData();
			},
			// 所属区域
			areaChooseHandler(node) {
	            if(node) {
	                this.areaDialog.selectId = node.id;
	                this.regionOfAffiliationName = node.areaName;
	                this.ruleForm.regionOfAffiliation = node.id;
	            } else {
	            	this.areaDialog.selectId = '';
	                this.regionOfAffiliationName = '';
	                this.ruleForm.regionOfAffiliation = '';
	            }
	        },
	        // 资产分类
	        assetChooseHandler(node) {
	        	if(node) {
	                this.assetDialog.selectId = node.id;
	                this.classificationName = node.categoryName;
	                this.ruleForm.classification = node.id;
	           	} else {
	           		this.assetDialog.selectId = '';
	                this.classificationName = '';
	                this.ruleForm.classification = '';
	           	}
	        },
			// 下载导入模板
			downloadImportTemplate() {
				window.open(`api/assets/management/downloadTemplate?Token=${this.token}`);
			},
			// 导出
			exportData() {
				if(this.assetTable.selected.length <= 0) {
					this.$message({ message: '请至少选择一条数据！', type: 'warning' });
					return;
				}
				window.open(`api/assets/management/export?idList=${this.assetTable.selected.join()}&Token=${this.token}`);
			},
			// 删除
			deleteData() {
				const self = this;
				if(self.assetTable.selected.length <= 0) {
					this.$message({ message: '请至少选择一条数据！', type: 'warning' });
					return;
				}
				self.$confirm('确定删除数据？', '提示', { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }).then(() => {
					self.$axios.post('/assets/management/batchDelete', {idList:self.assetTable.selected.toString()} ).then( (res) => {
						if(res.status == 200 && res.data) {
							self.queryData();
							self.$message({ type: 'success', message: '已提交删除申请' });
							self.assetTable.selected.length = 0;
							self.$refs.assetTable.clearSelection();
						} else {
							self.$message({ type: 'warning', message: '提交删除申请失败' });
						}
					});
				}).catch(() => {
					self.$message({ type: 'info', message: '已取消操作' });
				});
			},
			// 新增资产
			addAsset() {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/addAsset" );
			},
			// 编辑资产
			editAsset(id,name) {
				this.$ies.dispatch(this, 'layout').$refs.sidebar.openPage( "/editAsset?id="+id );
			},
			// 导入弹窗-----------
			openUploadDialog() {
				this.uploadDialog.fileName = '';
				this.uploadDialog.show = true;
			},
	        handleSuccess(res, file, fileList) {
	        	const self = this;
	        	this.$nextTick(() => {
					this.uploadDialog.loading.close();
				});
				if(res.status == 200) {
					if(res.message) {
						var message = res.data > 0 ? '成功导入'+ res.data +'条数据' : '';
						for(var i in res.message){
			            	message += '<br/>第'+ i +'行导入数据不规范:';
			            	for(var j = 0;j < res.message[i].length; j++){
			            		message += res.message[i][j]+';';
			            	}
			           }
						this.uploadDialog.message = this.$message({
						 	type:'error',
				          	showClose: true,
				          	message: message,
				          	duration:0,
				          	dangerouslyUseHTMLString:true,
				          	customClass:'upload-message',
				          	onClose:function(){
				          		self.uploadDialog.fileName = '';
				          	}
					    });
					} else {
						this.$message({ message: "成功导入"+ res.data +'条数据', type: 'success' });
						this.uploadDialog.show = false;
						this.assetTable.page.pageNum = 1;
						this.queryData();
					}
				}else {
					this.$message({ message: res.message, type: 'error' });
				}
	        },
	        handleError(err, file, fileList) {
	        	this.$message.error(err.message);
	        	this.uploadDialog.loading.close();
	        },
	        beforeUpload(file) {
	        	const self = this;
				var index = file.name.lastIndexOf('.'), format = file.name.substring(index+1),flag = true;
				if(['xlsx','xls'].indexOf(format)==-1) {
					self.$message.error('导入文件只能是 xls或者xlsx格式!');
					self.uploadDialog.fileName = '';
					flag = false;
				}
		        if(flag) {
		        	if(file.size > 52428800) {
		        		this.$message({ type: 'error', message: '文件大小不能超过50M!' });
		        		return false;
		        	} else {
		        		this.uploadDialog.loading = this.$loading({
							lock: true,
							text: 'Loading',
							spinner: 'el-icon-loading',
							background: 'rgba(255, 255, 255, 0.5)'
						});
		        		return true;
		        	}
		        } else {
		        	return flag;
		        }
	        },
	        handleChange(file,fileList) {
	        	this.uploadDialog.fileName = file.name;
	        },
			submitUpload() {
				if(!this.uploadDialog.fileName) {				
					this.$message.error('请选择上传的文件');
					return;
				}
				this.$refs.upload.submit();
			},
			// 关闭弹窗
			closeDialog(){
				this.uploadDialog.show = false;
				if(this.uploadDialog.message) {
					this.uploadDialog.message.close();
				}
				//this.queryData();
			},
			// 关闭提示信息弹窗
        	closeMessage(){
        		if(this.uploadDialog.message){
        			this.uploadDialog.message.close();
        		}
        	},
		}
	}
</script>
<style lang="less">
	
</style>