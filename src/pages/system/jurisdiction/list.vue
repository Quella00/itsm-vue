<template>
	<div class="itsm-tabs-main jurisdiction-list-page">	
        <div class="tabs-main">
            <div class="tabs-panel-wrap border query-area" style="display:none;">
                <div class="panel-header">查询条件</div>
                
                <div class="panel-body main">
                    <el-form :inline="true" :model="configForm.ruleForm" ref="ruleForm" class="reset-form">
                        <el-form-item label="资源名称：">
							<el-input type="text" v-model="configForm.ruleForm.resourceName" placeholder="请输入资源名称" auto-complete="off" class="reset-width" ></el-input>
						</el-form-item>
                        
                        <el-form-item label="所属顶节点名称：">
							<el-input type="text" v-model="configForm.ruleForm.topResourceName" placeholder="请输入所属顶节点名称" auto-complete="off" class="reset-width" ></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="tabs-panel-wrap border" v-autoHeight>
                <div class="panel-header">
                    <div class="fl" style="display: none;">
                        <el-button type="normal" icon="el-icon-my-delete" @click="deleteTableData">删除</el-button>
                    </div>

                    <div class="fr" style="display: none;">
                        <el-button type="normal" icon="el-icon-my-search" @click="queryTableData">查询</el-button>
                        <el-button type="normal" icon="el-icon-my-circleAdd" @click="tableAddEdit()">新增</el-button>
                    </div>
                </div>

                <div class="panel-body">
                    <el-table :data="configTable.data" @selection-change="changeSelection" stripe>
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="resourceName" label="资源名称"></el-table-column>
                        <el-table-column prop="imageUrl" label="图标地址"></el-table-column>
                        <el-table-column prop="resourceRequestUrl" label="权限Url" width="180"></el-table-column>
                        <el-table-column prop="moduleDefaultUrl" label="默认url"></el-table-column>
                        <el-table-column prop="moduleReservedUrl" label="预留url"></el-table-column>
                        <el-table-column prop="topResourceName" label="所属菜单(顶节点)"></el-table-column>
                        <el-table-column prop="resourcePermission" label="初始权限配置"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-my-edit" @click="tableAddEdit(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <div class="panel-footer">
                	<el-pagination @size-change="changeTableSize" @current-change="changeTableCurrent" :current-page="configTable.params.pageNum" :page-size="configTable.params.pageSize" :page-sizes="configTable.pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="configTable.total"></el-pagination>
                </div>
            </div>
	    </div>

        <!-- 新增 / 编辑 -->
        <el-dialog :title="configSaveEdit.title" :visible.sync="configSaveEdit.show" @close="closeDialog" width="800px" custom-class="dialog" :close-on-click-modal="false" v-drag>
            <div class="con">
                <el-form :inline="true" :model="configSaveEdit.params" :rules="configSaveEdit.rules" ref="saveForm" class="resetForm">
                    <el-form-item label="资源名称：" prop="resourceName">
                        <el-input type="text" v-model="configSaveEdit.params.resourceName" placeholder="请输入资源名称" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="图标地址：" prop="imageUrl">
                        <el-input type="text" v-model="configSaveEdit.params.imageUrl" placeholder="请输入图标地址" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="初始权限配置：" prop="resourcePermission">
                        <el-input type="text" v-model="configSaveEdit.params.resourcePermission" placeholder="请输入初始权限配置" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="权限Url：" prop="resourceRequestUrl">
                        <el-input type="text" v-model="configSaveEdit.params.resourceRequestUrl" placeholder="请输入类映射URL[加/**结尾通配]" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="默认Url：" prop="moduleDefaultUrl">
                        <el-input type="text" v-model="configSaveEdit.params.moduleDefaultUrl" placeholder="请输入默认Url" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="预留Url：" prop="moduleReservedUrl">
                        <el-input type="text" v-model="configSaveEdit.params.moduleReservedUrl" placeholder="请输入预留Url" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>

                    <el-form-item label="所属菜单：" prop="topResourceName">
                        <el-input type="text" v-model="configSaveEdit.params.topResourceName" placeholder="请输入所属菜单" auto-complete="off" class="reset-width" ></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div slot="footer">
                <el-button type="normal" @click="submit">确定</el-button>
            </div>
        </el-dialog>
        <!--</template>-->
    </div>
</template>

<script>
export default {
	data () {
        let validator = this.$ies.validator;
		return {
            // 搜索表单配置
            configForm: {
                ruleForm: {
                    resourceName: '',      // 资源名称
					topResourceName: ''    // 所属顶节点名称
                }
            }, 
            // 字段类型下拉配置
            configTypeDropDown: [
                { label: '全部', value: '' },
                { label: '文本框(小)', value: '1_文本框(小)' },
                { label: '文本框(大)', value: '2_文本框(大)' },
                { label: '文本域', value: '3_文本域' },
                { label: '数值框', value: '4_数值框' },
                { label: '下拉单选列表', value: '5_下拉单选列表' },
                { label: '下拉复选列表', value: '6_下拉复选列表' }
            ],
			// 列表数据配置
			configTable: {
                url: '/itsm/system/permission/initPermission/queryPermissionByPage',
                //urlDel: '/ahies/autoform/field/delField',
				data: [],
				selected: [],
				total: 0,
				pageSizes: [10, 20, 30, 40],
				params: {
                    pageNum: 1,     // 当前页
					pageSize: 10    // 每页数量
                }
            },
            
            // 新增 / 编辑字段配置
            configSaveEdit: {
                show: false,
                conShow: false,
                title: '',
                urlSave: '/ahies/autoform/field/save',
                urlEdit: '/itsm/system/permission/initPermission/updatePermission',
                params: {
                    id: '',                    // 资源id
                    resourceName: '',          // 资源名称
                    imageUrl: '',              // 图标地址
                    resourcePermission: '',    // 初始权限配置
                    resourceRequestUrl: '',    // 权限Url
                    moduleDefaultUrl: '',      // 默认Url
                    moduleReservedUrl: '',     // 预留Url
                    topResourceName: ''        // 所属菜单（顶节点）
                },
                rules: {
                    fieldTypeChina: [
                        { required: true, message: '请选择字段类型', trigger: 'change' }
                    ]
                }
            }
		};
	},
	mounted() {	
		this.$nextTick(this.init);
	},
	methods: {
		init() {
			this.getTableData();
		},
		// 获取表格列表数据
		getTableData() {
            const self = this;

			self.$axios.post(self.configTable.url, self.configTable.params).then((res) => {
				if(res.status == 200) {
					self.configTable.data = res.data ? res.data.list : [];
					self.configTable.total = res.data ? res.data.total : 0;
				}
            });
		},
		// 查询表格列表数据
		queryTableData() {
            const self = this;

            Object.assign(self.configTable.params, self.configForm.ruleForm);
            self.configTable.params.pageNum = 1;

			self.getTableData();
		},
		// 删除表格选中数据
		deleteTableData() {
            const self = this;

            return;

			if(!self.configTable.selected.length) {
                self.$message({ type: 'warning', message: '至少选择一条数据' });
				return;
			}
			
			self.$confirm('请确认是否要删除该信息？','提示',{
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then( ()=>{
				self.$axios.post(self.configTable.urlDel, { ids: self.configTable.selected.join() }).then((res) => {
					if(res.status == 200) {
						self.configTable.selected = [];
						self.getTableData();
                    }
                    
                    self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
				});
			}).catch(() => {
				self.$message({ type: 'info', message: '已取消删除' });
			});
		},
		// checkbox选择项发生变化
		changeSelection(v) {
            this.configTable.selected = v.map(v => v.id);
		},
        // pageSize 改变时会触发
        changeTableSize( val ) {
            const self = this;

            self.configTable.params.pageSize = val;
            self.getTableData();
        },
        // currentPage 改变时会触发
        changeTableCurrent(val) {
            const self = this;

            self.configTable.params.pageNum = val;
            self.getTableData();
        },
		// 新增 / 编辑 - 数据
        tableAddEdit(v) {
            const self = this;

            self.configSaveEdit.show = true;
            self.configSaveEdit.title = v ? '修改字段' : '新增字段';
            self.configSaveEdit.conShow = false;
            console.log(v);
            if(v) {
                self.configSaveEdit.params.id = v.id;
                self.configSaveEdit.params.resourceName = v.resourceName;
                self.configSaveEdit.params.imageUrl = v.imageUrl;
                self.configSaveEdit.params.resourcePermission = v.resourcePermission;
                self.configSaveEdit.params.resourceRequestUrl = v.resourceRequestUrl;
                self.configSaveEdit.params.moduleDefaultUrl = v.moduleDefaultUrl;
                self.configSaveEdit.params.moduleReservedUrl = v.moduleReservedUrl;
                self.configSaveEdit.params.topResourceName = v.topResourceName;
            }
        },
        closeDialog() {
            const self = this;

            Object.assign(self.$data.configSaveEdit.params, self.$options.data.call(self).configSaveEdit.params);
            self.$refs['saveForm'].resetFields();
        },
        // 提交保存
        submit() {
            const self = this;

            self.$refs['saveForm'].validate(valid => {
               if(valid) {
                   if(self.configSaveEdit.title == '新增字段') {
                       delete self.configSaveEdit.params['id'];

                        self.$axios.post(self.configSaveEdit.urlSave, self.configSaveEdit.params).then((res) => {
                            if(res.status == 200) {
                                self.getTableData();
                            }
                            
                            self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
                        });
                   }else {
                        self.$axios.post(self.configSaveEdit.urlEdit, self.configSaveEdit.params).then((res) => {
                            if(res.status == 200) {
                                self.getTableData();
                            }
                            
                            self.$message({ type: res.status == 200 ? 'success' : 'error', message: res.message }); 
                        });
                   }

                    self.configSaveEdit.show = false;
               }
            })
        }
	}
}
</script>

<style lang="less">
    .jurisdiction-list-page {
        .el-form-item__label {
            width: 110px;
        }
        .reset-width {
            width: 220px;
        }
        .dialog {
            height: 400px;
            .con {
                width: 690px;
                height: 300px;
                margin: auto;
                padding: 50px 0 10px 0;
            }
        }
        .query-area {
            .main {
                height: 110px; overflow: hidden; font-size: 14px; color: #7e7e7e; padding: 35px 0 0 50px;
                .reset-form {
                    .el-form-item {
                        margin: 0 100px 0 60px;
                    }
                }
            }
        }
    }
</style>