<!--审计日志-->
<template>
	<div class="itsm-tabs-main audit-log">
		<div class="tabs-main">
			<div class="tabs-panel-wrap border">
				<div class="panel-header">
					查询条件
				</div>
				<div class="panel-body query-area" style="min-height: 130px;">
					<el-form label-width="130px" :model="ruleForm" :rules="rules" ref="ruleForm" :inline="true" class="search-conditions" style="margin: 40px 0 20px 0;">
						<el-form-item label="登录ID：" prop="createUser" class="field">
							<el-input v-model="ruleForm.createUser" placeholder="请输入登录ID"></el-input>
						</el-form-item>
						
						<el-form-item label="操作模块：" prop="parentModuleName" class="field">
							<el-input readonly v-model="ruleForm.parentModuleName" placeholder="请选择操作模块" @focus="selectOnFocus"></el-input>
							<i class="el-icon-my-more" @click="openDialog"></i>
						</el-form-item>
						
						<el-form-item label="操作类型：" prop="operationType" class="field">
							<el-select v-model="ruleForm.operationType" placeholder="" @focus="selectOnFocus">
								<el-option v-for="item in operationType" :key="item.value" :value="item.value" :label="item.label" placeholder="请选择操作类型"></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="操作时间：" prop="dateTime">
							<el-date-picker v-model="ruleForm.dateTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :editable="false"></el-date-picker>
						</el-form-item>
					</el-form>
				</div>
			</div>
			<div class="tabs-panel-wrap border" v-autoHeight>
				<div class="panel-header">
					<div class="panel-header-left">
						<el-button type="normal" icon="el-icon-my-export" @click="exportData">导出</el-button>
					</div>
					<div class="panel-header-right">
						<el-button type="normal" icon="el-icon-my-search" @click="search">查询</el-button>
						<el-button type="normal" icon="el-icon-my-reset" @click="empty">重置</el-button>
					</div>
				</div>
				<div class="panel-body">
					<el-table ref="configTable" :data="configTable.data" @selection-change="handleSelectionChange" :fit="true" stripe  style="width: 100%;">
						<el-table-column type="selection" align="center"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createUser" label="登录ID"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createUserId" label="姓名"></el-table-column>
						<el-table-column show-overflow-tooltip prop="ip" label="登录IP"></el-table-column>
						<el-table-column show-overflow-tooltip prop="createTime" label="操作时间"></el-table-column>
						<el-table-column show-overflow-tooltip prop="resourceName" label="操作模块"></el-table-column>
						<el-table-column show-overflow-tooltip prop="operationType" label="操作类型"></el-table-column>
					</el-table>
				</div>
				<div class="panel-footer">
					<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="configTable.page.pageNum" :page-sizes="[10, 20, 30, 40]" 
						:page-size="configTable.page.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total">
					</el-pagination>
				</div>
			</div>
		</div>
		
		<el-dialog title="选择操作模块" :visible.sync="dialog.show" v-if="dialog.show" width="450px" custom-class="select-dialog" :close-on-click-modal='false' @close="dialogSave" v-drag>
			<div class="select-dialog-content">
				<ies-scrollbar class="ies-scrollbar">
                    <div v-changeTreeH="'changeTreeH'">
						<el-tree :props="dialog.defaultProps" :render-content="renderContent" :data="dialog.data" :default-expanded-keys="dialog.defaultExpanded" 
							node-key="id" :expand-on-click-node="false"></el-tree>
					</div>
                </ies-scrollbar>
            </div>
			<div slot="footer">
				<el-button type="normal" @click="dialogSave('save')">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: 'auditLog',
		data() {
			return {
				// 查询条件 -> 操作模块
				dialog: {
					show: false,
					data: [],
					selectId: '',
					defaultSelect: '',		// 选中ID
					selectNode: null,		// 选中节点
					defaultExpanded: [],	// 展开
					defaultProps: {
						isLeaf: function(data, node) {
							return data.parentFlag == true ? false : true;
						},
						label: 'resourceName'
					}
				},
				// 查询条件 -> 操作类型
				operationType : [
					{ value: '', label: '请选择' },
					{ value: '登录', label: '登录' }, 
					{ value: '创建工单', label: '创建工单' }, 
					{ value: '修改密码', label: '修改密码' }, 
					{ value: '退出登录', label: '退出登录' }, 
					{ value: '新增', label: '新增' }, 
					{ value: '编辑', label: '编辑' }, 
					{ value: '删除', label: '删除' }, 
					{ value: '禁用', label: '禁用' },
					{ value: '启用', label: '启用' },
					{ value: '下载（生成二维码）', label: '下载（生成二维码）' },
					{ value: '导入', label: '导入' },
					{ value: '导出', label: '导出' },
					{ value: '隐藏', label: '隐藏' },
					{ value: '排序', label: '排序' },
					{ value: '提交审核', label: '提交审核' },
					{ value: '审核', label: '审核' },
					{ value: '忽略', label: '忽略' },
					{ value: '转资产', label: '转资产' },
					{ value: '转知识', label: '转知识' },
					{ value: '保存', label: '保存' },
					{ value: '重置密码', label: '重置密码' },
					{ value: '强制下线', label: '强制下线' }
				],
				// 查询条件
				ruleForm: {
					createUser: '',				// 登录ID
					parentModuleName: '',		// 操作模块
					menuId:'',                  // 操作模块id
					treeNumber:'',              // 层级
					operationType: '',					// 操作类型
					dateTime: []
				},
				searchConditions: {
					createUser: '',				// 登录ID
					parentModuleName: '',		// 操作模块
					menuId:'',                  // 操作模块id
					treeNumber:'',              // 层级
					operationType: '',					// 操作类型
					startTime: '',
					endTime: ''
				},
				rules: {},
				// 数据列表配置
				configTable: {
					selected: [],
					data: [],
					total: 0,			// 总条数
					page: {
						pageNum: 1,		// 当前页
						pageSize: 10	// 每页显示条数
					}
				},
				token: this.$store.state.user.info ? this.$store.state.user.info.token : ''
			};
		},
		mounted() {
			this.$nextTick( ()=>{
				$('.el-range-input').on('focus',function(e){
					 e.target.blur();
				});
				this.queryData();
			});
		},
		methods: {
			selectOnFocus(e) {
				e.target.blur();
			},
			// 表格数据
			queryData() {
				var param = {
					pageNum: this.configTable.page.pageNum,
					pageSize: this.configTable.page.pageSize,
					createUser: this.searchConditions.createUser,
					menuId: this.searchConditions.menuId,
					treeNumber: this.searchConditions.treeNumber,
					operationType: this.searchConditions.operationType,
					startTime: this.searchConditions.startTime,
					endTime: this.searchConditions.endTime,
				}
				this.$axios.post('/system/auditLog/query', param ).then( (res) => {
					if(res.status == 200 && res.data.list){
						this.configTable.total = res.data.total;
						this.configTable.data = res.data.list;
					} else {
						this.$message({ message: res.message, type: 'error' });
					}
					
				});
			},
			// pageSize 改变时会触发
			handleSizeChange(v) {
				this.configTable.page.pageSize = v;
				this.queryData();
			},
			// currentPage 改变时会触发
			handleCurrentChange(v) {
				this.configTable.page.pageNum = v;
				this.queryData();
			},
			// 表格选中数据
			handleSelectionChange(v) {
				this.configTable.selected = v.map(v => v.id);
			},
			// 导出
			exportData() {
				if(this.configTable.selected.length <= 0) {
					this.$message({ message: '请至少选择一条数据！', type: 'warning' });
					return;
				}
				
				window.open(`api/system/auditLog/export?auditLogIdList=${this.configTable.selected.join()}&Token=${this.token}`);
//				window.open("http://192.168.3.23:9160/system/auditLog/export?auditLogIdList="+this.configTable.selected.join()+"&Token="+this.token);
			},
			// 重置
			empty() {
				this.dialog.selectNode = null;
				this.dialog.defaultSelect = '';
				this.dialog.selectId = '';
				this.ruleForm.dateTime = [];
				this.ruleForm.menuId = '';
				this.ruleForm.treeNumber = '';
				this.searchConditions.menuId = '';
				this.searchConditions.treeNumber = '';
				this.dialog.defaultExpanded = [];
				this.$refs['ruleForm'].resetFields();
			},
			// 获取操作模块
			queryModuleName() {
				this.$axios.post('/itsm/system/permission/resource/queryResourceByAll',{usability:''}).then( (res) => {
					if(res.status == 200) {
						this.dialog.data = [ { resourceName: '操作模块', children: res.data.top } ];
						this.$nextTick(function() { 
	                        if(this.dialog.defaultSelect) {
	                            this.dialog.defaultExpanded.push(this.dialog.defaultSelect);
	                            this.dialog.selectId = this.dialog.defaultSelect;
	                        }
	                    });
                    }else{
                        this.$message(res.message);
                    }
				});
			},
			// 打开弹窗
			openDialog() {
				this.queryModuleName();
				this.dialog.show = true;
			},
			// 渲染节点
			renderContent(h, { node, data, store }) {
				const self = this;
				var nodeObj = [
					h('el-radio', {
	                        attrs: { value: self.dialog.selectId+'', label: data.id+'' },
	                        on: { input: (v) => { self.dialog.selectId = v; self.dialog.selectNode = node;} }
						},
						''
					),
					h('i', {
							style: { 'color': '#ffba72', 'margin-right': '8px' },
							class: node.childNodes.length ? 'el-icon-my-file' : 'el-icon-my-text'
						},
						''
					),
					h('span', null, node.label)
				];
				if(node.label == '操作模块') {
					nodeObj.splice(0,1);
				}
				return h('span', null, nodeObj);
			},
			// 弹出框 确定
			dialogSave(type) {
				if(type == 'save') {
					if(this.dialog.selectNode != null) {
						this.dialog.defaultSelect = this.dialog.selectNode.data.id;
						this.ruleForm.parentModuleName = this.dialog.selectNode.data.resourceName;
						this.ruleForm.menuId = this.dialog.selectNode.data.id;
						this.ruleForm.treeNumber = this.dialog.selectNode.level - 1;
					}
				}
				this.dialog.show = false;
			},
			// 查询
			search() {
				this.configTable.page.pageNum = 1;
				this.searchConditions.createUser = this.ruleForm.createUser;
				this.searchConditions.menuId = this.ruleForm.menuId;
				this.searchConditions.treeNumber = this.ruleForm.treeNumber;
				this.searchConditions.operationType = this.ruleForm.operationType;
				this.searchConditions.startTime = (this.ruleForm.dateTime && this.ruleForm.dateTime.length > 0) ? this.ruleForm.dateTime[0] : '';
				this.searchConditions.endTime = (this.ruleForm.dateTime && this.ruleForm.dateTime.length > 0) ? this.ruleForm.dateTime[1] : '';
				this.queryData();
			}
		}
	}
</script>

<style lang="less">
	.audit-log {
		.query-area .field .el-input__inner {
			width: 200px;
		}
		.el-icon-time, .el-range-separator, .el-range__close-icon{
			line-height: 1;
		}
		.select-dialog {
			height: 400px;
			.select-dialog-content {
				height: 300px; padding-top: 30px; padding-left: 20px; overflow: auto;
				.el-tree>.el-tree-node {
			        >.el-tree-node__content>span>.el-radio {
			            display: inline-block;
			        }
			    }
			}
		}
		.search-conditions {
			.el-form-item__content {
				height:27px;
			}
		}
	}
</style>